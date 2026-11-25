import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/utils/functions";
import { useEffect, useState } from "react";

export type PlaybackProgress = {
	position: number; // Current position in seconds
	duration: number; // Total duration in seconds
	updatedAt: string;
};
export type ProgressDialogProps = {
	open: boolean;
	title: string;
	progress?: PlaybackProgress;
	defaultDuration: number;
	onOpenChange: (open: boolean) => void;
	onSave: (position: number, duration: number) => void;
};

export function PlaybackProgressDialog({ open, title, progress, defaultDuration, onOpenChange, onSave }: ProgressDialogProps) {
	const duration = defaultDuration || progress?.duration || 0;

	const [position, setPosition] = useState(progress?.position ?? 0);

	useEffect(() => {
		if (open) {
			setPosition(progress?.position ?? 0);
		}
	}, [open, progress]);

	const safeDuration = Math.max(duration, 0);
	const safePosition = Math.min(Math.max(position, 0), safeDuration);

	function save() {
		if (safeDuration <= 0) return;

		onSave(safePosition, safeDuration);
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Playback progress</DialogTitle>
					<DialogDescription>Update where you stopped watching {title}.</DialogDescription>
				</DialogHeader>

				<div className="space-y-5">
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium">Playback position</label>
							<span className="text-sm font-semibold tabular-nums">{formatTime(safePosition)}</span>
						</div>

						<Slider
							min={0}
							max={Math.max(safeDuration, 1)}
							step={1}
							value={[safePosition]}
							onValueChange={(value) => setPosition(typeof value === "number" ? value : (value[0] ?? 0))}
						/>

						<div className="text-muted-foreground flex justify-between text-xs">
							<span>00:00:00</span>
							<span>{formatTime(safeDuration)}</span>
						</div>
					</div>

					<div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
						<span className="text-muted-foreground text-sm">Total runtime</span>
						<span className="text-sm font-medium tabular-nums">{formatTime(safeDuration)}</span>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={save} disabled={safeDuration <= 0}>
						Save progress
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
