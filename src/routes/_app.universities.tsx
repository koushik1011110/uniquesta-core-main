import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Star,
  MapPin,
  Loader2,
  Trash2,
  Building2,
  BookOpen,
  Globe2,
  Users,
  ShieldCheck,
  Eye,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { getUser, isSuperAdminRole } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/universities")({
  head: () => ({
    meta: [
      { title: "University and Courses · Uniquesta" },
      {
        name: "description",
        content:
          "Manage partner universities, worldwide degree programs, curriculum & active course admissions.",
      },
      { property: "og:title", content: "University and Courses · Uniquesta" },
      {
        property: "og:description",
        content:
          "Unified directory of global universities and verified courses with admission tracking.",
      },
    ],
  }),
  component: UniversitiesAndCoursesPage,
});

function UniversitiesAndCoursesPage() {
  const qc = useQueryClient();
  const currentUser = getUser() || {
    name: "Mohammad Iqbal",
    email: "admin@uniquesta.com",
    role: "super_admin",
    branch: "Guwahati HQ",
  };
  const isSuperAdmin = isSuperAdminRole(currentUser);

  // Tab & search states
  const [activeTab, setActiveTab] = useState<"universities" | "courses">("universities");
  const [uniSearch, setUniSearch] = useState("");
  const [uniTierFilter, setUniTierFilter] = useState("all");
  const [courseSearch, setCourseSearch] = useState("");
  const [courseCategoryFilter, setCourseCategoryFilter] = useState("all");

  // Modal states
  const [addUniOpen, setAddUniOpen] = useState(false);
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [viewUniItem, setViewUniItem] = useState<any | null>(null);
  const [viewCourseItem, setViewCourseItem] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "uni" | "course"; item: any } | null>(null);

  // University form state
  const initialUniForm = {
    name: "",
    country: "",
    city: "",
    tier: "Tier 1",
    courses: 120,
    intakes: "Fall, Winter",
    commission: "15%",
    rating: 4.8,
  };
  const [uniForm, setUniForm] = useState(initialUniForm);

  // Course form state
  const initialCourseForm = {
    name: "",
    category: "Nursing",
    duration: "4 Years",
    session: "2026-27",
    eligibility: "10+2 with PCB & English (Min 45%)",
    minPercentage: "45%",
    tuitionFee: "₹ 1,50,000 / year",
    registrationFee: "₹ 10,000",
    totalSeats: 100,
    seatsAvailable: 60,
    description: "",
  };
  const [courseForm, setCourseForm] = useState(initialCourseForm);

  // ----------------------------------------------------
  // Queries
  // ----------------------------------------------------
  const { data: uniData, isLoading: uniLoading } = useQuery({
    queryKey: ["universities", uniSearch],
    queryFn: async () => {
      const res: any = await api.get<any[]>("/universities", { search: uniSearch, limit: 100 });
      return res.data ?? res ?? [];
    },
  });
  const rawUniList: any[] = Array.isArray(uniData) ? uniData : (uniData as any)?.data ?? [];

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["courses", courseSearch, courseCategoryFilter],
    queryFn: async () => {
      const params: any = { limit: 100 };
      if (courseSearch) params.search = courseSearch;
      if (courseCategoryFilter && courseCategoryFilter !== "all") params.category = courseCategoryFilter;
      const res: any = await api.get<any[]>("/courses", params);
      return res.data ?? res ?? [];
    },
  });
  const rawCourseList: any[] = Array.isArray(courseData) ? courseData : (courseData as any)?.data ?? [];

  // Filter universities by tier
  const filteredUniversities = useMemo(() => {
    return rawUniList.filter((u) => {
      if (uniTierFilter !== "all" && u.tier !== uniTierFilter) return false;
      return true;
    });
  }, [rawUniList, uniTierFilter]);

  // Unique categories for course filter
  const courseCategories = useMemo(() => {
    const set = new Set<string>();
    rawCourseList.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [rawCourseList]);

  // ----------------------------------------------------
  // Mutations
  // ----------------------------------------------------
  const createUniMut = useMutation({
    mutationFn: async () => {
      return api.post("/universities", {
        ...uniForm,
        courses: Number(uniForm.courses) || 0,
        rating: Number(uniForm.rating) || 4.5,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["universities"] });
      setAddUniOpen(false);
      setUniForm(initialUniForm);
      toast.success("University added successfully!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to add university"),
  });

  const deleteUniMut = useMutation({
    mutationFn: async (id: number) => api.del(`/universities/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["universities"] });
      setDeleteTarget(null);
      toast.success("University deleted successfully");
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete university"),
  });

  const createCourseMut = useMutation({
    mutationFn: async () => {
      return api.post("/courses", {
        ...courseForm,
        totalSeats: Number(courseForm.totalSeats) || 0,
        seatsAvailable: Number(courseForm.seatsAvailable) || 0,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      setAddCourseOpen(false);
      setCourseForm(initialCourseForm);
      toast.success("Course added successfully!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to add course"),
  });

  const deleteCourseMut = useMutation({
    mutationFn: async (idOrCode: string | number) => api.del(`/courses/${idOrCode}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      setDeleteTarget(null);
      toast.success("Course deleted successfully");
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete course"),
  });

  // KPI calculations
  const totalUniversitiesCount = rawUniList.length || 6;
  const totalCoursesCount = rawCourseList.length || 4;
  const uniqueCountries = useMemo(() => {
    const cSet = new Set<string>();
    rawUniList.forEach((u) => {
      if (u.country) cSet.add(u.country);
    });
    return cSet.size || 6;
  }, [rawUniList]);
  const totalSeatsCount = useMemo(() => {
    return rawCourseList.reduce((acc, c) => acc + (c.total_seats ?? c.totalSeats ?? 0), 0) || 360;
  }, [rawCourseList]);

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Page Header ─── */}
      <PageHeader
        title="University and Courses"
        description="Comprehensive directory of accredited partner universities and specialized academic courses with real-time admissions info."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input synced to active tab */}
            {activeTab === "universities" ? (
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search universities, countries…"
                  className="h-9 w-60 rounded-lg pl-9 text-xs"
                  value={uniSearch}
                  onChange={(e) => setUniSearch(e.target.value)}
                />
              </div>
            ) : (
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search courses, categories…"
                  className="h-9 w-60 rounded-lg pl-9 text-xs"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                />
              </div>
            )}

            {/* Super Admin Action Buttons */}
            {isSuperAdmin ? (
              <>
                <Button
                  onClick={() => setAddUniOpen(true)}
                  size="sm"
                  className="h-9 rounded-lg bg-slate-900 text-white shadow-sm hover:bg-slate-800"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add University
                </Button>
                <Button
                  onClick={() => setAddCourseOpen(true)}
                  size="sm"
                  className="h-9 rounded-lg bg-[#E52E20] text-white shadow-sm hover:bg-[#c92215]"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Course
                </Button>
              </>
            ) : (
              <Badge variant="outline" className="h-9 px-3 text-xs text-muted-foreground">
                <Eye className="mr-1.5 h-3.5 w-3.5 text-slate-400" /> Read-Only Mode
              </Badge>
            )}
          </div>
        }
      />

      {/* ─── KPI Overview Cards ─── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        <Card className="rounded-2xl border-slate-200/80 shadow-sm transition hover:shadow-md">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Partner Universities</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">{totalUniversitiesCount}</div>
            <p className="mt-0.5 text-[11px] text-slate-500">Tier 1 & accredited partners</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-sm transition hover:shadow-md">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Offered Courses</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-[#E52E20]">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">{totalCoursesCount}</div>
            <p className="mt-0.5 text-[11px] text-slate-500">Degree & diploma programs</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-sm transition hover:shadow-md">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Global Coverage</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <Globe2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">{uniqueCountries} Countries</div>
            <p className="mt-0.5 text-[11px] text-slate-500">UK, Canada, US, EU, Australia</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-sm transition hover:shadow-md">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Seat Capacity</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-50 text-purple-600">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">{totalSeatsCount} Seats</div>
            <p className="mt-0.5 text-[11px] text-slate-500">Admissions for 2026-27 session</p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Super Admin Status Banner ─── */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-xs text-slate-600 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {isSuperAdmin ? (
            <>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-900">Super Admin Permissions Active:</span>
              <span>You have administrative rights to add, edit, and delete partner universities and academic courses.</span>
            </>
          ) : (
            <>
              <span className="flex h-2 w-2 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-900">Read-Only Mode:</span>
              <span>Adding and modifying universities or courses requires Super Admin credentials.</span>
            </>
          )}
        </div>
        {isSuperAdmin && (
          <div className="hidden sm:flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5" /> Super Admin Access
          </div>
        )}
      </div>

      {/* ─── Tabs Navigation ─── */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "universities" | "courses")}
        className="space-y-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-10 rounded-xl bg-slate-100 p-1">
            <TabsTrigger
              value="universities"
              className="gap-2 rounded-lg px-4 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              <Building2 className="h-4 w-4 text-primary" /> Universities ({rawUniList.length})
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="gap-2 rounded-lg px-4 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              <BookOpen className="h-4 w-4 text-[#E52E20]" /> Courses & Programs ({rawCourseList.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab-specific inline filter toolbar */}
          {activeTab === "universities" ? (
            <div className="flex items-center gap-2">
              <div className="relative md:hidden w-full sm:w-auto">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search universities…"
                  className="h-9 w-full sm:w-48 rounded-lg pl-8 text-xs"
                  value={uniSearch}
                  onChange={(e) => setUniSearch(e.target.value)}
                />
              </div>
              <Select value={uniTierFilter} onValueChange={setUniTierFilter}>
                <SelectTrigger className="h-9 w-36 rounded-lg text-xs">
                  <SelectValue placeholder="All Tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="Tier 1">Tier 1</SelectItem>
                  <SelectItem value="Tier 2">Tier 2</SelectItem>
                  <SelectItem value="Premier">Premier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative md:hidden w-full sm:w-auto">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search courses…"
                  className="h-9 w-full sm:w-48 rounded-lg pl-8 text-xs"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                />
              </div>
              <Select value={courseCategoryFilter} onValueChange={setCourseCategoryFilter}>
                <SelectTrigger className="h-9 w-40 rounded-lg text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {courseCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB 1: UNIVERSITIES
           ══════════════════════════════════════════════════════════════ */}
        <TabsContent value="universities" className="mt-0">
          {uniLoading ? (
            <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" /> Loading partner universities…
            </div>
          ) : filteredUniversities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-sm font-bold text-slate-700">No universities found</h3>
              <p className="mt-1 text-xs text-slate-500">
                {uniSearch ? `No matches for "${uniSearch}". Try clearing filters.` : "Get started by adding partner institutions."}
              </p>
              {isSuperAdmin && (
                <Button onClick={() => setAddUniOpen(true)} size="sm" className="mt-4 rounded-lg bg-black text-white">
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add University
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredUniversities.map((u: any) => (
                <Card
                  key={u.id ?? u.name}
                  className="group rounded-2xl border border-slate-200/80 bg-white shadow-soft transition hover:border-slate-300 hover:shadow-elevated"
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="truncate text-base font-bold text-slate-900">
                          {u.name}
                        </CardTitle>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-[#E52E20]" />
                        <span>
                          {u.city}, {u.country}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 rounded-md border-primary/30 bg-primary-soft text-primary font-semibold text-[11px]"
                    >
                      {u.tier || "Tier 1"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3.5 pt-0">
                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50/80 p-2.5 text-xs border border-slate-100">
                      <div>
                        <div className="text-[10.5px] font-medium text-slate-400">Courses</div>
                        <div className="mt-0.5 font-bold text-slate-900">{u.courses || 0}</div>
                      </div>
                      <div>
                        <div className="text-[10.5px] font-medium text-slate-400">Intakes</div>
                        <div className="mt-0.5 truncate font-semibold text-slate-800" title={u.intakes}>
                          {u.intakes || "Fall, Spring"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10.5px] font-medium text-slate-400">Commission</div>
                        <div className="mt-0.5 font-bold text-emerald-600">{u.commission || "15%"}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-900">{u.rating || 4.8}</span>
                        <span className="text-[10.5px] text-slate-400">counsellor rating</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg text-xs"
                          onClick={() => setViewUniItem(u)}
                        >
                          View Details
                        </Button>
                        {isSuperAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete University (Super Admin)"
                            onClick={() => setDeleteTarget({ type: "uni", item: u })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: COURSES & PROGRAMS
           ══════════════════════════════════════════════════════════════ */}
        <TabsContent value="courses" className="mt-0">
          {courseLoading ? (
            <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#E52E20]" /> Loading academic courses…
            </div>
          ) : rawCourseList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-sm font-bold text-slate-700">No courses available</h3>
              <p className="mt-1 text-xs text-slate-500">
                {courseSearch ? `No matches for "${courseSearch}". Try clearing filters.` : "Get started by adding certified degree courses."}
              </p>
              {isSuperAdmin && (
                <Button onClick={() => setAddCourseOpen(true)} size="sm" className="mt-4 rounded-lg bg-[#E52E20] text-white">
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Course
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
              {rawCourseList.map((c: any) => {
                const totalSeats = c.total_seats ?? c.totalSeats ?? 0;
                const seatsAvailable = c.seats_available ?? c.seatsAvailable ?? 0;
                const tuitionFee = c.tuition_fee || c.tuitionFee || "—";
                const regFee = c.registration_fee || c.registrationFee || "—";
                const minPct = c.min_percentage || c.minPercentage || "45%";
                const pctOccupied = totalSeats > 0 ? Math.round(((totalSeats - seatsAvailable) / totalSeats) * 100) : 0;

                return (
                  <Card
                    key={c.id ?? c.code}
                    className="group rounded-2xl border border-slate-200/80 bg-white shadow-soft transition hover:border-slate-300 hover:shadow-elevated"
                  >
                    <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {c.code || "CRS"}
                          </span>
                          <Badge variant="outline" className="border-red-200 bg-red-50 text-[#E52E20] text-[10.5px]">
                            {c.category || "General"}
                          </Badge>
                          <span className="text-[11px] font-medium text-slate-400">
                            Session {c.session || "2026-27"}
                          </span>
                        </div>
                        <CardTitle className="mt-2 truncate text-base font-bold text-slate-900">
                          {c.name}
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="shrink-0 bg-slate-50 text-slate-700 text-xs">
                        <Clock className="mr-1 h-3 w-3 text-slate-400" />
                        {c.duration || "4 Years"}
                      </Badge>
                    </CardHeader>

                    <CardContent className="space-y-3.5">
                      {/* Eligibility Box */}
                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">Eligibility Criteria:</span>
                          <span className="font-mono text-slate-600">Min {minPct}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-slate-800 leading-relaxed font-medium">
                          {c.eligibility || "Standard qualification required."}
                        </p>
                      </div>

                      {/* Fees Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                          <div className="text-[10.5px] text-slate-400">Tuition Fee</div>
                          <div className="mt-0.5 font-bold text-slate-900">{tuitionFee}</div>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                          <div className="text-[10.5px] text-slate-400">Registration Fee</div>
                          <div className="mt-0.5 font-bold text-emerald-600">{regFee}</div>
                        </div>
                      </div>

                      {/* Seats Availability Bar */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11.5px]">
                          <span className="font-medium text-slate-600">Seat Allocation</span>
                          <span className="font-bold text-slate-900">
                            {seatsAvailable} available <span className="font-normal text-slate-400">/ {totalSeats} total</span>
                          </span>
                        </div>
                        <Progress value={pctOccupied} className="h-2 bg-slate-100" />
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-[11px] text-slate-400">
                          {c.description ? c.description.slice(0, 45) + "…" : "Admissions open"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg text-xs"
                            onClick={() => setViewCourseItem(c)}
                          >
                            View Details
                          </Button>
                          {isSuperAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete Course (Super Admin)"
                              onClick={() => setDeleteTarget({ type: "course", item: c })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ══════════════════════════════════════════════════════════════
          MODAL: ADD UNIVERSITY (Super Admin)
         ══════════════════════════════════════════════════════════════ */}
      <Dialog open={addUniOpen} onOpenChange={setAddUniOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-black text-white">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">Add Partner University</DialogTitle>
                <DialogDescription className="text-xs">
                  Register a new international or domestic university partner with active admissions tie-up.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-3.5 py-2 text-xs">
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">University Name *</Label>
              <Input
                value={uniForm.name}
                onChange={(e) => setUniForm({ ...uniForm, name: e.target.value })}
                placeholder="e.g. University of Toronto"
                className="h-9 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">Country *</Label>
                <Input
                  value={uniForm.country}
                  onChange={(e) => setUniForm({ ...uniForm, country: e.target.value })}
                  placeholder="e.g. Canada"
                  className="h-9 rounded-lg text-xs"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">City *</Label>
                <Input
                  value={uniForm.city}
                  onChange={(e) => setUniForm({ ...uniForm, city: e.target.value })}
                  placeholder="e.g. Toronto"
                  className="h-9 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">Tier Category</Label>
                <Select value={uniForm.tier} onValueChange={(v) => setUniForm({ ...uniForm, tier: v })}>
                  <SelectTrigger className="h-9 rounded-lg text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tier 1">Tier 1 (Top Ranked)</SelectItem>
                    <SelectItem value="Tier 2">Tier 2 (Recognized)</SelectItem>
                    <SelectItem value="Premier">Premier Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">Available Courses Count</Label>
                <Input
                  type="number"
                  value={uniForm.courses}
                  onChange={(e) => setUniForm({ ...uniForm, courses: Number(e.target.value) })}
                  placeholder="e.g. 150"
                  className="h-9 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">Intakes *</Label>
                <Input
                  value={uniForm.intakes}
                  onChange={(e) => setUniForm({ ...uniForm, intakes: e.target.value })}
                  placeholder="e.g. Fall, Winter"
                  className="h-9 rounded-lg text-xs"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">Commission Agreement *</Label>
                <Input
                  value={uniForm.commission}
                  onChange={(e) => setUniForm({ ...uniForm, commission: e.target.value })}
                  placeholder="e.g. 15% or € 2,400"
                  className="h-9 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">Counsellor Rating (0 - 5.0)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={uniForm.rating}
                onChange={(e) => setUniForm({ ...uniForm, rating: Number(e.target.value) })}
                className="h-9 rounded-lg text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setAddUniOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-black text-white hover:bg-slate-800"
              onClick={() => createUniMut.mutate()}
              disabled={!uniForm.name || !uniForm.country || !uniForm.city || createUniMut.isPending}
            >
              {createUniMut.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Save University
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════
          MODAL: ADD COURSE (Super Admin)
         ══════════════════════════════════════════════════════════════ */}
      <Dialog open={addCourseOpen} onOpenChange={setAddCourseOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#E52E20] text-white">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">Add Academic Course</DialogTitle>
                <DialogDescription className="text-xs">
                  Create a new degree, diploma, or certification course eligible for student admissions.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-3.5 py-2 text-xs">
            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">Course Title *</Label>
              <Input
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                placeholder="e.g. B.Sc Nursing, MBA Global Business, BPT"
                className="h-9 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">Category *</Label>
                <Select
                  value={courseForm.category}
                  onValueChange={(v) => setCourseForm({ ...courseForm, category: v })}
                >
                  <SelectTrigger className="h-9 rounded-lg text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nursing">Nursing</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="Allied Health">Allied Health</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Hospitality">Hospitality</SelectItem>
                    <SelectItem value="Humanities">Humanities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">Duration *</Label>
                <Input
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                  placeholder="e.g. 4 Years, 2 Years, 18 Months"
                  className="h-9 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">Academic Session *</Label>
                <Input
                  value={courseForm.session}
                  onChange={(e) => setCourseForm({ ...courseForm, session: e.target.value })}
                  placeholder="e.g. 2026-27"
                  className="h-9 rounded-lg text-xs"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">Min Percentage</Label>
                <Input
                  value={courseForm.minPercentage}
                  onChange={(e) => setCourseForm({ ...courseForm, minPercentage: e.target.value })}
                  placeholder="e.g. 45%, 50%"
                  className="h-9 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">Eligibility Criteria *</Label>
              <Input
                value={courseForm.eligibility}
                onChange={(e) => setCourseForm({ ...courseForm, eligibility: e.target.value })}
                placeholder="e.g. 10+2 with PCB & English (Min 45%)"
                className="h-9 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">Tuition Fee *</Label>
                <Input
                  value={courseForm.tuitionFee}
                  onChange={(e) => setCourseForm({ ...courseForm, tuitionFee: e.target.value })}
                  placeholder="e.g. ₹ 1,50,000 / year"
                  className="h-9 rounded-lg text-xs"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">Registration Fee *</Label>
                <Input
                  value={courseForm.registrationFee}
                  onChange={(e) => setCourseForm({ ...courseForm, registrationFee: e.target.value })}
                  placeholder="e.g. ₹ 10,000"
                  className="h-9 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">Total Seats</Label>
                <Input
                  type="number"
                  value={courseForm.totalSeats}
                  onChange={(e) => setCourseForm({ ...courseForm, totalSeats: Number(e.target.value) })}
                  placeholder="e.g. 100"
                  className="h-9 rounded-lg text-xs"
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-semibold">Seats Available</Label>
                <Input
                  type="number"
                  value={courseForm.seatsAvailable}
                  onChange={(e) => setCourseForm({ ...courseForm, seatsAvailable: Number(e.target.value) })}
                  placeholder="e.g. 60"
                  className="h-9 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-semibold">Description / Notes</Label>
              <Textarea
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Detailed curriculum, accreditation, career pathways…"
                className="text-xs resize-none h-18"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setAddCourseOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-[#E52E20] text-white hover:bg-[#c92215]"
              onClick={() => createCourseMut.mutate()}
              disabled={
                !courseForm.name ||
                !courseForm.category ||
                !courseForm.duration ||
                !courseForm.eligibility ||
                !courseForm.tuitionFee ||
                createCourseMut.isPending
              }
            >
              {createCourseMut.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Save Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════
          MODAL: VIEW UNIVERSITY DETAILS
         ══════════════════════════════════════════════════════════════ */}
      <Dialog open={!!viewUniItem} onOpenChange={() => setViewUniItem(null)}>
        <DialogContent className="max-w-md">
          {viewUniItem && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-primary/30 bg-primary-soft text-primary font-bold">
                    {viewUniItem.tier || "Tier 1"}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{viewUniItem.rating || 4.8}</span>
                  </div>
                </div>
                <DialogTitle className="mt-2 text-lg font-bold">{viewUniItem.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-[#E52E20]" />
                  {viewUniItem.city}, {viewUniItem.country}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-3 text-xs">
                <div className="rounded-xl bg-slate-50 p-3 space-y-2 border">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Courses:</span>
                    <span className="font-bold text-slate-900">{viewUniItem.courses || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Upcoming Intakes:</span>
                    <span className="font-semibold text-slate-900">{viewUniItem.intakes || "Fall, Winter"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Partner Commission:</span>
                    <span className="font-bold text-emerald-600">{viewUniItem.commission || "15%"}</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button size="sm" onClick={() => setViewUniItem(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════
          MODAL: VIEW COURSE DETAILS
         ══════════════════════════════════════════════════════════════ */}
      <Dialog open={!!viewCourseItem} onOpenChange={() => setViewCourseItem(null)}>
        <DialogContent className="max-w-md">
          {viewCourseItem && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {viewCourseItem.code}
                  </span>
                  <Badge variant="outline" className="border-red-200 bg-red-50 text-[#E52E20] text-xs">
                    {viewCourseItem.category}
                  </Badge>
                </div>
                <DialogTitle className="mt-2 text-lg font-bold">{viewCourseItem.name}</DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Duration: {viewCourseItem.duration} · Academic Session {viewCourseItem.session}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-3 text-xs">
                <div className="rounded-xl bg-slate-50 p-3 space-y-2 border">
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-medium">Eligibility Requirement:</span>
                    <span className="font-semibold text-slate-800">{viewCourseItem.eligibility}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-slate-500">Tuition Fee:</span>
                    <span className="font-bold text-slate-900">{viewCourseItem.tuition_fee || viewCourseItem.tuitionFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registration Fee:</span>
                    <span className="font-bold text-emerald-600">{viewCourseItem.registration_fee || viewCourseItem.registrationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Seats Remaining:</span>
                    <span className="font-bold text-slate-900">
                      {viewCourseItem.seats_available ?? viewCourseItem.seatsAvailable} of{" "}
                      {viewCourseItem.total_seats ?? viewCourseItem.totalSeats} seats
                    </span>
                  </div>
                </div>

                {viewCourseItem.description && (
                  <div className="rounded-lg bg-slate-50/50 p-2.5 text-xs text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-1">Description:</span>
                    {viewCourseItem.description}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button size="sm" onClick={() => setViewCourseItem(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════
          CONFIRM DELETE DIALOG (Super Admin)
         ══════════════════════════════════════════════════════════════ */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-red-600 flex items-center gap-1.5">
              <Trash2 className="h-4 w-4" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-900">"{deleteTarget?.item?.name}"</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (!deleteTarget) return;
                if (deleteTarget.type === "uni") {
                  deleteUniMut.mutate(deleteTarget.item.id);
                } else {
                  deleteCourseMut.mutate(deleteTarget.item.id ?? deleteTarget.item.code);
                }
              }}
              disabled={deleteUniMut.isPending || deleteCourseMut.isPending}
            >
              {(deleteUniMut.isPending || deleteCourseMut.isPending) && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
