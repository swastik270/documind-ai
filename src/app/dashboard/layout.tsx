"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  LayoutDashboard,
  FolderKanban,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Search,
  Check
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch notifications
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setNotifications(data);
        })
        .catch(() => {});
    }
  }, [status]);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/read", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {}
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading DocuMind Workspace...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const user = session?.user;
  const isAdmin = (user as any)?.role === "ADMIN";

  const navLinks = [
    { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Projects", href: "/dashboard/projects", icon: <FolderKanban size={18} /> },
    { label: "Profile", href: "/dashboard/profile", icon: <User size={18} /> },
  ];

  if (isAdmin) {
    navLinks.push({ label: "Admin Panel", href: "/dashboard/admin", icon: <Settings size={18} /> });
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden relative">
      {/* Glow blobs */}
      <div className="glow-blob blob-indigo top-0 left-0" />
      <div className="glow-blob blob-purple bottom-0 right-0" />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-border transform transition-transform duration-300 md:translate-x-0 flex flex-col justify-between ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <div className="w-6.5 h-6.5 rounded-md bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20">
                <Sparkles size={14} />
              </div>
              <span>DocuMind <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI</span></span>
            </Link>
            <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Sign Out */}
        <div className="p-4 border-t border-border flex flex-col gap-3 bg-muted/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-inner">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold truncate">{user?.name || "Developer"}</h4>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full py-2 px-4 rounded-lg bg-secondary hover:bg-destructive/10 hover:text-destructive text-muted-foreground font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <LogOut size={12} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border glass-panel sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-foreground md:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block w-64 md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary text-xs transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Notifications panel */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full glass-card hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center w-9 h-9 relative"
                aria-label="Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full ring-2 ring-background animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    {/* Overlay to close */}
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-xl border border-border glass-panel shadow-2xl p-4 z-50 text-left"
                    >
                      <div className="flex items-center justify-between border-b border-border pb-2.5 mb-2.5">
                        <span className="font-bold text-sm">Notifications ({unreadCount})</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
                            <Check size={12} /> Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-6">No notifications found.</p>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-2.5 rounded-lg border text-xs relative group ${
                                notif.read
                                  ? "border-border/40 bg-muted/5 opacity-80"
                                  : "border-primary/20 bg-primary/5"
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2 mb-1">
                                <span className="font-bold truncate">{notif.title}</span>
                                <button
                                  onClick={() => deleteNotification(notif.id)}
                                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                              <p className="text-muted-foreground leading-relaxed mb-1">{notif.message}</p>
                              <span className="text-[10px] text-muted-foreground/60">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Pages */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
