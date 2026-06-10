"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Shield, Loader2, CheckCircle2 } from "lucide-react";
import { submitAnonymousQuery } from "../actions";

export default function Submit() {
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitAnonymousQuery(query);
      if (result.success) {
        setSubmitted(true);
        setQuery("");
      } else {
        setError(result.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to the secure server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] py-12 px-4 w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[var(--color-emerald-accent)]/10 border border-[var(--color-emerald-border)] mb-6">
            <Shield className="w-8 h-8 text-[var(--color-emerald-accent)]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--color-foreground)] mb-4 tracking-tight">Speak your heart out.</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium">100% Anonymous. 100% Secure.</p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass p-10 rounded-[2rem] text-center border-[var(--color-emerald-accent)]/30"
            >
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                className="w-24 h-24 bg-[var(--color-emerald-accent)]/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-[var(--color-emerald-accent)]" />
              </motion.div>
              <h2 className="text-3xl font-black text-[var(--color-foreground)] mb-4">Message Secured.</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
                Your question has been encrypted and sent to our verified scholars. Please check the Solutions board soon.
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSubmitted(false)}
                className="px-8 py-4 bg-[var(--color-emerald-accent)]/10 hover:bg-[var(--color-emerald-accent)]/20 text-[var(--color-emerald-accent)] rounded-2xl font-bold transition-colors text-lg"
              >
                Send another message
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass p-2 rounded-[2.5rem] shadow-2xl relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-emerald-accent)]/20 to-[var(--color-gold)]/20 rounded-[2.5rem] blur-xl opacity-50 -z-10" />
              
              <form onSubmit={handleSubmit} className="bg-[var(--color-card)] rounded-[2rem] p-4 md:p-6 flex flex-col relative z-10">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type your thoughts, questions, or doubts here..."
                  className="w-full h-48 md:h-64 bg-transparent text-[var(--color-foreground)] placeholder-slate-500/70 text-xl md:text-2xl font-medium resize-none focus:outline-none p-4"
                  disabled={isSubmitting}
                />
                
                {error && (
                  <div className="mx-4 mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-medium">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between p-2 mt-4 bg-[var(--color-background)] rounded-full border border-[var(--color-emerald-border)]">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setIsRecording(!isRecording)}
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
                      isRecording 
                        ? "bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]" 
                        : "bg-[var(--color-card)] text-slate-500 hover:text-[var(--color-foreground)]"
                    )}
                  >
                    <Mic className="w-6 h-6" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    disabled={isSubmitting || !query.trim()}
                    className="h-14 px-8 rounded-full bg-[var(--color-emerald-accent)] text-white dark:text-black font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_var(--color-emerald-border)]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <span className="text-lg">Send</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
