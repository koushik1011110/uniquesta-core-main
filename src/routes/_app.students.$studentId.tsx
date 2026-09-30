import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  GraduationCap,
  Building2,
  UserCircle2,
  Globe2,
  CalendarDays,
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  Upload,
  Star,
  Trash2,
  Loader2,
  Edit3,
  ShieldCheck,
  Plus,
  Send,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/students/$studentId")({
  component: StudentDetailsPage,
});

const TIMELINE_STAGES = [
  { label: "Lead", defaultNote: "Enquiry from website or partner referral" },
  { label: "Counselling", defaultNote: "In-person or virtual counselling session" },
  { label: "Documents", defaultNote: "SOP, LOR, transcripts and financial docs" },
  { label: "University Applied", defaultNote: "Application submitted to universities" },
  { label: "Offer Letter", defaultNote: "Awaiting or received offer from university" },
  { label: "Fee Paid", defaultNote: "Tuition deposit payment completed" },
  { label: "Visa Applied", defaultNote: "Study permit / student visa submission" },
  { label: "Visa Approved", defaultNote: "Immigration decision confirmed" },
  { label: "Travel", defaultNote: "Flight booking and accommodation arranged" },
  { label: "Course Started", defaultNote: "Enrolment confirmed at destination university" },
];

function StudentDetailsPage() {
  const { studentId } = Route.useParams();
  const qc = useQueryClient();
  const currentUser = getUser();

  // Modals state
  const [editOpen, setEditOpen] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [followupOpen, setFollowupOpen] = useState(false);
  const [commOpen, setCommOpen] = useState(false);

  // Form states
  const [newNote, setNewNote] = useState("");
  const [editForm, setEditForm] = useState<any>({});
  const [taskForm, setTaskForm] = useState({
    title: "",
    due_date: "Tomorrow · 5:00 PM",
    owner: currentUser?.name || "Meera Shah",
    priority: "Medium",
  });
  const [docForm, setDocForm] = useState({
    name: "",
    size: "1.2 MB",
    status: "Verified",
  });
  const [followupForm, setFollowupForm] = useState({
    scheduled_at: "Tomorrow · 11:00 AM",
    channel: "Phone call",
    note: "",
  });
  const [commForm, setCommForm] = useState({
    channel: "Call",
    direction: "Outbound",
    subject: "",
  });

  // Queries
  const { data: studentRes, isLoading, isError } = useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      const res: any = await api.get(`/students/${studentId}`);
      return res.data ?? res;
    },
  });

  const { data: tasksRes = [] } = useQuery({
    queryKey: ["student", studentId, "tasks"],
    queryFn: async () => {
      const res: any = await api.get(`/students/${studentId}/tasks`);
      return res.data ?? res ?? [];
    },
  });

  const { data: docsRes = [] } = useQuery({
    queryKey: ["student", studentId, "documents"],
    queryFn: async () => {
      const res: any = await api.get(`/students/${studentId}/documents`);
      return res.data ?? res ?? [];
    },
  });

  const { data: notesRes = [] } = useQuery({
    queryKey: ["student", studentId, "notes"],
    queryFn: async () => {
      const res: any = await api.get(`/students/${studentId}/notes`);
      return res.data ?? res ?? [];
    },
  });

  const { data: followupsRes = [] } = useQuery({
    queryKey: ["student", studentId, "followups"],
    queryFn: async () => {
      const res: any = await api.get(`/students/${studentId}/followups`);
      return res.data ?? res ?? [];
    },
  });

  const { data: commsRes = [] } = useQuery({
    queryKey: ["student", studentId, "comms"],
    queryFn: async () => {
      const res: any = await api.get(`/students/${studentId}/comms`);
      return res.data ?? res ?? [];
    },
  });

  // Mutations
  const updateStudent = useMutation({
    mutationFn: async (payload: any) => api.put(`/students/${studentId}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student", studentId] });
      qc.invalidateQueries({ queryKey: ["students"] });
      setEditOpen(false);
      setStageOpen(false);
      toast.success("Student details updated successfully");
    },
    onError: (err: any) => toast.error(err.message || "Failed to update"),
  });

  const deleteStudent = useMutation({
    mutationFn: async () => api.del(`/students/${studentId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted");
      window.location.href = "/students";
    },
    onError: (e: any) => toast.error(e.message || "Delete failed"),
  });

  const addTask = useMutation({
    mutationFn: async () => api.post(`/students/${studentId}/tasks`, taskForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student", studentId, "tasks"] });
      setTaskOpen(false);
      setTaskForm({ title: "", due_date: "Tomorrow · 5:00 PM", owner: currentUser?.name || "Meera Shah", priority: "Medium" });
      toast.success("Task added");
    },
    onError: (e: any) => toast.error(e.message || "Failed to add task"),
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) =>
      api.put(`/students/${studentId}/tasks/${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student", studentId, "tasks"] });
      toast.success("Task status updated");
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: number) => api.del(`/students/${studentId}/tasks/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student", studentId, "tasks"] });
      toast.success("Task deleted");
    },
  });

  const addDoc = useMutation({
    mutationFn: async () => api.post(`/students/${studentId}/documents`, docForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student", studentId, "documents"] });
      setDocOpen(false);
      setDocForm({ name: "", size: "1.2 MB", status: "Verified" });
      toast.success("Document added");
    },
    onError: (e: any) => toast.error(e.message || "Failed to add document"),
  });

  const deleteDoc = useMutation({
    mutationFn: async (id: number) => api.del(`/students/${studentId}/documents/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student", studentId, "documents"] });
      toast.success("Document deleted");
    },
  });

  const addNote = useMutation({
    mutationFn: async () =>
      api.post(`/students/${studentId}/notes`, {
        author: currentUser?.name || "Meera Shah",
        content: newNote.trim(),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student", studentId, "notes"] });
      setNewNote("");
      toast.success("Note posted");
    },
    onError: (e: any) => toast.error(e.message || "Failed to post note"),
  });

  const deleteNote = useMutation({
    mutationFn: async (id: number) => api.del(`/students/${studentId}/notes/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student", studentId, "notes"] });
      toast.success("Note deleted");
    },
  });

  const addFollowup = useMutation({
    mutationFn: async () => api.post(`/students/${studentId}/followups`, followupForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student", studentId, "followups"] });
      setFollowupOpen(false);
      setFollowupForm({ scheduled_at: "Tomorrow · 11:00 AM", channel: "Phone call", note: "" });
      toast.success("Follow-up scheduled");
    },
    onError: (e: any) => toast.error(e.message || "Failed to schedule"),
  });

  const deleteFollowup = useMutation({
    mutationFn: async (id: number) => api.del(`/students/${studentId}/followups/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student", studentId, "followups"] });
      toast.success("Follow-up deleted");
    },
  });

  const addComm = useMutation({
    mutationFn: async () => api.post(`/students/${studentId}/comms`, commForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student", studentId, "comms"] });
      setCommOpen(false);
      setCommForm({ channel: "Call", direction: "Outbound", subject: "" });
      toast.success("Communication logged");
    },
    onError: (e: any) => toast.error(e.message || "Failed to log"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading student…
      </div>
    );
  }

  const raw: any = (studentRes as any)?.data ?? studentRes;

  if (isError || !raw) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm font-medium">Student not found</p>
        <p className="mt-1 text-xs text-muted-foreground">The ID “{studentId}” does not exist in the database.</p>
        <Button asChild className="mt-4 rounded-xl">
          <Link to="/students">Back to Student Data</Link>
        </Button>
      </div>
    );
  }

  const stageIdx = Math.min(
    Math.max(0, Number(raw.stage_index ?? raw.stageIndex ?? 0) || 0),
    TIMELINE_STAGES.length - 1
  );

  const student = {
    id: raw.code ?? raw.id,
    numericId: raw.id,
    name: raw.name || "Student",
    email: raw.email || "—",
    phone: raw.phone || "—",
    dob: raw.dob || "—",
    passport: raw.passport || "—",
    country: raw.country || "—",
    course: raw.course || "—",
    university: raw.university || "—",
    intake: raw.intake || "—",
    counselor: { name: raw.counselor ?? raw.counselor_name ?? "Meera Shah", role: "Senior Counsellor" },
    branch: raw.branch || "Mumbai",
    leadScore: raw.lead_score ?? raw.leadScore ?? 75,
    stage: raw.stage ?? TIMELINE_STAGES[stageIdx].label,
    stageIndex: stageIdx,
    status: raw.status ?? "Active",
    createdAt: raw.created_at ? new Date(raw.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Recently",
  };

  const initials = (student.name || "ST")
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ST";

  const openEditModal = () => {
    setEditForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      dob: student.dob === "—" ? "" : student.dob,
      passport: student.passport === "—" ? "" : student.passport,
      country: student.country,
      university: student.university,
      course: student.course,
      intake: student.intake,
      counselor: student.counselor.name,
      branch: student.branch,
      lead_score: student.leadScore,
      status: student.status,
    });
    setEditOpen(true);
  };

  const handleStageSelect = (index: number) => {
    const st = TIMELINE_STAGES[index];
    updateStudent.mutate({ stage: st.label, stage_index: index });
  };

  const tasks: any[] = Array.isArray(tasksRes) ? tasksRes : (tasksRes as any)?.data ?? [];
  const documents: any[] = Array.isArray(docsRes) ? docsRes : (docsRes as any)?.data ?? [];
  const notes: any[] = Array.isArray(notesRes) ? notesRes : (notesRes as any)?.data ?? [];
  const followUps: any[] = Array.isArray(followupsRes) ? followupsRes : (followupsRes as any)?.data ?? [];
  const comms: any[] = Array.isArray(commsRes) ? commsRes : (commsRes as any)?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-sm">
        <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl" asChild>
          <Link to="/students">
            <ArrowLeft className="h-4 w-4" /> Back to Student Data
          </Link>
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium text-foreground">{student.name}</span>
        <span className="text-muted-foreground">({student.id})</span>
      </div>

      <PageHeader
        title={student.name}
        description={`${student.id} · ${student.country} → ${student.university} · ${student.intake} (${student.branch} Branch)`}
        actions={
          <>
            <Badge className="gap-1 rounded-full bg-primary/10 text-primary hover:bg-primary/10">
              <ShieldCheck className="h-3.5 w-3.5" /> {student.status}
            </Badge>
            <Badge variant="secondary" className="gap-1 rounded-full bg-amber-100 text-amber-700">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Lead score {student.leadScore}
            </Badge>
            <Button variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={openEditModal}>
              <Edit3 className="h-4 w-4" /> Edit Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 rounded-xl text-destructive hover:text-destructive"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${student.name}?`)) {
                  deleteStudent.mutate();
                }
              }}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        {/* Left Column — Identity + Quick Actions */}
        <div className="flex flex-col gap-4">
          <Card className="rounded-2xl shadow-soft">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                    <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(student.name)}`} alt={student.name} />
                    <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 right-0 grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-emerald-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{student.name}</h3>
                <p className="text-xs text-muted-foreground">{student.id} · {student.branch}</p>
                
                {/* Live Quick Action Buttons */}
                <div className="mt-4 flex w-full gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5" asChild>
                    <a href={student.phone ? `tel:${student.phone}` : "#"}>
                      <Phone className="h-3.5 w-3.5" /> Call
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5" asChild>
                    <a href={student.email ? `mailto:${student.email}` : "#"}>
                      <Mail className="h-3.5 w-3.5" /> Email
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5" asChild>
                    <a
                      href={student.phone ? `https://wa.me/${student.phone.replace(/[^0-9]/g, "")}` : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> Chat
                    </a>
                  </Button>
                </div>
              </div>

              <Separator className="my-5" />

              <dl className="space-y-3.5 text-sm">
                <div className="flex items-center gap-3">
                  <Globe2 className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Country</p>
                    <p className="font-medium">{student.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Course</p>
                    <p className="font-medium">{student.course}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">University</p>
                    <p className="font-medium">{student.university}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Intake</p>
                    <p className="font-medium">{student.intake}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Counsellor</p>
                    <p className="font-medium">{student.counselor.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Branch</p>
                    <p className="font-medium">{student.branch}</p>
                  </div>
                </div>
              </dl>

              <Separator className="my-5" />

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-foreground">{student.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium text-foreground">{student.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">DOB</span>
                  <span className="font-medium text-foreground">{student.dob}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Passport</span>
                  <span className="font-medium text-foreground">{student.passport}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Enquiry Date</span>
                  <span className="font-medium text-foreground">{student.createdAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Section */}
          <Card className="rounded-2xl shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Documents ({documents.length})</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setDocOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-1.5 pt-2">
              {documents.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">No documents uploaded yet.</p>
              ) : (
                documents.map((d: any) => (
                  <div key={d.id} className="group flex items-center gap-3 rounded-xl border p-2.5 hover:bg-muted/30">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-foreground">{d.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {d.size || "1.0 MB"} · {d.status || "Verified"}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 rounded-md text-[11px]">
                      {d.status || "Verified"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteDoc.mutate(d.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
              <Button variant="outline" size="sm" className="mt-2 w-full gap-1.5 rounded-xl" onClick={() => setDocOpen(true)}>
                <Upload className="h-4 w-4" /> Upload document
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column — Admission Journey & Interactive Tabs */}
        <div className="flex flex-col gap-4">
          {/* Admission Journey (Stage Progress & Clickable Step Select) */}
          <Card className="rounded-2xl shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">Admission Journey</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Currently at <span className="font-semibold text-primary">{TIMELINE_STAGES[student.stageIndex]?.label}</span> · Step {student.stageIndex + 1} of {TIMELINE_STAGES.length}
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={() => setStageOpen(true)}>
                <Edit3 className="h-3.5 w-3.5" /> Update stage
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Progress bar */}
              <div className="mb-6 flex items-center gap-1">
                {TIMELINE_STAGES.map((t, i) => (
                  <button
                    key={t.label}
                    title={`Click to set stage to ${t.label}`}
                    onClick={() => handleStageSelect(i)}
                    className={`h-2 flex-1 rounded-full transition-all hover:scale-y-125 ${
                      i < student.stageIndex
                        ? "bg-primary"
                        : i === student.stageIndex
                        ? "bg-primary/80 ring-2 ring-primary/30"
                        : "bg-muted hover:bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              {/* Steps timeline list */}
              <ol className="relative space-y-4 border-l border-dashed border-border pl-6">
                {TIMELINE_STAGES.map((t, i) => {
                  const done = i < student.stageIndex;
                  const cur = i === student.stageIndex;
                  return (
                    <li key={t.label} className="relative cursor-pointer group" onClick={() => handleStageSelect(i)}>
                      <span
                        className={`absolute -left-[33px] grid h-7 w-7 place-items-center rounded-full border-2 border-background ring-1 transition-transform group-hover:scale-110 ${
                          done
                            ? "bg-primary text-primary-foreground ring-primary/30"
                            : cur
                            ? "bg-primary/10 text-primary ring-primary/40 font-bold"
                            : "bg-muted text-muted-foreground ring-border"
                        }`}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : cur ? <Clock className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                      </span>
                      <div
                        className={`rounded-xl border p-3 transition-all ${
                          cur
                            ? "border-primary/40 bg-primary/5 shadow-sm"
                            : "border-border bg-background group-hover:border-primary/20 group-hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-semibold ${cur ? "text-primary" : "text-foreground"}`}>
                            {t.label} {cur && <span className="ml-2 text-xs font-normal text-primary">● Active</span>}
                          </p>
                          <span className="text-xs font-medium text-muted-foreground">
                            {done ? "Completed" : cur ? "In Progress" : "Upcoming"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{t.defaultNote}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>

          {/* Interactive Tabs: Tasks, Follow-ups, Notes */}
          <Card className="rounded-2xl shadow-soft">
            <Tabs defaultValue="tasks" className="w-full">
              <CardHeader className="pb-2">
                <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted/60">
                  <TabsTrigger value="tasks" className="rounded-lg text-xs">
                    Tasks ({tasks.length})
                  </TabsTrigger>
                  <TabsTrigger value="followups" className="rounded-lg text-xs">
                    Follow-ups ({followUps.length})
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="rounded-lg text-xs">
                    Notes ({notes.length})
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-2">
                {/* Tasks Content */}
                <TabsContent value="tasks" className="mt-0 space-y-2">
                  {tasks.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">No tasks added yet. Click "Add task" below.</p>
                  ) : (
                    tasks.map((t: any) => {
                      const isDone = t.status === "Done" || t.status === "Completed";
                      return (
                        <div key={t.id} className="group flex items-center justify-between rounded-xl border p-3 hover:bg-muted/30">
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => toggleTask.mutate({ id: t.id, status: isDone ? "Open" : "Done" })}
                              className={`mt-0.5 grid h-5 w-5 place-items-center rounded-md border transition-all ${
                                isDone ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"
                              }`}
                            >
                              {isDone && <Check className="h-3.5 w-3.5" />}
                            </button>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-medium ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                {t.title}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {t.due_date || t.due || "No date"} · {t.owner || "Meera Shah"} ·{" "}
                                <span
                                  className={`font-semibold ${
                                    t.priority === "High"
                                      ? "text-red-500"
                                      : t.priority === "Medium"
                                      ? "text-amber-600"
                                      : "text-emerald-600"
                                  }`}
                                >
                                  {t.priority || "Medium"} Priority
                                </span>
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteTask.mutate(t.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                  <Button variant="outline" size="sm" className="w-full gap-1.5 rounded-xl" onClick={() => setTaskOpen(true)}>
                    <Plus className="h-3.5 w-3.5" /> Add task
                  </Button>
                </TabsContent>

                {/* Follow-ups Content */}
                <TabsContent value="followups" className="mt-0 space-y-2">
                  {followUps.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">No follow-ups scheduled yet.</p>
                  ) : (
                    followUps.map((f: any) => (
                      <div key={f.id} className="group flex items-start justify-between rounded-xl border p-3 hover:bg-muted/30">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-foreground">{f.scheduled_at || f.when || "Upcoming"}</p>
                            <Badge variant="outline" className="rounded-md text-[10px]">
                              {f.channel || "Call"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{f.note || "Follow-up discussion"}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteFollowup.mutate(f.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                  <Button variant="outline" size="sm" className="w-full gap-1.5 rounded-xl" onClick={() => setFollowupOpen(true)}>
                    <Plus className="h-3.5 w-3.5" /> Schedule follow-up
                  </Button>
                </TabsContent>

                {/* Notes Content */}
                <TabsContent value="notes" className="mt-0 space-y-3">
                  <div className="rounded-xl border p-3">
                    <Textarea
                      placeholder="Add an internal counsellor note for this student…"
                      className="min-h-[72px] resize-none border-0 p-0 text-sm shadow-none focus-visible:ring-0"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <div className="mt-2 flex items-center justify-between border-t pt-2">
                      <span className="text-[11px] text-muted-foreground">Posting as {currentUser?.name || "Counsellor"}</span>
                      <Button
                        size="sm"
                        className="h-7 gap-1 rounded-lg text-xs"
                        disabled={!newNote.trim() || addNote.isPending}
                        onClick={() => addNote.mutate()}
                      >
                        {addNote.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />} Post note
                      </Button>
                    </div>
                  </div>

                  {notes.length === 0 ? (
                    <p className="py-4 text-center text-xs text-muted-foreground">No notes recorded yet.</p>
                  ) : (
                    notes.map((n: any) => (
                      <div key={n.id} className="group relative rounded-xl bg-muted/40 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-foreground">{n.author || n.by || "Staff"}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] text-muted-foreground">
                              {n.created_at ? new Date(n.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : n.when || "Just now"}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                              onClick={() => deleteNote.mutate(n.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{n.content || n.text}</p>
                      </div>
                    ))
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Communication History */}
          <Card className="rounded-2xl shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Communication History ({comms.length})</CardTitle>
              <Button variant="outline" size="sm" className="h-7 gap-1 rounded-lg text-xs" onClick={() => setCommOpen(true)}>
                <Plus className="h-3 w-3" /> Log Activity
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              {comms.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">No communication logged yet.</p>
              ) : (
                comms.map((c: any) => {
                  const Icon = c.channel === "Email" ? Mail : c.channel === "WhatsApp" ? MessageSquare : Phone;
                  return (
                    <div key={c.id} className="flex items-start gap-3 rounded-xl border p-3 hover:bg-muted/30">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-foreground">{c.subject}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {c.channel} · {c.direction || "Outbound"} ·{" "}
                          {c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1.5 rounded-xl"
                  onClick={() => {
                    setCommForm({ channel: "Call", direction: "Outbound", subject: `Phone discussion with ${student.name}` });
                    setCommOpen(true);
                  }}
                >
                  <Phone className="h-3.5 w-3.5" /> Log call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1.5 rounded-xl"
                  onClick={() => {
                    setCommForm({ channel: "Email", direction: "Outbound", subject: `Sent documents / enquiry checklist to ${student.email}` });
                    setCommOpen(true);
                  }}
                >
                  <Mail className="h-3.5 w-3.5" /> Log email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================= MODALS & DIALOGS ================= */}

      {/* 1. Edit Student Profile Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs">Full Name *</Label>
                <Input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Email *</Label>
                <Input value={editForm.email || ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs">Phone *</Label>
                <Input value={editForm.phone || ""} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Passport No.</Label>
                <Input value={editForm.passport || ""} onChange={(e) => setEditForm({ ...editForm, passport: e.target.value })} placeholder="e.g. N7823910" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs">Date of Birth</Label>
                <Input value={editForm.dob || ""} onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })} placeholder="e.g. 14 Aug 2003" />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Branch</Label>
                <Select value={editForm.branch || "Mumbai"} onValueChange={(v) => setEditForm({ ...editForm, branch: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                    <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                    <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Kochi">Kochi</SelectItem>
                    <SelectItem value="Guwahati HQ">Guwahati HQ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs">Country Destination</Label>
                <Select value={editForm.country || "Canada"} onValueChange={(v) => setEditForm({ ...editForm, country: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Ireland">Ireland</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Intake</Label>
                <Input value={editForm.intake || ""} onChange={(e) => setEditForm({ ...editForm, intake: e.target.value })} placeholder="e.g. Fall 2026" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs">Target University</Label>
                <Input value={editForm.university || ""} onChange={(e) => setEditForm({ ...editForm, university: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Target Course</Label>
                <Input value={editForm.course || ""} onChange={(e) => setEditForm({ ...editForm, course: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs">Counsellor</Label>
                <Input value={editForm.counselor || ""} onChange={(e) => setEditForm({ ...editForm, counselor: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Lead Score (0-100)</Label>
                <Input type="number" value={editForm.lead_score ?? 70} onChange={(e) => setEditForm({ ...editForm, lead_score: Number(e.target.value) })} />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Status</Label>
                <Select value={editForm.status || "Active"} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Deferred">Deferred</SelectItem>
                    <SelectItem value="Enrolled">Enrolled</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={() => updateStudent.mutate(editForm)} disabled={updateStudent.isPending}>
              {updateStudent.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Update Stage Modal */}
      <Dialog open={stageOpen} onOpenChange={setStageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Admission Stage</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">Select the current progress stage for this student:</p>
          <div className="grid gap-2 max-h-[60vh] overflow-y-auto py-2">
            {TIMELINE_STAGES.map((s, idx) => (
              <button
                key={s.label}
                type="button"
                onClick={() => handleStageSelect(idx)}
                className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                  idx === student.stageIndex
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div>
                  <div className="text-sm font-medium">{idx + 1}. {s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.defaultNote}</div>
                </div>
                {idx === student.stageIndex && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStageOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Add Task Modal */}
      <Dialog open={taskOpen} onOpenChange={setTaskOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Task for {student.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <Label className="text-xs">Task Title *</Label>
              <Input
                placeholder="e.g. Collect updated bank statements"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs">Due Date</Label>
                <Input
                  placeholder="Tomorrow · 4:00 PM"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Priority</Label>
                <Select value={taskForm.priority} onValueChange={(v) => setTaskForm({ ...taskForm, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">Assigned Owner</Label>
              <Input
                value={taskForm.owner}
                onChange={(e) => setTaskForm({ ...taskForm, owner: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskOpen(false)}>Cancel</Button>
            <Button onClick={() => addTask.mutate()} disabled={!taskForm.title.trim() || addTask.isPending}>
              {addTask.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Upload Document Modal */}
      <Dialog open={docOpen} onOpenChange={setDocOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {/* File picker */}
            <div className="grid gap-1">
              <Label className="text-xs">Select File</Label>
              <Input
                type="file"
                className="cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
                    setDocForm({
                      ...docForm,
                      name: file.name,
                      size: `${sizeMB} MB`,
                    });
                  }
                }}
              />
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">Document Name *</Label>
              <Input
                placeholder="e.g. Passport_Copy.pdf"
                value={docForm.name}
                onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs">File Size</Label>
                <Input
                  value={docForm.size}
                  onChange={(e) => setDocForm({ ...docForm, size: e.target.value })}
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Verification Status</Label>
                <Select value={docForm.status} onValueChange={(v) => setDocForm({ ...docForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocOpen(false)}>Cancel</Button>
            <Button onClick={() => addDoc.mutate()} disabled={!docForm.name.trim() || addDoc.isPending}>
              {addDoc.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Save Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Schedule Follow-up Modal */}
      <Dialog open={followupOpen} onOpenChange={setFollowupOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Follow-up</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs">Scheduled Time</Label>
                <Input
                  placeholder="Tomorrow · 3:00 PM"
                  value={followupForm.scheduled_at}
                  onChange={(e) => setFollowupForm({ ...followupForm, scheduled_at: e.target.value })}
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Channel</Label>
                <Select value={followupForm.channel} onValueChange={(v) => setFollowupForm({ ...followupForm, channel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phone call">Phone call</SelectItem>
                    <SelectItem value="In-person">In-person</SelectItem>
                    <SelectItem value="Video call">Video call</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">Follow-up Note / Objective *</Label>
              <Textarea
                placeholder="Discuss financial documents and bank statement updates..."
                value={followupForm.note}
                onChange={(e) => setFollowupForm({ ...followupForm, note: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowupOpen(false)}>Cancel</Button>
            <Button onClick={() => addFollowup.mutate()} disabled={!followupForm.note.trim() || addFollowup.isPending}>
              {addFollowup.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Log Communication Modal */}
      <Dialog open={commOpen} onOpenChange={setCommOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Communication Activity</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label className="text-xs">Channel</Label>
                <Select value={commForm.channel} onValueChange={(v) => setCommForm({ ...commForm, channel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Call">Phone Call</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Direction</Label>
                <Select value={commForm.direction} onValueChange={(v) => setCommForm({ ...commForm, direction: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Outbound">Outbound</SelectItem>
                    <SelectItem value="Inbound">Inbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">Subject / Activity Summary *</Label>
              <Input
                placeholder="e.g. Discussed SOP revisions and university selection"
                value={commForm.subject}
                onChange={(e) => setCommForm({ ...commForm, subject: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommOpen(false)}>Cancel</Button>
            <Button onClick={() => addComm.mutate()} disabled={!commForm.subject.trim() || addComm.isPending}>
              {addComm.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Log Communication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
