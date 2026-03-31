import { FileText, ExternalLink, MessageSquareQuote } from "lucide-react";

interface ExplanationViewProps {
  title: string;
  explanation: string;
  pdfUrl?: string;
  pdfPage?: number;
}

export function ExplanationView({ title, explanation, pdfUrl, pdfPage }: ExplanationViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 border-b-4 border-indigo-600 inline-block pb-2">{title}</h1>
      </header>

      <div className="bg-indigo-50 border-l-8 border-indigo-500 p-8 rounded-r-2xl shadow-sm relative group overflow-hidden">
        <div className="absolute top-4 right-4 text-indigo-200 group-hover:text-indigo-300 transition-colors">
          <MessageSquareQuote className="w-16 h-16" />
        </div>
        <div className="relative z-10">
          <h3 className="text-indigo-900 font-bold mb-4 flex items-center text-xl">
            AI Simplified Explanation
          </h3>
          <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
            {explanation}
          </div>
        </div>
      </div>

      {pdfUrl && (
        <div className="bg-white border-2 border-slate-100 p-6 rounded-2xl flex items-center justify-between hover:border-indigo-200 transition-colors shadow-sm group">
          <div className="flex items-center">
            <div className="bg-red-50 p-4 rounded-xl mr-5 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-lg">Original Source Material</p>
              <p className="text-slate-500">Read the detailed explanation in the source PDF{pdfPage && ` (Page ${pdfPage})`}</p>
            </div>
          </div>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Open PDF <ExternalLink className="w-5 h-5 ml-2" />
          </a>
        </div>
      )}
    </div>
  );
}
