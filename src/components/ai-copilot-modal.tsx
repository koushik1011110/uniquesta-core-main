import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Mic,
  MicOff,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  GraduationCap,
  ShieldCheck,
  Car,
  FileText,
  Sliders,
  CornerDownLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { aiCopilot } from "@/lib/ai-assistant";
import { toast } from "sonner";

interface MessageAction {
  label: string;
  url: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  actions?: MessageAction[];
  suggestions?: string[];
}

const STARTER_PROMPTS = [
  { icon: TrendingUp, label: "Revenue & profit margin", query: "What is our current revenue and profit margin?" },
  { icon: GraduationCap, label: "Students & pipeline", query: "How many students and leads are in pipeline?" },
  { icon: ShieldCheck, label: "Pending expense approvals", query: "Show pending expense approvals requiring sign-off" },
  { icon: Car, label: "Travel fleet bookings", query: "How to create and dispatch a travel fleet booking?" },
  { icon: FileText, label: "UK & Canada visa guide", query: "What are the visa requirements for UK and Canada?" },
  { icon: Sliders, label: "Configure WhatsApp API", query: "How do I configure WhatsApp notifications and role permissions?" },
];

export function AiCopilotModal() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Local storage state for chat history
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("uniquesta_ai_chat_history");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "welcome-1",
        role: "assistant",
        content:
          "### 👋 Welcome to UniQuesta Enterprise AI Copilot!\n\n" +
          "I am your real-time assistant, grounded directly in the UniQuesta ERP system. " +
          "Ask me anything about **student admissions**, **revenue & margins**, **approvals**, **fleet trips**, or **system how-tos**.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: [
          "What is our current revenue and profit margin?",
          "How many students and leads are in pipeline?",
          "Show pending expense approvals",
        ],
      },
    ];
  });

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("uniquesta_ai_chat_history", JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Subscribe to global openAiCopilot events
  useEffect(() => {
    const unsubscribe = aiCopilot.subscribe(({ query, open }) => {
      if (open !== undefined) setIsOpen(open);
      if (query) {
        setIsOpen(true);
        handleSend(query);
      }
    });

    // Keyboard shortcut Cmd/Ctrl + K or Cmd/Ctrl + /
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "/")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      unsubscribe();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (userQuery?: string) => {
    const text = (userQuery || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const res: any = await api.post("/ai/chat", {
        message: text,
        history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
      });

      const data = res?.data ?? res ?? {};
      const botMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: data.reply || "I have processed your query. Let me know if you need more details.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actions: data.actions || [],
        suggestions: data.suggestions || [],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: "err-" + Date.now(),
        role: "assistant",
        content:
          "⚠️ I encountered an issue connecting to the AI service. " +
          "Please verify that the backend server is running and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    const initial: ChatMessage[] = [
      {
        id: "welcome-reset",
        role: "assistant",
        content:
          "Conversation history cleared. How may I assist you with UniQuesta ERP today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: [
          "What is our current revenue and profit margin?",
          "How many students and leads are in pipeline?",
          "Show pending expense approvals",
        ],
      },
    ];
    setMessages(initial);
    toast.info("AI conversation history reset");
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Response copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleActionClick = (url: string) => {
    navigate({ to: url as any });
    if (!isMaximized) {
      setIsOpen(false);
    }
  };

  // Web Speech API Voice Recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        toast.info("Listening... Speak your query clearly.");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error("Voice input error. Please type your query.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Render simple markdown tokens
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith("### ")) {
            return (
              <h4 key={idx} className="font-bold text-sm sm:text-base text-foreground mt-2 mb-1">
                {line.replace("### ", "")}
              </h4>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-1">
                <span className="text-primary font-bold select-none">•</span>
                <span className="flex-1">{formatInlineText(line.replace("- ", ""))}</span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            const num = line.match(/^(\d+)\.\s/)?.[1];
            return (
              <div key={idx} className="flex items-start gap-2 ml-1">
                <span className="font-semibold text-primary text-xs select-none">{num}.</span>
                <span className="flex-1">{formatInlineText(line.replace(/^\d+\.\s/, ""))}</span>
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }
          return <p key={idx}>{formatInlineText(line)}</p>;
        })}
      </div>
    );
  };

  const formatInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Copilot Window / Modal (Opened via TopBar, Search, Sidebar or ⌘K)  */}
      {/* ------------------------------------------------------------------ */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 print:hidden flex flex-col ${
            isMaximized
              ? "inset-4 sm:inset-10 max-w-5xl mx-auto rounded-3xl"
              : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[460px] h-[640px] max-h-[90vh] rounded-2xl"
          } bg-background/95 backdrop-blur-xl border border-border shadow-2xl overflow-hidden`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-4 w-4 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">UniQuesta AI Copilot</h3>
                  <Badge variant="outline" className="text-[10px] h-5 border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
                    ERP Grounded
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Natural language assistant for admissions, finance & ops
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearHistory}
                title="Clear Conversation"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMaximized((prev) => !prev)}
                title={isMaximized ? "Restore" : "Maximize"}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hidden sm:flex"
              >
                {isMaximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Starter Prompts Horizontal Carousel */}
          {messages.length <= 2 && (
            <div className="border-b bg-muted/20 px-3 py-2 overflow-x-auto scrollbar-none flex gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => handleSend(prompt.query)}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-primary-soft hover:text-primary transition shrink-0 cursor-pointer"
                >
                  <prompt.icon className="h-3 w-3 text-primary" />
                  {prompt.label}
                </button>
              ))}
            </div>
          )}

          {/* Messages Stream Container */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground text-xs font-bold mt-0.5">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2`}>
                    <div
                      className={`relative rounded-2xl p-3.5 text-xs sm:text-sm ${
                        isUser
                          ? "bg-primary text-primary-foreground rounded-tr-sm ml-auto"
                          : "bg-muted/60 text-foreground border rounded-tl-sm shadow-2xs"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        renderFormattedContent(msg.content)
                      )}

                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100 transition p-1"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Interactive Action Deep-Links */}
                    {!isUser && msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.actions.map((act) => (
                          <button
                            key={act.url}
                            onClick={() => handleActionClick(act.url)}
                            className="inline-flex items-center gap-1 rounded-lg border bg-background px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary hover:text-white transition cursor-pointer shadow-2xs"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Follow-up Suggestion Chips */}
                    {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="space-y-1 pt-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                          Suggested questions:
                        </span>
                        <div className="flex flex-col gap-1">
                          {msg.suggestions.map((sug) => (
                            <button
                              key={sug}
                              onClick={() => handleSend(sug)}
                              className="text-left rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer border border-dashed border-border"
                            >
                              💬 {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div
                      className={`text-[10px] text-muted-foreground px-1 ${
                        isUser ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-muted text-foreground text-xs font-bold mt-0.5 border">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="flex items-center gap-1 bg-muted/60 border rounded-xl px-3 py-2 text-xs">
                  <span>Analyzing live ERP database...</span>
                  <span className="animate-pulse">● ● ●</span>
                </div>
              </div>
            )}
          </div>

          {/* Input & Send Form Bar */}
          <div className="border-t p-3 bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask anything about admissions, revenue, approvals, travel..."
                  className="rounded-xl h-10 pr-10 text-xs sm:text-sm bg-muted/30 focus-visible:bg-background"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition cursor-pointer ${
                    isListening
                      ? "text-red-500 animate-pulse bg-red-100"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={isListening ? "Listening..." : "Voice input"}
                >
                  {isListening ? <Mic className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              </div>

              <Button
                type="submit"
                size="icon"
                disabled={!inputMessage.trim() || loading}
                className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground shadow-sm"
              >
                <CornerDownLeft className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-muted-foreground">
              <span>Press Enter to send · Grounded in live records</span>
              <span className="hidden sm:inline">Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
