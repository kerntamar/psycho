"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyTask {
  id: string;
  title: string;
  subject_id: string;
  date: string;
  status: 'pending' | 'completed';
}

export function StudyCalendar() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate a mock grid of 14 days starting from today
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i - 2)); // Show 2 days ago and next 12 days
    return d;
  });

  useEffect(() => {
    async function fetchTasks() {
      // Fetch some real lessons to simulate tasks
      const { data } = await supabase
        .from('lessons')
        .select('*')
        .limit(10);

      if (data) {
        const mockTasks = data.map((l, i) => ({
          id: l.id,
          title: l.title,
          subject_id: l.subject_id,
          date: new Date(new Date().setDate(new Date().getDate() + (i - 2))).toISOString().split('T')[0],
          status: i < 3 ? 'completed' : 'pending' as 'completed' | 'pending'
        }));
        setTasks(mockTasks);
      }
    }
    fetchTasks();
  }, []);

  const getTaskForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.find(t => t.date === dateStr);
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-xl mt-12 transition-all hover:shadow-2xl">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Study Calendar</h3>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Personalized Path</p>
        </div>
        <div className="flex space-x-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button className="p-3 hover:bg-white hover:text-indigo-600 rounded-xl transition-all hover:shadow-sm">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          <button className="p-3 hover:bg-white hover:text-indigo-600 rounded-xl transition-all hover:shadow-sm">
            <ChevronRight className="w-6 h-6 text-slate-600" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-6">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-black text-slate-400 uppercase tracking-widest pb-4">
            {day}
          </div>
        ))}
        {dates.map((date, idx) => {
          const task = getTaskForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div
              key={idx}
              className={cn(
                "aspect-square border-2 rounded-2xl p-4 transition-all cursor-pointer relative group",
                isToday ? "bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-100" : "bg-white border-slate-50 hover:bg-slate-50 hover:border-indigo-200"
              )}
            >
              <span className={cn(
                "text-lg font-black",
                isToday ? "text-white" : "text-slate-800"
              )}>
                {date.getDate()}
              </span>

              {task && (
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                   <div className={cn(
                     "h-2 flex-1 rounded-full overflow-hidden",
                     isToday ? "bg-indigo-400" : "bg-indigo-100"
                   )}>
                      <div className={cn(
                        "h-full w-full rounded-full",
                        task.status === 'completed' ? "bg-green-400" : (isToday ? "bg-white" : "bg-indigo-300")
                      )} />
                   </div>
                   <div className="ml-2">
                     {task.status === 'completed' ? (
                       <CheckCircle2 className={cn("w-5 h-5", isToday ? "text-green-300" : "text-green-500")} />
                     ) : (
                       <Circle className={cn("w-5 h-5 opacity-30", isToday ? "text-white" : "text-slate-300")} />
                     )}
                   </div>
                </div>
              )}

              {/* Tooltip on hover */}
              {task && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-xl border border-slate-700">
                  {task.title}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
