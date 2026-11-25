import type { Saved } from "@/App";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Entry } from "@/data/timeline";
import { formatTime, getDisplayTitle, isSeasonEntry } from "@/utils/functions";
import { getThumbnailUrl } from "@/utils/image";
import { cn } from "cn";
import { Check, Clapperboard, Clock3 } from "lucide-react";

type EntryDetailsDialogProps = {
	entry: Entry | null;
	saved: Saved | null;
	onOpenChange: (open: boolean) => void;
	onToggleWatched: () => void;
	onToggleEpisode: (index: number, watched: boolean) => void;
	onMarkAll: (watched: boolean) => void;
	onSetProgress: (episodeIndex?: number) => void;
};

function Detail({ label, value }: { label: string; value?: string }) {
	if (!value) return null;

	return (
		<div className="flex flex-col gap-0.5">
			<dt className="text-muted-foreground text-xs">{label}</dt>
			<dd className="text-sm">{value}</dd>
		</div>
	);
}

export function EntryDetailsDialog({ entry, saved, onOpenChange, onToggleWatched, onToggleEpisode, onMarkAll, onSetProgress }: EntryDetailsDialogProps) {
	const open = entry !== null && saved !== null;
	const thumbnailUrl = entry ? getThumbnailUrl(entry.thumbnailPath) : undefined;

	const isSeries = entry ? isSeasonEntry(entry) : false;
	const watchedCount = saved?.episodes.filter(Boolean).length ?? 0;
	const totalEpisodes = entry && isSeasonEntry(entry) ? entry.episodes.length : 0;
	const seasonComplete = totalEpisodes > 0 && watchedCount === totalEpisodes;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
				{entry && saved && (
					<>
						<div className="bg-muted relative aspect-video max-h-56 w-full shrink-0 overflow-hidden">
							{thumbnailUrl ?
								<img src={thumbnailUrl} alt={`${entry.title} thumbnail`} className="size-full object-cover" />
							:	<div className="text-muted-foreground flex size-full items-center justify-center">
									<Clapperboard />
								</div>
							}
						</div>

						<ScrollArea className="min-h-0 flex-1">
							<div className="flex flex-col gap-4 p-4">
								<DialogHeader>
									<div className="flex flex-wrap items-center gap-2">
										<Badge variant="secondary">{entry.kind}</Badge>
										{entry.phase && <Badge variant="outline">{entry.phase}</Badge>}
										{entry.branch && entry.branch !== "Main" && <Badge variant="outline">{entry.branch}</Badge>}
										{!entry.released && <Badge variant="outline">Upcoming</Badge>}
									</div>
									<DialogTitle className="text-xl leading-tight">{getDisplayTitle(entry)}</DialogTitle>
									<DialogDescription>{entry.description ?? "No description available."}</DialogDescription>
								</DialogHeader>

								<dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
									<Detail label="Release" value={entry.releaseDate} />
									<Detail label="Timeline" value={entry.when} />
									<Detail label="Continuity" value={entry.continuity} />
									<Detail label="Canon status" value={entry.canonStatus} />
									<Detail label="Universe" value={entry.universe} />
									<Detail label="Timeline order" value={String(entry.timelineOrder)} />
									{!isSeasonEntry(entry) && <Detail label="Duration" value={entry.duration} />}
									{isSeasonEntry(entry) && <Detail label="Episodes" value={String(entry.episodes.length)} />}
								</dl>

								{entry.note && <p className="text-muted-foreground text-sm">{entry.note}</p>}

								{!isSeasonEntry(entry) && entry.alternateVersions && entry.alternateVersions.length > 0 && (
									<div className="flex flex-col gap-2">
										<h4 className="text-sm font-medium">Alternate versions</h4>
										<ul className="flex flex-col gap-1">
											{entry.alternateVersions.map((version) => (
												<li key={version.title} className="text-muted-foreground flex justify-between text-sm">
													<span>{version.title}</span>
													<span>
														{version.releaseDate}
														{version.duration && ` · ${version.duration}`}
													</span>
												</li>
											))}
										</ul>
									</div>
								)}

								<Separator />

								{isSeries && isSeasonEntry(entry) ?
									<div className="flex flex-col gap-3">
										<div className="flex items-center justify-between gap-3">
											<div className="flex flex-col gap-0.5">
												<h4 className="text-sm font-medium">{entry.season ? `Season ${entry.season}` : "Episodes"}</h4>
												<span className="text-muted-foreground text-xs">
													{watchedCount} of {totalEpisodes} episodes watched
												</span>
											</div>
											<Button size="sm" variant="outline" onClick={() => onMarkAll(!seasonComplete)}>
												{seasonComplete ? "Mark all unwatched" : "Mark all watched"}
											</Button>
										</div>

										<Progress value={totalEpisodes ? (watchedCount / totalEpisodes) * 100 : 0} />

										<ul className="flex flex-col gap-1">
											{entry.episodes.map((episode, index) => {
												const watched = saved.episodes[index] ?? false;
												const episodeProgress = saved.episodeProgress?.[index];

												return (
													<li
														key={episode.episode}
														role="button"
														tabIndex={0}
														onClick={() => onToggleEpisode(index, !watched)}
														className="hover:bg-muted/50 flex items-start gap-3 rounded-md p-2"
													>
														<Checkbox
															className="mt-0.5"
															checked={watched}
															onCheckedChange={(value) => onToggleEpisode(index, value === true)}
															aria-label={`Mark episode ${episode.episode} watched`}
														/>

														<div className="flex min-w-0 flex-1 flex-col gap-0.5">
															<span className={cn("text-sm", watched && "text-muted-foreground line-through")}>
																{String(episode.episode).padStart(2, "0")}. {episode.title}
															</span>
															<span className="text-muted-foreground text-xs">
																{episode.duration}
																{episode.when && ` · ${episode.when}`}
																{episodeProgress && ` · Stopped at ${formatTime(episodeProgress.position)}`}
															</span>
															{episode.description && <span className="text-muted-foreground text-xs">{episode.description}</span>}
															{episode.note && <span className="text-muted-foreground text-xs italic">{episode.note}</span>}
														</div>

														<Button size="sm" variant="ghost" onClick={() => onSetProgress(index)}>
															<Clock3 data-icon="inline-start" />
															{episodeProgress ? "Edit" : "Position"}
														</Button>
													</li>
												);
											})}
										</ul>
									</div>
								:	<div className="flex flex-col gap-3">
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">
												{saved.watched ?
													"Watched"
												: saved.progress ?
													`Stopped at ${formatTime(saved.progress.position)}`
												:	"Not watched"}
											</span>
										</div>
										<div className="flex gap-2">
											<Button variant="outline" className="flex-1" onClick={() => onSetProgress()}>
												<Clock3 data-icon="inline-start" />
												Position
											</Button>
											<Button variant={saved.watched ? "secondary" : "default"} className="flex-1" onClick={onToggleWatched}>
												{saved.watched ?
													<>
														<Check data-icon="inline-start" />
														Watched
													</>
												:	"Mark watched"}
											</Button>
										</div>
									</div>
								}
							</div>
						</ScrollArea>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
