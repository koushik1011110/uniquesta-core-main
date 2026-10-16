import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Bus,
  Ticket,
  Crown,
  Users,
  ExternalLink,
  Phone,
  Search,
  CheckCircle2,
  Sparkles,
  MapPin,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { setToken, setUser } from "@/lib/auth";
import { toast } from "sonner";

export type PortalType = "super-admin" | "office-admin" | "staff" | "traveler" | "driver";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { portal?: PortalType } => {
    const p = search.portal as string;
    if (["super-admin", "office-admin", "staff", "traveler", "driver"].includes(p)) {
      return { portal: p as PortalType };
    }
    return {};
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const initialPortal: PortalType = search.portal || "super-admin";

  const [activePortal, setActivePortal] = useState<PortalType>(initialPortal);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [emailForm, setEmailForm] = useState({
    email: "admin@uniquesta.com",
    password: "admin123",
  });
  const [branchSelect, setBranchSelect] = useState("Mumbai · Andheri West");
  const [travelerForm, setTravelerForm] = useState({ phoneOrRef: "UQ-TRV-1001" });
  const [driverForm, setDriverForm] = useState({ phone: "+91 98640 11223", password: "driver123" });

  // Sync state if URL query param changes
  useEffect(() => {
    if (search.portal && search.portal !== activePortal) {
      setActivePortal(search.portal);
    }
  }, [search.portal]);

  const switchPortal = (p: PortalType) => {
    setActivePortal(p);
    navigate({ search: ((prev: any) => ({ ...prev, portal: p })) as any });
    if (p === "super-admin") {
      setEmailForm({ email: "admin@uniquesta.com", password: "admin123" });
    } else if (p === "office-admin") {
      setEmailForm({ email: "mumbai.admin@uniquesta.com", password: "admin123" });
      setBranchSelect("Mumbai · Andheri West");
    } else if (p === "staff") {
      setEmailForm({ email: "meera.counselor@uniquesta.com", password: "staff123" });
    }
  };

  // Demo Credentials by Portal
  const superAdminPresets = [
    { email: "admin@uniquesta.com", pass: "admin123", role: "CEO · Executive Sign-off", name: "Mohammad Iqbal", branch: "Guwahati HQ", tagColor: "bg-red-500/10 text-[#E52E20] border-red-500/20" },
    { email: "director@uniquesta.com", pass: "admin123", role: "Director · Operations", name: "Vivek Ramanathan", branch: "Guwahati HQ", tagColor: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  ];

  const officeAdminPresets = [
    { email: "mumbai.admin@uniquesta.com", pass: "admin123", role: "Branch Admin · Mumbai Head", name: "Rahul Deshmukh", branch: "Mumbai · Andheri West", tagColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { email: "delhi.admin@uniquesta.com", pass: "admin123", role: "Branch Admin · North Region", name: "Karan Mehta", branch: "Delhi NCR", tagColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { email: "bangalore.admin@uniquesta.com", pass: "admin123", role: "Branch Admin · South Region", name: "Divya Rao", branch: "Bengaluru", tagColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { email: "hyderabad.admin@uniquesta.com", pass: "admin123", role: "Branch Admin · Telangana", name: "Rahul Reddy", branch: "Hyderabad", tagColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
  ];

  const staffPresets = [
    { email: "meera.counselor@uniquesta.com", pass: "staff123", role: "Admissions Counsellor", name: "Meera Shah", branch: "Mumbai (under Rahul D.)", tagColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { email: "harpreet.visa@uniquesta.com", pass: "staff123", role: "Visa & Doc Officer", name: "Harpreet Kaur", branch: "Delhi NCR (under Karan M.)", tagColor: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
    { email: "anjali.finance@uniquesta.com", pass: "staff123", role: "Finance · Accounts Lead", name: "Anjali Kapoor", branch: "Mumbai (under Rahul D.)", tagColor: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { email: "rohan.travel@uniquesta.com", pass: "staff123", role: "Travel Coordinator", name: "Rohan Patil", branch: "Mumbai (under Rahul D.)", tagColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
  ];

  const travelerPresets = [
    { ref: "UQ-TRV-1001", phone: "+91 98640 12345", name: "Aman Barman (Group of 14)", route: "Guwahati ➔ Kaziranga" },
    { ref: "UQ-TRV-1002", phone: "+91 98201 99882", name: "Pooja Sharma & Family", route: "Airport ➔ Hotel Vivanta" },
    { ref: "UQ-TRV-1003", phone: "+91 94351 22331", name: "St. Xavier College Excursion", route: "Guwahati ➔ Cherrapunjee" },
  ];

  const driverPresets = [
    { phone: "+91 98640 11223", pass: "driver123", name: "Babul Saikia", bus: "Force Urbania (17-Seater · AS-01-EB-4421)" },
    { phone: "+91 98201 44556", pass: "driver123", name: "Rajesh Sharma", bus: "BharatBenz AC (36-Seater · AS-01-TC-8809)" },
    { phone: "+91 94350 77889", pass: "driver123", name: "Nayan Das", bus: "Innova Crysta (7-Seater · AS-01-MA-1290)" },
  ];

  // Login Handlers
  const handleAdminOrStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.email || !emailForm.password) {
      toast.error("Email and password required");
      return;
    }
    setLoading(true);
    try {
      const res: any = await api.post<any>("/auth/login", emailForm);
      const data = res.data ?? res;
      const { user, token } = data;
      if (!token) throw new Error("No token returned");
      setToken(token);
      setUser(user);

      if (activePortal === "super-admin" && user.role !== "super_admin") {
        toast.warning(`Notice: Signed in as ${user.role} on Super Admin portal.`);
      } else {
        toast.success(`Welcome back, ${user.name}!`);
      }

      if (activePortal === "staff") {
        navigate({ to: "/leads" });
      } else {
        navigate({ to: "/" });
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTravelerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelerForm.phoneOrRef.trim()) {
      toast.error("Please enter mobile number or booking reference");
      return;
    }
    setLoading(true);
    try {
      const res: any = await api.post("/auth/traveler-login", {
        phone: travelerForm.phoneOrRef.trim(),
        booking_ref: travelerForm.phoneOrRef.trim(),
      });
      const data = res.data ?? res;
      if (!data.token) throw new Error("No token received");
      localStorage.setItem("uniquesta_traveler_token", data.token);
      localStorage.setItem("uniquesta_traveler_user", JSON.stringify(data.traveler));
      toast.success(`Welcome, ${data.traveler.name}! Opening your boarding pass...`);
      navigate({ to: "/traveler-portal" });
    } catch (err: any) {
      toast.error(err.message || "No booking found with this phone number or reference");
    } finally {
      setLoading(false);
    }
  };

  const handleDriverLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverForm.phone.trim()) {
      toast.error("Please enter your registered driver mobile number");
      return;
    }
    setLoading(true);
    try {
      const res: any = await api.post("/auth/driver-login", {
        phone: driverForm.phone.trim(),
        password: driverForm.password || "driver123",
      });
      const data = res.data ?? res;
      if (!data.token) throw new Error("No driver token returned");
      localStorage.setItem("uniquesta_driver_token", data.token);
      localStorage.setItem("uniquesta_driver_user", JSON.stringify(data.driver));
      toast.success(`Welcome back, Captain ${data.driver.name}!`);
      navigate({ to: "/driver-portal" });
    } catch (err: any) {
      toast.error(err.message || "Driver login failed. Please check mobile/PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* ─── Left — Comprehensive Multi-Portal Showcase (Desktop) ─── */}
      <div className="hidden w-[46%] flex-col justify-between bg-gradient-to-br from-[#07090F] via-[#0E131F] to-[#07090F] p-8 lg:p-10 text-white border-r border-slate-800 lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden bg-white shadow p-0.5 border border-white/30 flex items-center justify-center">
              <img src="/logo.png" alt="UniQuesta Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="text-xl font-black leading-none tracking-tight">
                <span className="text-white">Uni</span>
                <span className="text-[#E52E20]">Questa</span>
              </div>
              <div className="text-[10px] font-serif font-bold tracking-widest uppercase text-slate-300 mt-0.5">
                INTERNATIONAL · MULTI-PORTAL
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/15 border border-red-500/30 px-3.5 py-1 text-xs text-red-300 backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-[#E52E20]" /> Enterprise Multi-Tier Access Control
          </div>

          <div>
            <h1 className="text-[32px] font-black leading-tight tracking-tight text-white">
              Dedicated Logins for Every Role
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              UniQuesta provides 5 isolated, role-tailored authentication portals with segregated security, dedicated permissions, and live audit trails.
            </p>
          </div>

          {/* 5 Portals Grid Cards */}
          <div className="grid grid-cols-1 gap-2.5 pt-2">
            <div
              onClick={() => switchPortal("super-admin")}
              className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                activePortal === "super-admin"
                  ? "bg-red-500/15 border-red-500/50 shadow-md shadow-red-950/50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-red-950 text-red-400 border border-red-800 flex items-center justify-center font-bold">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Super Admin Portal
                    {activePortal === "super-admin" && <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />}
                  </div>
                  <div className="text-[11px] text-slate-400">CEO, Managing Directors & HQ Executives</div>
                </div>
              </div>
              <Link to="/super-admin-login" className="text-[11px] font-semibold text-red-400 hover:underline flex items-center gap-1">
                Direct Page <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div
              onClick={() => switchPortal("office-admin")}
              className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                activePortal === "office-admin"
                  ? "bg-indigo-500/15 border-indigo-500/50 shadow-md shadow-indigo-950/50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Office / Branch Admin Portal
                    {activePortal === "office-admin" && <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />}
                  </div>
                  <div className="text-[11px] text-slate-400">Branch Heads (Mumbai, Delhi, Bengaluru, Hyderabad)</div>
                </div>
              </div>
              <Link to="/office-login" className="text-[11px] font-semibold text-indigo-400 hover:underline flex items-center gap-1">
                Direct Page <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div
              onClick={() => switchPortal("staff")}
              className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                activePortal === "staff"
                  ? "bg-emerald-500/15 border-emerald-500/50 shadow-md shadow-emerald-950/50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Staff & Counsellors Workspace
                    {activePortal === "staff" && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />}
                  </div>
                  <div className="text-[11px] text-slate-400">Admissions, Visa Filing, Finance & Support Staff</div>
                </div>
              </div>
              <Link to="/staff-login" className="text-[11px] font-semibold text-emerald-400 hover:underline flex items-center gap-1">
                Direct Page <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div
              onClick={() => switchPortal("traveler")}
              className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                activePortal === "traveler"
                  ? "bg-blue-500/15 border-blue-500/50 shadow-md shadow-blue-950/50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center font-bold">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Traveler & Passenger Portal
                    {activePortal === "traveler" && <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />}
                  </div>
                  <div className="text-[11px] text-slate-400">Boarding Pass, Driver Tracking & Trip Itinerary</div>
                </div>
              </div>
              <Link to="/traveler-login" className="text-[11px] font-semibold text-blue-400 hover:underline flex items-center gap-1">
                Direct Page <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div
              onClick={() => switchPortal("driver")}
              className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                activePortal === "driver"
                  ? "bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-950/50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-bold">
                  <Bus className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Driver & Fleet Captain Terminal
                    {activePortal === "driver" && <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />}
                  </div>
                  <div className="text-[11px] text-slate-400">Passenger Manifest, Mobile Check-in & Route SOS</div>
                </div>
              </div>
              <Link to="/driver-login" className="text-[11px] font-semibold text-amber-400 hover:underline flex items-center gap-1">
                Direct Page <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500">© 2026 UniQuesta International · Enterprise Security</div>
      </div>

      {/* ─── Right — Active Portal Interactive Login Card ─── */}
      <div className="flex flex-1 items-center justify-center p-3 sm:p-6 md:p-8">
        <div className="w-full max-w-[500px] space-y-4">
          {/* Mobile Top Branding */}
          <div className="flex items-center justify-between lg:hidden mb-2">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-white shadow p-0.5 border border-slate-200 flex items-center justify-center">
                <img src="/logo.png" alt="UniQuesta Logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="font-black text-lg leading-none">
                  <span className="text-white">Uni</span>
                  <span className="text-[#E52E20]">Questa</span>
                </div>
                <div className="text-[9.5px] font-bold text-slate-400 tracking-wider">SEPARATE LOGINS</div>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">
              v2.6 Enterprise
            </Badge>
          </div>

          <Card className="rounded-2xl border-slate-800 bg-slate-900/95 shadow-2xl backdrop-blur overflow-hidden text-slate-100">
            {/* ─── 5-Way Portal Selector Pill Bar ─── */}
            <div className="p-2 sm:p-2.5 bg-slate-950 border-b border-slate-800/80">
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 px-1 mb-1.5 flex items-center justify-between">
                <span>Select Your Login Portal:</span>
                <span className="text-[10px] text-slate-500 font-mono">5 Role Terminals</span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => switchPortal("super-admin")}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-xl font-bold transition ${
                    activePortal === "super-admin"
                      ? "bg-red-950 text-red-200 border border-red-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                  title="Super Admin & Executive Portal"
                >
                  <Crown className="h-4 w-4 shrink-0 text-red-400" />
                  <span className="truncate">Super Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => switchPortal("office-admin")}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-xl font-bold transition ${
                    activePortal === "office-admin"
                      ? "bg-indigo-950 text-indigo-200 border border-indigo-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                  title="Office & Branch Admin Portal"
                >
                  <Building2 className="h-4 w-4 shrink-0 text-indigo-400" />
                  <span className="truncate">Office Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => switchPortal("staff")}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-xl font-bold transition ${
                    activePortal === "staff"
                      ? "bg-emerald-950 text-emerald-200 border border-emerald-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                  title="Staff & Counsellors Workspace"
                >
                  <Users className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="truncate">Staff</span>
                </button>

                <button
                  type="button"
                  onClick={() => switchPortal("traveler")}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-xl font-bold transition ${
                    activePortal === "traveler"
                      ? "bg-blue-950 text-blue-200 border border-blue-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                  title="Traveler & Passenger Boarding Pass"
                >
                  <Ticket className="h-4 w-4 shrink-0 text-blue-400" />
                  <span className="truncate">Traveler</span>
                </button>

                <button
                  type="button"
                  onClick={() => switchPortal("driver")}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-xl font-bold transition ${
                    activePortal === "driver"
                      ? "bg-amber-950 text-amber-200 border border-amber-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                  title="Driver & Fleet Captain Terminal"
                >
                  <Bus className="h-4 w-4 shrink-0 text-amber-400" />
                  <span className="truncate">Driver</span>
                </button>
              </div>
            </div>

            {/* ─── Active Portal Dynamic Header ─── */}
            <div className="p-4 sm:p-5 border-b border-slate-800">
              {activePortal === "super-admin" && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/40 text-[11px] font-semibold gap-1.5">
                      <Crown className="h-3.5 w-3.5 text-[#E52E20]" /> 1. Super Admin Portal
                    </Badge>
                    <Link to="/super-admin-login" className="text-[11px] text-red-400 hover:underline flex items-center gap-1">
                      Standalone Page ➔
                    </Link>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-black text-white pt-1">
                    Super Admin & Executive Login
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-300">
                    Highest authority access: Full multi-branch oversight, financial executive sign-offs, role configuration, and analytics.
                  </CardDescription>
                </div>
              )}

              {activePortal === "office-admin" && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-[11px] font-semibold gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-indigo-400" /> 2. Office & Branch Admin Portal
                    </Badge>
                    <Link to="/office-login" className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1">
                      Standalone Page ➔
                    </Link>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-black text-white pt-1">
                    Branch & Office Admin Login
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-300">
                    Regional branch management: Staff team oversight, local student applications, branch targets, and branch expense approvals.
                  </CardDescription>
                </div>
              )}

              {activePortal === "staff" && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px] font-semibold gap-1.5">
                      <Users className="h-3.5 w-3.5 text-emerald-400" /> 3. Staff & Counsellor Portal
                    </Badge>
                    <Link to="/staff-login" className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1">
                      Standalone Page ➔
                    </Link>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-black text-white pt-1">
                    Staff & Counsellors Workspace
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-300">
                    Field operations: Student counselling, university applications, visa document submission, and expense reimbursement claims.
                  </CardDescription>
                </div>
              )}

              {activePortal === "traveler" && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 text-[11px] font-semibold gap-1.5">
                      <Ticket className="h-3.5 w-3.5 text-blue-400" /> 4. Traveler & Passenger Portal
                    </Badge>
                    <Link to="/traveler-login" className="text-[11px] text-blue-400 hover:underline flex items-center gap-1">
                      Standalone Page ➔
                    </Link>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-black text-white pt-1">
                    Traveler E-Ticket & Boarding Pass
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-300">
                    Instant access for tour passengers & study abroad students: Digital boarding passes, driver details & live bus updates.
                  </CardDescription>
                </div>
              )}

              {activePortal === "driver" && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[11px] font-semibold gap-1.5">
                      <Bus className="h-3.5 w-3.5 text-amber-400" /> 5. Driver & Fleet Captain Terminal
                    </Badge>
                    <Link to="/driver-login" className="text-[11px] text-amber-400 hover:underline flex items-center gap-1">
                      Standalone Page ➔
                    </Link>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-black text-white pt-1">
                    Driver Mobile Dispatch Terminal
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-300">
                    Fleet crew terminal: Live passenger manifest, pickup passenger verification, trip navigation, and emergency SOS dispatch.
                  </CardDescription>
                </div>
              )}
            </div>

            {/* ─── Active Portal Login Form ─── */}
            <CardContent className="p-4 sm:p-6 space-y-4">
              {/* Case 1: Super Admin, Office Admin, or Staff */}
              {(activePortal === "super-admin" || activePortal === "office-admin" || activePortal === "staff") && (
                <form onSubmit={handleAdminOrStaffLogin} className="space-y-4">
                  {/* Branch selector for Office Admin */}
                  {activePortal === "office-admin" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="branch-select" className="text-xs font-semibold text-slate-300">
                        Office / Branch
                      </Label>
                      <select
                        id="branch-select"
                        value={branchSelect}
                        onChange={(e) => setBranchSelect(e.target.value)}
                        className="w-full h-10 px-3 bg-slate-950 border border-slate-700 text-white rounded-xl text-xs sm:text-sm focus:border-indigo-500 outline-none"
                      >
                        <option value="Mumbai · Andheri West">Mumbai · Andheri West</option>
                        <option value="Delhi NCR · Connaught Place">Delhi NCR · Connaught Place</option>
                        <option value="Bengaluru · Indiranagar">Bengaluru · Indiranagar</option>
                        <option value="Hyderabad · Banjara Hills">Hyderabad · Banjara Hills</option>
                        <option value="Guwahati HQ · Christian Basti">Guwahati HQ · Christian Basti</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-300">
                      {activePortal === "super-admin"
                        ? "Super Admin Email"
                        : activePortal === "office-admin"
                        ? "Branch Admin Email"
                        : "Staff Work Email"}
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={emailForm.email}
                        onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                        placeholder="email@uniquesta.com"
                        className="h-10 pl-9 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm placeholder:text-slate-500 focus:border-[#E52E20]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <Label htmlFor="password" className="font-semibold text-slate-300">
                        Password
                      </Label>
                      <span className="text-slate-500 text-[11px]">Secure Login</span>
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="password"
                        type={show ? "text" : "password"}
                        value={emailForm.password}
                        onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="h-10 pl-9 pr-9 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm placeholder:text-slate-500 focus:border-[#E52E20]"
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
                    className={`h-11 w-full gap-2 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all ${
                      activePortal === "super-admin"
                        ? "bg-[#E52E20] hover:bg-[#C82114]"
                        : activePortal === "office-admin"
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                    {loading
                      ? "Verifying..."
                      : activePortal === "super-admin"
                      ? "Sign In as Super Admin"
                      : activePortal === "office-admin"
                      ? "Sign In as Branch Admin"
                      : "Sign In as Staff"}
                  </Button>
                </form>
              )}

              {/* Case 2: Traveler Portal */}
              {activePortal === "traveler" && (
                <form onSubmit={handleTravelerLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      Mobile Number OR Booking Reference *
                    </Label>
                    <div className="relative">
                      <Ticket className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                      <Input
                        type="text"
                        placeholder="e.g. UQ-TRV-1001 or +91 98640 12345"
                        value={travelerForm.phoneOrRef}
                        onChange={(e) => setTravelerForm({ phoneOrRef: e.target.value })}
                        className="h-10 pl-9 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm placeholder:text-slate-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ticket className="h-4 w-4" />}
                    {loading ? "Searching Ticket..." : "Lookup Boarding Pass & Trip ➔"}
                  </Button>
                </form>
              )}

              {/* Case 3: Driver Portal */}
              {activePortal === "driver" && (
                <form onSubmit={handleDriverLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">
                      Captain Mobile Number *
                    </Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400" />
                      <Input
                        type="tel"
                        placeholder="e.g. +91 98640 11223 or Babul Saikia"
                        value={driverForm.phone}
                        onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                        className="h-10 pl-9 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm placeholder:text-slate-500 focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">Driver PIN</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="password"
                        placeholder="Enter PIN (default: driver123)"
                        value={driverForm.password}
                        onChange={(e) => setDriverForm({ ...driverForm, password: e.target.value })}
                        className="h-10 pl-9 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm placeholder:text-slate-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bus className="h-4 w-4" />}
                    {loading ? "Connecting Terminal..." : "Login to Driver Terminal ➔"}
                  </Button>
                </form>
              )}

              {/* ─── 1-Click Fill Test Presets for Active Portal ─── */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1 bg-slate-800" />
                  <span className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-400">
                    {activePortal === "super-admin" && "Super Admin Credentials (1-Click)"}
                    {activePortal === "office-admin" && "Branch Admin Accounts (1-Click)"}
                    {activePortal === "staff" && "Staff Profiles (1-Click)"}
                    {activePortal === "traveler" && "Demo Passenger Bookings (1-Click)"}
                    {activePortal === "driver" && "Fleet Captain Presets (1-Click)"}
                  </span>
                  <div className="h-px flex-1 bg-slate-800" />
                </div>

                <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
                  {/* Super Admin Presets */}
                  {activePortal === "super-admin" &&
                    superAdminPresets.map((u) => (
                      <button
                        key={u.email}
                        type="button"
                        onClick={() => setEmailForm({ email: u.email, password: u.pass })}
                        className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-red-500/40 text-left transition"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-200">{u.name}</span>
                            <span className="text-[9.5px] bg-red-950 text-red-300 border border-red-800 px-1 py-0.2 rounded">
                              {u.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{u.email}</div>
                        </div>
                        <span className="shrink-0 text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {u.pass}
                        </span>
                      </button>
                    ))}

                  {/* Office Admin Presets */}
                  {activePortal === "office-admin" &&
                    officeAdminPresets.map((u) => (
                      <button
                        key={u.email}
                        type="button"
                        onClick={() => {
                          setEmailForm({ email: u.email, password: u.pass });
                          setBranchSelect(u.branch);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-indigo-500/40 text-left transition"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-200">{u.name}</span>
                            <span className="text-[9.5px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-1 py-0.2 rounded">
                              {u.branch.split("·")[0].trim()}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{u.email}</div>
                        </div>
                        <span className="shrink-0 text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {u.pass}
                        </span>
                      </button>
                    ))}

                  {/* Staff Presets */}
                  {activePortal === "staff" &&
                    staffPresets.map((u) => (
                      <button
                        key={u.email}
                        type="button"
                        onClick={() => setEmailForm({ email: u.email, password: u.pass })}
                        className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-emerald-500/40 text-left transition"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-200">{u.name}</span>
                            <span className="text-[9.5px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1 py-0.2 rounded">
                              {u.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{u.branch}</div>
                        </div>
                        <span className="shrink-0 text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {u.pass}
                        </span>
                      </button>
                    ))}

                  {/* Traveler Presets */}
                  {activePortal === "traveler" &&
                    travelerPresets.map((u) => (
                      <button
                        key={u.ref}
                        type="button"
                        onClick={() => setTravelerForm({ phoneOrRef: u.ref })}
                        className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-blue-500/40 text-left transition"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold text-slate-200">{u.name}</div>
                          <div className="text-[11px] text-blue-400 font-mono">{u.route}</div>
                        </div>
                        <span className="shrink-0 text-[10px] font-mono text-blue-300 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800">
                          {u.ref}
                        </span>
                      </button>
                    ))}

                  {/* Driver Presets */}
                  {activePortal === "driver" &&
                    driverPresets.map((u) => (
                      <button
                        key={u.phone}
                        type="button"
                        onClick={() => setDriverForm({ phone: u.phone, password: u.pass })}
                        className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-amber-500/40 text-left transition"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-bold text-slate-200">Captain {u.name}</div>
                          <div className="text-[11px] text-amber-400 truncate">{u.bus}</div>
                        </div>
                        <span className="shrink-0 text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {u.phone}
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Bottom Security Note */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Multi-tenant JWT Auth</span>
                <span className="text-slate-300 font-semibold">14 Branches Connected</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
