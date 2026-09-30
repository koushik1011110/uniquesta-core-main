import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import {
  GraduationCap,
  FileText,
  CreditCard,
  Plane,
  FileCheck,
  Building2,
  HelpCircle,
  Bell,
  User,
  CheckCircle2,
  Clock,
  Download,
  Upload,
  Calendar,
  DollarSign,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Plus,
  ArrowRight,
  AlertCircle,
  Eye,
  Check,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/portal")({
  head: () => ({
    meta: [
      { title: "Student Portal · Uniquesta" },
      {
        name: "description",
        content:
          "Self-service portal for students and parents to track admission status, offer letters, fee installments, visa, travel, and documents.",
      },
    ],
  }),
  component: StudentPortalPage,
});

// Mock Initial Data
const initialNotifications = [
  {
    id: "N1",
    title: "Visa Study Permit Approved!",
    desc: "Your Canadian Study Permit application has been approved by IRCC. Passport request received.",
    time: "2 hours ago",
    read: false,
    type: "visa",
  },
  {
    id: "N2",
    title: "Installment #2 Due Reminder",
    desc: "2nd tuition fee installment of CAD $12,500 is due on 15 August 2026.",
    time: "Yesterday",
    read: false,
    type: "fee",
  },
  {
    id: "N3",
    title: "Official Offer Letter Ready",
    desc: "University of Toronto has issued your Unconditional Offer Letter for M.S. CS.",
    time: "3 days ago",
    read: true,
    type: "admission",
  },
];

const initialDocuments = [
  { id: "D1", name: "Passport_Scan_Valid2030.pdf", category: "Identity", status: "Verified", date: "10 May 2026" },
  { id: "D2", name: "IELTS_Official_Scorecard_8.0.pdf", category: "Academic", status: "Verified", date: "14 May 2026" },
  { id: "D3", name: "B.Tech_Degree_Transcripts.pdf", category: "Academic", status: "Verified", date: "18 May 2026" },
  { id: "D4", name: "UofT_Unconditional_Offer.pdf", category: "Admission", status: "Verified", date: "02 Jul 2026" },
  { id: "D5", name: "Bank_Solvency_Certificate.pdf", category: "Financial", status: "Verified", date: "12 Jul 2026" },
  { id: "D6", name: "Medical_Fitness_Proof.pdf", category: "Health & Visa", status: "Under Review", date: "20 Jul 2026" },
];

const initialInstallments = [
  { number: 1, title: "Admission Deposit & Slot Confirmation", amount: "CAD $5,000", dueDate: "15 Jun 2026", status: "Paid", paidOn: "12 Jun 2026", ref: "TXN-998201" },
  { number: 2, title: "Fall 2026 Semester Tuition (1st Term)", amount: "CAD $12,500", dueDate: "15 Aug 2026", status: "Upcoming Due", paidOn: "-", ref: "-" },
  { number: 3, title: "Spring 2027 Semester Tuition (2nd Term)", amount: "CAD $12,500", dueDate: "15 Jan 2027", status: "Pending", paidOn: "-", ref: "-" },
  { number: 4, title: "Campus Health Insurance & Admin Fee", amount: "CAD $1,200", dueDate: "15 Jan 2027", status: "Pending", paidOn: "-", ref: "-" },
];

const initialTickets = [
  { id: "TK-402", subject: "Housing & Dormitory Booking Assistance", category: "Travel & Housing", status: "In Progress", date: "21 Jul 2026", lastUpdate: "Counsellor Meera replied: Residence options sent to email." },
  { id: "TK-388", subject: "Fee Receipt Request for Visa File", category: "Fees & Receipts", status: "Resolved", date: "10 Jul 2026", lastUpdate: "Official GIC & Fee deposit receipt attached." },
];

interface JourneyStep {
  title: string;
  desc: string;
  status: "completed" | "current" | "upcoming";
  date: string;
  icon: LucideIcon;
}

const journeyTimeline: JourneyStep[] = [
  { title: "Application Submitted", desc: "Submitted to University of Toronto", status: "completed", date: "15 May 2026", icon: FileText },
  { title: "Offer Letter Issued", desc: "Unconditional Offer Received", status: "completed", date: "02 Jul 2026", icon: GraduationCap },
  { title: "Deposit Fee Paid", desc: "CAD $5,000 Seat confirmed", status: "completed", date: "12 Jun 2026", icon: CreditCard },
  { title: "Visa Approved", desc: "Canadian Study Permit Approved", status: "current", date: "22 Jul 2026", icon: ShieldCheck },
  { title: "Flight & Housing", desc: "Toronto Departure booked for Aug 28", status: "upcoming", date: "Target 28 Aug", icon: Plane },
];

function StudentPortalPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const qc = useQueryClient();
  const { data: apiStudent } = useQuery({ queryKey:["portal-student"], queryFn: async()=>{ try{ const r:any=await api.get<any[]>("/students",{limit:1}); const d=r.data ?? r ?? []; return d[0] ?? null; } catch{ return null; } } });
  const [notifications, setNotifications] = useState(initialNotifications);
  const [documents, setDocuments] = useState(initialDocuments);
  const [installments, setInstallments] = useState(initialInstallments);
  const [tickets, setTickets] = useState(initialTickets);

  // Dialog States
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [travelModalOpen, setTravelModalOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Selected Installment for Payment
  const [selectedInstallment, setSelectedInstallment] = useState<typeof initialInstallments[0] | null>(null);

  // Form States
  const [uploadData, setUploadData] = useState({ name: "", category: "Academic" });
  const [ticketData, setTicketData] = useState({ subject: "", category: "General Inquiry", description: "" });
  const [travelData, setTravelData] = useState({ flightNo: "AC-855", date: "2026-08-28", airline: "Air Canada", pickup: true });

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // Handlers
  const handlePayInstallment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstallment) return;
    setInstallments(
      installments.map((inst) =>
        inst.number === selectedInstallment.number
          ? { ...inst, status: "Paid", paidOn: "Today (23 Jul 2026)", ref: `TXN-${Math.floor(100000 + Math.random() * 900000)}` }
          : inst
      )
    );
    setPayModalOpen(false);
    toast.success(`Payment of ${selectedInstallment.amount} Successful!`, {
      description: "Official receipt generated and emailed to student and parent.",
    });
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.name) {
      toast.error("Please enter a document name.");
      return;
    }
    const newDoc = {
      id: `D${documents.length + 1}`,
      name: uploadData.name.endsWith(".pdf") ? uploadData.name : `${uploadData.name}.pdf`,
      category: uploadData.category,
      status: "Under Review",
      date: "23 Jul 2026",
    };
    setDocuments([...documents, newDoc]);
    setUploadModalOpen(false);
    setUploadData({ name: "", category: "Academic" });
    toast.success("Document Uploaded Successfully!", {
      description: "Our compliance team will verify it within 24 hours.",
    });
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketData.subject || !ticketData.description) {
      toast.error("Please fill in subject and description.");
      return;
    }
    const newTk = {
      id: `TK-${Math.floor(403 + Math.random() * 100)}`,
      subject: ticketData.subject,
      category: ticketData.category,
      status: "Open",
      date: "23 Jul 2026",
      lastUpdate: "Ticket received. Assigned to Senior Counsellor Meera Shah.",
    };
    setTickets([newTk, ...tickets]);
    setTicketModalOpen(false);
    setTicketData({ subject: "", category: "General Inquiry", description: "" });
    toast.success("Support Ticket Raised!", {
      description: "Counsellor will respond within 4 business hours.",
    });
  };

  const handleSaveTravel = (e: React.FormEvent) => {
    e.preventDefault();
    setTravelModalOpen(false);
    toast.success("Travel Details & Airport Pickup Confirmed!", {
      description: "University International Student Services notified for airport pickup.",
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Profile Overview Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-card p-6 border shadow-soft">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-soft">
            PS
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-bold text-foreground">Priya Sharma</span>
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border-emerald-500/30">
                Visa Approved
              </Badge>
              <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                ID: UNI-2026-9102
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              M.S. in Computer Science · <span className="font-medium text-foreground">University of Toronto, Canada</span> (Fall 2026)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Notifications Button */}
          <Button
            variant="outline"
            className="relative rounded-xl border-border/80 shadow-xs text-xs sm:text-sm"
            onClick={() => setNotifModalOpen(true)}
          >
            <Bell className="h-4 w-4 mr-1.5 text-primary" />
            Notifications
            {unreadNotifCount > 0 && (
              <span className="ml-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 grid place-items-center">
                {unreadNotifCount}
              </span>
            )}
          </Button>

          {/* Profile & Contacts Button */}
          <Button
            variant="outline"
            className="rounded-xl border-border/80 shadow-xs text-xs sm:text-sm"
            onClick={() => setProfileModalOpen(true)}
          >
            <User className="h-4 w-4 mr-1.5 text-slate-600 dark:text-slate-300" />
            My Profile & Parents
          </Button>

          {/* Offer Letter Quick Action */}
          <Button
            className="rounded-xl shadow-sm bg-primary text-primary-foreground text-xs sm:text-sm font-medium"
            onClick={() => setOfferModalOpen(true)}
          >
            <FileText className="h-4 w-4 mr-1.5" />
            View Offer Letter
          </Button>
        </div>
      </div>

      {/* Main Portal Navigation Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className="border-b pb-2">
          <TabsList className="bg-muted/60 p-1 rounded-xl h-auto gap-1 flex-wrap">
            <TabsTrigger value="overview" className="rounded-lg text-xs sm:text-sm py-2 px-3 sm:px-4">
              <GraduationCap className="h-4 w-4 mr-2" />
              Admission & Journey
            </TabsTrigger>
            <TabsTrigger value="offer" className="rounded-lg text-xs sm:text-sm py-2 px-3 sm:px-4">
              <FileText className="h-4 w-4 mr-2" />
              Offer & University
            </TabsTrigger>
            <TabsTrigger value="fees" className="rounded-lg text-xs sm:text-sm py-2 px-3 sm:px-4">
              <CreditCard className="h-4 w-4 mr-2" />
              Fees & Installments
            </TabsTrigger>
            <TabsTrigger value="visa" className="rounded-lg text-xs sm:text-sm py-2 px-3 sm:px-4">
              <Plane className="h-4 w-4 mr-2" />
              Visa & Travel
            </TabsTrigger>
            <TabsTrigger value="documents" className="rounded-lg text-xs sm:text-sm py-2 px-3 sm:px-4">
              <FileCheck className="h-4 w-4 mr-2" />
              Documents Vault
            </TabsTrigger>
            <TabsTrigger value="support" className="rounded-lg text-xs sm:text-sm py-2 px-3 sm:px-4">
              <HelpCircle className="h-4 w-4 mr-2" />
              Support & Help
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: ADMISSION STATUS & JOURNEY */}
        <TabsContent value="overview" className="space-y-6 m-0">
          {/* Main Admission Progress & Timeline */}
          <Card className="rounded-2xl shadow-soft">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b">
              <div>
                <CardTitle className="text-base font-semibold">Admission Progress & Journey Tracker</CardTitle>
                <CardDescription>
                  Step-by-step guidance for students and parents from application to campus arrival
                </CardDescription>
              </div>
              <Badge variant="outline" className="rounded-md border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-semibold self-start sm:self-auto mt-2 sm:mt-0">
                Overall Progress: 80% Complete
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <Progress value={80} className="h-2 mb-8" />

              {/* Journey Steps Grid */}
              <div className="grid gap-4 sm:grid-cols-5">
                {journeyTimeline.map((step, idx) => {
                  const IconComponent = step.icon;
                  return (
                    <div
                      key={idx}
                      className={`relative rounded-xl border p-4 transition-all ${
                        step.status === "completed"
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : step.status === "current"
                          ? "bg-primary/10 border-primary shadow-soft"
                          : "bg-muted/30 border-border text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`grid h-9 w-9 place-items-center rounded-xl ${
                            step.status === "completed"
                              ? "bg-emerald-500 text-white"
                              : step.status === "current"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.status === "completed" ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <IconComponent className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-[11px] font-mono font-medium">Step {idx + 1}</span>
                      </div>
                      <div className="font-semibold text-sm text-foreground">{step.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{step.desc}</div>
                      <div className="mt-3 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        {step.date}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Summary Cards Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Card 1: University Admission Info */}
            <Card className="rounded-2xl shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold">Target University</CardTitle>
                <Building2 className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="font-bold text-foreground">University of Toronto</div>
                  <div className="text-xs text-muted-foreground">St. George Campus · Toronto, ON, Canada</div>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground border-t pt-3">
                  <div className="flex justify-between">
                    <span>Degree & Major:</span>
                    <span className="font-medium text-foreground">M.S. Computer Science</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Program Duration:</span>
                    <span className="font-medium text-foreground">2 Years (4 Semesters)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Orientation Date:</span>
                    <span className="font-medium text-foreground">01 September 2026</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl text-xs mt-2"
                  onClick={() => setActiveTab("offer")}
                >
                  View University & Offer Info
                </Button>
              </CardContent>
            </Card>

            {/* Card 2: Visa & Travel Status */}
            <Card className="rounded-2xl shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold">Visa & Flight Status</CardTitle>
                <Plane className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Canadian Study Permit:</span>
                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                    APPROVED
                  </Badge>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground border-t pt-3">
                  <div className="flex justify-between">
                    <span>Visa Document (LOI):</span>
                    <span className="font-medium text-foreground">Issued #CA-884920</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flight Departure:</span>
                    <span className="font-medium text-foreground">28 Aug 2026 (Air Canada AC-855)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Airport Pickup:</span>
                    <span className="font-medium text-emerald-600">Confirmed (Uni Bus)</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl text-xs mt-2"
                  onClick={() => setActiveTab("visa")}
                >
                  View Travel Details & Passports
                </Button>
              </CardContent>
            </Card>

            {/* Card 3: Assigned Counsellor & Parent Contact */}
            <Card className="rounded-2xl shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-semibold">Assigned Counsellor</CardTitle>
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-bold">
                    MS
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Meera Shah</div>
                    <div className="text-xs text-muted-foreground">Senior Academic Counsellor · Uniquesta</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground border-t pt-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-foreground">meera.shah@uniquesta.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-foreground">+91 98200 11223</span>
                  </div>
                </div>

                <Button
                  className="w-full rounded-xl text-xs font-semibold"
                  onClick={() => setTicketModalOpen(true)}
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Chat / Ask Question
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: OFFER LETTER & UNIVERSITY INFO */}
        <TabsContent value="offer" className="space-y-6 m-0">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Card: Official Offer Letter */}
            <Card className="rounded-2xl shadow-soft lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-base font-semibold">Official University Offer Letter</CardTitle>
                  <CardDescription>Issued by Admissions Office, University of Toronto</CardDescription>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                  Unconditional Offer
                </Badge>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                <div className="rounded-xl border p-5 bg-muted/20 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-muted-foreground">Student Name:</span>
                      <div className="font-bold text-foreground">Priya Sharma</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Application ID:</span>
                      <div className="font-mono font-bold text-foreground">UofT-2026-CS8891</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Program:</span>
                      <div className="font-bold text-foreground">Master of Science in Computer Science</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Faculty:</span>
                      <div className="font-bold text-foreground">Faculty of Arts & Science</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Program Start Date:</span>
                      <div className="font-bold text-foreground">08 September 2026</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tuition Fee (Per Year):</span>
                      <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">CAD $30,000</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button className="rounded-xl shadow-soft" onClick={() => setOfferModalOpen(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Full Offer Letter
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => toast.success("Downloading Offer Letter PDF...")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Official PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right Card: University Info & Campus Guide */}
            <Card className="rounded-2xl shadow-soft lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-semibold">University Information</CardTitle>
                <CardDescription>St. George Campus, Toronto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>27 King's College Circle, Toronto, ON M5S 1A1, Canada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Ranked #21 Worldwide (QS 2026)</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="font-semibold text-xs text-foreground uppercase tracking-wide">
                    International Student Office
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Helpdesk:</span>
                      <span className="font-medium text-foreground">cie.information@utoronto.ca</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Housing Desk:</span>
                      <span className="font-medium text-foreground">housing.services@utoronto.ca</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-xl text-xs mt-2"
                  onClick={() => toast.info("Opening University Welcome Guide...")}
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Campus Welcome Guide
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: FEES & INSTALLMENTS */}
        <TabsContent value="fees" className="space-y-6 m-0">
          {/* Fee Summary Banner */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card className="rounded-2xl shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs uppercase font-semibold text-muted-foreground">Total Tuition Fee</div>
                <div className="text-2xl font-bold text-foreground mt-1">CAD $30,000</div>
                <div className="text-xs text-muted-foreground mt-1">1st Academic Year</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-soft bg-emerald-500/5 border-emerald-500/20">
              <CardContent className="p-5">
                <div className="text-xs uppercase font-semibold text-emerald-600 dark:text-emerald-400">Scholarship Awarded</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">- CAD $3,800</div>
                <div className="text-xs text-muted-foreground mt-1">Merit Excellence Grant</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs uppercase font-semibold text-muted-foreground">Deposit Paid</div>
                <div className="text-2xl font-bold text-foreground mt-1">CAD $5,000</div>
                <div className="text-xs text-emerald-600 font-medium mt-1">Verified & Receipt Issued</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-soft bg-primary/5 border-primary/20">
              <CardContent className="p-5">
                <div className="text-xs uppercase font-semibold text-primary">Net Balance Remaining</div>
                <div className="text-2xl font-bold text-primary mt-1">CAD $21,200</div>
                <div className="text-xs text-muted-foreground mt-1">Split in 3 installments</div>
              </CardContent>
            </Card>
          </div>

          {/* Installment Payment Table */}
          <Card className="rounded-2xl shadow-soft">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4">
              <div>
                <CardTitle className="text-base font-semibold">Tuition Fee Installment Schedule</CardTitle>
                <CardDescription>
                  Clear payment schedule designed for students and parents. Pay securely online.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground border-b">
                    <tr>
                      <th className="px-5 py-3 text-left font-medium">Inst #</th>
                      <th className="px-5 py-3 text-left font-medium">Description</th>
                      <th className="px-5 py-3 text-right font-medium">Amount</th>
                      <th className="px-5 py-3 text-left font-medium">Due Date</th>
                      <th className="px-5 py-3 text-left font-medium">Status</th>
                      <th className="px-5 py-3 text-right font-medium">Reference / Receipt</th>
                      <th className="px-5 py-3 text-center font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.map((inst) => (
                      <tr key={inst.number} className="border-t border-border/60 hover:bg-muted/30">
                        <td className="px-5 py-3.5 font-mono font-bold text-foreground">
                          #{inst.number}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-foreground">
                          {inst.title}
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-foreground font-mono">
                          {inst.amount}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">{inst.dueDate}</td>
                        <td className="px-5 py-3.5">
                          <Badge
                            className={`rounded-md ${
                              inst.status === "Paid"
                                ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                                : inst.status === "Upcoming Due"
                                ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {inst.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-xs text-muted-foreground">
                          {inst.ref}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {inst.status === "Paid" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg h-8 px-2 text-xs text-emerald-600"
                              onClick={() => toast.success(`Receipt for Installment #${inst.number} downloaded.`)}
                            >
                              <Download className="h-3.5 w-3.5 mr-1" /> Receipt
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="rounded-lg h-8 px-3 text-xs font-semibold"
                              onClick={() => {
                                setSelectedInstallment(inst);
                                setPayModalOpen(true);
                              }}
                            >
                              Pay Now
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: VISA & TRAVEL DETAILS */}
        <TabsContent value="visa" className="space-y-6 m-0">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Visa Application Card */}
            <Card className="rounded-2xl shadow-soft">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Study Permit / Visa Status</CardTitle>
                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                    APPROVED
                  </Badge>
                </div>
                <CardDescription>IRCC Canada Student Direct Stream (SDS)</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 text-sm">
                <div className="rounded-xl border p-4 space-y-2 bg-emerald-500/5 border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    Study Permit Port of Entry Letter (LOI) Received
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Present this official Letter of Introduction to Canadian Immigration Officer at Toronto Pearson Airport.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Application Reference:</span>
                    <span className="font-mono font-medium">S304928194</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Biometrics VFS Location:</span>
                    <span className="font-medium">VFS Global, BKC Mumbai (Done 12 Jun)</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Medical Examination Status:</span>
                    <span className="font-medium text-emerald-600">Passed / Clear</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GIC Bank Account (Scotiabank):</span>
                    <span className="font-mono font-medium">CAD $20,635 Deposited</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Details Card */}
            <Card className="rounded-2xl shadow-soft">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Travel & Flight Itinerary</CardTitle>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    Flight Confirmed
                  </Badge>
                </div>
                <CardDescription>Flight details and airport pickup arrangement</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 text-sm">
                <div className="rounded-xl border p-4 space-y-3 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-base">Air Canada · Flight AC-855</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      PNR: 7XK992
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Departure:</span>
                      <div className="font-medium text-foreground">Mumbai (BOM) · 28 Aug 23:45</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Arrival:</span>
                      <div className="font-medium text-foreground">Toronto (YYZ) · 29 Aug 07:15</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">University Airport Pickup:</span>
                    <span className="font-semibold text-emerald-600">Confirmed (Terminal 1 Pickup)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Student Housing Address:</span>
                    <span className="font-medium text-foreground">Chestnut Residence, 89 Chestnut St, Toronto</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    className="w-full rounded-xl text-xs font-semibold"
                    onClick={() => setTravelModalOpen(true)}
                  >
                    <Plane className="h-3.5 w-3.5 mr-1.5" /> Update Travel Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 5: DOCUMENTS VAULT */}
        <TabsContent value="documents" className="space-y-6 m-0">
          <Card className="rounded-2xl shadow-soft">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4">
              <div>
                <CardTitle className="text-base font-semibold">Document Vault & Verification</CardTitle>
                <CardDescription>
                  Upload academic transcripts, passport, visa files, and financial solvency documents.
                </CardDescription>
              </div>
              <Button
                className="rounded-xl shadow-soft text-xs sm:text-sm mt-2 sm:mt-0"
                onClick={() => setUploadModalOpen(true)}
              >
                <Upload className="h-4 w-4 mr-1.5" /> Upload New Document
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground border-b">
                    <tr>
                      <th className="px-5 py-3 text-left font-medium">Document Name</th>
                      <th className="px-5 py-3 text-left font-medium">Category</th>
                      <th className="px-5 py-3 text-left font-medium">Status</th>
                      <th className="px-5 py-3 text-right font-medium">Uploaded Date</th>
                      <th className="px-5 py-3 text-center font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-t border-border/60 hover:bg-muted/30">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 font-medium text-foreground">
                            <FileText className="h-4 w-4 text-primary shrink-0" />
                            {doc.name}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant="outline" className="rounded-md font-normal text-xs">
                            {doc.category}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            className={`rounded-md ${
                              doc.status === "Verified"
                                ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                                : "bg-amber-500/15 text-amber-600 border-amber-500/30"
                            }`}
                          >
                            {doc.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right text-xs text-muted-foreground">{doc.date}</td>
                        <td className="px-5 py-3.5 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-lg h-8 px-2 text-xs"
                            onClick={() => toast.info(`Viewing ${doc.name}`)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" /> View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: SUPPORT & TICKETS */}
        <TabsContent value="support" className="space-y-6 m-0">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Raise Ticket Card */}
            <Card className="rounded-2xl shadow-soft lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Student & Parent Support</CardTitle>
                <CardDescription>Need assistance with fees, dorms, or visa?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Our dedicated student support team and counsellor respond to all tickets within 4 business hours.
                </p>
                <Button
                  className="w-full rounded-xl font-semibold shadow-soft"
                  onClick={() => setTicketModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Raise Support Ticket
                </Button>
              </CardContent>
            </Card>

            {/* Support Ticket List */}
            <Card className="rounded-2xl shadow-soft lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Your Support Tickets</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {tickets.map((tk) => (
                    <div key={tk.id} className="p-4 space-y-2 hover:bg-muted/30">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-muted-foreground">{tk.id}</span>
                        <Badge
                          className={`rounded-md ${
                            tk.status === "Resolved"
                              ? "bg-emerald-500/15 text-emerald-600"
                              : "bg-amber-500/15 text-amber-600"
                          }`}
                        >
                          {tk.status}
                        </Badge>
                      </div>
                      <div className="font-semibold text-sm text-foreground">{tk.subject}</div>
                      <p className="text-xs text-muted-foreground">{tk.lastUpdate}</p>
                      <div className="text-[11px] text-muted-foreground text-right">{tk.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* DIALOG 1: Offer Letter Preview Modal */}
      <Dialog open={offerModalOpen} onOpenChange={setOfferModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>University Offer Letter Preview</DialogTitle>
            <DialogDescription>University of Toronto · Official Admission Offer</DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border p-5 bg-card space-y-4 text-xs sm:text-sm font-sans">
            <div className="text-center border-b pb-3">
              <div className="font-bold text-base text-foreground">UNIVERSITY OF TORONTO</div>
              <div className="text-xs text-muted-foreground">Office of Enrolment Services & Admissions</div>
            </div>

            <p>Dear <strong>Priya Sharma</strong>,</p>
            <p>
              We are pleased to inform you that you have been granted an <strong>Unconditional Admission Offer</strong> for the <strong>Master of Science in Computer Science (M.S. CS)</strong> program for the <strong>Fall 2026</strong> intake.
            </p>

            <div className="space-y-1 bg-muted/40 p-3 rounded-lg border text-xs">
              <div><strong>Program Start Date:</strong> September 08, 2026</div>
              <div><strong>Tuition Fee Deposit:</strong> CAD $5,000 (Received & Verified)</div>
              <div><strong>Faculty:</strong> Department of Computer Science, Faculty of Arts & Science</div>
            </div>

            <p className="text-xs text-muted-foreground">
              This letter serves as official proof of acceptance for Canadian Study Permit (Visa) filing.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setOfferModalOpen(false)}>
              Close Preview
            </Button>
            <Button
              className="rounded-xl font-semibold"
              onClick={() => {
                setOfferModalOpen(false);
                toast.success("Offer Letter PDF Downloaded!");
              }}
            >
              <Download className="h-4 w-4 mr-2" /> Download Official PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Pay Installment Modal */}
      <Dialog open={payModalOpen} onOpenChange={setPayModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Pay Fee Installment</DialogTitle>
            <DialogDescription>
              {selectedInstallment ? `${selectedInstallment.title} (${selectedInstallment.amount})` : "Pay Tuition Fee"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePayInstallment} className="space-y-4 py-2">
            <div className="rounded-xl bg-primary/10 p-3 text-xs flex justify-between items-center border border-primary/20">
              <span>Amount Payable:</span>
              <span className="font-bold text-primary text-base font-mono">
                {selectedInstallment?.amount || "CAD $12,500"}
              </span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Payment Method</Label>
              <Select defaultValue="upi">
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI / NetBanking (INR Direct Wire)</SelectItem>
                  <SelectItem value="flywire">Flywire International Wire (CAD)</SelectItem>
                  <SelectItem value="card">Credit / Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Payer Email (Receipt Copy)</Label>
              <Input value="priya.sharma@gmail.com" disabled className="rounded-xl text-xs bg-muted/40" />
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setPayModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl font-semibold">
                Confirm & Pay
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: Upload Document Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Attach academic, identity, or health proof documents.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadDocument} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Document Title *</Label>
              <Input
                placeholder="e.g. Medical_Fitness_Report"
                value={uploadData.name}
                onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                className="rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category</Label>
              <Select value={uploadData.category} onValueChange={(val) => setUploadData({ ...uploadData, category: val })}>
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic Transcripts</SelectItem>
                  <SelectItem value="Identity">Identity & Passport</SelectItem>
                  <SelectItem value="Financial">Financial Solvency</SelectItem>
                  <SelectItem value="Health & Visa">Health & Visa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl border-2 border-dashed p-6 text-center text-xs text-muted-foreground space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div>Drag & drop PDF / JPG or click to browse</div>
              <div className="text-[11px]">Max file size: 15MB</div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl font-semibold">
                Submit File
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 4: Support Ticket Modal */}
      <Dialog open={ticketModalOpen} onOpenChange={setTicketModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Raise Support Ticket</DialogTitle>
            <DialogDescription>Direct query to Senior Counsellor Meera Shah.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTicket} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category</Label>
              <Select value={ticketData.category} onValueChange={(val) => setTicketData({ ...ticketData, category: val })}>
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  <SelectItem value="Travel & Housing">Travel & Housing</SelectItem>
                  <SelectItem value="Fees & Receipts">Fees & Receipts</SelectItem>
                  <SelectItem value="Visa Query">Visa Query</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Subject *</Label>
              <Input
                placeholder="Brief summary of your question"
                value={ticketData.subject}
                onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                className="rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Description *</Label>
              <Textarea
                placeholder="Explain what you need assistance with..."
                value={ticketData.description}
                onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                className="rounded-xl text-xs resize-none"
                rows={4}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setTicketModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl font-semibold">
                Submit Ticket
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 5: Notifications Modal */}
      <Dialog open={notifModalOpen} onOpenChange={setNotifModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Notifications</DialogTitle>
            <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={markAllNotificationsRead}>
              Mark all read
            </Button>
          </DialogHeader>

          <div className="divide-y space-y-2 max-h-96 overflow-y-auto py-2">
            {notifications.map((n) => (
              <div key={n.id} className={`p-3 rounded-xl space-y-1 ${!n.read ? "bg-primary/5 border border-primary/20" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground">{n.title}</span>
                  <span className="text-[10px] text-muted-foreground">{n.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG 6: Profile & Parents Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Student & Parent Profile</DialogTitle>
            <DialogDescription>Personal & emergency contact information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="rounded-xl bg-muted/40 p-4 space-y-2 border">
              <div className="font-bold text-sm text-foreground">Priya Sharma (Student)</div>
              <div><strong>Email:</strong> priya.sharma@gmail.com</div>
              <div><strong>Phone:</strong> +91 98200 44556</div>
              <div><strong>Passport #:</strong> Z9401829 (Exp: 2032)</div>
            </div>

            <div className="rounded-xl bg-muted/40 p-4 space-y-2 border">
              <div className="font-bold text-sm text-foreground">Parent / Guardian Contact</div>
              <div><strong>Parent Name:</strong> Ramesh Sharma (Father)</div>
              <div><strong>Parent Phone:</strong> +91 98200 11999</div>
              <div><strong>Parent Email:</strong> ramesh.sharma@outlook.com</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
