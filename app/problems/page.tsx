"use client";

import EnhancedProblemBrowser from "@/app/components/EnhancedProblemBrowser";

export default function ProblemsPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Problem Browser</h1>
					<p className="text-gray-600">Browse and practice with our comprehensive collection of algorithm problems</p>
				</div>
				<EnhancedProblemBrowser 
					onSelectProblems={(problems) => {
						console.log('Selected problems:', problems);
					}}
					onCreateQuiz={(problems) => {
						console.log('Creating quiz with problems:', problems);
					}}
				/>
			</div>
		</div>
	);
}
