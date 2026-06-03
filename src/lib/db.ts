import fs from "fs";
import path from "path";
import { prisma } from "./prisma";
import {
  Project,
  ProjectFile,
  ProjectDocument,
  CodeReview,
  ChatMessage,
  AppNotification,
  ProjectExport
} from "@/types";

// Location of local JSON file database fallback
const LOCAL_DB_PATH = path.join(process.cwd(), "local_db.json");

// Helper to determine if we should use local file DB
function useLocalDb(): boolean {
  return !process.env.DATABASE_URL;
}

interface MockDb {
  users: any[];
  projects: Project[];
  files: ProjectFile[];
  documents: ProjectDocument[];
  reviews: CodeReview[];
  chats: ChatMessage[];
  notifications: AppNotification[];
  exports: ProjectExport[];
}

// Initial mockup data
const DEFAULT_MOCK_DATA: MockDb = {
  users: [
    {
      id: "demo-user",
      name: "Alex Developer",
      email: "demo@documind.ai",
      password: "$2a$10$k1Z6Qk1Z6Qk1Z6Qk1Z6QkuS6vH4l.2.V2U1zJzVzQ72L3V8R4M4qC", // hashed of "password"
      role: "ADMIN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  projects: [
    {
      id: "demo-project",
      name: "DocuMind Core Engine",
      description: "Core compiler and AI parser library for technical repository documentation.",
      type: "GIT",
      status: "COMPLETED",
      sourceUrl: "https://github.com/documind/core-engine",
      tokenUsage: 124500,
      fileCount: 4,
      userId: "demo-user",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    }
  ],
  files: [
    {
      id: "file-1",
      name: "parser.ts",
      path: "src/compiler/parser.ts",
      content: `import fs from 'fs';\nimport path from 'path';\n\nexport async function parseRepository(dirPath: string) {\n  const files = fs.readdirSync(dirPath);\n  let results = [];\n  for (const file of files) {\n    const fullPath = path.join(dirPath, file);\n    if (fs.statSync(fullPath).isDirectory()) {\n      results = results.concat(await parseRepository(fullPath));\n    } else {\n      results.push({\n        name: file,\n        path: fullPath,\n        content: fs.readFileSync(fullPath, 'utf8')\n      });\n    }\n  }\n  return results;\n}`,
      language: "typescript",
      projectId: "demo-project",
      createdAt: new Date().toISOString(),
    },
    {
      id: "file-2",
      name: "auth.ts",
      path: "src/lib/auth.ts",
      content: `import NextAuth from 'next-auth';\nimport CredentialsProvider from 'next-auth/providers/credentials';\n\nexport const authOptions = {\n  providers: [\n    CredentialsProvider({\n      name: 'Credentials',\n      credentials: {\n        email: { label: 'Email', type: 'text' },\n        password: { label: 'Password', type: 'password' }\n      },\n      async authorize(credentials) {\n        return { id: '1', name: 'Demo User', email: 'demo@documind.ai' };\n      }\n    })\n  ],\n  session: { strategy: 'jwt' }\n};`,
      language: "typescript",
      projectId: "demo-project",
      createdAt: new Date().toISOString(),
    }
  ],
  documents: [
    {
      id: "doc-1",
      type: "README",
      title: "README.md",
      content: `# DocuMind Core Engine\n\nThis repository houses the parsing and compilation module for the DocuMind technical generator system.\n\n## Features\n- Direct repository indexing\n- Parallel file parsing\n- Extensible syntax support\n\n## Quick Start\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``,
      projectId: "demo-project",
      createdAt: new Date().toISOString(),
    },
    {
      id: "doc-2",
      type: "ARCHITECTURE",
      title: "System Architecture",
      content: `## System Architecture Diagram\n\nThis system acts as a translator between complex code directories and vector representations. It follows a multi-tier pipeline:\n\n1. **Ingestor Node**: Receives ZIP files or pulls Github checkouts.\n2. **Parser Service**: Extracts function scopes and exports in JS, TS, Python.\n3. **AI Compiler**: Contextualizes code blocks with Large Language Models.\n4. **Mermaid Engine**: Inspects relational interfaces to outline system design charts.`,
      projectId: "demo-project",
      createdAt: new Date().toISOString(),
    }
  ],
  reviews: [
    {
      id: "review-1",
      score: 82,
      bugs: [
        {
          file: "src/compiler/parser.ts",
          line: 5,
          issue: "Synchronous directory access blocks main event loop",
          severity: "warning",
          description: "Using fs.readdirSync and fs.readFileSync blocks runtime worker execution. This reduces system throughput significantly.",
          suggestion: "Refactor to use fs.promises.readdir and fs.promises.readFile with async/await."
        }
      ],
      security: [
        {
          file: "src/compiler/parser.ts",
          line: 8,
          issue: "Path traversal vulnerability risk",
          severity: "critical",
          description: "Joining direct client-supplied filenames to paths can allow absolute directory traversal if input is unvalidated.",
          suggestion: "Use path.resolve and check if the resolved path starts with the designated sandbox repository directory."
        }
      ],
      performance: [
        {
          file: "src/compiler/parser.ts",
          line: 6,
          issue: "Sequential async loop executes slowly",
          severity: "warning",
          description: "Using await within a standard for loop processes subdirectories sequentially rather than concurrently.",
          suggestion: "Wrap tasks in Promise.all and map directory entries to reduce total analysis latency."
        }
      ],
      suggestions: [
        {
          file: "src/lib/auth.ts",
          line: 12,
          issue: "Hardcoded credential return in mock provider",
          severity: "info",
          description: "The authentication provider returns a static user token bypassing database query validations.",
          suggestion: "Replace credentials handler with an interactive bcrypt database verification call."
        }
      ],
      report: "# AI Code Audit Report\n\nDocuMind AI checked 4 codebase files. Here are the core metrics:\n- **Security Status**: Critical threat detected (1 Path Traversal risk).\n- **Performance**: High latency risk in repository parser loops.\n\n### Recommendation Summary\nImplement async filesystem APIs and sanitize directory input nodes immediately.",
      projectId: "demo-project",
      createdAt: new Date().toISOString(),
    }
  ],
  chats: [
    {
      id: "chat-1",
      role: "user",
      message: "Can you explain how `parseRepository` handles subdirectory recursion?",
      projectId: "demo-project",
      createdAt: new Date(Date.now() - 1000 * 60).toISOString(),
    },
    {
      id: "chat-2",
      role: "assistant",
      message: "The `parseRepository` function handles directories recursively by: \n1. Reading the immediate contents using `fs.readdirSync`.\n2. Checking if each path is a directory via `fs.statSync(fullPath).isDirectory()`.\n3. If it is a directory, it recursively calls `parseRepository(fullPath)` and concatenates the resulting array to `results`.\n4. Otherwise, it pushes file records containing path and text contents.",
      projectId: "demo-project",
      createdAt: new Date().toISOString(),
    }
  ],
  notifications: [
    {
      id: "notif-1",
      title: "Workspace Created",
      message: "Welcome to DocuMind AI! Explore the dashboard or connect a codebase to generate documentation.",
      type: "SUCCESS",
      read: false,
      userId: "demo-user",
      createdAt: new Date().toISOString(),
    }
  ],
  exports: []
};

// Write helper
function saveLocalDb(data: typeof DEFAULT_MOCK_DATA) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write local JSON DB:", err);
  }
}

// Load helper
function loadLocalDb(): typeof DEFAULT_MOCK_DATA {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    saveLocalDb(DEFAULT_MOCK_DATA);
    return DEFAULT_MOCK_DATA;
  }
  try {
    const raw = fs.readFileSync(LOCAL_DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read local JSON DB, returning defaults:", err);
    return DEFAULT_MOCK_DATA;
  }
}

// Database helper endpoints mimicking standard prisma queries
export const db = {
  // Users
  getUserByEmail: async (email: string) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      return data.users.find((u) => u.email === email) || null;
    }
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch {
      return loadLocalDb().users.find((u) => u.email === email) || null;
    }
  },

  createUser: async (payload: any) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      const newUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        name: payload.name || "User",
        email: payload.email,
        password: payload.password,
        role: payload.role || "USER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.users.push(newUser);
      saveLocalDb(data);
      return newUser;
    }
    try {
      return await prisma.user.create({ data: payload });
    } catch {
      return null;
    }
  },

  updateUserPassword: async (email: string, passwordHash: string) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      const user = data.users.find((u) => u.email === email);
      if (user) {
        user.password = passwordHash;
        user.updatedAt = new Date().toISOString();
        saveLocalDb(data);
        return true;
      }
      return false;
    }
    try {
      await prisma.user.update({
        where: { email },
        data: { password: passwordHash },
      });
      return true;
    } catch {
      const data = loadLocalDb();
      const user = data.users.find((u) => u.email === email);
      if (user) {
        user.password = passwordHash;
        user.updatedAt = new Date().toISOString();
        saveLocalDb(data);
        return true;
      }
      return false;
    }
  },

  // Projects
  getProjects: async (userId: string) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      return data.projects.filter((p) => p.userId === userId);
    }
    try {
      return await prisma.project.findMany({ where: { userId } });
    } catch {
      return loadLocalDb().projects.filter((p) => p.userId === userId);
    }
  },

  getProjectById: async (id: string) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      return data.projects.find((p) => p.id === id) || null;
    }
    try {
      return await prisma.project.findUnique({ where: { id } });
    } catch {
      return loadLocalDb().projects.find((p) => p.id === id) || null;
    }
  },

  createProject: async (payload: {
    name: string;
    description?: string;
    type: "GIT" | "ZIP" | "SCHEMA";
    sourceUrl?: string;
    userId: string;
    fileCount?: number;
  }) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      const newProj = {
        id: "proj-" + Math.random().toString(36).substr(2, 9),
        name: payload.name,
        description: payload.description || "",
        type: payload.type,
        status: "COMPLETED" as const, // For mock DB, auto-complete
        sourceUrl: payload.sourceUrl || null,
        tokenUsage: Math.floor(Math.random() * 40000) + 15000,
        fileCount: payload.fileCount || 2,
        userId: payload.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.projects.push(newProj);
      saveLocalDb(data);
      return newProj;
    }
    try {
      return await prisma.project.create({
        data: {
          name: payload.name,
          description: payload.description,
          type: payload.type,
          status: "COMPLETED",
          sourceUrl: payload.sourceUrl,
          userId: payload.userId,
          fileCount: payload.fileCount || 0,
        },
      });
    } catch {
      return null;
    }
  },

  deleteProject: async (id: string) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      data.projects = data.projects.filter((p) => p.id !== id);
      data.files = data.files.filter((f) => f.projectId !== id);
      data.documents = data.documents.filter((d) => d.projectId !== id);
      data.reviews = data.reviews.filter((r) => r.projectId !== id);
      data.chats = data.chats.filter((c) => c.projectId !== id);
      saveLocalDb(data);
      return true;
    }
    try {
      await prisma.project.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  // Files
  getProjectFiles: async (projectId: string) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      return data.files.filter((f) => f.projectId === projectId);
    }
    try {
      return await prisma.file.findMany({ where: { projectId } });
    } catch {
      return loadLocalDb().files.filter((f) => f.projectId === projectId);
    }
  },

  createFiles: async (filesList: any[]) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      const records = filesList.map((f) => ({
        id: "file-" + Math.random().toString(36).substr(2, 9),
        ...f,
        createdAt: new Date().toISOString(),
      }));
      data.files = data.files.concat(records);
      saveLocalDb(data);
      return records;
    }
    try {
      await prisma.file.createMany({ data: filesList });
      return filesList;
    } catch {
      return filesList;
    }
  },

  // Documents
  getProjectDocuments: async (projectId: string) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      return data.documents.filter((d) => d.projectId === projectId);
    }
    try {
      return await prisma.document.findMany({ where: { projectId } });
    } catch {
      return loadLocalDb().documents.filter((d) => d.projectId === projectId);
    }
  },

  createDocument: async (payload: any) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      const newDoc = {
        id: "doc-" + Math.random().toString(36).substr(2, 9),
        ...payload,
        createdAt: new Date().toISOString(),
      };
      data.documents.push(newDoc);
      saveLocalDb(data);
      return newDoc;
    }
    try {
      return await prisma.document.create({ data: payload });
    } catch {
      return null;
    }
  },

  // Reviews
  getProjectReview: async (projectId: string) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      return data.reviews.find((r) => r.projectId === projectId) || null;
    }
    try {
      return await prisma.review.findFirst({ where: { projectId } });
    } catch {
      return loadLocalDb().reviews.find((r) => r.projectId === projectId) || null;
    }
  },

  createReview: async (payload: any) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      const newRev = {
        id: "rev-" + Math.random().toString(36).substr(2, 9),
        ...payload,
        createdAt: new Date().toISOString(),
      };
      data.reviews.push(newRev);
      saveLocalDb(data);
      return newRev;
    }
    try {
      return await prisma.review.create({ data: payload });
    } catch {
      return null;
    }
  },

  // Chats
  getProjectChats: async (projectId: string) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      return data.chats.filter((c) => c.projectId === projectId);
    }
    try {
      return await prisma.chat.findMany({ where: { projectId }, orderBy: { createdAt: "asc" } });
    } catch {
      return loadLocalDb().chats.filter((c) => c.projectId === projectId);
    }
  },

  createChat: async (payload: any) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      const newChat = {
        id: "chat-" + Math.random().toString(36).substr(2, 9),
        ...payload,
        createdAt: new Date().toISOString(),
      };
      data.chats.push(newChat);
      saveLocalDb(data);
      return newChat;
    }
    try {
      return await prisma.chat.create({ data: payload });
    } catch {
      return null;
    }
  },

  // Notifications
  getNotifications: async (userId: string) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      return data.notifications.filter((n) => n.userId === userId);
    }
    try {
      return await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    } catch {
      return loadLocalDb().notifications.filter((n) => n.userId === userId);
    }
  },

  createNotification: async (payload: any) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      const newNotif = {
        id: "notif-" + Math.random().toString(36).substr(2, 9),
        ...payload,
        read: false,
        createdAt: new Date().toISOString(),
      };
      data.notifications.unshift(newNotif);
      saveLocalDb(data);
      return newNotif;
    }
    try {
      return await prisma.notification.create({ data: payload });
    } catch {
      return null;
    }
  },

  markNotificationRead: async (id: string) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      const notif = data.notifications.find((n) => n.id === id);
      if (notif) notif.read = true;
      saveLocalDb(data);
      return true;
    }
    try {
      await prisma.notification.update({ where: { id }, data: { read: true } });
      return true;
    } catch {
      return false;
    }
  },

  deleteNotification: async (id: string) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      data.notifications = data.notifications.filter((n) => n.id !== id);
      saveLocalDb(data);
      return true;
    }
    try {
      await prisma.notification.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  // Exports
  getExports: async (projectId: string) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      return data.exports.filter((e) => e.projectId === projectId);
    }
    try {
      return await prisma.export.findMany({ where: { projectId } });
    } catch {
      return loadLocalDb().exports.filter((e) => e.projectId === projectId);
    }
  },

  createExport: async (payload: any) => {
    if (useLocalDb()) {
      const data = loadLocalDb();
      const newExport = {
        id: "exp-" + Math.random().toString(36).substr(2, 9),
        ...payload,
        createdAt: new Date().toISOString(),
      };
      data.exports.push(newExport);
      saveLocalDb(data);
      return newExport;
    }
    try {
      return await prisma.export.create({ data: payload });
    } catch {
      return null;
    }
  }
};
