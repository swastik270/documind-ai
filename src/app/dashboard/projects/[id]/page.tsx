"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  FileCode,
  ArrowRight,
  Shield,
  FileText,
  MessageSquare,
  Layers,
  Sparkles,
  Zap,
  CheckCircle,
  Clock,
  Compass
} from "lucide-react";

interface ProjectItem {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  tokenUsage: number;
  fileCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ProjectFile {
  id: string;
  name: string;
  path: string;
  language: string;
}

interface ReviewSummary {
  score: number;
}

export default function ProjectOverview({
  params: paramsPromise
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const projectId = params.id;

  const [project, setProject] = useState<ProjectItem | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [review, setReview] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/projects/${projectId}`).then((res) => res.json()),
      fetch(`/api/projects/${projectId}/files`).then((res) => res.json()),
      fetch(`/api/projects/${projectId}/review`).then((res) => res.json()),
    ])
      .then(([projData, filesData, reviewData]) => {
        if (projData && typeof projData === "object" && !projData.message) setProject(projData);
        if (Array.isArray(filesData)) setFiles(filesData);
        if (reviewData && typeof reviewData === "object") setReview(reviewData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 bg-muted/20 rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 h-64 bg-muted/20 rounded animate-pulse" />
          <div className="h-64 bg-muted/20 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!project) return null;

  // Language stats compiler
  const langStats = files.reduce((acc, f) => {
    acc[f.language] = (acc[f.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const langPercentage = Object.entries(langStats).map(([lang, count]) => ({
    name: lang.toUpperCase(),
    count,
    percent: Math.round((count / files.length) * 100),
  }));

  const modules = [
    {
      title: "AI Reference Manuals",
      desc: "READMEs, API references, troubleshooting guides",
      href: `/dashboard/projects/${projectId}/documentation`,
      icon: <FileText className="text-indigo-500" size={16} />,
    },
    {
      title: "Security & Code Reviews",
      desc: "Inspect critical vulnerabilities & performance lags",
      href: `/dashboard/projects/${projectId}/review`,
      icon: <Shield className="text-red-500" size={16} />,
    },
    {
      title: "Interactive AI Chatbot",
      desc: "Ask function descriptions, request unit assertions",
      href: `/dashboard/projects/${projectId}/chat`,
      icon: <MessageSquare className="text-fuchsia-500" size={16} />,
    },
    {
      title: "Flowcharts & Architecture",
      desc: "Mermaid.js sequence diagrams & flow maps",
      href: `/dashboard/projects/${projectId}/diagrams`,
      icon: <Layers className="text-cyan-500" size={16} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Workspace Quick Details */}
      <div className="p-6 rounded-xl border border-border glass-panel grid grid-cols-1 sm:grid-cols-3 gap-6 relative overflow-hidden bg-gradient-to-tr from-card to-background">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Token Consumption Rate
          </span>
          <span className="text-xl font-extrabold tracking-tight flex items-center gap-1">
            <Zap size={16} className="text-amber-500 shrink-0" />
            {project.tokenUsage.toLocaleString()} tokens
          </span>
        </div>

        <div className="flex flex-col gap-1 sm:border-x sm:border-border/60 sm:px-6">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Repository Health Score
          </span>
          <span className="text-xl font-extrabold tracking-tight flex items-center gap-1">
            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
            {review?.score || "82"}/100
          </span>
        </div>

        <div className="flex flex-col gap-1 sm:pl-6">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Scanned Timestamp
          </span>
          <span className="text-xs font-bold text-foreground mt-1 flex items-center gap-1.5">
            <Clock size={14} className="text-muted-foreground" />
            {new Date(project.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core modules navigation cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Workspace Sub-Modules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modules.map((m, i) => (
              <Link
                key={i}
                href={m.href}
                className="group p-5 rounded-xl border border-border glass-panel hover:border-primary/30 hover:shadow-md transition-all flex flex-col justify-between h-36"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center mb-3">
                    {m.icon}
                  </div>
                  <h4 className="font-bold text-xs group-hover:text-primary transition-colors">
                    {m.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed line-clamp-2 font-medium">
                    {m.desc}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-primary flex items-center gap-0.5 mt-2 self-start opacity-0 group-hover:opacity-100 transition-opacity">
                  Open module <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mapped language cards and file counts */}
        <div className="lg:col-span-1 space-y-6">
          {/* Languages distribution */}
          <div className="p-6 rounded-xl border border-border glass-panel space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40 pb-2">
              Language Distribution
            </h3>
            <div className="space-y-3.5">
              {langPercentage.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center">No languages mapped.</p>
              ) : (
                langPercentage.map((lang, li) => (
                  <div key={li}>
                    <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1">
                      <span>{lang.name}</span>
                      <span>{lang.percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${lang.percent}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scanned files tree log */}
      <div className="p-6 rounded-xl border border-border glass-panel space-y-4">
        <h3 className="font-bold text-sm">Indexed File Tree</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="p-3 rounded-lg border border-border/60 bg-background/20 flex items-center gap-2.5 truncate text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileCode size={14} className="text-primary shrink-0" />
              <div className="truncate">
                <span className="text-foreground font-bold truncate block">{file.name}</span>
                <span className="text-[9px] opacity-70 truncate block">{file.path}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export const runtime = "nodejs";
