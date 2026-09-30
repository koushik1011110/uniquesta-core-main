import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, ShieldCheck, Bus, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { setToken, setUser } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const [roleFilter, setRoleFilter] = useState<"all" | "executive" | "admin" | "staff">("all");

  const demoUsers = [
    { email: "admin@uniquesta.com", pass: "admin123", role: "CEO · Executive Sign-off", category: "executive", name: "Mohammad Iqbal", branch: "Guwahati HQ", tagColor: "bg-red-500/10 text-[#E52E20] border-red-500/20" },
    { email: "director@uniquesta.com", pass: "admin123", role: "Director · Operations", category: "executive", name: "Vivek Ramanathan", branch: "Guwahati HQ", tagColor: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    { email: "mumbai.admin@uniquesta.com", pass: "admin123", role: "Branch Admin · Manager", category: "admin", name: "Rahul Deshmukh", branch: "Mumbai · Andheri West", tagColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { email: "delhi.admin@uniquesta.com", pass: "admin123", role: "Branch Admin", category: "admin", name: "Karan Mehta", branch: "Delhi NCR", tagColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { email: "anjali.finance@uniquesta.com", pass: "staff123", role: "Finance · AP Lead", category: "staff", name: "Anjali Kapoor", branch: "Mumbai · under Rahul Deshmukh", tagColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { email: "meera.counselor@uniquesta.com", pass: "staff123", role: "Employee Submitter", category: "staff", name: "Meera Shah", branch: "Mumbai · under Rahul Deshmukh", tagColor: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { email: "harpreet.visa@uniquesta.com", pass: "staff123", role: "Visa Officer", category: "staff", name: "Harpreet Kaur", branch: "Delhi · under Karan Mehta", tagColor: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    { email: "rohan.travel@uniquesta.com", pass: "staff123", role: "Travel Coordinator", category: "staff", name: "Rohan Patil", branch: "Mumbai · under Rahul Deshmukh", tagColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
  ];

  const fillDemo = (email: string, pass: string) => setForm({ email, password: pass });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Email and password required");
      return;
    }
    setLoading(true);
    try {
      const res: any = await api.post<any>("/auth/login", form);
      const data = res.data ?? res;
      const { user, token } = data;
      if (!token) throw new Error("No token returned");
      setToken(token);
      setUser(user);
      toast.success(`Welcome, ${user.name}!`);
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Left — Branding */}
      <div className="hidden w-[48%] flex-col justify-between bg-gradient-to-br from-[#0A0A0A] via-[#18181B] to-[#0A0A0A] p-10 text-white border-r border-[#E52E20]/20 lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden bg-white shadow p-0.5 border border-white/30 flex items-center justify-center">
              <img src="/logo.png" alt="UniQuesta Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="text-xl font-black leading-none tracking-tight">
                <span className="text-white">Uni</span><span className="text-[#E52E20]">Questa</span>
              </div>
              <div className="text-[10px] font-serif font-bold tracking-widest uppercase text-slate-300 mt-0.5">
                INTERNATIONAL
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-xs text-red-300 backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5 text-[#E52E20]" /> Trusted Pathway to Global Success
          </div>
          <h1 className="text-[32px] font-black leading-tight tracking-tight">
            One unified platform for admissions & travel.
          </h1>
          <p className="max-w-[420px] text-sm leading-relaxed text-slate-300">
            14 branches, 482 universities, students & travel bookings — all in one secure login. Powered by MySQL database (<code className="text-[#E52E20] font-mono">uniquesta_abroad</code>).
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=user${i}`}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-black"
                />
              ))}
            </div>
            <span className="text-xs text-slate-400">Trusted across 14 branch teams</span>
          </div>
        </div>
        <div className="text-xs text-slate-500">© 2026 UniQuesta International · Guwahati HQ</div>
      </div>

      {/* Right — Login */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[420px]">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="h-11 w-11 shrink-0 rounded-full overflow-hidden bg-white shadow p-0.5 border border-slate-200 flex items-center justify-center">
              <img src="/logo.png" alt="UniQuesta Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="font-black text-lg leading-none">
                <span className="text-black">Uni</span><span className="text-[#E52E20]">Questa</span>
              </div>
              <div className="text-[10px] font-serif font-bold text-slate-700 tracking-wider">INTERNATIONAL</div>
            </div>
          </div>

          <Card className="rounded-2xl shadow-card overflow-hidden">
            {/* Dedicated Portal Switcher */}
            <div className="p-3 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#E52E20]" /> Admin Portal
              </span>
              <div className="flex items-center gap-2">
                <Link to="/driver-login" className="text-slate-600 hover:text-[#E52E20] font-semibold flex items-center gap-1">
                  <Bus className="h-3.5 w-3.5 text-amber-600" /> Driver Login
                </Link>
                <span className="text-slate-300">|</span>
                <Link to="/traveler-login" className="text-slate-600 hover:text-blue-600 font-semibold flex items-center gap-1">
                  <Ticket className="h-3.5 w-3.5 text-blue-600" /> Traveler Login
                </Link>
              </div>
            </div>

            <CardHeader className="space-y-1">
              <CardTitle className="text-[22px]">Welcome back</CardTitle>
              <CardDescription>Login to your Uniquesta workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@uniquesta.com"
                      className="h-10 pl-9"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/login" className="text-xs text-primary hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={show ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-10 pl-9 pr-9"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="h-10 w-full gap-2 rounded-xl" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
                  Test Role Logins (1-Click Fill)
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Role Category Tabs */}
              <div className="mb-3 flex items-center justify-center gap-1 rounded-lg bg-slate-100 p-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setRoleFilter("all")}
                  className={`flex-1 rounded-md py-1 font-medium transition ${
                    roleFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({demoUsers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter("executive")}
                  className={`flex-1 rounded-md py-1 font-medium transition ${
                    roleFilter === "executive" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  CEO & Director
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter("admin")}
                  className={`flex-1 rounded-md py-1 font-medium transition ${
                    roleFilter === "admin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Branch Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter("staff")}
                  className={`flex-1 rounded-md py-1 font-medium transition ${
                    roleFilter === "staff" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Staff
                </button>
              </div>

              <div className="grid gap-2 max-h-[220px] overflow-y-auto pr-1">
                {demoUsers
                  .filter((u) => roleFilter === "all" || u.category === roleFilter)
                  .map((u) => (
                    <button
                      key={u.email}
                      type="button"
                      onClick={() => fillDemo(u.email, u.pass)}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 text-left transition hover:border-[#E52E20]/40 hover:bg-slate-50"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-800 border">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="truncate text-xs font-bold text-slate-900">{u.name}</span>
                          <span className={`rounded px-1.5 py-0.2 text-[10px] font-semibold border ${u.tagColor}`}>
                            {u.role}
                          </span>
                        </div>
                        <div className="truncate text-[11px] text-slate-500">
                          {u.branch}
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {u.pass}
                      </span>
                    </button>
                  ))}
              </div>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                Protected by JWT + bcrypt.{" "}
                <span className="font-medium text-foreground">Without login, dashboard nahi khulega.</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
