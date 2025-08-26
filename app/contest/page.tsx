"use client";

import { useState } from "react";
import ContestMode from "../components/ContestMode";
import ContestLeaderboard from "../components/ContestLeaderboard";

export default function ContestPage() {
	const [activeTab, setActiveTab] = useState('live');

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Contest Arena</h1>
					<p className="text-gray-600 text-lg">Compete with developers worldwide in real-time coding challenges</p>
				</div>

				{/* Navigation Tabs */}
				<div className="mb-8">
					<div className="border-b border-gray-200">
						<nav className="-mb-px flex space-x-8">
							{[
								{ id: 'live', label: 'Live Contests', icon: '🔴' },
								{ id: 'upcoming', label: 'Upcoming', icon: '📅' },
								{ id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
								{ id: 'history', label: 'Past Contests', icon: '📊' },
								{ id: 'create', label: 'Host Contest', icon: '✨' },
							].map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
										activeTab === tab.id
											? 'border-blue-500 text-blue-600'
											: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
									}`}
								>
									<span className="mr-2">{tab.icon}</span>
									{tab.label}
								</button>
							))}
						</nav>
					</div>
				</div>

				{/* Tab Content */}
				{activeTab === 'live' && (
					<div className="space-y-6">
						{/* Live Contest Banner */}
						<div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-8 text-white">
							<div className="flex items-center justify-between">
								<div>
									<div className="flex items-center gap-3 mb-2">
										<div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
										<span className="text-sm font-medium">LIVE NOW</span>
									</div>
									<h2 className="text-3xl font-bold mb-2">Weekly Championship</h2>
									<p className="text-red-100">1,247 participants • $5,000 prize pool</p>
								</div>
								<div className="text-right">
									<button className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors">
										Join Contest
									</button>
									<div className="mt-2 text-red-100 text-sm">2:45:32 remaining</div>
								</div>
							</div>
						</div>

						<ContestMode />
					</div>
				)}

				{activeTab === 'upcoming' && (
					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[
								{
									title: "Daily Challenge #247",
									description: "Fast-paced 30-minute sprint with 5 carefully selected problems",
									startTime: "Tomorrow 9:00 AM EST",
									duration: "30 minutes",
									participants: 450,
									difficulty: "Medium",
									prize: "$500",
									type: "Speed Contest",
									color: "from-blue-500 to-blue-600"
								},
								{
									title: "FAANG Mock Interview",
									description: "Simulate real technical interviews with problems from top tech companies",
									startTime: "March 25, 2:00 PM EST",
									duration: "90 minutes",
									participants: 1200,
									difficulty: "Hard",
									prize: "$2,000",
									type: "Interview Prep",
									color: "from-purple-500 to-purple-600"
								},
								{
									title: "Algorithm Marathon",
									description: "Test your endurance with 50 problems across all difficulty levels",
									startTime: "March 30, 10:00 AM EST",
									duration: "4 hours",
									participants: 800,
									difficulty: "Mixed",
									prize: "$10,000",
									type: "Marathon",
									color: "from-green-500 to-green-600"
								}
							].map((contest, index) => (
								<div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
									<div className={`h-2 bg-gradient-to-r ${contest.color}`}></div>
									<div className="p-6">
										<div className="flex items-center justify-between mb-3">
											<span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
												{contest.type}
											</span>
											<span className={`px-3 py-1 text-xs rounded-full font-medium ${
												contest.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
												contest.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
												contest.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
												'bg-purple-100 text-purple-800'
											}`}>
												{contest.difficulty}
											</span>
										</div>
										<h3 className="text-xl font-bold text-gray-900 mb-2">{contest.title}</h3>
										<p className="text-gray-600 text-sm mb-4 line-clamp-2">{contest.description}</p>
										<div className="space-y-2 text-sm text-gray-500 mb-4">
											<div className="flex items-center justify-between">
												<span>📅 {contest.startTime}</span>
											</div>
											<div className="flex items-center justify-between">
												<span>⏱️ {contest.duration}</span>
												<span>👥 {contest.participants} registered</span>
											</div>
											<div className="flex items-center justify-between font-medium text-green-600">
												<span>💰 Prize Pool: {contest.prize}</span>
											</div>
										</div>
										<button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors">
											Register Now
										</button>
									</div>
								</div>
							))}
						</div>

						{/* Contest Calendar */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h3 className="text-xl font-bold mb-4">📅 Contest Calendar</h3>
							<div className="grid grid-cols-7 gap-2 mb-4 text-center text-sm font-medium text-gray-500">
								{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
									<div key={day} className="py-2">{day}</div>
								))}
							</div>
							<div className="grid grid-cols-7 gap-2 text-center text-sm">
								{Array.from({ length: 35 }, (_, i) => {
									const day = i - 5; // Starting from previous month
									const hasContest = [8, 12, 15, 22, 25, 30].includes(day);
									return (
										<div
											key={i}
											className={`py-2 px-1 rounded-lg transition-colors cursor-pointer ${
												day < 1 || day > 31 
													? 'text-gray-300' 
													: hasContest 
													? 'bg-blue-100 text-blue-800 font-bold hover:bg-blue-200'
													: 'text-gray-700 hover:bg-gray-100'
											}`}
										>
											{day > 0 && day <= 31 ? day : ''}
											{hasContest && <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1"></div>}
										</div>
									);
								})}
							</div>
						</div>
					</div>
				)}

				{activeTab === 'leaderboard' && <ContestLeaderboard />}

				{activeTab === 'history' && (
					<div className="space-y-6">
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h3 className="text-xl font-bold mb-4">📊 Your Contest History</h3>
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
								<div className="bg-blue-50 rounded-lg p-4 text-center">
									<div className="text-2xl font-bold text-blue-600">24</div>
									<div className="text-sm text-blue-700">Contests Participated</div>
								</div>
								<div className="bg-green-50 rounded-lg p-4 text-center">
									<div className="text-2xl font-bold text-green-600">3</div>
									<div className="text-sm text-green-700">Top 10 Finishes</div>
								</div>
								<div className="bg-purple-50 rounded-lg p-4 text-center">
									<div className="text-2xl font-bold text-purple-600">1,847</div>
									<div className="text-sm text-purple-700">Highest Rating</div>
								</div>
								<div className="bg-orange-50 rounded-lg p-4 text-center">
									<div className="text-2xl font-bold text-orange-600">12</div>
									<div className="text-sm text-orange-700">Win Streak (Best)</div>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-sm overflow-hidden">
							<div className="px-6 py-4 bg-gray-50 border-b">
								<h3 className="text-lg font-semibold">Recent Contest Results</h3>
							</div>
							<div className="divide-y divide-gray-200">
								{[
									{ name: 'Weekly Championship #12', date: 'Mar 15', rank: 23, participants: 1247, rating: '+45', problems: '12/15' },
									{ name: 'Speed Contest Daily', date: 'Mar 12', rank: 8, participants: 450, rating: '+78', problems: '5/5' },
									{ name: 'Algorithm Marathon', date: 'Mar 8', rank: 156, participants: 800, rating: '-12', problems: '28/50' },
									{ name: 'FAANG Mock Interview', date: 'Mar 5', rank: 45, participants: 1200, rating: '+23', problems: '8/12' },
								].map((contest, index) => (
									<div key={index} className="px-6 py-4 hover:bg-gray-50">
										<div className="flex items-center justify-between">
											<div>
												<div className="font-medium text-gray-900">{contest.name}</div>
												<div className="text-sm text-gray-500">{contest.date} • {contest.participants} participants</div>
											</div>
											<div className="text-right">
												<div className="flex items-center gap-4">
													<div className="text-center">
														<div className="font-bold text-lg">#{contest.rank}</div>
														<div className="text-xs text-gray-500">rank</div>
													</div>
													<div className="text-center">
														<div className="font-medium">{contest.problems}</div>
														<div className="text-xs text-gray-500">solved</div>
													</div>
													<div className={`text-center font-bold ${
														contest.rating.startsWith('+') ? 'text-green-600' : 'text-red-600'
													}`}>
														<div>{contest.rating}</div>
														<div className="text-xs text-gray-500">rating</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{activeTab === 'create' && (
					<div className="space-y-6">
						<div className="bg-white rounded-lg shadow-sm p-8">
							<h2 className="text-2xl font-bold mb-6">✨ Host Your Own Contest</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div>
									<h3 className="text-lg font-semibold mb-4">Contest Templates</h3>
									<div className="space-y-4">
										{[
											{ name: 'Speed Contest', description: 'Quick 30-minute challenges', icon: '⚡', color: 'border-blue-200 hover:bg-blue-50' },
											{ name: 'Algorithm Deep Dive', description: 'Focus on specific topics', icon: '🧠', color: 'border-purple-200 hover:bg-purple-50' },
											{ name: 'Team Competition', description: 'Collaborative problem solving', icon: '👥', color: 'border-green-200 hover:bg-green-50' },
											{ name: 'Interview Simulation', description: 'Practice technical interviews', icon: '💼', color: 'border-orange-200 hover:bg-orange-50' }
										].map(template => (
											<div key={template.name} className={`p-4 border rounded-lg cursor-pointer transition-colors ${template.color}`}>
												<div className="flex items-center gap-3">
													<span className="text-2xl">{template.icon}</span>
													<div>
														<div className="font-medium">{template.name}</div>
														<div className="text-sm text-gray-600">{template.description}</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
								<div>
									<h3 className="text-lg font-semibold mb-4">Contest Features</h3>
									<div className="grid grid-cols-2 gap-3">
										{[
											{ name: 'Real-time Ranking', icon: '📊' },
											{ name: 'Custom Scoring', icon: '🎯' },
											{ name: 'Team Support', icon: '👥' },
											{ name: 'Live Chat', icon: '💬' },
											{ name: 'Problem Sets', icon: '📚' },
											{ name: 'Automated Judging', icon: '⚖️' },
											{ name: 'Analytics Dashboard', icon: '📈' },
											{ name: 'Prize Management', icon: '🏆' }
										].map(feature => (
											<div key={feature.name} className="p-3 bg-gray-50 rounded-lg text-center">
												<div className="text-xl mb-1">{feature.icon}</div>
												<div className="text-xs font-medium">{feature.name}</div>
											</div>
										))}
									</div>
								</div>
							</div>
							<div className="mt-8 text-center">
								<button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors">
									Create Contest
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
