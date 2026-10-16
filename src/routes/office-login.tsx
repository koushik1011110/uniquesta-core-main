import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  MapPin,
  Crown,
  Users,
  Bus,
  Ticket,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { setToken, setUser } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/office-login")({
  head: () => ({
    meta: [
      { title: "Office & Branch Admin Portal · UniQuesta International" },
      { name: "description", content: "Dedicated branch manager login for UniQuesta regional office heads and branch administrators." },
    ],
  }),
  component: OfficeAdminLoginPage,
});

function OfficeAdminLoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("Mumbai · Andheri West");
  const [form, setForm] = useState({
    email: "mumbai.admin@uniquesta.com",
    password: "admin123",
  });

  const branchAdminPresets = [
    {
      name: "Rahul Deshmukh",
      email: "mumbai.admin@uniquesta.com",
      pass: "admin123",
      branch: "Mumbai · Andheri West",
      role: "Branch Admin · Mumbai Head",
      teamSize: "4 Direct Staff",
    },
    {
      name: "Karan Mehta",
      email: "delhi.admin@uniquesta.com",
      pass: "admin123",
      branch: "Delhi NCR · Connaught Place",
      role: "Branch Admin · North Region",
      teamSize: "3 Direct Staff",
    },
    {
      name: "Divya Rao",
      email: "bangalore.admin@uniquesta.com",
      pass: "admin123",
      branch: "Bengaluru · Indiranagar",
      role: "Branch Admin · South Region",
      teamSize: "2 Direct Staff",
    },
    {
      name: "Rahul Reddy",
      email: "hyderabad.admin@uniquesta.com",
      pass: "admin123",
      branch: "Hyderabad · Banjara Hills",
      role: "Branch Admin · Telangana",
      teamSize: "2 Direct Staff",
    },
  ];

  const branchesList = [
    "Mumbai · Andheri West",
    "Delhi NCR · Connaught Place",
    "Bengaluru · Indiranagar",
    "Hyderabad · Banjara Hills",
    "Guwahati HQ · Christian Basti",
    "Pune · Shivaji Nagar",
    "Kolkata · Salt Lake",
  ];

  const fillPreset = (p: typeof branchAdminPresets[0]) => {
    setForm({ email: p.email, password: p.pass });
    setSelectedBranch(p.branch);
    toast.info(`Loaded branch credentials for ${p.name} (${p.branch})`);
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

      toast.success(`Welcome back, Branch Head ${user.name}!`);
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message || "Branch Admin authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white font-sans antialiased">
      {/* ─── Top Global Portal Switcher Bar ─── */}
      <header className="border-b border-indigo-950/80 bg-slate-950/80 backdrop-blur sticky top-0 z-30 px-4 py-3 sm:px-6">
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
              <div className="text-[9px] font-bold tracking-widest uppercase text-indigo-400 mt-0.5">
                BRANCH & OFFICE ADMIN
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
              <Link to="/staff-login">
                <Users className="h-3.5 w-3.5 text-emerald-400 mr-1" /> Staff
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
            <Button asChild size="sm" variant="outline" className="h-8 text-xs border-indigo-900 text-slate-200 hover:bg-slate-800">
              <Link to="/login">All Portals</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[480px] space-y-5">
          <Card className="rounded-2xl border-indigo-950 bg-slate-900/90 shadow-2xl backdrop-blur text-white overflow-hidden">
            {/* Header Banner */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border-b border-indigo-950/80">
              <div className="flex items-center justify-between">
                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-[11px] font-semibold gap-1.5 px-2.5 py-0.5">
                  <Building2 className="h-3.5 w-3.5 text-indigo-400" /> Office & Branch Admin
                </Badge>
                <span className="text-[10.5px] font-mono text-slate-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-indigo-400" /> REGIONAL OFFICE
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-2">
                Branch Admin Login
              </h1>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Log in to oversee branch counsellors, local student applications, lead allocations, and branch expense approvals.
              </p>
            </div>

            <CardContent className="p-5 sm:p-6 space-y-5">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="branch-select" className="text-xs font-semibold text-slate-300">
                    Assigned Branch Office
                  </Label>
                  <select
                    id="branch-select"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs sm:text-sm focus:border-indigo-500 outline-none"
                  >
                    {branchesList.map((b) => (
                      <option key={b} value={b} className="bg-slate-900">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-300">
                    Branch Admin Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="branch.admin@uniquesta.com"
                      className="pl-9 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm h-11 placeholder:text-slate-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <Label htmlFor="password" className="font-semibold text-slate-300">
                      Password
                    </Label>
                    <span className="text-slate-500 text-[11px]">Branch Operations Secured</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={show ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      className="pl-9 pr-10 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm h-11 placeholder:text-slate-500 focus:border-indigo-500"
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
                  className="w-full h-11 sm:h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Verifying Branch Session...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" /> Sign in as Branch Admin
                    </>
                  )}
                </Button>
              </form>

              {/* 1-Click Fill Preset Accounts */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="h-px flex-1 bg-slate-800" />
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                    Branch Admin Accounts (1-Click Fill)
                  </span>
                  <div className="h-px flex-1 bg-slate-800" />
                </div>

                <div className="space-y-2">
                  {branchAdminPresets.map((p) => (
                    <button
                      key={p.email}
                      type="button"
                      onClick={() => fillPreset(p)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/70 hover:border-indigo-500/40 text-left transition group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                            {p.name}
                          </span>
                          <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-1.5 py-0.2 rounded font-medium">
                            {p.branch.split("·")[0].trim()}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {p.email} · {p.teamSize}
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
                <span>Branch Data Segregated</span>
                <Link to="/login" className="text-indigo-400 hover:underline">
                  Switch to Multi-portal Hub ➔
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="p-4 border-t border-slate-800/80 text-center text-xs text-slate-500 bg-slate-950/80">
        UniQuesta International · Regional Branch Administration Terminal
      </footer>
    </div>
  );
}
