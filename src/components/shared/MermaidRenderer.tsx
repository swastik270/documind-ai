"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidRendererProps {
  code: string;
}

export function MermaidRenderer({ code }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!code || !containerRef.current) return;
    setError(false);
    setSvg("");

    // Dynamic import to prevent SSR issues
    import("mermaid")
      .then((mermaid) => {
        mermaid.default.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "Inter, sans-serif",
        });

        const id = "mermaid-" + Math.random().toString(36).substr(2, 9);
        
        try {
          mermaid.default.render(id, code).then(({ svg }) => {
            setSvg(svg);
          }).catch(() => {
            setError(true);
          });
        } catch {
          setError(true);
        }
      })
      .catch(() => {
        setError(true);
      });
  }, [code]);

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono whitespace-pre overflow-x-auto my-3">
        {code}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center p-6 bg-muted/20 border border-border rounded-xl min-h-[260px] overflow-auto">
      <div ref={containerRef} className="hidden" />
      {svg ? (
        <div
          className="w-full max-w-full flex justify-center scale-95 sm:scale-100"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <span className="text-[10px] text-muted-foreground">Rendering diagram...</span>
        </div>
      )}
    </div>
  );
}
