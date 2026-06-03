"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, User, Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create account.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000);
      }
    } catch (err) {
      setError("Failed to communicate with authentication services.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Glow blobs */}
      <div className="glow-blob blob-indigo top-10 left-10" />
      <div className="glow-blob blob-purple bottom-10 right-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border glass-panel p-8 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Sparkles size={18} />
            </div>
            <span>DocuMind <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI</span></span>
          </Link>
          <h2 className="text-xl font-bold">Create an account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze code and document technical pipelines
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm flex items-center gap-3">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>Account created successfully! Redirecting to Sign In...</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                <User size={16} />
              </span>
              <input
                type="text"
                required
                placeholder="Alex Developer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                placeholder="developer@documind.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/10 transition-all disabled:opacity-50 disabled:pointer-events-none text-sm active:scale-95"
          >
            {loading ? "Creating..." : "Sign Up"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-primary hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
