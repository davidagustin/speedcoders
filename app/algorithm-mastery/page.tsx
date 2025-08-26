"use client";

import AlgorithmMastery from "../components/AlgorithmMastery";

export default function AlgorithmMasteryPage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Algorithm Mastery</h1>
					<p className="text-gray-600">Master algorithms with detailed explanations and practice</p>
				</div>
				
				<AlgorithmMastery />
			</div>
		</div>
	);
}
