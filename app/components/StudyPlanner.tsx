"use client";

import {
	AcademicCapIcon,
	BookOpenIcon,
	CalendarIcon,
	CheckCircleIcon,
	ClockIcon,
	PencilIcon,
	PlusIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface StudySession {
	id: string;
	title: string;
	description: string;
	date: string;
	time: string;
	duration: number; // in minutes
	topics: string[];
	difficulty: string;
	status: "planned" | "in-progress" | "completed" | "cancelled";
	notes?: string;
}

interface StudyGoal {
	id: string;
	title: string;
	description: string;
	targetDate: string;
	progress: number;
	totalSessions: number;
	completedSessions: number;
	category: string;
	priority: "low" | "medium" | "high";
}

interface StudyPlannerProps {
	sessions: StudySession[];
	goals: StudyGoal[];
	onAddSession: (session: Omit<StudySession, "id">) => void;
	onUpdateSession: (id: string, session: Partial<StudySession>) => void;
	onDeleteSession: (id: string) => void;
	onAddGoal: (goal: Omit<StudyGoal, "id">) => void;
	onUpdateGoal: (id: string, goal: Partial<StudyGoal>) => void;
	onDeleteGoal: (id: string) => void;
}

export default function StudyPlanner({
	sessions,
	goals,
	onAddSession,
	onUpdateSession,
	onDeleteSession,
	onAddGoal,
	onUpdateGoal,
	onDeleteGoal,
}: StudyPlannerProps) {
	const [activeTab, setActiveTab] = useState<"sessions" | "goals" | "calendar">(
		"sessions",
	);
	const [showAddSession, setShowAddSession] = useState(false);
	const [showAddGoal, setShowAddGoal] = useState(false);
	const [_editingSession, setEditingSession] = useState<string | null>(null);
	const [_editingGoal, setEditingGoal] = useState<string | null>(null);

	const [newSession, setNewSession] = useState({
		title: "",
		description: "",
		date: "",
		time: "",
		duration: 60,
		topics: [] as string[],
		difficulty: "Medium",
		notes: "",
	});

	const [newGoal, setNewGoal] = useState({
		title: "",
		description: "",
		targetDate: "",
		totalSessions: 1,
		category: "",
		priority: "medium" as const,
	});

	const topics = [
		"Arrays",
		"Strings",
		"Linked Lists",
		"Trees",
		"Graphs",
		"Dynamic Programming",
		"Greedy",
		"Backtracking",
		"Binary Search",
		"Two Pointers",
		"Sliding Window",
		"Hash Tables",
		"Stacks",
		"Queues",
		"Heaps",
		"Sorting",
		"Recursion",
	];

	const difficulties = ["Easy", "Medium", "Hard"];
	const priorities = ["low", "medium", "high"];
	const categories = [
		"Algorithms",
		"Data Structures",
		"System Design",
		"Problem Solving",
		"Interview Prep",
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "text-green-600 bg-green-100";
			case "in-progress":
				return "text-blue-600 bg-blue-100";
			case "planned":
				return "text-yellow-600 bg-yellow-100";
			case "cancelled":
				return "text-red-600 bg-red-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "text-red-600 bg-red-100";
			case "medium":
				return "text-yellow-600 bg-yellow-100";
			case "low":
				return "text-green-600 bg-green-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty.toLowerCase()) {
			case "easy":
				return "text-green-600 bg-green-100";
			case "medium":
				return "text-yellow-600 bg-yellow-100";
			case "hard":
				return "text-red-600 bg-red-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const handleAddSession = () => {
		if (newSession.title && newSession.date && newSession.time) {
			onAddSession({
				...newSession,
				status: "planned",
			});
			setNewSession({
				title: "",
				description: "",
				date: "",
				time: "",
				duration: 60,
				topics: [],
				difficulty: "Medium",
				notes: "",
			});
			setShowAddSession(false);
		}
	};

	const handleAddGoal = () => {
		if (newGoal.title && newGoal.targetDate) {
			onAddGoal({
				...newGoal,
				progress: 0,
				completedSessions: 0,
			});
			setNewGoal({
				title: "",
				description: "",
				targetDate: "",
				totalSessions: 1,
				category: "",
				priority: "medium",
			});
			setShowAddGoal(false);
		}
	};

	const upcomingSessions = sessions
		.filter((s) => s.status === "planned" || s.status === "in-progress")
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.slice(0, 5);

	const completedSessions = sessions.filter(
		(s) => s.status === "completed",
	).length;
	const totalStudyTime = sessions
		.filter((s) => s.status === "completed")
		.reduce((total, session) => total + session.duration, 0);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold text-gray-900">Study Planner</h1>
					<div className="flex space-x-2">
						<button
							onClick={() => setShowAddSession(true)}
							className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<PlusIcon className="w-4 h-4" />
							<span>Add Session</span>
						</button>
						<button
							onClick={() => setShowAddGoal(true)}
							className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
						>
							<PlusIcon className="w-4 h-4" />
							<span>Add Goal</span>
						</button>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="bg-blue-50 rounded-lg p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-blue-600">
									Total Sessions
								</p>
								<p className="text-2xl font-bold text-blue-900">
									{sessions.length}
								</p>
							</div>
							<BookOpenIcon className="w-8 h-8 text-blue-500" />
						</div>
					</div>

					<div className="bg-green-50 rounded-lg p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-green-600">Completed</p>
								<p className="text-2xl font-bold text-green-900">
									{completedSessions}
								</p>
							</div>
							<CheckCircleIcon className="w-8 h-8 text-green-500" />
						</div>
					</div>

					<div className="bg-purple-50 rounded-lg p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-purple-600">
									Study Time
								</p>
								<p className="text-2xl font-bold text-purple-900">
									{Math.round(totalStudyTime / 60)}h
								</p>
							</div>
							<ClockIcon className="w-8 h-8 text-purple-500" />
						</div>
					</div>

					<div className="bg-orange-50 rounded-lg p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-orange-600">
									Active Goals
								</p>
								<p className="text-2xl font-bold text-orange-900">
									{goals.length}
								</p>
							</div>
							<AcademicCapIcon className="w-8 h-8 text-orange-500" />
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg shadow-sm border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ id: "sessions", label: "Study Sessions", icon: BookOpenIcon },
							{ id: "goals", label: "Study Goals", icon: AcademicCapIcon },
							{ id: "calendar", label: "Calendar", icon: CalendarIcon },
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id as any)}
								className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
									activeTab === tab.id
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
							>
								<tab.icon className="w-5 h-5" />
								<span>{tab.label}</span>
							</button>
						))}
					</nav>
				</div>

				<div className="p-6">
					{/* Study Sessions Tab */}
					{activeTab === "sessions" && (
						<div className="space-y-6">
							{/* Upcoming Sessions */}
							<div>
								<h2 className="text-lg font-semibold text-gray-900 mb-4">
									Upcoming Sessions
								</h2>
								<div className="space-y-3">
									{upcomingSessions.map((session) => (
										<div key={session.id} className="bg-gray-50 rounded-lg p-4">
											<div className="flex items-center justify-between">
												<div className="flex-1">
													<div className="flex items-center space-x-3 mb-2">
														<h3 className="font-medium text-gray-900">
															{session.title}
														</h3>
														<span
															className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}
														>
															{session.status}
														</span>
														<span
															className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(session.difficulty)}`}
														>
															{session.difficulty}
														</span>
													</div>
													<p className="text-sm text-gray-600 mb-2">
														{session.description}
													</p>
													<div className="flex items-center space-x-4 text-sm text-gray-500">
														<span className="flex items-center space-x-1">
															<CalendarIcon className="w-4 h-4" />
															<span>
																{new Date(session.date).toLocaleDateString()}
															</span>
														</span>
														<span className="flex items-center space-x-1">
															<ClockIcon className="w-4 h-4" />
															<span>
																{session.time} ({session.duration}min)
															</span>
														</span>
													</div>
													{session.topics.length > 0 && (
														<div className="flex flex-wrap gap-1 mt-2">
															{session.topics.map((topic) => (
																<span
																	key={topic}
																	className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
																>
																	{topic}
																</span>
															))}
														</div>
													)}
												</div>
												<div className="flex items-center space-x-2">
													<button
														onClick={() => setEditingSession(session.id)}
														className="p-2 text-gray-400 hover:text-gray-600"
													>
														<PencilIcon className="w-4 h-4" />
													</button>
													<button
														onClick={() => onDeleteSession(session.id)}
														className="p-2 text-gray-400 hover:text-red-600"
													>
														<TrashIcon className="w-4 h-4" />
													</button>
												</div>
											</div>
										</div>
									))}
									{upcomingSessions.length === 0 && (
										<div className="text-center py-8 text-gray-500">
											<BookOpenIcon className="mx-auto w-12 h-12 mb-4" />
											<p>No upcoming sessions</p>
										</div>
									)}
								</div>
							</div>

							{/* All Sessions */}
							<div>
								<h2 className="text-lg font-semibold text-gray-900 mb-4">
									All Sessions
								</h2>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Title
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Date
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Duration
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Status
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{sessions.map((session) => (
												<tr key={session.id} className="hover:bg-gray-50">
													<td className="px-6 py-4">
														<div>
															<div className="text-sm font-medium text-gray-900">
																{session.title}
															</div>
															<div className="text-sm text-gray-500">
																{session.description}
															</div>
														</div>
													</td>
													<td className="px-6 py-4 text-sm text-gray-900">
														{new Date(session.date).toLocaleDateString()}
													</td>
													<td className="px-6 py-4 text-sm text-gray-900">
														{session.duration}min
													</td>
													<td className="px-6 py-4">
														<span
															className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}
														>
															{session.status}
														</span>
													</td>
													<td className="px-6 py-4 text-sm font-medium">
														<div className="flex space-x-2">
															<button
																onClick={() => setEditingSession(session.id)}
																className="text-blue-600 hover:text-blue-900"
															>
																Edit
															</button>
															<button
																onClick={() => onDeleteSession(session.id)}
																className="text-red-600 hover:text-red-900"
															>
																Delete
															</button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					)}

					{/* Study Goals Tab */}
					{activeTab === "goals" && (
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{goals.map((goal) => (
									<div key={goal.id} className="bg-gray-50 rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<h3 className="font-medium text-gray-900 mb-1">
													{goal.title}
												</h3>
												<p className="text-sm text-gray-600 mb-2">
													{goal.description}
												</p>
												<div className="flex items-center space-x-2 mb-3">
													<span
														className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(goal.priority)}`}
													>
														{goal.priority}
													</span>
													<span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
														{goal.category}
													</span>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<button
													onClick={() => setEditingGoal(goal.id)}
													className="p-1 text-gray-400 hover:text-gray-600"
												>
													<PencilIcon className="w-4 h-4" />
												</button>
												<button
													onClick={() => onDeleteGoal(goal.id)}
													className="p-1 text-gray-400 hover:text-red-600"
												>
													<TrashIcon className="w-4 h-4" />
												</button>
											</div>
										</div>

										<div className="mb-4">
											<div className="flex justify-between text-sm text-gray-600 mb-1">
												<span>Progress</span>
												<span>
													{goal.completedSessions}/{goal.totalSessions} sessions
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className="bg-blue-500 h-2 rounded-full transition-all duration-300"
													style={{
														width: `${(goal.completedSessions / goal.totalSessions) * 100}%`,
													}}
												/>
											</div>
										</div>

										<div className="text-sm text-gray-500">
											Target: {new Date(goal.targetDate).toLocaleDateString()}
										</div>
									</div>
								))}
							</div>

							{goals.length === 0 && (
								<div className="text-center py-12 text-gray-500">
									<AcademicCapIcon className="mx-auto w-12 h-12 mb-4" />
									<p>No study goals yet</p>
								</div>
							)}
						</div>
					)}

					{/* Calendar Tab */}
					{activeTab === "calendar" && (
						<div className="text-center py-12 text-gray-500">
							<CalendarIcon className="mx-auto w-12 h-12 mb-4" />
							<p>Calendar view coming soon...</p>
						</div>
					)}
				</div>
			</div>

			{/* Add Session Modal */}
			{showAddSession && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Add Study Session
						</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Title
								</label>
								<input
									type="text"
									value={newSession.title}
									onChange={(e) =>
										setNewSession({ ...newSession, title: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Description
								</label>
								<textarea
									value={newSession.description}
									onChange={(e) =>
										setNewSession({
											...newSession,
											description: e.target.value,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									rows={3}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Date
									</label>
									<input
										type="date"
										value={newSession.date}
										onChange={(e) =>
											setNewSession({ ...newSession, date: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Time
									</label>
									<input
										type="time"
										value={newSession.time}
										onChange={(e) =>
											setNewSession({ ...newSession, time: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Duration (min)
									</label>
									<input
										type="number"
										value={newSession.duration}
										onChange={(e) =>
											setNewSession({
												...newSession,
												duration: parseInt(e.target.value, 10),
											})
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Difficulty
									</label>
									<select
										value={newSession.difficulty}
										onChange={(e) =>
											setNewSession({
												...newSession,
												difficulty: e.target.value,
											})
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									>
										{difficulties.map((diff) => (
											<option key={diff} value={diff}>
												{diff}
											</option>
										))}
									</select>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Topics
								</label>
								<select
									multiple
									value={newSession.topics}
									onChange={(e) => {
										const selected = Array.from(
											e.target.selectedOptions,
											(option) => option.value,
										);
										setNewSession({ ...newSession, topics: selected });
									}}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
								>
									{topics.map((topic) => (
										<option key={topic} value={topic}>
											{topic}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="flex justify-end space-x-3 mt-6">
							<button
								onClick={() => setShowAddSession(false)}
								className="px-4 py-2 text-gray-600 hover:text-gray-800"
							>
								Cancel
							</button>
							<button
								onClick={handleAddSession}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
							>
								Add Session
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Add Goal Modal */}
			{showAddGoal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Add Study Goal
						</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Title
								</label>
								<input
									type="text"
									value={newGoal.title}
									onChange={(e) =>
										setNewGoal({ ...newGoal, title: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Description
								</label>
								<textarea
									value={newGoal.description}
									onChange={(e) =>
										setNewGoal({ ...newGoal, description: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									rows={3}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Target Date
									</label>
									<input
										type="date"
										value={newGoal.targetDate}
										onChange={(e) =>
											setNewGoal({ ...newGoal, targetDate: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Total Sessions
									</label>
									<input
										type="number"
										value={newGoal.totalSessions}
										onChange={(e) =>
											setNewGoal({
												...newGoal,
												totalSessions: parseInt(e.target.value, 10),
											})
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Category
									</label>
									<select
										value={newGoal.category}
										onChange={(e) =>
											setNewGoal({ ...newGoal, category: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									>
										<option value="">Select category</option>
										{categories.map((cat) => (
											<option key={cat} value={cat}>
												{cat}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Priority
									</label>
									<select
										value={newGoal.priority}
										onChange={(e) =>
											setNewGoal({
												...newGoal,
												priority: e.target.value as any,
											})
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									>
										{priorities.map((priority) => (
											<option key={priority} value={priority}>
												{priority}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>
						<div className="flex justify-end space-x-3 mt-6">
							<button
								onClick={() => setShowAddGoal(false)}
								className="px-4 py-2 text-gray-600 hover:text-gray-800"
							>
								Cancel
							</button>
							<button
								onClick={handleAddGoal}
								className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
							>
								Add Goal
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
