"use client";

import { useCallback, useEffect, useState } from "react";
import { getAnonymousUserId } from "@/lib/user-session";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BentoCard } from "@/components/ui/BentoCard";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  MessageSquare,
  Mic,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Solution = {
  id: string;
  text_content: string | null;
  audio_url: string | null;
  scholar_name: string | null;
  created_at: string;
  updated_at?: string | null;
};

type Problem = {
  id: string;
  nickname: string;
  text_content: string | null;
  audio_url: string | null;
  status: "pending" | "answered" | "rejected";
  created_at: string;
  solutions: Solution[];
};

export default function MyProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProblems = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    const userId = getAnonymousUserId();
    try {
      const res = await fetch(`/api/user/problems?userId=${encodeURIComponent(userId)}`);
      const result = await res.json();
      if (result.success) {
        setProblems(result.data || []);
      } else {
        setError("Could not load your queries. Please try again.");
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => fetchProblems());
  }, [fetchProblems]);

  const answeredCount = problems.filter((p) => p.status === "answered").length;
  const pendingCount = problems.filter((p) => p.status === "pending").length;

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-sm">My Queries</h1>
            <div className="w-px h-4 bg-border" />
            <button
              onClick={() => fetchProblems(true)}
              disabled={isRefreshing}
              className="p-1.5 rounded-md hover:bg-border/50 text-muted-foreground transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Submitted Queries</h2>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Track the status of your anonymous submissions and view responses from our scholars.
            Your identity remains completely private.
          </p>
        </div>

        {!isLoading && problems.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-border bg-card text-center">
              <p className="text-2xl font-bold text-foreground">{problems.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Total</p>
            </div>
            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Pending</p>
            </div>
            <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{answeredCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Answered</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading your queries...</p>
          </div>
        ) : error ? (
          <BentoCard className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <AlertCircle className="w-10 h-10 text-destructive opacity-60" />
            <p className="text-sm font-medium text-foreground">{error}</p>
            <button
              onClick={() => fetchProblems()}
              className="mt-2 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Try Again
            </button>
          </BentoCard>
        ) : problems.length === 0 ? (
          <BentoCard className="flex flex-col items-center justify-center py-16 text-center border-dashed">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-semibold text-foreground">No queries submitted yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Your submitted queries will appear here. Go back to the home page to submit one.
            </p>
            <Link
              href="/"
              className="mt-5 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Submit a Query
            </Link>
          </BentoCard>
        ) : (
          <div className="flex flex-col gap-5">
            {problems.map((problem) => (
              <BentoCard key={problem.id} className="flex flex-col overflow-hidden p-0">
                <div className="p-4 border-b border-border bg-card/50 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5",
                        problem.status === "answered"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                      )}
                    >
                      {problem.status === "answered" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {problem.status === "answered" ? "Answered" : "Pending Review"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(problem.created_at).toLocaleDateString([], {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-medium text-muted-foreground bg-border/50 px-2 py-0.5 rounded">
                    ID: {problem.id.split("-")[0].toUpperCase()}
                  </span>
                </div>

                <div className="p-5 flex flex-col gap-5">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      Your Query
                    </h4>
                    {problem.text_content ? (
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {problem.text_content}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Voice note only</p>
                    )}
                    {problem.audio_url && (
                      <div className="mt-3 p-3 bg-border/30 rounded-md">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Mic className="w-3 h-3" /> Voice Recording
                        </p>
                        <audio controls className="h-9 w-full max-w-xs" src={problem.audio_url} />
                      </div>
                    )}
                  </div>

                  {problem.solutions && problem.solutions.length > 0 ? (
                    <div className="border-t border-border pt-5">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3" />
                        Scholar Response{problem.solutions.length > 1 ? "s" : ""}
                      </h4>
                      <div className="flex flex-col gap-3">
                        {problem.solutions.map((sol, idx) => (
                          <div
                            key={sol.id}
                            className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
                          >
                            <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                              Response #{idx + 1} by {sol.scholar_name || "Youth Callers Scholar"}
                            </p>
                            <p className="text-[10px] text-muted-foreground mb-3">
                              {new Date(sol.created_at).toLocaleString()}
                              {sol.updated_at && sol.updated_at !== sol.created_at ? " - edited" : ""}
                            </p>
                            {sol.text_content && (
                              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                {sol.text_content}
                              </p>
                            )}
                            {sol.audio_url && (
                              <div className="mt-3 p-3 bg-background/70 rounded-md border border-emerald-500/10">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                                  <Mic className="w-3 h-3" /> Voice Response
                                </p>
                                <audio controls className="h-9 w-full max-w-xs" src={sol.audio_url} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : problem.status === "pending" ? (
                    <div className="border-t border-border pt-5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        Awaiting scholar response - usually within 24 hours
                      </div>
                    </div>
                  ) : null}
                </div>
              </BentoCard>
            ))}
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground/50">
          Your queries are tied to this device only. Clearing browser data will remove access.
        </p>
      </div>
    </main>
  );
}
