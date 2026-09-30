import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Filter, Flame, Loader2, GripVertical, CheckCircle2, ArrowRight, GraduationCap, Sparkles, HelpCircle, Info, ChevronRight, ExternalLink, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/leads")({
  head: () => ({
    meta: [
      { title: "Lead Management · Uniquesta" },
      { name: "description", content: "Kanban lead pipeline with automated lead-to-student admission conversion." },
      { property: "og:title", content: "Lead Management · Uniquesta" },
      { property: "og:description", content: "Track every enquiry from first touch to student admission conversion." },
    ],
  }),
  component: LeadsPage,
});

const colMeta: Record<string, { color: string; badgeBg: string; borderActive: string; desc: string }> = {
  "New Enquiry": { color: "bg-blue-500", badgeBg: "bg-blue-50 text-blue-700 border-blue-200", borderActive: "border-blue-400 bg-blue-50/40", desc: "Raw marketing inquiries" },
  "Contacted": { color: "bg-amber-500", badgeBg: "bg-amber-50 text-amber-700 border-amber-200", borderActive: "border-amber-400 bg-amber-50/40", desc: "First counsellor call done" },
  "Qualified": { color: "bg-[#E52E20]", badgeBg: "bg-red-50 text-[#E52E20] border-red-200", borderActive: "border-[#E52E20] bg-red-50/40", desc: "Eligible & converts to Student" },
  "Counselling Booked": { color: "bg-emerald-500", badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200", borderActive: "border-emerald-400 bg-emerald-50/40", desc: "Session scheduled / Onboarding" },
};
const columnsOrder = ["New Enquiry", "Contacted", "Qualified", "Counselling Booked"];

function LeadsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [showFunnelGuide, setShowFunnelGuide] = useState(true);
  const [form, setForm] = useState({ name:"", source:"Website Form", score:75, city:"Guwahati", status:"New Enquiry", email:"", phone:"" });

  // Conversion Dialog State
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [convertForm, setConvertForm] = useState({
    country: "United Kingdom",
    course: "MSc International Business",
    university: "University of Manchester",
    intake: "Fall 2026",
  });

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<any>(null);

  // Drag and Drop State
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const res = await api.get<any[]>("/leads", { limit: 100 });
      return (res as any).data ?? (res as any) ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => api.post("/leads", form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      setOpen(false);
      toast.success("Lead created successfully");
      setForm({ name:"", source:"Website Form", score:75, city:"Guwahati", status:"New Enquiry", email:"", phone:"" });
    },
    onError: (e:any)=> toast.error(e.message),
  });

  const moveLeadMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return api.put(`/leads/${id}`, { status });
    },
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["leads"] });
      const previousLeads = qc.getQueryData(["leads"]);

      qc.setQueryData(["leads"], (old: any) => {
        const list = Array.isArray(old) ? old : (old as any)?.data ?? [];
        const updated = list.map((lead: any) => (lead.id === id ? { ...lead, status } : lead));
        return Array.isArray(old) ? updated : { ...old, data: updated };
      });

      return { previousLeads };
    },
    onError: (err: any, _vars, context) => {
      if (context?.previousLeads) {
        qc.setQueryData(["leads"], context.previousLeads);
      }
      toast.error(err?.message || "Failed to update lead stage");
    },
    onSuccess: (_data, vars) => {
      toast.success(`Lead moved to "${vars.status}"`);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const convertLeadMutation = useMutation({
    mutationFn: async ({ id, details }: { id: number; details?: any }) => {
      return api.post<any>(`/leads/${id}/convert`, details || {});
    },
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["students"] });
      setConvertModalOpen(false);
      const studentCode = res?.student?.code || "UQ";
      toast.success(`Converted! Student profile created: ${studentCode}`, {
        description: "Registered in Student Admissions. Click to view student profile.",
      });
    },
    onError: (e: any) => {
      toast.error(e.message || "Failed to convert lead to student");
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.del(`/leads/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
      toast.success("Lead deleted successfully");
    },
    onError: (e: any) => {
      toast.error(e.message || "Failed to delete lead");
    },
  });

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData("text/plain", String(id));
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverCol(null);
  };

  const handleDragOver = (e: React.DragEvent, colName: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCol !== colName) {
      setDragOverCol(colName);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, targetCol: string) => {
    e.preventDefault();
    setDragOverCol(null);
    setDraggingId(null);

    const leadIdStr = e.dataTransfer.getData("text/plain");
    const leadId = Number(leadIdStr);
    if (!leadId) return;

    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead) return;

    if (currentLead.status === targetCol && (targetCol !== "Qualified" || currentLead.student_code)) return;

    // When dropped into "Qualified" or "Counselling Booked", auto-convert to Student if not yet converted!
    if ((targetCol === "Qualified" || targetCol === "Counselling Booked") && !currentLead.student_code) {
      convertLeadMutation.mutate({ id: leadId });
    } else {
      moveLeadMutation.mutate({ id: leadId, status: targetCol });
    }
  };

  const openConvertModal = (lead: any) => {
    setSelectedLead(lead);
    setConvertForm({
      country: "United Kingdom",
      course: "MSc Data Science",
      university: "University of Manchester",
      intake: "Fall 2026",
    });
    setConvertModalOpen(true);
  };

  const leads: any[] = Array.isArray(data) ? data : (data as any)?.data ?? [];

  // group by status
  const grouped: Record<string, any[]> = {};
  for (const c of columnsOrder) grouped[c] = [];
  for (const l of leads) {
    const key = l.status ?? "New Enquiry";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(l);
  }

  const hasData = leads.length > 0;
  const convertedCount = leads.filter(l => Boolean(l.student_code)).length;

  return (
    <>
      <PageHeader
        title="Lead Management & Student Conversion"
        description={hasData ? `${leads.length} total leads · ${convertedCount} converted to Student Admissions · Drag cards across stages` : "Active study abroad pipeline with automated student admission conversion"}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFunnelGuide(!showFunnelGuide)}
              className="rounded-lg gap-1.5 text-xs text-slate-700"
            >
              <Info className="h-3.5 w-3.5 text-[#E52E20]" />
              {showFunnelGuide ? "Hide Funnel Guide" : "CRM Funnel Guide"}
            </Button>
            <Button
              className="rounded-lg gap-2 bg-[#E52E20] hover:bg-[#C82114] text-white"
              onClick={() => setOpen(true)}
            >
              <Plus className="h-4 w-4" /> New Lead
            </Button>
          </div>
        }
      />

      {/* ─── Abroad CRM Funnel Explanation Card ─── */}
      {showFunnelGuide && (
        <div className="mb-4 rounded-2xl border border-red-200/80 bg-gradient-to-r from-red-50/80 via-white to-amber-50/40 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-red-100">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#E52E20] text-white grid place-items-center text-xs font-bold shadow-xs">
                UQ
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  Study Abroad CRM Funnel: <span className="text-[#E52E20]">Leads vs. Student Admissions</span>
                </h4>
                <p className="text-xs text-slate-600">
                  Abroad education consultancies follow a 4-step pipeline to filter inquiries into verified student admissions.
                </p>
              </div>
            </div>
            <Badge className="bg-red-100 text-[#E52E20] border-red-200 hover:bg-red-100 text-[11px] font-semibold">
              Industry Standard Logic
            </Badge>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-2.5">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                <span className="h-4 w-4 rounded-full bg-blue-600 text-white grid place-items-center text-[10px]">1</span>
                <span>New Enquiry (Lead)</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Raw inquiry from Website, Meta Ads, or Fairs. Not yet an admitted student.
              </p>
            </div>

            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-2.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                <span className="h-4 w-4 rounded-full bg-amber-600 text-white grid place-items-center text-[10px]">2</span>
                <span>Contacted (Follow-up)</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Counsellor calls the student, reviews academic scores & IELTS eligibility.
              </p>
            </div>

            <div className="rounded-xl border border-red-300 bg-red-50/80 p-2.5 shadow-xs ring-1 ring-[#E52E20]/20">
              <div className="flex items-center gap-1.5 font-bold text-[#E52E20] mb-1">
                <span className="h-4 w-4 rounded-full bg-[#E52E20] text-white grid place-items-center text-[10px]">3</span>
                <span>Qualified (Ready)</span>
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed font-medium">
                Student has budget & documents. Dragging here <strong>creates a real Student Admission profile!</strong>
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-2.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                <span className="h-4 w-4 rounded-full bg-emerald-600 text-white grid place-items-center text-[10px]">4</span>
                <span>Student Admissions</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Formal applicant with <code className="text-emerald-700 font-bold">UQ-XXXXX</code> code. Visa, offers & payments begin here!
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-red-100/80">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-[#E52E20]" />
              <strong>Mouse Drag Rule:</strong> Drag any lead card into <strong>"Qualified"</strong> to automatically convert and register them in Student Admissions.
            </span>
            <Link to="/students" className="text-[#E52E20] font-bold hover:underline flex items-center gap-0.5">
              View Student Admissions List <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-10">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading leads…
        </div>
      ) : (
        <div className="grid grid-flow-col auto-cols-[minmax(310px,1fr)] gap-4 overflow-x-auto pb-4">
          {columnsOrder.map((colName) => {
            const colLeads = grouped[colName] ?? [];
            const meta = colMeta[colName] ?? { color:"bg-primary", badgeBg: "bg-slate-100 text-slate-800", borderActive: "border-slate-400 bg-slate-50", desc: "" };
            const isTarget = dragOverCol === colName;

            return (
              <div
                key={colName}
                onDragOver={(e) => handleDragOver(e, colName)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, colName)}
                className={`min-w-0 flex flex-col rounded-2xl p-2.5 transition-all duration-200 ${
                  isTarget
                    ? `border-2 border-dashed ${meta.borderActive} shadow-md scale-[1.01]`
                    : "border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50/90"
                }`}
              >
                {/* Column Header */}
                <div className="mb-2 flex items-center gap-2 px-1 pt-1">
                  <span className={`h-3 w-3 rounded-full ${meta.color} shadow-sm`}/>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-none">{colName}</h3>
                    <span className="text-[10px] text-slate-500">{meta.desc}</span>
                  </div>
                  <Badge variant="outline" className={`ml-auto rounded-md font-semibold text-xs border ${meta.badgeBg}`}>
                    {colLeads.length}
                  </Badge>
                </div>

                {/* Drop indicator prompt when hovered */}
                {isTarget && (
                  <div className="mb-2 rounded-xl border border-dashed border-[#E52E20] bg-white p-2.5 text-center text-xs font-bold text-[#E52E20] animate-pulse shadow-sm">
                    {colName === "Qualified" ? "Drop here to Qualify & Create Student Profile" : `Drop here to move to "${colName}"`}
                  </div>
                )}

                {/* Leads List */}
                <div className="space-y-3 flex-1 min-h-[220px]">
                  {colLeads.map((l: any) => {
                    const isBeingDragged = draggingId === l.id;
                    const isConverted = Boolean(l.student_code);

                    return (
                      <Card
                        key={l.id ?? l.name}
                        draggable
                        onDragStart={(e) => handleDragStart(e, l.id)}
                        onDragEnd={handleDragEnd}
                        className={`group relative rounded-xl border bg-white shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing hover:border-slate-400 hover:shadow-md select-none ${
                          isBeingDragged ? "opacity-35 scale-95 border-dashed border-[#E52E20] bg-red-50/30 ring-2 ring-[#E52E20]" : "border-slate-200/90"
                        }`}
                      >
                        <CardHeader className="p-3.5 pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <GripVertical className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-slate-500 transition cursor-grab active:cursor-grabbing" />
                              <CardTitle className="text-sm font-bold text-slate-900 truncate">
                                {l.name}
                              </CardTitle>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {l.score >= 80 && (
                                <span className="flex items-center gap-0.5 text-xs font-semibold text-[#E52E20]" title="High conversion priority">
                                  <Flame className="h-3.5 w-3.5 fill-[#E52E20] text-[#E52E20]"/>
                                  {l.score}
                                </span>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLeadToDelete(l);
                                  setDeleteDialogOpen(true);
                                }}
                                className="h-6 w-6 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                                title="Delete lead"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-2.5 p-3.5 pt-0 text-xs text-slate-500">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-slate-700">{l.source}</span>
                            <span className="text-slate-500">{l.city}</span>
                          </div>

                          {/* Student Conversion Indicator */}
                          {isConverted ? (
                            <div className="rounded-lg bg-emerald-50 border border-emerald-200/80 p-2 flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                                <GraduationCap className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span>{l.student_code}</span>
                              </div>
                              <Link
                                to="/students/$studentId"
                                params={{ studentId: l.student_code }}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                              >
                                <span>Profile</span>
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          ) : (
                            <div className="pt-1 flex items-center justify-between gap-1 border-t border-slate-100">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openConvertModal(l);
                                }}
                                className="h-6 text-[11px] font-semibold border-red-200 text-[#E52E20] hover:bg-red-50 hover:text-[#C82114] px-2 rounded-md gap-1 shadow-xs"
                              >
                                <GraduationCap className="h-3 w-3" />
                                <span>Convert to Student</span>
                              </Button>

                              <Badge variant="outline" className="rounded-md text-[10px] bg-slate-50 text-slate-600 font-medium">
                                Score {l.score}
                              </Badge>
                            </div>
                          )}

                          {/* Bottom Row: Quick stage move selector */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                            <span className="text-slate-400">
                              {l.created_at ? new Date(l.created_at).toLocaleDateString() : "Active lead"}
                            </span>
                            <div className="relative">
                              <Select
                                value={l.status || colName}
                                onValueChange={(newStatus) => {
                                  if (newStatus !== l.status) {
                                    if ((newStatus === "Qualified" || newStatus === "Counselling Booked") && !l.student_code) {
                                      convertLeadMutation.mutate({ id: l.id });
                                    } else {
                                      moveLeadMutation.mutate({ id: l.id, status: newStatus });
                                    }
                                  }
                                }}
                              >
                                <SelectTrigger className="h-6 px-1.5 text-[10px] font-medium border-slate-200 text-slate-600 bg-white hover:bg-slate-50">
                                  <span className="truncate max-w-[75px]">Move stage</span>
                                </SelectTrigger>
                                <SelectContent align="end">
                                  {columnsOrder.map((target) => (
                                    <SelectItem key={target} value={target} className="text-xs">
                                      {target}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {colLeads.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 p-6 text-center text-xs text-slate-400">
                      <p className="font-medium text-slate-500">No leads in {colName}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Drag and drop leads here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── New Lead Dialog ─── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Inquiry / Lead</DialogTitle>
            <DialogDescription>
              Record prospective candidate inquiries before formal admission.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5"><Label>Full Name *</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5"><Label>Email</Label><Input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@example.com"/></div>
              <div className="grid gap-1.5"><Label>Phone</Label><Input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91 ..."/></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5"><Label>City *</Label><Input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="Guwahati"/></div>
              <div className="grid gap-1.5"><Label>Source</Label>
                <Select value={form.source} onValueChange={v=>setForm({...form,source:v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website Form">Website Form</SelectItem>
                    <SelectItem value="Instagram Ad">Instagram Ad</SelectItem>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                    <SelectItem value="Education Fair">Education Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5"><Label>Score</Label><Input type="number" value={form.score} onChange={e=>setForm({...form,score:parseInt(e.target.value)||0})} /></div>
              <div className="grid gap-1.5"><Label>Initial Status</Label>
                <Select value={form.status} onValueChange={v=>setForm({...form,status:v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {columnsOrder.map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={()=>create.mutate()} disabled={!form.name||!form.city||create.isPending} className="bg-[#E52E20] hover:bg-[#C82114] text-white">
              {create.isPending && <Loader2 className="h-4 w-4 animate-spin"/>} Create Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Convert to Student Modal ─── */}
      <Dialog open={convertModalOpen} onOpenChange={setConvertModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <GraduationCap className="h-5 w-5 text-[#E52E20]" />
              Convert Lead to Student Admission
            </DialogTitle>
            <DialogDescription>
              This will create an official Student profile in the database with a unique <code className="text-[#E52E20] font-bold">UQ-XXXXX</code> code and link it to this lead.
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="grid gap-4 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900">{selectedLead.name}</div>
                  <div className="text-slate-500">{selectedLead.email || "No email"} · {selectedLead.phone || "No phone"}</div>
                </div>
                <Badge variant="outline" className="border-red-200 text-[#E52E20] bg-white font-semibold">
                  Score {selectedLead.score}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Target Destination *</Label>
                  <Select value={convertForm.country} onValueChange={v => setConvertForm({ ...convertForm, country: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Ireland">Ireland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Intake *</Label>
                  <Select value={convertForm.intake} onValueChange={v => setConvertForm({ ...convertForm, intake: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fall 2026">Fall 2026</SelectItem>
                      <SelectItem value="Spring 2027">Spring 2027</SelectItem>
                      <SelectItem value="Winter 2026">Winter 2026</SelectItem>
                      <SelectItem value="Summer 2027">Summer 2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label>Target Course / Program</Label>
                <Input
                  value={convertForm.course}
                  onChange={e => setConvertForm({ ...convertForm, course: e.target.value })}
                  placeholder="e.g. MSc Data Science / MBA"
                />
              </div>

              <div className="grid gap-1.5">
                <Label>Target University</Label>
                <Input
                  value={convertForm.university}
                  onChange={e => setConvertForm({ ...convertForm, university: e.target.value })}
                  placeholder="e.g. University of Manchester"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (selectedLead) {
                  convertLeadMutation.mutate({ id: selectedLead.id, details: convertForm });
                }
              }}
              disabled={convertLeadMutation.isPending}
              className="bg-[#E52E20] hover:bg-[#C82114] text-white gap-1.5 font-semibold"
            >
              {convertLeadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <GraduationCap className="h-4 w-4" />}
              Confirm & Create Student Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Lead Confirmation Dialog ─── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Lead
            </DialogTitle>
            <DialogDescription className="text-slate-600 pt-1 text-xs leading-relaxed">
              Are you sure you want to permanently delete lead <strong className="text-slate-900 font-semibold">{leadToDelete?.name}</strong>?
              This will remove this enquiry from the pipeline and MySQL database.
            </DialogDescription>
          </DialogHeader>

          {leadToDelete && (
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-3 text-xs space-y-1">
              <div className="font-bold text-slate-900">{leadToDelete.name}</div>
              <div className="text-slate-500">{leadToDelete.city} · {leadToDelete.source} · Score {leadToDelete.score}</div>
              {leadToDelete.student_code && (
                <div className="text-emerald-700 font-medium text-[11px] pt-1">
                  Note: Converted as student {leadToDelete.student_code}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 gap-1.5 font-semibold text-white"
              disabled={deleteLeadMutation.isPending}
              onClick={() => {
                if (leadToDelete) {
                  deleteLeadMutation.mutate(leadToDelete.id);
                }
              }}
            >
              {deleteLeadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

