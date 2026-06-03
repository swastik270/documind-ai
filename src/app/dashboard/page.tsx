"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderKanban,
  FileText,
  Cpu,
  TrendingUp,
  Activity,
  ArrowRight,
  Plus,
  GitBranch,
  ShieldCheck,
  Compass,
  AlertCircle
} from "lucide-react";

interface ProjectItem {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  createdAt: string;
}

export default function DashboardHome() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalProjects = projects.length;
  const totalDocs = projects.reduce((acc, p) => acc + (p.status === "COMPLETED" ? 4 : 0), 0) + 2; // sample offset
  const totalTokens = projects.reduce((acc, p) => acc + (p.status === "COMPLETED" ? 24500 : 0), 0) + 124500;

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, <span className="text-foreground font-semibold">{session?.user?.name || "Developer"}</span>. Mapped code bases are active.
          </p>
        </div>
        <Link
          href="/dashboard/projects"
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:bg-primary/95 transition-all active:scale-95 self-start sm:self-center"
        >
          <Plus size={14} /> Create Project
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Projects",
            value: totalProjects,
            desc: "Active codebases",
            icon: <FolderKanban size={18} className="text-violet-500" />,
          },
          {
            title: "Docs Generated",
            value: totalDocs,
            desc: "Technical manuals compiled",
            icon: <FileText size={18} className="text-indigo-500" />,
          },
          {
            title: "AI Token Usage",
            value: totalTokens.toLocaleString(),
            desc: "Total request contexts",
            icon: <Cpu size={18} className="text-fuchsia-500" />,
          },
          {
            title: "Engine Status",
            value: "99.8%",
            desc: "Analyzer uptime guarantee",
            icon: <ShieldCheck size={18} className="text-emerald-500" />,
          },
        ].map((metric, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="p-6 rounded-xl border border-border glass-panel flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {metric.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center">
                {metric.icon}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-500 shrink-0" />
                {metric.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart & Activity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Usage Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-border glass-panel flex flex-col justify-between min-h-[350px]">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Token Processing Load
            </span>
            <h3 className="text-lg font-bold mt-1">AI Request Frequency</h3>
          </div>
          
          <div className="w-full h-48 relative mt-6 flex items-end">
            {/* SVG Background grids */}
            <div className="absolute inset-0 flex flex-col justify-between border-b border-border pointer-events-none">
              <div className="w-full border-t border-border/20 h-0" />
              <div className="w-full border-t border-border/20 h-0" />
              <div className="w-full border-t border-border/20 h-0" />
              <div className="w-full border-t border-border/20 h-0" />
            </div>

            {/* Custom SVG Line Chart */}
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible z-10">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Path area */}
              <path
                d="M 0 130 C 50 110, 100 120, 150 90 C 200 60, 250 80, 300 40 C 350 0, 400 30, 450 10 L 500 20 L 500 150 L 0 150 Z"
                fill="url(#chartGradient)"
              />
              {/* Line path */}
              <path
                d="M 0 130 C 50 110, 100 120, 150 90 C 200 60, 250 80, 300 40 C 350 0, 400 30, 450 10 L 500 20"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Data dots */}
              <circle cx="150" cy="90" r="4" fill="#8b5cf6" className="animate-pulse" />
              <circle cx="300" cy="40" r="4" fill="#8b5cf6" className="animate-pulse" />
              <circle cx="450" cy="10" r="4" fill="#d946ef" className="animate-pulse" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-3 border-t border-border/40 font-semibold">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="p-6 rounded-xl border border-border glass-panel flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Workspace Core
            </span>
            <h3 className="text-lg font-bold mt-1">Quick Integrations</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Launch code analysis pipelines to update documentation assets instantly.
            </p>
          </div>

          <div className="space-y-3 mt-6 flex-1 flex flex-col justify-center">
            {[
              {
                title: "Scan ZIP Archive",
                href: "/dashboard/projects",
                desc: "Upload zip bundles",
              },
              {
                title: "Sync Git Repository",
                href: "/dashboard/projects",
                desc: "Pull from Github branches",
              },
              {
                title: "Inspect Schematics",
                href: "/dashboard/projects",
                desc: "Analyze circuit diagrams",
              },
            ].map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="p-3 rounded-lg border border-border/60 hover:border-primary/30 bg-background/30 hover:bg-primary/5 transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold">{action.title}</h4>
                  <p className="text-[10px] text-muted-foreground">{action.desc}</p>
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="p-6 rounded-xl border border-border glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Active Repositories</h3>
          <Link href="/dashboard/projects" className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-10 bg-muted/20 rounded animate-pulse" />
            <div className="h-10 bg-muted/20 rounded animate-pulse" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
            <AlertCircle className="mx-auto text-muted-foreground/60 mb-2" size={24} />
            No projects compiled yet. Upload your first codebase.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground font-semibold pb-3">
                  <th className="pb-3 font-semibold">Project Name</th>
                  <th className="pb-3 font-semibold">Compilation Status</th>
                  <th className="pb-3 font-semibold text-center">Type</th>
                  <th className="pb-3 font-semibold text-right">Scanned Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {projects.slice(0, 5).map((project) => (
                  <tr key={project.id} className="group hover:bg-muted/5">
                    <td className="py-3.5">
                      <Link href={`/dashboard/projects/${project.id}`} className="font-bold hover:text-primary transition-colors">
                        {project.name}
                      </Link>
                      <p className="text-[10px] text-muted-foreground mt-0.5 max-w-sm truncate">
                        {project.description || "No description provided."}
                      </p>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          project.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : project.status === "FAILED"
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="px-1.5 py-0.5 rounded bg-muted/40 font-mono text-[9px] uppercase">
                        {project.type}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-muted-foreground font-semibold">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
