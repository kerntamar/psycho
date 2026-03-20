import { CheckCircle2, Clock } from "lucide-react";

export function TodaysTask() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Today's Recommended Task</h3>
      <div className="flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <div className="bg-indigo-600 p-2 rounded-md mr-4 text-white">
          <Clock className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">Math - Algebra</p>
          <h4 className="font-bold text-slate-800">Ratios Explanation & 10 Practice Questions</h4>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
          Start
        </button>
      </div>
    </div>
  );
}
