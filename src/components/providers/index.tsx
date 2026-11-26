"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "../ui/sidebar";
import { TooltipProvider } from "../ui/tooltip";
import { ToastProvider } from "./toast-provider";

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<ThemeProvider enableSystem attribute="class" defaultTheme="system" disableTransitionOnChange>
			<TooltipProvider>
				{/* <SidebarProvider className="bg-background text-foreground flex-col">{children}</SidebarProvider> */}
				<SidebarProvider className="bg-background text-foreground">{children}</SidebarProvider>
			</TooltipProvider>
			<ToastProvider />
		</ThemeProvider>
	);
}
