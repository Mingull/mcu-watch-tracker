import { Checkbox } from "@/components/ui/checkbox";
import type { McuPhase } from "@/data/timeline";
import type { TimelineFilters } from "@/hooks/use-timeline-filters";
import { Search } from "lucide-react";

type TimelineFiltersProps = {
	filters: TimelineFilters;
	filteredCount: number;
	totalCount: number;
};

export function TimelineFilters({ filters, filteredCount, totalCount }: TimelineFiltersProps) {
	const { query, setQuery, kind, setKind, phase, setPhase, status, setStatus, showBranches, setShowBranches } = filters;

	return (
		<>
			<div className="mb-4 flex flex-col gap-3 xl:flex-row">
				<div className="relative min-w-0 flex-1">
					<Search className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500" size={16} />
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search movies, series, specials…"
						className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 pr-3 pl-9 text-sm outline-none placeholder:text-zinc-600 focus:border-zinc-600"
					/>
				</div>
				<div className="flex flex-wrap gap-2">
					<select
						value={kind}
						onChange={(e) => setKind(e.target.value)}
						className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none"
					>
						<option>All</option>
						<option>Film</option>
						<option>Series</option>
						<option>Special</option>
						<option>One-shot</option>
					</select>
					<select
						value={phase}
						onChange={(e) => setPhase(e.target.value as McuPhase | "All")}
						className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none"
					>
						<option>All</option>
						{["Phase One", "Phase Two", "Phase Three", "Phase Four", "Phase Five", "Phase Six", "Marvel Television"].map((p) => (
							<option key={p}>{p}</option>
						))}
					</select>
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						className="h-10 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none"
					>
						<option>All</option>
						<option>Unwatched</option>
						<option>In progress</option>
						<option>Completed</option>
						<option>Upcoming</option>
					</select>
				</div>
			</div>
			<div className="mb-4 flex items-center justify-between">
				<div className="text-xs text-zinc-500">
					Showing <span className="text-zinc-300">{filteredCount}</span> of {totalCount} entries
				</div>
				<button onClick={() => setShowBranches(!showBranches)} className={`flex items-center gap-2 text-xs ${showBranches ? "text-zinc-300" : "text-zinc-500"}`}>
					<Checkbox checked={showBranches} onCheckedChange={setShowBranches} /> Include multiverse / alternate timelines
				</button>
			</div>
		</>
	);
}
