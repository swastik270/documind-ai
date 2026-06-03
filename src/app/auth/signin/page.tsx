"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, Sparkles, ArrowRight, ShieldAlert, Eye, EyeOff } from "lucide-react";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error || "Failed to sign in. Please verify your credentials.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
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
          <h2 className="text-xl font-bold">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to manage your technical document pipeline
          </p>
        </div>

        {(error || errorParam) && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error || "Verification failed. Please check details."}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/10 transition-all disabled:opacity-50 disabled:pointer-events-none text-sm active:scale-95"
          >
            {loading ? "Verifying..." : "Sign In"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative px-3 bg-background/80 backdrop-blur-sm text-xs text-muted-foreground uppercase">
            Or continue with
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 rounded-lg border border-border hover:bg-muted/10 font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.65 1.41 7.56l3.86 2.99C6.2 7.57 8.89 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.02 3.67-8.64z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 10.55c-.25-.76-.4-1.57-.4-2.41s.15-1.65.4-2.41L1.41 4.74C.51 6.55 0 8.57 0 10.7s.51 4.15 1.41 5.96l3.86-2.99c-.25-.76-.4-1.57-.4-2.41z"
            />
            <path
              fill="#34A853"
              d="M12 20.45c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.52 1.18-4.2 1.18-3.11 0-5.8-2.53-6.73-5.51L1.41 13.3c1.96 3.91 5.94 6.56 10.59 6.56z"
            />
          </svg>
          Google OAuth
        </button>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
