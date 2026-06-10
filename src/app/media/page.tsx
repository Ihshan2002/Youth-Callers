"use client";

import { PlaySquare, Image as ImageIcon, Video } from "lucide-react";
import { motion } from "framer-motion";

export default function Media() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 mb-6">
          <PlaySquare className="w-8 h-8 text-[var(--color-gold)]" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-[var(--color-foreground)] mb-4 tracking-tight">Media & Reflections</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium">Daily Islamic reminders, Quran reflections, and beautiful moments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Placeholder for future media content */}
        {[1, 2, 3, 4].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel rounded-[2rem] overflow-hidden group cursor-pointer"
          >
            <div className="aspect-[4/5] bg-gradient-to-br from-[var(--color-emerald-accent)]/20 to-[var(--color-gold)]/20 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
              {i % 2 === 0 ? (
                <Video className="w-16 h-16 text-white/50 z-0" />
              ) : (
                <ImageIcon className="w-16 h-16 text-white/50 z-0" />
              )}
              
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20 translate-y-4 group-hover:translate-y-0 transition-transform">
                <h3 className="text-white font-bold text-xl mb-1">Daily Reflection #{i}</h3>
                <p className="text-slate-300 text-sm">Tap to view full resolution</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
