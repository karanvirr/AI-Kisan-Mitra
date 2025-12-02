"use client";
import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface LanguageOption {
  label: string;
  code: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { label: "German (Germany)", code: "de-DE" },
  { label: "English (Australia)", code: "en-AU" },
  { label: "English (UK)", code: "en-GB" },
  { label: "English (India)", code: "en-IN" },
  { label: "English (US)", code: "en-US" },
  { label: "Spanish (US)", code: "es-US" },
  { label: "French (France)", code: "fr-FR" },
  { label: "Hindi (India)", code: "hi-IN" },
  { label: "Portuguese (Brazil)", code: "pt-BR" },
  { label: "Arabic (Generic)", code: "ar-XA" },
  { label: "Spanish (Spain)", code: "es-ES" },
  { label: "French (Canada)", code: "fr-CA" },
  { label: "Indonesian (Indonesia)", code: "id-ID" },
  { label: "Italian (Italy)", code: "it-IT" },
  { label: "Japanese (Japan)", code: "ja-JP" },
  { label: "Turkish (Turkey)", code: "tr-TR" },
  { label: "Vietnamese (Vietnam)", code: "vi-VN" },
  { label: "Bengali (India)", code: "bn-IN" },
  { label: "Gujarati (India)", code: "gu-IN" },
  { label: "Kannada (India)", code: "kn-IN" },
  { label: "Marathi (India)", code: "mr-IN" },
  { label: "Malayalam (India)", code: "ml-IN" },
  { label: "Tamil (India)", code: "ta-IN" },
  { label: "Telugu (India)", code: "te-IN" },
  { label: "Dutch (Netherlands)", code: "nl-NL" },
  { label: "Korean (South Korea)", code: "ko-KR" },
  { label: "Mandarin Chinese (China)", code: "cmn-CN" },
  { label: "Polish (Poland)", code: "pl-PL" },
  { label: "Russian (Russia)", code: "ru-RU" },
  { label: "Thai (Thailand)", code: "th-TH" },
];

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Try to persist language in localStorage for user experience
  const getInitialLanguage = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("kisanmitra_language");
      if (stored && LANGUAGE_OPTIONS.some((opt) => opt.code === stored))
        return stored;
    }
    return "hi-IN";
  };
  const [currentLanguage, setCurrentLanguageState] = useState<string>(
    getInitialLanguage()
  );

  const setCurrentLanguage = (lang: string) => {
    setCurrentLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("kisanmitra_language", lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
};
