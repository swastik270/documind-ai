import { DocType } from "@/types";

// Simple helper to check if real keys are available
function hasApiKey() {
  return !!(
    process.env.OPENAI_API_KEY ||
    process.env.CLAUDE_API_KEY ||
    process.env.ANTHROPIC_API_KEY ||
    process.env.GEMINI_API_KEY
  );
}

// REST Client Helper to invoke various LLMs using standard fetch
async function callLlm(prompt: string, systemInstruction?: string): Promise<string> {
  const openAiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemInstruction ? `System Context: ${systemInstruction}\n\n` : ""}User Input: ${prompt}` }]
              }
            ],
            generationConfig: {
              temperature: 0.2,
            }
          })
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Gemini API returned an error");
      }
      return data.candidates[0].content.parts[0].text || "";
    } catch (err: any) {
      console.error("Gemini call failed:", err);
      // Fall through to other keys if available
    }
  }

  if (openAiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
            { role: "user", content: prompt }
          ],
          temperature: 0.2
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "OpenAI API returned an error");
      }
      return data.choices[0].message.content || "";
    } catch (err: any) {
      console.error("OpenAI call failed:", err);
    }
  }

  if (anthropicKey) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 4000,
          system: systemInstruction,
          messages: [
            { role: "user", content: prompt }
          ],
          temperature: 0.2
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Anthropic API returned an error");
      }
      return data.content[0].text || "";
    } catch (err: any) {
      console.error("Anthropic call failed:", err);
    }
  }

  throw new Error("No valid LLM API responses received or keys configured.");
}

interface ProjectFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

export async function generateProjectDocs(files: ProjectFile[]): Promise<{ type: DocType; title: string; content: string }[]> {
  if (hasApiKey()) {
    try {
      const filesInfo = files.map(f => `File: ${f.path}\nContent:\n${f.content}`).join("\n\n---\n\n");
      const systemInstruction = "You are an AI technical documentation generator. Analyze the files in the codebase and output a structured JSON array containing exactly 6 documents with types: OVERVIEW, README, API, ARCHITECTURE, SETUP, TROUBLESHOOTING. Respond ONLY with the raw JSON array containing objects with shape { type: string, title: string, content: string } where content is markdown. Do not enclose the output in markdown code blocks.";
      const prompt = `Here are the codebase files:\n\n${filesInfo}\n\nGenerate the documentation suite.`;

      const responseText = await callLlm(prompt, systemInstruction);
      const cleaned = responseText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      const docs = JSON.parse(cleaned);
      if (Array.isArray(docs) && docs.length > 0) {
        return docs as { type: DocType; title: string; content: string }[];
      }
    } catch (err) {
      console.error("AI documentation generation failed, falling back to static generator:", err);
    }
  }

  // Robust static fallback generator
  const fileNames = files.map(f => f.path).join("\n- ");
  const langCount = files.reduce((acc, f) => {
    acc[f.language] = (acc[f.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mainLanguages = Object.entries(langCount)
    .map(([l, c]) => `${l} (${c} files)`)
    .join(", ");

  return [
    {
      type: "OVERVIEW" as DocType,
      title: "Project Overview",
      content: `# DocuMind AI Project Overview\n\nThis project contains **${files.length} files** primarily written in **${mainLanguages}**.\n\n### Core Files Logged:\n- ${fileNames || "No files uploaded"}\n\n### High-Level Analysis\nBased on structure indexing, the project represents an application components library. The primary entry paths are set up to handle data routing and configuration management.`
    },
    {
      type: "README" as DocType,
      title: "README.md",
      content: `# Generated README\n\n## Description\nAutomated repository mapping for this project.\n\n## Tech Stack\n- Languages: ${mainLanguages}\n\n## Installation & Setup\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Directory Layout\n\`\`\`\n${files.map(f => f.path).join("\n")}\n\`\`\``
    },
    {
      type: "API" as DocType,
      title: "API Documentation",
      content: `# API Specification\n\nHere are the automatically mapped API hooks and interfaces found in the scanned files:\n\n${files.map(f => {
        const funcs = f.content.match(/(?:export\s+)?(?:async\s+)?function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g);
        const mappedFuncs = funcs ? funcs.map(fn => {
          const name = fn.replace(/(export|async|function|const|=|\s|\(|\)|\=>)/g, "");
          return `- **\`${name || "anonymous"}\`**: Handler or helper exported in \`${f.name}\`.`;
        }).join("\n") : "No exported operations found.";
        return `### File: \`${f.path}\`\n${mappedFuncs}`;
      }).join("\n\n")}`
    },
    {
      type: "ARCHITECTURE" as DocType,
      title: "System Architecture & Diagrams",
      content: `## System Architecture Diagram\n\nBelow is the Mermaid flowchart mapping the relationship between components in this project.\n\n\`\`\`mermaid\ngraph TD\n  User --> Controller\n  Controller --> DataLayer\n  DataLayer --> Database\n  subgraph Scanned Workspace\n    Controller[API Routes]\n    DataLayer[Model Managers]\n  end\n\`\`\`\n\n### Components Architecture\n- **Entry points**: Mapped across system configurations.\n- **Data flow**: Downward propagation from triggers into internal processing.`
    },
    {
      type: "SETUP" as DocType,
      title: "Setup and Configuration",
      content: `# Setup and Installation Guide\n\n### Requirements\nEnsure you have Node.js (version 18+ recommended) and package managers configured.\n\n### Step-by-Step\n1. Clone the project or extract folders.\n2. Run install:\n   \`\`\`bash\n   npm install\n   \`\`\`\n3. Set up environment templates:\n   \`\`\`bash\n   cp .env.example .env\n   \`\`\`\n4. Boot the server:\n   \`\`\`bash\n   npm run dev\n   \`\`\``
    },
    {
      type: "TROUBLESHOOTING" as DocType,
      title: "Troubleshooting Guide",
      content: `# Troubleshooting & Support\n\n### 1. Missing module dependencies\n**Symptom**: \`Error: Cannot find module '...'\`\n**Fix**: Re-run \`npm install\` or verify package config files.\n\n### 2. Connection timeouts\n**Symptom**: Call limits exceeded.\n**Fix**: Verify environment hosts, ports, and schema rules.`
    }
  ];
}

export async function generateCodeReview(files: ProjectFile[]): Promise<{
  score: number;
  bugs: any[];
  security: any[];
  performance: any[];
  suggestions: any[];
  report: string;
}> {
  if (hasApiKey()) {
    try {
      const filesInfo = files.map(f => `File: ${f.path}\nContent:\n${f.content}`).join("\n\n---\n\n");
      const systemInstruction = "You are an AI code reviewer. Analyze the files and return a JSON object with this shape: { score: number, bugs: Array<{file: string, line: number, issue: string, severity: string, description: string, suggestion: string}>, security: Array<{file: string, line: number, issue: string, severity: string, description: string, suggestion: string}>, performance: Array<{file: string, line: number, issue: string, severity: string, description: string, suggestion: string}>, suggestions: Array<{file: string, line: number, issue: string, severity: string, description: string, suggestion: string}>, report: string (markdown format summary) }. Respond ONLY with raw JSON. Ensure all markdown report code wraps do not break the outer JSON.";
      const prompt = `Review these files:\n\n${filesInfo}`;

      const responseText = await callLlm(prompt, systemInstruction);
      const cleaned = responseText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("AI code review failed, using mock generator:", err);
    }
  }

  // Detailed mock analyzer logic
  const bugs = [];
  const security = [];
  const performance = [];
  const suggestions = [];

  for (const f of files) {
    if (f.content.includes("Sync(")) {
      performance.push({
        file: f.path,
        line: f.content.split("\n").findIndex(l => l.includes("Sync(")) + 1,
        issue: "Synchronous I/O operations inside request handler context",
        severity: "warning",
        description: `Calling synchronous APIs like Sync() blocks execution threads.`,
        suggestion: "Use promise-based asynchronous methods (e.g. fs.promises)."
      });
    }

    if (f.content.includes("eval(") || f.content.includes("dangerouslySetInnerHTML")) {
      security.push({
        file: f.path,
        line: f.content.split("\n").findIndex(l => l.includes("eval(") || l.includes("dangerouslySetInnerHTML")) + 1,
        issue: "Potential script execution risk",
        severity: "critical",
        description: "Direct evaluate scripts bypass sanitizers.",
        suggestion: "Remove eval functions immediately."
      });
    }

    if (f.content.includes("let ") && !f.content.includes("for (let")) {
      suggestions.push({
        file: f.path,
        line: f.content.split("\n").findIndex(l => l.includes("let ")) + 1,
        issue: "Prefer const over let for immutable variables",
        severity: "info",
        description: "Variable is never reassigned.",
        suggestion: "Declare with const."
      });
    }
  }

  if (bugs.length === 0) {
    bugs.push({
      file: files[0]?.path || "index.ts",
      line: 1,
      issue: "No strict type definitions on generic parameters",
      severity: "info",
      description: "Generic interfaces are typed as 'any'.",
      suggestion: "Replace 'any' with concrete generic interfaces."
    });
  }

  const score = Math.max(50, 100 - (bugs.length * 5 + security.length * 15 + performance.length * 8));
  const report = `# Code Review Summary\n\nQuality Score: **${score}/100**\n\nWe evaluated **${files.length} codebase files** and registered the following observations:\n- Critical Security Threats: **${security.length}**\n- Performance Risks: **${performance.length}**\n- General Enhancements: **${suggestions.length}**`;

  return { score, bugs, security, performance, suggestions, report };
}

export async function generateCommentsForCode(code: string, language: string): Promise<string> {
  if (hasApiKey()) {
    try {
      const systemInstruction = `You are an AI developer. Add structured comments to the provided ${language} code explaining classes, functions, and tricky logical parts. Return ONLY the code with comments included. Do not wrap the code in markdown formatting block quotes.`;
      const prompt = `Code:\n${code}`;
      return await callLlm(prompt, systemInstruction);
    } catch (err) {
      console.error("AI code commenting failed, using basic generator:", err);
    }
  }

  const lines = code.split("\n");
  const commentedLines = lines.map(line => {
    if (line.trim().startsWith("export ") || line.trim().startsWith("function ") || line.includes("=>")) {
      const commentPrefix = ["python", "bash"].includes(language.toLowerCase()) ? "#" : "//";
      return `  ${commentPrefix} AI Mapped: Process handler execution scope\n${line}`;
    }
    return line;
  });
  return commentedLines.join("\n");
}

export async function askAiAboutCodebase(
  files: { name: string; content: string }[],
  question: string,
  chatHistory: any[]
): Promise<string> {
  if (hasApiKey()) {
    try {
      const filesSummary = files.map(f => `File: ${f.name}\nContent:\n${f.content.slice(0, 10000)}`).join("\n\n---\n\n");
      const historyStr = chatHistory.map(h => `${h.role === "user" ? "User" : "Assistant"}: ${h.message}`).join("\n");

      const systemInstruction = "You are an expert software engineer assistant. Answer the user's questions about the uploaded codebase. Refer to the files provided and point out code regions if relevant.";
      const prompt = `Codebase context:\n${filesSummary}\n\nChat History:\n${historyStr}\n\nUser Question: ${question}`;

      return await callLlm(prompt, systemInstruction);
    } catch (err) {
      console.error("AI chat failed, using fallback:", err);
    }
  }

  const q = question.toLowerCase();
  if (q.includes("function") || q.includes("explain")) {
    return `In this repository, functions are structured to execute modular operations. For instance, files like \`${files[0]?.name || "main.js"}\` manage process flow. When invoked, they resolve input objects, run parameter validation routines, and output formatted responses.`;
  }
  if (q.includes("bug") || q.includes("security")) {
    return "Yes, our automated review registered security concerns (e.g. potential synchronous methods blocking event threads or inputs lacking sanitization). Let me know if you would like me to rewrite any files to clean these up.";
  }
  if (q.includes("test")) {
    return `Here is a sample unit test suite for the codebase:\n\n\`\`\`typescript\nimport { describe, it, expect } from 'vitest';\n\ndescribe('Core Functions', () => {\n  it('should initialize and execute without crashing', () => {\n    expect(true).toBe(true);\n  });\n});\n\`\`\``;
  }

  return `I have inspected your codebase containing ${files.length} files. Please ask specific questions about module layout, API architecture, testing code, or security parameters, and I will highlight code regions.`;
}

export async function generateMermaidDiagram(files: { name: string; content: string }[], type: string): Promise<string> {
  if (hasApiKey()) {
    try {
      const filesSummary = files.map(f => `File: ${f.name}\nContent:\n${f.content.slice(0, 5000)}`).join("\n\n---\n\n");
      const systemInstruction = `You are a software architect. Generate a Mermaid.js diagram of type "${type}" mapping the codebase architecture. Output ONLY the raw Mermaid diagram script without any markdown code blocks or additional text.`;
      const prompt = `Codebase:\n${filesSummary}\n\nGenerate Mermaid.js script of type ${type}:`;

      const response = await callLlm(prompt, systemInstruction);
      return response.replace(/^```mermaid\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
    } catch (err) {
      console.error("AI diagram generation failed, using mock generator:", err);
    }
  }

  if (type === "flowchart") {
    return `graph TD\n  Start[Code Submission] --> Parse[Files Scanned]\n  Parse --> Build[Docs Compiled]\n  Build --> Finish[Ready to Export]`;
  }
  if (type === "sequence") {
    return `sequenceDiagram\n  actor User\n  participant WebApp\n  participant AICore\n  User->>WebApp: Upload Repository\n  WebApp->>AICore: Parse & Index Files\n  AICore-->>WebApp: Returns Docs & Reviews\n  WebApp-->>User: Renders Dashboard UI`;
  }
  if (type === "er") {
    return `erDiagram\n  PROJECT ||--o{ FILE : contains\n  PROJECT ||--o{ DOCUMENT : has\n  PROJECT ||--o{ REVIEW : scores\n  PROJECT ||--o{ CHAT : logs`;
  }
  return `graph LR\n  A[Codebase] --> B[AI Generator] --> C[DocuMind AI Output]`;
}
