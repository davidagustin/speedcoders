"use client";

import EnhancedProblemBrowser from "../components/EnhancedProblemBrowser";

export default function EnhancedProblemsPage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Problem Browser</h1>
					<p className="text-gray-600">Advanced problem discovery with smart recommendations</p>
				</div>
				
				<EnhancedProblemBrowser />
			</div>
		</div>
	);
}
