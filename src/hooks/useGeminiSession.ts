import { useState, useRef, useEffect, useCallback } from "react";
import {
  Behavior,
  GoogleGenAI,
  Modality,
} from "@google/genai";
import { decode, decodeAudioData } from "@/utils/audio";
import { formatDateToDDMMYYYY } from "@/tools/getMarketData";
import { useLanguage } from "../context/LanguageContext";
import { handleGeminiToolCalls } from "@/utils/handleGeminiToolCalls";
import type { PreviousChats } from "@/types/tool_types";

interface SearchResult {
  uri: string;
  title: string;
}

interface UseGeminiSessionProps {
  apiKey: string;
  outputAudioContext: AudioContext | null;
  outputNode: GainNode | null;
  nextStartTimeRef: React.MutableRefObject<number>;
  updateStatus: (msg: string) => void;
  updateError: (msg: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  onMarketDataReceived: (data: any) => void;
  previousChats: PreviousChats;
  setLoading?: (loading: { active: boolean; toolName?: string }) => void;
  onRequestImageForDiagnosis?: (cb: (image: string) => void) => void;
}

interface GeminiSessionHook {
  session: any | null;
  resetSession: () => void;
  searchResults: SearchResult[];
}

export const useGeminiSession = ({
  apiKey,
  outputAudioContext,
  outputNode,
  nextStartTimeRef,
  updateStatus,
  updateError,
  setSearchResults,
  onMarketDataReceived,
  previousChats,
  setLoading,
  onRequestImageForDiagnosis,
}: UseGeminiSessionProps): GeminiSessionHook => {
  const { currentLanguage } = useLanguage();

  const clientRef = useRef<GoogleGenAI | null>(null);
  const sessionRef = useRef<any | null>(null);
  const hasInitializedRef = useRef(false); // 🔥 StrictMode protection
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const [currentSearchResults, setCurrentSearchResults] =
    useState<SearchResult[]>([]);

  const initSession = useCallback(async () => {
    if (
      hasInitializedRef.current ||
      !outputAudioContext ||
      !outputNode ||
      !apiKey
    ) {
      return;
    }

    hasInitializedRef.current = true;

    try {
      clientRef.current = new GoogleGenAI({ apiKey });

      const session = await clientRef.current.live.connect({
        model: "gemini-live-2.5-flash-preview",
        callbacks: {
          onopen: () => {
            updateStatus("Session Opened");
          },

          onmessage: async (message: any) => {
            const modelTurn = message.serverContent?.modelTurn;
            const toolCall = message.toolCall;
            const thoughtSignature =
              message.serverContent?.thoughtSignature;

            // Handle tool calls safely
            if (toolCall) {
              const functionResponses = await handleGeminiToolCalls({
                toolCall,
                setLoading,
                onMarketDataReceived,
                onRequestImageForDiagnosis,
                previousChats,
                currentLanguage,
              });

              await sessionRef.current?.sendToolResponse({
                functionResponses,
                thoughtSignature,
              });

              return;
            }

            // Handle audio playback
            const audio = modelTurn?.parts?.[0]?.inlineData;
            if (audio && outputAudioContext) {
              nextStartTimeRef.current = Math.max(
                nextStartTimeRef.current,
                outputAudioContext.currentTime
              );

              const audioBuffer = await decodeAudioData(
                decode(audio.data),
                outputAudioContext,
                24000,
                1
              );

              const source = outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;

              sourcesRef.current.add(source);
              source.addEventListener("ended", () => {
                sourcesRef.current.delete(source);
              });
            }
          },

          onerror: (e: ErrorEvent) => {
            updateError(e.message);
          },

          onclose: (e: CloseEvent) => {
            console.log("Session closed:", e.reason);
            updateStatus("Session closed");
          },
        },

        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: {
            parts: [
              {
                text: `You are Kisan Mitra.
Today's date: ${formatDateToDDMMYYYY(new Date())}
Always respond in ${currentLanguage}.
Keep responses short and practical.`,
              },
            ],
          },
        },
      });

      sessionRef.current = session;
    } catch (error: any) {
      console.error("Session error:", error);
      updateError(error.message);
    }
  }, [
    apiKey,
    outputAudioContext,
    outputNode,
    updateStatus,
    updateError,
    onMarketDataReceived,
    previousChats,
    currentLanguage,
    setLoading,
    onRequestImageForDiagnosis,
  ]);

  useEffect(() => {
    if (!hasInitializedRef.current) {
      initSession();
    }

    return () => {
      // 🔥 DO NOT close in development (StrictMode safety)
      if (process.env.NODE_ENV === "production") {
        sessionRef.current?.close();
      }
    };
  }, [initSession]);

  const resetSession = useCallback(() => {
    sessionRef.current?.close();
    sessionRef.current = null;
    hasInitializedRef.current = false;
    updateStatus("Reinitializing session...");
    initSession();
  }, [initSession, updateStatus]);

  useEffect(() => {
    setSearchResults(currentSearchResults);
  }, [currentSearchResults, setSearchResults]);

  return {
    session: sessionRef.current,
    resetSession,
    searchResults: currentSearchResults,
  };
};
