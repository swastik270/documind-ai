"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-6">
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
          <h2 className="text-xl font-bold">Reset Password</h2>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Enter your email to receive a recovery link.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm flex items-center gap-3 text-left">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>Password recovery instructions have been sent to your email.</span>
            </div>
            <Link href="/auth/signin" className="inline-block text-xs font-bold text-primary hover:underline">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="demo@documind.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/10 transition-all disabled:opacity-50 disabled:pointer-events-none text-sm active:scale-95"
            >
              {loading ? "Sending link..." : "Send Reset Link"} <ArrowRight size={16} />
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
export const runtime = "nodejs";
