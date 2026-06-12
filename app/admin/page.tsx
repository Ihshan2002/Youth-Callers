"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLogin } from "@/components/features/AdminLogin";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { 
  Mic, CheckCircle2, LogOut, LayoutDashboard, 
  Users, ShieldAlert, Clock, MessageSquare,
  MoreVertical, Filter, Loader2, RefreshCw,
  FileText, AlertCircle, ChevronRight, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

type Solution = {
  id: string;
  text_content: string;
  created_at: string;
};

type Problem = {
  id: string;
  user_id: string;
  nickname: string;
  text_content: string | null;
  audio_url: string | null;
  status: "pending" | "answered" | "rejected";
  created_at: string;
  solutions: Solution[];
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "answered">("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [responseContent, setResponseContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchProblems = useCallback(async () => {
    setIsLoadingData(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/problems");
      const result = await res.json();
      if (result.success) {
        setProblems(result.data || []);
      } else {
        setFetchError("Failed to load queries. Check your Supabase RLS policies.");
      }
    } catch {
      setFetchError("Network error. Please check your connection.");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchProblems();
    }
    setIsLoadingAuth(false);
  }, [fetchProblems]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  const handleLoginSuccess = () => {
    sessionStorage.setItem("admin_auth", "true");
    setIsAuthenticated(true);
    fetchProblems();
  };

  const handleSubmitResponse = async (problemId: string, userId: string) => {
    if (!responseContent.trim()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const res = await fetch("/api/admin/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, textContent: responseContent, userId }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setSubmitSuccess(true);
        setResponseContent("");
        setTimeout(() => {
          setSubmitSuccess(false);
          setSelectedId(null);
        }, 1500);
        await fetchProblems();
      } else {
        setSubmitError(result.error || "Failed to submit response. Check Supabase RLS policies.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLoginSuccess} />;
  }

  const pendingProblems = problems.filter((p) => p.status === "pending");
  const answeredProblems = problems.filter((p) => p.status === "answered");
  const filteredProblems = activeTab === "pending" ? pendingProblems : answeredProblems;
  const selectedProblem = problems.find((p) => p.id === selectedId);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-card flex flex-col h-auto md:h-screen sticky top-0 shrink-0 z-10">
        <div className="h-14 px-4 flex items-center border-b border-border gap-2">
          <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-background" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Youth Callers Admin</span>
        </div>

        <div className="flex-1 py-4 flex flex-col gap-0.5 overflow-y-auto px-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">Workspace</p>
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-border/60 text-sm font-medium text-foreground w-full text-left">
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Triage Engine
          </button>
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-border/30 hover:text-foreground transition-colors w-full text-left opacity-50 cursor-not-allowed">
            <Users className="w-4 h-4 shrink-0" />
            Scholars Directory
          </button>
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-border/30 hover:text-foreground transition-colors w-full text-left opacity-50 cursor-not-allowed">
            <FileText className="w-4 h-4 shrink-0" />
            Reports
          </button>

          {/* Stats */}
          <div className="mt-6 mx-2 p-3 rounded-md bg-border/30 border border-border flex flex-col gap-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Live Stats</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-500" /> Pending
              </span>
              <span className="text-xs font-bold text-foreground">{pendingProblems.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Answered
              </span>
              <span className="text-xs font-bold text-foreground">{answeredProblems.length}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Theme</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-auto md:h-screen overflow-hidden bg-background">
        {/* Top Bar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold">Triage Engine</h1>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Operational
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchProblems}
              disabled={isLoadingData}
              className="p-2 rounded-md hover:bg-border/50 text-muted-foreground transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={cn("w-4 h-4", isLoadingData && "animate-spin")} />
            </button>
            <span className="text-xs font-medium text-muted-foreground hidden sm:block">
              scholor@youthcallers.com
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex">
          {/* Problem List Pane */}
          <div className="w-full xl:w-[380px] flex flex-col border-r border-border bg-card/30 shrink-0">
            <div className="p-3 border-b border-border flex flex-col gap-3 shrink-0">
              <div className="flex p-1 bg-border/40 rounded-lg">
                <button
                  onClick={() => { setActiveTab("pending"); setSelectedId(null); }}
                  className={cn(
                    "flex-1 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                    activeTab === "pending"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Pending
                  {pendingProblems.length > 0 && (
                    <span className="bg-amber-500/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-sm text-[10px] font-bold">
                      {pendingProblems.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => { setActiveTab("answered"); setSelectedId(null); }}
                  className={cn(
                    "flex-1 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                    activeTab === "answered"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Answered
                  {answeredProblems.length > 0 && (
                    <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-sm text-[10px] font-bold">
                      {answeredProblems.length}
                    </span>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
                <span>{activeTab === "pending" ? "Awaiting Scholar Response" : "Resolved Queries"}</span>
                <button className="hover:text-foreground transition-colors">
                  <Filter className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {fetchError ? (
                <div className="p-6 flex flex-col items-center gap-3 text-center">
                  <AlertCircle className="w-8 h-8 text-destructive opacity-60" />
                  <p className="text-sm text-destructive font-medium">{fetchError}</p>
                  <button
                    onClick={fetchProblems}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Try again
                  </button>
                </div>
              ) : isLoadingData ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : filteredProblems.length === 0 ? (
                <div className="p-10 text-center">
                  <MessageSquare className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-20" />
                  <p className="text-sm text-muted-foreground font-medium">
                    {activeTab === "pending" ? "No pending queries." : "No answered queries yet."}
                  </p>
                </div>
              ) : (
                filteredProblems.map((sub) => (
                  <div
                    key={sub.id}
                    className={cn(
                      "p-4 cursor-pointer border-b border-border transition-colors group relative",
                      selectedId === sub.id
                        ? "bg-border/50 border-l-2 border-l-foreground"
                        : "hover:bg-border/20"
                    )}
                    onClick={() => { setSelectedId(sub.id); setResponseContent(""); setSubmitError(null); setSubmitSuccess(false); }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm text-foreground truncate max-w-[140px]">
                        {sub.nickname || "Anonymous"}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                        {new Date(sub.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                        {" "}
                        {new Date(sub.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {sub.text_content ? (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{sub.text_content}</p>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                        <Mic className="w-3.5 h-3.5 text-primary" /> Voice note attached
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      {sub.status === "pending" ? (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-amber-500/10 text-amber-700 dark:text-amber-400">
                          Pending
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          Answered
                        </span>
                      )}
                      <ChevronRight className="w-3 h-3 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Detail / Response Pane */}
          <div className="hidden xl:flex flex-1 flex-col bg-background">
            {selectedProblem ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Problem Header */}
                <div className="p-6 border-b border-border flex items-center justify-between shrink-0 bg-card/30">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-base font-semibold tracking-tight text-foreground">
                        Query #{selectedProblem.id.split("-")[0].toUpperCase()}
                      </h2>
                      {selectedProblem.status === "pending" ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          PENDING
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          ANSWERED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Submitted by <span className="font-medium text-foreground">{selectedProblem.nickname || "Anonymous"}</span>
                      {" · "}
                      {new Date(selectedProblem.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="p-2 rounded-md hover:bg-border/50 text-muted-foreground transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="max-w-2xl mx-auto space-y-6">
                    {/* User Query */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                        Original Query
                      </p>
                      <div className="p-4 rounded-lg border border-border bg-card text-sm text-foreground leading-relaxed">
                        {selectedProblem.text_content ? (
                          <p className="whitespace-pre-wrap">{selectedProblem.text_content}</p>
                        ) : (
                          <p className="italic text-muted-foreground text-xs">No text — audio only</p>
                        )}
                        {selectedProblem.audio_url && (
                          <div className="mt-4 p-3 bg-border/30 rounded-md">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                              <Mic className="w-3 h-3" /> Voice Recording
                            </p>
                            <audio controls className="w-full h-9" src={selectedProblem.audio_url} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Existing Solutions (for answered queries) */}
                    {selectedProblem.solutions && selectedProblem.solutions.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Scholar Response{selectedProblem.solutions.length > 1 ? "s" : ""}
                        </p>
                        <div className="flex flex-col gap-3">
                          {selectedProblem.solutions.map((sol, idx) => (
                            <div key={sol.id} className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                                  Response #{idx + 1}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(sol.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                {sol.text_content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Response Editor — always visible for pending, optional for answered */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                        {selectedProblem.status === "pending" ? "Craft Scholar Response" : "Add Additional Response"}
                      </p>
                      <div className="border border-border rounded-lg bg-background focus-within:ring-1 focus-within:ring-foreground/30 focus-within:border-foreground/50 transition-all overflow-hidden">
                        <textarea
                          placeholder={
                            selectedProblem.status === "pending"
                              ? "Write your scholarly response here..."
                              : "Add a follow-up response if needed..."
                          }
                          value={responseContent}
                          onChange={(e) => setResponseContent(e.target.value)}
                          className="w-full px-4 py-3 bg-transparent outline-none min-h-[200px] resize-y text-sm text-foreground placeholder:text-muted-foreground/60"
                        />
                        <div className="px-4 py-3 border-t border-border bg-card/50 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            {submitError && (
                              <p className="text-xs text-destructive font-medium flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {submitError}
                              </p>
                            )}
                            {submitSuccess && (
                              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Response submitted!
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleSubmitResponse(selectedProblem.id, selectedProblem.user_id)}
                            disabled={isSubmitting || !responseContent.trim()}
                            className="px-5 py-2 rounded-md bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-40 flex items-center gap-2 shrink-0"
                          >
                            {isSubmitting ? (
                              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...</>
                            ) : (
                              <><MessageSquare className="w-3.5 h-3.5" /> Submit Response</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                <div className="w-16 h-16 rounded-xl bg-border/40 flex items-center justify-center mb-4">
                  <LayoutDashboard className="w-7 h-7 opacity-30" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">No Query Selected</h3>
                <p className="text-xs max-w-xs">
                  Select a query from the queue on the left to review and respond.
                </p>
                {pendingProblems.length > 0 && (
                  <div className="mt-6 px-4 py-2.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-700 dark:text-amber-400">
                    {pendingProblems.length} quer{pendingProblems.length > 1 ? "ies" : "y"} awaiting response
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
