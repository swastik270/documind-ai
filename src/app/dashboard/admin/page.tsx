"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Settings,
  Database,
  Cpu,
  Shield,
  Activity,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  RefreshCw,
  Trash2
} from "lucide-react";

interface UserItem {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
}

export default function AdminPanel() {
  const { data: session } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(true);
  const [logs, setLogs] = useState<{ id: string; msg: string; time: string }[]>([
    { id: "1", msg: "AI model parsing catalog index request received", time: "01:54:10" },
    { id: "2", msg: "Prisma client successfully resolved PostgreSQL models", time: "01:55:01" },
    { id: "3", msg: "Token compiler executed 12,450 processing units", time: "01:56:45" },
  ]);

  // Redirect if not admin
  useEffect(() => {
    if (session?.user && (session.user as any).role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [session, router]);

  useEffect(() => {
    // Generate mock users list based on session
    const list: UserItem[] = [
      {
        id: "demo-user",
        name: "Alex Developer",
        email: "demo@documind.ai",
        role: "ADMIN",
        createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      },
      {
        id: "user-2",
        name: "Sarah Smith",
        email: "sarah@company.com",
        role: "USER",
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      },
      {
        id: "user-3",
        name: "Devon Miller",
        email: "devon@startup.io",
        role: "USER",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      }
    ];
    setUsers(list);
    setLoading(false);
  }, []);

  const toggleRole = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return { ...u, role: u.role === "ADMIN" ? "USER" : "ADMIN" };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (id: string) => {
    if (id === "demo-user") {
      alert("Cannot delete primary demo admin account.");
      return;
    }
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Control Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor active user directory listings, manage global settings, and track pipeline logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Users Management */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-border glass-panel space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Users size={16} className="text-primary" /> User Directories
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-muted-foreground font-semibold pb-3">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3 text-center">Permissions</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/5">
                    <td className="py-3 font-bold text-foreground">
                      {u.name || "Anonymous"}
                    </td>
                    <td className="py-3 text-muted-foreground">{u.email}</td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => toggleRole(u.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-muted/50 text-muted-foreground border border-border"
                        }`}
                      >
                        {u.role}
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                        aria-label="Delete User"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-xl border border-border glass-panel space-y-5">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Settings size={16} className="text-primary" /> System Settings
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs">AI Mock Sandbox Mode</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Bypasses OpenAI rate limits
                  </p>
                </div>
                <button onClick={() => setSandboxMode(!sandboxMode)} aria-label="Toggle Sandbox Mode">
                  {sandboxMode ? (
                    <ToggleRight size={32} className="text-primary" />
                  ) : (
                    <ToggleLeft size={32} className="text-muted-foreground" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border/40 pt-4">
                <div>
                  <h4 className="text-xs">Autoscale Server workers</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Adjust processing threads dynamically
                  </p>
                </div>
                <ToggleRight size={32} className="text-primary" />
              </div>
            </div>
          </div>

          {/* Telemetry Monitor */}
          <div className="p-6 rounded-xl border border-border glass-panel space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Activity size={16} className="text-primary" /> Telemetry Monitor
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1 font-semibold text-muted-foreground">
                  <span>Server CPU Load</span>
                  <span>42%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: "42%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold text-muted-foreground">
                  <span>Memory Allocations</span>
                  <span>1.2GB / 4.0GB</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-fuchsia-500 rounded-full" style={{ width: "30%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export const runtime = "nodejs";
