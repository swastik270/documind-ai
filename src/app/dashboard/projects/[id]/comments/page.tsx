"use client";

import { useState, use } from "react";
import {
  Code,
  Copy,
  Check,
  Sparkles,
  Zap,
  RefreshCw,
  Columns
} from "lucide-react";

export default function InlineComments({
  params: paramsPromise
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const projectId = params.id;

  const [code, setCode] = useState(`function calculateArea(radius) {\n  if (radius <= 0) return 0;\n  const pi = 3.14159;\n  return pi * radius * radius;\n}`);
  const [language, setLanguage] = useState("javascript");
  const [commentedCode, setCommentedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (res.ok) {
        setCommentedCode(data.commentedCode);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(commentedCode || code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Inline Comment Generator</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Inject structured documentation comments into function logic scopes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw size={12} className="animate-spin" /> Commenting...
              </>
            ) : (
              <>
                <Sparkles size={12} /> Inject Comments
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Pane */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Original Component Code
          </span>
          <div className="flex-1 rounded-xl border border-border overflow-hidden bg-black/90 font-mono text-xs flex flex-col min-h-[300px]">
            <div className="bg-muted/10 px-4 py-2 border-b border-border/40 text-muted-foreground flex items-center justify-between text-[10px]">
              <span>Source Inputs</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full p-4 bg-transparent text-gray-300 focus:outline-none resize-none font-mono text-xs"
              placeholder="Paste code blocks here..."
            />
          </div>
        </div>

        {/* Output Pane */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              AI Documented Output
            </span>
            {commentedCode && (
              <button
                onClick={handleCopy}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check size={12} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={12} /> Copy Code
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex-1 rounded-xl border border-border overflow-hidden bg-black/90 font-mono text-xs flex flex-col min-h-[300px] relative">
            <div className="bg-muted/10 px-4 py-2 border-b border-border/40 text-muted-foreground flex items-center justify-between text-[10px]">
              <span>Generated Code</span>
            </div>
            {commentedCode ? (
              <pre className="flex-1 w-full p-4 text-emerald-400 overflow-auto whitespace-pre-wrap select-text">
                <code>{commentedCode}</code>
              </pre>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2 p-6 text-center">
                <Columns size={20} className="opacity-40" />
                <p className="text-[11px]">Click &quot;Inject Comments&quot; to compile inline summaries.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export const runtime = "nodejs";
