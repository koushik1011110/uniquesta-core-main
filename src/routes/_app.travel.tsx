import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Bus,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Trash2,
  DollarSign,
  Handshake,
  Car,
  UserCheck,
  Phone,
  ArrowRight,
  TrendingUp,
  Briefcase,
  AlertCircle,
  ExternalLink,
  Edit,
  Pencil,
  ShieldCheck,
  ChevronRight,
  Navigation,
  Ticket,
  UserPlus,
  KeyRound,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { toast } from "sonner";

export const Route = createFileRoute("/_app/travel")({
  head: () => ({
    meta: [
      { title: "Travel Bookings & Fleet Dispatch · Uniquesta Tours & Travels" },
      {
        name: "description",
        content:
          "Manage customer travel bookings, assign bus drivers and partner agencies, and control middleman profit margins with Uniquesta.",
      },
    ],
  }),
  component: TravelBookingsPage,
});

function TravelBookingsPage() {
  const qc = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch travel bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["travel-bookings"],
    queryFn: async () => {
      try {
        const res: any = await api.get("/travel/bookings");
        return res.data ?? res ?? [];
      } catch {
        return [];
      }
    },
  });

  // Fetch drivers list
  const { data: drivers = [] } = useQuery({
    queryKey: ["travel-drivers"],
    queryFn: async () => {
      try {
        const res: any = await api.get("/travel/drivers");
        return res.data ?? res ?? [];
      } catch {
        return [];
      }
    },
  });

  // Fetch agencies list
  const { data: agencies = [] } = useQuery({
    queryKey: ["travel-agencies"],
    queryFn: async () => {
      try {
        const res: any = await api.get("/travel/agencies");
        return res.data ?? res ?? [];
      } catch {
        return [];
      }
    },
  });

  // Form state for creating a new booking
  const [form, setForm] = useState({
    passenger_name: "",
    phone: "",
    email: "",
    travel_type: "Group Outstation Bus",
    vehicle_type: "32-Seater Luxury AC Bus",
    origin: "Guwahati Paltan Bazar",
    destination: "Kaziranga National Park",
    departure_date: new Date().toISOString().slice(0, 10),
    return_date: "",
    passengers_count: "4",
    // Middleman pricing:
    customer_price: 25000,
    agency_cost: 18000,
    payment_status: "Paid",
    agency_payment_status: "Pending",
    // Relationship assignments:
    assigned_agency: "Royal Wheels & Tours",
    assigned_driver: "Rajesh Sharma",
    driver_phone: "+91 98200 45678",
    vehicle_number: "AS-01-BK-9921",
    trip_status: "Assigned to Driver",
    notes: "",
  });

  // Relationship quick assign form state
  const [assignForm, setAssignForm] = useState({
    assigned_agency: "",
    agency_contact: "",
    assigned_driver: "",
    driver_phone: "",
    vehicle_number: "",
    trip_status: "Assigned to Driver",
  });

  // When driver selected in modal, auto-fill vehicle & phone
  const handleDriverSelect = (driverName: string) => {
    const found = drivers.find((d: any) => d.name === driverName);
    if (found) {
      setForm((prev) => ({
        ...prev,
        assigned_driver: found.name,
        driver_phone: found.phone,
        vehicle_number: found.vehicle_number,
        vehicle_type: found.vehicle_type || prev.vehicle_type,
      }));
    } else {
      setForm((prev) => ({ ...prev, assigned_driver: driverName }));
    }
  };

  const handleAssignDriverSelect = (driverName: string) => {
    const found = drivers.find((d: any) => d.name === driverName);
    if (found) {
      setAssignForm((prev) => ({
        ...prev,
        assigned_driver: found.name,
        driver_phone: found.phone,
        vehicle_number: found.vehicle_number,
      }));
    } else {
      setAssignForm((prev) => ({ ...prev, assigned_driver: driverName }));
    }
  };

  // ─── Superadmin Bus Driver Management State ───
  const [openAddDriverModal, setOpenAddDriverModal] = useState(false);
  const [openEditDriverModal, setOpenEditDriverModal] = useState(false);
  const [selectedDriverForEdit, setSelectedDriverForEdit] = useState<any>(null);
  const [fleetSearch, setFleetSearch] = useState("");
  const [fleetStatusFilter, setFleetStatusFilter] = useState("all");

  const [driverForm, setDriverForm] = useState({
    name: "",
    phone: "",
    vehicle_type: "32-Seater Luxury AC Bus",
    vehicle_number: "",
    experience: "5 years",
    rating: 4.8,
    status: "Available",
    pin: "1234",
    email: "",
    agency: "Direct Fleet",
  });

  const [editDriverForm, setEditDriverForm] = useState({
    name: "",
    phone: "",
    vehicle_type: "32-Seater Luxury AC Bus",
    vehicle_number: "",
    experience: "5 years",
    rating: 4.8,
    status: "Available",
    pin: "1234",
    email: "",
    agency: "Direct Fleet",
  });

  const resetDriverForm = () => {
    setDriverForm({
      name: "",
      phone: "",
      vehicle_type: "32-Seater Luxury AC Bus",
      vehicle_number: "",
      experience: "5 years",
      rating: 4.8,
      status: "Available",
      pin: "1234",
      email: "",
      agency: (agencies && agencies[0]?.name) || "Direct Fleet",
    });
  };

  const createDriverMutation = useMutation({
    mutationFn: async () => {
      if (!driverForm.name.trim()) throw new Error("Driver name is required");
      if (!driverForm.phone.trim()) throw new Error("Driver phone number is required");
      if (!driverForm.vehicle_number.trim()) throw new Error("Vehicle plate number is required");

      return api.post("/travel/drivers", {
        name: driverForm.name.trim(),
        phone: driverForm.phone.trim(),
        vehicle_type: driverForm.vehicle_type.trim(),
        vehicle_number: driverForm.vehicle_number.trim().toUpperCase(),
        experience: driverForm.experience.trim() || "5 years",
        rating: Number(driverForm.rating) || 4.8,
        status: driverForm.status || "Available",
        pin: (driverForm.pin || "1234").trim(),
        email: driverForm.email?.trim() || null,
        agency: driverForm.agency?.trim() || null,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["travel-drivers"] });
      setOpenAddDriverModal(false);
      const pinUsed = driverForm.pin || "1234";
      toast.success(
        `Bus driver ${driverForm.name} registered! Portal Login: Phone ${driverForm.phone}, PIN ${pinUsed}`
      );
      resetDriverForm();
    },
    onError: (e: any) => toast.error(e.message || "Failed to add bus driver"),
  });

  const updateDriverMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDriverForEdit?.id) return;
      return api.put(`/travel/drivers/${selectedDriverForEdit.id}`, {
        name: editDriverForm.name.trim(),
        phone: editDriverForm.phone.trim(),
        vehicle_type: editDriverForm.vehicle_type.trim(),
        vehicle_number: editDriverForm.vehicle_number.trim().toUpperCase(),
        experience: editDriverForm.experience.trim(),
        rating: Number(editDriverForm.rating) || 4.8,
        status: editDriverForm.status,
        pin: editDriverForm.pin?.trim(),
        email: editDriverForm.email?.trim(),
        agency: editDriverForm.agency?.trim(),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["travel-drivers"] });
      setOpenEditDriverModal(false);
      setSelectedDriverForEdit(null);
      toast.success("Driver details updated successfully!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to update driver"),
  });

  const deleteDriverMutation = useMutation({
    mutationFn: async (id: number | string) => api.del(`/travel/drivers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["travel-drivers"] });
      toast.success("Driver removed from fleet directory");
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete driver"),
  });

  const openEditDriver = (driver: any) => {
    setSelectedDriverForEdit(driver);
    setEditDriverForm({
      name: driver.name || "",
      phone: driver.phone || "",
      vehicle_type: driver.vehicle_type || "32-Seater Luxury AC Bus",
      vehicle_number: driver.vehicle_number || "",
      experience: driver.experience || "5 years",
      rating: Number(driver.rating) || 4.8,
      status: driver.status || "Available",
      pin: driver.pin || "1234",
      email: driver.email || "",
      agency: driver.agency || "Direct Fleet",
    });
    setOpenEditDriverModal(true);
  };

  const createBooking = useMutation({
    mutationFn: async () => {
      const custPrice = Number(form.customer_price) || 0;
      const agCost = Number(form.agency_cost) || 0;
      const margin = custPrice - agCost;

      return api.post("/travel/bookings", {
        ...form,
        customer_price: custPrice,
        agency_cost: agCost,
        admin_margin: margin,
        total_amount: `₹ ${custPrice.toLocaleString("en-IN")}`,
        amount_value: custPrice,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["travel-bookings"] });
      setOpenModal(false);
      toast.success("Travel booking & driver assignment created successfully!");
      setForm({
        passenger_name: "",
        phone: "",
        email: "",
        travel_type: "Group Outstation Bus",
        vehicle_type: "32-Seater Luxury AC Bus",
        origin: "Guwahati Paltan Bazar",
        destination: "",
        departure_date: new Date().toISOString().slice(0, 10),
        return_date: "",
        passengers_count: "1",
        customer_price: 20000,
        agency_cost: 15000,
        payment_status: "Paid",
        agency_payment_status: "Pending",
        assigned_agency: "Royal Wheels & Tours",
        assigned_driver: "Rajesh Sharma",
        driver_phone: "+91 98200 45678",
        vehicle_number: "AS-01-BK-9921",
        trip_status: "Assigned to Driver",
        notes: "",
      });
    },
    onError: (e: any) => toast.error(e.message || "Failed to create booking"),
  });

  const updateAssignment = useMutation({
    mutationFn: async () => {
      if (!selectedBookingForAssign) return;
      return api.put(`/travel/bookings/${selectedBookingForAssign.id || selectedBookingForAssign.booking_ref}`, {
        assigned_agency: assignForm.assigned_agency,
        assigned_driver: assignForm.assigned_driver,
        driver_phone: assignForm.driver_phone,
        vehicle_number: assignForm.vehicle_number,
        trip_status: assignForm.trip_status,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["travel-bookings"] });
      setOpenAssignModal(false);
      toast.success("Agency & Driver relationships updated successfully!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to update assignment"),
  });

  const deleteBooking = useMutation({
    mutationFn: async (id: number | string) => api.del(`/travel/bookings/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["travel-bookings"] });
      toast.success("Booking deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openQuickAssign = (booking: any) => {
    setSelectedBookingForAssign(booking);
    setAssignForm({
      assigned_agency: booking.assigned_agency || "Royal Wheels & Tours",
      agency_contact: booking.agency_contact || "",
      assigned_driver: booking.assigned_driver || "Rajesh Sharma",
      driver_phone: booking.driver_phone || "",
      vehicle_number: booking.vehicle_number || "",
      trip_status: booking.trip_status || "Assigned to Driver",
    });
    setOpenAssignModal(true);
  };

  // Financial aggregates
  const totalCustomerBilled = (bookings || []).reduce(
    (sum: number, b: any) => sum + (Number(b.customer_price || b.amount_value) || 0),
    0
  );
  const totalAgencyCost = (bookings || []).reduce(
    (sum: number, b: any) => sum + (Number(b.agency_cost) || 0),
    0
  );
  const totalAdminMargin = (bookings || []).reduce(
    (sum: number, b: any) =>
      sum + (Number(b.admin_margin) || (Number(b.customer_price || b.amount_value) || 0) - (Number(b.agency_cost) || 0)),
    0
  );

  const profitMarginPercent = totalCustomerBilled > 0
    ? ((totalAdminMargin / totalCustomerBilled) * 100).toFixed(1)
    : "0";

  // Filtered list
  const filtered = (bookings || []).filter((b: any) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.passenger_name?.toLowerCase().includes(q) ||
      b.booking_ref?.toLowerCase().includes(q) ||
      b.destination?.toLowerCase().includes(q) ||
      b.assigned_driver?.toLowerCase().includes(q) ||
      b.assigned_agency?.toLowerCase().includes(q);

    const matchType =
      filterType === "all" ||
      b.travel_type?.toLowerCase().includes(filterType.toLowerCase());

    const matchStatus =
      filterStatus === "all" ||
      b.trip_status?.toLowerCase().includes(filterStatus.toLowerCase());

    return matchSearch && matchType && matchStatus;
  });

  const liveProfit = Number(form.customer_price || 0) - Number(form.agency_cost || 0);
  const liveMarginPercent = form.customer_price > 0
    ? ((liveProfit / Number(form.customer_price)) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6 pb-16">
      {/* ─── Header ─── */}
      <PageHeader
        title="Uniquesta Travel Bookings & Fleet Dispatch"
        description="Simple travel operations hub: Add travelers, assign bus drivers & partner agencies, and control middleman profit margins."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-slate-300 bg-white text-slate-800 hover:bg-slate-100 font-bold shadow-sm text-xs"
            >
              <Link to="/driver-portal">
                <Bus className="mr-1.5 h-3.5 w-3.5 text-[#E52E20]" />
                Driver Portal
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-slate-300 bg-white text-slate-800 hover:bg-slate-100 font-bold shadow-sm text-xs"
            >
              <Link to="/traveler-portal">
                <Ticket className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                Traveler Portal
              </Link>
            </Button>
            <Button
              onClick={() => {
                resetDriverForm();
                setOpenAddDriverModal(true);
              }}
              variant="outline"
              className="rounded-xl border-red-200 bg-red-50/60 text-[#E52E20] hover:bg-red-100 font-bold shadow-sm text-xs"
            >
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              + Add Bus Driver
            </Button>
            <Button
              onClick={() => setOpenModal(true)}
              className="rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-bold shadow-sm text-xs"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Travel Booking
            </Button>
          </div>
        }
      />

      {/* ─── Metric Strip: Middleman & Operations ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-[#E2E8F0] shadow-sm bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-[#0A1628]">
                {bookings?.length || 0}
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">
                Total Bookings
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Active passenger trips
              </div>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-[#0A1628]">
              <Bus className="h-6 w-6 text-[#0A1628]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#E2E8F0] shadow-sm bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-blue-700">
                ₹ {totalCustomerBilled.toLocaleString("en-IN")}
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">
                Customer Billed Price
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Total fare charged to customers
              </div>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-700">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#E2E8F0] shadow-sm bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-amber-700">
                ₹ {totalAgencyCost.toLocaleString("en-IN")}
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">
                Agency / Driver Cost
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Wholesale payouts to operators
              </div>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-amber-700">
              <Briefcase className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-200 shadow-sm bg-emerald-50/40">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-emerald-800">
                +₹ {totalAdminMargin.toLocaleString("en-IN")}
              </div>
              <div className="text-xs font-bold text-emerald-900 mt-0.5 flex items-center gap-1">
                <span>Admin Profit Margin</span>
                <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0 h-4">
                  {profitMarginPercent}%
                </Badge>
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                Customer Price - Agency Cost
              </div>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <TrendingUp className="h-6 w-6 text-emerald-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Main Tabs ─── */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="bookings" className="rounded-lg font-semibold text-xs">
            📋 All Bookings & Middleman Margins ({bookings.length})
          </TabsTrigger>
          <TabsTrigger value="relationships" className="rounded-lg font-semibold text-xs">
            🤝 Agency & Driver Relationships
          </TabsTrigger>
          <TabsTrigger value="fleet" className="rounded-lg font-semibold text-xs">
            🚍 Bus & Fleet Directory ({drivers.length})
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 1: ALL BOOKINGS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <TabsContent value="bookings" className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search passenger, driver, destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl border-slate-200 bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[160px] rounded-xl border-slate-200 bg-white text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Travel Types</SelectItem>
                  <SelectItem value="Bus">Bus & Coach</SelectItem>
                  <SelectItem value="Cab">Intercity Cab</SelectItem>
                  <SelectItem value="Tour">Outstation Tour</SelectItem>
                  <SelectItem value="Airport">Airport Transfer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px] rounded-xl border-slate-200 bg-white text-xs">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Assigned">Assigned to Driver</SelectItem>
                  <SelectItem value="Trip">On Trip / Started</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bookings Table */}
          <Card className="rounded-2xl border-[#E2E8F0] shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Ref / Passenger</th>
                    <th className="px-4 py-3.5">Route & Date</th>
                    <th className="px-4 py-3.5">Assigned Agency & Driver</th>
                    <th className="px-4 py-3.5">Middleman Pricing (Margin)</th>
                    <th className="px-4 py-3.5">Trip Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        Loading travel bookings...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400">
                        No travel bookings found. Click &quot;New Travel Booking&quot; to add one!
                      </td>
                    </tr>
                  ) : (
                    filtered.map((b: any) => {
                      const custPrice = Number(b.customer_price || b.amount_value) || 0;
                      const agCost = Number(b.agency_cost) || 0;
                      const margin = Number(b.admin_margin) || (custPrice - agCost);
                      const isComplete = b.trip_status === "Completed";
                      const isOnTrip = b.trip_status === "On Trip" || b.trip_status === "Trip Started";

                      return (
                        <tr key={b.id || b.booking_ref} className="hover:bg-slate-50/70 transition-colors">
                          {/* Passenger */}
                          <td className="px-5 py-4">
                            <div className="font-mono text-[11px] font-bold text-slate-500">
                              {b.booking_ref}
                            </div>
                            <div className="font-bold text-slate-900 text-sm mt-0.5">
                              {b.passenger_name}
                            </div>
                            <div className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1.5">
                              <span>📞 {b.phone}</span>
                              <span>•</span>
                              <span>{b.passengers_count || 1} Pax</span>
                            </div>
                          </td>

                          {/* Route & Date */}
                          <td className="px-4 py-4">
                            <div className="font-semibold text-slate-800">
                              {b.origin} ➔ {b.destination}
                            </div>
                            <div className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              <span>{b.departure_date}</span>
                              {b.return_date && <span> to {b.return_date}</span>}
                            </div>
                            <Badge variant="secondary" className="mt-1 text-[10px] font-normal bg-slate-100 text-slate-700">
                              {b.travel_type || "Bus & Fleet"}
                            </Badge>
                          </td>

                          {/* Assigned Agency & Driver (The core relationship requirement) */}
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              {/* Partner Agency */}
                              <div className="flex items-center gap-1.5">
                                <Handshake className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                <span className="font-bold text-slate-800">
                                  {b.assigned_agency || "Direct In-house"}
                                </span>
                              </div>

                              {/* Assigned Driver */}
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <Bus className="h-3.5 w-3.5 text-[#E52E20] shrink-0" />
                                <span className="font-semibold text-slate-900">
                                  {b.assigned_driver || "Unassigned"}
                                </span>
                                {b.vehicle_number && (
                                  <span className="font-mono text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                                    {b.vehicle_number}
                                  </span>
                                )}
                              </div>

                              {b.driver_phone && (
                                <div className="text-[10px] text-slate-500 pl-5">
                                  Driver: {b.driver_phone}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Middleman Pricing */}
                          <td className="px-4 py-4">
                            <div className="space-y-0.5">
                              <div className="text-slate-900 font-bold text-xs">
                                Charged: ₹ {custPrice.toLocaleString("en-IN")}
                              </div>
                              <div className="text-slate-500 text-[11px]">
                                Agency Cost: ₹ {agCost.toLocaleString("en-IN")}
                              </div>
                              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                                Margin: +₹ {margin.toLocaleString("en-IN")}
                              </div>
                            </div>
                          </td>

                          {/* Trip Status */}
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <div>
                                {isOnTrip ? (
                                  <Badge className="bg-amber-500 text-white font-semibold animate-pulse text-[11px]">
                                    🚗 On Trip
                                  </Badge>
                                ) : isComplete ? (
                                  <Badge className="bg-emerald-600 text-white font-semibold text-[11px]">
                                    ✅ Completed
                                  </Badge>
                                ) : b.assigned_driver && b.assigned_driver !== "Unassigned" ? (
                                  <Badge className="bg-blue-600 text-white font-semibold text-[11px]">
                                    📋 Assigned to Driver
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-slate-600 border-slate-300 text-[11px]">
                                    {b.trip_status || "Confirmed"}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Payment: <span className="font-semibold text-slate-700">{b.payment_status || "Confirmed"}</span>
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openQuickAssign(b)}
                                className="h-8 rounded-lg text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-100"
                              >
                                <Edit className="h-3.5 w-3.5 mr-1" />
                                Reassign
                              </Button>

                              <Button
                                asChild
                                size="sm"
                                variant="ghost"
                                className="h-8 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50"
                              >
                                <Link to="/driver-portal">
                                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                  Driver
                                </Link>
                              </Button>

                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  if (confirm("Delete this booking?")) {
                                    deleteBooking.mutate(b.id || b.booking_ref);
                                  }
                                }}
                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
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
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 2: RELATIONSHIPS MANAGER */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <TabsContent value="relationships" className="space-y-4">
          <Card className="rounded-2xl border-slate-200 bg-white p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Middleman Network: Agencies, Drivers & Margins
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  See which partner agencies handle your trips, which bus drivers are dispatched, and your middleman profit on each.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-300 font-bold text-xs"
              >
                <Link to="/driver-portal">
                  <Bus className="mr-1.5 h-3.5 w-3.5 text-[#E52E20]" />
                  Open Live Driver View
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(agencies || []).map((agency: any) => {
                const agencyBookings = (bookings || []).filter(
                  (b: any) => b.assigned_agency?.toLowerCase() === agency.name?.toLowerCase()
                );
                const agencyRevenue = agencyBookings.reduce((sum: number, b: any) => sum + (Number(b.customer_price) || 0), 0);
                const agencyCost = agencyBookings.reduce((sum: number, b: any) => sum + (Number(b.agency_cost) || 0), 0);
                const agencyMargin = agencyRevenue - agencyCost;

                return (
                  <Card key={agency.id || agency.name} className="rounded-xl border-slate-200 p-4 bg-slate-50/50">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Handshake className="h-4 w-4 text-blue-600" />
                          <h4 className="font-bold text-sm text-slate-900">{agency.name}</h4>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span>📍 {agency.city || "Guwahati"}</span>
                          <span>•</span>
                          <span>📞 {agency.phone}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-800">
                        {agency.commission_tier || "Partner"}
                      </Badge>
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200 text-center text-xs">
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Trips</div>
                        <div className="font-bold text-slate-800 text-sm mt-0.5">{agencyBookings.length}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Cost Paid</div>
                        <div className="font-bold text-amber-700 text-sm mt-0.5">₹ {agencyCost.toLocaleString("en-IN")}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Your Profit</div>
                        <div className="font-bold text-emerald-700 text-sm mt-0.5">+₹ {agencyMargin.toLocaleString("en-IN")}</div>
                      </div>
                    </div>

                    {/* Active Trips under this Agency */}
                    {agencyBookings.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Assigned Trips & Drivers:</div>
                        {agencyBookings.slice(0, 3).map((ab: any) => (
                          <div key={ab.booking_ref} className="text-xs bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                            <span className="font-semibold text-slate-800 truncate max-w-[180px]">{ab.passenger_name}</span>
                            <span className="text-[11px] text-slate-600">🚍 {ab.assigned_driver}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 3: BUS & DRIVER FLEET (SUPERADMIN MANAGEMENT) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <TabsContent value="fleet" className="space-y-4">
          {/* Fleet Header & Superadmin Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-red-50 text-[#E52E20] flex items-center justify-center font-black">
                  <Bus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                    Bus Drivers & Fleet Captains Directory
                  </h3>
                  <p className="text-xs text-slate-500">
                    Register bus drivers, configure mobile login PINs, manage vehicles, and dispatch fleet trips.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={() => {
                  resetDriverForm();
                  setOpenAddDriverModal(true);
                }}
                className="w-full sm:w-auto rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-bold text-xs shadow-md shadow-red-900/20"
              >
                <UserPlus className="mr-1.5 h-4 w-4" />
                + Add Bus Driver
              </Button>
            </div>
          </div>

          {/* Search & Status Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search driver name, phone, plate..."
                value={fleetSearch}
                onChange={(e) => setFleetSearch(e.target.value)}
                className="pl-9 rounded-xl border-slate-200 bg-white text-xs h-10"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
              <Select value={fleetStatusFilter} onValueChange={setFleetStatusFilter}>
                <SelectTrigger className="w-[150px] rounded-xl border-slate-200 bg-white text-xs h-10">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Available">Available Only</SelectItem>
                  <SelectItem value="On Trip">On Trip Only</SelectItem>
                  <SelectItem value="Off Duty">Off Duty Only</SelectItem>
                </SelectContent>
              </Select>

              <Badge variant="outline" className="rounded-xl border-slate-200 bg-white text-slate-600 font-semibold px-3 py-1.5 text-xs">
                {
                  (drivers || []).filter((d: any) => {
                    const q = fleetSearch.toLowerCase().trim();
                    const matchQ = !q || d.name?.toLowerCase().includes(q) || d.phone?.toLowerCase().includes(q) || d.vehicle_number?.toLowerCase().includes(q);
                    const matchS = fleetStatusFilter === "all" || d.status?.toLowerCase() === fleetStatusFilter.toLowerCase();
                    return matchQ && matchS;
                  }).length
                } Drivers
              </Badge>
            </div>
          </div>

          {/* Drivers Grid */}
          {(() => {
            const filteredDrivers = (drivers || []).filter((driver: any) => {
              const q = fleetSearch.toLowerCase().trim();
              const matchQ =
                !q ||
                driver.name?.toLowerCase().includes(q) ||
                driver.phone?.toLowerCase().includes(q) ||
                driver.vehicle_number?.toLowerCase().includes(q) ||
                driver.vehicle_type?.toLowerCase().includes(q);

              const matchS =
                fleetStatusFilter === "all" ||
                driver.status?.toLowerCase() === fleetStatusFilter.toLowerCase();

              return matchQ && matchS;
            });

            if (filteredDrivers.length === 0) {
              return (
                <Card className="rounded-2xl border-dashed border-2 border-slate-200 bg-slate-50/50 p-8 text-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-red-100 text-[#E52E20] flex items-center justify-center mx-auto font-black text-xl">
                    <Bus className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">No Fleet Drivers Found</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {fleetSearch
                        ? `No drivers matched your search for "${fleetSearch}".`
                        : "There are currently no bus drivers in the system. Add your first driver now."}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      resetDriverForm();
                      setOpenAddDriverModal(true);
                    }}
                    className="rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white text-xs font-bold"
                  >
                    <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                    + Add New Bus Driver
                  </Button>
                </Card>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDrivers.map((driver: any) => {
                  const driverAssignedTrips = (bookings || []).filter(
                    (b: any) => b.assigned_driver?.toLowerCase() === driver.name?.toLowerCase()
                  );

                  const isAvailable = driver.status?.toLowerCase() === "available";
                  const isOnTrip = driver.status?.toLowerCase() === "on trip";

                  return (
                    <Card
                      key={driver.id || driver.name}
                      className="rounded-2xl border-slate-200 bg-white p-5 shadow-sm space-y-3 hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      {/* Top Header: Driver Name, Rating, Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-10 w-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                            <Bus className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                              {driver.name}
                            </h4>
                            <a
                              href={`tel:${driver.phone}`}
                              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 truncate"
                            >
                              <Phone className="h-3 w-3 text-slate-400" />
                              {driver.phone}
                            </a>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <Badge
                            className={`text-[10px] font-semibold border ${
                              isAvailable
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isOnTrip
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full mr-1 ${
                                isAvailable
                                  ? "bg-emerald-500"
                                  : isOnTrip
                                  ? "bg-amber-500"
                                  : "bg-slate-400"
                              }`}
                            />
                            {driver.status || "Available"}
                          </Badge>
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                            ★ {driver.rating || "4.8"}
                          </span>
                        </div>
                      </div>

                      {/* Vehicle Details Box */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                          <span>Assigned Vehicle</span>
                          <span className="text-slate-500 font-normal">{driver.experience || "5 years exp"}</span>
                        </div>
                        <div className="font-bold text-slate-900 flex items-center justify-between">
                          <span className="truncate pr-2">{driver.vehicle_type}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-[11px] bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                            Plate: {driver.vehicle_number}
                          </span>
                          {driver.agency && (
                            <span className="text-[10px] text-slate-500 font-medium truncate max-w-[130px]">
                              {driver.agency}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Driver Portal Login Info Box */}
                      <div className="p-2.5 rounded-xl bg-slate-950 text-white text-xs space-y-1 border border-slate-800">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          <span className="flex items-center gap-1">
                            <KeyRound className="h-3 w-3 text-amber-400" />
                            Driver Portal Login
                          </span>
                          <span className="text-emerald-400 font-mono">ACTIVE</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono pt-0.5">
                          <span className="text-slate-300 truncate max-w-[170px]">
                            Mob: {driver.phone}
                          </span>
                          <span className="text-amber-300 font-bold bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                            PIN: {driver.pin || "1234"}
                          </span>
                        </div>
                      </div>

                      {/* Assigned Trips Counter */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="text-slate-500">Assigned Trips:</span>
                        <span className="font-bold text-slate-900">
                          {driverAssignedTrips.length} {driverAssignedTrips.length === 1 ? "Trip" : "Trips"}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center gap-1.5">
                        <Button
                          onClick={() => openEditDriver(driver)}
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-xl text-xs font-semibold border-slate-200 hover:bg-slate-50"
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1 text-slate-600" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove driver ${driver.name} from the fleet?`)) {
                              deleteDriverMutation.mutate(driver.id);
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="h-9 px-2.5 rounded-xl border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200"
                          title="Delete Driver"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-xl text-xs font-semibold border-slate-300 hover:border-[#E52E20] hover:text-[#E52E20]"
                        >
                          <Link to="/driver-portal">
                            Portal ➔
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            );
          })()}
        </TabsContent>
      </Tabs>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* DIALOG: NEW TRAVEL BOOKING & RELATIONSHIP ASSIGNMENT */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Bus className="h-5 w-5 text-[#E52E20]" />
              New Travel Booking & Middleman Margin
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Add traveler details, configure customer price vs. agency cost to lock your profit, and assign the bus driver.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* ─── SECTION 1: Traveler / Customer Details ─── */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pb-1 border-b">
                <span>1. Traveler / Customer Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <Label className="text-xs">Traveler / Passenger Name *</Label>
                  <Input
                    placeholder="e.g. Aman Barman / St. Xavier Group"
                    value={form.passenger_name}
                    onChange={(e) => setForm({ ...form, passenger_name: e.target.value })}
                    className="mt-1 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Passenger Phone *</Label>
                  <Input
                    placeholder="e.g. +91 98640 12345"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Pickup Location (Origin) *</Label>
                  <Input
                    placeholder="e.g. Paltan Bazar / Airport / Hotel"
                    value={form.origin}
                    onChange={(e) => setForm({ ...form, origin: e.target.value })}
                    className="mt-1 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Drop Destination *</Label>
                  <Input
                    placeholder="e.g. Shillong, Kaziranga, Cherrapunjee"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    className="mt-1 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Travel Date</Label>
                  <Input
                    type="date"
                    value={form.departure_date}
                    onChange={(e) => setForm({ ...form, departure_date: e.target.value })}
                    className="mt-1 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Number of Travelers / Seats</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.passengers_count}
                    onChange={(e) => setForm({ ...form, passengers_count: e.target.value })}
                    className="mt-1 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* ─── SECTION 2: Middleman Pricing & Profit ─── */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  2. Admin Middleman Pricing & Profit
                </span>
                <Badge className="bg-emerald-600 text-white text-[10px]">
                  Auto-Calculated Margin
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <Label className="text-xs font-semibold text-slate-800">
                    Price to Charge Customer (₹) *
                  </Label>
                  <Input
                    type="number"
                    placeholder="25000"
                    value={form.customer_price}
                    onChange={(e) => setForm({ ...form, customer_price: Number(e.target.value) })}
                    className="mt-1 rounded-xl text-xs font-bold"
                  />
                  <div className="text-[10px] text-slate-400 mt-0.5">What the customer pays you</div>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-800">
                    Cost Paid to Agency / Driver (₹) *
                  </Label>
                  <Input
                    type="number"
                    placeholder="18000"
                    value={form.agency_cost}
                    onChange={(e) => setForm({ ...form, agency_cost: Number(e.target.value) })}
                    className="mt-1 rounded-xl text-xs font-bold"
                  />
                  <div className="text-[10px] text-slate-400 mt-0.5">Wholesale cost to transport operator</div>
                </div>
              </div>

              {/* Profit Visual Highlight */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-700">
                    Your Middleman Profit (Margin)
                  </div>
                  <div className="text-lg font-black text-emerald-800 mt-0.5">
                    +₹ {liveProfit.toLocaleString("en-IN")}
                  </div>
                </div>
                <Badge className="bg-emerald-700 text-white font-bold text-xs py-1 px-2.5">
                  {liveMarginPercent}% Net Margin
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <Label className="text-xs">Customer Payment Status</Label>
                  <Select
                    value={form.payment_status}
                    onValueChange={(v) => setForm({ ...form, payment_status: v })}
                  >
                    <SelectTrigger className="mt-1 rounded-xl text-xs">
                      <SelectValue placeholder="Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">100% Paid Online</SelectItem>
                      <SelectItem value="Partial">Partial Advance Paid</SelectItem>
                      <SelectItem value="Cash on Drop">Cash to be Paid to Driver on Drop</SelectItem>
                      <SelectItem value="Pending">Payment Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Agency Payout Status</Label>
                  <Select
                    value={form.agency_payment_status}
                    onValueChange={(v) => setForm({ ...form, agency_payment_status: v })}
                  >
                    <SelectTrigger className="mt-1 rounded-xl text-xs">
                      <SelectValue placeholder="Agency Payout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending Completion</SelectItem>
                      <SelectItem value="Partial">Advance Released</SelectItem>
                      <SelectItem value="Paid">Fully Paid to Agency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ─── SECTION 3: Relationship Assignment (Agency & Driver) ─── */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pb-1 border-b">
                <span>3. Assign Partner Agency & Bus Driver</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <Label className="text-xs">Assign Partner Agency</Label>
                  <Select
                    value={form.assigned_agency}
                    onValueChange={(v) => setForm({ ...form, assigned_agency: v })}
                  >
                    <SelectTrigger className="mt-1 rounded-xl text-xs">
                      <SelectValue placeholder="Select Agency" />
                    </SelectTrigger>
                    <SelectContent>
                      {(agencies || []).map((a: any) => (
                        <SelectItem key={a.id || a.name} value={a.name}>
                          {a.name} ({a.city || "Partner"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Assign Driver / Bus Captain</Label>
                  <Select
                    value={form.assigned_driver}
                    onValueChange={handleDriverSelect}
                  >
                    <SelectTrigger className="mt-1 rounded-xl text-xs">
                      <SelectValue placeholder="Select Driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {(drivers || []).map((d: any) => (
                        <SelectItem key={d.id || d.name} value={d.name}>
                          {d.name} ({d.vehicle_type?.split(" ")[0]} · {d.vehicle_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Driver Phone Number</Label>
                  <Input
                    placeholder="+91 98200 45678"
                    value={form.driver_phone}
                    onChange={(e) => setForm({ ...form, driver_phone: e.target.value })}
                    className="mt-1 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs">Bus / Vehicle Plate Number</Label>
                  <Input
                    placeholder="e.g. AS-01-BK-9921"
                    value={form.vehicle_number}
                    onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })}
                    className="mt-1 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Notes / Special Instructions for Driver</Label>
                <Input
                  placeholder="e.g. 6:30 AM sharp pickup, AC required, elderly passengers."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setOpenModal(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={() => createBooking.mutate()}
              disabled={createBooking.isPending || !form.passenger_name || !form.destination}
              className="rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-bold text-xs shadow-sm"
            >
              {createBooking.isPending ? "Creating Booking..." : "Create & Dispatch Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* QUICK REASSIGN MODAL */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Dialog open={openAssignModal} onOpenChange={setOpenAssignModal}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              Reassign Driver & Partner Agency
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Change the agency or bus driver assigned to {selectedBookingForAssign?.passenger_name} ({selectedBookingForAssign?.booking_ref}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div>
              <Label className="text-xs">Partner Agency</Label>
              <Select
                value={assignForm.assigned_agency}
                onValueChange={(v) => setAssignForm({ ...assignForm, assigned_agency: v })}
              >
                <SelectTrigger className="mt-1 rounded-xl text-xs">
                  <SelectValue placeholder="Select Agency" />
                </SelectTrigger>
                <SelectContent>
                  {(agencies || []).map((a: any) => (
                    <SelectItem key={a.id || a.name} value={a.name}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Assigned Bus Driver / Driver</Label>
              <Select
                value={assignForm.assigned_driver}
                onValueChange={handleAssignDriverSelect}
              >
                <SelectTrigger className="mt-1 rounded-xl text-xs">
                  <SelectValue placeholder="Select Driver" />
                </SelectTrigger>
                <SelectContent>
                  {(drivers || []).map((d: any) => (
                    <SelectItem key={d.id || d.name} value={d.name}>
                      {d.name} ({d.vehicle_type?.split(" ")[0]} · {d.vehicle_number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Driver Phone</Label>
                <Input
                  value={assignForm.driver_phone}
                  onChange={(e) => setAssignForm({ ...assignForm, driver_phone: e.target.value })}
                  className="mt-1 rounded-xl text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Vehicle Plate</Label>
                <Input
                  value={assignForm.vehicle_number}
                  onChange={(e) => setAssignForm({ ...assignForm, vehicle_number: e.target.value })}
                  className="mt-1 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Trip Status</Label>
              <Select
                value={assignForm.trip_status}
                onValueChange={(v) => setAssignForm({ ...assignForm, trip_status: v })}
              >
                <SelectTrigger className="mt-1 rounded-xl text-xs">
                  <SelectValue placeholder="Trip Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Booking Confirmed">Booking Confirmed</SelectItem>
                  <SelectItem value="Assigned to Driver">Assigned to Driver</SelectItem>
                  <SelectItem value="On Trip">On Trip / Ride In Progress</SelectItem>
                  <SelectItem value="Completed">Trip Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenAssignModal(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={() => updateAssignment.mutate()}
              disabled={updateAssignment.isPending}
              className="rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-bold text-xs"
            >
              {updateAssignment.isPending ? "Updating..." : "Save Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* DIALOG 3: REGISTER NEW BUS DRIVER & FLEET CAPTAIN */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Dialog open={openAddDriverModal} onOpenChange={setOpenAddDriverModal}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-red-100 text-[#E52E20] flex items-center justify-center">
                <Bus className="h-5 w-5" />
              </div>
              <span>Register New Bus Driver & Fleet Captain</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Add a new captain to the fleet, assign their vehicle, and configure mobile Driver Portal login access.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              createDriverMutation.mutate();
            }}
            className="space-y-4 py-2"
          >
            {/* Captain Basic Info */}
            <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <UserPlus className="h-3.5 w-3.5 text-[#E52E20]" />
                1. Captain Personal & Contact Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Driver Full Name *</Label>
                  <Input
                    placeholder="e.g. Ramesh Kalita"
                    value={driverForm.name}
                    onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                    required
                    className="mt-1 rounded-xl text-xs bg-white"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Mobile Number (Login ID) *</Label>
                  <Input
                    type="tel"
                    placeholder="e.g. +91 98540 88776"
                    value={driverForm.phone}
                    onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                    required
                    className="mt-1 rounded-xl text-xs bg-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Used to log into the mobile driver portal
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold">Email Address (Optional)</Label>
                <Input
                  type="email"
                  placeholder="e.g. ramesh.driver@uniquesta.com"
                  value={driverForm.email}
                  onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })}
                  className="mt-1 rounded-xl text-xs bg-white"
                />
              </div>
            </div>

            {/* Login Credentials & PIN */}
            <div className="space-y-2 p-3.5 bg-amber-50/70 rounded-xl border border-amber-200">
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-amber-600" />
                2. Driver Portal Login PIN
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <Label className="text-xs font-semibold text-amber-950">Driver PIN / Password *</Label>
                  <Input
                    placeholder="e.g. 1234 or driver123"
                    value={driverForm.pin}
                    onChange={(e) => setDriverForm({ ...driverForm, pin: e.target.value })}
                    className="mt-1 rounded-xl text-xs bg-white font-mono"
                    required
                  />
                </div>
                <div className="text-[11px] text-amber-800 leading-relaxed bg-white p-2.5 rounded-lg border border-amber-200">
                  The driver will log into <strong>/driver-login</strong> using their mobile number and this PIN to see today&apos;s assignments.
                </div>
              </div>
            </div>

            {/* Vehicle & Fleet Info */}
            <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Bus className="h-3.5 w-3.5 text-[#E52E20]" />
                3. Vehicle & Fleet Assignment
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Assigned Vehicle Type *</Label>
                  <Select
                    value={driverForm.vehicle_type}
                    onValueChange={(v) => setDriverForm({ ...driverForm, vehicle_type: v })}
                  >
                    <SelectTrigger className="mt-1 rounded-xl text-xs bg-white">
                      <SelectValue placeholder="Select Vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="32-Seater Luxury AC Bus">32-Seater Luxury AC Bus</SelectItem>
                      <SelectItem value="45-Seater Semi-Sleeper Coach">45-Seater Semi-Sleeper Coach</SelectItem>
                      <SelectItem value="Force Traveller (17-Seater)">Force Traveller (17-Seater)</SelectItem>
                      <SelectItem value="Force Traveller (26-Seater)">Force Traveller (26-Seater)</SelectItem>
                      <SelectItem value="Toyota Innova Crysta (7-Seater)">Toyota Innova Crysta (7-Seater)</SelectItem>
                      <SelectItem value="Tata Winger AC (12-Seater)">Tata Winger AC (12-Seater)</SelectItem>
                      <SelectItem value="Swift Dzire Sedan (4-Seater)">Swift Dzire Sedan (4-Seater)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Vehicle Plate / Reg No. *</Label>
                  <Input
                    placeholder="e.g. AS-01-BK-9921"
                    value={driverForm.vehicle_number}
                    onChange={(e) => setDriverForm({ ...driverForm, vehicle_number: e.target.value })}
                    required
                    className="mt-1 rounded-xl text-xs bg-white font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Agency / Partner Affiliation</Label>
                  <Select
                    value={driverForm.agency}
                    onValueChange={(v) => setDriverForm({ ...driverForm, agency: v })}
                  >
                    <SelectTrigger className="mt-1 rounded-xl text-xs bg-white">
                      <SelectValue placeholder="Select Agency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Direct Fleet">Uniquesta Direct Fleet</SelectItem>
                      {(agencies || []).map((ag: any) => (
                        <SelectItem key={ag.id || ag.name} value={ag.name}>
                          {ag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Driving Experience</Label>
                  <Input
                    placeholder="e.g. 6 years"
                    value={driverForm.experience}
                    onChange={(e) => setDriverForm({ ...driverForm, experience: e.target.value })}
                    className="mt-1 rounded-xl text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Duty Status</Label>
                  <Select
                    value={driverForm.status}
                    onValueChange={(v) => setDriverForm({ ...driverForm, status: v })}
                  >
                    <SelectTrigger className="mt-1 rounded-xl text-xs bg-white">
                      <SelectValue placeholder="Duty Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available for Dispatch</SelectItem>
                      <SelectItem value="On Trip">Currently On Trip</SelectItem>
                      <SelectItem value="Off Duty">Off Duty / Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Initial Rating (1 - 5)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={driverForm.rating}
                    onChange={(e) => setDriverForm({ ...driverForm, rating: Number(e.target.value) })}
                    className="mt-1 rounded-xl text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenAddDriverModal(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createDriverMutation.isPending}
                className="rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-bold text-xs shadow-md"
              >
                {createDriverMutation.isPending ? "Registering..." : "Register Driver & Enable Access ➔"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* DIALOG 4: EDIT BUS DRIVER DETAILS */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <Dialog open={openEditDriverModal} onOpenChange={setOpenEditDriverModal}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <Pencil className="h-4 w-4" />
              </div>
              <span>Edit Driver: {selectedDriverForEdit?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update contact info, assigned vehicle plate, duty status, or mobile login PIN.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateDriverMutation.mutate();
            }}
            className="space-y-4 py-2"
          >
            {/* Captain Basic Info */}
            <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-[#E52E20]" />
                Captain Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Driver Full Name *</Label>
                  <Input
                    value={editDriverForm.name}
                    onChange={(e) => setEditDriverForm({ ...editDriverForm, name: e.target.value })}
                    required
                    className="mt-1 rounded-xl text-xs bg-white"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Mobile Number *</Label>
                  <Input
                    type="tel"
                    value={editDriverForm.phone}
                    onChange={(e) => setEditDriverForm({ ...editDriverForm, phone: e.target.value })}
                    required
                    className="mt-1 rounded-xl text-xs bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Driver Portal PIN</Label>
                  <Input
                    value={editDriverForm.pin}
                    onChange={(e) => setEditDriverForm({ ...editDriverForm, pin: e.target.value })}
                    className="mt-1 rounded-xl text-xs bg-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500">PIN used for driver mobile terminal login</span>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Duty Status</Label>
                  <Select
                    value={editDriverForm.status}
                    onValueChange={(v) => setEditDriverForm({ ...editDriverForm, status: v })}
                  >
                    <SelectTrigger className="mt-1 rounded-xl text-xs bg-white">
                      <SelectValue placeholder="Duty Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="On Trip">On Trip</SelectItem>
                      <SelectItem value="Off Duty">Off Duty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Vehicle & Fleet Info */}
            <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Bus className="h-3.5 w-3.5 text-[#E52E20]" />
                Assigned Vehicle & Affiliation
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Assigned Vehicle Type</Label>
                  <Input
                    value={editDriverForm.vehicle_type}
                    onChange={(e) => setEditDriverForm({ ...editDriverForm, vehicle_type: e.target.value })}
                    required
                    className="mt-1 rounded-xl text-xs bg-white"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Vehicle Plate Number</Label>
                  <Input
                    value={editDriverForm.vehicle_number}
                    onChange={(e) => setEditDriverForm({ ...editDriverForm, vehicle_number: e.target.value })}
                    required
                    className="mt-1 rounded-xl text-xs bg-white font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold">Experience</Label>
                  <Input
                    value={editDriverForm.experience}
                    onChange={(e) => setEditDriverForm({ ...editDriverForm, experience: e.target.value })}
                    className="mt-1 rounded-xl text-xs bg-white"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Rating</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editDriverForm.rating}
                    onChange={(e) => setEditDriverForm({ ...editDriverForm, rating: Number(e.target.value) })}
                    className="mt-1 rounded-xl text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenEditDriverModal(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateDriverMutation.isPending}
                className="rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-bold text-xs"
              >
                {updateDriverMutation.isPending ? "Saving..." : "Save Changes ➔"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
