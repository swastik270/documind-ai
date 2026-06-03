"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FileText,
  Code,
  Shield,
  MessageSquare,
  Layers,
  Compass,
  ArrowLeft,
  Sparkles,
  GitBranch,
  FileArchive,
  Cpu
} from "lucide-react";

interface ProjectItem {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  fileCount: number;
}

export default function ProjectWorkspaceLayout({
  children,
  params: paramsPromise
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const pathname = usePathname();
  const projectId = params.id;

  const [project, setProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setProject(data))
      .catch(() => {
        router.push("/dashboard/projects");
      })
      .finally(() => setLoading(false));
  }, [projectId, router]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-3" />
        <p className="text-xs text-muted-foreground animate-pulse">Loading project workspace...</p>
      </div>
    );
  }

  if (!project) return null;

  const tabs = [
    { label: "Overview", href: `/dashboard/projects/${projectId}`, icon: <Compass size={14} /> },
    { label: "AI Docs", href: `/dashboard/projects/${projectId}/documentation`, icon: <FileText size={14} /> },
    { label: "Inline Comments", href: `/dashboard/projects/${projectId}/comments`, icon: <Code size={14} /> },
    { label: "Code Review", href: `/dashboard/projects/${projectId}/review`, icon: <Shield size={14} /> },
    { label: "AI Chat", href: `/dashboard/projects/${projectId}/chat`, icon: <MessageSquare size={14} /> },
    { label: "Diagrams", href: `/dashboard/projects/${projectId}/diagrams`, icon: <Layers size={14} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Back button and title header */}
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard/projects"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 self-start transition-colors"
        >
          <ArrowLeft size={12} /> Back to Technical Workspaces
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
              {project.type === "GIT" && <GitBranch size={20} />}
              {project.type === "ZIP" && <FileArchive size={20} />}
              {project.type === "SCHEMA" && <Cpu size={20} />}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{project.name}</h1>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xl truncate">
                {project.description || "Workspace catalog parsed successfully."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-semibold uppercase">
              {project.status}
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold">
              {project.fileCount} Files Mapped
            </span>
          </div>
        </div>
      </div>

      {/* Tabs navigation bar */}
      <div className="border-b border-border overflow-x-auto pb-px">
        <nav className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Child views */}
      <div className="pt-2">{children}</div>
    </div>
  );
}
export const runtime = "nodejs";
