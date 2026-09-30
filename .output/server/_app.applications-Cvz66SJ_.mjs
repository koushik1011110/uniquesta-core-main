import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { t as Button } from "./_ssr/button-Th46ikol.mjs";
import { t as Input } from "./_ssr/input-CWiOSw9Q.mjs";
import { t as api } from "./_ssr/api-06dRWXHB.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { $ as Funnel, H as LoaderCircle, T as Plus, l as Trash2, nt as FileText } from "./_libs/lucide-react.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { t as PageHeader } from "./_ssr/page-header-DRgCwu0n.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-BpRCf_XK.mjs";
import { t as Progress } from "./_ssr/progress-ccoC5ctG.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./_ssr/dialog-BvRIEwxi.mjs";
import { t as Label } from "./_ssr/label-DPnTa5YU.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-C1idR5Ws.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.applications-Cvz66SJ_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/_app.applications.tsx?tsr-split=component";
var statusTone = {
	"In Progress": "bg-info/10 text-info",
	"Offer": "bg-success/10 text-success",
	"Under Review": "bg-warning/15 text-warning",
	"Visa Filed": "bg-primary/10 text-primary",
	"Enrolled": "bg-success/10 text-success"
};
function ApplicationsPage() {
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		student: "",
		university: "",
		program: "",
		intake: "Fall 2026",
		stage: "Documents",
		progress: 0,
		status: "In Progress"
	});
	const { data, isLoading } = useQuery({
		queryKey: ["applications"],
		queryFn: async () => {
			const res = await api.get("/applications", { limit: 100 });
			return res.data ?? res ?? [];
		}
	});
	const list = Array.isArray(data) ? data : data?.data ?? [];
	const kpis = [
		{
			label: "Open Applications",
			value: String(list.length || 986)
		},
		{
			label: "Offers Received",
			value: String(list.filter((a) => a.status === "Offer").length || 287)
		},
		{
			label: "Avg. Turnaround",
			value: "4.2 days"
		},
		{
			label: "Rejection Rate",
			value: "6.8%"
		}
	];
	const create = useMutation({
		mutationFn: async () => api.post("/applications", form),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["applications"] });
			setOpen(false);
			toast.success("Application created");
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async (code) => api.del(`/applications/${code}`),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["applications"] });
			toast.success("Deleted");
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "Application Management",
			description: "Every university application, in one workspace",
			actions: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "outline",
				className: "rounded-lg",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Funnel, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 82,
					columnNumber: 62
				}, this), " Filter"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 82,
				columnNumber: 13
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				className: "rounded-lg",
				onClick: () => setOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 83,
					columnNumber: 74
				}, this), " New Application"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 83,
				columnNumber: 13
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 81,
				columnNumber: 120
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 81,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: kpis.map((k) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "rounded-2xl shadow-soft",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-2xl font-bold",
						children: k.value
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 89,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-sm text-muted-foreground",
						children: k.label
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 90,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 88,
					columnNumber: 13
				}, this)
			}, k.label, false, {
				fileName: _jsxFileName,
				lineNumber: 87,
				columnNumber: 24
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 86,
			columnNumber: 7
		}, this),
		isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-center gap-2 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 95,
				columnNumber: 91
			}, this), " Loading…"]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 95,
			columnNumber: 20
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [list.map((a) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
				className: "rounded-2xl shadow-soft transition hover:shadow-card",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
					className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 100,
											columnNumber: 21
										}, this),
										a.code,
										" · ",
										a.intake
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 99,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-1 truncate font-semibold",
									children: [
										a.student,
										" → ",
										a.university
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 102,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "truncate text-sm text-muted-foreground",
									children: a.program
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 103,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 98,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "hidden min-w-0 sm:block",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mb-1.5 flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: a.stage }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 107,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [a.progress, "%"] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 107,
									columnNumber: 43
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 106,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Progress, {
								value: Number(a.progress) || 0,
								className: "h-1.5"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 109,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 105,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: `hidden rounded-full px-2 py-0.5 text-xs font-medium sm:inline-flex ${statusTone[a.status] ?? "bg-muted text-muted-foreground"}`,
									children: a.status
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 112,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "ghost",
									size: "icon",
									className: "h-8 w-8",
									onClick: () => del.mutate(a.code),
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 113,
										columnNumber: 110
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 113,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									size: "sm",
									className: "rounded-lg",
									children: "Open"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 114,
									columnNumber: 19
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 111,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 97,
					columnNumber: 15
				}, this)
			}, a.id ?? a.code, false, {
				fileName: _jsxFileName,
				lineNumber: 96,
				columnNumber: 33
			}, this)), list.length === 0 && /* @__PURE__ */ (void 0)("p", {
				className: "rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground",
				children: "No applications yet"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 118,
				columnNumber: 33
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 95,
			columnNumber: 153
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "New Application" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 123,
					columnNumber: 25
				}, this) }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 123,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Student *" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 125,
								columnNumber: 43
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								value: form.student,
								onChange: (e) => setForm({
									...form,
									student: e.target.value
								}),
								placeholder: "Priya Nair"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 125,
								columnNumber: 67
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "University *" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 129,
								columnNumber: 43
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								value: form.university,
								onChange: (e) => setForm({
									...form,
									university: e.target.value
								}),
								placeholder: "University of Toronto"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 129,
								columnNumber: 70
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 129,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Program *" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 134,
									columnNumber: 45
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									value: form.program,
									onChange: (e) => setForm({
										...form,
										program: e.target.value
									}),
									placeholder: "MSc Computer Science"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 134,
									columnNumber: 69
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 134,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Intake" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 138,
									columnNumber: 45
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									value: form.intake,
									onChange: (e) => setForm({
										...form,
										intake: e.target.value
									}),
									placeholder: "Fall 2026"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 138,
									columnNumber: 66
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 138,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 133,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Stage" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 144,
									columnNumber: 45
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
									value: form.stage,
									onValueChange: (v) => setForm({
										...form,
										stage: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 149,
										columnNumber: 34
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 149,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Documents",
											children: "Documents"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 151,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Submitted",
											children: "Submitted"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 151,
											columnNumber: 73
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Offer Received",
											children: "Offer Received"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 151,
											columnNumber: 125
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Visa",
											children: "Visa"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 151,
											columnNumber: 187
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Enrolled",
											children: "Enrolled"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 151,
											columnNumber: 229
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 150,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 145,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 144,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "Status" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 155,
									columnNumber: 45
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
									value: form.status,
									onValueChange: (v) => setForm({
										...form,
										status: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 160,
										columnNumber: 34
									}, this) }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 160,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "In Progress",
											children: "In Progress"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 162,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Under Review",
											children: "Under Review"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 162,
											columnNumber: 77
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Offer",
											children: "Offer"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 162,
											columnNumber: 135
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Visa Filed",
											children: "Visa Filed"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 162,
											columnNumber: 179
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Enrolled",
											children: "Enrolled"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 162,
											columnNumber: 233
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 161,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 156,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 155,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 143,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 124,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 169,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					onClick: () => create.mutate(),
					disabled: !form.student || !form.university || create.isPending,
					children: [create.isPending && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 170,
						columnNumber: 139
					}, this), " Create"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 170,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 168,
					columnNumber: 11
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 122,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 121,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 80,
		columnNumber: 10
	}, this);
}
//#endregion
export { ApplicationsPage as component };
