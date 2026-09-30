import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as Button } from "./button-Th46ikol.mjs";
import { t as Input } from "./input-CWiOSw9Q.mjs";
import { t as api } from "./api-06dRWXHB.mjs";
import { a as setToken, o as setUser } from "./auth-CMDgS_mZ.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ft as Bus, H as LoaderCircle, R as Mail, V as Lock, Vt as ArrowRight, _ as ShieldCheck, at as Eye, ot as EyeOff, u as Ticket } from "../_libs/lucide-react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BpRCf_XK.mjs";
import { t as Label } from "./label-DPnTa5YU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DW0odr9S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/login.tsx?tsr-split=component";
function LoginPage() {
	const navigate = useNavigate();
	const [show, setShow] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		email: "",
		password: ""
	});
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("all");
	const demoUsers = [
		{
			email: "admin@uniquesta.com",
			pass: "admin123",
			role: "CEO · Executive Sign-off",
			category: "executive",
			name: "Mohammad Iqbal",
			branch: "Guwahati HQ",
			tagColor: "bg-red-500/10 text-[#E52E20] border-red-500/20"
		},
		{
			email: "director@uniquesta.com",
			pass: "admin123",
			role: "Director · Operations",
			category: "executive",
			name: "Vivek Ramanathan",
			branch: "Guwahati HQ",
			tagColor: "bg-purple-500/10 text-purple-600 border-purple-500/20"
		},
		{
			email: "mumbai.admin@uniquesta.com",
			pass: "admin123",
			role: "Branch Admin · Manager",
			category: "admin",
			name: "Rahul Deshmukh",
			branch: "Mumbai · Andheri West",
			tagColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
		},
		{
			email: "delhi.admin@uniquesta.com",
			pass: "admin123",
			role: "Branch Admin",
			category: "admin",
			name: "Karan Mehta",
			branch: "Delhi NCR",
			tagColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
		},
		{
			email: "anjali.finance@uniquesta.com",
			pass: "staff123",
			role: "Finance · AP Lead",
			category: "staff",
			name: "Anjali Kapoor",
			branch: "Mumbai · under Rahul Deshmukh",
			tagColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
		},
		{
			email: "meera.counselor@uniquesta.com",
			pass: "staff123",
			role: "Employee Submitter",
			category: "staff",
			name: "Meera Shah",
			branch: "Mumbai · under Rahul Deshmukh",
			tagColor: "bg-blue-500/10 text-blue-600 border-blue-500/20"
		},
		{
			email: "harpreet.visa@uniquesta.com",
			pass: "staff123",
			role: "Visa Officer",
			category: "staff",
			name: "Harpreet Kaur",
			branch: "Delhi · under Karan Mehta",
			tagColor: "bg-amber-500/10 text-amber-600 border-amber-500/20"
		},
		{
			email: "rohan.travel@uniquesta.com",
			pass: "staff123",
			role: "Travel Coordinator",
			category: "staff",
			name: "Rohan Patil",
			branch: "Mumbai · under Rahul Deshmukh",
			tagColor: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
		}
	];
	const fillDemo = (email, pass) => setForm({
		email,
		password: pass
	});
	const handleLogin = async (e) => {
		e.preventDefault();
		if (!form.email || !form.password) {
			toast.error("Email and password required");
			return;
		}
		setLoading(true);
		try {
			const res = await api.post("/auth/login", form);
			const { user, token } = res.data ?? res;
			if (!token) throw new Error("No token returned");
			setToken(token);
			setUser(user);
			toast.success(`Welcome, ${user.name}!`);
			navigate({ to: "/" });
		} catch (err) {
			toast.error(err.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen bg-muted/40",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "hidden w-[48%] flex-col justify-between bg-gradient-to-br from-[#0A0A0A] via-[#18181B] to-[#0A0A0A] p-10 text-white border-r border-[#E52E20]/20 lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "h-12 w-12 shrink-0 rounded-full overflow-hidden bg-white shadow p-0.5 border border-white/30 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
							src: "/logo.png",
							alt: "UniQuesta Logo",
							className: "h-full w-full object-contain"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 122,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 121,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-xl font-black leading-none tracking-tight",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-white",
							children: "Uni"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 126,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[#E52E20]",
							children: "Questa"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 126,
							columnNumber: 56
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 125,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-[10px] font-serif font-bold tracking-widest uppercase text-slate-300 mt-0.5",
						children: "INTERNATIONAL"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 128,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 124,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 120,
					columnNumber: 11
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 119,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "inline-flex items-center gap-2 rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-xs text-red-300 backdrop-blur",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-3.5 w-3.5 text-[#E52E20]" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 136,
								columnNumber: 13
							}, this), " Trusted Pathway to Global Success"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 135,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "text-[32px] font-black leading-tight tracking-tight",
							children: "One unified platform for admissions & travel."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 138,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "max-w-[420px] text-sm leading-relaxed text-slate-300",
							children: [
								"14 branches, 482 universities, students & travel bookings — all in one secure login. Powered by MySQL database (",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
									className: "text-[#E52E20] font-mono",
									children: "uniquesta_abroad"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 142,
									columnNumber: 125
								}, this),
								")."
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 141,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex -space-x-2",
								children: [
									1,
									2,
									3
								].map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
									src: `https://api.dicebear.com/9.x/initials/svg?seed=user${i}`,
									alt: "",
									className: "h-8 w-8 rounded-full border-2 border-black"
								}, i, false, {
									fileName: _jsxFileName,
									lineNumber: 146,
									columnNumber: 35
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 145,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs text-slate-400",
								children: "Trusted across 14 branch teams"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 148,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 144,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 134,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-xs text-slate-500",
					children: "© 2026 UniQuesta International · Guwahati HQ"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 151,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 118,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex flex-1 items-center justify-center p-4 sm:p-6",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "w-full max-w-[420px]",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mb-6 flex items-center gap-3 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "h-11 w-11 shrink-0 rounded-full overflow-hidden bg-white shadow p-0.5 border border-slate-200 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
							src: "/logo.png",
							alt: "UniQuesta Logo",
							className: "h-full w-full object-contain"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 159,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 158,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "font-black text-lg leading-none",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-black",
							children: "Uni"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 163,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[#E52E20]",
							children: "Questa"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 163,
							columnNumber: 56
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 162,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-[10px] font-serif font-bold text-slate-700 tracking-wider",
						children: "INTERNATIONAL"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 165,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 161,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 157,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "rounded-2xl shadow-card overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "p-3 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-bold text-slate-800 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-4 w-4 text-[#E52E20]" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 173,
									columnNumber: 17
								}, this), " Admin Portal"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 172,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/driver-login",
										className: "text-slate-600 hover:text-[#E52E20] font-semibold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bus, { className: "h-3.5 w-3.5 text-amber-600" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 177,
											columnNumber: 19
										}, this), " Driver Login"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 176,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-slate-300",
										children: "|"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 179,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
										to: "/traveler-login",
										className: "text-slate-600 hover:text-blue-600 font-semibold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Ticket, { className: "h-3.5 w-3.5 text-blue-600" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 181,
											columnNumber: 19
										}, this), " Traveler Login"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 180,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 175,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 171,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-[22px]",
								children: "Welcome back"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 187,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardDescription, { children: "Login to your Uniquesta workspace" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 188,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 186,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
								onSubmit: handleLogin,
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											htmlFor: "email",
											children: "Email"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 193,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 195,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
												id: "email",
												type: "email",
												placeholder: "admin@uniquesta.com",
												className: "h-10 pl-9",
												value: form.email,
												onChange: (e) => setForm({
													...form,
													email: e.target.value
												}),
												autoComplete: "email"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 196,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 194,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 192,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
												htmlFor: "password",
												children: "Password"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 204,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
												to: "/login",
												className: "text-xs text-primary hover:underline",
												children: "Forgot?"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 205,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 203,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "relative",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 210,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
													id: "password",
													type: show ? "text" : "password",
													placeholder: "••••••••",
													className: "h-10 pl-9 pr-9",
													value: form.password,
													onChange: (e) => setForm({
														...form,
														password: e.target.value
													}),
													autoComplete: "current-password"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 211,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
													type: "button",
													onClick: () => setShow(!show),
													className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
													children: show ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { className: "h-4 w-4" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 216,
														columnNumber: 31
													}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-4 w-4" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 216,
														columnNumber: 64
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 215,
													columnNumber: 21
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 209,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 202,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										type: "submit",
										className: "h-10 w-full gap-2 rounded-xl",
										disabled: loading,
										children: [loading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 222,
											columnNumber: 30
										}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 222,
											columnNumber: 77
										}, this), loading ? "Signing in..." : "Sign in"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 221,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 191,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "my-5 flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-px flex-1 bg-border" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 228,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-[11px] uppercase tracking-wide text-muted-foreground font-semibold",
										children: "Test Role Logins (1-Click Fill)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 229,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-px flex-1 bg-border" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 232,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 227,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mb-3 flex items-center justify-center gap-1 rounded-lg bg-slate-100 p-1 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setRoleFilter("all"),
										className: `flex-1 rounded-md py-1 font-medium transition ${roleFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
										children: [
											"All (",
											demoUsers.length,
											")"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 237,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setRoleFilter("executive"),
										className: `flex-1 rounded-md py-1 font-medium transition ${roleFilter === "executive" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
										children: "CEO & Director"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 240,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setRoleFilter("admin"),
										className: `flex-1 rounded-md py-1 font-medium transition ${roleFilter === "admin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
										children: "Branch Admin"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 243,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => setRoleFilter("staff"),
										className: `flex-1 rounded-md py-1 font-medium transition ${roleFilter === "staff" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
										children: "Staff"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 246,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 236,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-2 max-h-[220px] overflow-y-auto pr-1",
								children: demoUsers.filter((u) => roleFilter === "all" || u.category === roleFilter).map((u) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									type: "button",
									onClick: () => fillDemo(u.email, u.pass),
									className: "flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 text-left transition hover:border-[#E52E20]/40 hover:bg-slate-50",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-800 border",
											children: u.name.split(" ").map((n) => n[0]).join("")
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 253,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center gap-1.5 flex-wrap",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "truncate text-xs font-bold text-slate-900",
													children: u.name
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 258,
													columnNumber: 27
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: `rounded px-1.5 py-0.2 text-[10px] font-semibold border ${u.tagColor}`,
													children: u.role
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 259,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 257,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "truncate text-[11px] text-slate-500",
												children: u.branch
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 263,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 256,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "shrink-0 text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded",
											children: u.pass
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 267,
											columnNumber: 23
										}, this)
									]
								}, u.email, true, {
									fileName: _jsxFileName,
									lineNumber: 252,
									columnNumber: 100
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 251,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-6 text-center text-xs text-muted-foreground",
								children: [
									"Protected by JWT + bcrypt.",
									" ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-medium text-foreground",
										children: "Without login, dashboard nahi khulega."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 275,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 273,
								columnNumber: 15
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 190,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 169,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 156,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 155,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 116,
		columnNumber: 10
	}, this);
}
//#endregion
export { LoginPage as component };
