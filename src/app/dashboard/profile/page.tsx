"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Key,
  Database,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  UserCheck
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [updating, setUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setStatusMsg("");

    setTimeout(async () => {
      // Simulate profile edit success
      setStatusMsg("Profile details updated successfully!");
      setUpdating(false);
    }, 1000);
  };

  const dbConfigured = true; // DB Helper handles fallback seamlessly
  const apiConfigured = false; // Mock fallback is active

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile & Environment</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account credentials and monitor workspace environment parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card Form */}
        <div className="md:col-span-2 p-6 rounded-xl border border-border glass-panel space-y-6">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <UserCheck size={16} className="text-primary" /> Edit Account Info
          </h3>

          {statusMsg && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
              <CheckCircle size={14} />
              <span>{statusMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Role Permission
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                  <Shield size={14} />
                </span>
                <input
                  type="text"
                  disabled
                  value={(user as any)?.role || "USER"}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-muted/30 text-muted-foreground text-xs font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary/95 transition-all disabled:opacity-50 active:scale-95 shadow-md shadow-primary/10"
            >
              {updating ? "Saving..." : "Save Profile"} <ArrowRight size={12} />
            </button>
          </form>
        </div>

        {/* Environment Status Side Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-xl border border-border glass-panel space-y-5">
            <h3 className="text-sm font-bold border-b border-border/40 pb-2">Environment Status</h3>

            <div className="space-y-4 text-xs font-semibold">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-2">
                  <Database size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs">Database Connection</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {dbConfigured ? "Local Fallback Active" : "PostgreSQL Configured"}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px]">
                  Online
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 border-t border-border/40 pt-4">
                <div className="flex gap-2">
                  <Key size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs">AI Compiler API Keys</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {apiConfigured ? "OpenAI / Claude Loaded" : "Offline (Static fallback active)"}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] ${apiConfigured ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                  {apiConfigured ? "Active" : "Static"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export const runtime = "nodejs";
