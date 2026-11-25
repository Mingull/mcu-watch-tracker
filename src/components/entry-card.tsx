import type { Saved } from "@/App";
import type { Entry } from "@/data/timeline";
import { formatTime, getDisplayTitle, getEntryId, isSeasonEntry } from "@/utils/functions";
import { cn } from "cn";
import { Check, Clapperboard, Clock3 } from "lucide-react";
import { getThumbnailUrl } from "../utils/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

type EntryCardProps = {
	entry: Entry;
	saved: Saved;
	complete: boolean;
	progressPercent: number;
	onToggleWatched: () => void;
	onOpenDetails: () => void;
	onSetProgress: () => void;
};

export function EntryCard({ entry, saved, complete, progressPercent, onToggleWatched, onOpenDetails, onSetProgress }: EntryCardProps) {
	const thumbnailUrl = getThumbnailUrl(entry.thumbnailPath);
	const isSeries = isSeasonEntry(entry);
	const watchedCount = saved.episodes.filter(Boolean).length;

	return (
		<Card
			id={`entry-${getEntryId(entry)}`}
			role="button"
			tabIndex={0}
			aria-label={`View details for ${entry.title}`}
			onClick={onOpenDetails}
			onKeyDown={(event) => {
				if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
					event.preventDefault();
					onOpenDetails();
				}
			}}
			className={cn("group flex h-full cursor-pointer flex-col overflow-hidden pt-0 transition-colors", !complete && "hover:ring-foreground/25")}
		>
			{/* Thumbnail and floating actions */}
			<div className="relative">
				<div className="bg-muted relative aspect-video w-full overflow-hidden">
					{thumbnailUrl ?
						<img
							src={thumbnailUrl}
							alt={`${entry.title} thumbnail`}
							loading="lazy"
							className={cn("size-full object-cover transition duration-300 group-hover:scale-[1.02]", complete && "opacity-60")}
						/>
					:	<div className="text-muted-foreground flex size-full items-center justify-center">
							<Clapperboard />
						</div>
					}

					<div className="absolute top-3 left-3 flex gap-2">
						<Badge variant="secondary">{entry.kind}</Badge>
						{!entry.released && <Badge variant="outline">Upcoming</Badge>}
					</div>

					{complete && (
						<Badge className="absolute top-3 right-3">
							<Check data-icon="inline-start" />
							Completed
						</Badge>
					)}
				</div>
				{/* Floating actions */}
				<div className="absolute right-3 bottom-3 flex gap-2">
					<Button
						size="icon-sm"
						variant="secondary"
						className="shadow-lg backdrop-blur-sm"
						aria-label={isSeries ? "View episode progress" : "Set playback position"}
						title={isSeries ? "View episode progress" : "Set playback position"}
						onClick={(event) => {
							event.stopPropagation();
							onSetProgress();
						}}
					>
						<Clock3 />
					</Button>

					<Button
						size="icon-sm"
						variant={complete ? "reverse" : "default"}
						className="shadow-lg"
						aria-label={complete ? "Mark as unwatched" : "Mark as watched"}
						title={complete ? "Mark as unwatched" : "Mark as watched"}
						onClick={(event) => {
							event.stopPropagation();
							onToggleWatched();
						}}
					>
						<Check />
					</Button>
				</div>
			</div>

			{/* Main information */}
			<CardHeader className="gap-1.5">
				<CardTitle className="line-clamp-2 text-base leading-snug">{getDisplayTitle(entry)}</CardTitle>

				<CardDescription className="flex flex-wrap items-center gap-x-1.5 text-xs">
					{/* Timeline metadata */}
					<span>{entry.when}</span>
					{entry.phase && (
						<>
							<span>·</span>
							<span>{entry.phase}</span>
						</>
					)}
					{isSeries ?
						<>
							<span>·</span>
							<span>{entry.episodes.length} episodes</span>
						</>
					:	<>
							<span>·</span>
							<span>{entry.duration ?? "Runtime unknown"}</span>
						</>
					}
				</CardDescription>

				{entry.branch && entry.branch !== "Main" && (
					<div className="pt-1">
						<Badge variant="outline">{entry.branch}</Badge>
					</div>
				)}
			</CardHeader>

			<CardContent className="flex flex-1 flex-col gap-4">
				{/* Watch progress */}
				<div className="mt-auto flex flex-col gap-2">
					<div className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
						<span className="truncate">
							{isSeries ?
								`${watchedCount} of ${entry.episodes.length} episodes watched`
							: saved.watched ?
								"Watched"
							: saved.progress ?
								`Stopped at ${formatTime(saved.progress.position)}`
							:	"Not watched"}
						</span>

						<span className="shrink-0 tabular-nums">{Math.round(progressPercent)}%</span>
					</div>

					<Progress value={progressPercent} />
				</div>
			</CardContent>
		</Card>
	);
}
