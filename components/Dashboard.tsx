"use client";

import {
	AcademicCapIcon,
	ArrowTrendingUpIcon,
	BookOpenIcon,
	CalendarIcon,
	ChartBarIcon,
	ClockIcon,
	FireIcon,
	MagnifyingGlassIcon,
	PlusIcon,
	StarIcon,
	TrophyIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import EditorialQuiz from "@/app/components/EditorialQuiz";
import LearningProgress from "@/app/components/LearningProgress";
import ProblemBrowser from "@/app/components/ProblemBrowser";
import QuizResults from "@/app/components/QuizResults";
import StudyPlanner from "@/app/components/StudyPlanner";
import { editorialProblems } from "@/app/lib/editorial-problems";

interface QuizState {
	isActive: boolean;
	currentQuestion: number;
	problems: any[];
	timeLeft: number;
	selectedAlgorithms: string[];
	answers: any[];
}

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState<
		"overview" | "practice" | "progress" | "browser" | "planner"
	>("overview");
	const [quizState, setQuizState] = useState<QuizState>({
		isActive: false,
		currentQuestion: 0,
		problems: [],
		timeLeft: 0,
		selectedAlgorithms: [],
		answers: [],
	});
	const [showResults, setShowResults] = useState(false);
	const [quizResults, setQuizResults] = useState<any>(null);
	const [selectedProblems, setSelectedProblems] = useState<string[]>([]);

	// Mock user stats - in real app, this would come from API
	const userStats = {
		totalQuizzes: 15,
		totalQuestions: 120,
		averageScore: 78,
		bestScore: 95,
		totalTimeSpent: 480, // minutes
		streakDays: 7,
		algorithmsMastered: 8,
		categoriesCovered: 12,
		improvementRate: 15,
		weeklyProgress: [
			{ week: "Mon", score: 75, questions: 10, timeSpent: 45 },
			{ week: "Tue", score: 82, questions: 12, timeSpent: 52 },
			{ week: "Wed", score: 78, questions: 8, timeSpent: 38 },
			{ week: "Thu", score: 85, questions: 15, timeSpent: 65 },
			{ week: "Fri", score: 90, questions: 10, timeSpent: 42 },
			{ week: "Sat", score: 88, questions: 12, timeSpent: 55 },
			{ week: "Sun", score: 92, questions: 8, timeSpent: 35 },
		],
		algorithmProgress: [
			{
				algorithm: "Two Pointers",
				masteryLevel: 85,
				questionsAttempted: 15,
				correctAnswers: 13,
				lastPracticed: "2 days ago",
			},
			{
				algorithm: "Dynamic Programming",
				masteryLevel: 65,
				questionsAttempted: 20,
				correctAnswers: 13,
				lastPracticed: "1 day ago",
			},
			{
				algorithm: "Binary Search",
				masteryLevel: 90,
				questionsAttempted: 12,
				correctAnswers: 11,
				lastPracticed: "3 days ago",
			},
			{
				algorithm: "Sliding Window",
				masteryLevel: 75,
				questionsAttempted: 18,
				correctAnswers: 14,
				lastPracticed: "Today",
			},
		],
		categoryProgress: [
			{
				category: "Array",
				averageScore: 82,
				questionsAttempted: 45,
				improvement: 12,
			},
			{
				category: "String",
				averageScore: 78,
				questionsAttempted: 32,
				improvement: 8,
			},
			{
				category: "Tree",
				averageScore: 85,
				questionsAttempted: 28,
				improvement: 15,
			},
			{
				category: "Graph",
				averageScore: 70,
				questionsAttempted: 15,
				improvement: 5,
			},
		],
		achievements: [
			{
				id: "1",
				title: "First Steps",
				description: "Complete your first quiz",
				icon: "🎯",
				unlocked: true,
				unlockedDate: "2024-01-15",
			},
			{
				id: "2",
				title: "Streak Master",
				description: "Maintain a 7-day study streak",
				icon: "🔥",
				unlocked: true,
				unlockedDate: "2024-01-20",
			},
			{
				id: "3",
				title: "Algorithm Expert",
				description: "Master 10 algorithms",
				icon: "🏆",
				unlocked: false,
			},
			{
				id: "4",
				title: "Speed Demon",
				description: "Complete 20 questions in under 30 minutes",
				icon: "⚡",
				unlocked: false,
			},
		],
	};

	const startQuiz = async (config: any) => {
		try {
			const response = await fetch("/api/quiz/enhanced-start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: "current-user",
					config,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				setQuizState({
					isActive: true,
					currentQuestion: 0,
					problems: data.quiz.problems,
					timeLeft: data.quiz.timeLimit * 60,
					selectedAlgorithms: [],
					answers: [],
				});
				setActiveTab("practice");
			}
		} catch (error) {
			console.error("Error starting quiz:", error);
		}
	};

	const handleAlgorithmSelect = (algorithms: string[]) => {
		setQuizState((prev) => ({ ...prev, selectedAlgorithms: algorithms }));
	};

	const handleNextQuestion = () => {
		if (quizState.currentQuestion < quizState.problems.length - 1) {
			setQuizState((prev) => ({
				...prev,
				currentQuestion: prev.currentQuestion + 1,
				selectedAlgorithms: [],
			}));
		} else {
			// Quiz completed
			const results = {
				score: 85,
				totalQuestions: quizState.problems.length,
				timeSpent: 1200,
				correctAnswers: Math.floor(quizState.problems.length * 0.85),
				incorrectAnswers: Math.floor(quizState.problems.length * 0.15),
				averageTimePerQuestion: 120,
				difficultyBreakdown: {
					easy: { correct: 3, total: 3 },
					medium: { correct: 4, total: 5 },
					hard: { correct: 1, total: 2 },
				},
				categoryPerformance: [
					{ category: "Array", correct: 5, total: 6, percentage: 83 },
					{ category: "String", correct: 3, total: 4, percentage: 75 },
				],
				algorithmAccuracy: [
					{ algorithm: "Two Pointers", correct: 4, total: 5, percentage: 80 },
					{ algorithm: "Hash Table", correct: 3, total: 3, percentage: 100 },
				],
				recommendations: [
					{
						type: "strength" as const,
						title: "Strong in Hash Tables",
						description:
							"You consistently perform well with hash table problems.",
						action: "Continue practicing advanced hash table applications",
					},
					{
						type: "weakness" as const,
						title: "Need improvement in Dynamic Programming",
						description: "Your DP problem-solving skills need more practice.",
						action: "Focus on DP fundamentals and common patterns",
					},
				],
			};
			setQuizResults(results);
			setShowResults(true);
			setQuizState((prev) => ({ ...prev, isActive: false }));
		}
	};

	const handleRetryQuiz = () => {
		setShowResults(false);
		setQuizState((prev) => ({
			...prev,
			currentQuestion: 0,
			selectedAlgorithms: [],
			answers: [],
		}));
	};

	const handleNewQuiz = () => {
		setShowResults(false);
		setActiveTab("overview");
	};

	const handleCreateQuiz = (problems: string[]) => {
		startQuiz({
			specificProblems: problems,
			problemCount: problems.length,
			timeLimit: Math.max(15, problems.length * 2),
			includeHints: true,
			includeSolutions: true,
		});
	};

	const getCurrentProblem = () => {
		if (
			!quizState.isActive ||
			quizState.currentQuestion >= quizState.problems.length
		)
			return null;
		return quizState.problems[quizState.currentQuestion];
	};

	const getAlgorithmsForProblem = (problem: any) => {
		// Mock algorithms - in real app, this would come from the problem data
		return [
			{
				id: "1",
				name: "Two Pointers",
				category: "Array",
				description: "Use two pointers to traverse the array",
				timeComplexity: "O(n)",
				spaceComplexity: "O(1)",
			},
			{
				id: "2",
				name: "Hash Table",
				category: "Hash Table",
				description: "Store elements in a hash table for O(1) lookup",
				timeComplexity: "O(n)",
				spaceComplexity: "O(n)",
			},
			{
				id: "3",
				name: "Sliding Window",
				category: "Array",
				description: "Maintain a window of elements",
				timeComplexity: "O(n)",
				spaceComplexity: "O(1)",
			},
		];
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center">
							<AcademicCapIcon className="w-8 h-8 text-blue-600 mr-3" />
							<h1 className="text-xl font-bold text-gray-900">
								SpeedCoders Dashboard
							</h1>
						</div>
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2 text-orange-600">
								<FireIcon className="w-5 h-5" />
								<span className="font-medium">
									{userStats.streakDays} day streak
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Navigation Tabs */}
			<div className="bg-white border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<nav className="flex space-x-8">
						{[
							{ id: "overview", label: "Overview", icon: ChartBarIcon },
							{ id: "practice", label: "Practice", icon: BookOpenIcon },
							{ id: "progress", label: "Progress", icon: ArrowTrendingUpIcon },
							{ id: "browser", label: "Problems", icon: MagnifyingGlassIcon },
							{ id: "planner", label: "Study Plan", icon: CalendarIcon },
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id as any)}
								className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
									activeTab === tab.id
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
							>
								<tab.icon className="w-4 h-4" />
								{tab.label}
							</button>
						))}
					</nav>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				{activeTab === "overview" && (
					<div className="space-y-6">
						{/* Quick Stats */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<div className="bg-white p-6 rounded-lg shadow">
								<div className="flex items-center">
									<div className="p-2 bg-blue-100 rounded-lg">
										<AcademicCapIcon className="w-6 h-6 text-blue-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Total Quizzes
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{userStats.totalQuizzes}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<div className="flex items-center">
									<div className="p-2 bg-green-100 rounded-lg">
										<ChartBarIcon className="w-6 h-6 text-green-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Average Score
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{userStats.averageScore}%
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<div className="flex items-center">
									<div className="p-2 bg-purple-100 rounded-lg">
										<ClockIcon className="w-6 h-6 text-purple-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Study Time
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{Math.floor(userStats.totalTimeSpent / 60)}h
										</p>
									</div>
								</div>
							</div>

							<div className="bg-white p-6 rounded-lg shadow">
								<div className="flex items-center">
									<div className="p-2 bg-orange-100 rounded-lg">
										<StarIcon className="w-6 h-6 text-orange-600" />
									</div>
									<div className="ml-4">
										<p className="text-sm font-medium text-gray-600">
											Algorithms Mastered
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{userStats.algorithmsMastered}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Quick Actions */}
						<div className="bg-white p-6 rounded-lg shadow">
							<h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<button
									onClick={() =>
										startQuiz({
											difficulty: "Easy",
											problemCount: 5,
											timeLimit: 15,
										})
									}
									className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
								>
									<div className="flex items-center gap-3">
										<div className="p-2 bg-green-100 rounded-lg">
											<PlusIcon className="w-5 h-5 text-green-600" />
										</div>
										<div>
											<h3 className="font-medium text-gray-900">
												Quick Practice
											</h3>
											<p className="text-sm text-gray-600">
												5 easy problems, 15 minutes
											</p>
										</div>
									</div>
								</button>

								<button
									onClick={() =>
										startQuiz({
											difficulty: "Mixed",
											problemCount: 10,
											timeLimit: 25,
										})
									}
									className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
								>
									<div className="flex items-center gap-3">
										<div className="p-2 bg-blue-100 rounded-lg">
											<BookOpenIcon className="w-5 h-5 text-blue-600" />
										</div>
										<div>
											<h3 className="font-medium text-gray-900">
												Study Session
											</h3>
											<p className="text-sm text-gray-600">
												10 mixed problems, 25 minutes
											</p>
										</div>
									</div>
								</button>

								<button
									onClick={() => setActiveTab("browser")}
									className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
								>
									<div className="flex items-center gap-3">
										<div className="p-2 bg-purple-100 rounded-lg">
											<TrophyIcon className="w-5 h-5 text-purple-600" />
										</div>
										<div>
											<h3 className="font-medium text-gray-900">
												Browse Problems
											</h3>
											<p className="text-sm text-gray-600">
												Select specific problems to practice
											</p>
										</div>
									</div>
								</button>
							</div>
						</div>

						{/* Recent Activity */}
						<div className="bg-white p-6 rounded-lg shadow">
							<h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
							<div className="space-y-3">
								{userStats.weeklyProgress
									.slice(-3)
									.reverse()
									.map((day, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
										>
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
													<span className="text-sm font-medium text-blue-600">
														{day.week}
													</span>
												</div>
												<div>
													<p className="font-medium text-gray-900">
														{day.questions} questions completed
													</p>
													<p className="text-sm text-gray-600">
														{day.score}% accuracy
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-sm font-medium text-gray-900">
													{day.timeSpent} min
												</p>
											</div>
										</div>
									))}
							</div>
						</div>
					</div>
				)}

				{activeTab === "practice" && quizState.isActive && (
					<EditorialQuiz
						problem={getCurrentProblem()}
						algorithms={getAlgorithmsForProblem(getCurrentProblem())}
						onAlgorithmSelect={handleAlgorithmSelect}
						selectedAlgorithms={quizState.selectedAlgorithms}
						onNext={handleNextQuestion}
						timeLeft={quizState.timeLeft}
					/>
				)}

				{activeTab === "practice" && showResults && (
					<QuizResults
						result={quizResults}
						onRetry={handleRetryQuiz}
						onNewQuiz={handleNewQuiz}
					/>
				)}

				{activeTab === "progress" && (
					<LearningProgress
						data={{
							totalProblems: userStats.totalQuestions,
							solvedProblems: Math.floor(userStats.totalQuestions * 0.8), // Estimate
							streakDays: userStats.streakDays,
							totalTimeSpent: userStats.totalTimeSpent,
							accuracy: userStats.averageScore,
							level:
								userStats.averageScore >= 90
									? "expert"
									: userStats.averageScore >= 80
										? "advanced"
										: userStats.averageScore >= 70
											? "intermediate"
											: "beginner",
							experience: userStats.totalQuestions * 10,
							nextLevelExp: 1000,
							categories: userStats.categoryProgress.map((cat) => ({
								name: cat.category,
								progress: cat.averageScore,
								total: cat.questionsAttempted,
								solved: Math.floor(cat.questionsAttempted * 0.8),
							})),
							recentActivity: userStats.weeklyProgress
								.slice(-5)
								.map((day, index) => ({
									id: index.toString(),
									type: "quiz" as const,
									title: `${day.questions} questions completed`,
									difficulty: "Mixed",
									status: "completed" as const,
									timestamp: new Date().toISOString(),
									timeSpent: day.timeSpent,
								})),
							achievements: userStats.achievements.map((ach) => ({
								id: ach.id,
								title: ach.title,
								description: ach.description,
								icon: ach.icon,
								unlocked: ach.unlocked,
								progress: ach.unlocked ? 100 : 0,
								maxProgress: 100,
							})),
						}}
					/>
				)}

				{activeTab === "browser" && (
					<ProblemBrowser
						onSelectProblems={setSelectedProblems}
						onCreateQuiz={handleCreateQuiz}
					/>
				)}

				{activeTab === "planner" && (
					<StudyPlanner
						sessions={[]}
						goals={[]}
						onAddSession={() => {}}
						onUpdateSession={() => {}}
						onDeleteSession={() => {}}
						onAddGoal={() => {}}
						onUpdateGoal={() => {}}
						onDeleteGoal={() => {}}
					/>
				)}
			</div>
		</div>
	);
}
