"use client";

import { useEffect, useState, use } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle,
  FileText,
  Activity,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface ReviewItem {
  file: string;
  line?: number;
  issue: string;
  severity: "critical" | "warning" | "info";
  description: string;
  suggestion: string;
}

interface CodeReview {
  id: string;
  score: number;
  bugs: ReviewItem[];
  security: ReviewItem[];
  performance: ReviewItem[];
  suggestions: ReviewItem[];
  report: string;
}

export default function ProjectReview({
  params: paramsPromise
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const projectId = params.id;

  const [review, setReview] = useState<CodeReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/review`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object") setReview(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted/20 rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-6">
          <div className="h-64 bg-muted/20 rounded animate-pulse" />
          <div className="col-span-2 h-64 bg-muted/20 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="p-8 rounded-xl border border-border glass-panel text-center py-20 text-muted-foreground text-xs">
        No code review audit is available for this project.
      </div>
    );
  }

  const allIssues = [
    ...review.security.map((item) => ({ ...item, category: "Security" as const })),
    ...review.performance.map((item) => ({ ...item, category: "Performance" as const })),
    ...review.bugs.map((item) => ({ ...item, category: "Code Quality" as const })),
    ...review.suggestions.map((item) => ({ ...item, category: "Best Practice" as const })),
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Metric summary card */}
      <div className="lg:col-span-1 space-y-6">
        <div className="p-6 rounded-xl border border-border glass-panel flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Security & Quality Rating
          </span>

          {/* Circular progress meter */}
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="var(--border)"
                strokeWidth="6"
                fill="transparent"
                className="opacity-20"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={review.score >= 80 ? "#10b981" : review.score >= 60 ? "#f59e0b" : "#ef4444"}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * review.score) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold tracking-tight">{review.score}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-0.5">
                Score
              </span>
            </div>
          </div>

          <div className="w-full space-y-2 mt-2">
            <div className="flex justify-between items-center text-xs border-b border-border/40 pb-2">
              <span className="text-muted-foreground font-semibold">Critical Vulnerabilities</span>
              <span className="font-bold text-red-500">{review.security.length}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-border/40 pb-2">
              <span className="text-muted-foreground font-semibold">Performance Warnings</span>
              <span className="font-bold text-amber-500">{review.performance.length}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-semibold">Best Practice Info</span>
              <span className="font-bold text-blue-500">{review.suggestions.length}</span>
            </div>
          </div>
        </div>

        {/* Audit Report Markdown summary */}
        <div className="p-6 rounded-xl border border-border glass-panel">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1">
            <FileText size={12} /> Executive Summary
          </h3>
          <div className="prose prose-sm dark:prose-invert text-xs leading-relaxed space-y-3 font-semibold text-muted-foreground">
            {review.report.split("\n").map((line, li) => {
              if (line.startsWith("# ")) return <h4 key={li} className="text-sm font-bold text-foreground mb-2 mt-1">{line.replace("# ", "")}</h4>;
              if (line.startsWith("- ")) return <p key={li} className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-primary">{line.replace("- ", "")}</p>;
              return <p key={li}>{line}</p>;
            })}
          </div>
        </div>
      </div>

      {/* Audit Issues Checklist list */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Audit Issues Mapped ({allIssues.length})
        </h3>

        <div className="space-y-3">
          {allIssues.map((issue, index) => {
            const key = `${issue.category}-${index}`;
            const isOpen = expandedIssue === key;
            const severityColor =
              issue.severity === "critical"
                ? "border-red-500/20 bg-red-500/5 text-red-500"
                : issue.severity === "warning"
                ? "border-amber-500/20 bg-amber-500/5 text-amber-500"
                : "border-blue-500/20 bg-blue-500/5 text-blue-500";

            return (
              <div
                key={key}
                className={`rounded-xl border glass-panel transition-all overflow-hidden ${
                  isOpen ? "border-primary/20 shadow-md shadow-primary/5" : "border-border/60"
                }`}
              >
                <button
                  onClick={() => setExpandedIssue(isOpen ? null : key)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left text-xs sm:text-sm hover:bg-muted/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${severityColor}`}>
                      {issue.severity}
                    </span>
                    <div>
                      <h4 className="font-bold text-foreground">{issue.issue}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
                        File: {issue.file} {issue.line ? `(Line ${issue.line})` : ""}
                      </p>
                    </div>
                  </div>

                  {isOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs border-t border-border/40 space-y-3 bg-muted/5">
                    <div>
                      <span className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">
                        Description
                      </span>
                      <p className="text-foreground/90 mt-1 leading-relaxed">{issue.description}</p>
                    </div>
                    <div>
                      <span className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider block">
                        Suggested Refactoring Fix
                      </span>
                      <pre className="bg-black/90 text-emerald-400 p-3 rounded-lg font-mono text-[11px] overflow-x-auto mt-1 border border-border/20">
                        <code>{issue.suggestion}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export const runtime = "nodejs";
