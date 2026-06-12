"use client";

import { useEffect, useId, useState } from "react";
import { AudioRecorder } from "./AudioRecorder";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mic,
  Send,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ReplyPayload = {
  textContent: string;
  audioBlob: Blob | null;
  audioFile: File | null;
  removeAudio: boolean;
};

type ReplyComposerProps = {
  mode: "create" | "edit";
  initialText?: string | null;
  existingAudioUrl?: string | null;
  title: string;
  placeholder: string;
  submitLabel: string;
  busyLabel: string;
  successMessage?: string | null;
  errorMessage?: string | null;
  isSubmitting: boolean;
  onSubmit: (payload: ReplyPayload) => Promise<boolean>;
  onCancel?: () => void;
  className?: string;
};

export function ReplyComposer({
  mode,
  initialText = "",
  existingAudioUrl = null,
  title,
  placeholder,
  submitLabel,
  busyLabel,
  successMessage,
  errorMessage,
  isSubmitting,
  onSubmit,
  onCancel,
  className,
}: ReplyComposerProps) {
  const uploadInputId = useId();
  const [textContent, setTextContent] = useState(initialText || "");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);
  const [removeAudio, setRemoveAudio] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [recorderKey, setRecorderKey] = useState(0);

  useEffect(() => {
    return () => {
      if (uploadedAudioUrl) URL.revokeObjectURL(uploadedAudioUrl);
    };
  }, [uploadedAudioUrl]);

  const handleUpload = (file: File | null) => {
    if (uploadedAudioUrl) URL.revokeObjectURL(uploadedAudioUrl);
    setLocalError(null);
    setAudioFile(file);
    setUploadedAudioUrl(file ? URL.createObjectURL(file) : null);
    if (file) {
      setAudioBlob(null);
      setRemoveAudio(false);
      setRecorderKey((value) => value + 1);
    }
  };

  const handleRecordedAudio = (blob: Blob | null) => {
    setLocalError(null);
    setAudioBlob(blob);
    if (blob) {
      handleUpload(null);
      setRemoveAudio(false);
    }
  };

  const handleSubmit = async () => {
    const keepsExistingAudio = Boolean(existingAudioUrl && !removeAudio && !audioBlob && !audioFile);
    if (!textContent.trim() && !audioBlob && !audioFile && !keepsExistingAudio) {
      setLocalError("Add a text response or attach a voice note.");
      return;
    }

    setLocalError(null);
    const succeeded = await onSubmit({
      textContent,
      audioBlob,
      audioFile,
      removeAudio,
    });

    if (succeeded && mode === "create") {
      setTextContent("");
      setAudioBlob(null);
      handleUpload(null);
      setRemoveAudio(false);
      setRecorderKey((value) => value + 1);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-md hover:bg-border/50 text-muted-foreground transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="border border-border rounded-lg bg-background focus-within:ring-1 focus-within:ring-foreground/30 focus-within:border-foreground/50 transition-all overflow-hidden">
        <textarea
          placeholder={placeholder}
          value={textContent}
          onChange={(event) => setTextContent(event.target.value)}
          className="w-full px-4 py-3 bg-transparent outline-none min-h-[160px] resize-y text-sm text-foreground placeholder:text-muted-foreground/60"
        />

        <div className="px-4 py-4 border-t border-border bg-card/40 space-y-4">
          {existingAudioUrl && !audioFile && !audioBlob && !removeAudio && (
            <div className="p-3 rounded-md bg-border/30 border border-border">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Mic className="w-3 h-3" /> Current voice response
                </p>
                <button
                  type="button"
                  onClick={() => setRemoveAudio(true)}
                  className="p-1.5 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                  title="Remove voice response"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <audio controls className="w-full h-9" src={existingAudioUrl} />
            </div>
          )}

          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-start">
            <AudioRecorder key={recorderKey} onAudioReady={handleRecordedAudio} />

            <div className="flex flex-col gap-2">
              <input
                id={uploadInputId}
                type="file"
                accept="audio/*"
                className="sr-only"
                onChange={(event) => handleUpload(event.target.files?.[0] || null)}
              />
              <label
                htmlFor={uploadInputId}
                className="min-h-10 px-3 rounded-md border border-border bg-background hover:bg-border/30 text-xs font-semibold text-foreground transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload audio
              </label>
              {(audioFile || removeAudio) && (
                <button
                  type="button"
                  onClick={() => {
                    handleUpload(null);
                    setRemoveAudio(false);
                  }}
                  className="min-h-10 px-3 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-border/30 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {uploadedAudioUrl && (
            <div className="p-3 rounded-md bg-border/30 border border-border">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Upload className="w-3 h-3" /> Uploaded voice response
              </p>
              <audio controls className="w-full h-9" src={uploadedAudioUrl} />
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-5">
              {(localError || errorMessage) && (
                <p className="text-xs text-destructive font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {localError || errorMessage}
                </p>
              )}
              {successMessage && !localError && !errorMessage && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0" /> {successMessage}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-md bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2 shrink-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> {busyLabel}
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> {submitLabel}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
