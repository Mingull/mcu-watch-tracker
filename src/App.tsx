import { EntryDetailsDialog } from "@/components/entry-details-dialog";
import { Header } from "@/components/header";
import { PlaybackProgressDialog, type PlaybackProgress } from "@/components/playback-progress-dialog";
import Providers from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { timeline, type Entry, type McuPhase, type SeasonEntry } from "@/data/timeline";
import { formatTime, getEntryId, isSeasonEntry } from "@/utils/functions";
import { Activity, Bookmark, ChevronRight, Clock3, Filter, ListChecks, Play, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EntryCard } from "./components/entry-card";

export type Saved = {
	watched: boolean;
	episodes: boolean[];

	// Movies and specials
	progress?: PlaybackProgress;

	// Individual episodes, indexed by episode index
	episodeProgress?: Record<number, PlaybackProgress>;
};

type Store = Record<string, Saved>;

type ResumeItem = {
	e: Entry;
	episodeIndex?: number;
	progress: PlaybackProgress;
};

const STORAGE_KEY = "mcu-watch-tracker-v1";
const initial: Store = {};
function parseDuration(value?: string) {
	if (!value || value === "TBA") return 0;

	const hours = Number(value.match(/(\d+)\s*h/i)?.[1] ?? 0);
	const minutes = Number(value.match(/(\d+)\s*m/i)?.[1] ?? 0);
	const seconds = Number(value.match(/(\d+)\s*s/i)?.[1] ?? 0);

	return hours * 3600 + minutes * 60 + seconds;
}

function App() {
	const [store, setStore] = useState<Store>(() => {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
		} catch {
			return initial;
		}
	});
	const [query, setQuery] = useState("");
	const [kind, setKind] = useState("All");
	const [status, setStatus] = useState("All");
	const [phase, setPhase] = useState<McuPhase | "All">("All");
	const [detailsId, setDetailsId] = useState<string | null>(null);
	const [showBranches, setShowBranches] = useState(true);
	const [tab, setTab] = useState<"timeline" | "continue">("timeline");
	const [progressTarget, setProgressTarget] = useState<{ id: string; title: string; episodeIndex?: number; progress?: PlaybackProgress } | null>(null);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
	}, [store]);

	const get = (e: Entry): Saved => store[getEntryId(e)] ?? { watched: false, episodes: Array.from({ length: isSeasonEntry(e) ? e.episodes.length : 0 }, () => false) };

	const counts = useMemo(() => {
		let total = 0;
		let done = 0;
		let minutes = 0;
		let remaining = 0;

		timeline.forEach((e) => {
			const saved = get(e);
			if (isSeasonEntry(e)) {
				total += e.episodes.length;
				e.episodes.forEach((episode, index) => {
					const runtime = parseDuration(episode.duration);
					const watched = saved.episodes[index] ?? false;

					minutes += runtime;
					if (watched) done++;
					else remaining += runtime;
				});
			} else {
				total++;
				const runtime = parseDuration(e.duration);
				minutes += runtime;
				if (saved.watched) done++;
				else remaining += runtime;
			}
		});

		return {
			total,
			done,
			percent: total > 0 ? Math.round((done / total) * 100) : 0,
			minutes: Math.round(minutes / 60),
			remaining: Math.round(remaining / 60),
			left: total - done,
		};
	}, [store]);

	const filtered = useMemo(
		() =>
			timeline.filter((e) => {
				const saved = get(e);

				if (!showBranches && e.branch && e.branch !== "Main") return false;
				if (!e.title.toLowerCase().includes(query.toLowerCase())) return false;
				if (kind !== "All" && e.kind !== kind) return false;
				if (phase !== "All" && e.phase !== phase) return false;

				if (status === "Completed") return isSeasonEntry(e) ? saved.episodes.length > 0 && saved.episodes.every(Boolean) : saved.watched;
				if (status === "In progress") return isSeasonEntry(e) ? saved.episodes.some(Boolean) && !saved.episodes.every(Boolean) : false;
				if (status === "Unwatched") return isSeasonEntry(e) ? !saved.episodes.some(Boolean) : !saved.watched;
				if (status === "Upcoming") return !e.released;

				return true;
			}),
		[query, kind, phase, status, showBranches, store],
	);

	const next = timeline.find((e) => {
		const saved = get(e);

		return isSeasonEntry(e) ? saved.episodes.some((watched) => !watched) : !saved.watched && e.released;
	});

	const resume: ResumeItem[] = timeline
		.flatMap((e): ResumeItem[] => {
			const saved = get(e);

			if (isSeasonEntry(e)) {
				return Object.entries(saved.episodeProgress ?? {}).flatMap(([index, progress]) => {
					const episodeIndex = Number(index);
					if (!progress || saved.episodes[episodeIndex]) return [];
					return [{ e, episodeIndex, progress }];
				});
			}
			if (saved.progress && !saved.watched) return [{ e, progress: saved.progress }];
			return [];
		})
		.sort((a, b) => b.progress.updatedAt.localeCompare(a.progress.updatedAt))
		.slice(0, 4);

	function update(id: string, fn: (s: Saved) => Saved) {
		setStore((old) => {
			const entry = timeline.find((e) => getEntryId(e) === id);
			if (!entry) return old;

			const prev = old[id] ?? {
				watched: false,
				episodes: Array.from({ length: isSeasonEntry(entry) ? entry.episodes.length : 0 }, () => false),
			};
			return { ...old, [id]: fn(prev) };
		});
	}

	function toggleFilm(e: Entry, watched: boolean) {
		update(getEntryId(e), (saved) => ({ ...saved, watched, updatedAt: new Date().toISOString() }));
	}

	function updateMovieProgress(id: string, position: number, duration: number) {
		update(id, (saved) => ({ ...saved, progress: { position, duration, updatedAt: new Date().toISOString() } }));
	}
	function toggleEp(e: SeasonEntry, index: number, watched: boolean) {
		update(getEntryId(e), (saved) => {
			const episodes = [...saved.episodes];
			episodes[index] = watched;
			return { ...saved, episodes, updatedAt: new Date().toISOString() };
		});
	}

	function updateEpisodeProgress(id: string, episodeIndex: number, position: number, duration: number) {
		update(id, (saved) => ({
			...saved,
			episodeProgress: {
				...saved.episodeProgress,
				[episodeIndex]: { position, duration, updatedAt: new Date().toISOString() },
			},
		}));
	}

	function markAll(e: SeasonEntry, watched: boolean) {
		update(getEntryId(e), (saved) => ({
			...saved,
			watched,
			episodes: saved.episodes.map(() => watched),
			updatedAt: new Date().toISOString(),
		}));
	}

	const formatMinutes = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

	return (
		<Providers>
			<div className="bg-background text-foreground min-h-screen">
				<Header setStore={setStore} />
				<main className="relative mx-auto grid max-w-375 gap-7 px-5 py-7 lg:grid-cols-[230px_minmax(0,1fr)] lg:px-8">
					<aside className="space-y-6">
						<div>
							<div className="mb-3 px-2 text-[10px] font-semibold tracking-[.2em] text-zinc-500">WORKSPACE</div>
							<button
								onClick={() => setTab("timeline")}
								className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${tab === "timeline" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`}
							>
								<ListChecks size={17} /> Timeline <span className="ml-auto text-xs text-zinc-500">{timeline.length}</span>
							</button>
							<button
								onClick={() => setTab("continue")}
								className={`mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${tab === "continue" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`}
							>
								<Bookmark size={17} /> Continue watching
							</button>
						</div>
						<div>
							<div className="mb-3 px-2 text-[10px] font-semibold tracking-[.2em] text-zinc-500">YOUR PROGRESS</div>
							<Card className="space-y-4 p-4">
								<div className="flex items-end justify-between">
									<div>
										<div className="text-2xl font-semibold tabular-nums">{counts.percent}%</div>
										<div className="text-xs text-zinc-500">Universe completed</div>
									</div>
									<Activity className="mb-1 text-zinc-500" size={18} />
								</div>
								<Progress value={counts.percent} />
								<div className="grid grid-cols-2 gap-3 border-t border-zinc-800 pt-3">
									<div>
										<div className="text-lg font-semibold tabular-nums">{counts.done}</div>
										<div className="text-[11px] text-zinc-500">Watched units</div>
									</div>
									<div>
										<div className="text-lg font-semibold tabular-nums">{counts.left}</div>
										<div className="text-[11px] text-zinc-500">Remaining</div>
									</div>
								</div>
							</Card>
						</div>
						<div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
							<div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-300">
								<Clock3 size={14} /> MARATHON ESTIMATE
							</div>
							<div className="text-xl font-semibold">{formatMinutes(counts.remaining)}</div>
							<p className="mt-1 text-[11px] leading-relaxed text-zinc-500">Rough remaining runtime. Series episode lengths are estimates.</p>
						</div>
						<div className="px-2 text-[11px] leading-relaxed text-zinc-600">
							Progress is saved on this device in your browser. Use Export in the footer to back it up.
						</div>
					</aside>
					<section className="min-w-0">
						<div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
							<div>
								<div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
									<span>MARVEL STUDIOS</span>
									<span>/</span>
									<span>CHRONOLOGICAL ORDER</span>
								</div>
								<h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
									The MCU timeline<span className="text-zinc-600">.</span>
								</h1>
								<p className="mt-2 max-w-2xl text-sm text-zinc-400">
									Follow the story from ancient Wakanda to the multiverse. Track every film, special and episode as you go.
								</p>
							</div>
							<div className="flex items-center gap-2">
								<Badge>{timeline.length} entries</Badge>
								<Badge>Updated Nov 2026</Badge>
							</div>
						</div>
						{next && (
							<Card className="mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-900 text-zinc-300">
										<Play size={18} fill="currentColor" />
									</div>
									<div>
										<div className="mb-1 text-[10px] font-semibold tracking-[.18em] text-zinc-500">UP NEXT IN YOUR TIMELINE</div>
										<div className="font-semibold">{next.title}</div>
										<div className="mt-0.5 text-xs text-zinc-500">
											{next.when} <span className="px-1">·</span>{" "}
											{isSeasonEntry(next) ? `${get(next).episodes.filter(Boolean).length + 1} of ${next.episodes.length} episodes` : next.duration}
										</div>
									</div>
								</div>
								<Button
									onClick={() => {
										setTab("timeline");
										setDetailsId(getEntryId(next));
										document.getElementById(`entry-${getEntryId(next)}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
									}}
								>
									Pick up here <ChevronRight size={15} />
								</Button>
							</Card>
						)}
						{tab === "continue" && (
							<div className="mb-6">
								<h2 className="mb-3 text-lg font-semibold">Continue watching</h2>
								{resume.length ?
									resume.map(({ e, episodeIndex, progress }) => {
										const title = episodeIndex !== undefined ? `${e.title} — Episode ${episodeIndex + 1}` : e.title;

										return (
											<Card key={`${getEntryId(e)}-${episodeIndex ?? "movie"}`} className="mb-2 flex items-center justify-between gap-3 p-4">
												<div className="min-w-0 flex-1">
													<div className="truncate font-medium">{title}</div>

													<div className="mt-1 text-xs text-zinc-500">
														Stopped at {formatTime(progress.position)} / {formatTime(progress.duration)}
													</div>

													<Progress className="mt-3" value={(progress.position / progress.duration) * 100} />
												</div>

												<Button size="sm" onClick={() => setProgressTarget({ id: getEntryId(e), title, episodeIndex, progress })}>
													<Play size={14} />
													Resume
												</Button>
											</Card>
										);
									})
								:	<Card className="p-8 text-center text-sm text-zinc-500">
										Nothing in progress yet. Set a playback position on a movie or episode to see it here.
									</Card>
								}
							</div>
						)}
						{tab === "timeline" && (
							<>
								<div className="mb-4 flex flex-col gap-3 xl:flex-row">
									<div className="relative min-w-0 flex-1">
										<Search className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500" size={16} />
										<input
											value={query}
											onChange={(e) => setQuery(e.target.value)}
											placeholder="Search movies, series, specials…"
											className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 pr-3 pl-9 text-sm outline-none placeholder:text-zinc-600 focus:border-zinc-600"
										/>
									</div>
									<div className="flex flex-wrap gap-2">
										<select
											value={kind}
											onChange={(e) => setKind(e.target.value)}
											className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none"
										>
											<option>All</option>
											<option>Film</option>
											<option>Series</option>
											<option>Special</option>
											<option>One-shot</option>
										</select>
										<select
											value={phase}
											onChange={(e) => setPhase(e.target.value as McuPhase | "All")}
											className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none"
										>
											<option>All</option>
											{["Phase One", "Phase Two", "Phase Three", "Phase Four", "Phase Five", "Phase Six", "Marvel Television"].map((p) => (
												<option key={p}>{p}</option>
											))}
										</select>
										<select
											value={status}
											onChange={(e) => setStatus(e.target.value)}
											className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none"
										>
											<option>All</option>
											<option>Unwatched</option>
											<option>In progress</option>
											<option>Completed</option>
											<option>Upcoming</option>
										</select>
									</div>
								</div>
								<div className="mb-4 flex items-center justify-between">
									<div className="text-xs text-zinc-500">
										Showing <span className="text-zinc-300">{filtered.length}</span> of {timeline.length} entries
									</div>
									<button
										onClick={() => setShowBranches(!showBranches)}
										className={`flex items-center gap-2 text-xs ${showBranches ? "text-zinc-300" : "text-zinc-500"}`}
									>
										<Checkbox checked={showBranches} onCheckedChange={setShowBranches} /> Include multiverse / alternate timelines
									</button>
								</div>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
									{filtered.map((e, i) => {
										const s = get(e);
										const done = isSeasonEntry(e) ? s.episodes.filter(Boolean).length : Number(s.watched);
										const complete = isSeasonEntry(e) ? s.episodes.length > 0 && done === s.episodes.length : s.watched;
										const progress =
											isSeasonEntry(e) ? (done / e.episodes.length) * 100
											: s.watched ? 100
											: 0;

										return (
											<EntryCard
												key={getEntryId(e)}
												entry={e}
												saved={s}
												complete={complete}
												progressPercent={progress}
												onToggleWatched={() => {
													if (isSeasonEntry(e)) {
														markAll(e, !complete);
													} else {
														toggleFilm(e, !s.watched);
													}
												}}
												onOpenDetails={() => setDetailsId(getEntryId(e))}
												onSetProgress={() => {
													if (isSeasonEntry(e)) {
														setDetailsId(getEntryId(e));
													} else {
														setProgressTarget({
															id: getEntryId(e),
															title: e.title,
															progress: s.progress,
														});
													}
												}}
											/>
										);
									})}
									{filtered.length === 0 && (
										<Card className="p-10 text-center">
											<Filter className="mx-auto mb-3 text-zinc-600" />
											<div className="text-sm font-medium">No titles found</div>
											<div className="mt-1 text-xs text-zinc-500">Try changing your search or filters.</div>
										</Card>
									)}
								</div>
							</>
						)}
						<footer className="mt-8 flex flex-col gap-3 border-t border-zinc-800 pt-5 text-[11px] leading-relaxed text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
							<div>
								Timeline is a curated chronological guide, not a claim that every placement is officially fixed. In-universe dates marked “approx.” are estimates.
								Series are grouped by season; episode progress is tracked individually.
							</div>
							<div className="flex shrink-0 gap-2">
								<Button
									size="sm"
									variant="outline"
									onClick={() => {
										const blob = new Blob([JSON.stringify(store, null, 2)], {
											type: "application/json",
										});
										const url = URL.createObjectURL(blob);
										const a = document.createElement("a");
										a.href = url;
										a.download = "mcu-watch-progress.json";
										a.click();
										URL.revokeObjectURL(url);
									}}
								>
									Export progress
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => {
										const input = document.createElement("input");
										input.type = "file";
										input.accept = ".json,application/json";
										input.onchange = () => {
											const f = input.files?.[0];
											if (!f) return;
											const reader = new FileReader();
											reader.onload = () => {
												try {
													setStore(JSON.parse(String(reader.result)));
												} catch {
													alert("Invalid progress file");
												}
											};
											reader.readAsText(f);
										};
										input.click();
									}}
								>
									Import
								</Button>
							</div>
						</footer>
					</section>
				</main>
				{(() => {
					const detailsEntry = detailsId ? (timeline.find((e) => getEntryId(e) === detailsId) ?? null) : null;

					return (
						<EntryDetailsDialog
							entry={detailsEntry}
							saved={detailsEntry ? get(detailsEntry) : null}
							onOpenChange={(open) => {
								if (!open) setDetailsId(null);
							}}
							onToggleWatched={() => detailsEntry && toggleFilm(detailsEntry, !get(detailsEntry).watched)}
							onToggleEpisode={(index, watched) => detailsEntry && isSeasonEntry(detailsEntry) && toggleEp(detailsEntry, index, watched)}
							onMarkAll={(watched) => detailsEntry && isSeasonEntry(detailsEntry) && markAll(detailsEntry, watched)}
							onSetProgress={(episodeIndex) => {
								if (!detailsEntry) return;

								const saved = get(detailsEntry);

								if (episodeIndex !== undefined && isSeasonEntry(detailsEntry)) {
									setProgressTarget({
										id: getEntryId(detailsEntry),
										title: `${detailsEntry.title} — ${detailsEntry.episodes[episodeIndex]?.title}`,
										episodeIndex,
										progress: saved.episodeProgress?.[episodeIndex],
									});
								} else {
									setProgressTarget({ id: getEntryId(detailsEntry), title: detailsEntry.title, progress: saved.progress });
								}
							}}
						/>
					);
				})()}
				{progressTarget && (
					<PlaybackProgressDialog
						open={true}
						title={progressTarget.title}
						progress={progressTarget.progress}
						defaultDuration={(() => {
							const entry = timeline.find((e) => getEntryId(e) === progressTarget.id);

							if (!entry) return 0;

							if (progressTarget.episodeIndex !== undefined) {
								if (!isSeasonEntry(entry)) return 0;

								return parseDuration(entry.episodes[progressTarget.episodeIndex]?.duration);
							}

							return !isSeasonEntry(entry) ? parseDuration(entry.duration) : 0;
						})()}
						onOpenChange={(open) => {
							if (!open) setProgressTarget(null);
						}}
						onSave={(position, duration) => {
							if (progressTarget.episodeIndex !== undefined) {
								updateEpisodeProgress(progressTarget.id, progressTarget.episodeIndex, position, duration);
							} else {
								updateMovieProgress(progressTarget.id, position, duration);
							}

							setProgressTarget(null);
						}}
					/>
				)}
			</div>
		</Providers>
	);
}
export default App;
