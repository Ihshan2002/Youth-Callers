"use client";

import { useEffect, useState } from "react";
import { getVerifiedSolutions } from "../actions";
import { ShieldCheck, MessageSquare, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Solutions() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSolutions() {
      const data = await getVerifiedSolutions();
      setSolutions(data);
      setLoading(false);
    }
    fetchSolutions();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 w-full">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-emerald-accent)]/10 border border-[var(--color-emerald-border)] mb-6">
          <ShieldCheck className="w-8 h-8 text-[var(--color-emerald-accent)]" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-[var(--color-foreground)] mb-4 tracking-tight">Verified Solutions</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium">Guidance from our trusted scholars, completely anonymous.</p>
      </div>

      {loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel p-8 rounded-[2rem] animate-pulse">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : solutions.length === 0 ? (
        <div className="text-center py-20 glass rounded-[2rem]">
          <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">No solutions yet</h3>
          <p className="text-slate-500">Check back later for answers from our scholars.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {solutions.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item.id} 
              className="glass-panel rounded-[2.5rem] overflow-hidden"
            >
              {/* Question Section */}
              <div className="p-8 md:p-10 bg-[var(--color-card)] border-b border-[var(--color-emerald-border)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <span className="font-bold text-[var(--color-foreground)]">Anonymous User</span>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-foreground)] leading-snug">{item.query_text}</h3>
              </div>
              
              {/* Answer Section */}
              <div className="p-8 md:p-10 bg-gradient-to-br from-[var(--color-emerald-accent)]/5 to-[var(--color-gold)]/5 relative">
                <div className="absolute top-0 right-10 -translate-y-1/2">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-emerald-accent)] flex items-center justify-center shadow-lg border-4 border-[var(--color-card)]">
                    <ShieldCheck className="w-6 h-6 text-white dark:text-black" />
                  </div>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                  <p className="whitespace-pre-wrap leading-relaxed">{item.solution_text}</p>
                </div>
                
                {/* Interaction row */}
                <div className="mt-8 pt-6 border-t border-[var(--color-emerald-border)] flex items-center gap-6">
                  <motion.button whileTap={{ scale: 0.9 }} className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="font-medium text-sm">Helpful</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
