"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Target, TrendingUp, Calendar, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const questions = [
  {
    id: "strongest",
    question: "Which subject do you feel most confident in?",
    options: ["Math", "English", "Hebrew", "Vocabulary"],
    icon: Sparkles
  },
  {
    id: "weakest",
    question: "Which subject do you struggle with the most?",
    options: ["Math", "English", "Hebrew", "Vocabulary"],
    icon: TrendingUp
  },
  {
    id: "target",
    question: "What is your target psychometric score?",
    options: ["400-500", "500-600", "600-700", "700+"],
    icon: Target
  },
  {
    id: "testDate",
    question: "When is your test date?",
    options: ["In 1 month", "In 2-3 months", "In 4-6 months", "Not scheduled"],
    icon: Calendar
  },
  {
    id: "hours",
    question: "How many hours per week can you study?",
    options: ["5-10 hours", "10-20 hours", "20-30 hours", "30+ hours"],
    icon: Clock
  }
];

export function DiagnosticQuestionnaire({ onComplete }: { onComplete: (results: Record<string, string>) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[step];

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-16 px-8 bg-white rounded-3xl border border-slate-100 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 h-2 bg-slate-100 w-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-500 ease-out rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center mb-10">
         <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Question {step + 1} of {questions.length}</span>
         <div className="bg-indigo-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">
           <currentQuestion.icon className="w-8 h-8 text-indigo-600" />
         </div>
      </div>

      <h2 className="text-4xl font-black text-slate-900 mb-10 leading-tight tracking-tight">
        {currentQuestion.question}
      </h2>

      <div className="grid grid-cols-1 gap-4 mb-12">
        {currentQuestion.options.map((option) => {
          const isSelected = answers[currentQuestion.id] === option;
          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={cn(
                "p-6 text-left rounded-2xl border-3 font-bold text-xl transition-all shadow-sm active:scale-[0.98]",
                isSelected
                  ? "border-indigo-600 bg-indigo-50 text-indigo-800 shadow-md ring-2 ring-indigo-100"
                  : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600"
              )}
            >
              <div className="flex items-center">
                 <div className={cn(
                   "w-6 h-6 rounded-full border-2 mr-6 transition-all",
                   isSelected ? "border-indigo-600 bg-indigo-600 shadow-inner" : "border-slate-200 bg-white"
                 )} />
                 {option}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-slate-100">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className="flex items-center space-x-2 font-black text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all px-6 py-3 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" /> <span>Back</span>
        </button>
        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95 flex items-center space-x-3"
        >
          <span>{step === questions.length - 1 ? "Get My Plan" : "Next Step"}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
