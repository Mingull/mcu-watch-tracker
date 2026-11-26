import type { PlaybackProgress } from "@/components/playback-progress-dialog";
import { timeline, type Entry, type SeasonEntry } from "@/data/timeline";
import { getEntryId, isSeasonEntry } from "@/utils/functions";
import { useEffect, useState } from "react";

export type Saved = {
	watched: boolean;
	episodes: boolean[];

	// Movies and specials
	progress?: PlaybackProgress;

	// Individual episodes, indexed by episode index
	episodeProgress?: Record<number, PlaybackProgress>;
};

type Store = Record<string, Saved>;

const STORAGE_KEY = "mcu-watch-tracker-v1";
const initial: Store = {};

export function useWatchProgress() {
	const [store, setStore] = useState<Store>(() => {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
		} catch {
			return initial;
		}
	});

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
	}, [store]);

	const get = (e: Entry): Saved => store[getEntryId(e)] ?? { watched: false, episodes: Array.from({ length: isSeasonEntry(e) ? e.episodes.length : 0 }, () => false) };

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
		update(id, (saved) => {
			const next = { ...saved };
			if (position <= 0 || position >= duration) {
				delete next.progress;
				if (position >= duration) next.watched = true;
			} else {
				next.watched = false;
				next.progress = { position, duration, updatedAt: new Date().toISOString() };
			}
			return next;
		});
	}

	function toggleEp(e: SeasonEntry, index: number, watched: boolean) {
		update(getEntryId(e), (saved) => {
			const episodes = [...saved.episodes];
			episodes[index] = watched;
			return { ...saved, episodes, updatedAt: new Date().toISOString() };
		});
	}

	function updateEpisodeProgress(id: string, episodeIndex: number, position: number, duration: number) {
		update(id, (saved) => {
			const episodeProgress = { ...saved.episodeProgress };
			const episodes = [...saved.episodes];
			if (position <= 0 || position >= duration) {
				delete episodeProgress[episodeIndex];
				if (position >= duration) episodes[episodeIndex] = true;
			} else {
				episodes[episodeIndex] = false;
				episodeProgress[episodeIndex] = { position, duration, updatedAt: new Date().toISOString() };
			}
			const next: Saved = { ...saved, episodes, episodeProgress };
			if (Object.keys(episodeProgress).length === 0) delete next.episodeProgress;
			return next;
		});
	}

	function markAll(e: SeasonEntry, watched: boolean) {
		update(getEntryId(e), (saved) => ({
			...saved,
			watched,
			episodes: saved.episodes.map(() => watched),
			updatedAt: new Date().toISOString(),
		}));
	}

	return { store, setStore, get, toggleFilm, updateMovieProgress, toggleEp, updateEpisodeProgress, markAll };
}
