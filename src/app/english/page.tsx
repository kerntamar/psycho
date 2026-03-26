"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BookOpen, PlayCircle, FileText } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  explanation: string;
  status: string;
}

export default function EnglishPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      const { data: subjectData } = await supabase
        .from('subjects')
        .select('id')
        .eq('slug', 'english')
        .single();

      if (subjectData) {
        const { data } = await supabase
          .from('lessons')
          .select('*')
          .eq('subject_id', subjectData.id)
          .eq('status', 'approved');

        setLessons(data || []);
      }
      setLoading(false);
    }

    fetchLessons();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight capitalize">English Section</h1>
        <p className="text-slate-500 mt-4 text-xl font-medium">Improve your vocabulary, grammar, and sentence completions.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white border-2 border-slate-100 rounded-3xl p-8 hover:shadow-xl transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-indigo-100 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-indigo-600" />
                  </div>
                  <span className="bg-green-50 text-green-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Available</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{lesson.title}</h3>
                <p className="text-slate-500 mb-8 line-clamp-2 font-medium">{lesson.explanation}</p>
                <div className="flex space-x-4">
                  <button className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors">
                    <FileText className="w-5 h-5" /> <span>Read Lesson</span>
                  </button>
                  <button className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors">
                    <PlayCircle className="w-5 h-5" /> <span>Practice</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
              <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">No lessons available yet</p>
              <p className="text-slate-500 mt-2">Check back later or use the Admin panel to upload materials.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
