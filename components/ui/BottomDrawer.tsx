"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X } from "lucide-react";

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BottomDrawer({ isOpen, onClose, children, title }: BottomDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto max-h-[90vh] flex-col rounded-t-xl border-t border-border bg-background shadow-2xl"
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                onClose();
              }
            }}
          >
            <div className="flex flex-col p-6 border-b border-border bg-background rounded-t-xl shrink-0">
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-border" />
              {title && (
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-md hover:bg-border/50 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="overflow-y-auto overflow-x-hidden p-6 pb-8 bg-background">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
