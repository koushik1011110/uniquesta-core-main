import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Ticket,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  Navigation,
  DollarSign,
  Bus,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Printer,
  Car,
  Clock,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/traveler-portal")({
  head: () => ({
    meta: [
      { title: "My Travel Boarding Pass · Uniquesta Travels" },
      { name: "description", content: "Mobile digital boarding pass, live driver tracking, and trip itinerary." },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" },
    ],
  }),
  component: StandaloneTravelerPortalPage,
});

function StandaloneTravelerPortalPage() {
  const navigate = useNavigate();
  const [travelerUser, setTravelerUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    const storedToken = localStorage.getItem("uniquesta_traveler_token");
    const storedUser = localStorage.getItem("uniquesta_traveler_user");

    if (!storedToken || !storedUser) {
      toast.info("Please enter your booking reference or mobile number");
      navigate({ to: "/traveler-login" });
      return;
    }

    try {
      setToken(storedToken);
      setTravelerUser(JSON.parse(storedUser));
    } catch {
      navigate({ to: "/traveler-login" });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("uniquesta_traveler_token");
    localStorage.removeItem("uniquesta_traveler_user");
    toast.success("Logged out from traveler portal");
    navigate({ to: "/traveler-login" });
  };

  // Fetch traveler's bookings from backend
  const { data: trips = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ["traveler-my-trips", travelerUser?.phone, travelerUser?.name],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch("/api/traveler/my-trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load trips");
      return json.data || [];
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "On Trip":
      case "Trip Started":
        return (
          <Badge className="bg-amber-500 text-slate-950 font-black animate-pulse text-[10px] sm:text-xs py-0.5 px-2">
            🚗 DRIVER ON THE WAY
          </Badge>
        );
      case "Assigned to Driver":
        return (
          <Badge className="bg-blue-600 text-white font-bold text-[10px] sm:text-xs py-0.5 px-2">
            📋 DRIVER ASSIGNED
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-emerald-600 text-white font-bold text-[10px] sm:text-xs py-0.5 px-2">
            ✅ TRIP COMPLETED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-slate-300 border-slate-700 text-[10px] sm:text-xs">
            {status || "CONFIRMED"}
          </Badge>
        );
    }
  };

  if (!travelerUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs sm:text-sm">
        Loading your travel boarding pass...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans antialiased selection:bg-[#E52E20] selection:text-white pb-safe overflow-x-hidden">
      {/* ─── Mobile Sticky App Bar ─── */}
      <header className="sticky top-0 z-30 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shrink-0 shadow-md">
            <Ticket className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-black text-xs sm:text-sm tracking-tight text-white leading-none truncate">
              Uni<span className="text-[#E52E20]">Questa</span> Boarding Pass
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 truncate mt-1">
              Traveler: <span className="text-white font-bold">{travelerUser.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="sm"
            className="border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 h-8 sm:h-9 px-2 sm:px-3 rounded-xl text-xs hidden sm:inline-flex"
          >
            <Printer className="h-3.5 w-3.5 mr-1" /> Print
          </Button>

          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 h-8 sm:h-9 px-2 sm:px-3 rounded-xl text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 sm:mr-1 ${isFetching ? "animate-spin text-blue-500" : ""}`} />
            <span className="hidden sm:inline">Sync</span>
          </Button>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-red-400 hover:bg-red-950/30 h-8 sm:h-9 px-2 sm:px-3 rounded-xl text-xs"
          >
            <LogOut className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Exit</span>
          </Button>
        </div>
      </header>

      {/* ─── Main Traveler Content (Mobile-First Boarding Pass) ─── */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3.5 py-4 sm:p-6 space-y-4">
        {/* Welcome Greeting */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-950/90 via-slate-900 to-blue-950/90 p-4 sm:p-5 border border-blue-900/60 shadow-lg flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs text-blue-400 font-bold uppercase tracking-wider">
              Confirmed Booking Itinerary
            </span>
            <h1 className="text-base sm:text-xl font-black text-white truncate mt-0.5">
              Welcome, {travelerUser.name}!
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 truncate">
              Track your driver, route, and digital ticket pass below.
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xl shrink-0">
            🎟️
          </div>
        </div>

        {/* Trips / Boarding Passes */}
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800 text-xs sm:text-sm">
            Fetching your travel ticket from database...
          </div>
        ) : trips.length === 0 ? (
          <div className="rounded-2xl border-dashed border-2 border-slate-800 bg-slate-900/30 p-10 text-center text-white">
            <Ticket className="h-10 w-10 text-slate-600 mx-auto mb-2.5" />
            <h3 className="text-sm sm:text-base font-bold text-slate-200">No Active Bookings Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              We couldn&apos;t find an active booking under this phone number. Please check with your travel agent or booking manager.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {trips.map((trip: any) => {
              const driverPhoneClean = trip.driver_phone?.replace(/[^0-9]/g, "");
              const isCashDue =
                trip.payment_status?.toLowerCase().includes("pending") ||
                trip.payment_status?.toLowerCase().includes("cash");

              return (
                <div
                  key={trip.id || trip.booking_ref}
                  className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden divide-y divide-slate-800"
                >
                  {/* ─── Top Digital Pass Header ─── */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        E-TICKET / PNR
                      </div>
                      <div className="font-mono text-sm sm:text-base font-black text-white tracking-widest truncate">
                        {trip.booking_ref}
                      </div>
                    </div>
                    <div className="shrink-0">{getStatusBadge(trip.trip_status)}</div>
                  </div>

                  {/* ─── Route Flow (Mobile Timeline) ─── */}
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="bg-slate-950/80 p-3.5 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
                      {/* Pickup Point */}
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div className="flex flex-col items-center mt-1">
                          <span className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                          <span className="w-0.5 h-7 sm:h-8 bg-slate-800 my-0.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] uppercase font-bold text-emerald-400">
                            PICKUP SPOT (ORIGIN)
                          </div>
                          <div className="text-sm sm:text-base font-bold text-white break-words">
                            {trip.origin || "Pickup Point"}
                          </div>
                          <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                            Please report 15 mins before departure
                          </div>
                        </div>
                      </div>

                      {/* Drop Destination */}
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <span className="h-3 w-3 rounded-full bg-[#E52E20] ring-4 ring-red-500/20 mt-1 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] uppercase font-bold text-[#E52E20]">
                            DROP DESTINATION
                          </div>
                          <div className="text-sm sm:text-base font-bold text-white break-words">
                            {trip.destination}
                          </div>
                          <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                            {trip.travel_type || "Direct Travel Package"}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-semibold text-slate-200">
                          <Calendar className="h-3.5 w-3.5 text-blue-400" />
                          {trip.departure_date}
                          {trip.return_date ? ` to ${trip.return_date}` : ""}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          <Users className="h-3 w-3 text-slate-400" />
                          {trip.passengers_count || 1} {trip.passengers_count === 1 ? "Pax" : "Passengers"}
                        </span>
                      </div>
                    </div>

                    {/* ─── Assigned Bus Captain & Vehicle Card (Key Requirement) ─── */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-900/40 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <Bus className="h-4 w-4" />
                          <span>Assigned Bus Captain & Vehicle</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] text-amber-300 border-amber-500/40">
                          Verified Driver
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-0.5">
                        {/* Driver Name & Phone */}
                        <div>
                          <div className="text-slate-400 text-[10px] uppercase font-bold">Driver Name</div>
                          <div className="text-sm sm:text-base font-black text-white mt-0.5">
                            {trip.assigned_driver || "Assigned by Fleet Operations"}
                          </div>
                          {trip.driver_phone && (
                            <div className="text-slate-300 text-xs font-mono mt-0.5">
                              📞 {trip.driver_phone}
                            </div>
                          )}
                        </div>

                        {/* Vehicle & Plate */}
                        <div>
                          <div className="text-slate-400 text-[10px] uppercase font-bold">Bus Model & Number Plate</div>
                          <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                            {trip.vehicle_type || "Deluxe Commercial Bus"}
                          </div>
                          {trip.vehicle_number && (
                            <div className="font-mono text-amber-300 font-bold text-xs mt-0.5">
                              Plate: {trip.vehicle_number}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Driver Communication Touch Targets */}
                      {trip.driver_phone ? (
                        <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <Button
                            asChild
                            className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-md"
                          >
                            <a href={`tel:${trip.driver_phone}`} className="flex items-center justify-center gap-1.5">
                              <Phone className="h-4 w-4" />
                              <span>Call Driver</span>
                            </a>
                          </Button>

                          {driverPhoneClean ? (
                            <Button
                              asChild
                              variant="outline"
                              className="h-11 rounded-xl border-emerald-700 bg-emerald-950/40 hover:bg-emerald-900/60 active:scale-[0.98] text-emerald-300 font-bold text-xs"
                            >
                              <a
                                href={`https://wa.me/${driverPhoneClean}?text=Hello%20Captain%20${encodeURIComponent(
                                  trip.assigned_driver
                                )},%20I%20am%20passenger%20${encodeURIComponent(
                                  trip.passenger_name
                                )}%20for%20trip%20${trip.booking_ref}.`}
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
                              <span>View Route</span>
                            </a>
                          </Button>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-950 text-slate-400 text-xs text-center">
                          Driver contact details will be unlocked shortly before departure.
                        </div>
                      )}
                    </div>

                    {/* ─── Fare & Payment Summary ─── */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Total Fare Charged</div>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">
                          {trip.total_amount || `₹ ${trip.customer_price?.toLocaleString("en-IN")}`}
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Payment Status</div>
                        <div className="mt-0.5">
                          {isCashDue ? (
                            <Badge className="bg-amber-950 text-amber-300 border-amber-800 text-xs">
                              💵 Pay Cash to Driver on Drop: {trip.total_amount}
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-xs">
                              ✅ Fully Paid Online ({trip.payment_status || "Confirmed"})
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── Mobile Sticky Footer ─── */}
      <footer className="p-3.5 border-t border-slate-800/80 bg-slate-950 text-center text-[11px] sm:text-xs text-slate-500">
        Uniquesta Passenger Care 24x7 Helpline: <a href="tel:+919820011111" className="text-white font-bold hover:underline">+91 98200 11111</a> · care@uniquesta.com
      </footer>
    </div>
  );
}
