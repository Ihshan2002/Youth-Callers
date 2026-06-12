"use client";

import { useState } from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { BottomDrawer } from "@/components/ui/BottomDrawer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ProblemForm } from "@/components/features/ProblemForm";
import { CheckCircle2, ChevronRight, Activity } from "lucide-react";

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-foreground/10">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-xl mx-auto items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            Youth Callers
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="/my-problems" 
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-80 transition-opacity"
            >
              My Problems
            </a>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <a 
              href="/admin" 
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Scholar Portal
            </a>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 container max-w-screen-md mx-auto px-6 py-12 flex flex-col gap-8">
        
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Seek guidance securely.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            A secure, anonymous channel to consult with qualified scholars on your personal challenges.
          </p>
          
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="mt-4 px-6 py-3 bg-foreground text-background font-medium rounded-md hover:bg-foreground/90 transition-colors inline-flex items-center gap-2 text-sm"
          >
            Submit a Query <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <BentoCard className="flex flex-col gap-3">
            <div className="w-8 h-8 rounded-md bg-border/50 flex items-center justify-center">
              <Activity className="w-4 h-4 text-foreground" />
            </div>
            <h3 className="font-semibold text-sm">System Status</h3>
            <p className="text-sm text-muted-foreground">Scholars are currently active. Average response time is within 24 hours.</p>
          </BentoCard>

          <BentoCard className="flex flex-col gap-3 bg-foreground text-background border-foreground">
            <div className="w-8 h-8 rounded-md bg-background/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-background" />
            </div>
            <h3 className="font-semibold text-sm">Daily Reflection</h3>
            <p className="text-sm opacity-80">"The most beloved of people according to Allah is he who brings most benefit to people..." — Tabarani</p>
          </BentoCard>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent Resolved Queries</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <BentoCard key={i} className="p-5 flex flex-col gap-3 hover:border-foreground/30 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-border text-muted-foreground">Anonymous</span>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
                <h3 className="font-medium text-sm text-foreground">How do I deal with constant anxiety about the future?</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Anxiety about the future is common. Remember that while we tie our camel, the outcome is ultimately with Allah...
                </p>
              </BentoCard>
            ))}
          </div>
        </div>
      </div>

      <BottomDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        title="Submit Anonymous Query"
      >
        <ProblemForm />
      </BottomDrawer>
    </main>
  );
}
