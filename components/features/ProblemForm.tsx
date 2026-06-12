"use client";

import { useState } from "react";
import { AudioRecorder } from "./AudioRecorder";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { getAnonymousUserId } from "@/lib/user-session";

export function ProblemForm() {
  const [nickname, setNickname] = useState("");
  const [textContent, setTextContent] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent && !audioBlob) {
      setError("Please provide either a text description or an audio recording.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("nickname", nickname || "Anonymous");
    formData.append("user_id", getAnonymousUserId());
    if (textContent) formData.append("text_content", textContent);
    if (audioBlob) formData.append("audio", audioBlob, "recording.webm");

    try {
      const res = await fetch("/api/submit-problem", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit");
      setIsSuccess(true);
    } catch (err: any) {
      setError("System error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">Query Submitted</h3>
        <p className="text-sm text-muted-foreground max-w-sm">Your secure query has been forwarded to the triage engine.</p>
        <button 
          onClick={() => {
            setIsSuccess(false);
            setTextContent("");
            setAudioBlob(null);
          }}
          className="mt-6 px-4 py-2 rounded-md bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors text-sm"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Identifier (Optional)</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Anonymous"
          className="w-full px-3 py-2 rounded-md bg-background border border-border focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Query Details</label>
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Describe your situation securely..."
          className="w-full px-3 py-2 rounded-md bg-background border border-border focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all min-h-[120px] resize-y text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Audio Attachment</label>
        <AudioRecorder onAudioReady={setAudioBlob} />
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">{error}</p>}

      <div className="pt-2 border-t border-border mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full mt-4 py-2.5 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2",
            isSubmitting 
              ? "bg-foreground/50 text-background cursor-not-allowed" 
              : "bg-foreground text-background hover:bg-foreground/90"
          )}
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Processing" : "Submit Securely"}
        </button>
      </div>
    </form>
  );
}
