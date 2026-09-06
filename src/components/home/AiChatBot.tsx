"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, Send, X, Sparkles, Loader2, Bot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

import { useGetPublicCompanyBrandingQuery } from "@/redux/features/landing/landingApi";

interface Message {
  role: "user" | "model";
  text: string;
}

interface ChatSession {
  sessionId: string;
  startedAt: string;
  updatedAt: string;
  messages: { role: "user" | "model"; text: string; time: string }[];
  user?: { name: string; email: string } | null;
}

const CHAT_LOG_KEY = "rajseba_ai_chat_logs";
const MAX_SESSIONS = 100;

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sid = sessionStorage.getItem("rajseba_chat_session_id");
  if (!sid) {
    sid = `CS-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${Date.now()}`;
    sessionStorage.setItem("rajseba_chat_session_id", sid);
  }
  return sid;
}

function saveSessionLog(sessionId: string, messages: Message[], user?: any) {
  if (typeof window === "undefined") return;
  try {
    const existing: ChatSession[] = JSON.parse(localStorage.getItem(CHAT_LOG_KEY) || "[]");
    const idx = existing.findIndex((s) => s.sessionId === sessionId);
    const entry: ChatSession = {
      sessionId,
      startedAt: existing[idx]?.startedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: messages.map((m) => ({ role: m.role, text: m.text, time: new Date().toISOString() })),
      user: user ? { name: user.name || "Guest", email: user.email || "" } : null,
    };
    if (idx >= 0) existing[idx] = entry;
    else existing.unshift(entry);
    localStorage.setItem(CHAT_LOG_KEY, JSON.stringify(existing.slice(0, MAX_SESSIONS)));
  } catch { /* ignore */ }
}

export function AiChatBot() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: brandingRes } = useGetPublicCompanyBrandingQuery();
  const companyPhone = brandingRes?.data?.phone || "01813-333373";
  const cleanPhone = companyPhone.replace(/[^0-9+]/g, '');

  const isDashboard = pathname?.startsWith("/dashbord") || pathname?.startsWith("/dashboard");

  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(() =>
    typeof window !== "undefined" ? getOrCreateSessionId() : "server"
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I am your Rajseba AI Assistant. How can I help you with our home services today? (আপনি বাংলায়ও কথা বলতে পারেন।)",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const parseMessageText = (text: string) => {
    // Regex to match markdown links: [Label](url)
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const [_, label, url] = match;
      const matchIndex = match.index;

      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }

      const isInternal = url.startsWith("/");
      if (isInternal) {
        parts.push(
          <Link
            key={matchIndex}
            href={url}
            onClick={() => {
              setIsOpen(false);
            }}
            className="inline-flex items-center gap-1 bg-[#FF6014]/10 hover:bg-[#FF6014]/20 text-[#FF6014] px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all border border-[#FF6014]/20 hover:scale-[1.03] my-0.5 ml-1"
          >
            {label}
          </Link>
        );
      } else {
        parts.push(
          <a
            key={matchIndex}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-[#FF6014]/10 hover:bg-[#FF6014]/20 text-[#FF6014] px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all border border-[#FF6014]/20 hover:scale-[1.03] my-0.5 ml-1"
          >
            {label}
          </a>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    const updatedMessages = [...messages, { role: "user" as const, text: userMessage }];

    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          user: isAuthenticated && user ? {
            name: user.name || "User",
            email: user.email || "",
            phone: user.phone || user.phoneNumber || "",
            role: user.role || "client",
          } : null
        }),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      const replyText = data.reply || "Sorry, I couldn't understand that. Please try again or call our hotline: 01813-333373.";

      const finalMessages = [...updatedMessages, { role: "model" as const, text: replyText }];
      setMessages(finalMessages);
      // 📊 Save to localStorage for admin AI Chat Log
      saveSessionLog(sessionId, finalMessages, isAuthenticated && user ? user : null);
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Oops! Something went wrong connecting to the AI assistant. Please contact us at 01813-333373.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isDashboard) return null;

  return (
    <>
      {/* Floating Action Button Group */}
      <div className="fixed bottom-[88px] right-3.5 md:bottom-10 md:right-8 z-[999] flex flex-col items-center gap-3">

        {/* 📞 Call Option (Above) */}
        {!isOpen && (
          <motion.a
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            whileHover={{
              scale: 1.1,
              rotate: 8,
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.35)"
            }}
            whileTap={{ scale: 0.9 }}
            href={`tel:${cleanPhone}`}
            className="group relative w-11 h-11 md:w-14 md:h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg shadow-black/20 cursor-pointer hover:bg-black transition-all duration-300 border border-white/20"
            aria-label={`Call Support ${companyPhone}`}
          >
            <Phone className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 text-amber-400" />

            {/* Tooltip */}
            <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900/95 backdrop-blur-xs text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg border border-slate-800/50 translate-x-2 group-hover:translate-x-0">
              Call Hotline: {companyPhone}
            </span>
          </motion.a>
        )}

        {/* 💬 Main AI Assistant Toggle Button (Middle) */}
        <div className="relative flex items-center justify-center group">
          {/* Breathing aura glow */}
          <motion.span
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 0.1, 0.6],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-11 h-11 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-[#FF6014] to-[#FF7C71] blur-md pointer-events-none z-[-1]"
          />

          <motion.button
            whileHover={{
              scale: 1.1,
              rotate: -8,
              boxShadow: "0 14px 32px rgba(255, 96, 20, 0.45)"
            }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(!isOpen)}
            className="w-11 h-11 md:w-14 md:h-14 bg-gradient-to-r from-[#FF6014] to-[#FF7C71] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#FF6014]/25 cursor-pointer relative overflow-hidden transition-all duration-300 border border-white/30"
            aria-label="AI Assistant"
          >
            {/* Shimmer sweep effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? "open" : "closed"}
                className="flex items-center justify-center"
                initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                {isOpen ? (
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 md:w-4 md:h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse z-10 pointer-events-none" />
          )}

          {/* Tooltip */}
          {!isOpen && (
            <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900/95 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1.5 rounded-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg border border-slate-800/50 translate-x-2 group-hover:translate-x-0">
              AI Assistant
            </span>
          )}
        </div>

      </div>

      {/* Chat Window / Floating Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-0 md:block pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 380, damping: 25 }}
              className="pointer-events-auto w-full max-w-[380px] h-[78vh] max-h-[560px] md:h-[500px] md:fixed md:bottom-28 md:right-8 md:inset-auto bg-white rounded-[28px] md:rounded-3xl border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden"
            >
              {/* Mobile Drawer Handle / Indicator */}
              <div className="md:hidden w-full flex justify-center pt-2.5 pb-1 bg-gradient-to-r from-[#FF6014] to-[#FF7C71]">
                <div className="w-12 h-1 bg-white/40 rounded-full" />
              </div>

              {/* Header */}
              <div className="bg-gradient-to-r from-[#FF6014] to-[#FF7C71] px-5 py-3.5 text-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xs">
                    <Bot size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base flex items-center gap-1.5 leading-none">
                      Rajseba AI Assistant
                      <Sparkles size={14} className="text-amber-200 animate-pulse" />
                    </h3>
                    <p className="text-[11px] text-white/90 font-bold flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                      Online & Ready
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition cursor-pointer"
                  aria-label="Close Chat"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Message Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-3.5 bg-[#FFF9F6]/50 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-[22px] p-3.5 md:p-4 text-xs sm:text-sm font-semibold leading-relaxed shadow-2xs whitespace-pre-wrap ${msg.role === "user"
                        ? "bg-[#FF6014] text-white rounded-tr-none"
                        : "bg-white text-slate-800 border border-slate-200/60 rounded-tl-none shadow-sm"
                        }`}
                    >
                      {parseMessageText(msg.text)}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200/60 rounded-[22px] rounded-tl-none p-3.5 flex items-center gap-2 shadow-2xs">
                      <Loader2 size={14} className="animate-spin text-[#FF6014]" />
                      <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">AI is typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3.5 border-t border-slate-100 bg-white pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2 bg-slate-50/90 border border-slate-200 rounded-2xl p-1.5 pr-2 focus-within:bg-white focus-within:border-[#FF6014]/40 focus-within:ring-4 focus-within:ring-[#FFF4EE] transition-all"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask AI anything about home services..."
                    className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none px-3 py-1.5"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="w-9 h-9 rounded-xl bg-[#FF6014] hover:bg-[#E0530A] text-white flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-sm"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
