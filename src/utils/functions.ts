import type { Entry, SeasonEntry } from "../data/timeline";

export function formatTime(seconds: number) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	return [hours, minutes, remainingSeconds].map((value) => String(value).padStart(2, "0")).join(":");
}
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/['’\.]/g, "") // Strips apostrophes & periods (e.g. "S.H.I.E.L.D." -> "shield")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function getEntryId(entry: Entry): string {
	if (entry.idOverride) return entry.idOverride;

	const baseSlug = slugify(entry.title);
	if (entry.kind === "Series" && entry.season !== undefined) {
		return `${baseSlug}-s${entry.season}`;
	}
	return baseSlug;
}

export function getEpisodeId(entry: SeasonEntry, episodeNumber: number): string {
	return `${getEntryId(entry)}-e${episodeNumber}`;
}

export function getDisplayTitle(entry: Entry): string {
	if (entry.kind === "Series" && entry.season !== undefined) {
		return `${entry.title} - Season ${entry.season}`;
	}
	return entry.title;
}

export function isSeasonEntry(entry: Entry): entry is SeasonEntry {
	return entry.kind === "Series";
}
