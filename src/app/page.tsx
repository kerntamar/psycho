import { TodaysTask } from "@/components/dashboard/TodaysTask";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { StudyCalendar } from "@/components/dashboard/StudyCalendar";
import { PlayCircle, GraduationCap, BarChart2, Book } from "lucide-react";

const quickActions = [
  { name: "Practice Questions", icon: PlayCircle, color: "bg-blue-600" },
  { name: "Mini Quiz", icon: GraduationCap, color: "bg-indigo-600" },
  { name: "Simulated Exam", icon: BarChart2, color: "bg-orange-600" },
  { name: "Review Mistakes", icon: Book, color: "bg-green-600" },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome back, Student!</h1>
          <p className="text-slate-500 mt-2 text-lg">Ready for another productive study session?</p>
        </div>
        <div className="bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm text-center">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Overall Progress</p>
          <p className="text-3xl font-extrabold text-indigo-600 mt-1">68%</p>
        </div>
      </header>

      <ProgressOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <TodaysTask />
          <StudyCalendar />
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  className="flex items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                >
                  <div className={`${action.color} p-2 rounded-lg mr-4 text-white group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-700">{action.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-xl text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3">AI Study Buddy</h3>
              <p className="text-indigo-100 mb-6 leading-relaxed">
                Need more questions? Click below to generate similar practice items using AI.
              </p>
              <button className="w-full bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                Generate Questions
              </button>
            </div>
            <div className="absolute top-0 right-0 -mr-10 -mt-10 bg-indigo-500 w-40 h-40 rounded-full opacity-50 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 bg-indigo-700 w-32 h-32 rounded-full opacity-30 blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
