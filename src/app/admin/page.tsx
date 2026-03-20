"use client";

import { useState } from "react";
import { Upload, CheckCircle, FileText, Plus, Database, Sparkles, MessageSquare, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"uploads" | "approval" | "manual">("uploads");

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
      <header className="flex items-center justify-between border-b border-slate-200 pb-10">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Admin Terminal</h1>
          <p className="text-slate-500 mt-3 text-xl font-medium">Control the content, AI parameters, and study pathways.</p>
        </div>
        <div className="flex space-x-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("uploads")}
            className={cn(
              "px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center space-x-2",
              activeTab === "uploads" ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Upload className="w-4 h-4" /> <span>PDF Upload</span>
          </button>
          <button
            onClick={() => setActiveTab("approval")}
            className={cn(
              "px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center space-x-2",
              activeTab === "approval" ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Sparkles className="w-4 h-4" /> <span>AI Approval</span>
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={cn(
              "px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center space-x-2",
              activeTab === "manual" ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Database className="w-4 h-4" /> <span>Manual Entry</span>
          </button>
        </div>
      </header>

      {activeTab === "uploads" && (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="bg-white border-4 border-dashed border-slate-200 rounded-[3rem] p-24 text-center group hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer">
            <div className="bg-indigo-100 p-8 rounded-full inline-block mb-10 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-100">
               <Upload className="w-16 h-16 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Drop your PDF study materials here</h2>
            <p className="text-slate-500 text-lg mb-12 max-w-md mx-auto">AI will automatically extract chapters, explanations, and practice questions.</p>
            <button className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl active:scale-95 ring-4 ring-indigo-100">
               Browse Files
            </button>
          </div>

          <div className="mt-16 bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-black mb-8 text-slate-800 tracking-tight">Processing Pipeline</h3>
            <div className="space-y-6">
               {[1, 2].map(i => (
                 <div key={i} className="flex items-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                    <div className="bg-indigo-100 p-4 rounded-xl mr-6">
                       <FileText className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-slate-800 text-lg">math_geometry_intro.pdf</h4>
                       <p className="text-slate-500 font-medium">1.2 MB • Processing chapters...</p>
                    </div>
                    <div className="w-48 h-3 bg-slate-200 rounded-full overflow-hidden mr-10 shadow-inner">
                       <div className="h-full bg-indigo-500 animate-pulse w-2/3 rounded-full" />
                    </div>
                    <span className="text-indigo-600 font-black tracking-widest text-xs uppercase bg-white px-4 py-2 rounded-full border border-indigo-100 shadow-sm">Active</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "approval" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
           {[1, 2].map(i => (
             <div key={i} className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-xl hover:shadow-2xl transition-all relative group">
                <div className="absolute top-8 right-8 flex space-x-3">
                   <button className="bg-red-50 text-red-600 p-4 rounded-2xl hover:bg-red-100 transition-colors">
                      <Plus className="w-6 h-6 rotate-45" />
                   </button>
                   <button className="bg-green-50 text-green-600 p-4 rounded-2xl hover:bg-green-100 transition-colors">
                      <CheckCircle className="w-6 h-6" />
                   </button>
                </div>
                <div className="bg-orange-50 text-orange-600 px-5 py-2 rounded-full font-black tracking-[0.1em] text-xs inline-block mb-8 uppercase border border-orange-100">AI PROPOSED LESSON</div>
                <h3 className="text-3xl font-black text-slate-900 mb-6 leading-tight tracking-tight">Algebra: Proportional Relationships</h3>
                <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100 italic text-slate-600 text-lg leading-relaxed">
                   "A ratio is a way of comparing two quantities. For example, if there are 3 boys and 5 girls in a class, the ratio of boys to girls is 3:5..."
                </div>
                <div className="flex items-center text-slate-400 font-bold uppercase tracking-widest text-xs mb-10 space-x-3">
                   <FileText className="w-5 h-5" /> <span>Source: geometry_vol1.pdf • Page 12</span>
                </div>
                <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 shadow-lg active:scale-95">
                   <MessageSquare className="w-6 h-6" /> <span>Edit Explanation</span>
                </button>
             </div>
           ))}
        </div>
      )}

      {activeTab === "manual" && (
        <div className="bg-white p-12 rounded-[3rem] border-2 border-slate-100 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-500">
           <form className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                    <select className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 font-bold focus:border-indigo-500 transition-colors appearance-none shadow-sm">
                       <option>Math</option>
                       <option>English</option>
                    </select>
                 </div>
                 <div className="space-y-4">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Topic</label>
                    <input className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 font-bold focus:border-indigo-500 transition-colors shadow-sm placeholder:text-slate-300" placeholder="e.g. Geometry Basics" />
                 </div>
              </div>
              <div className="space-y-4">
                 <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Question Content</label>
                 <textarea rows={4} className="w-full p-6 rounded-3xl border-2 border-slate-100 bg-slate-50 text-slate-800 font-bold focus:border-indigo-500 transition-colors shadow-sm resize-none placeholder:text-slate-300" placeholder="Type the question content here..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className="flex space-x-4 items-center group">
                      <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center font-black group-hover:scale-110 transition-transform">{String.fromCharCode(64+i)}</div>
                      <input className="flex-1 p-5 rounded-2xl border-2 border-slate-100 bg-white font-medium focus:border-indigo-500 transition-colors shadow-sm" placeholder={`Option ${i}`} />
                   </div>
                 ))}
              </div>
              <button className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black text-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-4 active:scale-95 group">
                 <Save className="w-8 h-8 group-hover:rotate-12 transition-transform" /> <span>Publish Question</span>
              </button>
           </form>
        </div>
      )}
    </div>
  );
}
