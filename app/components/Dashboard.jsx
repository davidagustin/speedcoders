import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { difficultyStats, topAlgorithms } from "../data/allProblems";

function Dashboard({ user }) {
	const navigate = useNavigate();
	const [userStats, setUserStats] = useState({
		totalQuizzes: 0,
		totalProblems: 0,
		averageScore: 0,
		bestScore: 0,
		totalXP: 0,
		streak: 0,
		lastQuizDate: null,
		difficultyBreakdown: { Easy: 0, Medium: 0, Hard: 0 },
		algorithmMastery: {},
		weeklyProgress: [],
	});

	const [dailyChallenge, setDailyChallenge] = useState(null);

	useEffect(() => {
		const users = JSON.parse(localStorage.getItem("users") || "[]");
		const currentUser = users.find((u) => u.id === user.id);

		if (currentUser?.scores) {
			calculateUserStats(currentUser.scores);
		}

		// Generate daily challenge
		const today = new Date().toDateString();
		const savedChallenge = localStorage.getItem(`dailyChallenge_${today}`);
		if (savedChallenge) {
			setDailyChallenge(JSON.parse(savedChallenge));
		} else {
			const challenge = generateDailyChallenge();
			setDailyChallenge(challenge);
			localStorage.setItem(
				`dailyChallenge_${today}`,
				JSON.stringify(challenge),
			);
		}
	}, [user, calculateUserStats, generateDailyChallenge]);

	const calculateUserStats = (scores) => {
		const totalQuizzes = scores.length;
		const totalProblems = scores.reduce(
			(acc, score) => acc + score.totalQuestions,
			0,
		);
		const averageScore =
			totalQuizzes > 0
				? scores.reduce((acc, score) => acc + score.percentage, 0) /
					totalQuizzes
				: 0;
		const bestScore =
			totalQuizzes > 0 ? Math.max(...scores.map((s) => s.percentage)) : 0;

		// Calculate XP (Experience Points)
		const totalXP = scores.reduce((acc, score) => {
			let xp = score.percentage * 10; // Base XP
			if (score.difficulty === "Hard") xp *= 2;
			else if (score.difficulty === "Medium") xp *= 1.5;
			return acc + Math.round(xp);
		}, 0);

		// Calculate difficulty breakdown
		const difficultyBreakdown = scores.reduce(
			(acc, score) => {
				acc[score.difficulty] =
					(acc[score.difficulty] || 0) + score.totalQuestions;
				return acc;
			},
			{ Easy: 0, Medium: 0, Hard: 0 },
		);

		// Calculate algorithm mastery
		const algorithmMastery = {};
		scores.forEach((score) => {
			if (score.details) {
				score.details.forEach((detail) => {
					detail.correctAnswer.forEach((algo) => {
						if (!algorithmMastery[algo]) {
							algorithmMastery[algo] = { correct: 0, total: 0, mastery: 0 };
						}
						algorithmMastery[algo].total++;
						if (detail.isCorrect) {
							algorithmMastery[algo].correct++;
						}
						algorithmMastery[algo].mastery = Math.round(
							(algorithmMastery[algo].correct / algorithmMastery[algo].total) *
								100,
						);
					});
				});
			}
		});

		// Calculate streak
		const sortedScores = scores.sort(
			(a, b) => new Date(b.date) - new Date(a.date),
		);
		let streak = 0;
		let lastDate = new Date();

		for (const score of sortedScores) {
			const scoreDate = new Date(score.date);
			const daysDiff = Math.floor(
				(lastDate - scoreDate) / (1000 * 60 * 60 * 24),
			);

			if (daysDiff <= 1) {
				streak++;
				lastDate = scoreDate;
			} else {
				break;
			}
		}

		setUserStats({
			totalQuizzes,
			totalProblems,
			averageScore: Math.round(averageScore * 10) / 10,
			bestScore,
			totalXP,
			streak,
			lastQuizDate: sortedScores[0]?.date,
			difficultyBreakdown,
			algorithmMastery,
			weeklyProgress: generateWeeklyProgress(scores),
		});
	};

	const generateDailyChallenge = () => {
		const challenges = [
			{
				title: "Speed Demon",
				description: "Complete a Medium quiz in under 10 minutes",
				difficulty: "Medium",
				reward: "500 XP",
				icon: "⚡",
				type: "speed",
			},
			{
				title: "Perfectionist",
				description: "Score 100% on any quiz",
				difficulty: "Any",
				reward: "750 XP",
				icon: "💯",
				type: "accuracy",
			},
			{
				title: "Algorithm Explorer",
				description: "Practice 3 different algorithm categories today",
				difficulty: "Any",
				reward: "600 XP",
				icon: "🔍",
				type: "variety",
			},
		];

		return challenges[Math.floor(Math.random() * challenges.length)];
	};

	const generateWeeklyProgress = (scores) => {
		const lastWeek = [];
		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			const dateStr = date.toDateString();
			const dayScores = scores.filter(
				(s) => new Date(s.date).toDateString() === dateStr,
			);
			lastWeek.push({
				date: dateStr,
				count: dayScores.length,
				avgScore:
					dayScores.length > 0
						? Math.round(
								dayScores.reduce((acc, s) => acc + s.percentage, 0) /
									dayScores.length,
							)
						: 0,
			});
		}
		return lastWeek;
	};

	const startQuiz = (mode, options = {}) => {
		navigate("/quiz", { state: { mode, ...options } });
	};

	const userLevel = Math.floor(userStats.totalXP / 1000) + 1;
	const xpForNextLevel = userLevel * 1000 - userStats.totalXP;
	const levelProgress = ((userStats.totalXP % 1000) / 1000) * 100;

	return (
		<div className="enhanced-dashboard">
			{/* Header Stats */}
			<div className="dashboard-header">
				<div className="welcome-section">
					<h1>Welcome back, {user.username}! 👋</h1>
					<p className="subtitle">
						Ready to conquer more algorithms? You've solved{" "}
						{userStats.totalProblems} problems so far!
					</p>
				</div>

				<div className="level-progress">
					<div className="level-info">
						<span className="level-badge">Level {userLevel}</span>
						<span className="xp-text">{userStats.totalXP} XP</span>
					</div>
					<div className="progress-bar">
						<div
							className="progress-fill"
							style={{ width: `${levelProgress}%` }}
						/>
					</div>
					<span className="next-level">
						{xpForNextLevel} XP to Level {userLevel + 1}
					</span>
				</div>
			</div>

			{/* Daily Challenge */}
			{dailyChallenge && (
				<div className="daily-challenge">
					<div className="challenge-header">
						<h2>🎯 Daily Challenge</h2>
						<span className="challenge-reward">{dailyChallenge.reward}</span>
					</div>
					<div className="challenge-content">
						<div className="challenge-icon">{dailyChallenge.icon}</div>
						<div className="challenge-details">
							<h3>{dailyChallenge.title}</h3>
							<p>{dailyChallenge.description}</p>
							<span className="challenge-difficulty">
								{dailyChallenge.difficulty}
							</span>
						</div>
						<button
							className="challenge-btn"
							onClick={() =>
								startQuiz("challenge", { challenge: dailyChallenge })
							}
						>
							Accept Challenge
						</button>
					</div>
				</div>
			)}

			{/* Key Metrics */}
			<div className="metrics-grid">
				<div className="metric-card streak">
					<div className="metric-icon">🔥</div>
					<div className="metric-content">
						<h3>Current Streak</h3>
						<p className="metric-value">{userStats.streak} days</p>
					</div>
				</div>

				<div className="metric-card accuracy">
					<div className="metric-icon">🎯</div>
					<div className="metric-content">
						<h3>Average Accuracy</h3>
						<p className="metric-value">{userStats.averageScore}%</p>
					</div>
				</div>

				<div className="metric-card problems">
					<div className="metric-icon">📝</div>
					<div className="metric-content">
						<h3>Problems Solved</h3>
						<p className="metric-value">{userStats.totalProblems}</p>
						<p className="metric-sub">of 3,662 total</p>
					</div>
				</div>

				<div className="metric-card best">
					<div className="metric-icon">⭐</div>
					<div className="metric-content">
						<h3>Best Score</h3>
						<p className="metric-value">{userStats.bestScore}%</p>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="quick-actions">
				<h2>🚀 Quick Start</h2>
				<div className="action-grid">
					<div
						className="action-card featured"
						onClick={() => startQuiz("smart")}
					>
						<div className="action-icon">🧠</div>
						<h3>Smart Quiz</h3>
						<p>AI-powered quiz based on your weak areas</p>
						<span className="action-badge">Recommended</span>
					</div>

					<div
						className="action-card"
						onClick={() => startQuiz("company", { company: "Google" })}
					>
						<div className="action-icon">🏢</div>
						<h3>Company Focus</h3>
						<p>Practice problems from top tech companies</p>
					</div>

					<div className="action-card" onClick={() => startQuiz("algorithm")}>
						<div className="action-icon">🧮</div>
						<h3>Algorithm Deep Dive</h3>
						<p>Focus on specific algorithms</p>
					</div>

					<div className="action-card" onClick={() => startQuiz("timed")}>
						<div className="action-icon">⏱️</div>
						<h3>Speed Challenge</h3>
						<p>Test your speed under pressure</p>
					</div>

					<div
						className="action-card"
						onClick={() => startQuiz("difficulty", { difficulty: "Hard" })}
					>
						<div className="action-icon">🔥</div>
						<h3>Hard Problems</h3>
						<p>Challenge yourself with tough questions</p>
					</div>

					<div className="action-card" onClick={() => startQuiz("review")}>
						<div className="action-icon">🔄</div>
						<h3>Review Mistakes</h3>
						<p>Retry problems you got wrong</p>
					</div>
				</div>
			</div>

			{/* Progress Analytics */}
			<div className="dashboard-analytics">
				<div className="analytics-section">
					<h2>📊 Your Progress</h2>
					<div className="progress-charts">
						{/* Weekly Activity */}
						<div className="chart-container">
							<h3>Weekly Activity</h3>
							<div className="activity-chart">
								{userStats.weeklyProgress.map((day, index) => (
									<div key={index} className="activity-day">
										<div
											className="activity-bar"
											style={{
												height: `${Math.max(day.count * 20, 5)}px`,
												backgroundColor: day.count > 0 ? "#4CAF50" : "#E0E0E0",
											}}
										/>
										<span className="day-label">
											{new Date(day.date).toLocaleDateString("en-US", {
												weekday: "short",
											})}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Difficulty Breakdown */}
						<div className="chart-container">
							<h3>Difficulty Distribution</h3>
							<div className="difficulty-chart">
								{Object.entries(userStats.difficultyBreakdown).map(
									([difficulty, count]) => (
										<div key={difficulty} className="difficulty-item">
											<span
												className={`difficulty-label ${difficulty.toLowerCase()}`}
											>
												{difficulty}
											</span>
											<div className="difficulty-bar-container">
												<div
													className={`difficulty-bar ${difficulty.toLowerCase()}`}
													style={{
														width: `${Math.max((count / Math.max(...Object.values(userStats.difficultyBreakdown))) * 100, 5)}%`,
													}}
												/>
												<span className="difficulty-count">{count}</span>
											</div>
										</div>
									),
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Algorithm Mastery Preview */}
				<div className="algorithm-mastery-preview">
					<h3>🎯 Top Algorithm Mastery</h3>
					<div className="mastery-list">
						{Object.entries(userStats.algorithmMastery)
							.sort((a, b) => b[1].mastery - a[1].mastery)
							.slice(0, 5)
							.map(([algorithm, stats]) => (
								<div key={algorithm} className="mastery-item">
									<div className="mastery-info">
										<span className="algorithm-name">{algorithm}</span>
										<span className="mastery-percentage">{stats.mastery}%</span>
									</div>
									<div className="mastery-bar">
										<div
											className="mastery-fill"
											style={{ width: `${stats.mastery}%` }}
										/>
									</div>
									<span className="mastery-count">
										{stats.correct}/{stats.total}
									</span>
								</div>
							))}
					</div>
					<button
						className="view-all-btn"
						onClick={() => navigate("/algorithms")}
					>
						View All Algorithms →
					</button>
				</div>
			</div>

			{/* Database Stats */}
			<div className="database-stats">
				<h2>📚 Database Overview</h2>
				<div className="stats-grid">
					<div className="stat-item">
						<span className="stat-value">{difficultyStats.total}</span>
						<span className="stat-label">Total Problems</span>
					</div>
					<div className="stat-item">
						<span className="stat-value">{difficultyStats.easy}</span>
						<span className="stat-label">Easy</span>
					</div>
					<div className="stat-item">
						<span className="stat-value">{difficultyStats.medium}</span>
						<span className="stat-label">Medium</span>
					</div>
					<div className="stat-item">
						<span className="stat-value">{difficultyStats.hard}</span>
						<span className="stat-label">Hard</span>
					</div>
					<div className="stat-item">
						<span className="stat-value">{topAlgorithms.length}</span>
						<span className="stat-label">Algorithms</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
