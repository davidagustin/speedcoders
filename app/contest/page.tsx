"use client";

import ContestMode from "../components/ContestMode";

export default function ContestPage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Contest Mode</h1>
					<p className="text-gray-600">Compete with others in timed coding challenges</p>
				</div>
				
				<ContestMode />
			</div>
		</div>
	);
}
