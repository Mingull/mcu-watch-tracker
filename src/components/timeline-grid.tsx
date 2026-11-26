import { EntryCard } from "@/components/entry-card";
import type { PlaybackProgress } from "@/components/playback-progress-dialog";
import { Card } from "@/components/ui/card";
import type { Entry, SeasonEntry } from "@/data/timeline";
import type { Saved } from "@/hooks/use-watch-progress";
import { getEntryId, isSeasonEntry } from "@/utils/functions";
import { Filter } from "lucide-react";

type TimelineGridProps = {
	entries: Entry[];
	get: (entry: Entry) => Saved;
	onMarkAll: (entry: SeasonEntry, watched: boolean) => void;
	onToggleFilm: (entry: Entry, watched: boolean) => void;
	onOpenDetails: (id: string) => void;
	onSetProgress: (target: { id: string; title: string; progress?: PlaybackProgress }) => void;
};

export function TimelineGrid({ entries, get, onMarkAll, onToggleFilm, onOpenDetails, onSetProgress }: TimelineGridProps) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
			{entries.map((e) => {
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
								onMarkAll(e, !complete);
							} else {
								onToggleFilm(e, !s.watched);
							}
						}}
						onOpenDetails={() => onOpenDetails(getEntryId(e))}
						onSetProgress={() => {
							if (isSeasonEntry(e)) {
								onOpenDetails(getEntryId(e));
							} else {
								onSetProgress({
									id: getEntryId(e),
									title: e.title,
									progress: s.progress,
								});
							}
						}}
					/>
				);
			})}
			{entries.length === 0 && (
				<Card className="p-10 text-center">
					<Filter className="mx-auto mb-3 text-zinc-600" />
					<div className="text-sm font-medium">No titles found</div>
					<div className="mt-1 text-xs text-zinc-500">Try changing your search or filters.</div>
				</Card>
			)}
		</div>
	);
}
