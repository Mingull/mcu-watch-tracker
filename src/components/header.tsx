import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2, Shield } from "lucide-react";

type HeaderProps = {
	setStore: (store: Record<string, any>) => void;
};
export function Header({ setStore }: HeaderProps) {
	return (
		<header className="sticky top-0 z-20 border-b border-zinc-800 bg-[#09090b]/95 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-375 items-center justify-between px-5 lg:px-8">
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950">
						<Shield size={21} strokeWidth={2.4} />
					</div>
					<div>
						<div className="text-sm font-semibold tracking-tight">
							MARVEL <span className="text-zinc-500">/</span> WATCH TRACKER
						</div>
						<div className="text-[10px] tracking-[.18em] text-zinc-500">THE CINEMATIC UNIVERSE</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Badge>LOCAL PROFILE</Badge>
					<Button
						variant="ghost"
						size="icon"
						title="Settings"
						onClick={() => {
							if (confirm("Reset all watch progress stored in this browser?")) setStore({});
						}}
					>
						<Settings2 size={17} />
					</Button>
				</div>
			</div>
		</header>
	);
}
