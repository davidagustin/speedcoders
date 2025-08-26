"use client";

import EditorialQuiz from "../components/EditorialQuiz";

export default function EditorialQuizPage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Editorial Quiz</h1>
					<p className="text-gray-600">Test your understanding with editorial-based questions</p>
				</div>
				
				<EditorialQuiz />
			</div>
		</div>
	);
}
