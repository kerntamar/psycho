"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function StudyCalendar() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = Array.from({ length: 14 }, (_, i) => i + 1); // Mock 14 days

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Study Calendar</h3>
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-slate-100 rounded-lg">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg">
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
        {dates.map(date => (
          <div
            key={date}
            className="aspect-square border border-slate-100 rounded-lg p-2 hover:bg-indigo-50 transition-colors cursor-pointer relative"
          >
            <span className="text-sm font-semibold text-slate-700">{date}</span>
            {date % 3 === 0 && (
              <div className="absolute bottom-2 left-2 right-2 h-1 bg-indigo-400 rounded-full" />
            )}
            {date === 7 && (
              <div className="absolute bottom-2 left-2 right-2 h-1 bg-green-400 rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
