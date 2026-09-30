import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as Button } from "./button-Th46ikol.mjs";
import { t as Input } from "./input-CWiOSw9Q.mjs";
import { t as api } from "./api-06dRWXHB.mjs";
import { t as Badge } from "./badge-h6Nj5OpU.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Vt as ArrowRight, u as Ticket, x as Search } from "../_libs/lucide-react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BpRCf_XK.mjs";
import { t as Label } from "./label-DPnTa5YU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/traveler-login-DWtPi6hh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/traveler-login.tsx?tsr-split=component";
function TravelerLoginPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({ phoneOrRef: "" });
	const sampleTravelers = [
		{
			label: "Aman Barman (Group of 14)",
			ref: "UQ-TRV-1001",
			phone: "+91 98640 12345",
			route: "Guwahati ➔ Kaziranga"
		},
		{
			label: "Pooja Sharma & Family",
			ref: "UQ-TRV-1002",
			phone: "+91 98201 99882",
			route: "Airport ➔ Hotel Vivanta"
		},
		{
			label: "St. Xavier College Excursion",
			ref: "UQ-TRV-1003",
			phone: "+91 94351 22331",
			route: "Guwahati ➔ Cherrapunjee"
		}
	];
	const handleLogin = async (e) => {
		e.preventDefault();
		if (!form.phoneOrRef.trim()) {
			toast.error("Please enter your mobile number or booking reference");
			return;
		}
		setLoading(true);
		try {
			const res = await api.post("/auth/traveler-login", {
				phone: form.phoneOrRef.trim(),
				booking_ref: form.phoneOrRef.trim()
			});
			const data = res.data ?? res;
			if (!data.token) throw new Error("No token received");
			localStorage.setItem("uniquesta_traveler_token", data.token);
			localStorage.setItem("uniquesta_traveler_user", JSON.stringify(data.traveler));
			toast.success(`Welcome, ${data.traveler.name}! Opening your ticket...`);
			navigate({ to: "/traveler-portal" });
		} catch (err) {
			toast.error(err.message || "No booking found with this phone number or reference");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-slate-950 flex flex-col justify-between text-white selection:bg-[#E52E20] selection:text-white font-sans antialiased overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "px-3.5 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/90 backdrop-blur sticky top-0 z-20",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2.5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shrink-0 shadow-md shadow-blue-950",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ticket, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 64,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 63,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "font-black text-sm sm:text-base tracking-tight leading-none truncate flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Uni", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[#E52E20]",
								children: "Questa"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 68,
								columnNumber: 24
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 68,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[9px] sm:text-[10px] bg-blue-500/20 text-blue-300 font-mono px-1.5 py-0.5 rounded border border-blue-500/30 shrink-0",
								children: "TRAVELER"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 69,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 67,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5",
							children: "E-Ticket & Boarding Pass"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 73,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 66,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 62,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-1.5 sm:gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						className: "text-slate-400 hover:text-white hover:bg-slate-800 text-xs px-2 sm:px-3 h-8 sm:h-9",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/driver-login",
							children: "Driver ➔"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 81,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 80,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						className: "border-slate-800 text-slate-300 hover:bg-slate-800 text-xs px-2.5 sm:px-3 h-8 sm:h-9 rounded-xl",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/login",
							children: "Admin"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 84,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 83,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 79,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 61,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "flex-1 flex items-center justify-center px-3.5 py-6 sm:p-6",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "w-full max-w-[420px] space-y-4 sm:space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur text-white overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
							className: "p-4 sm:p-6 space-y-1 pb-3 sm:pb-4 border-b border-slate-800/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
										className: "bg-blue-950/80 text-blue-300 border-blue-800 text-[10px] sm:text-[11px]",
										children: "Passenger Check-in"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 95,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] sm:text-[11px] text-slate-400 font-mono",
										children: "LIVE TICKET"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 98,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 94,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
									className: "text-xl sm:text-2xl font-black tracking-tight text-white pt-1",
									children: "Find Your Travel Booking"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 100,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
									className: "text-xs text-slate-400 leading-relaxed",
									children: "Enter your registered mobile number or Booking Reference (e.g. UQ-TRV-1001) to view driver and boarding details."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 103,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 93,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "p-4 sm:p-6 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
								onSubmit: handleLogin,
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs font-semibold text-slate-300",
										children: "Mobile Number OR Booking Reference (Ref #) *"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 111,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 115,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											placeholder: "e.g. +91 98640 12345 or UQ-TRV-1001",
											value: form.phoneOrRef,
											onChange: (e) => setForm({ phoneOrRef: e.target.value }),
											className: "pl-9 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm h-11 placeholder:text-slate-500 focus:border-blue-500",
											required: true
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 116,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 114,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 110,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "submit",
									disabled: loading,
									className: "w-full h-11 sm:h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-950/40 transition-all flex items-center justify-center gap-1.5",
									children: loading ? "Searching Your Ticket..." : "View My Trip & Driver Details ➔"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 122,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 109,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "pt-3 border-t border-slate-800 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Quick Test Check-in (1-Tap):" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 130,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-blue-400 font-normal",
										children: "Sample Tickets"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 131,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 129,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-2",
									children: sampleTravelers.map((st) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setForm({ phoneOrRef: st.ref }),
										className: "w-full text-left p-2.5 sm:p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 active:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs transition-all flex items-center justify-between group cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "min-w-0 pr-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "font-bold text-slate-200 group-hover:text-white flex items-center gap-1.5 truncate",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "truncate",
													children: st.label
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 139,
													columnNumber: 27
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-mono text-[9px] sm:text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800 shrink-0",
													children: st.ref
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 140,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 138,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate",
												children: st.route
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 144,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 137,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "h-7 w-7 rounded-lg bg-slate-800 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "h-3.5 w-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 149,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 148,
											columnNumber: 23
										}, this)]
									}, st.ref, true, {
										fileName: _jsxFileName,
										lineNumber: 134,
										columnNumber: 46
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 133,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 128,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 108,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 92,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 91,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 90,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
				className: "p-3.5 border-t border-slate-800/80 text-center text-[11px] sm:text-xs text-slate-500 bg-slate-950/80",
				children: ["Uniquesta Passenger Care 24x7 · Helpline: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
					href: "tel:+919820011111",
					className: "text-slate-300 font-bold hover:underline",
					children: "+91 98200 11111"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 161,
					columnNumber: 51
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 160,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 59,
		columnNumber: 10
	}, this);
}
//#endregion
export { TravelerLoginPage as component };
