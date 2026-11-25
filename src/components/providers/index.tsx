"use client";

import { ThemeProvider } from "next-themes";
import { ToastProvider } from "./toast-provider";

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<ThemeProvider enableSystem attribute="class" defaultTheme="system" disableTransitionOnChange>
			{children}
			<ToastProvider />
		</ThemeProvider>
	);
}
