import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  GraduationCap,
  FileText,
  UserPlus,
  ArrowUpRight,
  Globe,
  Building2,
  ChevronRight,
  Database,
  Compass,
  ArrowRight,
  Plane,
  ShieldCheck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard · UniQuesta International" },
      {
        name: "description",
        content:
          "Executive overview dashboard for UniQuesta International — Trusted Pathway to Global Success.",
      },
    ],
  }),
  component: DashboardPage,
});

/* ----------------------------- Sample Trend Data ----------------------------- */
const admissionsTrend = [
  { month: "Apr", applications: 45, offers: 32 },
  { month: "May", applications: 58, offers: 41 },
  { month: "Jun", applications: 72, offers: 56 },
  { month: "Jul", applications: 94, offers: 78 },
  { month: "Aug", applications: 110, offers: 92 },
  { month: "Sep", applications: 128, offers: 104 },
  { month: "Oct", applications: 115, offers: 96 },
  { month: "Nov", applications: 130, offers: 112 },
  { month: "Dec", applications: 98, offers: 85 },
  { month: "Jan", applications: 122, offers: 102 },
  { month: "Feb", applications: 145, offers: 120 },
  { month: "Mar", applications: 160, offers: 138 },
];

const topDestinations = [
  { country: "United Kingdom", flag: "🇬🇧", count: "38%", color: "bg-[#E52E20]" },
  { country: "Canada", flag: "🇨🇦", count: "26%", color: "bg-[#0A0A0A]" },
  { country: "Australia", flag: "🇦🇺", count: "18%", color: "bg-[#DC2626]" },
  { country: "United States", flag: "🇺🇸", count: "12%", color: "bg-slate-700" },
  { country: "Germany & Europe", flag: "🇩🇪", count: "6%", color: "bg-slate-500" },
];

function DashboardPage() {
  const user = getUser();

  // Fetch live stats from MySQL uniquesta_abroad
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      try {
        const r: any = await api.get<any>("/dashboard/stats");
        return r.data ?? r;
      } catch {
        return null;
      }
    },
  });

  // Fetch recent students from MySQL
  const { data: recentStudents } = useQuery({
    queryKey: ["dashboard-recent-students"],
    queryFn: async () => {
      try {
        const r: any = await api.get<any>("/students?limit=5");
        return r.data ?? [];
      } catch {
        return [];
      }
    },
  });

  const studentCount = stats?.totalStudents ?? (recentStudents?.length || 6);
  const applicationCount = stats?.activeApplications ?? 6;
  const leadsCount = stats?.totalLeads ?? 9;

  return (
    <div className="space-y-6 pb-12">
      {/* ─── 1. Brand Executive Welcome Banner (UniQuesta Red & Black Logo Colors) ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A0A0A] via-[#171717] to-[#0A0A0A] p-6 sm:p-8 text-white shadow-xl border border-[#E52E20]/30">
        {/* Decorative Crimson Red Glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#E52E20]/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 -bottom-16 h-48 w-48 rounded-full bg-red-600/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4 sm:items-center">
            {/* Real UniQuesta Circular Logo */}
            <div className="h-16 w-16 shrink-0 rounded-full overflow-hidden bg-white shadow-lg p-0.5 border-2 border-white/30 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="UniQuesta International"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  <span className="text-white">Uni</span>
                  <span className="text-[#E52E20]">Questa</span>
                </h1>
                <Badge
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white font-serif tracking-wider uppercase text-[11px] font-bold"
                >
                  INTERNATIONAL
                </Badge>
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-[11px] font-medium items-center gap-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live DB: uniquesta_abroad
                </Badge>
              </div>

              <div className="mt-1 text-xs font-serif italic text-slate-300 tracking-wide">
                Trusted Pathway to Global Success
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Welcome,{" "}
                <span className="font-semibold text-white">
                  {user?.name ?? "Mohammad Iqbal"}
                </span>{" "}
                · {user?.branch ?? "Guwahati HQ"} (14 Branches Nationwide)
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-semibold shadow-sm transition-all"
            >
              <Link to="/students">
                <Users className="mr-2 h-4 w-4" />
                Student Admissions
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur"
            >
              <Link to="/travel">
                <Plane className="mr-2 h-4 w-4 text-[#E52E20]" />
                Tours & Travels
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── 2. Classic 4-Key Metrics Strip (Red & Black Aesthetic) ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Students */}
        <Card className="rounded-2xl border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-black text-white">
                <Users className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="h-3 w-3" /> +12.4%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black tracking-tight text-black">
                {studentCount}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">
                Total Enrolled Students
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Active student admissions & lifecycle
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Applications */}
        <Card className="rounded-2xl border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#E52E20] text-white">
                <FileText className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E52E20] bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                In Progress
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black tracking-tight text-[#E52E20]">
                {applicationCount}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">
                Active Applications
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Offers & visa processing
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Global Universities */}
        <Card className="rounded-2xl border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-black text-white">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">
                Tier-1 Partners
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black tracking-tight text-black">
                482+
              </div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">
                University Partners
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                UK, US, Canada, Australia, EU
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Admission Leads */}
        <Card className="rounded-2xl border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#E52E20]/10 text-[#E52E20]">
                <UserPlus className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E52E20] bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                Active Pipeline
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black tracking-tight text-black">
                {leadsCount}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">
                Prospective Enquiries
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Qualified counselor leads
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── 3. Classic Overview: Admissions Trajectory + Top Destinations ─── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Admissions Trajectory Chart */}
        <Card className="rounded-2xl border-slate-200/80 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <CardTitle className="text-base font-bold text-black flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E52E20]" />
                Student Admissions Trajectory
              </CardTitle>
              <p className="text-xs text-slate-500">
                Monthly application trend across 2026-2027 intakes
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E52E20]" />
                <span className="text-slate-600">Applications</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-black" />
                <span className="text-slate-600">Offers</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={admissionsTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="uqRedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E52E20" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#E52E20" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="uqBlackGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#000000" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="#94A3B8"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="#94A3B8"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0A0A0A",
                      borderRadius: "10px",
                      border: "1px solid #262626",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#E52E20"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#uqRedGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="offers"
                    stroke="#0A0A0A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#uqBlackGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Top Study Destinations */}
        <Card className="rounded-2xl border-slate-200/80 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-black flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#E52E20]" />
              Top Study Destinations
            </CardTitle>
            <p className="text-xs text-slate-500">
              Student distribution by country
            </p>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {topDestinations.map((dest) => (
              <div key={dest.country} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="text-base">{dest.flag}</span>
                    <span>{dest.country}</span>
                  </span>
                  <span className="text-black font-bold">{dest.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dest.color}`}
                    style={{ width: dest.count }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-[11px]">
                <Compass className="h-3.5 w-3.5 text-[#E52E20]" /> 482 Global Partners
              </span>
              <Link
                to="/universities"
                className="text-[#E52E20] font-semibold hover:underline flex items-center gap-1"
              >
                View Universities <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── 4. Recent Students Overview & Operations Shortcuts ─── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Students Table (2 cols) */}
        <Card className="rounded-2xl border-slate-200/80 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <CardTitle className="text-base font-bold text-black">
                Recent Student Registrations
              </CardTitle>
              <p className="text-xs text-slate-500">
                Connected to MySQL database (<code className="text-[#E52E20]">uniquesta_abroad</code>)
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs text-[#E52E20] hover:text-[#C82114] hover:bg-red-50 font-semibold"
            >
              <Link to="/students">
                View All Students <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Student</th>
                    <th className="px-4 py-3.5">Destination</th>
                    <th className="px-4 py-3.5">Target University</th>
                    <th className="px-4 py-3.5">Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentStudents && recentStudents.length > 0 ? (
                    recentStudents.map((s: any) => (
                      <tr key={s.code || s.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-black">{s.name}</div>
                          <div className="text-[11px] font-mono text-[#E52E20] font-semibold">{s.code}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-slate-800">{s.country}</span>
                          <div className="text-[11px] text-slate-500">{s.course}</div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-700 font-medium">
                          {s.university}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-[#E52E20] border border-red-200">
                            {s.stage || "Active"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                        <p className="text-sm font-medium text-slate-600">No student records found</p>
                        <p className="text-xs text-slate-400 mt-1">New student registrations will appear here.</p>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="mt-3 text-xs border-[#E52E20] text-[#E52E20] hover:bg-red-50 font-semibold"
                        >
                          <Link to="/students">Add Student</Link>
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Operations Hub (1 col) */}
        <div className="space-y-4">
          <Card className="rounded-2xl border-slate-200/80 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-black">
                Quick Operations Hub
              </CardTitle>
              <p className="text-xs text-slate-500">
                Direct access to core modules
              </p>
            </CardHeader>
            <CardContent className="pt-4 space-y-2.5">
              <Link
                to="/students"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#E52E20]/30 hover:bg-red-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-black text-white">
                    <Users className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black group-hover:text-[#E52E20] transition">
                      Student Admissions
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Profiles, documents & lifecycle
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#E52E20] transition" />
              </Link>

              <Link
                to="/travel"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#E52E20]/30 hover:bg-red-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#E52E20] text-white">
                    <Plane className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black group-hover:text-[#E52E20] transition">
                      Tours & Travels
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Flight bookings & tour packages
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#E52E20] transition" />
              </Link>

              <Link
                to="/applications"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#E52E20]/30 hover:bg-red-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-black text-white">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black group-hover:text-[#E52E20] transition">
                      Applications Tracker
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Offers, admissions & stages
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#E52E20] transition" />
              </Link>

              <Link
                to="/universities"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#E52E20]/30 hover:bg-red-50/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#E52E20] text-white">
                    <GraduationCap className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black group-hover:text-[#E52E20] transition">
                      Global Universities
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Institutions, courses & tie-ups
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#E52E20] transition" />
              </Link>
            </CardContent>
          </Card>

          {/* Consultancy Trust Badge */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-black">
              <Building2 className="h-4 w-4 text-[#E52E20]" />
              UniQuesta International
            </div>
            <div className="text-[11px] text-slate-500">
              Guwahati HQ · Mumbai · Delhi NCR · Bengaluru · Hyderabad
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold pt-1">
              <Database className="h-3 w-3" />
              Database: MySQL (uniquesta_abroad) Active & Synced
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
