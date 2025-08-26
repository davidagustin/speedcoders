"use client";

import {
	AcademicCapIcon,
	CalendarDaysIcon,
	ChartBarIcon,
	CheckCircleIcon,
	ClockIcon,
	FireIcon,
	FlagIcon,
	PencilIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface StudySession {
	id: string;
	title: string;
	description?: string;
	scheduledDate: string;
	duration: number; // in minutes
	topics: string[];
	difficulty: "Easy" | "Medium" | "Hard";
	type: "problems" | "quiz" | "theory" | "review";
	completed: boolean;
	completedAt?: string;
	actualDuration?: number;
	notes?: string;
}

interface StudyGoal {
	id: string;
	title: string;
	description: string;
	target: number;
	current: number;
	unit: "problems" | "hours" | "quizzes" | "topics";
	deadline: string;
	priority: "low" | "medium" | "high";
	completed: boolean;
	category: string;
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

export function StudyPlanner({
	sessions,
	goals,
	onAddSession,
	onUpdateSession,
	onDeleteSession,
	onAddGoal,
	onUpdateGoal,
	onDeleteGoal,
}: StudyPlannerProps) {
	const [activeTab, setActiveTab] = useState<
		"calendar" | "goals" | "analytics"
	>("calendar");
	const [showAddSession, setShowAddSession] = useState(false);
	const [showAddGoal, setShowAddGoal] = useState(false);
	const [editingSession, setEditingSession] = useState<StudySession | null>(
		null,
	);
	const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);

	const tabs = [
		{ id: "calendar", label: "Study Schedule", icon: CalendarDaysIcon },
		{ id: "goals", label: "Goals", icon: FlagIcon },
		{ id: "analytics", label: "Analytics", icon: ChartBarIcon },
	];

	const upcomingSessions = sessions
		.filter((s) => !s.completed && new Date(s.scheduledDate) >= new Date())
		.sort(
			(a, b) =>
				new Date(a.scheduledDate).getTime() -
				new Date(b.scheduledDate).getTime(),
		);

	const completedSessions = sessions.filter((s) => s.completed);

	const activeGoals = goals.filter((g) => !g.completed);
	const completedGoals = goals.filter((g) => g.completed);

	return (
		<div className="bg-white rounded-lg shadow p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-bold text-gray-900">Study Planner</h2>
				<div className="flex gap-2">
					{activeTab === "calendar" && (
						<button
							onClick={() => setShowAddSession(true)}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
						>
							<PlusIcon className="w-4 h-4" />
							Add Session
						</button>
					)}
					{activeTab === "goals" && (
						<button
							onClick={() => setShowAddGoal(true)}
							className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
						>
							<PlusIcon className="w-4 h-4" />
							Add Goal
						</button>
					)}
				</div>
			</div>

			{/* Tabs */}
			<div className="border-b border-gray-200 mb-6">
				<nav className="flex space-x-8">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id as any)}
							className={`flex items-center gap-2 py-2 border-b-2 font-medium text-sm ${
								activeTab === tab.id
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							<tab.icon className="w-4 h-4" />
							{tab.label}
						</button>
					))}
				</nav>
			</div>

			{/* Content */}
			{activeTab === "calendar" && (
				<CalendarView
					upcomingSessions={upcomingSessions}
					completedSessions={completedSessions}
					onUpdateSession={onUpdateSession}
					onDeleteSession={onDeleteSession}
					onEditSession={setEditingSession}
				/>
			)}

			{activeTab === "goals" && (
				<GoalsView
					activeGoals={activeGoals}
					completedGoals={completedGoals}
					onUpdateGoal={onUpdateGoal}
					onDeleteGoal={onDeleteGoal}
					onEditGoal={setEditingGoal}
				/>
			)}

			{activeTab === "analytics" && (
				<AnalyticsView sessions={sessions} goals={goals} />
			)}

			{/* Add Session Modal */}
			{showAddSession && (
				<SessionModal
					session={null}
					onSave={(session) => {
						onAddSession(session);
						setShowAddSession(false);
					}}
					onClose={() => setShowAddSession(false)}
				/>
			)}

			{/* Edit Session Modal */}
			{editingSession && (
				<SessionModal
					session={editingSession}
					onSave={(session) => {
						onUpdateSession(editingSession.id, session);
						setEditingSession(null);
					}}
					onClose={() => setEditingSession(null)}
				/>
			)}

			{/* Add Goal Modal */}
			{showAddGoal && (
				<GoalModal
					goal={null}
					onSave={(goal) => {
						onAddGoal(goal);
						setShowAddGoal(false);
					}}
					onClose={() => setShowAddGoal(false)}
				/>
			)}

			{/* Edit Goal Modal */}
			{editingGoal && (
				<GoalModal
					goal={editingGoal}
					onSave={(goal) => {
						onUpdateGoal(editingGoal.id, goal);
						setEditingGoal(null);
					}}
					onClose={() => setEditingGoal(null)}
				/>
			)}
		</div>
	);
}

function CalendarView({
	upcomingSessions,
	completedSessions,
	onUpdateSession,
	onDeleteSession,
	onEditSession,
}: {
	upcomingSessions: StudySession[];
	completedSessions: StudySession[];
	onUpdateSession: (id: string, session: Partial<StudySession>) => void;
	onDeleteSession: (id: string) => void;
	onEditSession: (session: StudySession) => void;
}) {
	const markCompleted = (session: StudySession) => {
		onUpdateSession(session.id, {
			completed: true,
			completedAt: new Date().toISOString(),
			actualDuration: session.duration, // Default to planned duration
		});
	};

	const getTypeColor = (type: StudySession["type"]) => {
		switch (type) {
			case "problems":
				return "bg-blue-100 text-blue-800";
			case "quiz":
				return "bg-green-100 text-green-800";
			case "theory":
				return "bg-purple-100 text-purple-800";
			case "review":
				return "bg-orange-100 text-orange-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getDifficultyColor = (difficulty: StudySession["difficulty"]) => {
		switch (difficulty) {
			case "Easy":
				return "text-green-600";
			case "Medium":
				return "text-yellow-600";
			case "Hard":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	return (
		<div className="space-y-8">
			{/* Upcoming Sessions */}
			<div>
				<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
					<CalendarDaysIcon className="w-5 h-5" />
					Upcoming Sessions ({upcomingSessions.length})
				</h3>

				{upcomingSessions.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<CalendarDaysIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
						<p>No upcoming study sessions</p>
						<p className="text-sm">Add your first session to get started!</p>
					</div>
				) : (
					<div className="space-y-3">
						{upcomingSessions.map((session) => (
							<div key={session.id} className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<h4 className="font-medium">{session.title}</h4>
											<span
												className={`px-2 py-1 rounded-full text-xs ${getTypeColor(session.type)}`}
											>
												{session.type}
											</span>
											<span
												className={`text-sm font-medium ${getDifficultyColor(session.difficulty)}`}
											>
												{session.difficulty}
											</span>
										</div>

										<div className="flex items-center gap-4 text-sm text-gray-600">
											<div className="flex items-center gap-1">
												<CalendarDaysIcon className="w-4 h-4" />
												{new Date(session.scheduledDate).toLocaleDateString()}
											</div>
											<div className="flex items-center gap-1">
												<ClockIcon className="w-4 h-4" />
												{session.duration} min
											</div>
											<div className="flex items-center gap-1">
												<AcademicCapIcon className="w-4 h-4" />
												{session.topics.join(", ")}
											</div>
										</div>

										{session.description && (
											<p className="text-sm text-gray-600 mt-2">
												{session.description}
											</p>
										)}
									</div>

									<div className="flex gap-2">
										<button
											onClick={() => markCompleted(session)}
											className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
											title="Mark as completed"
										>
											<CheckCircleIcon className="w-4 h-4" />
										</button>
										<button
											onClick={() => onEditSession(session)}
											className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
											title="Edit session"
										>
											<PencilIcon className="w-4 h-4" />
										</button>
										<button
											onClick={() => onDeleteSession(session.id)}
											className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
											title="Delete session"
										>
											<XMarkIcon className="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Recent Completed Sessions */}
			{completedSessions.length > 0 && (
				<div>
					<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
						<CheckCircleIcon className="w-5 h-5 text-green-600" />
						Recent Completed Sessions
					</h3>

					<div className="space-y-3">
						{completedSessions.slice(0, 5).map((session) => (
							<div
								key={session.id}
								className="bg-green-50 rounded-lg p-4 border border-green-200"
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-1">
											<h4 className="font-medium">{session.title}</h4>
											<CheckCircleIcon className="w-4 h-4 text-green-600" />
										</div>
										<div className="flex items-center gap-4 text-sm text-gray-600">
											<span>
												Completed{" "}
												{new Date(session.completedAt!).toLocaleDateString()}
											</span>
											<span>
												{session.actualDuration || session.duration} min
											</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

function GoalsView({
	activeGoals,
	completedGoals,
	onUpdateGoal,
	onDeleteGoal,
	onEditGoal,
}: {
	activeGoals: StudyGoal[];
	completedGoals: StudyGoal[];
	onUpdateGoal: (id: string, goal: Partial<StudyGoal>) => void;
	onDeleteGoal: (id: string) => void;
	onEditGoal: (goal: StudyGoal) => void;
}) {
	const getPriorityColor = (priority: StudyGoal["priority"]) => {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const markCompleted = (goal: StudyGoal) => {
		onUpdateGoal(goal.id, { completed: true });
	};

	return (
		<div className="space-y-8">
			{/* Active Goals */}
			<div>
				<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
					<FlagIcon className="w-5 h-5" />
					Active Goals ({activeGoals.length})
				</h3>

				{activeGoals.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<FlagIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
						<p>No active goals</p>
						<p className="text-sm">
							Set your first goal to track your progress!
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{activeGoals.map((goal) => (
							<div key={goal.id} className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-start justify-between mb-3">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<h4 className="font-medium">{goal.title}</h4>
											<span
												className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(goal.priority)}`}
											>
												{goal.priority}
											</span>
										</div>
										<p className="text-sm text-gray-600">{goal.description}</p>
									</div>

									<div className="flex gap-1">
										<button
											onClick={() => onEditGoal(goal)}
											className="p-1 text-blue-600 hover:bg-blue-50 rounded"
										>
											<PencilIcon className="w-3 h-3" />
										</button>
										<button
											onClick={() => onDeleteGoal(goal.id)}
											className="p-1 text-red-600 hover:bg-red-50 rounded"
										>
											<XMarkIcon className="w-3 h-3" />
										</button>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Progress</span>
										<span>
											{goal.current} / {goal.target} {goal.unit}
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-blue-600 h-2 rounded-full transition-all duration-300"
											style={{
												width: `${Math.min(100, (goal.current / goal.target) * 100)}%`,
											}}
										/>
									</div>
									<div className="flex justify-between text-xs text-gray-500">
										<span>
											Deadline: {new Date(goal.deadline).toLocaleDateString()}
										</span>
										<span>
											{Math.round((goal.current / goal.target) * 100)}% complete
										</span>
									</div>
								</div>

								{goal.current >= goal.target && (
									<button
										onClick={() => markCompleted(goal)}
										className="w-full mt-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
									>
										<CheckCircleIcon className="w-4 h-4" />
										Mark as Completed
									</button>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Completed Goals */}
			{completedGoals.length > 0 && (
				<div>
					<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
						<CheckCircleIcon className="w-5 h-5 text-green-600" />
						Completed Goals ({completedGoals.length})
					</h3>

					<div className="space-y-3">
						{completedGoals.slice(0, 5).map((goal) => (
							<div
								key={goal.id}
								className="bg-green-50 rounded-lg p-4 border border-green-200"
							>
								<div className="flex items-center gap-3">
									<CheckCircleIcon className="w-5 h-5 text-green-600" />
									<div className="flex-1">
										<h4 className="font-medium">{goal.title}</h4>
										<p className="text-sm text-gray-600">{goal.description}</p>
									</div>
									<div className="text-sm text-gray-500">
										{goal.current} / {goal.target} {goal.unit}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

function AnalyticsView({
	sessions,
	goals,
}: {
	sessions: StudySession[];
	goals: StudyGoal[];
}) {
	const completedSessions = sessions.filter((s) => s.completed);
	const totalStudyTime = completedSessions.reduce(
		(sum, s) => sum + (s.actualDuration || s.duration),
		0,
	);
	const averageSessionDuration =
		completedSessions.length > 0
			? totalStudyTime / completedSessions.length
			: 0;

	const completedGoals = goals.filter((g) => g.completed);
	const activeGoals = goals.filter((g) => !g.completed);
	const avgGoalProgress =
		activeGoals.length > 0
			? (activeGoals.reduce((sum, g) => sum + g.current / g.target, 0) /
					activeGoals.length) *
				100
			: 0;

	const stats = [
		{
			label: "Total Study Time",
			value: `${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`,
			icon: ClockIcon,
			color: "text-blue-600",
		},
		{
			label: "Sessions Completed",
			value: completedSessions.length.toString(),
			icon: CheckCircleIcon,
			color: "text-green-600",
		},
		{
			label: "Goals Achieved",
			value: completedGoals.length.toString(),
			icon: FlagIcon,
			color: "text-purple-600",
		},
		{
			label: "Avg Goal Progress",
			value: `${Math.round(avgGoalProgress)}%`,
			icon: ChartBarIcon,
			color: "text-orange-600",
		},
	];

	return (
		<div className="space-y-8">
			{/* Key Statistics */}
			<div>
				<h3 className="text-lg font-semibold mb-4">Study Statistics</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{stats.map((stat, index) => (
						<div key={index} className="bg-gray-50 rounded-lg p-4">
							<div className="flex items-center gap-3">
								<stat.icon className={`w-8 h-8 ${stat.color}`} />
								<div>
									<p className="text-2xl font-bold">{stat.value}</p>
									<p className="text-sm text-gray-600">{stat.label}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Study Streak */}
			<div>
				<h3 className="text-lg font-semibold mb-4">Study Activity</h3>
				<div className="bg-gray-50 rounded-lg p-6">
					<div className="flex items-center gap-3 mb-4">
						<FireIcon className="w-6 h-6 text-orange-600" />
						<h4 className="font-medium">Current Study Streak</h4>
					</div>
					<div className="text-3xl font-bold text-orange-600 mb-2">7 days</div>
					<p className="text-sm text-gray-600">
						Keep it up! You're on a great streak.
					</p>
				</div>
			</div>

			{/* Recent Progress */}
			<div>
				<h3 className="text-lg font-semibold mb-4">Progress Overview</h3>
				<div className="space-y-4">
					{activeGoals.map((goal) => (
						<div key={goal.id} className="bg-gray-50 rounded-lg p-4">
							<div className="flex justify-between items-center mb-2">
								<h4 className="font-medium">{goal.title}</h4>
								<span className="text-sm text-gray-600">
									{goal.current} / {goal.target} {goal.unit}
								</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="bg-blue-600 h-2 rounded-full"
									style={{
										width: `${Math.min(100, (goal.current / goal.target) * 100)}%`,
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function SessionModal({
	session,
	onSave,
	onClose,
}: {
	session: StudySession | null;
	onSave: (session: Omit<StudySession, "id">) => void;
	onClose: () => void;
}) {
	const [formData, setFormData] = useState({
		title: session?.title || "",
		description: session?.description || "",
		scheduledDate: session?.scheduledDate
			? session.scheduledDate.split("T")[0]
			: new Date().toISOString().split("T")[0],
		duration: session?.duration || 60,
		topics: session?.topics || [],
		difficulty: session?.difficulty || ("Medium" as "Easy" | "Medium" | "Hard"),
		type: session?.type || ("problems" as StudySession["type"]),
		completed: session?.completed || false,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave({
			...formData,
			scheduledDate: new Date(formData.scheduledDate).toISOString(),
		});
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<h3 className="text-lg font-semibold mb-4">
					{session ? "Edit Session" : "Add New Session"}
				</h3>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Title</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Description
						</label>
						<textarea
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							rows={2}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">Date</label>
							<input
								type="date"
								value={formData.scheduledDate}
								onChange={(e) =>
									setFormData({ ...formData, scheduledDate: e.target.value })
								}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">
								Duration (min)
							</label>
							<input
								type="number"
								value={formData.duration}
								onChange={(e) =>
									setFormData({
										...formData,
										duration: parseInt(e.target.value),
									})
								}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								min="15"
								max="480"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">Type</label>
							<select
								value={formData.type}
								onChange={(e) =>
									setFormData({
										...formData,
										type: e.target.value as StudySession["type"],
									})
								}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="problems">Problems</option>
								<option value="quiz">Quiz</option>
								<option value="theory">Theory</option>
								<option value="review">Review</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">
								Difficulty
							</label>
							<select
								value={formData.difficulty}
								onChange={(e) =>
									setFormData({
										...formData,
										difficulty: e.target.value as StudySession["difficulty"],
									})
								}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="Easy">Easy</option>
								<option value="Medium">Medium</option>
								<option value="Hard">Hard</option>
							</select>
						</div>
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
						>
							{session ? "Update" : "Add"} Session
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function GoalModal({
	goal,
	onSave,
	onClose,
}: {
	goal: StudyGoal | null;
	onSave: (goal: Omit<StudyGoal, "id">) => void;
	onClose: () => void;
}) {
	const [formData, setFormData] = useState({
		title: goal?.title || "",
		description: goal?.description || "",
		target: goal?.target || 1,
		current: goal?.current || 0,
		unit: goal?.unit || ("problems" as StudyGoal["unit"]),
		deadline: goal?.deadline ? goal.deadline.split("T")[0] : "",
		priority: goal?.priority || ("medium" as StudyGoal["priority"]),
		completed: goal?.completed || false,
		category: goal?.category || "General",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave({
			...formData,
			deadline: new Date(formData.deadline).toISOString(),
		});
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<h3 className="text-lg font-semibold mb-4">
					{goal ? "Edit Goal" : "Add New Goal"}
				</h3>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Title</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Description
						</label>
						<textarea
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							rows={2}
						/>
					</div>

					<div className="grid grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">Target</label>
							<input
								type="number"
								value={formData.target}
								onChange={(e) =>
									setFormData({ ...formData, target: parseInt(e.target.value) })
								}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								min="1"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">Current</label>
							<input
								type="number"
								value={formData.current}
								onChange={(e) =>
									setFormData({
										...formData,
										current: parseInt(e.target.value),
									})
								}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								min="0"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">Unit</label>
							<select
								value={formData.unit}
								onChange={(e) =>
									setFormData({
										...formData,
										unit: e.target.value as StudyGoal["unit"],
									})
								}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="problems">Problems</option>
								<option value="hours">Hours</option>
								<option value="quizzes">Quizzes</option>
								<option value="topics">Topics</option>
							</select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">Priority</label>
							<select
								value={formData.priority}
								onChange={(e) =>
									setFormData({
										...formData,
										priority: e.target.value as StudyGoal["priority"],
									})
								}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="low">Low</option>
								<option value="medium">Medium</option>
								<option value="high">High</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">Deadline</label>
							<input
								type="date"
								value={formData.deadline}
								onChange={(e) =>
									setFormData({ ...formData, deadline: e.target.value })
								}
								className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
						>
							{goal ? "Update" : "Add"} Goal
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
