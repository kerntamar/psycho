"use client";

import { useState, useEffect, useRef } from "react";
import { Timer, Zap, Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Word {
  id: string;
  word: string;
  translation: string;
}

const mockWords: Word[] = [
  { id: "1", word: "Ambiguous", translation: "מעורפל" },
  { id: "2", word: "Benevolent", translation: "נדיב" },
  { id: "3", word: "Candor", translation: "כנות" },
  { id: "4", word: "Deference", translation: "כבוד" },
  { id: "5", word: "Enigma", translation: "חידה" },
];

export function TimedSprint() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [challengeTranslation, setChallengeTranslation] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startNewGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState("playing");
    nextChallenge();
  };

  const nextChallenge = () => {
    const word = mockWords[Math.floor(Math.random() * mockWords.length)];
    const shouldBeCorrect = Math.random() > 0.5;

    let translation = word.translation;
    if (!shouldBeCorrect) {
      let otherWord;
      do {
        otherWord = mockWords[Math.floor(Math.random() * mockWords.length)];
      } while (otherWord.id === word.id);
      translation = otherWord.translation;
    }

    setCurrentWord(word);
    setChallengeTranslation(translation);
    setIsCorrect(null);
  };

  const handleAnswer = (answer: boolean) => {
    const actualCorrect = currentWord?.translation === challengeTranslation;
    const correct = answer === actualCorrect;

    if (correct) {
      setScore(s => s + 10);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setTimeout(nextChallenge, 300);
  };

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState("finished");
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, timeLeft]);

  if (gameState === "idle") {
    return (
      <div className="text-center py-20 bg-indigo-600 rounded-[3rem] text-white shadow-2xl">
        <Zap className="w-20 h-20 mx-auto mb-8 animate-pulse text-yellow-400" />
        <h2 className="text-5xl font-black mb-6">Vocabulary Sprint</h2>
        <p className="text-indigo-100 text-xl mb-12 max-w-md mx-auto font-medium">
          60 seconds. Match as many words to their translations as you can. Ready?
        </p>
        <button
          onClick={startNewGame}
          className="bg-white text-indigo-600 px-12 py-5 rounded-2xl font-black text-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-xl"
        >
          Start Sprint
        </button>
      </div>
    );
  }

  if (gameState === "finished") {
    return (
      <div className="text-center py-20 bg-white border-4 border-indigo-600 rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-500">
        <h2 className="text-6xl font-black text-slate-900 mb-4">Time&apos;s Up!</h2>
        <div className="text-8xl font-black text-indigo-600 mb-8">{score}</div>
        <p className="text-2xl text-slate-500 font-bold mb-12">Final Score</p>
        <button
          onClick={startNewGame}
          className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] border-4 border-slate-100 shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-16">
        <div className="flex items-center space-x-3 bg-slate-100 px-6 py-3 rounded-2xl">
          <Timer className={cn("w-6 h-6", timeLeft < 10 ? "text-red-500 animate-bounce" : "text-slate-500")} />
          <span className={cn("text-2xl font-black", timeLeft < 10 ? "text-red-500" : "text-slate-700")}>{timeLeft}s</span>
        </div>
        <div className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-2xl shadow-lg shadow-indigo-100">
          {score}
        </div>
      </div>

      <div className="text-center space-y-8 mb-16">
        <h3 className="text-6xl font-black text-slate-900 tracking-tight">{currentWord?.word}</h3>
        <div className="flex items-center justify-center space-x-4">
          <div className="h-px bg-slate-200 w-12" />
          <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">matches</span>
          <div className="h-px bg-slate-200 w-12" />
        </div>
        <h4 className={cn(
          "text-5xl font-black transition-all duration-200",
          isCorrect === true ? "text-green-500 scale-110" : isCorrect === false ? "text-red-500 scale-90" : "text-indigo-600"
        )}>
          {challengeTranslation}
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <button
          onClick={() => handleAnswer(false)}
          className="bg-red-50 border-4 border-red-100 p-8 rounded-[2.5rem] group hover:bg-red-500 hover:border-red-400 transition-all active:scale-95"
        >
          <X className="w-12 h-12 text-red-500 mx-auto group-hover:text-white group-hover:scale-125 transition-all" />
          <span className="block mt-4 font-black text-red-600 group-hover:text-white uppercase tracking-widest">False</span>
        </button>
        <button
          onClick={() => handleAnswer(true)}
          className="bg-green-50 border-4 border-green-100 p-8 rounded-[2.5rem] group hover:bg-green-500 hover:border-green-400 transition-all active:scale-95"
        >
          <Check className="w-12 h-12 text-green-500 mx-auto group-hover:text-white group-hover:scale-125 transition-all" />
          <span className="block mt-4 font-black text-green-600 group-hover:text-white uppercase tracking-widest">True</span>
        </button>
      </div>

      {isCorrect === false && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <AlertCircle className="w-32 h-32 text-red-500/20 animate-ping" />
         </div>
      )}
    </div>
  );
}
