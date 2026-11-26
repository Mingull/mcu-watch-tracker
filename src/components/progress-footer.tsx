import { Button } from "@/components/ui/button";
import type { Saved } from "@/hooks/use-watch-progress";
import { Settings } from "lucide-react";

type ProgressFooterProps = {
	store: Record<string, Saved>;
	setStore: (store: Record<string, Saved>) => void;
};

export function ProgressFooter({ store, setStore }: ProgressFooterProps) {
	return (
		<footer className="mt-8 flex flex-col gap-3 border-t border-zinc-800 pt-5 text-[11px] leading-relaxed text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
			<div>
				Timeline is a curated chronological guide, not a claim that every placement is officially fixed. In-universe dates marked “approx.” are estimates. Series are
				grouped by season; episode progress is tracked individually.
			</div>
			<div className="flex shrink-0 gap-2">
				<Button
					variant="ghost"
					size="icon"
					title="Settings"
					onClick={() => {
						if (confirm("Reset all watch progress stored in this browser?")) setStore({});
					}}
				>
					<Settings size={17} />
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={() => {
						const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
						const url = URL.createObjectURL(blob);
						const a = document.createElement("a");
						a.href = url;
						a.download = "mcu-watch-progress.json";
						a.click();
						URL.revokeObjectURL(url);
					}}
				>
					Export progress
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={() => {
						const input = document.createElement("input");
						input.type = "file";
						input.accept = ".json,application/json";
						input.onchange = () => {
							const f = input.files?.[0];
							if (!f) return;
							const reader = new FileReader();
							reader.onload = () => {
								try {
									setStore(JSON.parse(String(reader.result)));
								} catch {
									alert("Invalid progress file");
								}
							};
							reader.readAsText(f);
						};
						input.click();
					}}
				>
					Import
				</Button>
			</div>
		</footer>
	);
}
