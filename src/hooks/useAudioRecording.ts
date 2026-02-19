import { useState, useRef, useCallback } from "react";
import { createBlob } from "@/utils/audio";

interface UseAudioRecordingProps {
  inputAudioContext: AudioContext | null;
  inputNode: GainNode | null;
  session: any | null;
  updateStatus: (msg: string) => void;
  updateError: (msg: string) => void;
}

interface AudioRecordingHook {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

export const useAudioRecording = ({
  inputAudioContext,
  inputNode,
  session,
  updateStatus,
  updateError,
}: UseAudioRecordingProps): AudioRecordingHook => {
  const [isRecording, setIsRecording] = useState(false);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const scriptProcessorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const isRecordingRef = useRef(false);
  const hasStartedRef = useRef(false); // StrictMode protection

  // ✅ Safe Send Wrapper — guard against closed websockets and missing methods
  const safeSend = (pcmData: Float32Array) => {
    if (!session) return;

    // Ensure sendRealtimeInput exists
    if (typeof session.sendRealtimeInput !== "function") return;

    // If session exposes readyState (WebSocket-like), require OPEN
    try {
      const wsReadyState = (session as any).readyState ?? (session as any)?.socket?.readyState;
      if (typeof wsReadyState !== "undefined") {
        const OPEN = (globalThis as any).WebSocket ? (globalThis as any).WebSocket.OPEN : 1;
        if (wsReadyState !== OPEN) return;
      }

      const mediaBlob = createBlob(pcmData);

      try {
        session.sendRealtimeInput({ media: mediaBlob });
      } catch (err) {
        // If send fails, buffer the blob and start flush interval
        bufferRef.current.push(mediaBlob);
        startFlushInterval();
      }
    } catch (err) {
      // Defensive: swallow errors caused by closed/closing sockets and log for debugging
      console.warn("safeSend: failed to send (socket may be closed)", err);
    }
  };

  // Buffer + flush mechanism for robustness: store blobs when send fails and
  // periodically retry until delivered or recording stops.
  const bufferRef = useRef<Blob[]>([]);
  const flushIntervalRef = useRef<number | null>(null);

  const startFlushInterval = () => {
    if (flushIntervalRef.current) return;
    flushIntervalRef.current = window.setInterval(() => {
      if (!bufferRef.current.length) {
        // nothing to flush
        return;
      }

      if (!session || typeof session.sendRealtimeInput !== "function") return;

      try {
        // Try to flush all buffered blobs
        while (bufferRef.current.length) {
          const b = bufferRef.current[0];
          try {
            session.sendRealtimeInput({ media: b });
            bufferRef.current.shift();
          } catch (err) {
            // stop flushing if send fails
            break;
          }
        }
      } catch (err) {
        // ignore outer errors
      }
    }, 500);
  };

  const stopFlushInterval = () => {
    if (flushIntervalRef.current) {
      clearInterval(flushIntervalRef.current);
      flushIntervalRef.current = null;
    }
  };

  const startRecording = useCallback(async () => {
    if (
      hasStartedRef.current ||
      isRecording ||
      !inputAudioContext ||
      !inputNode ||
      !session
    ) {
      updateStatus("Recording already running or not ready.");
      return;
    }

    hasStartedRef.current = true;
    isRecordingRef.current = true;
    setIsRecording(true);

    try {
      await inputAudioContext.resume();

      updateStatus("Requesting microphone access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      mediaStreamRef.current = stream;

      const sourceNode =
        inputAudioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;
      sourceNode.connect(inputNode);

      const scriptProcessor =
        inputAudioContext.createScriptProcessor(256, 1, 1);
      scriptProcessorNodeRef.current = scriptProcessor;

      scriptProcessor.onaudioprocess = (event) => {
        if (!isRecordingRef.current) return;

        const pcmData = event.inputBuffer.getChannelData(0);
        safeSend(pcmData);
      };

      sourceNode.connect(scriptProcessor);
      scriptProcessor.connect(inputAudioContext.destination);

      updateStatus("🔴 Recording...");
    } catch (err: any) {
      console.error(err);
      updateError(err.message || "Microphone error");
      stopRecording();
    }
  }, [
    isRecording,
    inputAudioContext,
    inputNode,
    session,
    updateStatus,
    updateError,
  ]);

  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) return;

    updateStatus("Stopping recording...");

    isRecordingRef.current = false;
    hasStartedRef.current = false;
    setIsRecording(false);

    try {
      scriptProcessorNodeRef.current?.disconnect();
      sourceNodeRef.current?.disconnect();

      if (mediaStreamRef.current) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      scriptProcessorNodeRef.current = null;
      sourceNodeRef.current = null;
    } catch (err) {
      console.warn("Cleanup error:", err);
    }

    // Stop any pending flush attempts and clear buffer
    stopFlushInterval();
    bufferRef.current = [];

    updateStatus("Recording stopped.");
  }, [updateStatus]);

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
};

