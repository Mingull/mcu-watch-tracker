import type { Saved, Tab } from "@/App";
import { Card } from "@/components/ui/card";
import {
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	Sidebar as SidebarPrimitive,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import { Activity, ChevronsUpDown, Clock3, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Progress } from "./ui/progress";

type SidebarProps = {
	tabs: Tab[];
	activeTab: Tab;
	onTabChange: (tab: "timeline" | "continue") => void;
	entryCount: number;
	counts: { percent: number; done: number; left: number; remaining: number };
	setStore: (store: Record<string, Saved>) => void;
};

export function Sidebar({ tabs, activeTab, onTabChange, entryCount, counts, setStore }: SidebarProps) {
	const { isMobile, setOpenMobile } = useSidebar();
	const formatMinutes = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

	function handleTabChange(nextTab: Tab["id"]) {
		onTabChange(nextTab);
		if (isMobile) setOpenMobile(false);
	}

	return (
		<SidebarPrimitive variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
										<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
											<activeTab.logo className="size-4" />
										</div>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-medium">{activeTab.name}</span>
											{/* <span className="truncate text-xs">{activeTab.plan}</span> */}
										</div>
										<ChevronsUpDown className="ml-auto" />
									</SidebarMenuButton>
								}
							/>
							<DropdownMenuContent
								className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
								align="start"
								side={isMobile ? "bottom" : "right"}
								sideOffset={4}
							>
								<DropdownMenuGroup>
									<DropdownMenuLabel className="text-muted-foreground text-xs">WORKSPACE</DropdownMenuLabel>
									{tabs.map((team, index) => (
										<DropdownMenuItem key={team.name} onClick={() => handleTabChange(team.id)} className="gap-2 p-2">
											<div className="flex size-6 items-center justify-center rounded-md border">
												<team.logo className="size-3.5 shrink-0" />
											</div>
											{team.name}
											<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
										</DropdownMenuItem>
									))}
								</DropdownMenuGroup>
								{/* <DropdownMenuSeparator />
								<DropdownMenuItem className="gap-2 p-2">
									<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
										<Plus className="size-4" />
									</div>
									<div className="text-muted-foreground font-medium">Add team</div>
								</DropdownMenuItem> */}
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
				{/* <SidebarGroup>
					<SidebarGroupLabel>WORKSPACE</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton isActive={activeTab.id === "timeline"} onClick={() => handleTabChange("timeline")} tooltip="Timeline">
									<ListChecks /> <span>Timeline</span>
								</SidebarMenuButton>
								<SidebarMenuBadge>{entryCount}</SidebarMenuBadge>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton isActive={activeTab.id === "continue"} onClick={() => handleTabChange("continue")} tooltip="Continue watching">
									<Bookmark /> <span>Continue watching</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup> */}
			</SidebarHeader>
			<SidebarContent className="gap-4 p-2">
				<SidebarGroup>
					<SidebarGroupLabel>YOUR PROGRESS</SidebarGroupLabel>
					<SidebarGroupContent>
						<Card className="gap-4 p-4">
							<div className="flex items-end justify-between">
								<div>
									<div className="text-2xl font-semibold tabular-nums">{counts.percent}%</div>
									<div className="text-muted-foreground text-xs">Universe completed</div>
								</div>
								<Activity className="text-muted-foreground mb-1" size={18} />
							</div>
							<Progress value={counts.percent} />
							<div className="grid grid-cols-2 gap-3 border-t pt-3">
								<div>
									<div className="text-lg font-semibold tabular-nums">{counts.done}</div>
									<div className="text-muted-foreground text-[11px]">Watched units</div>
								</div>
								<div>
									<div className="text-lg font-semibold tabular-nums">{counts.left}</div>
									<div className="text-muted-foreground text-[11px]">Remaining</div>
								</div>
							</div>
						</Card>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupContent>
						<Card className="gap-1 p-4">
							<div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
								<Clock3 size={14} /> MARATHON ESTIMATE
							</div>
							<div className="text-xl font-semibold">{formatMinutes(counts.remaining)}</div>
							<p className="text-muted-foreground text-[11px] leading-relaxed">Rough remaining runtime. Series episode lengths are estimates.</p>
						</Card>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroup>
					<SidebarMenu>
						<p className="text-muted-foreground text-center text-[11px] leading-relaxed text-balance">
							Progress is saved on this device in your browser. Use Export in the footer to back it up.
						</p>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<Button variant="ghost" size="icon">
										<Settings size={17} />
									</Button>
								}
							/>
							<DropdownMenuContent className="w-40" align="start">
								<DropdownMenuItem
									onClick={() => {
										if (confirm("Reset all watch progress stored in this browser?")) setStore({});
									}}
								>
									Reset
								</DropdownMenuItem>
								<DropdownMenuItem>GitHub</DropdownMenuItem>
								<DropdownMenuItem>GitHub</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarFooter>
			<SidebarRail />
		</SidebarPrimitive>
	);
}
