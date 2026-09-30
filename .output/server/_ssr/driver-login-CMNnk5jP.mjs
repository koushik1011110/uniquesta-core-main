import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as Button } from "./button-Th46ikol.mjs";
import { t as Input } from "./input-CWiOSw9Q.mjs";
import { t as api } from "./api-06dRWXHB.mjs";
import { t as Badge } from "./badge-h6Nj5OpU.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ft as Bus, O as Phone, V as Lock } from "../_libs/lucide-react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BpRCf_XK.mjs";
import { t as Label } from "./label-DPnTa5YU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/driver-login-CMNnk5jP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/driver-login.tsx?tsr-split=component";
function DriverLoginPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		phone: "",
		password: ""
	});
	const handleLogin = async (e) => {
		e.preventDefault();
		if (!form.phone.trim()) {
			toast.error("Please enter your mobile number or name");
			return;
		}
		setLoading(true);
		try {
			const res = await api.post("/auth/driver-login", {
				phone: form.phone.trim(),
				password: form.password || "driver123"
			});
			const data = res.data ?? res;
			if (!data.token) throw new Error("No driver token returned");
			localStorage.setItem("uniquesta_driver_token", data.token);
			localStorage.setItem("uniquesta_driver_user", JSON.stringify(data.driver));
			toast.success(`Welcome back, Captain ${data.driver.name}!`);
			navigate({ to: "/driver-portal" });
		} catch (err) {
			toast.error(err.message || "Driver login failed. Please check credentials.");
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
						className: "h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#E52E20] flex items-center justify-center font-black text-white shrink-0 shadow-md shadow-red-950",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bus, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 49,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 48,
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
								lineNumber: 53,
								columnNumber: 24
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 53,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[9px] sm:text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0",
								children: "DRIVER"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 54,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 52,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5",
							children: "Fleet Operations"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 58,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 51,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 47,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-1.5 sm:gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						className: "text-slate-400 hover:text-white hover:bg-slate-800 text-xs px-2 sm:px-3 h-8 sm:h-9",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/traveler-login",
							children: "Traveler ➔"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 66,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 65,
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
							lineNumber: 69,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 68,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 64,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 46,
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
										className: "bg-red-950/80 text-red-300 border-red-800 text-[10px] sm:text-[11px]",
										children: "Driver Terminal Login"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 80,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[10px] sm:text-[11px] text-slate-400 font-mono",
										children: "AS-FLEET"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 83,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 79,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
									className: "text-xl sm:text-2xl font-black tracking-tight text-white pt-1",
									children: "Bus Driver & Fleet Portal"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 85,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, {
									className: "text-xs text-slate-400 leading-relaxed",
									children: "Log in to check today's assigned passengers, pickup locations, and start trips."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 88,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 78,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "p-4 sm:p-6 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
								onSubmit: handleLogin,
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs font-semibold text-slate-300",
											children: "Mobile Number OR Driver Name *"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 96,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Phone, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 100,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
												type: "tel",
												inputMode: "tel",
												placeholder: "Enter registered mobile number or name",
												value: form.phone,
												onChange: (e) => setForm({
													...form,
													phone: e.target.value
												}),
												className: "pl-9 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm h-11 placeholder:text-slate-500 focus:border-[#E52E20]",
												required: true
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 101,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 99,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 95,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center justify-between text-xs",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
												className: "font-semibold text-slate-300",
												children: "PIN / Password"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 110,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 109,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 113,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
												type: "password",
												placeholder: "Enter driver PIN or password",
												value: form.password,
												onChange: (e) => setForm({
													...form,
													password: e.target.value
												}),
												className: "pl-9 bg-slate-950 border-slate-700 text-white rounded-xl text-xs sm:text-sm h-11 placeholder:text-slate-500 focus:border-[#E52E20]"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 114,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 112,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 108,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										type: "submit",
										disabled: loading,
										className: "w-full h-11 sm:h-12 rounded-xl bg-[#E52E20] hover:bg-[#C82114] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-900/40 transition-all flex items-center justify-center gap-1.5",
										children: loading ? "Verifying Driver..." : "Login to Driver Portal ➔"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 121,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 94,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "pt-3 border-t border-slate-800/80 text-center",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[11px] text-slate-400",
									children: "Captain registration is managed centrally by Uniquesta Super Admin / Fleet Dispatch. If you need account credentials or password reset, contact fleet operations."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 128,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 127,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 93,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 77,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 76,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 75,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("footer", {
				className: "p-3.5 border-t border-slate-800/80 text-center text-[11px] sm:text-xs text-slate-500 bg-slate-950/80",
				children: ["Uniquesta Fleet Operations 24x7 · Driver Helpline: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
					href: "tel:+919820011111",
					className: "text-slate-300 font-bold hover:underline",
					children: "+91 98200 11111"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 139,
					columnNumber: 60
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 138,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 44,
		columnNumber: 10
	}, this);
}
//#endregion
export { DriverLoginPage as component };
