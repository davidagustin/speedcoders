import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./providers";
import HeaderBar from "@/components/HeaderBar";
import SideNavigation from "@/components/SideNavigation";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
};

export const metadata: Metadata = {
	title: "SpeedCoders - Master Algorithms & Data Structures",
	description:
		"Learn algorithms, solve coding problems, and improve your programming skills with interactive challenges and real-time feedback.",
	keywords:
		"algorithms, data structures, coding problems, leetcode, programming, computer science",
	authors: [{ name: "SpeedCoders Team" }],
	robots: "index, follow",
	openGraph: {
		title: "SpeedCoders - Master Algorithms & Data Structures",
		description:
			"Learn algorithms, solve coding problems, and improve your programming skills",
		type: "website",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "SpeedCoders - Master Algorithms & Data Structures",
		description:
			"Learn algorithms, solve coding problems, and improve your programming skills",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="h-full">
			<body className={`${inter.className} h-full bg-gray-50`}>
				<NextAuthProvider session={null}>
					<ToastProvider>
						<div className="min-h-screen flex flex-col">
							<HeaderBar />
							<div className="flex flex-1 pt-[72px]">
								<SideNavigation />
								<main className="flex-1 lg:ml-64 transition-all duration-300">
									<div className="p-4 lg:p-6">
										{children}
									</div>
								</main>
							</div>
							<Footer />
						</div>
					</ToastProvider>
				</NextAuthProvider>
			</body>
		</html>
	);
}
