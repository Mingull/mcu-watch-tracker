import { Check, ChevronDown, ChevronRight, Clapperboard, Clock3, Film, Tv } from "lucide-react";
import { formatTime, getDisplayTitle, getEntryId, isSeasonEntry } from "../utils/functions";
import { getPosterUrl } from "../utils/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import type { PlaybackProgress } from "./playback-progress-dialog";
import { Checkbox } from "./ui/checkbox";

type OldEntryCardProps = {
	e: any;
	s: any;
	complete: boolean;
	open: boolean;
	expanded: string | null;
	timeline: any[];
	progress: number;
	done: number;
	setExpanded: (id: string | null) => void;
	toggleFilm: (e: any, watched: boolean) => void;
	setProgressTarget: React.Dispatch<React.SetStateAction<{ id: string; title: string; episodeIndex?: number; progress?: PlaybackProgress } | null>>;
	markAll: (e: any, watched: boolean) => void;
	toggleEp: (e: any, episodeIndex: number, watched: boolean) => void;
};
export function OldEntryCard({ e, s, complete, open, expanded, timeline, progress, done, setExpanded, toggleFilm, setProgressTarget, markAll, toggleEp }: OldEntryCardProps) {
	return (
		<Card id={`entry-${getEntryId(e)}`} key={getEntryId(e)} className={`overflow-hidden transition-colors ${complete ? "border-zinc-800/70" : "hover:border-zinc-700"}`}>
			<div className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-4 sm:px-4">
				<div className="relative h-48 w-32 shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900">
					{e.posterPath && e.posterPath !== "" ?
						<img
							src={getPosterUrl(e.posterPath)}
							alt={`${e.title} poster`}
							loading="lazy"
							className={`aspect-2/3 h-full w-full object-cover transition-opacity ${complete ? "opacity-60" : "opacity-100"}`}
						/>
					:	<div className="flex h-full w-full items-center justify-center text-zinc-600">
							{e.kind === "Film" ?
								<Film size={17} />
							: e.kind === "Series" ?
								<Tv size={17} />
							:	<Clapperboard size={17} />}
						</div>
					}
					{complete && (
						<div className="absolute right-1 bottom-1 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
							<Check size={14} strokeWidth={3} />
						</div>
					)}
				</div>
				<button
					onClick={() => (isSeasonEntry(e) ? setExpanded(open ? null : getEntryId(e)) : toggleFilm(e, !s.watched))}
					className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${complete ? "border-zinc-600 bg-zinc-100 text-zinc-950" : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-zinc-200"}`}
					title={complete ? "Mark unwatched" : "Mark watched"}
				>
					{complete ?
						<Check size={17} />
					: e.kind === "Film" ?
						<Film size={17} />
					: e.kind === "Series" ?
						<Tv size={17} />
					:	<Clapperboard size={17} />}
				</button>
				<div
					onClick={() => (isSeasonEntry(e) ? setExpanded(open ? null : getEntryId(e)) : toggleFilm(e, !s.watched))}
					className="hidden shrink-0 text-center text-xs text-zinc-600 tabular-nums sm:block"
				></div>
				<div className="min-w-0 flex-1">
					<div className={`text-sm leading-snug font-semibold sm:text-base ${complete ? "text-muted-foreground" : "text-foreground"}`}>
						{String(timeline.findIndex((x) => getEntryId(x) === getEntryId(e)) + 1).padStart(2, "0")}. {getDisplayTitle(e)}
					</div>
					<div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-zinc-500">
						<span>{e.when}</span>
						<span className="text-zinc-700">·</span>
						<span>{e.kind}</span>
						<span className="text-zinc-700">·</span>
						<span>{e.releaseDate}</span>
						{isSeasonEntry(e) ?
							<>
								<span className="text-zinc-700">·</span>
								<span>{e.episodes.length} episodes</span>
							</>
						:	e.duration && (
								<>
									<span className="text-zinc-700">·</span>
									<span>{e.duration}</span>
								</>
							)
						}
						{e.branch && e.branch !== "Main" && <Badge className="px-1.5 py-0 text-[9px]">{e.branch}</Badge>}
						{e.released === false && <Badge className="border-amber-900/70 bg-amber-950/30 px-1.5 py-0 text-[9px] text-amber-300">Upcoming</Badge>}
					</div>
					{!isSeasonEntry(e) && s.progress && !s.watched && (
						<div className="mt-2 max-w-xs">
							<div className="mb-1 flex justify-between text-[10px] text-zinc-500">
								<span>Stopped at {formatTime(s.progress.position)}</span>
								<span>{Math.round(s.progress.duration > 0 ? (s.progress.position / s.progress.duration) * 100 : 0)}%</span>
							</div>

							<Progress value={s.progress.duration > 0 ? (s.progress.position / s.progress.duration) * 100 : 0} />
						</div>
					)}
				</div>
				<div className="hidden w-28 shrink-0 sm:block">
					<div className="mb-1 flex justify-between text-[10px] text-zinc-500">
						<span>{e.phase}</span>
						<span>{Math.round(progress)}%</span>
					</div>
					<Progress value={progress} />
				</div>
				{isSeasonEntry(e) ?
					<button
						onClick={() => setExpanded(open ? null : getEntryId(e))}
						className="flex h-9 items-center gap-1 rounded-md px-2 text-xs text-zinc-400 hover:bg-zinc-900"
					>
						<span className="hidden sm:inline">
							{done}/{e.episodes.length}
						</span>
						{open ?
							<ChevronDown size={16} />
						:	<ChevronRight size={16} />}
					</button>
				:	<div className="flex items-center gap-2">
						<Button size="sm" variant="outline" onClick={() => setProgressTarget({ id: getEntryId(e), title: e.title, progress: s.progress })}>
							<Clock3 size={14} />
							{s.progress ? "Update position" : "Set position"}
						</Button>

						<Button size="sm" variant={s.watched ? "ghost" : "default"} onClick={() => toggleFilm(e, !s.watched)}>
							{s.watched ? "Watched" : "Mark watched"}
						</Button>
					</div>
				}
			</div>
			{open && isSeasonEntry(e) && (
				<div className="border-t border-zinc-800 bg-zinc-950/70 px-4 py-4 sm:pl-18">
					<div className="mb-3 flex items-center justify-between">
						<div>
							<div className="text-xs font-medium text-zinc-300">{e.season ? `Season ${e.season}` : "Episodes"}</div>
							<div className="mt-0.5 text-[11px] text-zinc-500">
								{done} of {e.episodes.length} episodes watched
							</div>
						</div>
						<Button size="sm" variant="outline" onClick={() => markAll(e, !complete)}>
							{complete ? "Mark all unwatched" : "Mark all watched"}
						</Button>
					</div>
					<div className="grid gap-1 sm:grid-cols-2">
						{e.episodes.map((episode, idx) => {
							const watched = s.episodes[idx] ?? false;
							const episodeProgress = s.episodeProgress?.[idx];

							return (
								<div key={episode.episode} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-zinc-900">
									<Checkbox checked={watched} onCheckedChange={(value) => toggleEp(e, idx, value === true)} />

									<div className="min-w-0 flex-1">
										<div className={`truncate text-xs ${watched ? "text-zinc-500 line-through" : "text-zinc-300"}`}>
											{String(episode.episode).padStart(2, "0")}. {episode.title}
										</div>

										<div className="mt-0.5 text-[10px] text-zinc-500">
											{episode.duration}
											{episodeProgress && ` · Stopped at ${formatTime(episodeProgress.position)}`}
										</div>
									</div>

									<Button
										size="sm"
										variant="ghost"
										onClick={() =>
											setProgressTarget({
												id: getEntryId(e),
												title: `${e.title} — ${episode.title}`,
												episodeIndex: idx,
												progress: episodeProgress,
											})
										}
									>
										<Clock3 size={14} />
										{episodeProgress ? "Edit" : "Position"}
									</Button>
								</div>
							);
						})}
					</div>
					{e.note && <p className="mt-3 border-t border-zinc-800 pt-3 text-[11px] leading-relaxed text-zinc-500">{e.note}</p>}
				</div>
			)}
		</Card>
	);
}
