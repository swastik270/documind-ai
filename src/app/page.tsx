"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FileText,
  Code,
  Zap,
  ArrowRight,
  Shield,
  MessageSquare,
  BarChart,
  GitBranch,
  Layers,
  ChevronDown,
  Sparkles,
  Terminal,
  Activity
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("docs");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <FileText className="text-violet-500" size={24} />,
      title: "AI Documentation Engine",
      desc: "Instantly compile complete READMEs, API descriptions, database structures, and setup guides from raw files."
    },
    {
      icon: <Code className="text-indigo-500" size={24} />,
      title: "Inline Comment Generator",
      desc: "Inject descriptive, type-safe commentary across JavaScript, Python, TypeScript, Java, and C++ files."
    },
    {
      icon: <Shield className="text-fuchsia-500" size={24} />,
      title: "AI Code Reviews",
      desc: "Perform automated audit logs to scan security risks, track performance lags, and enforce system best practices."
    },
    {
      icon: <MessageSquare className="text-pink-500" size={24} />,
      title: "Workspace AI Chatbot",
      desc: "Conduct interactive inquiries about files, query architecture designs, locate bugs, and write mock test assertions."
    },
    {
      icon: <Layers className="text-cyan-500" size={24} />,
      title: "Automated Diagramming",
      desc: "Generate flowcharts, ER structures, and sequence charts mapping internal dependencies using Mermaid.js."
    },
    {
      icon: <BarChart className="text-emerald-500" size={24} />,
      title: "Admin Analytics",
      desc: "Track prompt tokens, model parameters, database states, and project volumes inside a centralized monitor page."
    }
  ];

  const pricingPlans = [
    {
      name: "Hobby",
      price: "$0",
      desc: "For individual projects and open-source packages.",
      features: [
        "Up to 3 repositories",
        "ZIP upload support",
        "README & Overview compilation",
        "Standard AI rate limit"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      desc: "Perfect for scaling startups and development teams.",
      features: [
        "Unlimited repositories",
        "GitHub App sync",
        "Full review audits & diagnostics",
        "Mermaid.js diagramming engine",
        "PDF, Markdown & DOCX exporting",
        "Priority AI access"
      ],
      cta: "Upgrade to Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Tailored security and processing configurations.",
      features: [
        "Private VPC deployments",
        "Dedicated API limits",
        "SAML SSO & Admin management",
        "Custom fine-tuned models",
        "24/7 Priority support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      q: "How does DocuMind AI analyze my codebase?",
      a: "DocuMind scans directory trees, indexes file headers, and builds abstract syntactic mappings. It feeds relevant structures into OpenAI/Claude models using custom prompt models, compiling fully contextualized markdown and Mermaid diagrams."
    },
    {
      q: "Are my repositories secure?",
      a: "Yes. All uploaded zip archives are sandboxed during analysis and automatically deleted. Github checkouts are processed in temporary container memories, and your source code is never cached or used for training model nodes."
    },
    {
      q: "Can I run it locally or deploy with my own keys?",
      a: "Absolutely! DocuMind supports a dual-mode engine. You can use our managed cloud infrastructure or supply your own OpenAI API key and PostgreSQL URL to run it locally in full privacy."
    },
    {
      q: "Which coding languages are supported?",
      a: "We support JavaScript, TypeScript, Python, Java, C++, Go, Rust, C#, PHP, and SQL schema parsing."
    }
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/30">
      {/* Glow blobs */}
      <div className="glow-blob blob-indigo top-[-100px] left-[-100px]" />
      <div className="glow-blob blob-purple top-[40%] right-[-100px]" />
      <div className="glow-blob blob-fuchsia bottom-[-100px] left-[20%]" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Sparkles size={18} />
            </div>
            <span>DocuMind <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#showcase" className="hover:text-foreground transition-colors">Showcase</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/auth/signin"
              className="text-sm font-medium hover:text-primary transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md shadow-primary/10 hover:shadow-primary/20 active:scale-95"
            >
              Go to Dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6 animate-pulse">
            <Sparkles size={12} /> Introducing v1.0.0 Technical Compiler
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Generate Production-Ready{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-pink-500 bg-clip-text text-transparent">
              Documentation
            </span>{" "}
            from Your Source Code
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload repositories, ZIP archives, or circuit schematics. Instantly generate architectural guides, READMEs, security audits, inline commentaries, and flowcharts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-105 transition-all"
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
            <a
              href="#showcase"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg glass-card font-semibold hover:bg-secondary/40 flex items-center justify-center gap-2 transition-all"
            >
              Watch Demo
            </a>
          </div>
        </motion.div>

        {/* Floating Terminal Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-4xl mx-auto rounded-xl border border-border glass-panel overflow-hidden shadow-2xl relative"
        >
          <div className="bg-muted/40 px-4 py-3 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
              <Terminal size={12} /> documind@client:~/project
            </div>
            <div className="w-6" />
          </div>
          <div className="p-6 text-left font-mono text-sm overflow-x-auto bg-black/80 dark:bg-black/90 text-gray-300">
            <div className="text-primary-foreground/50"># Initiating local codebase catalog compiler</div>
            <div>$ documind compile ./src --format=all</div>
            <div className="text-cyan-400">⚡ Scanning directories... Mapped 18 files.</div>
            <div className="text-yellow-400">🤖 Prompting AI Compiler (Model: Claude 3.5 Sonnet)</div>
            <div className="text-emerald-400">✓ README.md updated successfully!</div>
            <div className="text-emerald-400">✓ API Documentation.md created.</div>
            <div className="text-emerald-400">✓ System Architecture flowchart rendered.</div>
            <div className="text-violet-400">✓ 12 Inline code comments injected.</div>
            <div className="text-fuchsia-400">⚡ Code Auditing completed: 92/100 score. 1 vulnerability fixed.</div>
            <div className="text-gray-400 mt-2">// Compilation finished in 2.45s. Access dashboard: http://localhost:3000</div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/20 relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1">5M+</div>
            <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Files Indexed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1">100K+</div>
            <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Docs Created</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1">99.4%</div>
            <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Analysis Accuracy</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1">&lt; 3s</div>
            <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Processing Time</div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="max-w-7xl mx-auto px-6 py-24 relative z-10 scroll-mt-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Inside the Workspace</h2>
          <p className="text-muted-foreground">Select an AI tool module below to visualize the layout format of the generated technical data.</p>
        </div>

        <div className="flex justify-center gap-3 mb-10 overflow-x-auto pb-2">
          {[
            { id: "docs", label: "Documentation", icon: <FileText size={16} /> },
            { id: "review", label: "Security & Reviews", icon: <Shield size={16} /> },
            { id: "mermaid", label: "Relational Diagrams", icon: <Layers size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "glass-card hover:bg-secondary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="glass-panel border border-border rounded-xl p-6 sm:p-8 min-h-[350px] shadow-lg">
          {activeTab === "docs" && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Complete Reference Manuals</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Automatically structure codebase components into functional markdown suites. Our parser reads project methods, routes, export classes, and config nodes to build:
                </p>
                <ul className="space-y-3 font-medium text-sm">
                  <li className="flex items-center gap-2 text-indigo-500"><Zap size={16} /> API Endpoint Maps</li>
                  <li className="flex items-center gap-2 text-indigo-500"><Zap size={16} /> Installation Setup Scripts</li>
                  <li className="flex items-center gap-2 text-indigo-500"><Zap size={16} /> Component Dependency Layouts</li>
                </ul>
              </div>
              <div className="rounded-xl border border-border p-4 bg-muted/30 font-mono text-xs overflow-x-auto h-[260px]">
                <div className="text-indigo-400"># API Specification</div>
                <div className="text-gray-500">// Auto-generated by DocuMind AI</div>
                <div className="mt-4"><span className="text-green-500">GET</span> /api/projects</div>
                <div className="text-gray-400 pl-4">Fetches all projects registered for the active user workspace.</div>
                <div className="mt-2"><span className="text-blue-500">POST</span> /api/projects/analyze</div>
                <div className="text-gray-400 pl-4">Submits repository reference directories for code analysis parsing.</div>
                <div className="mt-4 text-indigo-400">### Response Schema (200 OK)</div>
                <div className="text-gray-400 pl-4">{"{ status: 'ANALYZING', filesIndexed: 14 }"}</div>
              </div>
            </div>
          )}

          {activeTab === "review" && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Automated Code Diagnostics</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Evaluate security configurations, verify that synchronous execution threads don't block processes, and inspect scope leaks. Get grading scores instantly.
                </p>
                <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-sm">
                  <Shield size={20} className="shrink-0" />
                  <div>
                    <div className="font-semibold">Vulnerability Spotted: Line 14</div>
                    <div className="text-xs opacity-90">Absolute path traversal risks identified in direct fs.readFile calls.</div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border p-5 bg-card">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                  <div className="font-semibold text-sm">Review Health Diagnostic</div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 font-bold text-xs">84 / 100</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center text-red-500 bg-red-500/5 p-2 rounded">
                    <span>Path Traversal Threat (Security)</span>
                    <span className="font-semibold">Critical</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-500 bg-amber-500/5 p-2 rounded">
                    <span>Sync fs.readdir usage (Performance)</span>
                    <span className="font-semibold">Warning</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-500 bg-blue-500/5 p-2 rounded">
                    <span>Redundant let reassignment (Best Practice)</span>
                    <span className="font-semibold">Info</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mermaid" && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Relational Flowcharts</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Use built-in Mermaid rendering to visualize file links, structural routes, and data flows. Diagrams recalculate dynamically as files update.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity size={16} /> Fully zoomable, pan-compatible vector assets.
                </div>
              </div>
              <div className="rounded-xl border border-border p-4 bg-muted/40 flex flex-col items-center justify-center min-h-[220px]">
                <div className="w-full flex justify-center text-xs font-mono text-muted-foreground mb-4">
                  [Rended Flowchart Map]
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded border border-border bg-card text-xs font-semibold">User Request</div>
                  <div className="text-muted-foreground">→</div>
                  <div className="px-3 py-1.5 rounded border border-primary/20 bg-primary/10 text-primary text-xs font-semibold">Auth Gateway</div>
                  <div className="text-muted-foreground">→</div>
                  <div className="px-3 py-1.5 rounded border border-border bg-card text-xs font-semibold">Dashboard Router</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-border scroll-mt-16">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Robust Features List</h2>
          <p className="text-muted-foreground">DocuMind AI provides everything needed to document complex, multi-lingual code bases in seconds.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl border border-border glass-card flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="font-bold text-lg">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-border scroll-mt-16">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Flexible Pricing Plans</h2>
          <p className="text-muted-foreground">Supply your own API key to bypass bounds or subscribe for custom cloud allocations.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 border flex flex-col justify-between relative ${
                plan.popular
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                  : "border-border glass-card"
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-8 -translate-y-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                  Popular
                </span>
              )}
              <div>
                <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-6">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>
                <ul className="space-y-4 mb-8 text-sm">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-center gap-2">
                      <Zap size={14} className="text-primary shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/dashboard"
                className={`w-full py-2.5 rounded-lg font-semibold text-center text-sm transition-all active:scale-95 ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "glass-card hover:bg-secondary/40"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24 relative z-10 border-t border-border scroll-mt-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Find answers to common configuration queries.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-border glass-panel overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-sm sm:text-base hover:bg-muted/10 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform duration-300 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/10 relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-xs">
              <Sparkles size={12} />
            </div>
            <span>DocuMind AI</span>
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DocuMind AI. All rights reserved.
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
            <a href="#" className="hover:text-foreground">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
