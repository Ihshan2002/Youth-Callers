"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
  onAudioReady: (blob: Blob) => void;
  className?: string;
}

export function AudioRecorder({ onAudioReady, className }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Setup Web Audio API for visualizer
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        onAudioReady(blob);
        
        // Cleanup stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      drawVisualizer();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access is required to record audio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    }
  };

  const clearAudio = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Gen Z aesthetic gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, "#4f46e5"); // indigo-600
        gradient.addColorStop(1, "#2dd4bf"); // teal-400

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight, barWidth - 2, barHeight, 4);
        ctx.fill();

        x += barWidth + 2;
      }
    };
    draw();
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className={cn("flex flex-col items-center gap-4 w-full", className)}>
      {!audioUrl ? (
        <div className="relative flex flex-col items-center justify-center w-full min-h-[120px] rounded-2xl bg-card border border-border overflow-hidden">
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={80}
                  className="w-full h-full px-4"
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(
              "relative z-10 flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 shadow-xl",
              isRecording 
                ? "bg-rose-500 hover:bg-rose-600 animate-pulse" 
                : "bg-primary hover:bg-primary/90 hover:scale-105"
            )}
          >
            {isRecording ? (
              <Square className="w-6 h-6 text-white fill-current" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>
          
          {isRecording && (
            <div className="absolute bottom-2 text-xs font-mono text-rose-500 animate-pulse">
              Recording...
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center w-full gap-3 p-3 rounded-2xl bg-card border border-border shadow-sm"
        >
          <audio src={audioUrl} controls className="flex-1 h-10 w-full rounded-lg" />
          <button
            onClick={clearAudio}
            className="p-2 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Delete Recording"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
