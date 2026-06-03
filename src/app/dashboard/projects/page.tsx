"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  GitBranch,
  FileArchive,
  Cpu,
  ArrowRight,
  Sparkles,
  ChevronRight,
  AlertCircle,
  X,
  UploadCloud,
  FileText
} from "lucide-react";

interface ProjectItem {
  id: string;
  name: string;
  description: string | null;
  type: "GIT" | "ZIP" | "SCHEMA";
  status: string;
  createdAt: string;
  fileCount: number;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "GIT" | "ZIP" | "SCHEMA">("ALL");
  
  // Wizard Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [projName, setProjName] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projType, setProjType] = useState<"GIT" | "ZIP" | "SCHEMA">("ZIP");
  const [gitUrl, setGitUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; path: string; content: string; language: string }[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    setLoading(true);
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let finalFiles = uploadedFiles;
    
    // Inject mock files based on type if none uploaded
    if (finalFiles.length === 0) {
      if (projType === "GIT") {
        finalFiles = [
          { name: "main.py", path: "main.py", content: "def main():\n    print('Hello Git Repository!')\n\nif __name__ == '__main__':\n    main()", language: "python" },
          { name: "requirements.txt", path: "requirements.txt", content: "requests==2.31.0\npytest==8.0.0", language: "text" }
        ];
      } else if (projType === "SCHEMA") {
        finalFiles = [
          { name: "microcontroller.sch", path: "schematics/microcontroller.sch", content: "NODE MCU_V3 {\n  PIN 1: VCC (3.3V)\n  PIN 2: GND\n  PIN 3: GPIO_4 -> LED_A_ANODE\n  PIN 4: GPIO_5 -> RESET_BUTTON\n}", language: "text" },
          { name: "setup.txt", path: "setup.txt", content: "Power Input: 5V microUSB\nMicrocontroller chip: ESP8266EX", language: "text" }
        ];
      } else {
        finalFiles = [
          { name: "app.js", path: "src/app.js", content: "const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => res.send('API running!'));\n\napp.listen(8080);", language: "javascript" },
          { name: "package.json", path: "package.json", content: "{\n  \"name\": \"zip-app\",\n  \"dependencies\": { \"express\": \"^4.18.2\" }\n}", language: "json" }
        ];
      }
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projName,
          description: projDesc,
          type: projType,
          sourceUrl: projType === "GIT" ? gitUrl : null,
          files: finalFiles,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        setProjName("");
        setProjDesc("");
        setGitUrl("");
        setUploadedFiles([]);
        fetchProjects();
      }
    } catch {} finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project workspace?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {}
  };

  const detectLanguage = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "py":
        return "python";
      case "java":
        return "java";
      case "cpp":
      case "cc":
      case "h":
        return "cpp";
      case "cs":
        return "csharp";
      case "json":
        return "json";
      case "html":
        return "html";
      case "css":
        return "css";
      case "md":
        return "markdown";
      case "sh":
        return "bash";
      default:
        return "text";
    }
  };

  const handleRealFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;

    const loadedFiles: { name: string; path: string; content: string; language: string }[] = [];
    let processed = 0;

    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      const reader = new FileReader();

      reader.onload = (event) => {
        const content = event.target?.result as string;
        const relativePath = (file as any).webkitRelativePath || file.name;

        loadedFiles.push({
          name: file.name,
          path: relativePath,
          content: content,
          language: detectLanguage(file.name),
        });

        processed++;
        if (processed === filesList.length) {
          setUploadedFiles(loadedFiles);
        }
      };

      reader.onerror = () => {
        processed++;
        if (processed === filesList.length) {
          setUploadedFiles(loadedFiles);
        }
      };

      reader.readAsText(file);
    }
  };

  const handleMockFileUpload = () => {
    // Generate mock files to simulate drop-zone file loading
    setUploadedFiles([
      { name: "index.ts", path: "src/index.ts", content: "export function run() { console.log('DocuMind uploaded project execution context'); }", language: "typescript" },
      { name: "utils.ts", path: "src/utils.ts", content: "export const hash = (data: string) => data.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);", language: "typescript" },
      { name: "config.json", path: "config.json", content: "{\n  \"engine\": \"documind-ai\",\n  \"active\": true\n}", language: "json" }
    ]);
  };

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = typeFilter === "ALL" || p.type === typeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Technical Workspaces</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build and inspect interactive catalogs from source directories or circuit sheets.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:bg-primary/95 transition-all active:scale-95 self-start sm:self-center"
        >
          <Plus size={14} /> New Project
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search projects by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: "ALL", label: "All Workspaces" },
            { id: "GIT", label: "Git Connections", icon: <GitBranch size={12} /> },
            { id: "ZIP", label: "ZIP Archives", icon: <FileArchive size={12} /> },
            { id: "SCHEMA", label: "Schematics", icon: <Cpu size={12} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                typeFilter === tab.id
                  ? "bg-secondary text-foreground border border-border shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-44 bg-muted/20 border border-border rounded-xl animate-pulse" />
          <div className="h-44 bg-muted/20 border border-border rounded-xl animate-pulse" />
          <div className="h-44 bg-muted/20 border border-border rounded-xl animate-pulse" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl max-w-xl mx-auto bg-muted/5">
          <AlertCircle className="mx-auto text-muted-foreground/60 mb-3" size={32} />
          <h3 className="font-bold text-base">No projects matches</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try revising search queries or compile a new repository source file to start index parsing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group p-6 rounded-xl border border-border glass-panel hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 flex flex-col justify-between h-44 relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded bg-muted/40 font-mono text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                    {project.type === "GIT" && <GitBranch size={10} />}
                    {project.type === "ZIP" && <FileArchive size={10} />}
                    {project.type === "SCHEMA" && <Cpu size={10} />}
                    {project.type}
                  </span>
                  <button
                    onClick={(e) => handleDelete(project.id, e)}
                    className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Delete Project"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <h3 className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors truncate">
                  {project.name}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                  {project.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-4 text-[10px] text-muted-foreground font-semibold">
                <span>{project.fileCount} scanned files</span>
                <span className="flex items-center gap-0.5 text-primary">
                  Open workspace <ChevronRight size={10} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Creation Modal Wizard */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-2xl border border-border glass-panel p-6 shadow-2xl relative bg-card text-left"
              >
                <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
                  <h2 className="font-bold text-base flex items-center gap-1.5">
                    <Sparkles size={16} className="text-primary" /> Create Project Wizard
                  </h2>
                  <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Project Workspace Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Auth Service API"
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Workspace Description (Optional)
                    </label>
                    <textarea
                      placeholder="Summarize project modules or purpose..."
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Integration Channel
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "ZIP", label: "ZIP File", icon: <FileArchive size={14} /> },
                        { id: "GIT", label: "GitHub Repo", icon: <GitBranch size={14} /> },
                        { id: "SCHEMA", label: "Circuit Schema", icon: <Cpu size={14} /> },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setProjType(t.id as any)}
                          className={`py-2 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                            projType === t.id
                              ? "border-primary bg-primary/5 text-primary shadow-sm"
                              : "border-border hover:bg-muted/10"
                          }`}
                        >
                          {t.icon}
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {projType === "GIT" && (
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        GitHub Repository URL
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/username/project-repo"
                        value={gitUrl}
                        onChange={(e) => setGitUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs transition-all"
                      />
                    </div>
                  )}

                   {projType !== "GIT" && (
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        File Source Uploader
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="cursor-pointer border border-dashed border-border rounded-xl p-4 text-center hover:bg-primary/5 hover:border-primary/30 transition-all flex flex-col items-center justify-center gap-1.5 min-h-[90px]">
                          <UploadCloud size={20} className="text-muted-foreground" />
                          <span className="text-xs font-semibold text-primary hover:underline">Upload Files</span>
                          <input
                            type="file"
                            multiple
                            onChange={handleRealFileUpload}
                            className="hidden"
                          />
                        </label>
                        <label className="cursor-pointer border border-dashed border-border rounded-xl p-4 text-center hover:bg-primary/5 hover:border-primary/30 transition-all flex flex-col items-center justify-center gap-1.5 min-h-[90px]">
                          <UploadCloud size={20} className="text-muted-foreground" />
                          <span className="text-xs font-semibold text-primary hover:underline">Upload Folder</span>
                          <input
                            type="file"
                            multiple
                            {...({ webkitdirectory: "" } as any)}
                            onChange={handleRealFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      
                      {uploadedFiles.length > 0 ? (
                        <div className="p-3 bg-muted/20 border border-border rounded-lg max-h-32 overflow-y-auto space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                            <span>Staged Files ({uploadedFiles.length})</span>
                            <button type="button" onClick={() => setUploadedFiles([])} className="text-destructive hover:underline">Clear</button>
                          </div>
                          {uploadedFiles.slice(0, 10).map((f, fi) => (
                            <div key={fi} className="text-[10px] font-mono text-muted-foreground truncate">
                              - {f.path} ({f.language})
                            </div>
                          ))}
                          {uploadedFiles.length > 10 && (
                            <div className="text-[9px] text-muted-foreground italic">
                              ... and {uploadedFiles.length - 10} more files.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-3 bg-muted/10 border border-border border-dashed rounded-lg">
                          <button
                            type="button"
                            onClick={handleMockFileUpload}
                            className="text-xs font-bold text-primary hover:underline"
                          >
                            ⚡ Use Demo Project Files (Quick Start)
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/10 transition-all disabled:opacity-50 disabled:pointer-events-none text-xs active:scale-95 mt-4"
                  >
                    {uploading ? "Analyzing Workspace..." : "Compile Project"} <ArrowRight size={14} />
                  </button>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
