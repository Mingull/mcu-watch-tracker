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

function formatPlaybackTime(seconds: number, includeHours: boolean) {
	const formatted = formatTime(seconds);
	if (includeHours) return formatted;

	return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${formatted.slice(-2)}`;
}

function parseTime(value: string, includeHours: boolean) {
	if (includeHours) {
		const match = /^(\d+):([0-5]\d):([0-5]\d)$/.exec(value);
		return match ? Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) : NaN;
	}

	const match = /^([0-5]\d):([0-5]\d)$/.exec(value);
	return match ? Number(match[1]) * 60 + Number(match[2]) : NaN;
}

export function PlaybackProgressDialog({ open, title, progress, defaultDuration, onOpenChange, onSave }: ProgressDialogProps) {
	const duration = defaultDuration || progress?.duration || 0;
	const safeDuration = Math.max(duration, 0);
	const includeHours = safeDuration >= 3600;
	const timeFormat = includeHours ? "HH:MM:SS" : "MM:SS";

	const [position, setPosition] = useState(progress?.position ?? 0);
	const [positionInput, setPositionInput] = useState(formatPlaybackTime(progress?.position ?? 0, includeHours));

	useEffect(() => {
		if (open) {
			setPosition(progress?.position ?? 0);
			setPositionInput(formatPlaybackTime(progress?.position ?? 0, includeHours));
		}
	}, [open, progress, includeHours]);

	const safePosition = Math.min(Math.max(position, 0), safeDuration);
	const inputSeconds = parseTime(positionInput, includeHours);
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
							<span className="text-sm font-semibold tabular-nums">{formatPlaybackTime(safePosition, includeHours)}</span>
						</div>

						<Slider
							min={0}
							max={Math.max(safeDuration, 1)}
							step={1}
							value={[safePosition]}
							onValueChange={(value) => {
								const nextPosition = typeof value === "number" ? value : (value[0] ?? 0);
								setPosition(nextPosition);
								setPositionInput(formatPlaybackTime(nextPosition, includeHours));
							}}
						/>

						<div className="text-muted-foreground flex justify-between text-xs">
							<span>{formatPlaybackTime(0, includeHours)}</span>
							<span>{formatPlaybackTime(safeDuration, includeHours)}</span>
						</div>
					</label>

					<div className="flex flex-col gap-2">
						<label htmlFor="playback-time" className="text-sm font-medium">
							Exact time ({timeFormat})
						</label>
						<Input
							id="playback-time"
							value={positionInput}
							onChange={(event) => {
								const value = event.target.value;
								setPositionInput(value);
								const seconds = parseTime(value, includeHours);
								if (Number.isSafeInteger(seconds) && seconds <= safeDuration) setPosition(seconds);
							}}
							aria-invalid={!isValidInput}
							aria-describedby={!isValidInput ? "playback-time-error" : undefined}
						/>
						{!isValidInput && (
							<p id="playback-time-error" role="alert" className="text-destructive text-xs">
								Enter a time in {timeFormat} format between {formatPlaybackTime(0, includeHours)} and {formatPlaybackTime(safeDuration, includeHours)}.
							</p>
						)}
					</div>

					<div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
						<span className="text-muted-foreground text-sm">Remaining</span>
						<span className="text-sm font-medium tabular-nums">{formatPlaybackTime(safeDuration - safePosition, includeHours)}</span>
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
