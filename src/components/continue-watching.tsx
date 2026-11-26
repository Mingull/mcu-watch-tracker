import type { PlaybackProgress } from "@/components/playback-progress-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Entry } from "@/data/timeline";
import { formatTime, getEntryId } from "@/utils/functions";
import { Play } from "lucide-react";

export type ResumeItem = {
	e: Entry;
	episodeIndex?: number;
	progress: PlaybackProgress;
};

type ContinueWatchingProps = {
	resume: ResumeItem[];
	onResume: (target: { id: string; title: string; episodeIndex?: number; progress: PlaybackProgress }) => void;
};

export function ContinueWatching({ resume, onResume }: ContinueWatchingProps) {
	return (
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

							<Button size="sm" onClick={() => onResume({ id: getEntryId(e), title, episodeIndex, progress })}>
								<Play size={14} />
								Resume
							</Button>
						</Card>
					);
				})
			:	<Card className="p-8 text-center text-sm text-zinc-500">Nothing in progress yet. Set a playback position on a movie or episode to see it here.</Card>}
		</div>
	);
}
