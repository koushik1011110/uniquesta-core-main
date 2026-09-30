import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { t as Button } from "./_ssr/button-Th46ikol.mjs";
import { t as api } from "./_ssr/api-06dRWXHB.mjs";
import { t as Badge } from "./_ssr/badge-h6Nj5OpU.mjs";
import { n as getUser } from "./_ssr/auth-CMDgS_mZ.mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { Bt as ArrowUpRight, Ct as ChevronRight, D as Plane, It as Building2, Q as Globe, Vt as ArrowRight, Z as GraduationCap, a as UserPlus, dt as Database, ht as Compass, nt as FileText, r as Users } from "./_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./_ssr/card-BpRCf_XK.mjs";
import { a as ResponsiveContainer, i as Area, n as YAxis, o as Tooltip, r as XAxis, t as AreaChart } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.index-BTCGe4TO.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/_app.index.tsx?tsr-split=component";
var admissionsTrend = [
	{
		month: "Apr",
		applications: 45,
		offers: 32
	},
	{
		month: "May",
		applications: 58,
		offers: 41
	},
	{
		month: "Jun",
		applications: 72,
		offers: 56
	},
	{
		month: "Jul",
		applications: 94,
		offers: 78
	},
	{
		month: "Aug",
		applications: 110,
		offers: 92
	},
	{
		month: "Sep",
		applications: 128,
		offers: 104
	},
	{
		month: "Oct",
		applications: 115,
		offers: 96
	},
	{
		month: "Nov",
		applications: 130,
		offers: 112
	},
	{
		month: "Dec",
		applications: 98,
		offers: 85
	},
	{
		month: "Jan",
		applications: 122,
		offers: 102
	},
	{
		month: "Feb",
		applications: 145,
		offers: 120
	},
	{
		month: "Mar",
		applications: 160,
		offers: 138
	}
];
var topDestinations = [
	{
		country: "United Kingdom",
		flag: "🇬🇧",
		count: "38%",
		color: "bg-[#E52E20]"
	},
	{
		country: "Canada",
		flag: "🇨🇦",
		count: "26%",
		color: "bg-[#0A0A0A]"
	},
	{
		country: "Australia",
		flag: "🇦🇺",
		count: "18%",
		color: "bg-[#DC2626]"
	},
	{
		country: "United States",
		flag: "🇺🇸",
		count: "12%",
		color: "bg-slate-700"
	},
	{
		country: "Germany & Europe",
		flag: "🇩🇪",
		count: "6%",
		color: "bg-slate-500"
	}
];
function DashboardPage() {
	const user = getUser();
	const { data: stats } = useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: async () => {
			try {
				const r = await api.get("/dashboard/stats");
				return r.data ?? r;
			} catch {
				return null;
			}
		}
	});
	const { data: recentStudents } = useQuery({
		queryKey: ["dashboard-recent-students"],
		queryFn: async () => {
			try {
				return (await api.get("/students?limit=5")).data ?? [];
			} catch {
				return [];
			}
		}
	});
	const studentCount = stats?.totalStudents ?? (recentStudents?.length || 6);
	const applicationCount = stats?.activeApplications ?? 6;
	const leadsCount = stats?.totalLeads ?? 9;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A0A0A] via-[#171717] to-[#0A0A0A] p-6 sm:p-8 text-white shadow-xl border border-[#E52E20]/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#E52E20]/20 blur-3xl" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 125,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "pointer-events-none absolute left-1/4 -bottom-16 h-48 w-48 rounded-full bg-red-600/10 blur-2xl" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 126,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-start gap-4 sm:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "h-16 w-16 shrink-0 rounded-full overflow-hidden bg-white shadow-lg p-0.5 border-2 border-white/30 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
									src: "/logo.png",
									alt: "UniQuesta International",
									className: "h-full w-full object-contain"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 132,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 131,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-wrap items-center gap-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
											className: "text-2xl font-black tracking-tight sm:text-3xl",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-white",
												children: "Uni"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 138,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-[#E52E20]",
												children: "Questa"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 139,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 137,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											variant: "outline",
											className: "border-white/30 bg-white/10 text-white font-serif tracking-wider uppercase text-[11px] font-bold",
											children: "INTERNATIONAL"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 141,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											variant: "outline",
											className: "hidden sm:inline-flex border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-[11px] font-medium items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 145,
												columnNumber: 19
											}, this), "Live DB: uniquesta_abroad"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 144,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 136,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-1 text-xs font-serif italic text-slate-300 tracking-wide",
									children: "Trusted Pathway to Global Success"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 150,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1.5 text-xs text-slate-400",
									children: [
										"Welcome,",
										" ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-semibold text-white",
											children: user?.name ?? "Mohammad Iqbal"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 156,
											columnNumber: 17
										}, this),
										" ",
										"· ",
										user?.branch ?? "Guwahati HQ",
										" (14 Branches Nationwide)"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 154,
									columnNumber: 15
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 135,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 129,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								asChild: true,
								className: "rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-semibold shadow-sm transition-all",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/students",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "mr-2 h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 168,
										columnNumber: 17
									}, this), "Student Admissions"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 167,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 166,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								asChild: true,
								variant: "outline",
								className: "rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/travel",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plane, { className: "mr-2 h-4 w-4 text-[#E52E20]" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 174,
										columnNumber: 17
									}, this), "Tours & Travels"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 173,
									columnNumber: 15
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 172,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 165,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 128,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 123,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl border-slate-200/80 shadow-sm hover:shadow-md transition-all",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid h-11 w-11 place-items-center rounded-xl bg-black text-white",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "h-5 w-5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 189,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 188,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowUpRight, { className: "h-3 w-3" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 192,
										columnNumber: 17
									}, this), " +12.4%"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 191,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 187,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-3xl font-black tracking-tight text-black",
										children: studentCount
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 196,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs font-bold text-slate-700 mt-0.5",
										children: "Total Enrolled Students"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 199,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[11px] text-slate-400 mt-1",
										children: "Active student admissions & lifecycle"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 202,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 195,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 186,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 185,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl border-slate-200/80 shadow-sm hover:shadow-md transition-all",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid h-11 w-11 place-items-center rounded-xl bg-[#E52E20] text-white",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "h-5 w-5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 214,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 213,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-flex items-center gap-1 text-[11px] font-semibold text-[#E52E20] bg-red-50 px-2 py-0.5 rounded-full border border-red-100",
									children: "In Progress"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 216,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 212,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-3xl font-black tracking-tight text-[#E52E20]",
										children: applicationCount
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 221,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs font-bold text-slate-700 mt-0.5",
										children: "Active Applications"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 224,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[11px] text-slate-400 mt-1",
										children: "Offers & visa processing"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 227,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 220,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 211,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 210,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl border-slate-200/80 shadow-sm hover:shadow-md transition-all",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid h-11 w-11 place-items-center rounded-xl bg-black text-white",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "h-5 w-5 text-white" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 239,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 238,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-flex items-center gap-1 text-[11px] font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full",
									children: "Tier-1 Partners"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 241,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 237,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-3xl font-black tracking-tight text-black",
										children: "482+"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 246,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs font-bold text-slate-700 mt-0.5",
										children: "University Partners"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 249,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[11px] text-slate-400 mt-1",
										children: "UK, US, Canada, Australia, EU"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 252,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 245,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 236,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 235,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl border-slate-200/80 shadow-sm hover:shadow-md transition-all",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid h-11 w-11 place-items-center rounded-xl bg-[#E52E20]/10 text-[#E52E20]",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(UserPlus, { className: "h-5 w-5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 264,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 263,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "inline-flex items-center gap-1 text-[11px] font-semibold text-[#E52E20] bg-red-50 px-2 py-0.5 rounded-full border border-red-100",
									children: "Active Pipeline"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 266,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 262,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-3xl font-black tracking-tight text-black",
										children: leadsCount
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 271,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs font-bold text-slate-700 mt-0.5",
										children: "Prospective Enquiries"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 274,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[11px] text-slate-400 mt-1",
										children: "Qualified counselor leads"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 277,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 270,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 261,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 260,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 183,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "rounded-2xl border-slate-200/80 shadow-sm lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "flex flex-row items-center justify-between pb-2 border-b border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
							className: "text-base font-bold text-black flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2.5 w-2.5 rounded-full bg-[#E52E20]" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 292,
								columnNumber: 17
							}, this), "Student Admissions Trajectory"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 291,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-slate-500",
							children: "Monthly application trend across 2026-2027 intakes"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 295,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 290,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-4 text-xs font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2.5 w-2.5 rounded-full bg-[#E52E20]" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 301,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-slate-600",
									children: "Applications"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 302,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 300,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "h-2.5 w-2.5 rounded-full bg-black" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 305,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-slate-600",
									children: "Offers"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 306,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 304,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 299,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 289,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "pt-6",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "h-64 w-full",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AreaChart, {
									data: admissionsTrend,
									margin: {
										top: 10,
										right: 10,
										left: -20,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("defs", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("linearGradient", {
											id: "uqRedGrad",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
												offset: "5%",
												stopColor: "#E52E20",
												stopOpacity: .35
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 321,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
												offset: "95%",
												stopColor: "#E52E20",
												stopOpacity: 0
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 322,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 320,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("linearGradient", {
											id: "uqBlackGrad",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
												offset: "5%",
												stopColor: "#000000",
												stopOpacity: .2
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 325,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("stop", {
												offset: "95%",
												stopColor: "#000000",
												stopOpacity: 0
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 326,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 324,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 319,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(XAxis, {
											dataKey: "month",
											tickLine: false,
											axisLine: false,
											fontSize: 12,
											stroke: "#94A3B8"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 329,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(YAxis, {
											tickLine: false,
											axisLine: false,
											fontSize: 12,
											stroke: "#94A3B8"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 330,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, { contentStyle: {
											backgroundColor: "#0A0A0A",
											borderRadius: "10px",
											border: "1px solid #262626",
											color: "#fff",
											fontSize: "12px"
										} }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 331,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Area, {
											type: "monotone",
											dataKey: "applications",
											stroke: "#E52E20",
											strokeWidth: 2.5,
											fillOpacity: 1,
											fill: "url(#uqRedGrad)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 338,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Area, {
											type: "monotone",
											dataKey: "offers",
											stroke: "#0A0A0A",
											strokeWidth: 2,
											fillOpacity: 1,
											fill: "url(#uqBlackGrad)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 339,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 313,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 312,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 311,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 310,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 288,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "rounded-2xl border-slate-200/80 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "pb-3 border-b border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
							className: "text-base font-bold text-black flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Globe, { className: "h-4 w-4 text-[#E52E20]" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 350,
								columnNumber: 15
							}, this), "Top Study Destinations"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 349,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-slate-500",
							children: "Student distribution by country"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 353,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 348,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "pt-5 space-y-4",
						children: [topDestinations.map((dest) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between text-xs font-semibold text-slate-700",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-base",
										children: dest.flag
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 361,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: dest.country }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 362,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 360,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-black font-bold",
									children: dest.count
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 364,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 359,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "h-2 w-full rounded-full bg-slate-100 overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: `h-full rounded-full ${dest.color}`,
									style: { width: dest.count }
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 367,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 366,
								columnNumber: 17
							}, this)]
						}, dest.country, true, {
							fileName: _jsxFileName,
							lineNumber: 358,
							columnNumber: 42
						}, this)), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "flex items-center gap-1 text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Compass, { className: "h-3.5 w-3.5 text-[#E52E20]" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 375,
									columnNumber: 17
								}, this), " 482 Global Partners"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 374,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/universities",
								className: "text-[#E52E20] font-semibold hover:underline flex items-center gap-1",
								children: ["View Universities ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 378,
									columnNumber: 35
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 377,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 373,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 357,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 347,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 286,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "rounded-2xl border-slate-200/80 shadow-sm lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
						className: "flex flex-row items-center justify-between pb-3 border-b border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
							className: "text-base font-bold text-black",
							children: "Recent Student Registrations"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 391,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-slate-500",
							children: [
								"Connected to MySQL database (",
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
									className: "text-[#E52E20]",
									children: "uniquesta_abroad"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 395,
									columnNumber: 46
								}, this),
								")"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 394,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 390,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							className: "text-xs text-[#E52E20] hover:text-[#C82114] hover:bg-red-50 font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/students",
								children: ["View All Students ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "ml-1 h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 400,
									columnNumber: 35
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 399,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 398,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 389,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "p-0",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
									className: "bg-slate-50 text-slate-600 font-semibold border-b border-slate-200",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
											className: "px-5 py-3.5",
											children: "Student"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 409,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
											className: "px-4 py-3.5",
											children: "Destination"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 410,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
											className: "px-4 py-3.5",
											children: "Target University"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 411,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
											className: "px-4 py-3.5",
											children: "Stage"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 412,
											columnNumber: 21
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 408,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 407,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", {
									className: "divide-y divide-slate-100",
									children: recentStudents && recentStudents.length > 0 ? recentStudents.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
										className: "hover:bg-slate-50/60 transition",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
												className: "px-5 py-3.5",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "font-bold text-black",
													children: s.name
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 418,
													columnNumber: 27
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "text-[11px] font-mono text-[#E52E20] font-semibold",
													children: s.code
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 419,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 417,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
												className: "px-4 py-3.5",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-semibold text-slate-800",
													children: s.country
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 422,
													columnNumber: 27
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "text-[11px] text-slate-500",
													children: s.course
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 423,
													columnNumber: 27
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 421,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
												className: "px-4 py-3.5 text-slate-700 font-medium",
												children: s.university
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 425,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
												className: "px-4 py-3.5",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-[#E52E20] border border-red-200",
													children: s.stage || "Active"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 429,
													columnNumber: 27
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 428,
												columnNumber: 25
											}, this)
										]
									}, s.code || s.id, true, {
										fileName: _jsxFileName,
										lineNumber: 416,
										columnNumber: 97
									}, this)) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
										colSpan: 4,
										className: "px-5 py-10 text-center text-slate-400",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-sm font-medium text-slate-600",
												children: "No student records found"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 435,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-xs text-slate-400 mt-1",
												children: "New student registrations will appear here."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 436,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												asChild: true,
												variant: "outline",
												size: "sm",
												className: "mt-3 text-xs border-[#E52E20] text-[#E52E20] hover:bg-red-50 font-semibold",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
													to: "/students",
													children: "Add Student"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 438,
													columnNumber: 27
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 437,
												columnNumber: 25
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 434,
										columnNumber: 23
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 433,
										columnNumber: 32
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 415,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 406,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 405,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 404,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 388,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl border-slate-200/80 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
							className: "pb-3 border-b border-slate-100",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-base font-bold text-black",
								children: "Quick Operations Hub"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 452,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-slate-500",
								children: "Direct access to core modules"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 455,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 451,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "pt-4 space-y-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/students",
									className: "flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#E52E20]/30 hover:bg-red-50/50 transition group",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid h-9 w-9 place-items-center rounded-lg bg-black text-white",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Users, { className: "h-4.5 w-4.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 463,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 462,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-xs font-bold text-black group-hover:text-[#E52E20] transition",
											children: "Student Admissions"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 466,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-[11px] text-slate-500",
											children: "Profiles, documents & lifecycle"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 469,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 465,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 461,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "h-4 w-4 text-slate-400 group-hover:text-[#E52E20] transition" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 474,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 460,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/travel",
									className: "flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#E52E20]/30 hover:bg-red-50/50 transition group",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid h-9 w-9 place-items-center rounded-lg bg-[#E52E20] text-white",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plane, { className: "h-4.5 w-4.5 text-white" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 480,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 479,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-xs font-bold text-black group-hover:text-[#E52E20] transition",
											children: "Tours & Travels"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 483,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-[11px] text-slate-500",
											children: "Flight bookings & tour packages"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 486,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 482,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 478,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "h-4 w-4 text-slate-400 group-hover:text-[#E52E20] transition" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 491,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 477,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/applications",
									className: "flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#E52E20]/30 hover:bg-red-50/50 transition group",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid h-9 w-9 place-items-center rounded-lg bg-black text-white",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "h-4.5 w-4.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 497,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 496,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-xs font-bold text-black group-hover:text-[#E52E20] transition",
											children: "Applications Tracker"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 500,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-[11px] text-slate-500",
											children: "Offers, admissions & stages"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 503,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 499,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 495,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "h-4 w-4 text-slate-400 group-hover:text-[#E52E20] transition" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 508,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 494,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/universities",
									className: "flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#E52E20]/30 hover:bg-red-50/50 transition group",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid h-9 w-9 place-items-center rounded-lg bg-[#E52E20] text-white",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "h-4.5 w-4.5 text-white" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 514,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 513,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-xs font-bold text-black group-hover:text-[#E52E20] transition",
											children: "Global Universities"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 517,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "text-[11px] text-slate-500",
											children: "Institutions, courses & tie-ups"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 520,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 516,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 512,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "h-4 w-4 text-slate-400 group-hover:text-[#E52E20] transition" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 525,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 511,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 459,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 450,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs text-slate-600 space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2 font-bold text-black",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Building2, { className: "h-4 w-4 text-[#E52E20]" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 533,
									columnNumber: 15
								}, this), "UniQuesta International"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 532,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-[11px] text-slate-500",
								children: "Guwahati HQ · Mumbai · Delhi NCR · Bengaluru · Hyderabad"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 536,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Database, { className: "h-3 w-3" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 540,
									columnNumber: 15
								}, this), "Database: MySQL (uniquesta_abroad) Active & Synced"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 539,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 531,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 449,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 386,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 121,
		columnNumber: 10
	}, this);
}
//#endregion
export { DashboardPage as component };
