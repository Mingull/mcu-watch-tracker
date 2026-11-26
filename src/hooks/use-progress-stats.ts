import { timeline, type Entry } from "@/data/timeline";
import type { Saved } from "@/hooks/use-watch-progress";
import { isSeasonEntry, parseDuration } from "@/utils/functions";
import { useMemo } from "react";

export function useProgressStats(store: Record<string, Saved>, get: (entry: Entry) => Saved) {
	return useMemo(() => {
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
}
