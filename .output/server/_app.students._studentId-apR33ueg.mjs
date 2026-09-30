import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { t as Button } from "./_ssr/button-Th46ikol.mjs";
import { t as Input } from "./_ssr/input-CWiOSw9Q.mjs";
import { t as api } from "./_ssr/api-06dRWXHB.mjs";
import { t as Badge } from "./_ssr/badge-h6Nj5OpU.mjs";
import { n as getUser } from "./_ssr/auth-CMDgS_mZ.mjs";
import { t as Separator } from "./_ssr/separator-C6bIjWry.mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { Et as Check, H as LoaderCircle, Ht as ArrowLeft, I as MessageSquare, It as Building2, L as MapPin, M as PenLine, Nt as CalendarDays, O as Phone, R as Mail, T as Plus, Z as GraduationCap, _ as ShieldCheck, _t as Circle, b as Send, bt as CircleCheck, ct as Earth, d as Star, gt as Clock, l as Trash2, nt as FileText, s as Upload, vt as CircleUserRound } from "./_libs/lucide-react.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { t as PageHeader } from "./_ssr/page-header-DRgCwu0n.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./_ssr/card-BpRCf_XK.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./_ssr/dialog-BvRIEwxi.mjs";
import { t as Label } from "./_ssr/label-DPnTa5YU.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-C1idR5Ws.mjs";
import { n as AvatarFallback, r as AvatarImage, t as Avatar } from "./_ssr/avatar-Nllrur_R.mjs";
import { t as Textarea } from "./_ssr/textarea-CBLiJrex.mjs";
import { n as Route } from "./_ssr/router-zF7wAd8r.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./_ssr/tabs-W_aYjDGj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.students._studentId-apR33ueg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "D:/React APP/uniquesta-core-main/src/routes/_app.students.$studentId.tsx?tsr-split=component";
var TIMELINE_STAGES = [
	{
		label: "Lead",
		defaultNote: "Enquiry from website or partner referral"
	},
	{
		label: "Counselling",
		defaultNote: "In-person or virtual counselling session"
	},
	{
		label: "Documents",
		defaultNote: "SOP, LOR, transcripts and financial docs"
	},
	{
		label: "University Applied",
		defaultNote: "Application submitted to universities"
	},
	{
		label: "Offer Letter",
		defaultNote: "Awaiting or received offer from university"
	},
	{
		label: "Fee Paid",
		defaultNote: "Tuition deposit payment completed"
	},
	{
		label: "Visa Applied",
		defaultNote: "Study permit / student visa submission"
	},
	{
		label: "Visa Approved",
		defaultNote: "Immigration decision confirmed"
	},
	{
		label: "Travel",
		defaultNote: "Flight booking and accommodation arranged"
	},
	{
		label: "Course Started",
		defaultNote: "Enrolment confirmed at destination university"
	}
];
function StudentDetailsPage() {
	const { studentId } = Route.useParams();
	const qc = useQueryClient();
	const currentUser = getUser();
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [stageOpen, setStageOpen] = (0, import_react.useState)(false);
	const [taskOpen, setTaskOpen] = (0, import_react.useState)(false);
	const [docOpen, setDocOpen] = (0, import_react.useState)(false);
	const [followupOpen, setFollowupOpen] = (0, import_react.useState)(false);
	const [commOpen, setCommOpen] = (0, import_react.useState)(false);
	const [newNote, setNewNote] = (0, import_react.useState)("");
	const [editForm, setEditForm] = (0, import_react.useState)({});
	const [taskForm, setTaskForm] = (0, import_react.useState)({
		title: "",
		due_date: "Tomorrow · 5:00 PM",
		owner: currentUser?.name || "Meera Shah",
		priority: "Medium"
	});
	const [docForm, setDocForm] = (0, import_react.useState)({
		name: "",
		size: "1.2 MB",
		status: "Verified"
	});
	const [followupForm, setFollowupForm] = (0, import_react.useState)({
		scheduled_at: "Tomorrow · 11:00 AM",
		channel: "Phone call",
		note: ""
	});
	const [commForm, setCommForm] = (0, import_react.useState)({
		channel: "Call",
		direction: "Outbound",
		subject: ""
	});
	const { data: studentRes, isLoading, isError } = useQuery({
		queryKey: ["student", studentId],
		queryFn: async () => {
			const res = await api.get(`/students/${studentId}`);
			return res.data ?? res;
		}
	});
	const { data: tasksRes = [] } = useQuery({
		queryKey: [
			"student",
			studentId,
			"tasks"
		],
		queryFn: async () => {
			const res = await api.get(`/students/${studentId}/tasks`);
			return res.data ?? res ?? [];
		}
	});
	const { data: docsRes = [] } = useQuery({
		queryKey: [
			"student",
			studentId,
			"documents"
		],
		queryFn: async () => {
			const res = await api.get(`/students/${studentId}/documents`);
			return res.data ?? res ?? [];
		}
	});
	const { data: notesRes = [] } = useQuery({
		queryKey: [
			"student",
			studentId,
			"notes"
		],
		queryFn: async () => {
			const res = await api.get(`/students/${studentId}/notes`);
			return res.data ?? res ?? [];
		}
	});
	const { data: followupsRes = [] } = useQuery({
		queryKey: [
			"student",
			studentId,
			"followups"
		],
		queryFn: async () => {
			const res = await api.get(`/students/${studentId}/followups`);
			return res.data ?? res ?? [];
		}
	});
	const { data: commsRes = [] } = useQuery({
		queryKey: [
			"student",
			studentId,
			"comms"
		],
		queryFn: async () => {
			const res = await api.get(`/students/${studentId}/comms`);
			return res.data ?? res ?? [];
		}
	});
	const updateStudent = useMutation({
		mutationFn: async (payload) => api.put(`/students/${studentId}`, payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["student", studentId] });
			qc.invalidateQueries({ queryKey: ["students"] });
			setEditOpen(false);
			setStageOpen(false);
			toast.success("Student details updated successfully");
		},
		onError: (err) => toast.error(err.message || "Failed to update")
	});
	const deleteStudent = useMutation({
		mutationFn: async () => api.del(`/students/${studentId}`),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["students"] });
			toast.success("Student deleted");
			window.location.href = "/students";
		},
		onError: (e) => toast.error(e.message || "Delete failed")
	});
	const addTask = useMutation({
		mutationFn: async () => api.post(`/students/${studentId}/tasks`, taskForm),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [
				"student",
				studentId,
				"tasks"
			] });
			setTaskOpen(false);
			setTaskForm({
				title: "",
				due_date: "Tomorrow · 5:00 PM",
				owner: currentUser?.name || "Meera Shah",
				priority: "Medium"
			});
			toast.success("Task added");
		},
		onError: (e) => toast.error(e.message || "Failed to add task")
	});
	const toggleTask = useMutation({
		mutationFn: async ({ id, status }) => api.put(`/students/${studentId}/tasks/${id}`, { status }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [
				"student",
				studentId,
				"tasks"
			] });
			toast.success("Task status updated");
		}
	});
	const deleteTask = useMutation({
		mutationFn: async (id) => api.del(`/students/${studentId}/tasks/${id}`),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [
				"student",
				studentId,
				"tasks"
			] });
			toast.success("Task deleted");
		}
	});
	const addDoc = useMutation({
		mutationFn: async () => api.post(`/students/${studentId}/documents`, docForm),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [
				"student",
				studentId,
				"documents"
			] });
			setDocOpen(false);
			setDocForm({
				name: "",
				size: "1.2 MB",
				status: "Verified"
			});
			toast.success("Document added");
		},
		onError: (e) => toast.error(e.message || "Failed to add document")
	});
	const deleteDoc = useMutation({
		mutationFn: async (id) => api.del(`/students/${studentId}/documents/${id}`),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [
				"student",
				studentId,
				"documents"
			] });
			toast.success("Document deleted");
		}
	});
	const addNote = useMutation({
		mutationFn: async () => api.post(`/students/${studentId}/notes`, {
			author: currentUser?.name || "Meera Shah",
			content: newNote.trim()
		}),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [
				"student",
				studentId,
				"notes"
			] });
			setNewNote("");
			toast.success("Note posted");
		},
		onError: (e) => toast.error(e.message || "Failed to post note")
	});
	const deleteNote = useMutation({
		mutationFn: async (id) => api.del(`/students/${studentId}/notes/${id}`),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [
				"student",
				studentId,
				"notes"
			] });
			toast.success("Note deleted");
		}
	});
	const addFollowup = useMutation({
		mutationFn: async () => api.post(`/students/${studentId}/followups`, followupForm),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [
				"student",
				studentId,
				"followups"
			] });
			setFollowupOpen(false);
			setFollowupForm({
				scheduled_at: "Tomorrow · 11:00 AM",
				channel: "Phone call",
				note: ""
			});
			toast.success("Follow-up scheduled");
		},
		onError: (e) => toast.error(e.message || "Failed to schedule")
	});
	const deleteFollowup = useMutation({
		mutationFn: async (id) => api.del(`/students/${studentId}/followups/${id}`),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [
				"student",
				studentId,
				"followups"
			] });
			toast.success("Follow-up deleted");
		}
	});
	const addComm = useMutation({
		mutationFn: async () => api.post(`/students/${studentId}/comms`, commForm),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: [
				"student",
				studentId,
				"comms"
			] });
			setCommOpen(false);
			setCommForm({
				channel: "Call",
				direction: "Outbound",
				subject: ""
			});
			toast.success("Communication logged");
		},
		onError: (e) => toast.error(e.message || "Failed to log")
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex items-center gap-2 py-10 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 311,
			columnNumber: 9
		}, this), " Loading student…"]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 310,
		columnNumber: 12
	}, this);
	const raw = studentRes?.data ?? studentRes;
	if (isError || !raw) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm font-medium",
				children: "Student not found"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 317,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: [
					"The ID “",
					studentId,
					"” does not exist in the database."
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 318,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				asChild: true,
				className: "mt-4 rounded-xl",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: "/students",
					children: "Back to Student Data"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 320,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 319,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 316,
		columnNumber: 12
	}, this);
	const stageIdx = Math.min(Math.max(0, Number(raw.stage_index ?? raw.stageIndex ?? 0) || 0), TIMELINE_STAGES.length - 1);
	const student = {
		id: raw.code ?? raw.id,
		numericId: raw.id,
		name: raw.name || "Student",
		email: raw.email || "—",
		phone: raw.phone || "—",
		dob: raw.dob || "—",
		passport: raw.passport || "—",
		country: raw.country || "—",
		course: raw.course || "—",
		university: raw.university || "—",
		intake: raw.intake || "—",
		counselor: {
			name: raw.counselor ?? raw.counselor_name ?? "Meera Shah",
			role: "Senior Counsellor"
		},
		branch: raw.branch || "Mumbai",
		leadScore: raw.lead_score ?? raw.leadScore ?? 75,
		stage: raw.stage ?? TIMELINE_STAGES[stageIdx].label,
		stageIndex: stageIdx,
		status: raw.status ?? "Active",
		createdAt: raw.created_at ? new Date(raw.created_at).toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric"
		}) : "Recently"
	};
	const initials = (student.name || "ST").split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "ST";
	const openEditModal = () => {
		setEditForm({
			name: student.name,
			email: student.email,
			phone: student.phone,
			dob: student.dob === "—" ? "" : student.dob,
			passport: student.passport === "—" ? "" : student.passport,
			country: student.country,
			university: student.university,
			course: student.course,
			intake: student.intake,
			counselor: student.counselor.name,
			branch: student.branch,
			lead_score: student.leadScore,
			status: student.status
		});
		setEditOpen(true);
	};
	const handleStageSelect = (index) => {
		const st = TIMELINE_STAGES[index];
		updateStudent.mutate({
			stage: st.label,
			stage_index: index
		});
	};
	const tasks = Array.isArray(tasksRes) ? tasksRes : tasksRes?.data ?? [];
	const documents = Array.isArray(docsRes) ? docsRes : docsRes?.data ?? [];
	const notes = Array.isArray(notesRes) ? notesRes : notesRes?.data ?? [];
	const followUps = Array.isArray(followupsRes) ? followupsRes : followupsRes?.data ?? [];
	const comms = Array.isArray(commsRes) ? commsRes : commsRes?.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "ghost",
						size: "sm",
						className: "gap-1.5 rounded-xl",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/students",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 388,
								columnNumber: 13
							}, this), " Back to Student Data"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 387,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 386,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-muted-foreground",
						children: "/"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 391,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-medium text-foreground",
						children: student.name
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 392,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-muted-foreground",
						children: [
							"(",
							student.id,
							")"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 393,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 385,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: student.name,
				description: `${student.id} · ${student.country} → ${student.university} · ${student.intake} (${student.branch} Branch)`,
				actions: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
						className: "gap-1 rounded-full bg-primary/10 text-primary hover:bg-primary/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 398,
								columnNumber: 15
							}, this),
							" ",
							student.status
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 397,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
						variant: "secondary",
						className: "gap-1 rounded-full bg-amber-100 text-amber-700",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Star, { className: "h-3 w-3 fill-amber-500 text-amber-500" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 401,
								columnNumber: 15
							}, this),
							" Lead score ",
							student.leadScore
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 400,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						size: "sm",
						className: "gap-1.5 rounded-xl",
						onClick: openEditModal,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PenLine, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 404,
							columnNumber: 15
						}, this), " Edit Profile"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 403,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "ghost",
						size: "sm",
						className: "gap-1.5 rounded-xl text-destructive hover:text-destructive",
						onClick: () => {
							if (confirm(`Are you sure you want to delete ${student.name}?`)) deleteStudent.mutate();
						},
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 411,
							columnNumber: 15
						}, this), " Delete"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 406,
						columnNumber: 13
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 396,
					columnNumber: 171
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 396,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl shadow-soft",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-col items-center text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Avatar, {
												className: "h-24 w-24 ring-4 ring-primary/10",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AvatarImage, {
													src: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(student.name)}`,
													alt: student.name
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 423,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AvatarFallback, {
													className: "bg-primary/10 text-lg font-semibold text-primary",
													children: initials
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 424,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 422,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "absolute -bottom-1 right-0 grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-emerald-500",
												children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-3.5 w-3.5 text-white" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 429,
													columnNumber: 21
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 428,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 421,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
											className: "mt-4 text-lg font-semibold text-foreground",
											children: student.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 432,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												student.id,
												" · ",
												student.branch
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 433,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "mt-4 flex w-full gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
													size: "sm",
													variant: "outline",
													className: "flex-1 gap-1.5",
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
														href: student.phone ? `tel:${student.phone}` : "#",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Phone, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 439,
															columnNumber: 23
														}, this), " Call"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 438,
														columnNumber: 21
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 437,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
													size: "sm",
													variant: "outline",
													className: "flex-1 gap-1.5",
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
														href: student.email ? `mailto:${student.email}` : "#",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mail, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 444,
															columnNumber: 23
														}, this), " Email"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 443,
														columnNumber: 21
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 442,
													columnNumber: 19
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
													size: "sm",
													variant: "outline",
													className: "flex-1 gap-1.5",
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
														href: student.phone ? `https://wa.me/${student.phone.replace(/[^0-9]/g, "")}` : "#",
														target: "_blank",
														rel: "noopener noreferrer",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageSquare, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 449,
															columnNumber: 23
														}, this), " Chat"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 448,
														columnNumber: 21
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 447,
													columnNumber: 19
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 436,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 420,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Separator, { className: "my-5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 455,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("dl", {
									className: "space-y-3.5 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Earth, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 459,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "text-xs text-muted-foreground",
													children: "Country"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 461,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "font-medium",
													children: student.country
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 462,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 460,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 458,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GraduationCap, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 466,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "text-xs text-muted-foreground",
													children: "Course"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 468,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "font-medium",
													children: student.course
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 469,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 467,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 465,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Building2, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 473,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "text-xs text-muted-foreground",
													children: "University"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 475,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "font-medium",
													children: student.university
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 476,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 474,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 472,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CalendarDays, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 480,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "text-xs text-muted-foreground",
													children: "Intake"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 482,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "font-medium",
													children: student.intake
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 483,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 481,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 479,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleUserRound, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 487,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "text-xs text-muted-foreground",
													children: "Counsellor"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 489,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "font-medium",
													children: student.counselor.name
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 490,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 488,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 486,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 494,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "text-xs text-muted-foreground",
													children: "Branch"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 496,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "font-medium",
													children: student.branch
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 497,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 495,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 493,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 457,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Separator, { className: "my-5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 502,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "space-y-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-muted-foreground",
												children: "Email"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 506,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-medium text-foreground",
												children: student.email
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 507,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 505,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-muted-foreground",
												children: "Phone"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 510,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-medium text-foreground",
												children: student.phone
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 511,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 509,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-muted-foreground",
												children: "DOB"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 514,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-medium text-foreground",
												children: student.dob
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 515,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 513,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-muted-foreground",
												children: "Passport"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 518,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-medium text-foreground",
												children: student.passport
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 519,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 517,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-muted-foreground",
												children: "Enquiry Date"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 522,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-medium text-foreground",
												children: student.createdAt
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 523,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 521,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 504,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 419,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 418,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
						className: "rounded-2xl shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
								className: "text-sm",
								children: [
									"Documents (",
									documents.length,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 532,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "ghost",
								size: "sm",
								className: "h-7 text-xs gap-1",
								onClick: () => setDocOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 534,
									columnNumber: 17
								}, this), " Add"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 533,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 531,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
							className: "space-y-1.5 pt-2",
							children: [documents.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "py-4 text-center text-xs text-muted-foreground",
								children: "No documents uploaded yet."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 538,
								columnNumber: 41
							}, this) : documents.map((d) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "group flex items-center gap-3 rounded-xl border p-2.5 hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 540,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 539,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "truncate text-xs font-semibold text-foreground",
											children: d.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 543,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-[11px] text-muted-foreground",
											children: [
												d.size || "1.0 MB",
												" · ",
												d.status || "Verified"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 544,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 542,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
										variant: "outline",
										className: "shrink-0 rounded-md text-[11px]",
										children: d.status || "Verified"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 548,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "ghost",
										size: "icon",
										className: "h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive",
										onClick: () => deleteDoc.mutate(d.id),
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3 w-3" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 552,
											columnNumber: 23
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 551,
										columnNumber: 21
									}, this)
								]
							}, d.id, true, {
								fileName: _jsxFileName,
								lineNumber: 538,
								columnNumber: 162
							}, this)), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								variant: "outline",
								size: "sm",
								className: "mt-2 w-full gap-1.5 rounded-xl",
								onClick: () => setDocOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 556,
									columnNumber: 17
								}, this), " Upload document"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 555,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 537,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 530,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 417,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
							className: "rounded-2xl shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
								className: "flex flex-row items-center justify-between pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
									className: "text-base",
									children: "Admission Journey"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 568,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										"Currently at ",
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-semibold text-primary",
											children: TIMELINE_STAGES[student.stageIndex]?.label
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 570,
											columnNumber: 32
										}, this),
										" · Step ",
										student.stageIndex + 1,
										" of ",
										TIMELINE_STAGES.length
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 569,
									columnNumber: 17
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 567,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									size: "sm",
									className: "gap-1.5 rounded-xl",
									onClick: () => setStageOpen(true),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PenLine, { className: "h-3.5 w-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 574,
										columnNumber: 17
									}, this), " Update stage"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 573,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 566,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
								className: "pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mb-6 flex items-center gap-1",
									children: TIMELINE_STAGES.map((t, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										title: `Click to set stage to ${t.label}`,
										onClick: () => handleStageSelect(i),
										className: `h-2 flex-1 rounded-full transition-all hover:scale-y-125 ${i < student.stageIndex ? "bg-primary" : i === student.stageIndex ? "bg-primary/80 ring-2 ring-primary/30" : "bg-muted hover:bg-muted-foreground/30"}`
									}, t.label, false, {
										fileName: _jsxFileName,
										lineNumber: 580,
										columnNumber: 48
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 579,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
									className: "relative space-y-4 border-l border-dashed border-border pl-6",
									children: TIMELINE_STAGES.map((t, i) => {
										const done = i < student.stageIndex;
										const cur = i === student.stageIndex;
										return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
											className: "relative cursor-pointer group",
											onClick: () => handleStageSelect(i),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: `absolute -left-[33px] grid h-7 w-7 place-items-center rounded-full border-2 border-background ring-1 transition-transform group-hover:scale-110 ${done ? "bg-primary text-primary-foreground ring-primary/30" : cur ? "bg-primary/10 text-primary ring-primary/40 font-bold" : "bg-muted text-muted-foreground ring-border"}`,
												children: done ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-4 w-4" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 590,
													columnNumber: 33
												}, this) : cur ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock, { className: "h-4 w-4" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 590,
													columnNumber: 78
												}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Circle, { className: "h-3 w-3" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 590,
													columnNumber: 110
												}, this)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 589,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: `rounded-xl border p-3 transition-all ${cur ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border bg-background group-hover:border-primary/20 group-hover:bg-muted/30"}`,
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex items-center justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
														className: `text-sm font-semibold ${cur ? "text-primary" : "text-foreground"}`,
														children: [
															t.label,
															" ",
															cur && /* @__PURE__ */ (void 0)("span", {
																className: "ml-2 text-xs font-normal text-primary",
																children: "● Active"
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 595,
																columnNumber: 47
															}, this)
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 594,
														columnNumber: 27
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "text-xs font-medium text-muted-foreground",
														children: done ? "Completed" : cur ? "In Progress" : "Upcoming"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 597,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 593,
													columnNumber: 25
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "mt-0.5 text-xs text-muted-foreground",
													children: t.defaultNote
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 601,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 592,
												columnNumber: 23
											}, this)]
										}, t.label, true, {
											fileName: _jsxFileName,
											lineNumber: 588,
											columnNumber: 24
										}, this);
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 584,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 577,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 565,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
							className: "rounded-2xl shadow-soft",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tabs, {
								defaultValue: "tasks",
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
									className: "pb-2",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsList, {
										className: "grid w-full grid-cols-3 rounded-xl bg-muted/60",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
												value: "tasks",
												className: "rounded-lg text-xs",
												children: [
													"Tasks (",
													tasks.length,
													")"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 614,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
												value: "followups",
												className: "rounded-lg text-xs",
												children: [
													"Follow-ups (",
													followUps.length,
													")"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 617,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
												value: "notes",
												className: "rounded-lg text-xs",
												children: [
													"Notes (",
													notes.length,
													")"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 620,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 613,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 612,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
									className: "pt-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
											value: "tasks",
											className: "mt-0 space-y-2",
											children: [tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "py-6 text-center text-xs text-muted-foreground",
												children: "No tasks added yet. Click \"Add task\" below."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 628,
												columnNumber: 41
											}, this) : tasks.map((t) => {
												const isDone = t.status === "Done" || t.status === "Completed";
												return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "group flex items-center justify-between rounded-xl border p-3 hover:bg-muted/30",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "flex items-start gap-3 min-w-0 flex-1",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
															type: "button",
															onClick: () => toggleTask.mutate({
																id: t.id,
																status: isDone ? "Open" : "Done"
															}),
															className: `mt-0.5 grid h-5 w-5 place-items-center rounded-md border transition-all ${isDone ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"}`,
															children: isDone && /* @__PURE__ */ (void 0)(Check, { className: "h-3.5 w-3.5" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 636,
																columnNumber: 42
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 632,
															columnNumber: 29
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
															className: "min-w-0 flex-1",
															children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
																className: `text-sm font-medium ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`,
																children: t.title
															}, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 639,
																columnNumber: 31
															}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
																className: "mt-0.5 text-xs text-muted-foreground",
																children: [
																	t.due_date || t.due || "No date",
																	" · ",
																	t.owner || "Meera Shah",
																	" ·",
																	" ",
																	/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
																		className: `font-semibold ${t.priority === "High" ? "text-red-500" : t.priority === "Medium" ? "text-amber-600" : "text-emerald-600"}`,
																		children: [t.priority || "Medium", " Priority"]
																	}, void 0, true, {
																		fileName: _jsxFileName,
																		lineNumber: 644,
																		columnNumber: 33
																	}, this)
																]
															}, void 0, true, {
																fileName: _jsxFileName,
																lineNumber: 642,
																columnNumber: 31
															}, this)]
														}, void 0, true, {
															fileName: _jsxFileName,
															lineNumber: 638,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 631,
														columnNumber: 27
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
														variant: "ghost",
														size: "icon",
														className: "h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive",
														onClick: () => deleteTask.mutate(t.id),
														children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 651,
															columnNumber: 29
														}, this)
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 650,
														columnNumber: 27
													}, this)]
												}, t.id, true, {
													fileName: _jsxFileName,
													lineNumber: 630,
													columnNumber: 26
												}, this);
											}), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "outline",
												size: "sm",
												className: "w-full gap-1.5 rounded-xl",
												onClick: () => setTaskOpen(true),
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 656,
													columnNumber: 21
												}, this), " Add task"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 655,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 627,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
											value: "followups",
											className: "mt-0 space-y-2",
											children: [followUps.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "py-6 text-center text-xs text-muted-foreground",
												children: "No follow-ups scheduled yet."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 662,
												columnNumber: 45
											}, this) : followUps.map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "group flex items-start justify-between rounded-xl border p-3 hover:bg-muted/30",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
															className: "text-xs font-semibold text-foreground",
															children: f.scheduled_at || f.when || "Upcoming"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 665,
															columnNumber: 29
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
															variant: "outline",
															className: "rounded-md text-[10px]",
															children: f.channel || "Call"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 666,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 664,
														columnNumber: 27
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
														className: "mt-1 text-xs text-muted-foreground",
														children: f.note || "Follow-up discussion"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 670,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 663,
													columnNumber: 25
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive",
													onClick: () => deleteFollowup.mutate(f.id),
													children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3 w-3" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 673,
														columnNumber: 27
													}, this)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 672,
													columnNumber: 25
												}, this)]
											}, f.id, true, {
												fileName: _jsxFileName,
												lineNumber: 662,
												columnNumber: 168
											}, this)), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "outline",
												size: "sm",
												className: "w-full gap-1.5 rounded-xl",
												onClick: () => setFollowupOpen(true),
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-3.5 w-3.5" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 677,
													columnNumber: 21
												}, this), " Schedule follow-up"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 676,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 661,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
											value: "notes",
											className: "mt-0 space-y-3",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "rounded-xl border p-3",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
													placeholder: "Add an internal counsellor note for this student…",
													className: "min-h-[72px] resize-none border-0 p-0 text-sm shadow-none focus-visible:ring-0",
													value: newNote,
													onChange: (e) => setNewNote(e.target.value)
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 684,
													columnNumber: 21
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "mt-2 flex items-center justify-between border-t pt-2",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "text-[11px] text-muted-foreground",
														children: ["Posting as ", currentUser?.name || "Counsellor"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 686,
														columnNumber: 23
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
														size: "sm",
														className: "h-7 gap-1 rounded-lg text-xs",
														disabled: !newNote.trim() || addNote.isPending,
														onClick: () => addNote.mutate(),
														children: [addNote.isPending ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-3 w-3 animate-spin" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 688,
															columnNumber: 46
														}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "h-3 w-3" }, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 688,
															columnNumber: 93
														}, this), " Post note"]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 687,
														columnNumber: 23
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 685,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 683,
												columnNumber: 19
											}, this), notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "py-4 text-center text-xs text-muted-foreground",
												children: "No notes recorded yet."
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 693,
												columnNumber: 41
											}, this) : notes.map((n) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "group relative rounded-xl bg-muted/40 p-3",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
														className: "text-xs font-semibold text-foreground",
														children: n.author || n.by || "Staff"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 695,
														columnNumber: 27
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
														className: "flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
															className: "text-[11px] text-muted-foreground",
															children: n.created_at ? new Date(n.created_at).toLocaleDateString("en-IN", {
																day: "2-digit",
																month: "short",
																hour: "2-digit",
																minute: "2-digit"
															}) : n.when || "Just now"
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 697,
															columnNumber: 29
														}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
															variant: "ghost",
															size: "icon",
															className: "h-5 w-5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive",
															onClick: () => deleteNote.mutate(n.id),
															children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3 w-3" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 706,
																columnNumber: 31
															}, this)
														}, void 0, false, {
															fileName: _jsxFileName,
															lineNumber: 705,
															columnNumber: 29
														}, this)]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 696,
														columnNumber: 27
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 694,
													columnNumber: 25
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "mt-1 text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap",
													children: n.content || n.text
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 710,
													columnNumber: 25
												}, this)]
											}, n.id, true, {
												fileName: _jsxFileName,
												lineNumber: 693,
												columnNumber: 154
											}, this))]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 682,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 625,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 611,
								columnNumber: 13
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 610,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
							className: "rounded-2xl shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardHeader, {
								className: "flex flex-row items-center justify-between pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardTitle, {
									className: "text-sm",
									children: [
										"Communication History (",
										comms.length,
										")"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 720,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									size: "sm",
									className: "h-7 gap-1 rounded-lg text-xs",
									onClick: () => setCommOpen(true),
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-3 w-3" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 722,
										columnNumber: 17
									}, this), " Log Activity"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 721,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 719,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
								className: "space-y-2 pt-2",
								children: [comms.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "py-4 text-center text-xs text-muted-foreground",
									children: "No communication logged yet."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 726,
									columnNumber: 37
								}, this) : comms.map((c) => {
									const Icon = c.channel === "Email" ? Mail : c.channel === "WhatsApp" ? MessageSquare : Phone;
									return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-start gap-3 rounded-xl border p-3 hover:bg-muted/30",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 730,
												columnNumber: 25
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 729,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "truncate text-xs font-semibold text-foreground",
												children: c.subject
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 733,
												columnNumber: 25
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-[11px] text-muted-foreground",
												children: [
													c.channel,
													" · ",
													c.direction || "Outbound",
													" ·",
													" ",
													c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN", {
														day: "2-digit",
														month: "short",
														hour: "2-digit",
														minute: "2-digit"
													}) : "Recent"
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 734,
												columnNumber: 25
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 732,
											columnNumber: 23
										}, this)]
									}, c.id, true, {
										fileName: _jsxFileName,
										lineNumber: 728,
										columnNumber: 22
									}, this);
								}), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										size: "sm",
										variant: "outline",
										className: "flex-1 gap-1.5 rounded-xl",
										onClick: () => {
											setCommForm({
												channel: "Call",
												direction: "Outbound",
												subject: `Phone discussion with ${student.name}`
											});
											setCommOpen(true);
										},
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Phone, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 755,
											columnNumber: 19
										}, this), " Log call"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 747,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										size: "sm",
										variant: "outline",
										className: "flex-1 gap-1.5 rounded-xl",
										onClick: () => {
											setCommForm({
												channel: "Email",
												direction: "Outbound",
												subject: `Sent documents / enquiry checklist to ${student.email}`
											});
											setCommOpen(true);
										},
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mail, { className: "h-3.5 w-3.5" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 765,
											columnNumber: 19
										}, this), " Log email"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 757,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 746,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 725,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 718,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 563,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 415,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: editOpen,
				onOpenChange: setEditOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-xl max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Edit Student Profile" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 779,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 778,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "Full Name *"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 784,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											value: editForm.name || "",
											onChange: (e) => setEditForm({
												...editForm,
												name: e.target.value
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 785,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 783,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "Email *"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 791,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											value: editForm.email || "",
											onChange: (e) => setEditForm({
												...editForm,
												email: e.target.value
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 792,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 790,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 782,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "Phone *"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 801,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											value: editForm.phone || "",
											onChange: (e) => setEditForm({
												...editForm,
												phone: e.target.value
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 802,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 800,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "Passport No."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 808,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											value: editForm.passport || "",
											onChange: (e) => setEditForm({
												...editForm,
												passport: e.target.value
											}),
											placeholder: "e.g. N7823910"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 809,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 807,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 799,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "Date of Birth"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 818,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											value: editForm.dob || "",
											onChange: (e) => setEditForm({
												...editForm,
												dob: e.target.value
											}),
											placeholder: "e.g. 14 Aug 2003"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 819,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 817,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "Branch"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 825,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
											value: editForm.branch || "Mumbai",
											onValueChange: (v) => setEditForm({
												...editForm,
												branch: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 830,
												columnNumber: 34
											}, this) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 830,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Mumbai",
													children: "Mumbai"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 832,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Delhi NCR",
													children: "Delhi NCR"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 833,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Bengaluru",
													children: "Bengaluru"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 834,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Chandigarh",
													children: "Chandigarh"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 835,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Hyderabad",
													children: "Hyderabad"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 836,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Kochi",
													children: "Kochi"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 837,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Guwahati HQ",
													children: "Guwahati HQ"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 838,
													columnNumber: 21
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 831,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 826,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 824,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 816,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "Country Destination"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 846,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
											value: editForm.country || "Canada",
											onValueChange: (v) => setEditForm({
												...editForm,
												country: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 851,
												columnNumber: 34
											}, this) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 851,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Canada",
													children: "Canada"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 853,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Australia",
													children: "Australia"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 854,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "United Kingdom",
													children: "United Kingdom"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 855,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "USA",
													children: "USA"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 856,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Germany",
													children: "Germany"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 857,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Ireland",
													children: "Ireland"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 858,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "India",
													children: "India"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 859,
													columnNumber: 21
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 852,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 847,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 845,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "Intake"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 864,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											value: editForm.intake || "",
											onChange: (e) => setEditForm({
												...editForm,
												intake: e.target.value
											}),
											placeholder: "e.g. Fall 2026"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 865,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 863,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 844,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "Target University"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 874,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											value: editForm.university || "",
											onChange: (e) => setEditForm({
												...editForm,
												university: e.target.value
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 875,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 873,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "Target Course"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 881,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											value: editForm.course || "",
											onChange: (e) => setEditForm({
												...editForm,
												course: e.target.value
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 882,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 880,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 872,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-3 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
												className: "text-xs",
												children: "Counsellor"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 891,
												columnNumber: 17
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
												value: editForm.counselor || "",
												onChange: (e) => setEditForm({
													...editForm,
													counselor: e.target.value
												})
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 892,
												columnNumber: 17
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 890,
											columnNumber: 15
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
												className: "text-xs",
												children: "Lead Score (0-100)"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 898,
												columnNumber: 17
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
												type: "number",
												value: editForm.lead_score ?? 70,
												onChange: (e) => setEditForm({
													...editForm,
													lead_score: Number(e.target.value)
												})
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 899,
												columnNumber: 17
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 897,
											columnNumber: 15
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "grid gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
												className: "text-xs",
												children: "Status"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 905,
												columnNumber: 17
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
												value: editForm.status || "Active",
												onValueChange: (v) => setEditForm({
													...editForm,
													status: v
												}),
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 910,
													columnNumber: 34
												}, this) }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 910,
													columnNumber: 19
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
														value: "Active",
														children: "Active"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 912,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
														value: "On Hold",
														children: "On Hold"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 913,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
														value: "Deferred",
														children: "Deferred"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 914,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
														value: "Enrolled",
														children: "Enrolled"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 915,
														columnNumber: 21
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
														value: "Inactive",
														children: "Inactive"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 916,
														columnNumber: 21
													}, this)
												] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 911,
													columnNumber: 19
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 906,
												columnNumber: 17
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 904,
											columnNumber: 15
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 889,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 781,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setEditOpen(false),
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 923,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: () => updateStudent.mutate(editForm),
							disabled: updateStudent.isPending,
							children: [updateStudent.isPending && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 925,
								columnNumber: 43
							}, this), " Save Changes"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 924,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 922,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 777,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 776,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: stageOpen,
				onOpenChange: setStageOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Update Admission Stage" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 935,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 934,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: "Select the current progress stage for this student:"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 937,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-2 max-h-[60vh] overflow-y-auto py-2",
							children: TIMELINE_STAGES.map((s, idx) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								type: "button",
								onClick: () => handleStageSelect(idx),
								className: `flex items-center justify-between rounded-xl border p-3 text-left transition-all ${idx === student.stageIndex ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border hover:bg-muted/40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-sm font-medium",
									children: [
										idx + 1,
										". ",
										s.label
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 941,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-xs text-muted-foreground",
									children: s.defaultNote
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 942,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 940,
									columnNumber: 17
								}, this), idx === student.stageIndex && /* @__PURE__ */ (void 0)(Check, { className: "h-4 w-4 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 944,
									columnNumber: 48
								}, this)]
							}, s.label, true, {
								fileName: _jsxFileName,
								lineNumber: 939,
								columnNumber: 46
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 938,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setStageOpen(false),
							children: "Close"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 948,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 947,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 933,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 932,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: taskOpen,
				onOpenChange: setTaskOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: ["Add Task for ", student.name] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 957,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 956,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Task Title *"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 961,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "e.g. Collect updated bank statements",
										value: taskForm.title,
										onChange: (e) => setTaskForm({
											...taskForm,
											title: e.target.value
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 962,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 960,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "Due Date"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 969,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											placeholder: "Tomorrow · 4:00 PM",
											value: taskForm.due_date,
											onChange: (e) => setTaskForm({
												...taskForm,
												due_date: e.target.value
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 970,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 968,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "Priority"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 976,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
											value: taskForm.priority,
											onValueChange: (v) => setTaskForm({
												...taskForm,
												priority: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 981,
												columnNumber: 34
											}, this) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 981,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "High",
													children: "High"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 983,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Medium",
													children: "Medium"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 984,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Low",
													children: "Low"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 985,
													columnNumber: 21
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 982,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 977,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 975,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 967,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Assigned Owner"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 991,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										value: taskForm.owner,
										onChange: (e) => setTaskForm({
											...taskForm,
											owner: e.target.value
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 992,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 990,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 959,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setTaskOpen(false),
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 999,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: () => addTask.mutate(),
							disabled: !taskForm.title.trim() || addTask.isPending,
							children: [addTask.isPending && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1001,
								columnNumber: 37
							}, this), " Add Task"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1e3,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 998,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 955,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 954,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: docOpen,
				onOpenChange: setDocOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Upload Document" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1011,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1010,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Select File"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1016,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										type: "file",
										className: "cursor-pointer",
										onChange: (e) => {
											const file = e.target.files?.[0];
											if (file) {
												const sizeMB = (file.size / 1048576).toFixed(1);
												setDocForm({
													...docForm,
													name: file.name,
													size: `${sizeMB} MB`
												});
											}
										}
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1017,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1015,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Document Name *"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1030,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "e.g. Passport_Copy.pdf",
										value: docForm.name,
										onChange: (e) => setDocForm({
											...docForm,
											name: e.target.value
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1031,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1029,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "File Size"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1038,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
											value: docForm.size,
											onChange: (e) => setDocForm({
												...docForm,
												size: e.target.value
											})
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1039,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1037,
										columnNumber: 15
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
											className: "text-xs",
											children: "Verification Status"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1045,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
											value: docForm.status,
											onValueChange: (v) => setDocForm({
												...docForm,
												status: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1050,
												columnNumber: 34
											}, this) }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1050,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Verified",
													children: "Verified"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1052,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Pending",
													children: "Pending"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1053,
													columnNumber: 21
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
													value: "Under Review",
													children: "Under Review"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 1054,
													columnNumber: 21
												}, this)
											] }, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 1051,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1046,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1044,
										columnNumber: 15
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1036,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1013,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setDocOpen(false),
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1061,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: () => addDoc.mutate(),
							disabled: !docForm.name.trim() || addDoc.isPending,
							children: [addDoc.isPending && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1063,
								columnNumber: 36
							}, this), " Save Document"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1062,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1060,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1009,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1008,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: followupOpen,
				onOpenChange: setFollowupOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Schedule Follow-up" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1073,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1072,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Scheduled Time"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1078,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										placeholder: "Tomorrow · 3:00 PM",
										value: followupForm.scheduled_at,
										onChange: (e) => setFollowupForm({
											...followupForm,
											scheduled_at: e.target.value
										})
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1079,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1077,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Channel"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1085,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: followupForm.channel,
										onValueChange: (v) => setFollowupForm({
											...followupForm,
											channel: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1090,
											columnNumber: 34
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1090,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "Phone call",
												children: "Phone call"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1092,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "In-person",
												children: "In-person"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1093,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "Video call",
												children: "Video call"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1094,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "WhatsApp",
												children: "WhatsApp"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1095,
												columnNumber: 21
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1091,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1086,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1084,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1076,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									className: "text-xs",
									children: "Follow-up Note / Objective *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1101,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
									placeholder: "Discuss financial documents and bank statement updates...",
									value: followupForm.note,
									onChange: (e) => setFollowupForm({
										...followupForm,
										note: e.target.value
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1102,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1100,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1075,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setFollowupOpen(false),
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1109,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: () => addFollowup.mutate(),
							disabled: !followupForm.note.trim() || addFollowup.isPending,
							children: [addFollowup.isPending && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1111,
								columnNumber: 41
							}, this), " Schedule"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1110,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1108,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1071,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1070,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
				open: commOpen,
				onOpenChange: setCommOpen,
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "Log Communication Activity" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1121,
							columnNumber: 13
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1120,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid gap-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Channel"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1126,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: commForm.channel,
										onValueChange: (v) => setCommForm({
											...commForm,
											channel: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1131,
											columnNumber: 34
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1131,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "Call",
												children: "Phone Call"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1133,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "Email",
												children: "Email"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1134,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
												value: "WhatsApp",
												children: "WhatsApp"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 1135,
												columnNumber: 21
											}, this)
										] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1132,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1127,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1125,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "grid gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
										className: "text-xs",
										children: "Direction"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 1140,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Select, {
										value: commForm.direction,
										onValueChange: (v) => setCommForm({
											...commForm,
											direction: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectValue, {}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1145,
											columnNumber: 34
										}, this) }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1145,
											columnNumber: 19
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Outbound",
											children: "Outbound"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1147,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SelectItem, {
											value: "Inbound",
											children: "Inbound"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 1148,
											columnNumber: 21
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 1146,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 1141,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 1139,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1124,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
									className: "text-xs",
									children: "Subject / Activity Summary *"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1154,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									placeholder: "e.g. Discussed SOP revisions and university selection",
									value: commForm.subject,
									onChange: (e) => setCommForm({
										...commForm,
										subject: e.target.value
									})
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 1155,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 1153,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1123,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "outline",
							onClick: () => setCommOpen(false),
							children: "Cancel"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 1162,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: () => addComm.mutate(),
							disabled: !commForm.subject.trim() || addComm.isPending,
							children: [addComm.isPending && /* @__PURE__ */ (void 0)(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 1164,
								columnNumber: 37
							}, this), " Log Communication"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1163,
							columnNumber: 13
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 1161,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1119,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1118,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 383,
		columnNumber: 10
	}, this);
}
//#endregion
export { StudentDetailsPage as component };
