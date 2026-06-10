"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Shield, Home, Info, MessageSquare, BookOpen, PlaySquare } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
  { name: "Submit", href: "/submit", icon: MessageSquare },
  { name: "Solutions", href: "/solutions", icon: BookOpen },
  { name: "Media", href: "/media", icon: PlaySquare },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-[var(--color-emerald-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Shield className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="font-bold text-xl tracking-tight group-hover:text-emerald-500 transition-colors">
              Youth Callers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                    isActive 
                      ? "bg-emerald-500/10 text-[var(--color-emerald-accent)] border border-[var(--color-emerald-border)] shadow-sm" 
                      : "text-gray-500 dark:text-gray-400 hover:text-[var(--color-foreground)] hover:bg-[var(--color-glass-hover)]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
            
            <div className="ml-4 pl-4 border-l border-[var(--color-emerald-border)]">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
