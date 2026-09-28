import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as ChevronRight, i as Moon, n as Sun, o as ChevronLeft, r as Plus, s as Check, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-3E3AnYze.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var VIDEO_EXTENSION = /\.(mp4|webm|ogg|mov|m4v)$/i;
var DEFAULT_IMAGE = "http://localhost:8080/bg-black.jpg";
function isVideoUrl(url) {
	const path = url.trim().split(/[?#]/, 1)[0] ?? "";
	return VIDEO_EXTENSION.test(path);
}
function BackgroundManager({ url }) {
	let source = url.trim();
	if (!source) source = DEFAULT_IMAGE;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none fixed inset-0 z-0 overflow-hidden",
		"aria-hidden": "true",
		children: [isVideoUrl(source) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			src: source,
			className: "size-full object-cover",
			autoPlay: true,
			muted: true,
			loop: true,
			playsInline: true
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: source,
			alt: "",
			className: "size-full object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-background/35 dark:bg-background/50" })]
	});
}
function Controls({ isRunning, onStart, onPause, onReset }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10 flex items-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: isRunning ? onPause : onStart,
			className: "rounded-full glass-soft-edge bg-primary px-10 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			children: isRunning ? "Pause" : "Start"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onReset,
			className: "rounded-full px-6 py-3 text-sm text-white transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
			children: "Reset"
		})]
	});
}
function GearIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "20",
		height: "20",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.5",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className,
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" })]
	});
}
var DEFAULT_SETTINGS = {
	focusMinutes: 45,
	shortBreakMinutes: 8,
	longBreakMinutes: 15,
	backgroundUrl: "",
	longBreakInterval: 4
};
var PHASE_LABELS = {
	focus: "Focus",
	short: "Short Break",
	long: "Long Break"
};
var ctx = null;
/**
* Plays a soft two-note bell chime via the Web Audio API (standard HTML5
* audio). Safe to call anywhere: failures are swallowed so a blocked audio
* context never breaks the timer.
*/
function playChime() {
	try {
		const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext;
		if (!AudioContextCtor) return;
		ctx ??= new AudioContextCtor();
		if (ctx.state === "suspended") ctx.resume();
		const start = ctx.currentTime + .05;
		for (const note of [{
			freq: 880,
			at: 0,
			peak: .2
		}, {
			freq: 1318.51,
			at: .18,
			peak: .16
		}]) {
			const t0 = start + note.at;
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.value = note.freq;
			gain.gain.setValueAtTime(1e-4, t0);
			gain.gain.exponentialRampToValueAtTime(note.peak, t0 + .02);
			gain.gain.exponentialRampToValueAtTime(1e-4, t0 + 1.1);
			osc.connect(gain).connect(ctx.destination);
			osc.start(t0);
			osc.stop(t0 + 1.2);
		}
	} catch {}
}
function clampMinutes(value) {
	if (!Number.isFinite(value)) return 1;
	return Math.min(120, Math.max(1, Math.round(value)));
}
function clampSettings(settings) {
	return {
		...settings,
		focusMinutes: clampMinutes(settings.focusMinutes),
		shortBreakMinutes: clampMinutes(settings.shortBreakMinutes),
		longBreakMinutes: clampMinutes(settings.longBreakMinutes)
	};
}
function durationFor(phase, settings) {
	return (phase === "focus" ? settings.focusMinutes : phase === "short" ? settings.shortBreakMinutes : settings.longBreakMinutes) * 60;
}
/**
* All Pomodoro state and timer logic lives here so the UI components stay
* presentational. The countdown derives remaining time from a deadline
* timestamp, so tab throttling never slows the clock.
*/
function usePomodoro() {
	const [phase, setPhase] = (0, import_react.useState)("focus");
	const [settings, setSettings] = (0, import_react.useState)(DEFAULT_SETTINGS);
	const [completedFocusSessions, setCompletedFocusSessions] = (0, import_react.useState)(0);
	const [isRunning, setIsRunning] = (0, import_react.useState)(false);
	const [secondsRemaining, setSecondsRemaining] = (0, import_react.useState)(() => durationFor("focus", DEFAULT_SETTINGS));
	const phaseRef = (0, import_react.useRef)(phase);
	const settingsRef = (0, import_react.useRef)(settings);
	const completedRef = (0, import_react.useRef)(completedFocusSessions);
	const secondsRef = (0, import_react.useRef)(secondsRemaining);
	const isRunningRef = (0, import_react.useRef)(isRunning);
	const deadlineRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		phaseRef.current = phase;
		settingsRef.current = settings;
		completedRef.current = completedFocusSessions;
		secondsRef.current = secondsRemaining;
		isRunningRef.current = isRunning;
	}, [
		phase,
		settings,
		completedFocusSessions,
		secondsRemaining,
		isRunning
	]);
	const advancePhase = (0, import_react.useCallback)(() => {
		const prev = phaseRef.current;
		const nextCompleted = prev === "focus" ? completedRef.current + 1 : completedRef.current;
		const next = prev === "focus" ? nextCompleted % settingsRef.current.longBreakInterval === 0 ? "long" : "short" : "focus";
		setCompletedFocusSessions(nextCompleted);
		setPhase(next);
		setSecondsRemaining(durationFor(next, settingsRef.current));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isRunning) return;
		if (deadlineRef.current === null) deadlineRef.current = Date.now() + secondsRef.current * 1e3;
		const id = window.setInterval(() => {
			const remaining = Math.max(0, Math.ceil(((deadlineRef.current ?? 0) - Date.now()) / 1e3));
			setSecondsRemaining(remaining);
			if (remaining <= 0) {
				deadlineRef.current = null;
				setIsRunning(false);
				playChime();
				advancePhase();
			}
		}, 250);
		return () => window.clearInterval(id);
	}, [isRunning, advancePhase]);
	const start = (0, import_react.useCallback)(() => {
		if (secondsRef.current <= 0) setSecondsRemaining(durationFor(phaseRef.current, settingsRef.current));
		deadlineRef.current = Date.now() + secondsRef.current * 1e3;
		setIsRunning(true);
	}, []);
	const pause = (0, import_react.useCallback)(() => {
		deadlineRef.current = null;
		setIsRunning(false);
	}, []);
	const reset = (0, import_react.useCallback)(() => {
		deadlineRef.current = null;
		setIsRunning(false);
		setSecondsRemaining(durationFor(phaseRef.current, settingsRef.current));
	}, []);
	const updateSettings = (0, import_react.useCallback)((next) => {
		const clamped = clampSettings(next);
		setSettings(clamped);
		if (!isRunningRef.current) setSecondsRemaining(durationFor(phaseRef.current, clamped));
	}, []);
	return {
		phase,
		settings,
		completedFocusSessions,
		secondsRemaining,
		totalSeconds: durationFor(phase, settings),
		isRunning,
		start,
		pause,
		reset,
		updateSettings
	};
}
var FIELDS = [
	{
		key: "focusMinutes",
		label: PHASE_LABELS.focus
	},
	{
		key: "shortBreakMinutes",
		label: PHASE_LABELS.short
	},
	{
		key: "longBreakMinutes",
		label: PHASE_LABELS.long
	}
];
function sanitizeDraft(draft, current) {
	const parse = (value, fallback) => {
		const parsed = Number.parseInt(value, 10);
		return Number.isNaN(parsed) ? fallback : parsed;
	};
	return clampSettings({
		...current,
		backgroundUrl: draft.backgroundUrl.trim(),
		focusMinutes: parse(draft.focusMinutes, current.focusMinutes),
		shortBreakMinutes: parse(draft.shortBreakMinutes, current.shortBreakMinutes),
		longBreakMinutes: parse(draft.longBreakMinutes, current.longBreakMinutes)
	});
}
function SettingsModal({ open, settings, onSave, onClose }) {
	const [draft, setDraft] = (0, import_react.useState)(settings);
	(0, import_react.useEffect)(() => {
		if (open) setDraft(settings);
	}, [open, settings]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKeyDown = (event) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, onClose]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Timer settings",
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-foreground/20 backdrop-blur-[2px]",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-foreground",
					children: "Settings"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-5",
					children: [FIELDS.map((field, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						htmlFor: `settings-${field.key}`,
						className: "text-sm text-muted-foreground",
						children: [field.label, " (minutes)"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: `settings-${field.key}`,
						type: "number",
						inputMode: "numeric",
						min: 1,
						max: 120,
						autoFocus: index === 0,
						value: draft[field.key],
						onChange: (event) => setDraft({
							...draft,
							[field.key]: event.target.valueAsNumber
						}),
						className: "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm tabular-nums text-foreground outline-none transition-colors focus:ring-2 focus:ring-ring"
					})] }, field.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "settings-background-url",
						className: "text-sm text-muted-foreground",
						children: "Custom background URL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "settings-background-url",
						type: "url",
						value: draft.backgroundUrl,
						onChange: (event) => setDraft({
							...draft,
							backgroundUrl: event.target.value
						}),
						placeholder: "Image or video URL",
						className: "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex items-center justify-end gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-full px-5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onSave(sanitizeDraft(draft, settings)),
						className: "rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85",
						children: "Save"
					})]
				})
			]
		})]
	});
}
function ThemeToggle({ isDark, onToggle }) {
	const label = isDark ? "Switch to light mode" : "Switch to dark mode";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		title: label,
		onClick: onToggle,
		className: "grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		children: isDark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {
			size: 19,
			strokeWidth: 1.5
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {
			size: 19,
			strokeWidth: 1.5
		})
	});
}
function formatClock(totalSeconds) {
	const safe = Math.max(0, totalSeconds);
	return `${Math.floor(safe / 60).toString().padStart(2, "0")}:${(safe % 60).toString().padStart(2, "0")}`;
}
var RADIUS = 150;
var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
function TimerDisplay({ phase, secondsRemaining, totalSeconds }) {
	const progress = totalSeconds > 0 ? 1 - secondsRemaining / totalSeconds : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: "340",
			height: "340",
			viewBox: "0 0 340 340",
			className: "-rotate-90",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "170",
				cy: "170",
				r: RADIUS,
				fill: "none",
				strokeWidth: "8",
				className: "stroke-border"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "170",
				cy: "170",
				r: RADIUS,
				fill: "none",
				strokeWidth: "5",
				strokeLinecap: "round",
				strokeDasharray: CIRCUMFERENCE,
				strokeDashoffset: CIRCUMFERENCE * (1 - progress),
				className: "stroke-foreground transition-[stroke-dashoffset] duration-300 ease-linear"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground",
				children: PHASE_LABELS[phase]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"aria-live": "polite",
				"aria-atomic": "true",
				className: "mt-4 text-7xl font-medium tabular-nums tracking-tight text-foreground sm:text-8xl",
				children: formatClock(secondsRemaining)
			})]
		})]
	});
}
function TodoList({ items, expanded, adding, draft, onAdd, onToggle, onDelete, onExpandedChange, onAddingChange, onDraftChange }) {
	const submit = (event) => {
		event.preventDefault();
		const text = draft.trim();
		if (!text) return;
		onAdd(text);
		onDraftChange("");
		onAddingChange(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: `fixed bottom-4 left-0 z-30 flex items-center transition-transform duration-300 ease-out md:bottom-auto md:top-1/2 md:-translate-y-1/2 ${expanded ? "translate-x-0" : "-translate-x-[calc(100%-2.5rem)]"}`,
		"aria-label": "Todo list",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-surface dark:bg-background/50 w-[min(24rem,calc(100vw-3.5rem))] rounded-r-lg  border-glass-border px-6 py-5 shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium text-foreground",
						children: "Tasks"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Add task",
						title: "Add task",
						onClick: () => onAddingChange(true),
						className: "grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							size: 17,
							strokeWidth: 1.5
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 max-h-64 space-y-3 overflow-y-auto",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-w-0 flex-1 cursor-pointer items-start gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: item.completed,
									onChange: () => onToggle(item.id),
									className: "peer sr-only"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 grid size-4 shrink-0 place-items-center rounded-sm border border-muted-foreground/60 text-transparent transition-colors peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										size: 11,
										strokeWidth: 2
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `min-w-0 break-words text-foreground transition-opacity ${item.completed ? "line-through opacity-45" : ""}`,
									children: item.text
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": `Remove task: ${item.text}`,
							title: "Remove task",
							onClick: () => onDelete(item.id),
							className: "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-muted-foreground opacity-40 transition-opacity hover:bg-accent hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								size: 13,
								strokeWidth: 1.5
							})
						})]
					}, item.id))
				}),
				adding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
					onSubmit: submit,
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						value: draft,
						onChange: (event) => onDraftChange(event.target.value),
						onBlur: () => {
							if (!draft.trim()) onAddingChange(false);
						},
						"aria-label": "New task",
						placeholder: "New task",
						className: "w-full border-0 border-b-1  bg-transparent px-0 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-white"
					})
				}),
				!items.length && !adding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs text-muted-foreground",
					children: "No tasks yet"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": expanded ? "Collapse todo list" : "Expand todo list",
			title: expanded ? "Collapse todo list" : "Expand todo list",
			"aria-expanded": expanded,
			onClick: () => onExpandedChange(!expanded),
			className: "glass-surface grid size-10 shrink-0 place-items-center rounded-r-md  border-glass-border text-muted-foreground shadow-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
			children: expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
				size: 18,
				strokeWidth: 1.5
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
				size: 18,
				strokeWidth: 1.5
			})
		})]
	});
}
function Index() {
	const pomodoro = usePomodoro();
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [isDark, setIsDark] = (0, import_react.useState)(false);
	const [todos, setTodos] = (0, import_react.useState)([]);
	const [nextTodoId, setNextTodoId] = (0, import_react.useState)(1);
	const [todoExpanded, setTodoExpanded] = (0, import_react.useState)(false);
	const [todoAdding, setTodoAdding] = (0, import_react.useState)(false);
	const [todoDraft, setTodoDraft] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", isDark);
		return () => document.documentElement.classList.remove("dark");
	}, [isDark]);
	const addTodo = (text) => {
		setTodos((current) => [...current, {
			id: nextTodoId,
			text,
			completed: false
		}]);
		setNextTodoId((current) => current + 1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-20 transition-colors sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackgroundManager, { url: pomodoro.settings.backgroundUrl }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-surface fixed right-4 top-4 z-30 flex items-center rounded-full border border-glass-border p-1 shadow-sm sm:right-6 sm:top-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {
					isDark,
					onToggle: () => setIsDark((value) => !value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Open settings",
					title: "Settings",
					onClick: () => setSettingsOpen(true),
					className: "grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GearIcon, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodoList, {
				items: todos,
				expanded: todoExpanded,
				adding: todoAdding,
				draft: todoDraft,
				onAdd: addTodo,
				onExpandedChange: setTodoExpanded,
				onAddingChange: setTodoAdding,
				onDraftChange: setTodoDraft,
				onToggle: (id) => setTodos((current) => current.map((item) => item.id === id ? {
					...item,
					completed: !item.completed
				} : item)),
				onDelete: (id) => setTodos((current) => current.filter((item) => item.id !== id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 flex flex-col items-center rounded-2xl px-3 py-8 sm:px-10 sm:py-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimerDisplay, {
					phase: pomodoro.phase,
					secondsRemaining: pomodoro.secondsRemaining,
					totalSeconds: pomodoro.totalSeconds
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controls, {
					isRunning: pomodoro.isRunning,
					onStart: pomodoro.start,
					onPause: pomodoro.pause,
					onReset: pomodoro.reset
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsModal, {
				open: settingsOpen,
				settings: pomodoro.settings,
				onSave: (next) => {
					pomodoro.updateSettings(next);
					setSettingsOpen(false);
				},
				onClose: () => setSettingsOpen(false)
			})
		]
	});
}
//#endregion
export { Index as component };
