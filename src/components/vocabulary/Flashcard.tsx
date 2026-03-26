"use client";

import { useState } from "react";
import { Volume2, Bookmark, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  word: string;
  translation: string;
  example: string;
  onKnown?: () => void;
  onUnknown?: () => void;
}

export function Flashcard({ word, translation, example, onKnown, onUnknown }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="group h-[500px] w-full max-w-[400px] [perspective:2000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={cn(
        "relative h-full w-full rounded-3xl transition-all duration-700 [transform-style:preserve-3d] shadow-2xl",
        isFlipped ? "[transform:rotateY(180deg)]" : ""
      )}>
        {/* Front Side */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-white border-4 border-indigo-100 rounded-3xl [backface-visibility:hidden] hover:bg-slate-50 transition-colors">
          <div className="absolute top-6 right-6 flex space-x-3">
            <button className="p-3 bg-slate-100 rounded-xl hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 transition-colors">
              <Volume2 className="w-6 h-6" />
            </button>
            <button className="p-3 bg-slate-100 rounded-xl hover:bg-orange-100 text-slate-400 hover:text-orange-600 transition-colors">
              <Bookmark className="w-6 h-6" />
            </button>
          </div>
          <h2 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">{word}</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm">Click to flip</p>
          <div className="mt-auto w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-1/3 rounded-full" />
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-indigo-600 border-4 border-indigo-400 rounded-3xl [backface-visibility:hidden] [transform:rotateY(180deg)] text-white shadow-inner">
          <h3 className="text-5xl font-black mb-8 tracking-tight">{translation}</h3>
          <div className="bg-indigo-700/50 p-6 rounded-2xl border border-indigo-400/30 backdrop-blur-sm">
            <p className="italic text-indigo-100 text-xl text-center leading-relaxed">
              &quot;{example}&quot;
            </p>
          </div>
          <div className="mt-12 flex space-x-6 w-full">
            <button
              onClick={(e) => { e.stopPropagation(); onUnknown?.(); }}
              className="flex-1 bg-red-500/20 hover:bg-red-500 border-2 border-red-500/50 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center space-x-3 group/btn"
            >
              <X className="w-6 h-6 group-hover/btn:scale-125 transition-transform" /> <span>Forgot</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onKnown?.(); }}
              className="flex-1 bg-green-500/20 hover:bg-green-500 border-2 border-green-500/50 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center space-x-3 group/btn"
            >
              <Check className="w-6 h-6 group-hover/btn:scale-125 transition-transform" /> <span>Know it</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
