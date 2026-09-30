import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Trash2,
  Loader2,
  Landmark,
  Users,
  GraduationCap,
  MapPin,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/students/")({
  head: () => ({
    meta: [
      { title: "Student CRM · Uniquesta" },
      { name: "description", content: "Student Data — clean list and dedicated profiles." },
      { property: "og:title", content: "Student CRM · Uniquesta ERP" },
    ],
  }),
  component: StudentsListPage,
});

function StudentsListPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("all");
  const [country, setCountry] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "Canada",
    course: "",
    university: "",
    intake: "Fall 2026",
    branch: "Mumbai",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["students", search, branch, country, page],
    queryFn: async () => {
      const params: Record<string, string> = { limit: String(limit), page: String(page) };
      if (search) params.search = search;
      if (branch !== "all") params.branch = branch;
      if (country !== "all") params.country = country;
      const res: any = await api.get<any[]>("/students", params);
      // normalize: router returns { success, data, pagination }
      if (res?.data && Array.isArray(res.data)) return res;
      if (Array.isArray(res)) return { success: true, data: res, pagination: { page: 1, limit, total: res.length, totalPages: 1 } };
      return res;
    },
  });

  const rows: any[] = (data as any)?.data ?? [];
  const pagination = (data as any)?.pagination ?? { page: 1, limit, total: rows.length, totalPages: 1 };
  const total = pagination.total ?? rows.length;

  const create = useMutation({
    mutationFn: async () => api.post("/students", { ...form, lead_score: 70, stage: "Lead", stage_index: 0 }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      setOpen(false);
      setForm({ name: "", email: "", phone: "", country: "Canada", course: "", university: "", intake: "Fall 2026", branch: "Mumbai" });
      toast.success("Student created");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (code: string) => api.del(`/students/${code}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["leads"] });
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      toast.success("Student admission record deleted successfully");
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete student"),
  });

  const stats = [
    { label: "Total Students", value: String(total), sub: "Across all branches", icon: Users },
    { label: "Active", value: String(rows.filter((r: any) => r.status === "Active").length), sub: "Currently pursuing", icon: GraduationCap },
    { label: "Avg. Lead Score", value: rows.length ? String(Math.round(rows.reduce((a: number, c: any) => a + (c.lead_score ?? 0), 0) / rows.length)) : "—", sub: "Out of 100", icon: ArrowUpRight },
    { label: "Branches", value: String(new Set(rows.map((r: any) => r.branch).filter(Boolean)).size), sub: "With active students", icon: MapPin },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Student Admissions"
        description="Consolidated student records — admissions, courses, documents & 360° lifecycle profile."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2 rounded-xl">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button size="sm" className="gap-2 rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> New Student
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="rounded-2xl shadow-soft">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">{s.value}</div>
                <div className="text-sm font-medium text-foreground">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.sub}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="rounded-2xl shadow-soft">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, ID, university…"
              className="h-9 pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={country}
              onValueChange={(v) => {
                setCountry(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-[150px] rounded-xl">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="United Kingdom">UK</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="Ireland">Ireland</SelectItem>
                <SelectItem value="India">India</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={branch}
              onValueChange={(v) => {
                setBranch(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-[150px] rounded-xl">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="Guwahati HQ">Guwahati HQ</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                <SelectItem value="Kochi">Kochi</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-xl">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="rounded-2xl shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Students</CardTitle>
          <span className="text-xs text-muted-foreground">
            {total} records {pagination.totalPages > 1 ? `· Page ${pagination.page} of ${pagination.totalPages}` : ""}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Student</th>
                  <th className="px-5 py-3 text-left font-medium">Destination</th>
                  <th className="px-5 py-3 text-left font-medium">Branch</th>
                  <th className="px-5 py-3 text-left font-medium">Stage</th>
                  <th className="px-5 py-3 text-left font-medium">Score</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading students…
                      </span>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                      No students found. Try adjusting search or create a new student.
                    </td>
                  </tr>
                ) : (
                  rows.map((s: any) => {
                    const code = s.code ?? s.id;
                    const initials = s.name
                      ? s.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "ST";
                    return (
                      <tr key={s.id ?? code} className="border-t border-border/60 hover:bg-muted/30">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-foreground">{s.name}</div>
                              <div className="truncate text-xs text-muted-foreground">
                                {code} · {s.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="text-sm font-medium text-foreground">{s.country}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            {s.university} · {s.course}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant="outline" className="rounded-md text-xs font-normal">
                            {s.branch}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <Badge className="rounded-md bg-primary/10 text-primary hover:bg-primary/10">{s.stage ?? "Lead"}</Badge>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant="secondary" className="rounded-md bg-amber-100 text-amber-700 hover:bg-amber-100">
                            {s.lead_score ?? s.leadScore ?? "—"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-1">
                            <Link
                              to="/students/$studentId"
                              params={{ studentId: String(code) }}
                              className="inline-flex h-7 items-center gap-1 rounded-lg border border-input bg-background px-2.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground"
                            >
                              <Eye className="h-3.5 w-3.5" /> View
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              title="Delete student admission record"
                              onClick={() => {
                                setStudentToDelete(s);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <span className="text-xs text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Student</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Priya Nair" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Email *</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
              </div>
              <div className="grid gap-1.5">
                <Label>Phone *</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98204 41290" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Country</Label>
                <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Canada" />
              </div>
              <div className="grid gap-1.5">
                <Label>Branch</Label>
                <Input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} placeholder="Mumbai" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Course</Label>
                <Input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="MSc Data Science" />
              </div>
              <div className="grid gap-1.5">
                <Label>University</Label>
                <Input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} placeholder="University of Toronto" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Intake</Label>
              <Input value={form.intake} onChange={(e) => setForm({ ...form, intake: e.target.value })} placeholder="Fall 2026" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => create.mutate()} disabled={!form.name || !form.email || create.isPending}>
              {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Student Confirmation Dialog ─── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5 text-[#E52E20]" />
              Delete Student Admission Record
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-1 text-xs leading-relaxed">
              Are you sure you want to permanently delete student <strong className="text-foreground font-semibold">{studentToDelete?.name}</strong> ({studentToDelete?.code || studentToDelete?.id})?
              This will remove this student from admissions, enrolled courses, and database records.
            </DialogDescription>
          </DialogHeader>

          {studentToDelete && (
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-3 text-xs space-y-1">
              <div className="font-bold text-slate-900">{studentToDelete.name}</div>
              <div className="text-slate-600 font-mono text-[11px]">{studentToDelete.code || studentToDelete.id} · {studentToDelete.email || "No email"}</div>
              <div className="text-slate-500 text-[11px]">
                {studentToDelete.course || "No course"} · {studentToDelete.university || "No university"} ({studentToDelete.country || "General"})
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-[#E52E20] hover:bg-[#C82114] text-white gap-1.5 font-semibold"
              disabled={del.isPending}
              onClick={() => {
                if (studentToDelete) {
                  del.mutate(String(studentToDelete.code || studentToDelete.id));
                }
              }}
            >
              {del.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
