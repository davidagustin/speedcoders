"use client";

import CompetitiveLeaderboard from "../components/CompetitiveLeaderboard";

export default function CompetitiveLeaderboardPage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Competitive Leaderboard</h1>
					<p className="text-gray-600">See how you rank against other competitive programmers</p>
				</div>
				
				<CompetitiveLeaderboard />
			</div>
		</div>
	);
}
