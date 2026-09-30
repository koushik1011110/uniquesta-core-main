import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { t as Button } from "./_ssr/button-Th46ikol.mjs";
import { t as Input } from "./_ssr/input-CWiOSw9Q.mjs";
import { t as api } from "./_ssr/api-06dRWXHB.mjs";
import { t as Badge } from "./_ssr/badge-h6Nj5OpU.mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { Ct as ChevronRight, H as LoaderCircle, K as Info, T as Plus, X as GripVertical, Z as GraduationCap, l as Trash2, m as Sparkles, st as ExternalLink, tt as Flame } from "./_libs/lucide-react.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { t as PageHeader } from "./_ssr/page-header-DRgCwu0n.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./_ssr/card-BpRCf_XK.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./_ssr/dialog-BvRIEwxi.mjs";
import { t as Label } from "./_ssr/label-DPnTa5YU.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-C1idR5Ws.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.leads-Crk55xuG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/_app.leads.tsx?tsr-split=component";
var colMeta = {
	"New Enquiry": {
		color: "bg-blue-500",
		badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
		borderActive: "border-blue-400 bg-blue-50/40",
		desc: "Raw marketing inquiries"
	},
	"Contacted": {
		color: "bg-amber-500",
		badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
		borderActive: "border-amber-400 bg-amber-50/40",
		desc: "First counsellor call done"
	},
	"Qualified": {
		color: "bg-[#E52E20]",
		badgeBg: "bg-red-50 text-[#E52E20] border-red-200",
		borderActive: "border-[#E52E20] bg-red-50/40",
		desc: "Eligible & converts to Student"
	},
	"Counselling Booked": {
		color: "bg-emerald-500",
		badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
		borderActive: "border-emerald-400 bg-emerald-50/40",
		desc: "Session scheduled / Onboarding"
	}
};
var columnsOrder = [
	"New Enquiry",
	"Contacted",
	"Qualified",
	"Counselling Booked"
];
function LeadsPage() {
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [showFunnelGuide, setShowFunnelGuide] = (0, import_react.useState)(true);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		source: "Website Form",
		score: 75,
		city: "Guwahati",
		status: "New Enquiry",
		email: "",
		phone: ""
	});
	const [convertModalOpen, setConvertModalOpen] = (0, import_react.useState)(false);
	const [selectedLead, setSelectedLead] = (0, import_react.useState)(null);
	const [convertForm, setConvertForm] = (0, import_react.useState)({
		country: "United Kingdom",
		course: "MSc International Business",
		university: "University of Manchester",
		intake: "Fall 2026"
	});
	const [deleteDialogOpen, setDeleteDialogOpen] = (0, import_react.useState)(false);
	const [leadToDelete, setLeadToDelete] = (0, import_react.useState)(null);
	const [draggingId, setDraggingId] = (0, import_react.useState)(null);
	const [dragOverCol, setDragOverCol] = (0, import_react.useState)(null);
	const { data, isLoading } = useQuery({
		queryKey: ["leads"],
		queryFn: async () => {
			const res = await api.get("/leads", { limit: 100 });
			return res.data ?? res ?? [];
		}
	});
	const create = useMutation({
		mutationFn: async () => api.post("/leads", form),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["leads"] });
			setOpen(false);
			toast.success("Lead created successfully");
			setForm({
				name: "",
				source: "Website Form",
				score: 75,
				city: "Guwahati",
				status: "New Enquiry",
				email: "",
				phone: ""
			});
		},
		onError: (e) => toast.error(e.message)
	});
	const moveLeadMutation = useMutation({
		mutationFn: async ({ id, status }) => {
			return api.put(`/leads/${id}`, { status });
		},
		onMutate: async ({ id, status }) => {
			await qc.cancelQueries({ queryKey: ["leads"] });
			const previousLeads = qc.getQueryData(["leads"]);
			qc.setQueryData(["leads"], (old) => {
				const updated = (Array.isArray(old) ? old : old?.data ?? []).map((lead) => lead.id === id ? {
					...lead,
					status
				} : lead);
				return Array.isArray(old) ? updated : {
					...old,
					data: updated
				};
			});
			return { previousLeads };
		},
		onError: (err, _vars, context) => {
			if (context?.previousLeads) qc.setQueryData(["leads"], context.previousLeads);
			toast.error(err?.message || "Failed to update lead stage");
		},
		onSuccess: (_data, vars) => {
			toast.success(`Lead moved to "${vars.status}"`);
		},
		onSettled: () => {
			qc.invalidateQueries({ queryKey: ["leads"] });
		}
	});
	const convertLeadMutation = useMutation({
		mutationFn: async ({ id, details }) => {
			return api.post(`/leads/${id}/convert`, details || {});
		},
		onSuccess: (res) => {
			qc.invalidateQueries({ queryKey: ["leads"] });
			qc.invalidateQueries({ queryKey: ["students"] });
			setConvertModalOpen(false);
			const studentCode = res?.student?.code || "UQ";
			toast.success(`Converted! Student profile created: ${studentCode}`, { description: "Registered in Student Admissions. Click to view student profile." });
		},
		onError: (e) => {
			toast.error(e.message || "Failed to convert lead to student");
		}
	});
	const deleteLeadMutation = useMutation({
		mutationFn: async (id) => {
			return api.del(`/leads/${id}`);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["leads"] });
			setDeleteDialogOpen(false);
			setLeadToDelete(null);
			toast.success("Lead deleted successfully");
		},
		onError: (e) => {
			toast.error(e.message || "Failed to delete lead");
		}
	});
	const handleDragStart = (e, id) => {
		e.dataTransfer.setData("text/plain", String(id));
		e.dataTransfer.effectAllowed = "move";
		setDraggingId(id);
	};
	const handleDragEnd = () => {
		setDraggingId(null);
		setDragOverCol(null);
	};
	const handleDragOver = (e, colName) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		if (dragOverCol !== colName) setDragOverCol(colName);
	};
	const handleDragLeave = (e) => {
		if (e.currentTarget.contains(e.relatedTarget)) return;
		setDragOverCol(null);
	};
	const handleDrop = (e, targetCol) => {
		e.preventDefault();
		setDragOverCol(null);
		setDraggingId(null);
		const leadIdStr = e.dataTransfer.getData("text/plain");
		const leadId = Number(leadIdStr);
		if (!leadId) return;
		const currentLead = leads.find((l) => l.id === leadId);
		if (!currentLead) return;
		if (currentLead.status === targetCol && (targetCol !== "Qualified" || currentLead.student_code)) return;
		if ((targetCol === "Qualified" || targetCol === "Counselling Booked") && !currentLead.student_code) convertLeadMutation.mutate({ id: leadId });
		else moveLeadMutation.mutate({
			id: leadId,
			status: targetCol
		});
	};
	const openConvertModal = (lead) => {
		setSelectedLead(lead);
		setConvertForm({
			country: "United Kingdom",
			course: "MSc Data Science",
			university: "University of Manchester",
			intake: "Fall 2026"
		});
		setConvertModalOpen(true);
	};
	const leads = Array.isArray(data) ? data : data?.data ?? [];
	const grouped = {};
	for (const c of columnsOrder) grouped[c] = [];
	for (const l of leads) {
		const key = l.status ?? "New Enquiry";
		if (!grouped[key]) grouped[key] = [];
		grouped[key].push(l);
	}
	const hasData = leads.length > 0;
	const convertedCount = leads.filter((l) => Boolean(l.student_code)).length;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "Lead Management & Student Conversion",
			description: hasData ? `${leads.length} total leads · ${convertedCount} converted to Student Admissions · Drag cards across stages` : "Active study abroad pipeline with automated student admission conversion",
			actions: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => setShowFunnelGuide(!showFunnelGuide),
					className: "rounded-lg gap-1.5 text-xs text-slate-700",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Info, { className: "h-3.5 w-3.5 text-[#E52E20]" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 271,
						columnNumber: 15
					}, this), showFunnelGuide ? "Hide Funnel Guide" : "CRM Funnel Guide"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 270,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					className: "rounded-lg gap-2 bg-[#E52E20] hover:bg-[#C82114] text-white",
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 275,
						columnNumber: 15
					}, this), " New Lead"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 274,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 269,
				columnNumber: 283
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 269,
			columnNumber: 7
		}, this),
		showFunnelGuide && /* @__PURE__ */ (void 0)("div", {
			className: "mb-4 rounded-2xl border border-red-200/80 bg-gradient-to-r from-red-50/80 via-white to-amber-50/40 p-4 shadow-sm",
			children: [
				/* @__PURE__ */ (void 0)("div", {
					className: "flex items-center justify-between gap-2 pb-3 border-b border-red-100",
					children: [/* @__PURE__ */ (void 0)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (void 0)("div", {
							className: "h-7 w-7 rounded-lg bg-[#E52E20] text-white grid place-items-center text-xs font-bold shadow-xs",
							children: "UQ"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 283,
							columnNumber: 15
						}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("h4", {
							className: "font-bold text-sm text-slate-900 flex items-center gap-2",
							children: ["Study Abroad CRM Funnel: ", /* @__PURE__ */ (void 0)("span", {
								className: "text-[#E52E20]",
								children: "Leads vs. Student Admissions"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 288,
								columnNumber: 44
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 287,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("p", {
							className: "text-xs text-slate-600",
							children: "Abroad education consultancies follow a 4-step pipeline to filter inquiries into verified student admissions."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 290,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 286,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 282,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)(Badge, {
						className: "bg-red-100 text-[#E52E20] border-red-200 hover:bg-red-100 text-[11px] font-semibold",
						children: "Industry Standard Logic"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 295,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 281,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (void 0)("div", {
					className: "mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "rounded-xl border border-blue-200/80 bg-blue-50/50 p-2.5",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-1.5 font-bold text-blue-900 mb-1",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "h-4 w-4 rounded-full bg-blue-600 text-white grid place-items-center text-[10px]",
									children: "1"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 303,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", { children: "New Enquiry (Lead)" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 304,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 302,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-slate-600 text-[11px] leading-relaxed",
								children: "Raw inquiry from Website, Meta Ads, or Fairs. Not yet an admitted student."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 306,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 301,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "rounded-xl border border-amber-200/80 bg-amber-50/50 p-2.5",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-1.5 font-bold text-amber-900 mb-1",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "h-4 w-4 rounded-full bg-amber-600 text-white grid place-items-center text-[10px]",
									children: "2"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 313,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", { children: "Contacted (Follow-up)" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 314,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 312,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-slate-600 text-[11px] leading-relaxed",
								children: "Counsellor calls the student, reviews academic scores & IELTS eligibility."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 316,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 311,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "rounded-xl border border-red-300 bg-red-50/80 p-2.5 shadow-xs ring-1 ring-[#E52E20]/20",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-1.5 font-bold text-[#E52E20] mb-1",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "h-4 w-4 rounded-full bg-[#E52E20] text-white grid place-items-center text-[10px]",
									children: "3"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 323,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", { children: "Qualified (Ready)" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 324,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 322,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-slate-700 text-[11px] leading-relaxed font-medium",
								children: ["Student has budget & documents. Dragging here ", /* @__PURE__ */ (void 0)("strong", { children: "creates a real Student Admission profile!" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 327,
									columnNumber: 63
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 326,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 321,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-2.5",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-1.5 font-bold text-emerald-900 mb-1",
								children: [/* @__PURE__ */ (void 0)("span", {
									className: "h-4 w-4 rounded-full bg-emerald-600 text-white grid place-items-center text-[10px]",
									children: "4"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 333,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("span", { children: "Student Admissions" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 334,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 332,
								columnNumber: 15
							}, this), /* @__PURE__ */ (void 0)("p", {
								className: "text-slate-600 text-[11px] leading-relaxed",
								children: [
									"Formal applicant with ",
									/* @__PURE__ */ (void 0)("code", {
										className: "text-emerald-700 font-bold",
										children: "UQ-XXXXX"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 337,
										columnNumber: 39
									}, this),
									" code. Visa, offers & payments begin here!"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 336,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 331,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 300,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (void 0)("div", {
					className: "mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-red-100/80",
					children: [/* @__PURE__ */ (void 0)("span", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (void 0)(Sparkles, { className: "h-3.5 w-3.5 text-[#E52E20]" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 344,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("strong", { children: "Mouse Drag Rule:" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 345,
								columnNumber: 15
							}, this),
							" Drag any lead card into ",
							/* @__PURE__ */ (void 0)("strong", { children: "\"Qualified\"" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 345,
								columnNumber: 73
							}, this),
							" to automatically convert and register them in Student Admissions."
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 343,
						columnNumber: 13
					}, this), /* @__PURE__ */ (void 0)(Link, {
						to: "/students",
						className: "text-[#E52E20] font-bold hover:underline flex items-center gap-0.5",
						children: ["View Student Admissions List ", /* @__PURE__ */ (void 0)(ChevronRight, { className: "h-3.5 w-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 348,
							columnNumber: 44
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 347,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 342,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 280,
			columnNumber: 27
		}, this),
		isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center gap-2 text-sm text-muted-foreground py-10",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 354,
				columnNumber: 11
			}, this), " Loading leads…"]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 353,
			columnNumber: 20
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid grid-flow-col auto-cols-[minmax(310px,1fr)] gap-4 overflow-x-auto pb-4",
			children: columnsOrder.map((colName) => {
				const colLeads = grouped[colName] ?? [];
				const meta = colMeta[colName] ?? {
					color: "bg-primary",
					badgeBg: "bg-slate-100 text-slate-800",
					borderActive: "border-slate-400 bg-slate-50",
					desc: ""
				};
				const isTarget = dragOverCol === colName;
				return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					onDragOver: (e) => handleDragOver(e, colName),
					onDragLeave: handleDragLeave,
					onDrop: (e) => handleDrop(e, colName),
					className: `min-w-0 flex flex-col rounded-2xl p-2.5 transition-all duration-200 ${isTarget ? `border-2 border-dashed ${meta.borderActive} shadow-md scale-[1.01]` : "border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50/90"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mb-2 flex items-center gap-2 px-1 pt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `h-3 w-3 rounded-full ${meta.color} shadow-sm` }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 368,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "font-bold text-sm text-slate-900 leading-none",
									children: colName
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 370,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[10px] text-slate-500",
									children: meta.desc
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 371,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 369,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: "outline",
									className: `ml-auto rounded-md font-semibold text-xs border ${meta.badgeBg}`,
									children: colLeads.length
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 373,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 367,
							columnNumber: 17
						}, this),
						isTarget && /* @__PURE__ */ (void 0)("div", {
							className: "mb-2 rounded-xl border border-dashed border-[#E52E20] bg-white p-2.5 text-center text-xs font-bold text-[#E52E20] animate-pulse shadow-sm",
							children: colName === "Qualified" ? "Drop here to Qualify & Create Student Profile" : `Drop here to move to "${colName}"`
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 379,
							columnNumber: 30
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-3 flex-1 min-h-[220px]",
							children: [colLeads.map((l) => {
								const isBeingDragged = draggingId === l.id;
								const isConverted = Boolean(l.student_code);
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
									draggable: true,
									onDragStart: (e) => handleDragStart(e, l.id),
									onDragEnd: handleDragEnd,
									className: `group relative rounded-xl border bg-white shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing hover:border-slate-400 hover:shadow-md select-none ${isBeingDragged ? "opacity-35 scale-95 border-dashed border-[#E52E20] bg-red-50/30 ring-2 ring-[#E52E20]" : "border-slate-200/90"}`,
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
										className: "p-3.5 pb-2",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-start justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center gap-2 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GripVertical, { className: "h-4 w-4 shrink-0 text-slate-300 group-hover:text-slate-500 transition cursor-grab active:cursor-grabbing" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 392,
													columnNumber: 31
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
													className: "text-sm font-bold text-slate-900 truncate",
													children: l.name
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 393,
													columnNumber: 31
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 391,
												columnNumber: 29
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center gap-1 shrink-0",
												children: [l.score >= 80 && /* @__PURE__ */ (void 0)("span", {
													className: "flex items-center gap-0.5 text-xs font-semibold text-[#E52E20]",
													title: "High conversion priority",
													children: [/* @__PURE__ */ (void 0)(Flame, { className: "h-3.5 w-3.5 fill-[#E52E20] text-[#E52E20]" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 399,
														columnNumber: 35
													}, this), l.score]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 398,
													columnNumber: 49
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
													variant: "ghost",
													size: "icon",
													onClick: (e) => {
														e.stopPropagation();
														setLeadToDelete(l);
														setDeleteDialogOpen(true);
													},
													className: "h-6 w-6 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-md transition",
													title: "Delete lead",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 407,
														columnNumber: 33
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 402,
													columnNumber: 31
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 397,
												columnNumber: 29
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 390,
											columnNumber: 27
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 389,
										columnNumber: 25
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
										className: "space-y-2.5 p-3.5 pt-0 text-xs text-slate-500",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center justify-between text-[11px]",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-medium text-slate-700",
													children: l.source
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 415,
													columnNumber: 29
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-slate-500",
													children: l.city
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 416,
													columnNumber: 29
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 414,
												columnNumber: 27
											}, this),
											isConverted ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "rounded-lg bg-emerald-50 border border-emerald-200/80 p-2 flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex items-center gap-1.5 text-emerald-800 font-bold text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "h-4 w-4 text-emerald-600 shrink-0" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 422,
														columnNumber: 33
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: l.student_code }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 423,
														columnNumber: 33
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 421,
													columnNumber: 31
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
													to: "/students/$studentId",
													params: { studentId: l.student_code },
													className: "inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Profile" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 428,
														columnNumber: 33
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "h-3 w-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 429,
														columnNumber: 33
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 425,
													columnNumber: 31
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 420,
												columnNumber: 42
											}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "pt-1 flex items-center justify-between gap-1 border-t border-slate-100",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
													size: "sm",
													variant: "outline",
													onClick: (e) => {
														e.stopPropagation();
														openConvertModal(l);
													},
													className: "h-6 text-[11px] font-semibold border-red-200 text-[#E52E20] hover:bg-red-50 hover:text-[#C82114] px-2 rounded-md gap-1 shadow-xs",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "h-3 w-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 436,
														columnNumber: 33
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Convert to Student" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 437,
														columnNumber: 33
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 432,
													columnNumber: 31
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
													variant: "outline",
													className: "rounded-md text-[10px] bg-slate-50 text-slate-600 font-medium",
													children: ["Score ", l.score]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 440,
													columnNumber: 31
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 431,
												columnNumber: 38
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-slate-400",
													children: l.created_at ? new Date(l.created_at).toLocaleDateString() : "Active lead"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 447,
													columnNumber: 29
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "relative",
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
														value: l.status || colName,
														onValueChange: (newStatus) => {
															if (newStatus !== l.status) {
																if ((newStatus === "Qualified" || newStatus === "Counselling Booked") && !l.student_code) convertLeadMutation.mutate({ id: l.id });
																else moveLeadMutation.mutate({
																	id: l.id,
																	status: newStatus
																});
															}
														},
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, {
															className: "h-6 px-1.5 text-[10px] font-medium border-slate-200 text-slate-600 bg-white hover:bg-slate-50",
															children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
																className: "truncate max-w-[75px]",
																children: "Move stage"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 466,
																columnNumber: 35
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 465,
															columnNumber: 33
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, {
															align: "end",
															children: columnsOrder.map((target) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
																value: target,
																className: "text-xs",
																children: target
															}, target, false, {
																fileName: _jsxFileName,
																lineNumber: 469,
																columnNumber: 63
															}, this))
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 468,
															columnNumber: 33
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 451,
														columnNumber: 31
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 450,
													columnNumber: 29
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 446,
												columnNumber: 27
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 413,
										columnNumber: 25
									}, this)]
								}, l.id ?? l.name, true, {
									fileName: _jsxFileName,
									lineNumber: 388,
									columnNumber: 22
								}, this);
							}), colLeads.length === 0 && /* @__PURE__ */ (void 0)("div", {
								className: "rounded-xl border border-dashed border-slate-200 bg-white/60 p-6 text-center text-xs text-slate-400",
								children: [/* @__PURE__ */ (void 0)("p", {
									className: "font-medium text-slate-500",
									children: ["No leads in ", colName]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 481,
									columnNumber: 23
								}, this), /* @__PURE__ */ (void 0)("p", {
									className: "text-[11px] text-slate-400 mt-1",
									children: "Drag and drop leads here"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 482,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 480,
								columnNumber: 45
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 384,
							columnNumber: 17
						}, this)
					]
				}, colName, true, {
					fileName: _jsxFileName,
					lineNumber: 365,
					columnNumber: 16
				}, this);
			})
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 355,
			columnNumber: 18
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "New Inquiry / Lead" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 493,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: "Record prospective candidate inquiries before formal admission." }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 494,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 492,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Full Name *" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 499,
								columnNumber: 43
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								}),
								placeholder: "Full name"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 499,
								columnNumber: 69
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 499,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Email" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 504,
									columnNumber: 45
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									value: form.email,
									onChange: (e) => setForm({
										...form,
										email: e.target.value
									}),
									placeholder: "email@example.com"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 504,
									columnNumber: 65
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 504,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Phone" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 508,
									columnNumber: 45
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									value: form.phone,
									onChange: (e) => setForm({
										...form,
										phone: e.target.value
									}),
									placeholder: "+91 ..."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 508,
									columnNumber: 65
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 508,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 503,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "City *" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 514,
									columnNumber: 45
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									value: form.city,
									onChange: (e) => setForm({
										...form,
										city: e.target.value
									}),
									placeholder: "Guwahati"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 514,
									columnNumber: 66
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 514,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Source" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 518,
									columnNumber: 45
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
									value: form.source,
									onValueChange: (v) => setForm({
										...form,
										source: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 523,
										columnNumber: 34
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 523,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Website Form",
											children: "Website Form"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 525,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Instagram Ad",
											children: "Instagram Ad"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 526,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Google Ads",
											children: "Google Ads"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 527,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Referral",
											children: "Referral"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 528,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Walk-in",
											children: "Walk-in"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 529,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Education Fair",
											children: "Education Fair"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 530,
											columnNumber: 21
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 524,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 519,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 518,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 513,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Score" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 536,
									columnNumber: 45
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									type: "number",
									value: form.score,
									onChange: (e) => setForm({
										...form,
										score: parseInt(e.target.value) || 0
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 536,
									columnNumber: 65
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 536,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Initial Status" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 540,
									columnNumber: 45
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
									value: form.status,
									onValueChange: (v) => setForm({
										...form,
										status: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 545,
										columnNumber: 34
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 545,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: columnsOrder.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
										value: c,
										children: c
									}, c, false, {
										fileName: _jsxFileName,
										lineNumber: 547,
										columnNumber: 44
									}, this)) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 546,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 541,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 540,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 535,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 498,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 554,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					onClick: () => create.mutate(),
					disabled: !form.name || !form.city || create.isPending,
					className: "bg-[#E52E20] hover:bg-[#C82114] text-white",
					children: [create.isPending && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 556,
						columnNumber: 36
					}, this), " Create Lead"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 555,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 553,
					columnNumber: 11
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 491,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 490,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
			open: convertModalOpen,
			onOpenChange: setConvertModalOpen,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
					className: "flex items-center gap-2 text-slate-900",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "h-5 w-5 text-[#E52E20]" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 567,
						columnNumber: 15
					}, this), "Convert Lead to Student Admission"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 566,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: [
					"This will create an official Student profile in the database with a unique ",
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
						className: "text-[#E52E20] font-bold",
						children: "UQ-XXXXX"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 571,
						columnNumber: 90
					}, this),
					" code and link it to this lead."
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 570,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 565,
					columnNumber: 11
				}, this),
				selectedLead && /* @__PURE__ */ (void 0)("div", {
					className: "grid gap-4 text-xs",
					children: [
						/* @__PURE__ */ (void 0)("div", {
							className: "rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("div", {
								className: "font-bold text-sm text-slate-900",
								children: selectedLead.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 578,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "text-slate-500",
								children: [
									selectedLead.email || "No email",
									" · ",
									selectedLead.phone || "No phone"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 579,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 577,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)(Badge, {
								variant: "outline",
								className: "border-red-200 text-[#E52E20] bg-white font-semibold",
								children: ["Score ", selectedLead.score]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 581,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 576,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (void 0)(Label, { children: "Target Destination *" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 588,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)(Select, {
									value: convertForm.country,
									onValueChange: (v) => setConvertForm({
										...convertForm,
										country: v
									}),
									children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 593,
										columnNumber: 36
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 593,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: [
										/* @__PURE__ */ (void 0)(SelectItem, {
											value: "United Kingdom",
											children: "United Kingdom"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 595,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)(SelectItem, {
											value: "Canada",
											children: "Canada"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 596,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)(SelectItem, {
											value: "United States",
											children: "United States"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 597,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)(SelectItem, {
											value: "Australia",
											children: "Australia"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 598,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)(SelectItem, {
											value: "Germany",
											children: "Germany"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 599,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)(SelectItem, {
											value: "Ireland",
											children: "Ireland"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 600,
											columnNumber: 23
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 594,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 589,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 587,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (void 0)(Label, { children: "Intake *" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 605,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)(Select, {
									value: convertForm.intake,
									onValueChange: (v) => setConvertForm({
										...convertForm,
										intake: v
									}),
									children: [/* @__PURE__ */ (void 0)(SelectTrigger, { children: /* @__PURE__ */ (void 0)(SelectValue, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 610,
										columnNumber: 36
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 610,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)(SelectContent, { children: [
										/* @__PURE__ */ (void 0)(SelectItem, {
											value: "Fall 2026",
											children: "Fall 2026"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 612,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)(SelectItem, {
											value: "Spring 2027",
											children: "Spring 2027"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 613,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)(SelectItem, {
											value: "Winter 2026",
											children: "Winter 2026"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 614,
											columnNumber: 23
										}, this),
										/* @__PURE__ */ (void 0)(SelectItem, {
											value: "Summer 2027",
											children: "Summer 2027"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 615,
											columnNumber: 23
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 611,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 606,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 604,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 586,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (void 0)(Label, { children: "Target Course / Program" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 622,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)(Input, {
								value: convertForm.course,
								onChange: (e) => setConvertForm({
									...convertForm,
									course: e.target.value
								}),
								placeholder: "e.g. MSc Data Science / MBA"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 623,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 621,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (void 0)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (void 0)(Label, { children: "Target University" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 630,
								columnNumber: 17
							}, this), /* @__PURE__ */ (void 0)(Input, {
								value: convertForm.university,
								onChange: (e) => setConvertForm({
									...convertForm,
									university: e.target.value
								}),
								placeholder: "e.g. University of Manchester"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 631,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 629,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 575,
					columnNumber: 28
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					onClick: () => setConvertModalOpen(false),
					children: "Cancel"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 639,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					onClick: () => {
						if (selectedLead) convertLeadMutation.mutate({
							id: selectedLead.id,
							details: convertForm
						});
					},
					disabled: convertLeadMutation.isPending,
					className: "bg-[#E52E20] hover:bg-[#C82114] text-white gap-1.5 font-semibold",
					children: [convertLeadMutation.isPending ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 648,
						columnNumber: 48
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 648,
						columnNumber: 95
					}, this), "Confirm & Create Student Profile"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 640,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 638,
					columnNumber: 11
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 564,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 563,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
			open: deleteDialogOpen,
			onOpenChange: setDeleteDialogOpen,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
				className: "max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
						className: "flex items-center gap-2 text-red-600",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-5 w-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 660,
							columnNumber: 15
						}, this), "Delete Lead"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 659,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, {
						className: "text-slate-600 pt-1 text-xs leading-relaxed",
						children: [
							"Are you sure you want to permanently delete lead ",
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-slate-900 font-semibold",
								children: leadToDelete?.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 664,
								columnNumber: 64
							}, this),
							"? This will remove this enquiry from the pipeline and MySQL database."
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 663,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 658,
						columnNumber: 11
					}, this),
					leadToDelete && /* @__PURE__ */ (void 0)("div", {
						className: "rounded-xl border border-red-100 bg-red-50/50 p-3 text-xs space-y-1",
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "font-bold text-slate-900",
								children: leadToDelete.name
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 670,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "text-slate-500",
								children: [
									leadToDelete.city,
									" · ",
									leadToDelete.source,
									" · Score ",
									leadToDelete.score
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 671,
								columnNumber: 15
							}, this),
							leadToDelete.student_code && /* @__PURE__ */ (void 0)("div", {
								className: "text-emerald-700 font-medium text-[11px] pt-1",
								children: ["Note: Converted as student ", leadToDelete.student_code]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 672,
								columnNumber: 45
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 669,
						columnNumber: 28
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, {
						className: "gap-2 sm:gap-0",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setDeleteDialogOpen(false),
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 678,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "destructive",
							className: "bg-red-600 hover:bg-red-700 gap-1.5 font-semibold text-white",
							disabled: deleteLeadMutation.isPending,
							onClick: () => {
								if (leadToDelete) deleteLeadMutation.mutate(leadToDelete.id);
							},
							children: [deleteLeadMutation.isPending ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 686,
								columnNumber: 47
							}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 686,
								columnNumber: 94
							}, this), "Delete Permanently"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 681,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 677,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 657,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 656,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 268,
		columnNumber: 10
	}, this);
}
//#endregion
export { LeadsPage as component };
