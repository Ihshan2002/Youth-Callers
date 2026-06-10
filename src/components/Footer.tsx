import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-emerald-border)] bg-black/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-500" />
            <span className="font-semibold text-lg text-white">Youth Callers</span>
          </div>
          
          <div className="flex gap-8 text-sm text-gray-400">
            <Link href="/about" className="hover:text-emerald-400 transition-colors">About</Link>
            <Link href="/submit" className="hover:text-emerald-400 transition-colors">Submit Query</Link>
            <Link href="/solutions" className="hover:text-emerald-400 transition-colors">Solutions</Link>
          </div>
          
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Youth Callers. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
