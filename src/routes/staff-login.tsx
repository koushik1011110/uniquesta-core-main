import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
  Crown,
  Bus,
  Ticket,
  ShieldCheck,
  Briefcase,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { setToken, setUser } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/staff-login")({
  head: () => ({
    meta: [
      { title: "Staff & Counsellors Workspace · UniQuesta International" },
      { name: "description", content: "Staff portal login for admissions counsellors, visa documentation officers, finance staff, and travel coordinators." },
    ],
  }),
  component: StaffLoginPage,
});

function StaffLoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState("Admissions & Student Counselling");
  const [form, setForm] = useState({
    email: "meera.counselor@uniquesta.com",
    password: "staff123",
  });

  const staffPresets = [
    {
      name: "Meera Shah",
      email: "meera.counselor@uniquesta.com",
      pass: "staff123",
      role: "Admissions Counsellor",
      branch: "Mumbai",
      department: "Admissions & Student Counselling",
      reportsTo: "Rahul Deshmukh (Branch Admin)",
    },
    {
      name: "Harpreet Kaur",
      email: "harpreet.visa@uniquesta.com",
      pass: "staff123",
      role: "Visa & Documentation Officer",
      branch: "Delhi NCR",
      department: "Visa & Immigration",
      reportsTo: "Karan Mehta (Branch Admin)",
    },
    {
      name: "Anjali Kapoor",
      email: "anjali.finance@uniquesta.com",
      pass: "staff123",
      role: "Finance & Accounts Lead",
      branch: "Mumbai",
      department: "Finance & Accounts",
      reportsTo: "Rahul Deshmukh (Branch Admin)",
    },
    {
      name: "Rohan Patil",
      email: "rohan.travel@uniquesta.com",
      pass: "staff123",
      role: "Travel Coordinator",
      branch: "Mumbai",
      department: "Travel & Tours",
      reportsTo: "Rahul Deshmukh (Branch Admin)",
    },
    {
      name: "Sneha Joshi",
      email: "sneha.frontdesk@uniquesta.com",
      pass: "staff123",
      role: "Front Desk & Receptionist",
      branch: "Mumbai",
      department: "Reception & Walk-ins",
      reportsTo: "Rahul Deshmukh (Branch Admin)",
    },
  ];

  const fillPreset = (p: typeof staffPresets[0]) => {
    setForm({ email: p.email, password: p.pass });
    setDepartment(p.department);
    toast.info(`Loaded credentials for ${p.name} (${p.role})`);
  };

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

      toast.success(`Welcome to your workspace, ${user.name}!`);
      navigate({ to: "/leads" });
    } catch (err: any) {
      toast.error(err.message || "Staff authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070F0D] text-slate-100 flex flex-col justify-between selection:bg-emerald-600 selection:text-white font-sans antialiased">
      {/* ─── Top Global Portal Switcher Bar ─── */}
      <header className="border-b border-emerald-950/80 bg-slate-950/80 backdrop-blur sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-white p-0.5 shadow flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="UniQuesta" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="text-sm font-black leading-none tracking-tight">
                <span className="text-white">Uni</span>
                <span className="text-[#E52E20]">Questa</span>
              </div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-emerald-400 mt-0.5">
                STAFF WORKSPACE
              </div>
            </div>
          </div>

          {/* Quick Portal Switch Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs overflow-x-auto py-1">
            <span className="hidden md:inline-block text-[11px] text-slate-400 font-semibold mr-1">
              Switch Portal:
            </span>
            <Button asChild size="sm" variant="ghost" className="h-8 text-xs text-slate-300 hover:text-white hover:bg-slate-800">
              <Link to="/super-admin-login">
                <Crown className="h-3.5 w-3.5 text-red-400 mr-1" /> Super Admin
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="h-8 text-xs text-slate-300 hover:text-white hover:bg-slate-800">
              <Link to="/office-login">
                <Building2 className="h-3.5 w-3.5 text-indigo-400 mr-1" /> Office Admin
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="h-8 text-xs text-slate-300 hover:text-white hover:bg-slate-800">
              <Link to="/traveler-login">
                <Ticket className="h-3.5 w-3.5 text-blue-400 mr-1" /> Traveler
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="h-8 text-xs text-slate-300 hover:text-white hover:bg-slate-800">
              <Link to="/driver-login">
                <Bus className="h-3.5 w-3.5 text-amber-400 mr-1" /> Driver
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-8 text-xs border-emerald-900 text-slate-200 hover:bg-slate-800">
              <Link to="/login">All Portals</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[480px] space-y-5">
          <Card className="rounded-2xl border-emerald-950 bg-slate-900/90 shadow-2xl backdrop-blur text-white overflow-hidden">
            {/* Header Banner */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border-b border-emerald-950/80">
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px] font-semibold gap-1.5 px-2.5 py-0.5">
                  <Users className="h-3.5 w-3.5 text-emerald-400" /> Staff & Counsellor Login
                </Badge>
                <span className="text-[10.5px] font-mono text-slate-400 flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-emerald-400" /> FIELD & COUNSELING
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-2">
                Staff Workspace Login
              </h1>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Admissions counsellors, visa documentation officers, and branch coordinators sign in here to manage daily student files.
              </p>
            </div>

            <CardContent className="p-5 sm:p-6 space-y-5">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dept-select" className="text-xs font-semibold text-slate-300">
                    Department Focus
                  </Label>
                  <select
                    id="dept-select"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs sm:text-sm focus:border-emerald-500 outline-none"
                  >
                    <option value="Admissions & Student Counselling">Admissions & Student Counselling</option>
                    <option value="Visa & Immigration">Visa & Documentation</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Travel & Tours">Travel & Fleet Logistics</option>
                    <option value="Reception & Walk-ins">Front Desk & Walk-ins</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-300">
                    Staff Work Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="staff.name@uniquesta.com"
                      className="pl-9 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm h-11 placeholder:text-slate-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <Label htmlFor="password" className="font-semibold text-slate-300">
                      Staff Password
                    </Label>
                    <span className="text-slate-500 text-[11px]">Default: staff123</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={show ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      className="pl-9 pr-10 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm h-11 placeholder:text-slate-500 focus:border-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 sm:h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Accessing Workspace...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" /> Sign in to Staff Portal
                    </>
                  )}
                </Button>
              </form>

              {/* 1-Click Fill Preset Accounts */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="h-px flex-1 bg-slate-800" />
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                    Sample Staff Profiles (1-Click Fill)
                  </span>
                  <div className="h-px flex-1 bg-slate-800" />
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {staffPresets.map((p) => (
                    <button
                      key={p.email}
                      type="button"
                      onClick={() => fillPreset(p)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/70 hover:border-emerald-500/40 text-left transition group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                            {p.name}
                          </span>
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-1.5 py-0.2 rounded font-medium">
                            {p.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {p.branch} · {p.reportsTo}
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        {p.pass}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* System Note */}
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Direct CRM & Student Dossier Access</span>
                <Link to="/login" className="text-emerald-400 hover:underline">
                  Switch to Multi-portal Hub ➔
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="p-4 border-t border-slate-800/80 text-center text-xs text-slate-500 bg-slate-950/80">
        UniQuesta International · Staff Counseling & Operations Workspace
      </footer>
    </div>
  );
}
