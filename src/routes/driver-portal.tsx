import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Bus,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  Navigation,
  DollarSign,
  AlertCircle,
  Car,
  LogOut,
  RefreshCw,
  Clock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/driver-portal")({
  head: () => ({
    meta: [
      { title: "Driver Trip Terminal · Uniquesta Travels" },
      { name: "description", content: "Mobile driver trip terminal and passenger boarding manager." },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" },
    ],
  }),
  component: StandaloneDriverPortalPage,
});

function StandaloneDriverPortalPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [driverUser, setDriverUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    const storedToken = localStorage.getItem("uniquesta_driver_token");
    const storedUser = localStorage.getItem("uniquesta_driver_user");

    if (!storedToken || !storedUser) {
      toast.info("Please login with your driver credentials");
      navigate({ to: "/driver-login" });
      return;
    }

    try {
      setToken(storedToken);
      setDriverUser(JSON.parse(storedUser));
    } catch {
      navigate({ to: "/driver-login" });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("uniquesta_driver_token");
    localStorage.removeItem("uniquesta_driver_user");
    toast.success("Driver logged out safely");
    navigate({ to: "/driver-login" });
  };

  // Fetch driver's trips from backend
  const { data: trips = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ["driver-my-trips", driverUser?.name],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch("/api/driver/my-trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load trips");
      return json.data || [];
    },
  });

  // Mutation to update trip status
  const updateTripStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string | number; status: string }) => {
      const res = await fetch(`/api/driver/trips/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update trip status");
      return json.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["driver-my-trips"] });
      toast.success(`Trip status updated to "${vars.status}"!`);
    },
    onError: (e: any) => toast.error(e.message || "Failed to update status"),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "On Trip":
      case "Trip Started":
        return (
          <Badge className="bg-amber-500 text-slate-950 font-black animate-pulse text-[11px] py-0.5 px-2">
            🚗 EN ROUTE / ON TRIP
          </Badge>
        );
      case "Assigned to Driver":
        return (
          <Badge className="bg-blue-600 text-white font-bold text-[11px] py-0.5 px-2">
            📋 PICKUP SCHEDULED
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-emerald-600 text-white font-bold text-[11px] py-0.5 px-2">
            ✅ COMPLETED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-slate-300 border-slate-700 text-[11px]">
            {status || "CONFIRMED"}
          </Badge>
        );
    }
  };

  if (!driverUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs sm:text-sm">
        Authenticating driver terminal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans antialiased selection:bg-[#E52E20] selection:text-white pb-safe overflow-x-hidden">
      {/* ─── Mobile Sticky App Bar ─── */}
      <header className="sticky top-0 z-30 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#E52E20] flex items-center justify-center font-bold text-white shrink-0 shadow-md">
            <Bus className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-xs sm:text-sm tracking-tight text-white truncate">
                Captain {driverUser.name}
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            </div>
            <div className="text-[10px] sm:text-xs text-amber-300 font-mono font-bold mt-1 truncate">
              {driverUser.vehicle_number || "AS-FLEET"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 h-8 sm:h-9 px-2 sm:px-3 rounded-xl text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 sm:mr-1 ${isFetching ? "animate-spin text-[#E52E20]" : ""}`} />
            <span className="hidden sm:inline">Sync</span>
          </Button>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-red-400 hover:bg-red-950/30 h-8 sm:h-9 px-2 sm:px-3 rounded-xl text-xs"
          >
            <LogOut className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* ─── Main Content (Mobile-First Card Flow) ─── */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3.5 py-4 sm:p-6 space-y-4">
        {/* Driver Quick Badge Strip */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 p-3.5 sm:p-4 border border-slate-800 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg shrink-0">
              🚍
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Bus / Van</div>
              <div className="text-xs sm:text-sm font-bold text-white truncate">
                {driverUser.vehicle_type || "Deluxe Commercial Bus"}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Trips</div>
            <div className="text-sm sm:text-base font-black text-[#E52E20]">{trips.length} Active</div>
          </div>
        </div>

        {/* Trips List Header */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span>Passenger Pickups ({trips.length})</span>
          </h2>
          <span className="text-[11px] text-slate-500">Tap buttons to Call & Navigate</span>
        </div>

        {/* Trips Cards */}
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800 text-xs sm:text-sm">
            Loading your trips from database...
          </div>
        ) : trips.length === 0 ? (
          <div className="rounded-2xl border-dashed border-2 border-slate-800 bg-slate-900/30 p-10 text-center text-white">
            <Bus className="h-10 w-10 text-slate-600 mx-auto mb-2.5" />
            <h3 className="text-sm sm:text-base font-bold text-slate-200">No Trips Assigned Right Now</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              You are all caught up! When admin assigns a new passenger pickup, it will appear here immediately.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip: any) => {
              const isEnRoute = trip.trip_status === "On Trip" || trip.trip_status === "Trip Started";
              const isCompleted = trip.trip_status === "Completed";
              const phoneClean = trip.phone?.replace(/[^0-9]/g, "");
              const isCashDue =
                trip.payment_status?.toLowerCase().includes("pending") ||
                trip.payment_status?.toLowerCase().includes("cash");

              return (
                <div
                  key={trip.id || trip.booking_ref}
                  className={`rounded-2xl transition-all shadow-xl overflow-hidden bg-slate-900 border ${
                    isEnRoute
                      ? "border-amber-500 ring-2 ring-amber-500/20"
                      : isCompleted
                      ? "border-emerald-800/80 bg-emerald-950/15"
                      : "border-slate-800"
                  }`}
                >
                  {/* Trip Card Top Ribbon */}
                  <div className="px-3.5 sm:px-5 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[11px] sm:text-xs font-black text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 shrink-0">
                        {trip.booking_ref}
                      </span>
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-300 truncate">
                        {trip.travel_type || "Passenger Trip"}
                      </span>
                    </div>
                    <div className="shrink-0">{getStatusBadge(trip.trip_status)}</div>
                  </div>

                  <div className="p-3.5 sm:p-5 space-y-3.5">
                    {/* ─── Route Flow (Mobile-Friendly Visual Dots) ─── */}
                    <div className="bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-slate-800 space-y-2.5">
                      {/* Pickup Point */}
                      <div className="flex items-start gap-2.5">
                        <div className="flex flex-col items-center mt-1">
                          <span className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                          <span className="w-0.5 h-6 bg-slate-800 my-0.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] uppercase font-bold text-emerald-400">
                            PICKUP LOCATION
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-white break-words">
                            {trip.origin || "Pickup Point"}
                          </div>
                        </div>
                      </div>

                      {/* Drop Destination */}
                      <div className="flex items-start gap-2.5">
                        <span className="h-3 w-3 rounded-full bg-[#E52E20] ring-4 ring-red-500/20 mt-1 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] uppercase font-bold text-[#E52E20]">
                            DROP DESTINATION
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-white break-words">
                            {trip.destination}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 font-semibold text-slate-300">
                          <Calendar className="h-3.5 w-3.5 text-blue-400" />
                          {trip.departure_date}
                          {trip.return_date ? ` to ${trip.return_date}` : ""}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          <Users className="h-3 w-3 text-slate-400" />
                          {trip.passengers_count || 1} Pax
                        </span>
                      </div>
                    </div>

                    {/* ─── Passenger & Cash Collection Callout ─── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Passenger Name & Phone */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Lead Passenger / Customer</div>
                        <div className="text-xs sm:text-sm font-black text-white mt-0.5 truncate">
                          {trip.passenger_name}
                        </div>
                        <div className="text-slate-400 text-xs font-mono mt-0.5">
                          {trip.phone}
                        </div>
                      </div>

                      {/* Driver Cash Instruction (High Visibility on Mobile) */}
                      <div className={`p-3 rounded-xl border ${
                        isCashDue
                          ? "bg-amber-950/30 border-amber-600/70 text-amber-200"
                          : "bg-emerald-950/30 border-emerald-700/60 text-emerald-200"
                      }`}>
                        <div className="text-[10px] uppercase font-black tracking-wider flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          {isCashDue ? "CASH TO COLLECT" : "ONLINE PAYMENT"}
                        </div>
                        <div className="text-xs sm:text-sm font-black mt-0.5">
                          {isCashDue
                            ? `Collect: ${trip.total_amount || "Cash on Drop"}`
                            : `Already Paid Online (${trip.payment_status || "Settled"})`}
                        </div>
                        <div className="text-[10px] opacity-75 mt-0.5">
                          {isCashDue ? "Take cash from passenger upon drop" : "Do NOT collect cash from traveler"}
                        </div>
                      </div>
                    </div>

                    {/* Driver Notes Alert if present */}
                    {trip.notes && (
                      <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Trip Note: </span>
                          <span>{trip.notes}</span>
                        </div>
                      </div>
                    )}

                    {/* ─── Touch Action Grid (Large Tap Targets for Fingers) ─── */}
                    <div className="pt-1 space-y-2">
                      {/* Primary Contact Buttons */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <Button
                          asChild
                          className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-md"
                        >
                          <a href={`tel:${trip.phone}`} className="flex items-center justify-center gap-1.5">
                            <Phone className="h-4 w-4" />
                            <span>Call Passenger</span>
                          </a>
                        </Button>

                        {phoneClean ? (
                          <Button
                            asChild
                            variant="outline"
                            className="h-11 rounded-xl border-emerald-700 bg-emerald-950/40 hover:bg-emerald-900/60 active:scale-[0.98] text-emerald-300 font-bold text-xs"
                          >
                            <a
                              href={`https://wa.me/${phoneClean}?text=Hello%20${encodeURIComponent(
                                trip.passenger_name
                              )},%20I%20am%20your%20Uniquesta%20Bus%20Captain%20(${encodeURIComponent(
                                driverUser.name
                              )}).%20I%20am%20ready%20for%20your%20trip%20to%20${encodeURIComponent(
                                trip.destination
                              )}.`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-center gap-1.5"
                            >
                              <MessageSquare className="h-4 w-4 text-emerald-400" />
                              <span>WhatsApp</span>
                            </a>
                          </Button>
                        ) : null}

                        <Button
                          asChild
                          variant="outline"
                          className="col-span-2 sm:col-span-1 h-11 rounded-xl border-slate-700 bg-slate-950 hover:bg-slate-800 active:scale-[0.98] text-slate-200 font-bold text-xs"
                        >
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${trip.origin} to ${trip.destination}`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1.5"
                          >
                            <Navigation className="h-4 w-4 text-blue-400" />
                            <span>Google Maps</span>
                          </a>
                        </Button>
                      </div>

                      {/* ─── Large Status Controller Buttons ─── */}
                      <div className="pt-1">
                        {trip.trip_status !== "On Trip" && trip.trip_status !== "Completed" && (
                          <Button
                            onClick={() =>
                              updateTripStatus.mutate({
                                id: trip.id || trip.booking_ref,
                                status: "On Trip",
                              })
                            }
                            disabled={updateTripStatus.isPending}
                            className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-950 flex items-center justify-center gap-2"
                          >
                            <Car className="h-4 w-4" />
                            <span>Start Pickup / Ride In Progress</span>
                          </Button>
                        )}

                        {trip.trip_status === "On Trip" && (
                          <Button
                            onClick={() =>
                              updateTripStatus.mutate({
                                id: trip.id || trip.booking_ref,
                                status: "Completed",
                              })
                            }
                            disabled={updateTripStatus.isPending}
                            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Mark Trip Completed ✅</span>
                          </Button>
                        )}

                        {trip.trip_status === "Completed" && (
                          <div className="w-full h-10 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            <span>Trip Successfully Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── Mobile Sticky Help Bar ─── */}
      <footer className="p-3 border-t border-slate-800/80 bg-slate-950 text-center text-[11px] text-slate-500">
        Emergency Dispatch: <a href="tel:+919820011111" className="text-white font-bold hover:underline">+91 98200 11111</a> · Uniquesta Tours & Travels
      </footer>
    </div>
  );
}
