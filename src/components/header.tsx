import { SidebarTrigger } from "@/components/ui/sidebar";
import { Shield } from "lucide-react";
import { Separator } from "./ui/separator";

type HeaderProps = {
	setStore: (store: Record<string, any>) => void;
};
export function Header({ setStore }: HeaderProps) {
	return (
		// <header className="sticky top-0 z-20 border-b border-zinc-800 bg-[#09090b]/95 backdrop-blur">
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			{/* <div className="mx-auto flex h-16 max-w-375 items-center justify-between px-5 lg:px-8"> */}
			<div className="flex items-center gap-2 px-4">
				{/* <div className="flex items-center gap-3"> */}
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
				{/* <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950">
					<Shield size={21} strokeWidth={2.4} />
				</div> */}
				<div>
					<div className="text-sm font-semibold tracking-tight">
						MARVEL <span className="text-zinc-500">/</span> WATCH TRACKER
					</div>
					<div className="text-[10px] tracking-[.18em] text-zinc-500">THE CINEMATIC UNIVERSE</div>
				</div>
				{/* </div> */}
			</div>
		</header>
	);
}
