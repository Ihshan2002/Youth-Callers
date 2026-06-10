"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Mic, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden pt-24 pb-20 px-4 min-h-[90vh] flex flex-col justify-center">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[600px] bg-[var(--color-emerald-accent)] opacity-[0.15] dark:opacity-20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[var(--color-gold)] opacity-10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-emerald-border)] bg-[var(--color-emerald-accent)]/10 text-[var(--color-emerald-accent)] text-sm font-bold tracking-wide mb-10 mx-auto"
          >
            <Shield className="w-4 h-4" />
            <span>100% Anonymous & Secure</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
            className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-[var(--color-foreground)] mb-8 leading-[1.1]"
          >
            Seek Knowledge. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-emerald-accent)] to-[var(--color-gold)]">Without Compromise.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto mb-14 font-medium leading-relaxed"
          >
            A secure space for youth to ask real questions, share concerns, and receive verified guidance completely anonymously.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 w-full"
          >
            <motion.div whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link 
                href="/submit"
                className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-[var(--color-emerald-accent)] text-white dark:text-black font-black text-lg flex items-center justify-center gap-3 transition-all shadow-[0_10px_40px_var(--color-emerald-border)] hover:shadow-[0_10px_60px_var(--color-emerald-border)]"
              >
                Submit a Query <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link 
                href="/solutions"
                className="w-full sm:w-auto px-8 py-5 rounded-2xl glass hover:bg-[var(--color-glass-hover)] text-[var(--color-foreground)] font-bold text-lg flex items-center justify-center transition-all"
              >
                View Verified Answers
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="w-full max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -5 }}
            className="glass-panel p-8 md:p-10 rounded-[2rem] col-span-1 md:col-span-2 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-emerald-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-emerald-accent)]/10 flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-[var(--color-emerald-accent)]" />
            </div>
            <h3 className="text-3xl font-black text-[var(--color-foreground)] mb-4">Absolute Anonymity</h3>
            <p className="text-slate-700 dark:text-slate-300 text-lg max-w-md leading-relaxed">Your identity is protected by end-to-end cryptographic tokens. We don't track IPs, we don't require logins, and we can't trace submissions back to you.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -5 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-8 md:p-10 rounded-[2rem] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-gold)]/10 flex items-center justify-center mb-6">
              <Mic className="w-8 h-8 text-[var(--color-gold)]" />
            </div>
            <h3 className="text-2xl font-black text-[var(--color-foreground)] mb-4">Voice Notes</h3>
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">Sometimes it's easier to speak. Record secure voice memos directly in the browser.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -5 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-8 md:p-10 rounded-[2rem] relative overflow-hidden group md:col-span-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-emerald-accent)]/5 to-[var(--color-gold)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex-1 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-emerald-accent)]/10 flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-[var(--color-emerald-accent)]" />
              </div>
              <h3 className="text-3xl font-black text-[var(--color-foreground)] mb-4">Verified by Trusted Scholars</h3>
              <p className="text-slate-700 dark:text-slate-300 text-lg max-w-2xl leading-relaxed">Every solution posted on our board goes through a rigorous review process by qualified individuals to ensure you receive authentic, reliable, and compassionate guidance.</p>
            </div>
            <div className="w-full md:w-auto relative z-10">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link href="/about" className="w-full text-center px-8 py-4 rounded-2xl border-2 border-[var(--color-emerald-border)] hover:bg-[var(--color-glass-hover)] text-[var(--color-foreground)] font-bold transition-colors inline-block text-lg">
                  Read our Manifesto
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
