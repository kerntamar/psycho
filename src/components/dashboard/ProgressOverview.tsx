import { Trophy, Zap, Calendar } from "lucide-react";

export function ProgressOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <div className="bg-orange-100 p-3 rounded-full mr-4">
          <Zap className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase">Study Streak</p>
          <p className="text-2xl font-bold text-slate-800">7 Days</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <div className="bg-indigo-100 p-3 rounded-full mr-4">
          <Trophy className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase">XP Points</p>
          <p className="text-2xl font-bold text-slate-800">1,250 XP</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <div className="bg-green-100 p-3 rounded-full mr-4">
          <Calendar className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase">Exam Countdown</p>
          <p className="text-2xl font-bold text-slate-800">45 Days</p>
        </div>
      </div>
    </div>
  );
}
