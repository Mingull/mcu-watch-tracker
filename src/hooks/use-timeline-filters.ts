import { timeline, type Entry, type McuPhase } from "@/data/timeline";
import type { Saved } from "@/hooks/use-watch-progress";
import { isSeasonEntry } from "@/utils/functions";
import { useMemo, useState } from "react";

export type TimelineFilters = {
	query: string;
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	kind: string;
	setKind: React.Dispatch<React.SetStateAction<string>>;
	status: string;
	setStatus: React.Dispatch<React.SetStateAction<string>>;
	phase: McuPhase | "All";
	setPhase: React.Dispatch<React.SetStateAction<McuPhase | "All">>;
	showBranches: boolean;
	setShowBranches: React.Dispatch<React.SetStateAction<boolean>>;
	filtered: Entry[];
};

export function useTimelineFilters(store: Record<string, Saved>, get: (entry: Entry) => Saved): TimelineFilters {
	const [query, setQuery] = useState("");
	const [kind, setKind] = useState("All");
	const [status, setStatus] = useState("All");
	const [phase, setPhase] = useState<McuPhase | "All">("All");
	const [showBranches, setShowBranches] = useState(true);

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

	return { query, setQuery, kind, setKind, status, setStatus, phase, setPhase, showBranches, setShowBranches, filtered };
}
