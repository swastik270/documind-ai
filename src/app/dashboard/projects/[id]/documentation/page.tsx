"use client";

import { useEffect, useState, use } from "react";
import {
  FileText,
  Download,
  FileCode,
  CheckCircle,
  Eye,
  FileCheck,
  Printer
} from "lucide-react";

interface DocumentItem {
  id: string;
  type: string;
  title: string;
  content: string;
}

interface ProjectFile {
  id: string;
  name: string;
  path: string;
}

export default function ProjectDocumentation({
  params: paramsPromise
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const projectId = params.id;

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/projects/${projectId}/documents`).then((res) => res.json()),
      fetch(`/api/projects/${projectId}/files`).then((res) => res.json()),
    ])
      .then(([docsData, filesData]) => {
        if (Array.isArray(docsData)) {
          setDocuments(docsData);
          if (docsData.length > 0) setActiveDoc(docsData[0]);
        }
        if (Array.isArray(filesData)) setFiles(filesData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleExport = (format: "MD" | "DOCX" | "PDF") => {
    if (!activeDoc) return;
    setExporting(format);

    setTimeout(() => {
      if (format === "MD") {
        const blob = new Blob([activeDoc.content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeDoc.title.replace(/\s+/g, "_")}.md`;
        a.click();
      } else if (format === "DOCX") {
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>Document</title></head><body>";
        const footer = "</body></html>";
        const html = header + `<h1>${activeDoc.title}</h1>\n` + activeDoc.content.replace(/\n/g, "<br/>") + footer;
        const blob = new Blob([html], { type: "application/msword" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeDoc.title.replace(/\s+/g, "_")}.doc`;
        a.click();
      } else if (format === "PDF") {
        // Open print view of documentation body
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>${activeDoc.title}</title>
                <style>
                  body { font-family: sans-serif; padding: 40px; color: #111; line-height: 1.6; }
                  h1 { border-bottom: 2px solid #ddd; padding-bottom: 10px; color: #333; }
                  pre { background: #f4f4f4; padding: 15px; border-radius: 5px; font-family: monospace; overflow-x: auto; }
                  code { font-family: monospace; background: #eee; padding: 2px 4px; border-radius: 3px; }
                </style>
              </head>
              <body>
                <h1>${activeDoc.title}</h1>
                <div>${activeDoc.content.replace(/\n/g, "<br/>").replace(/```([\s\S]*?)```/g, "<pre>$1</pre>")}</div>
                <script>window.onload = function() { window.print(); window.close(); }</script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }
      setExporting(null);
    }, 800);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted/20 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-6">
          <div className="h-64 bg-muted/20 rounded animate-pulse" />
          <div className="col-span-3 h-64 bg-muted/20 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Side Files list */}
      <div className="lg:col-span-1 space-y-6">
        <div className="p-4 rounded-xl border border-border glass-panel">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Manual Layouts
          </h3>
          <div className="flex flex-col gap-1.5">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={`w-full px-3 py-2 rounded-lg text-xs font-bold text-left flex items-center gap-2 transition-all ${
                  activeDoc?.id === doc.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "border border-transparent hover:bg-muted/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText size={14} />
                {doc.title}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border glass-panel">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Scanned Source Files
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-1.5 rounded hover:bg-muted/5 truncate font-semibold"
              >
                <FileCode size={12} className="text-primary shrink-0" />
                <span className="truncate">{file.path}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Doc content */}
      <div className="lg:col-span-3 space-y-4">
        {activeDoc ? (
          <div className="p-6 sm:p-8 rounded-xl border border-border glass-panel space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-bold">{activeDoc.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  AI compiled manual context
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  onClick={() => handleExport("PDF")}
                  className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Printer size={12} /> Print PDF
                </button>
                <button
                  onClick={() => handleExport("MD")}
                  disabled={exporting !== null}
                  className="px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/95 transition-all disabled:opacity-50"
                >
                  <Download size={12} /> {exporting === "MD" ? "Exporting..." : "Export MD"}
                </button>
                <button
                  onClick={() => handleExport("DOCX")}
                  disabled={exporting !== null}
                  className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted/10 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Download size={12} /> {exporting === "DOCX" ? "Exporting..." : "DOCX"}
                </button>
              </div>
            </div>

            {/* Render doc text */}
            <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4 text-foreground/90 font-medium">
              {activeDoc.content.split("\n\n").map((para, pi) => {
                if (para.startsWith("# ")) {
                  return (
                    <h1 key={pi} className="text-2xl font-bold border-b border-border/60 pb-1.5 pt-4 text-foreground">
                      {para.replace("# ", "")}
                    </h1>
                  );
                }
                if (para.startsWith("## ")) {
                  return (
                    <h2 key={pi} className="text-lg font-bold pt-4 text-foreground">
                      {para.replace("## ", "")}
                    </h2>
                  );
                }
                if (para.startsWith("### ")) {
                  return (
                    <h3 key={pi} className="text-sm font-bold pt-2 text-foreground">
                      {para.replace("### ", "")}
                    </h3>
                  );
                }
                if (para.startsWith("- ") || para.startsWith("* ")) {
                  return (
                    <ul key={pi} className="list-disc pl-5 space-y-1">
                      {para.split("\n").map((li, lii) => (
                        <li key={lii}>{li.replace(/^[-*]\s+/, "")}</li>
                      ))}
                    </ul>
                  );
                }
                if (para.startsWith("```")) {
                  return (
                    <pre key={pi} className="bg-black/90 text-gray-300 p-4 rounded-lg font-mono text-xs overflow-x-auto my-3 border border-border/20">
                      <code>{para.replace(/```[a-zA-Z]*\n?|```$/g, "")}</code>
                    </pre>
                  );
                }
                return <p key={pi}>{para}</p>;
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-xl border border-border glass-panel text-center py-20 text-muted-foreground text-xs">
            No documentation compiled yet.
          </div>
        )}
      </div>
    </div>
  );
}
export const runtime = "nodejs";
