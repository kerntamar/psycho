"use client";

import { useState } from "react";
import { Flashcard } from "@/components/vocabulary/Flashcard";
import { MemoryGame } from "@/components/vocabulary/MemoryGame";
import { TimedSprint } from "@/components/vocabulary/TimedSprint";
import { Book, LayoutGrid, Timer, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

const mockFlashcards = [
  { word: "Resilient", translation: "חסין", example: "He is resilient enough to overcome any obstacle." },
  { word: "Ambiguous", translation: "מעורפל", example: "The instructions were ambiguous and difficult to follow." },
  { word: "Pragmatic", translation: "מעשי", example: "She took a pragmatic approach to solve the problem." },
];

export default function VocabularyPage() {
  const [activeMode, setActiveMode] = useState<"flashcards" | "memory" | "sprint" | "trainer">("flashcards");
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Vocabulary Hub</h1>
          <p className="text-slate-500 mt-4 text-xl font-medium">Master thousands of words with adaptive learning.</p>
        </div>

        <div className="flex bg-slate-100 p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveMode("flashcards")}
            className={cn(
              "p-4 rounded-xl transition-all flex items-center space-x-2",
              activeMode === "flashcards" ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Book className="w-5 h-5" /> <span className="font-bold text-sm uppercase tracking-widest">Flashcards</span>
          </button>
          <button
            onClick={() => setActiveMode("memory")}
            className={cn(
              "p-4 rounded-xl transition-all flex items-center space-x-2",
              activeMode === "memory" ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <LayoutGrid className="w-5 h-5" /> <span className="font-bold text-sm uppercase tracking-widest">Memory</span>
          </button>
          <button
            onClick={() => setActiveMode("sprint")}
            className={cn(
              "p-4 rounded-xl transition-all flex items-center space-x-2",
              activeMode === "sprint" ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Timer className="w-5 h-5" /> <span className="font-bold text-sm uppercase tracking-widest">Sprint</span>
          </button>
          <button
            onClick={() => setActiveMode("trainer")}
            className={cn(
              "p-4 rounded-xl transition-all flex items-center space-x-2",
              activeMode === "trainer" ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <BrainCircuit className="w-5 h-5" /> <span className="font-bold text-sm uppercase tracking-widest">Adaptive</span>
          </button>
        </div>
      </header>

      <div className="mt-12">
        {activeMode === "flashcards" && (
          <div className="flex flex-col items-center">
            <Flashcard
              {...mockFlashcards[currentIndex]}
              onKnown={() => setCurrentIndex((currentIndex + 1) % mockFlashcards.length)}
              onUnknown={() => setCurrentIndex((currentIndex + 1) % mockFlashcards.length)}
            />
            <div className="mt-12 flex space-x-6 items-center">
               <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm">{currentIndex + 1} / {mockFlashcards.length}</span>
            </div>
          </div>
        )}

        {activeMode === "memory" && <MemoryGame />}
        {activeMode === "sprint" && <TimedSprint />}
        {activeMode === "trainer" && (
           <div className="text-center py-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
              <BrainCircuit className="w-16 h-16 text-indigo-400 mx-auto mb-8" />
              <h2 className="text-3xl font-black text-slate-800 mb-4">Adaptive Trainer</h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 text-lg">
                The trainer uses Spaced Repetition (SM-2) to focus on the words you struggle with most.
              </p>
              <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl active:scale-95">
                Start Session
              </button>
           </div>
        )}
      </div>
    </div>
  );
}
