import { ContinueWatching, type ResumeItem } from "@/components/continue-watching";
import { EntryDetailsDialog } from "@/components/entry-details-dialog";
import { Header } from "@/components/header";
import { PlaybackProgressDialog, type PlaybackProgress } from "@/components/playback-progress-dialog";
import { ProgressFooter } from "@/components/progress-footer";
import Providers from "@/components/providers";
import { Sidebar } from "@/components/sidebar";
import { TimelineFilters } from "@/components/timeline-filters";
import { TimelineGrid } from "@/components/timeline-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { timeline } from "@/data/timeline";
import { useProgressStats } from "@/hooks/use-progress-stats";
import { useTimelineFilters } from "@/hooks/use-timeline-filters";
import { useWatchProgress } from "@/hooks/use-watch-progress";
import { getEntryId, isSeasonEntry, parseDuration } from "@/utils/functions";
import { Bookmark, ChevronRight, ListChecks, Play } from "lucide-react";
import { useState } from "react";
import { SidebarInset } from "./components/ui/sidebar";

export type { Saved } from "@/hooks/use-watch-progress";

export type Tab = {
	id: "timeline" | "continue";
	name: string;
	logo: React.ElementType;
	plan: string;
};

function App() {
	const { store, setStore, get, toggleFilm, updateMovieProgress, toggleEp, updateEpisodeProgress, markAll } = useWatchProgress();
	const filters = useTimelineFilters(store, get);
	const counts = useProgressStats(store, get);
	const { filtered } = filters;
	const [detailsId, setDetailsId] = useState<string | null>(null);
	const tabs: Tab[] = [
		{ id: "timeline", name: "Timeline", logo: ListChecks, plan: "Free" },
		{ id: "continue", name: "Continue watching", logo: Bookmark, plan: "Free" },
	];
	const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
	const [progressTarget, setProgressTarget] = useState<{ id: string; title: string; episodeIndex?: number; progress?: PlaybackProgress } | null>(null);

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

	return (
		<Providers>
			<Sidebar
				tabs={tabs}
				activeTab={activeTab}
				onTabChange={(nextTab) => setActiveTab(tabs.find((tab) => tab.id === nextTab) ?? tabs[0])}
				entryCount={timeline.length}
				counts={counts}
				setStore={setStore}
			/>
			<SidebarInset>
				<Header setStore={setStore} />
				<main className="relative mx-auto w-full max-w-375 min-w-0 px-5 py-7 lg:px-8">
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
										setActiveTab(tabs.find((tab) => tab.id === "timeline") ?? tabs[0]);
										setDetailsId(getEntryId(next));
										document.getElementById(`entry-${getEntryId(next)}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
									}}
								>
									Pick up here <ChevronRight size={15} />
								</Button>
							</Card>
						)}
						{activeTab.id === "continue" && <ContinueWatching resume={resume} onResume={setProgressTarget} />}
						{activeTab.id === "timeline" && (
							<>
								<TimelineFilters filters={filters} filteredCount={filtered.length} totalCount={timeline.length} />
								<TimelineGrid
									entries={filtered}
									get={get}
									onMarkAll={markAll}
									onToggleFilm={toggleFilm}
									onOpenDetails={setDetailsId}
									onSetProgress={setProgressTarget}
								/>
							</>
						)}
						<ProgressFooter store={store} setStore={setStore} />
					</section>
				</main>
			</SidebarInset>
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
		</Providers>
	);
}
export default App;
