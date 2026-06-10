"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Info, MessageSquare, BookOpen, PlaySquare } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
  { name: "Submit", href: "/submit", icon: MessageSquare },
  { name: "Solutions", href: "/solutions", icon: BookOpen },
  { name: "Media", href: "/media", icon: PlaySquare },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-6 inset-x-4 z-50 flex items-center justify-center gap-3">
      <div className="glass px-2 py-3 rounded-full flex justify-around items-center shadow-2xl flex-1 max-w-sm">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className="relative flex flex-col items-center justify-center w-12 h-12"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 bg-emerald-500/20 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <Icon 
                className={cn(
                  "w-6 h-6 transition-colors relative z-10",
                  isActive ? "text-emerald-500" : "text-gray-500 dark:text-gray-400"
                )} 
              />
            </Link>
          );
        })}
      </div>
      
      {/* Theme Toggle beside the pill */}
      <div className="shrink-0 shadow-2xl rounded-full">
        <ThemeToggle />
      </div>
    </div>
  );
}
