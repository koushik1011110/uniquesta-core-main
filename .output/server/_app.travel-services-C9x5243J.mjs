import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { t as Button } from "./_ssr/button-Th46ikol.mjs";
import { t as Input } from "./_ssr/input-CWiOSw9Q.mjs";
import { t as api } from "./_ssr/api-06dRWXHB.mjs";
import { t as Badge } from "./_ssr/badge-h6Nj5OpU.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { T as Plus, _ as ShieldCheck, bt as CircleCheck, jt as Car, pt as CreditCard, z as Luggage } from "./_libs/lucide-react.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { t as PageHeader } from "./_ssr/page-header-DRgCwu0n.mjs";
import { t as Card } from "./_ssr/card-BpRCf_XK.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./_ssr/dialog-BvRIEwxi.mjs";
import { t as Label } from "./_ssr/label-DPnTa5YU.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-C1idR5Ws.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.travel-services-C9x5243J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/_app.travel-services.tsx?tsr-split=component";
var serviceFeatures = [
	{
		icon: CreditCard,
		title: "Student Forex Cards",
		desc: "Zero mark-up multi-currency cards with locked exchange rates for UK (GBP), US (USD), Canada (CAD), Europe (EUR) & Australia (AUD).",
		badge: "Instant Reload",
		tone: "bg-[#0A1628]"
	},
	{
		icon: ShieldCheck,
		title: "Overseas Medical Insurance",
		desc: "100% compliant with university and embassy visa criteria. Covers cashless hospitalization, COVID-19, baggage & flight loss.",
		badge: "Visa Compliant",
		tone: "bg-[#E52E20]"
	},
	{
		icon: Luggage,
		title: "Extra Student Baggage",
		desc: "Exclusive airline tie-ups with Emirates, Air Canada, Singapore Airlines & British Airways for 23kg x 2 checked-in bags.",
		badge: "Up to 46 Kg",
		tone: "bg-[#D4A017]"
	},
	{
		icon: Car,
		title: "Airport Meet & Greet",
		desc: "Safe pre-arranged airport pickup from London Heathrow, Toronto Pearson, Melbourne Tullamarine directly to campus/dormitory.",
		badge: "Verified Drivers",
		tone: "bg-[#0F2040]"
	}
];
function TravelServicesPage() {
	const qc = useQueryClient();
	const [openModal, setOpenModal] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		student_name: "",
		phone: "",
		service_type: "Student Multi-Currency Forex Card",
		destination_country: "United Kingdom (GBP)",
		amount_val: "GBP £ 2,500",
		provider: "UniQuesta Partner Bank",
		status: "Active"
	});
	const { data: services = [], isLoading } = useQuery({
		queryKey: ["travel-services"],
		queryFn: async () => {
			try {
				const res = await api.get("/travel/services");
				return res.data ?? res ?? [];
			} catch {
				return [];
			}
		}
	});
	const createService = useMutation({
		mutationFn: async () => api.post("/travel/services", form),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["travel-services"] });
			setOpenModal(false);
			toast.success("Travel service request saved to database!");
			setForm({
				student_name: "",
				phone: "",
				service_type: "Student Multi-Currency Forex Card",
				destination_country: "United Kingdom (GBP)",
				amount_val: "GBP £ 2,500",
				provider: "UniQuesta Partner Bank",
				status: "Active"
			});
		},
		onError: (e) => toast.error(e.message || "Failed to submit request")
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: "Student Travel, Forex & Insurance",
				description: "Comprehensive pre-departure travel essentials for overseas university students",
				actions: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					onClick: () => setOpenModal(true),
					className: "rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-semibold shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "mr-2 h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 87,
						columnNumber: 13
					}, this), "New Service Request"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 86,
					columnNumber: 163
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 86,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: serviceFeatures.map((feat) => {
					const Icon = feat.icon;
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl border-[#E2E8F0] shadow-sm flex flex-col justify-between p-5",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: `grid h-11 w-11 place-items-center rounded-xl ${feat.tone} text-white`,
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-5 w-5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 99,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 98,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: "outline",
									className: "border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-700",
									children: feat.badge
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 101,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 97,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-4 text-sm font-bold text-[#0A1628]",
								children: feat.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 105,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-1 text-xs text-slate-500 leading-relaxed",
								children: feat.desc
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 106,
								columnNumber: 17
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 96,
							columnNumber: 15
						}, this)
					}, feat.title, false, {
						fileName: _jsxFileName,
						lineNumber: 95,
						columnNumber: 16
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 92,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "text-base font-bold text-[#0A1628]",
						children: "Active Student Service Requests"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 115,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs text-slate-500",
						children: [
							"Synced with MySQL (",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
								className: "text-[#E52E20]",
								children: "travel_services"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 119,
								columnNumber: 32
							}, this),
							")"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 118,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 114,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "rounded-2xl border-[#E2E8F0] shadow-sm overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
							className: "w-full text-left text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
								className: "bg-slate-50 text-slate-500 font-semibold border-b border-slate-200",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-5 py-3.5",
										children: "Request Ref"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 128,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3.5",
										children: "Student Name"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 129,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3.5",
										children: "Service Requested"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 130,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3.5",
										children: "Destination Country"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 131,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3.5",
										children: "Coverage / Load Value"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 132,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3.5",
										children: "Partner Provider"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 133,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3.5",
										children: "Status"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 134,
										columnNumber: 19
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 127,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 126,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", {
								className: "divide-y divide-slate-100",
								children: isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
									colSpan: 7,
									className: "text-center py-8 text-slate-400",
									children: "Loading travel service requests from database..."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 139,
									columnNumber: 21
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 138,
									columnNumber: 30
								}, this) : services.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
									colSpan: 7,
									className: "text-center py-8 text-slate-400",
									children: "No active requests. Click \"New Service Request\" to create one."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 143,
									columnNumber: 21
								}, this) }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 142,
									columnNumber: 51
								}, this) : services.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
									className: "hover:bg-slate-50/70 transition",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-5 py-3.5 font-mono font-bold text-[#E52E20]",
											children: s.req_code
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 147,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-4 py-3.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "font-bold text-[#0A1628]",
												children: s.student_name
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 151,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "text-[11px] text-slate-400",
												children: s.phone
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 152,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 150,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-4 py-3.5 font-medium text-slate-800",
											children: s.service_type
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 154,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-4 py-3.5 font-medium text-slate-600",
											children: s.destination_country
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 157,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-4 py-3.5 font-bold text-[#0A1628]",
											children: s.amount_val
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 160,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-4 py-3.5 text-slate-600",
											children: s.provider
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 163,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-4 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-3 w-3" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 168,
													columnNumber: 27
												}, this), s.status]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 167,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 166,
											columnNumber: 23
										}, this)
									]
								}, s.req_code || s.id, true, {
									fileName: _jsxFileName,
									lineNumber: 146,
									columnNumber: 52
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 137,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 124,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 123,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 113,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: openModal,
				onOpenChange: setOpenModal,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "sm:max-w-[480px] rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "text-lg font-bold text-[#0A1628] flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-5 w-5 text-[#E52E20]" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 184,
								columnNumber: 15
							}, this), "New Student Travel Service"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 183,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 182,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-3.5 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									className: "text-xs",
									children: "Student Full Name"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 191,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									placeholder: "e.g. Sneha Kulkarni",
									value: form.student_name,
									onChange: (e) => setForm({
										...form,
										student_name: e.target.value
									}),
									className: "mt-1 rounded-xl"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 192,
									columnNumber: 15
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 190,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Student Phone"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 200,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "+91 98XXX XXXXX",
										value: form.phone,
										onChange: (e) => setForm({
											...form,
											phone: e.target.value
										}),
										className: "mt-1 rounded-xl"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 201,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 199,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Destination Country"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 207,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "e.g. Canada / Germany",
										value: form.destination_country,
										onChange: (e) => setForm({
											...form,
											destination_country: e.target.value
										}),
										className: "mt-1 rounded-xl"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 208,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 206,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 198,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									className: "text-xs",
									children: "Service Type"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 216,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
									value: form.service_type,
									onValueChange: (val) => setForm({
										...form,
										service_type: val
									}),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
										className: "mt-1 rounded-xl",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 222,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 221,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Student Multi-Currency Forex Card",
											children: "Student Multi-Currency Forex Card"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 225,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Overseas Comprehensive Medical Insurance",
											children: "Overseas Comprehensive Medical Insurance"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 226,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Student Extra Baggage Allowance (23kg)",
											children: "Student Extra Baggage Allowance (23kg)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 227,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Airport Meet & Greet + Drop",
											children: "Airport Meet & Greet + Drop"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 228,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "International Student SIM & Data",
											children: "International Student SIM & Data"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 229,
											columnNumber: 19
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 224,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 217,
									columnNumber: 15
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 215,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Coverage / Load Value"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 236,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "e.g. CAD $3,000 / 12 Months",
										value: form.amount_val,
										onChange: (e) => setForm({
											...form,
											amount_val: e.target.value
										}),
										className: "mt-1 rounded-xl"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 237,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 235,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Partner Provider"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 243,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "e.g. HDFC Bank / Allianz",
										value: form.provider,
										onChange: (e) => setForm({
											...form,
											provider: e.target.value
										}),
										className: "mt-1 rounded-xl"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 244,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 242,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 234,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 189,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setOpenModal(false),
							className: "rounded-xl",
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 253,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: () => createService.mutate(),
							disabled: createService.isPending,
							className: "rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-semibold",
							children: createService.isPending ? "Submitting..." : "Save to Database"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 256,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 252,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 181,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 180,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 85,
		columnNumber: 10
	}, this);
}
//#endregion
export { TravelServicesPage as component };
