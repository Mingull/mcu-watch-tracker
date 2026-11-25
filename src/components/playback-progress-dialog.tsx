import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

function parseTime(value: string) {
	const match = /^(\d+):([0-5]\d):([0-5]\d)$/.exec(value);
	return match ? Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) : NaN;
}

export function PlaybackProgressDialog({ open, title, progress, defaultDuration, onOpenChange, onSave }: ProgressDialogProps) {
	const duration = defaultDuration || progress?.duration || 0;

	const [position, setPosition] = useState(progress?.position ?? 0);
	const [positionInput, setPositionInput] = useState(formatTime(progress?.position ?? 0));

	useEffect(() => {
		if (open) {
			setPosition(progress?.position ?? 0);
			setPositionInput(formatTime(progress?.position ?? 0));
		}
	}, [open, progress]);

	const safeDuration = Math.max(duration, 0);
	const safePosition = Math.min(Math.max(position, 0), safeDuration);
	const inputSeconds = parseTime(positionInput);
	const isValidInput = Number.isSafeInteger(inputSeconds) && inputSeconds <= safeDuration;

	function save() {
		if (safeDuration <= 0 || !isValidInput) return;

		onSave(inputSeconds, safeDuration);
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Playback progress</DialogTitle>
					<DialogDescription>Update where you stopped watching {title}.</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-5">
					<label className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Playback position</span>
							<span className="text-sm font-semibold tabular-nums">{formatTime(safePosition)}</span>
						</div>

						<Slider
							min={0}
							max={Math.max(safeDuration, 1)}
							step={1}
							value={[safePosition]}
							onValueChange={(value) => {
								const nextPosition = typeof value === "number" ? value : (value[0] ?? 0);
								setPosition(nextPosition);
								setPositionInput(formatTime(nextPosition));
							}}
						/>

						<div className="text-muted-foreground flex justify-between text-xs">
							<span>00:00:00</span>
							<span>{formatTime(safeDuration)}</span>
						</div>
					</label>

					<div className="flex flex-col gap-2">
						<label htmlFor="playback-time" className="text-sm font-medium">
							Exact time (HH:MM:SS)
						</label>
						<Input
							id="playback-time"
							value={positionInput}
							onChange={(event) => {
								const value = event.target.value;
								setPositionInput(value);
								const seconds = parseTime(value);
								if (Number.isSafeInteger(seconds) && seconds <= safeDuration) setPosition(seconds);
							}}
							aria-invalid={!isValidInput}
							aria-describedby={!isValidInput ? "playback-time-error" : undefined}
						/>
						{!isValidInput && (
							<p id="playback-time-error" role="alert" className="text-destructive text-xs">
								Enter a time in HH:MM:SS format between 00:00:00 and {formatTime(safeDuration)}.
							</p>
						)}
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
					<Button onClick={save} disabled={safeDuration <= 0 || !isValidInput}>
						Save progress
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
