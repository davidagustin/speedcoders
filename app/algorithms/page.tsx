"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import AlgorithmMastery from "@/app/components/AlgorithmMastery";

export default function AlgorithmsPage() {
	const { data: session } = useSession();

	if (!session) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						Please sign in to access algorithm mastery features
					</h1>
					<Link
						href="/auth/login"
						className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer"
					>
						Sign In
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Algorithm Mastery</h1>
					<p className="text-gray-600">
						Master algorithms and data structures with interactive learning
					</p>
				</div>
				<AlgorithmMastery />
			</div>
		</div>
	);
}
