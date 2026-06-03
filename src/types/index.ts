export type UserRole = "USER" | "ADMIN";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  createdAt: string;
}

export type ProjectType = "GIT" | "ZIP" | "SCHEMA";
export type ProjectStatus = "PENDING" | "ANALYZING" | "COMPLETED" | "FAILED";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  type: ProjectType;
  status: ProjectStatus;
  sourceUrl: string | null;
  tokenUsage: number;
  fileCount: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  projectId: string;
  createdAt: string;
}

export type DocType =
  | "OVERVIEW"
  | "README"
  | "API"
  | "MODULES"
  | "ARCHITECTURE"
  | "DATABASE"
  | "SETUP"
  | "USER_GUIDE"
  | "TROUBLESHOOTING";

export interface ProjectDocument {
  id: string;
  type: DocType;
  title: string;
  content: string;
  projectId: string;
  createdAt: string;
}

export interface ReviewItem {
  file: string;
  line?: number;
  issue: string;
  severity: "critical" | "warning" | "info";
  description: string;
  suggestion: string;
}

export interface CodeReview {
  id: string;
  score: number;
  bugs: ReviewItem[];
  security: ReviewItem[];
  performance: ReviewItem[];
  suggestions: ReviewItem[];
  report: string;
  projectId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  message: string;
  projectId: string;
  createdAt: string;
}

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  userId: string;
  createdAt: string;
}

export interface ProjectExport {
  id: string;
  format: "PDF" | "MD" | "DOCX";
  downloadUrl: string | null;
  projectId: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalProjects: number;
  docsGenerated: number;
  totalTokens: number;
  recentActivity: {
    id: string;
    description: string;
    timestamp: string;
    type: "project" | "document" | "review" | "chat";
  }[];
  monthlyUsage: { month: string; tokens: number; docs: number }[];
}
