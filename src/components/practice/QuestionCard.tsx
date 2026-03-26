"use client";

import { useState } from "react";
import { Check, X, Info, RotateCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  mode: "practice" | "test";
  onAnswer?: (isCorrect: boolean) => void;
  onNext?: () => void;
}

export function QuestionCard({
  id,
  question,
  options,
  correctAnswer,
  explanation,
  mode,
  onAnswer,
  onNext
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCorrect = selectedAnswer === correctAnswer;

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setIsSubmitted(true);
    onAnswer?.(isCorrect);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
  };

  return (
    <div className="bg-white p-10 rounded-3xl border-2 border-slate-100 shadow-xl max-w-4xl mx-auto space-y-10 relative group">
      <div className="flex justify-between items-center mb-4">
        <span className="bg-slate-50 text-slate-500 font-bold px-5 py-2 rounded-full border border-slate-100 uppercase tracking-widest text-xs">
          Question #{id}
        </span>
        <div className="flex space-x-3 items-center">
          <div className="flex -space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className={`w-3 h-3 rounded-full ${star <= 3 ? 'bg-orange-400' : 'bg-slate-200'}`} />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty</span>
        </div>
      </div>

      <div className="text-2xl font-bold text-slate-800 leading-snug">
        {question}
      </div>

      <div className="grid grid-cols-1 gap-5">
        {options?.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isOptionCorrect = option === correctAnswer;

          return (
            <button
              key={index}
              disabled={isSubmitted}
              onClick={() => setSelectedAnswer(option)}
              className={cn(
                "flex items-center p-6 border-3 rounded-2xl text-left font-bold transition-all text-xl",
                !isSubmitted && isSelected ? "border-indigo-600 bg-indigo-50 text-indigo-800 shadow-md ring-2 ring-indigo-200" : "border-slate-100 hover:border-indigo-300 hover:bg-slate-50",
                isSubmitted && isOptionCorrect ? "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200" : "",
                isSubmitted && isSelected && !isOptionCorrect ? "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-200" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mr-6 font-extrabold text-2xl border-2",
                isSelected ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-400 border-slate-200",
                isSubmitted && isOptionCorrect ? "bg-green-500 text-white border-green-500" : "",
                isSubmitted && isSelected && !isOptionCorrect ? "bg-red-500 text-white border-red-500" : ""
              )}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className="flex-1">{option}</span>
              {isSubmitted && isOptionCorrect && (
                <Check className="w-8 h-8 text-green-600" />
              )}
              {isSubmitted && isSelected && !isOptionCorrect && (
                <X className="w-8 h-8 text-red-600" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex space-x-6 pt-6">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
          >
            Check Answer
          </button>
        ) : (
          <>
            {mode === "practice" && (
              <button
                onClick={handleReset}
                className="bg-slate-100 text-slate-600 p-5 rounded-2xl font-bold text-xl hover:bg-slate-200 transition-colors shadow-sm"
              >
                <RotateCcw className="w-8 h-8" />
              </button>
            )}
            <button
              onClick={onNext}
              className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center active:scale-95"
            >
              {mode === "practice" ? "Next Question" : "Continue"} <ArrowRight className="w-6 h-6 ml-3" />
            </button>
          </>
        )}
      </div>

      {isSubmitted && mode === "practice" && (
        <div className={cn(
          "mt-10 p-8 rounded-2xl border-2 flex items-start space-x-6 bg-white animate-in slide-in-from-bottom-5",
          isCorrect ? "border-green-100 bg-green-50/30" : "border-red-100 bg-red-50/30"
        )}>
          <div className={cn(
            "p-3 rounded-xl",
            isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          )}>
            <Info className="w-8 h-8" />
          </div>
          <div>
            <h4 className={cn(
              "font-bold text-xl mb-3",
              isCorrect ? "text-green-800" : "text-red-800"
            )}>
              {isCorrect ? "Great job! Here's why:" : "Almost there! Let's review:"}
            </h4>
            <p className="text-slate-700 text-lg leading-relaxed">{explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
