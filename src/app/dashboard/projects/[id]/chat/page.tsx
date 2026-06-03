"use client";

import { useEffect, useRef, useState, use } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  AlertCircle,
  Code2,
  Bug,
  TestTube
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  message: string;
  createdAt: string;
}

export default function ProjectChat({
  params: paramsPromise
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const projectId = params.id;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/chat`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(() => {});
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // Optimistically update user message
    const tempUserMsg: ChatMessage = {
      id: "temp-user-" + Date.now(),
      role: "user",
      message: textToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev.filter((m) => !m.id.startsWith("temp-")), data]);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const presetQuestions = [
    { text: "Explain how parseRepository recursion works", icon: <Code2 size={12} /> },
    { text: "Are there any database synchronization risks?", icon: <Bug size={12} /> },
    { text: "Generate unit tests for authOptions verification", icon: <TestTube size={12} /> },
  ];

  return (
    <div className="rounded-xl border border-border glass-panel h-[520px] flex flex-col justify-between overflow-hidden shadow-lg bg-card">
      {/* Header */}
      <div className="bg-muted/10 px-6 py-3 border-b border-border flex items-center gap-2">
        <Bot size={16} className="text-primary" />
        <div>
          <h3 className="text-xs font-bold">Repository AI Chatbot</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Ask codebase-level questions. Scoped context is loaded.
          </p>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold">Initiate AI Dialog</h4>
              <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                Query functions definitions, request unit tests assertions, or identify security loopholes inside your source files.
              </p>
            </div>

            <div className="w-full flex flex-col gap-2 pt-2">
              {presetQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q.text)}
                  className="px-3 py-2 rounded-lg border border-border hover:border-primary/20 bg-background hover:bg-primary/5 text-left text-[10px] font-semibold text-muted-foreground hover:text-primary transition-all flex items-center gap-1.5"
                >
                  {q.icon}
                  <span>{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isBot = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isBot ? "" : "ml-auto flex-row-reverse"}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 shadow-inner ${
                    isBot ? "bg-primary/10 text-primary" : "bg-secondary text-foreground"
                  }`}
                >
                  {isBot ? <Bot size={12} /> : <User size={12} />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed font-semibold whitespace-pre-wrap select-text ${
                    isBot
                      ? "bg-muted/30 border border-border/40 text-foreground/90 rounded-tl-none"
                      : "bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/5"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">
              <Bot size={12} />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-muted/30 border border-border/40 text-muted-foreground flex items-center gap-1.5 py-2.5">
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-border bg-muted/5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            required
            disabled={loading}
            placeholder="Ask AI about functions, files or tests..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary text-xs transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center transition-all disabled:opacity-50 active:scale-95 w-9 h-9 shadow-md shadow-primary/10"
            aria-label="Send message"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
export const runtime = "nodejs";
