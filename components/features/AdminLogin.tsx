"use client";

import { useState } from "react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    if (email === "scholor@youthcallers.com" && password === "youthcallers123") {
      onLogin();
    } else {
      setError("Invalid credentials. Please contact administration.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <header className="p-6 flex justify-end">
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Scholar Portal</h1>
            <p className="text-sm text-muted-foreground mt-2">Enter your credentials to access the Triage Engine.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md bg-background border border-border focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all text-sm"
                placeholder="scholor@youthcallers.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md bg-background border border-border focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-2.5 mt-2 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2",
                isLoading 
                  ? "bg-foreground/50 text-background cursor-not-allowed" 
                  : "bg-foreground text-background hover:bg-foreground/90"
              )}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Authenticating" : "Sign In"}
            </button>
          </form>
          
          <div className="mt-8 text-center border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">Secure Enterprise Access System &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
