import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { t as Button } from "./_ssr/button-Th46ikol.mjs";
import { t as Input } from "./_ssr/input-CWiOSw9Q.mjs";
import { t as api } from "./_ssr/api-06dRWXHB.mjs";
import { t as Badge } from "./_ssr/badge-h6Nj5OpU.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { L as MapPin, Mt as Calendar, T as Plus, Vt as ArrowRight, d as Star, ht as Compass } from "./_libs/lucide-react.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { t as PageHeader } from "./_ssr/page-header-DRgCwu0n.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-BpRCf_XK.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./_ssr/dialog-BvRIEwxi.mjs";
import { t as Label } from "./_ssr/label-DPnTa5YU.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-C1idR5Ws.mjs";
import { t as Textarea } from "./_ssr/textarea-CBLiJrex.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.travel-destinations-DItqpbOa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/_app.travel-destinations.tsx?tsr-split=component";
function TravelDestinationsPage() {
	const qc = useQueryClient();
	const [openNewModal, setOpenNewModal] = (0, import_react.useState)(false);
	const [openBookModal, setOpenBookModal] = (0, import_react.useState)(null);
	const [inquiryName, setInquiryName] = (0, import_react.useState)("");
	const [inquiryPhone, setInquiryPhone] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		country: "",
		duration: "6 Days / 5 Nights",
		category: "Holiday Package",
		price: "₹ 65,000",
		rating: "4.8",
		inclusions: "Direct Flights, 4-Star Hotels, Daily Breakfast, Guided Sightseeing, Visa Support",
		best_season: "All Year Round",
		badge: "Popular"
	});
	const { data: destinations = [], isLoading } = useQuery({
		queryKey: ["travel-destinations"],
		queryFn: async () => {
			try {
				const res = await api.get("/travel/destinations");
				return res.data ?? res ?? [];
			} catch {
				return [];
			}
		}
	});
	const createDestination = useMutation({
		mutationFn: async () => {
			return api.post("/travel/destinations", form);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["travel-destinations"] });
			setOpenNewModal(false);
			toast.success("New tour package published to database!");
			setForm({
				title: "",
				country: "",
				duration: "6 Days / 5 Nights",
				category: "Holiday Package",
				price: "₹ 65,000",
				rating: "4.8",
				inclusions: "Direct Flights, 4-Star Hotels, Daily Breakfast, Guided Sightseeing, Visa Support",
				best_season: "All Year Round",
				badge: "Popular"
			});
		},
		onError: (e) => toast.error(e.message || "Failed to publish package")
	});
	const handleBookInquiry = () => {
		if (!inquiryName) {
			toast.error("Please enter your name");
			return;
		}
		toast.success(`Inquiry for ${openBookModal?.title} submitted! Our travel desk will contact you.`);
		setOpenBookModal(null);
		setInquiryName("");
		setInquiryPhone("");
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: "Tour Destinations & Packages",
				description: "Curated international holiday packages, university campus edu-tours & customized itineraries",
				actions: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					onClick: () => setOpenNewModal(true),
					className: "rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-semibold shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "mr-2 h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 82,
						columnNumber: 13
					}, this), "Add New Tour Package"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 81,
					columnNumber: 172
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 81,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: destinations.map((dest) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
					className: "rounded-2xl border-[#E2E8F0] shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden group",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "bg-gradient-to-r from-[#0A1628] to-[#0F2040] p-5 text-white relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: "outline",
									className: "border-[#FF7A2D]/40 bg-[#FF7A2D]/10 text-[#FF7A2D] text-[10px] font-bold",
									children: dest.badge || "Featured"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 93,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-1 text-xs font-semibold text-amber-400",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Star, { className: "h-3.5 w-3.5 fill-amber-400 text-amber-400" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 97,
										columnNumber: 21
									}, this), dest.rating || "4.8"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 96,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 92,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "mt-3 text-base font-bold leading-snug group-hover:text-[#FF7A2D] transition",
								children: dest.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 102,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-1 flex items-center gap-1.5 text-xs text-slate-300",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { className: "h-3.5 w-3.5 text-[#FF7A2D]" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 106,
									columnNumber: 19
								}, this), dest.country]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 105,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 91,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
						className: "p-5 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between text-xs text-slate-600",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "flex items-center gap-1.5 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Calendar, { className: "h-4 w-4 text-[#E52E20]" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 115,
										columnNumber: 21
									}, this), dest.duration]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 114,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: "secondary",
									className: "text-[11px] font-semibold",
									children: dest.category
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 118,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 113,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-xl bg-slate-50 p-3 border border-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-[11px] font-semibold text-slate-500 uppercase tracking-wider",
									children: "Package Inclusions:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 124,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-slate-700 mt-1 leading-relaxed",
									children: dest.inclusions || "Flights, Hotels, Daily Breakfast, Transfers & Visa"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 127,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 123,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between text-xs text-slate-500",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Best Season:" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 133,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-semibold text-slate-700",
									children: dest.best_season || "All Year"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 134,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 132,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 112,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 89,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "border-t border-slate-100 p-5 bg-slate-50/50 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-[10px] text-slate-400 font-medium",
							children: "Starting from"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 142,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-lg font-black text-[#0A1628]",
							children: dest.price
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 143,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 141,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: () => setOpenBookModal(dest),
							className: "rounded-xl bg-[#0A1628] hover:bg-[#0F2040] text-white font-semibold text-xs",
							children: ["Inquire & Book ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "ml-1.5 h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 146,
								columnNumber: 32
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 145,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 140,
						columnNumber: 13
					}, this)]
				}, dest.code || dest.id, true, {
					fileName: _jsxFileName,
					lineNumber: 88,
					columnNumber: 42
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 87,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: Boolean(openBookModal),
				onOpenChange: () => setOpenBookModal(null),
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "sm:max-w-[480px] rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "text-lg font-bold text-[#0A1628] flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Compass, { className: "h-5 w-5 text-[#E52E20]" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 157,
								columnNumber: 15
							}, this), "Book / Inquire Tour Package"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 156,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 155,
							columnNumber: 11
						}, this),
						openBookModal && /* @__PURE__ */ (void 0)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [
								/* @__PURE__ */ (void 0)("div", {
									className: "rounded-xl bg-[#0A1628] p-4 text-white",
									children: [
										/* @__PURE__ */ (void 0)("div", {
											className: "text-xs font-semibold text-[#FF7A2D]",
											children: "Selected Tour"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 164,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "text-base font-bold mt-0.5",
											children: openBookModal.title
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 165,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (void 0)("div", {
											className: "flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-xs",
											children: [/* @__PURE__ */ (void 0)("span", { children: ["Duration: ", openBookModal.duration] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 167,
												columnNumber: 19
											}, this), /* @__PURE__ */ (void 0)("span", {
												className: "font-bold text-[#FF7A2D]",
												children: openBookModal.price
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 168,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 166,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 163,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)(Label, {
									className: "text-xs",
									children: "Your Name / Group Lead"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 173,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)(Input, {
									placeholder: "e.g. Ramesh Kalita",
									value: inquiryName,
									onChange: (e) => setInquiryName(e.target.value),
									className: "mt-1 rounded-xl"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 174,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 172,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)(Label, {
									className: "text-xs",
									children: "Contact Phone / WhatsApp"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 178,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)(Input, {
									placeholder: "+91 98XXX XXXXX",
									value: inquiryPhone,
									onChange: (e) => setInquiryPhone(e.target.value),
									className: "mt-1 rounded-xl"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 179,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 177,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 162,
							columnNumber: 29
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setOpenBookModal(null),
							className: "rounded-xl",
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 184,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: handleBookInquiry,
							className: "rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-semibold",
							children: "Submit Travel Inquiry"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 187,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 183,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 154,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 153,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: openNewModal,
				onOpenChange: setOpenNewModal,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "sm:max-w-[520px] rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
							className: "text-lg font-bold text-[#0A1628] flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-5 w-5 text-[#E52E20]" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 199,
								columnNumber: 15
							}, this), "Publish New Tour Package"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 198,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 197,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-3.5 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									className: "text-xs",
									children: "Package Title"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 206,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									placeholder: "e.g. Tokyo & Mount Fuji Cherry Blossom Tour",
									value: form.title,
									onChange: (e) => setForm({
										...form,
										title: e.target.value
									}),
									className: "mt-1 rounded-xl"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 207,
									columnNumber: 15
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 205,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Destination Country"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 215,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "e.g. Japan / Switzerland",
										value: form.country,
										onChange: (e) => setForm({
											...form,
											country: e.target.value
										}),
										className: "mt-1 rounded-xl"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 216,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 214,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Duration"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 222,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "e.g. 7 Days / 6 Nights",
										value: form.duration,
										onChange: (e) => setForm({
											...form,
											duration: e.target.value
										}),
										className: "mt-1 rounded-xl"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 223,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 221,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 213,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Category"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 232,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: form.category,
										onValueChange: (val) => setForm({
											...form,
											category: val
										}),
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
											className: "mt-1 rounded-xl",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 238,
												columnNumber: 21
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 237,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "Holiday Package",
												children: "Holiday Package"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 241,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "Student Edu-Tour",
												children: "Student Edu-Tour"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 242,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "Domestic Wonder",
												children: "Domestic Wonder"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 243,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "Corporate Retreat",
												children: "Corporate Retreat"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 244,
												columnNumber: 21
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 240,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 233,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 231,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Starting Price"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 249,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "e.g. ₹ 85,000",
										value: form.price,
										onChange: (e) => setForm({
											...form,
											price: e.target.value
										}),
										className: "mt-1 rounded-xl"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 250,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 248,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 230,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									className: "text-xs",
									children: "Key Inclusions"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 258,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
									placeholder: "Direct Flights, 4-Star Hotel, Visa, Daily Breakfast, Sightseeing Pass",
									value: form.inclusions,
									onChange: (e) => setForm({
										...form,
										inclusions: e.target.value
									}),
									className: "mt-1 rounded-xl resize-none h-20"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 259,
									columnNumber: 15
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 257,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 204,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setOpenNewModal(false),
							className: "rounded-xl",
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 267,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: () => createDestination.mutate(),
							disabled: createDestination.isPending,
							className: "rounded-xl bg-[#E52E20] hover:bg-[#C82114] text-white font-semibold",
							children: createDestination.isPending ? "Publishing..." : "Publish to Database"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 270,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 266,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 196,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 195,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 80,
		columnNumber: 10
	}, this);
}
//#endregion
export { TravelDestinationsPage as component };
