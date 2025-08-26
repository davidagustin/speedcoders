"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import CompanyMode from "@/app/components/CompanyMode";

export default function CompanyPage() {
	const { data: session } = useSession();

	if (!session) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						Please sign in to access company-specific problems
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
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Company Problems</h1>
					<p className="text-gray-600">
						Practice problems commonly asked by top tech companies
					</p>
				</div>
				<CompanyMode />
			</div>
		</div>
	);
}
