import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ArrowLeft, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function MediaBoard() {
  // Mock long-form media entry
  const mediaDetails = {
    title: "Understanding Divine Decree (Qadar) in Times of Hardship",
    date: "June 12, 2026",
    duration: "45:20",
    audioSrc: "/mock-longform.webm" // Normally this comes from Supabase Storage
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center">
      <header className="w-full max-w-4xl p-6 flex justify-between items-center mb-12 lg:mb-24">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
        <ThemeToggle />
      </header>

      <article className="w-full max-w-3xl px-6 flex flex-col gap-12">
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4 text-sm font-medium text-muted-foreground uppercase tracking-widest">
            <span>{mediaDetails.date}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <span>Deep Dive</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1] text-foreground">
            {mediaDetails.title}
          </h1>
        </div>

        {/* Ultra-minimalist audio player */}
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
              <PlayCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Full Lecture Recording</h3>
              <p className="text-muted-foreground font-mono text-sm mt-1">{mediaDetails.duration}</p>
            </div>
          </div>
          
          {/* Native audio streaming container */}
          <div className="w-full bg-background rounded-xl p-2 border border-border">
            <audio 
              controls 
              className="w-full h-12"
              src={mediaDetails.audioSrc}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </article>
    </main>
  );
}
