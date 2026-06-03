"use client";

import { useState, use, useEffect } from "react";
import { MermaidRenderer } from "@/components/shared/MermaidRenderer";
import {
  Layers,
  Sparkles,
  GitBranch,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";

export default function ProjectDiagrams({
  params: paramsPromise
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const projectId = params.id;

  const [diagramType, setDiagramType] = useState<"flowchart" | "sequence" | "er">("flowchart");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    handleGenerate();
  }, [diagramType]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/diagrams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: diagramType }),
      });
      const data = await res.json();
      if (res.ok) {
        setCode(data.code);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Relational Flowcharts</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Visualize project execution loops and database structures using Mermaid.js vectors.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "flowchart", label: "Flowchart Map" },
            { id: "sequence", label: "Sequence Dialog" },
            { id: "er", label: "ER Schema" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDiagramType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                diagramType === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border hover:bg-muted/10 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Render Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <span>Visual Vector Preview</span>
            {loading && <span className="animate-pulse flex items-center gap-1"><RefreshCw size={10} className="animate-spin" /> Updating...</span>}
          </div>
          {code ? (
            <MermaidRenderer code={code} />
          ) : (
            <div className="w-full flex items-center justify-center p-6 bg-muted/20 border border-border rounded-xl min-h-[260px] text-xs text-muted-foreground">
              Diagram rendering context not ready.
            </div>
          )}
        </div>

        {/* Code Block Pane */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Mermaid Code
            </span>
            {code && (
              <button
                onClick={handleCopyCode}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            )}
          </div>
          <div className="rounded-xl border border-border bg-black/90 p-4 font-mono text-xs text-gray-300 h-[260px] overflow-auto select-text border-border/20">
            <pre>
              <code>{code || "// Select a diagram type to compile source structure."}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
export const runtime = "nodejs";
