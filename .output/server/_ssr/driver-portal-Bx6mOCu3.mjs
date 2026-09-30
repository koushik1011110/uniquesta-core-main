import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as Button } from "./button-Th46ikol.mjs";
import { t as Badge } from "./badge-h6Nj5OpU.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { B as LogOut, F as Navigation, Ft as Bus, I as MessageSquare, Mt as Calendar, O as Phone, S as RefreshCw, bt as CircleCheck, jt as Car, r as Users, ut as DollarSign, xt as CircleAlert } from "../_libs/lucide-react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/driver-portal-Bx6mOCu3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/driver-portal.tsx?tsr-split=component";
function StandaloneDriverPortalPage() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [driverUser, setDriverUser] = (0, import_react.useState)(null);
	const [token, setToken] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
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
	const { data: trips = [], isLoading, isFetching, refetch } = useQuery({
		queryKey: ["driver-my-trips", driverUser?.name],
		enabled: !!token,
		queryFn: async () => {
			const res = await fetch("/api/driver/my-trips", { headers: { Authorization: `Bearer ${token}` } });
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to load trips");
			return json.data || [];
		}
	});
	const updateTripStatus = useMutation({
		mutationFn: async ({ id, status }) => {
			const res = await fetch(`/api/driver/trips/${id}/status`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ status })
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to update trip status");
			return json.data;
		},
		onSuccess: (_, vars) => {
			qc.invalidateQueries({ queryKey: ["driver-my-trips"] });
			toast.success(`Trip status updated to "${vars.status}"!`);
		},
		onError: (e) => toast.error(e.message || "Failed to update status")
	});
	const getStatusBadge = (status) => {
		switch (status) {
			case "On Trip":
			case "Trip Started": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
				className: "bg-amber-500 text-slate-950 font-black animate-pulse text-[11px] py-0.5 px-2",
				children: "🚗 EN ROUTE / ON TRIP"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 100,
				columnNumber: 16
			}, this);
			case "Assigned to Driver": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
				className: "bg-blue-600 text-white font-bold text-[11px] py-0.5 px-2",
				children: "📋 PICKUP SCHEDULED"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 104,
				columnNumber: 16
			}, this);
			case "Completed": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
				className: "bg-emerald-600 text-white font-bold text-[11px] py-0.5 px-2",
				children: "✅ COMPLETED"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 108,
				columnNumber: 16
			}, this);
			default: return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
				variant: "outline",
				className: "text-slate-300 border-slate-700 text-[11px]",
				children: status || "CONFIRMED"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 112,
				columnNumber: 16
			}, this);
		}
	};
	if (!driverUser) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs sm:text-sm",
		children: "Authenticating driver terminal..."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 118,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans antialiased selection:bg-[#E52E20] selection:text-white pb-safe overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "sticky top-0 z-30 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2 sm:gap-3 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#E52E20] flex items-center justify-center font-bold text-white shrink-0 shadow-md",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bus, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 127,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 126,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-1.5 leading-none",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-black text-xs sm:text-sm tracking-tight text-white truncate",
								children: ["Captain ", driverUser.name]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 131,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 134,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-[10px] sm:text-xs text-amber-300 font-mono font-bold mt-1 truncate",
							children: driverUser.vehicle_number || "AS-FLEET"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 136,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 125,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-1 sm:gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						onClick: () => refetch(),
						variant: "outline",
						size: "sm",
						className: "border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 h-8 sm:h-9 px-2 sm:px-3 rounded-xl text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RefreshCw, { className: `h-3.5 w-3.5 sm:mr-1 ${isFetching ? "animate-spin text-[#E52E20]" : ""}` }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 144,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "hidden sm:inline",
							children: "Sync"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 145,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 143,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						onClick: handleLogout,
						variant: "ghost",
						size: "sm",
						className: "text-slate-400 hover:text-red-400 hover:bg-red-950/30 h-8 sm:h-9 px-2 sm:px-3 rounded-xl text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "h-3.5 w-3.5 sm:mr-1" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 149,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "hidden sm:inline",
							children: "Logout"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 150,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 148,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 142,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 124,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "flex-1 max-w-3xl w-full mx-auto px-3.5 py-4 sm:p-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 p-3.5 sm:p-4 border border-slate-800 shadow-md flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-lg shrink-0",
								children: "🚍"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 160,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-[10px] font-bold uppercase tracking-wider text-slate-400",
									children: "Assigned Bus / Van"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 164,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-xs sm:text-sm font-bold text-white truncate",
									children: driverUser.vehicle_type || "Deluxe Commercial Bus"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 165,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 163,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 159,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-right shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-[10px] font-bold uppercase tracking-wider text-slate-400",
								children: "Total Trips"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 172,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-sm sm:text-base font-black text-[#E52E20]",
								children: [trips.length, " Active"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 173,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 171,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 158,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
								"Passenger Pickups (",
								trips.length,
								")"
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 180,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 179,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[11px] text-slate-500",
							children: "Tap buttons to Call & Navigate"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 182,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 178,
						columnNumber: 9
					}, this),
					isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "py-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800 text-xs sm:text-sm",
						children: "Loading your trips from database..."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 186,
						columnNumber: 22
					}, this) : trips.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-2xl border-dashed border-2 border-slate-800 bg-slate-900/30 p-10 text-center text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bus, { className: "h-10 w-10 text-slate-600 mx-auto mb-2.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 189,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "text-sm sm:text-base font-bold text-slate-200",
								children: "No Trips Assigned Right Now"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 190,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-slate-400 mt-1 max-w-xs mx-auto",
								children: "You are all caught up! When admin assigns a new passenger pickup, it will appear here immediately."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 191,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 188,
						columnNumber: 41
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-4",
						children: trips.map((trip) => {
							const isEnRoute = trip.trip_status === "On Trip" || trip.trip_status === "Trip Started";
							const isCompleted = trip.trip_status === "Completed";
							const phoneClean = trip.phone?.replace(/[^0-9]/g, "");
							const isCashDue = trip.payment_status?.toLowerCase().includes("pending") || trip.payment_status?.toLowerCase().includes("cash");
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: `rounded-2xl transition-all shadow-xl overflow-hidden bg-slate-900 border ${isEnRoute ? "border-amber-500 ring-2 ring-amber-500/20" : isCompleted ? "border-emerald-800/80 bg-emerald-950/15" : "border-slate-800"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "px-3.5 sm:px-5 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-mono text-[11px] sm:text-xs font-black text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 shrink-0",
											children: trip.booking_ref
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 204,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[11px] sm:text-xs font-semibold text-slate-300 truncate",
											children: trip.travel_type || "Passenger Trip"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 207,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 203,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "shrink-0",
										children: getStatusBadge(trip.trip_status)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 211,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 202,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "p-3.5 sm:p-5 space-y-3.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-slate-800 space-y-2.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex items-start gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "flex flex-col items-center mt-1",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 220,
															columnNumber: 27
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "w-0.5 h-6 bg-slate-800 my-0.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 221,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 219,
														columnNumber: 25
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "min-w-0 flex-1",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "text-[10px] uppercase font-bold text-emerald-400",
															children: "PICKUP LOCATION"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 224,
															columnNumber: 27
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "text-xs sm:text-sm font-bold text-white break-words",
															children: trip.origin || "Pickup Point"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 227,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 223,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 218,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex items-start gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-3 w-3 rounded-full bg-[#E52E20] ring-4 ring-red-500/20 mt-1 shrink-0" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 235,
														columnNumber: 25
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "min-w-0 flex-1",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "text-[10px] uppercase font-bold text-[#E52E20]",
															children: "DROP DESTINATION"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 237,
															columnNumber: 27
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "text-xs sm:text-sm font-bold text-white break-words",
															children: trip.destination
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 240,
															columnNumber: 27
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 236,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 234,
													columnNumber: 23
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "flex items-center gap-1 font-semibold text-slate-300",
														children: [
															/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "h-3.5 w-3.5 text-blue-400" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 248,
																columnNumber: 27
															}, this),
															trip.departure_date,
															trip.return_date ? ` to ${trip.return_date}` : ""
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 247,
														columnNumber: 25
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "flex items-center gap-1 font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800",
														children: [
															/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "h-3 w-3 text-slate-400" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 253,
																columnNumber: 27
															}, this),
															trip.passengers_count || 1,
															" Pax"
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 252,
														columnNumber: 25
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 246,
													columnNumber: 23
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 216,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "p-3 rounded-xl bg-slate-950 border border-slate-800",
												children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "text-[10px] uppercase font-bold text-slate-400",
														children: "Lead Passenger / Customer"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 263,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "text-xs sm:text-sm font-black text-white mt-0.5 truncate",
														children: trip.passenger_name
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 264,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "text-slate-400 text-xs font-mono mt-0.5",
														children: trip.phone
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 267,
														columnNumber: 25
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 262,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: `p-3 rounded-xl border ${isCashDue ? "bg-amber-950/30 border-amber-600/70 text-amber-200" : "bg-emerald-950/30 border-emerald-700/60 text-emerald-200"}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "text-[10px] uppercase font-black tracking-wider flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DollarSign, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 275,
															columnNumber: 27
														}, this), isCashDue ? "CASH TO COLLECT" : "ONLINE PAYMENT"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 274,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "text-xs sm:text-sm font-black mt-0.5",
														children: isCashDue ? `Collect: ${trip.total_amount || "Cash on Drop"}` : `Already Paid Online (${trip.payment_status || "Settled"})`
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 278,
														columnNumber: 25
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "text-[10px] opacity-75 mt-0.5",
														children: isCashDue ? "Take cash from passenger upon drop" : "Do NOT collect cash from traveler"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 281,
														columnNumber: 25
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 273,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 260,
											columnNumber: 21
										}, this),
										trip.notes && /* @__PURE__ */ (void 0)("div", {
											className: "p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 flex items-start gap-2",
											children: [/* @__PURE__ */ (void 0)(CircleAlert, { className: "h-4 w-4 text-amber-400 shrink-0 mt-0.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 289,
												columnNumber: 25
											}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("span", {
												className: "font-bold",
												children: "Trip Note: "
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 291,
												columnNumber: 27
											}, this), /* @__PURE__ */ (void 0)("span", { children: trip.notes }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 292,
												columnNumber: 27
											}, this)] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 290,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 288,
											columnNumber: 36
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "pt-1 space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
														asChild: true,
														className: "h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-md",
														children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
															href: `tel:${trip.phone}`,
															className: "flex items-center justify-center gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Phone, { className: "h-4 w-4" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 302,
																columnNumber: 29
															}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Call Passenger" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 303,
																columnNumber: 29
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 301,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 300,
														columnNumber: 25
													}, this),
													phoneClean ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
														asChild: true,
														variant: "outline",
														className: "h-11 rounded-xl border-emerald-700 bg-emerald-950/40 hover:bg-emerald-900/60 active:scale-[0.98] text-emerald-300 font-bold text-xs",
														children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
															href: `https://wa.me/${phoneClean}?text=Hello%20${encodeURIComponent(trip.passenger_name)},%20I%20am%20your%20Uniquesta%20Bus%20Captain%20(${encodeURIComponent(driverUser.name)}).%20I%20am%20ready%20for%20your%20trip%20to%20${encodeURIComponent(trip.destination)}.`,
															target: "_blank",
															rel: "noreferrer",
															className: "flex items-center justify-center gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageSquare, { className: "h-4 w-4 text-emerald-400" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 309,
																columnNumber: 31
															}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "WhatsApp" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 310,
																columnNumber: 31
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 308,
															columnNumber: 29
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 307,
														columnNumber: 39
													}, this) : null,
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
														asChild: true,
														variant: "outline",
														className: "col-span-2 sm:col-span-1 h-11 rounded-xl border-slate-700 bg-slate-950 hover:bg-slate-800 active:scale-[0.98] text-slate-200 font-bold text-xs",
														children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
															href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${trip.origin} to ${trip.destination}`)}`,
															target: "_blank",
															rel: "noreferrer",
															className: "flex items-center justify-center gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Navigation, { className: "h-4 w-4 text-blue-400" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 316,
																columnNumber: 29
															}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Google Maps" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 317,
																columnNumber: 29
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 315,
															columnNumber: 27
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 314,
														columnNumber: 25
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 299,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "pt-1",
												children: [
													trip.trip_status !== "On Trip" && trip.trip_status !== "Completed" && /* @__PURE__ */ (void 0)(Button, {
														onClick: () => updateTripStatus.mutate({
															id: trip.id || trip.booking_ref,
															status: "On Trip"
														}),
														disabled: updateTripStatus.isPending,
														className: "w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-950 flex items-center justify-center gap-2",
														children: [/* @__PURE__ */ (void 0)(Car, { className: "h-4 w-4" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 328,
															columnNumber: 29
														}, this), /* @__PURE__ */ (void 0)("span", { children: "Start Pickup / Ride In Progress" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 329,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 324,
														columnNumber: 96
													}, this),
													trip.trip_status === "On Trip" && /* @__PURE__ */ (void 0)(Button, {
														onClick: () => updateTripStatus.mutate({
															id: trip.id || trip.booking_ref,
															status: "Completed"
														}),
														disabled: updateTripStatus.isPending,
														className: "w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-950 flex items-center justify-center gap-2",
														children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "h-4 w-4" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 336,
															columnNumber: 29
														}, this), /* @__PURE__ */ (void 0)("span", { children: "Mark Trip Completed ✅" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 337,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 332,
														columnNumber: 60
													}, this),
													trip.trip_status === "Completed" && /* @__PURE__ */ (void 0)("div", {
														className: "w-full h-10 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5",
														children: [/* @__PURE__ */ (void 0)(CircleCheck, { className: "h-4 w-4 text-emerald-400" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 341,
															columnNumber: 29
														}, this), /* @__PURE__ */ (void 0)("span", { children: "Trip Successfully Completed" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 342,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 340,
														columnNumber: 62
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 323,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 297,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 214,
									columnNumber: 19
								}, this)]
							}, trip.id || trip.booking_ref, true, {
								fileName: _jsxFileName,
								lineNumber: 200,
								columnNumber: 18
							}, this);
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 194,
						columnNumber: 20
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 156,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
				className: "p-3 border-t border-slate-800/80 bg-slate-950 text-center text-[11px] text-slate-500",
				children: [
					"Emergency Dispatch: ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "tel:+919820011111",
						className: "text-white font-bold hover:underline",
						children: "+91 98200 11111"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 354,
						columnNumber: 29
					}, this),
					" · Uniquesta Tours & Travels"
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 353,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 122,
		columnNumber: 10
	}, this);
}
//#endregion
export { StandaloneDriverPortalPage as component };
