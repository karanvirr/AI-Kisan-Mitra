"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Mic,
  Camera,
  Leaf,
  TrendingUp,
  FileText,
  Sparkles,
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Users,
  BarChart3,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [particlePositions, setParticlePositions] = useState<
    { left: string; top: string }[]
  >([]);

  // Generate particles ONLY after mount (prevents hydration error)
  useEffect(() => {
    const positions = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
    setParticlePositions(positions);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stats = [
    { label: "Languages Supported", value: "12+", icon: <Globe className="w-6 h-6" /> },
    { label: "Crop Diseases", value: "500+", icon: <Leaf className="w-6 h-6" /> },
    { label: "Market Data", value: "1000+", icon: <BarChart3 className="w-6 h-6" /> },
    { label: "Government Schemes", value: "200+", icon: <FileText className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white">

      {/* Floating Particles */}
      {particlePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400 rounded-full"
          style={pos}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + i * 0.2,
            repeat: Infinity,
          }}
        />
      ))}

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center transition-all ${
          isScrolled
            ? "backdrop-blur-lg bg-black/60"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center space-x-3">
          <Leaf className="w-8 h-8 text-emerald-400" />
          <h1 className="text-2xl font-bold">Kisan Mitra</h1>
        </div>

        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 hover:text-emerald-300">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="px-6 py-2 bg-emerald-500 rounded-xl hover:bg-emerald-400 transition">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/chat"
              className="px-6 py-2 bg-emerald-500 rounded-xl hover:bg-emerald-400 transition flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open Chat</span>
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center">
        <h2 className="text-6xl font-bold mb-6 text-emerald-300">
          AI for Modern Farming
        </h2>
        <p className="text-xl max-w-3xl mx-auto text-emerald-200/80 mb-10">
          Diagnose crop diseases, track market prices, and discover government
          schemes in your native language.
        </p>

        <SignedOut>
          <SignUpButton mode="modal">
            <button className="px-10 py-4 bg-emerald-500 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition">
              Start Your Journey
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <Link
            href="/chat"
            className="px-10 py-4 bg-emerald-500 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition"
          >
            Open AI Assistant
          </Link>
        </SignedIn>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="mb-4 text-emerald-400 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-emerald-200/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-emerald-300">
          Built with Advanced AI
        </h2>
        <p className="text-emerald-200/80">
          Powered by Google Vertex AI & Gemini to assist farmers with
          real-time, multilingual intelligence.
        </p>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-emerald-500/20 text-emerald-200/70">
        © 2025 Kisan Mitra. Built with ❤️ for Indian farmers.
      </footer>
    </div>
  );
}
