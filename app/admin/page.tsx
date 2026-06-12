"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminLogin } from "@/components/features/AdminLogin";
import { ReplyComposer, type ReplyPayload } from "@/components/features/ReplyComposer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit3,
  FileText,
  Filter,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  Mic,
  RefreshCw,
  ShieldAlert,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
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
  user_id: string;
  nickname: string;
  text_content: string | null;
  audio_url: string | null;
  status: "pending" | "answered" | "rejected";
  created_at: string;
  solutions: Solution[];
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    typeof window !== "undefined" && sessionStorage.getItem("admin_auth") === "true"
  );
  const [isLoadingAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "answered">("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [scholarName, setScholarName] = useState(() =>
    typeof window !== "undefined"
      ? sessionStorage.getItem("admin_name") || "Youth Callers Scholar"
      : "Youth Callers Scholar"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [editingSolutionId, setEditingSolutionId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccessId, setEditSuccessId] = useState<string | null>(null);
  const [deletingSolutionId, setDeletingSolutionId] = useState<string | null>(null);

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
    if (!isAuthenticated) return;
    void Promise.resolve().then(fetchProblems);
  }, [fetchProblems, isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_name");
    setIsAuthenticated(false);
  };

  const handleLoginSuccess = (name: string) => {
    sessionStorage.setItem("admin_auth", "true");
    sessionStorage.setItem("admin_name", name);
    setScholarName(name);
    setIsAuthenticated(true);
    fetchProblems();
  };

  const appendReplyPayload = (formData: FormData, payload: ReplyPayload) => {
    if (payload.textContent.trim()) {
      formData.append("textContent", payload.textContent.trim());
    }
    if (payload.audioBlob) {
      formData.append("audio", payload.audioBlob, "scholar-response.webm");
    } else if (payload.audioFile) {
      formData.append("audio", payload.audioFile, payload.audioFile.name);
    }
    formData.append("removeAudio", String(payload.removeAudio));
  };

  const handleSubmitResponse = async (problemId: string, userId: string, payload: ReplyPayload) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const formData = new FormData();
      formData.append("problemId", problemId);
      formData.append("userId", userId);
      formData.append("scholarName", scholarName);
      appendReplyPayload(formData, payload);

      const res = await fetch("/api/admin/respond", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 1500);
        await fetchProblems();
        return true;
      }
      setSubmitError(result.error || "Failed to submit response. Check Supabase RLS policies.");
      return false;
    } catch {
      setSubmitError("Network error. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateResponse = async (solutionId: string, problemId: string, payload: ReplyPayload) => {
    setIsSubmitting(true);
    setEditError(null);
    setEditSuccessId(null);
    try {
      const formData = new FormData();
      formData.append("solutionId", solutionId);
      formData.append("problemId", problemId);
      formData.append("scholarName", scholarName);
      appendReplyPayload(formData, payload);

      const res = await fetch("/api/admin/respond", {
        method: "PATCH",
        body: formData,
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setEditingSolutionId(null);
        setEditSuccessId(solutionId);
        setTimeout(() => setEditSuccessId(null), 1500);
        await fetchProblems();
        return true;
      }
      setEditError(result.error || "Failed to update response.");
      return false;
    } catch {
      setEditError("Network error. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResponse = async (solutionId: string, problemId: string) => {
    if (!window.confirm("Delete this scholar reply?")) return;
    setDeletingSolutionId(solutionId);
    setEditError(null);
    try {
      const res = await fetch("/api/admin/respond", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solutionId, problemId }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setEditError(result.error || "Failed to delete response.");
        return;
      }
      if (editingSolutionId === solutionId) setEditingSolutionId(null);
      await fetchProblems();
    } catch {
      setEditError("Network error. Please try again.");
    } finally {
      setDeletingSolutionId(null);
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

      <main className="flex-1 flex flex-col h-auto md:h-screen overflow-hidden bg-background">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold">Triage Engine</h1>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
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
            <span className="text-xs font-medium text-muted-foreground hidden sm:block">{scholarName}</span>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex">
          <div
            className={cn(
              "w-full xl:w-[380px] flex-col border-r border-border bg-card/30 shrink-0",
              selectedProblem ? "hidden xl:flex" : "flex"
            )}
          >
            <div className="p-3 border-b border-border flex flex-col gap-3 shrink-0">
              <div className="flex p-1 bg-border/40 rounded-lg">
                <button
                  onClick={() => {
                    setActiveTab("pending");
                    setSelectedId(null);
                  }}
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
                  onClick={() => {
                    setActiveTab("answered");
                    setSelectedId(null);
                  }}
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
                <button className="hover:text-foreground transition-colors" title="Filter">
                  <Filter className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {fetchError ? (
                <div className="p-6 flex flex-col items-center gap-3 text-center">
                  <AlertCircle className="w-8 h-8 text-destructive opacity-60" />
                  <p className="text-sm text-destructive font-medium">{fetchError}</p>
                  <button onClick={fetchProblems} className="text-xs text-muted-foreground hover:text-foreground underline">
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
                      selectedId === sub.id ? "bg-border/50 border-l-2 border-l-foreground" : "hover:bg-border/20"
                    )}
                    onClick={() => {
                      setSelectedId(sub.id);
                      setSubmitError(null);
                      setSubmitSuccess(false);
                      setEditError(null);
                      setEditingSolutionId(null);
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm text-foreground truncate max-w-[140px]">
                        {sub.nickname || "Anonymous"}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                        {new Date(sub.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}{" "}
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
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded-sm",
                          sub.status === "pending"
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        )}
                      >
                        {sub.status === "pending" ? "Pending" : "Answered"}
                      </span>
                      {sub.solutions.length > 0 && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-border/60 text-muted-foreground">
                          {sub.solutions.length} repl{sub.solutions.length === 1 ? "y" : "ies"}
                        </span>
                      )}
                      <ChevronRight className="w-3 h-3 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={cn("flex-1 flex-col bg-background", selectedProblem ? "flex" : "hidden xl:flex")}>
            {selectedProblem ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between shrink-0 bg-card/30">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-base font-semibold tracking-tight text-foreground">
                        Query #{selectedProblem.id.split("-")[0].toUpperCase()}
                      </h2>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                          selectedProblem.status === "pending"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                        )}
                      >
                        {selectedProblem.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Submitted by <span className="font-medium text-foreground">{selectedProblem.nickname || "Anonymous"}</span>
                      {" - "}
                      {new Date(selectedProblem.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="p-2 rounded-md hover:bg-border/50 text-muted-foreground transition-colors"
                    title="Close"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                        Original Query
                      </p>
                      <div className="p-4 rounded-lg border border-border bg-card text-sm text-foreground leading-relaxed">
                        {selectedProblem.text_content ? (
                          <p className="whitespace-pre-wrap">{selectedProblem.text_content}</p>
                        ) : (
                          <p className="italic text-muted-foreground text-xs">No text - audio only</p>
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

                    {selectedProblem.solutions.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Scholar Response{selectedProblem.solutions.length > 1 ? "s" : ""}
                        </p>
                        <div className="flex flex-col gap-3">
                          {selectedProblem.solutions.map((sol, idx) => (
                            <div key={sol.id} className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                              {editingSolutionId === sol.id ? (
                                <ReplyComposer
                                  mode="edit"
                                  title={`Edit response #${idx + 1}`}
                                  placeholder="Update this response..."
                                  submitLabel="Save response"
                                  busyLabel="Saving..."
                                  initialText={sol.text_content}
                                  existingAudioUrl={sol.audio_url}
                                  isSubmitting={isSubmitting}
                                  errorMessage={editError}
                                  onCancel={() => {
                                    setEditingSolutionId(null);
                                    setEditError(null);
                                  }}
                                  onSubmit={(payload) => handleUpdateResponse(sol.id, selectedProblem.id, payload)}
                                />
                              ) : (
                                <>
                                  <div className="flex justify-between items-start gap-3 mb-3">
                                    <div>
                                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                                        Response #{idx + 1} by {sol.scholar_name || "Youth Callers Scholar"}
                                      </span>
                                      <p className="text-[10px] text-muted-foreground mt-0.5">
                                        {new Date(sol.created_at).toLocaleString()}
                                        {sol.updated_at && sol.updated_at !== sol.created_at ? " - edited" : ""}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingSolutionId(sol.id);
                                          setEditError(null);
                                        }}
                                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/70 transition-colors"
                                        title="Edit response"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteResponse(sol.id, selectedProblem.id)}
                                        disabled={deletingSolutionId === sol.id}
                                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
                                        title="Delete response"
                                      >
                                        {deletingSolutionId === sol.id ? (
                                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                          <Trash2 className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  {editSuccessId === sol.id && (
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-2 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> Response updated.
                                    </p>
                                  )}
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
                                      <audio controls className="w-full h-9" src={sol.audio_url} />
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                        {editError && !editingSolutionId && (
                          <p className="text-xs text-destructive font-medium mt-3 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {editError}
                          </p>
                        )}
                      </div>
                    )}

                    <ReplyComposer
                      mode="create"
                      title={selectedProblem.status === "pending" ? "Craft Scholar Response" : "Add Additional Response"}
                      placeholder={
                        selectedProblem.status === "pending"
                          ? "Write your scholarly response here..."
                          : "Add a follow-up response if needed..."
                      }
                      submitLabel="Send response"
                      busyLabel="Sending..."
                      isSubmitting={isSubmitting}
                      errorMessage={submitError}
                      successMessage={submitSuccess ? "Response sent to the user's Answers section." : null}
                      onSubmit={(payload) => handleSubmitResponse(selectedProblem.id, selectedProblem.user_id, payload)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                <div className="w-16 h-16 rounded-xl bg-border/40 flex items-center justify-center mb-4">
                  <LayoutDashboard className="w-7 h-7 opacity-30" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">No Query Selected</h3>
                <p className="text-xs max-w-xs">Select a query from the queue on the left to review and respond.</p>
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
