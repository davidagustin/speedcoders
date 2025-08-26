import { useEffect, useState } from "react";
import { allLeetcodeProblems } from "../data/allProblems";

function ContestMode({ user }) {
	const [currentContest, setCurrentContest] = useState(null);
	const [contestHistory, setContestHistory] = useState([]);
	const [problems, setProblems] = useState([]);
	const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
	const [timeRemaining, setTimeRemaining] = useState(0);
	const [startTime, setStartTime] = useState(null);
	const [answers, setAnswers] = useState({});
	const [contestFinished, setContestFinished] = useState(false);
	const [results, setResults] = useState(null);
	const [contestType, setContestType] = useState("weekly");
	const [difficulty, setDifficulty] = useState("mixed");

	const contestTypes = {
		weekly: { duration: 90, problems: 4, name: "Weekly Contest" },
		biweekly: { duration: 90, problems: 4, name: "Biweekly Contest" },
		daily: { duration: 60, problems: 3, name: "Daily Challenge" },
		sprint: { duration: 30, problems: 2, name: "Speed Sprint" },
		marathon: { duration: 180, problems: 6, name: "Marathon Contest" },
	};

	useEffect(() => {
		const savedContests = localStorage.getItem("contestHistory");
		if (savedContests) {
			setContestHistory(JSON.parse(savedContests));
		}

		const savedContest = localStorage.getItem("currentContest");
		if (savedContest) {
			const contest = JSON.parse(savedContest);
			if (contest.endTime > Date.now()) {
				setCurrentContest(contest);
				setProblems(contest.problems);
				setAnswers(contest.answers || {});
				setCurrentProblemIndex(contest.currentProblemIndex || 0);
				setStartTime(contest.startTime);
				setTimeRemaining(Math.floor((contest.endTime - Date.now()) / 1000));
				setContestType(contest.type);
			} else {
				localStorage.removeItem("currentContest");
				finishContest(contest);
			}
		}
	}, [finishContest]);

	useEffect(() => {
		let timer;
		if (currentContest && timeRemaining > 0 && !contestFinished) {
			timer = setInterval(() => {
				setTimeRemaining((prev) => {
					if (prev <= 1) {
						finishContest(currentContest);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}
		return () => clearInterval(timer);
	}, [currentContest, timeRemaining, contestFinished, finishContest]);

	useEffect(() => {
		if (currentContest && !contestFinished) {
			const contestData = {
				...currentContest,
				answers,
				currentProblemIndex,
			};
			localStorage.setItem("currentContest", JSON.stringify(contestData));
		}
	}, [answers, currentProblemIndex, currentContest, contestFinished]);

	const generateContestProblems = (type, difficulty) => {
		const config = contestTypes[type];
		let problemPool = [...allLeetcodeProblems];

		if (difficulty !== "mixed") {
			problemPool = problemPool.filter((p) => p.difficulty === difficulty);
		}

		const selectedProblems = [];
		const difficultyDistribution =
			difficulty === "mixed"
				? type === "sprint"
					? { Easy: 1, Medium: 1 }
					: type === "daily"
						? { Easy: 1, Medium: 1, Hard: 1 }
						: { Easy: 1, Medium: 2, Hard: 1 }
				: null;

		if (difficultyDistribution) {
			Object.entries(difficultyDistribution).forEach(([diff, count]) => {
				const diffProblems = problemPool.filter((p) => p.difficulty === diff);
				for (let i = 0; i < count && diffProblems.length > 0; i++) {
					const randomIndex = Math.floor(Math.random() * diffProblems.length);
					selectedProblems.push(diffProblems.splice(randomIndex, 1)[0]);
				}
			});
		} else {
			for (let i = 0; i < config.problems && problemPool.length > 0; i++) {
				const randomIndex = Math.floor(Math.random() * problemPool.length);
				selectedProblems.push(problemPool.splice(randomIndex, 1)[0]);
			}
		}

		return selectedProblems;
	};

	const startContest = () => {
		const config = contestTypes[contestType];
		const contestProblems = generateContestProblems(contestType, difficulty);
		const startTime = Date.now();
		const endTime = startTime + config.duration * 60 * 1000;

		const contest = {
			id: `contest_${startTime}`,
			type: contestType,
			name: `${config.name} #${contestHistory.length + 1}`,
			problems: contestProblems,
			startTime,
			endTime,
			duration: config.duration,
			answers: {},
			currentProblemIndex: 0,
		};

		setCurrentContest(contest);
		setProblems(contestProblems);
		setTimeRemaining(config.duration * 60);
		setStartTime(startTime);
		setAnswers({});
		setCurrentProblemIndex(0);
		setContestFinished(false);
		setResults(null);
	};

	const finishContest = (contest = currentContest) => {
		if (!contest) return;

		const endTime = Date.now();
		const actualDuration = Math.floor((endTime - startTime) / 1000);

		let score = 0;
		let correctCount = 0;
		const problemResults = contest.problems.map((problem, index) => {
			const userAnswers = answers[index] || [];
			const correctAnswers = problem.correctAlgorithms;
			const isCorrect =
				userAnswers.length > 0 &&
				userAnswers.some((answer) => correctAnswers.includes(answer));

			if (isCorrect) {
				correctCount++;
				const difficultyMultiplier =
					problem.difficulty === "Easy"
						? 1
						: problem.difficulty === "Medium"
							? 2
							: 3;
				score += 100 * difficultyMultiplier;
			}

			return {
				problem,
				userAnswers,
				correctAnswers,
				isCorrect,
				points: isCorrect
					? 100 *
						(problem.difficulty === "Easy"
							? 1
							: problem.difficulty === "Medium"
								? 2
								: 3)
					: 0,
			};
		});

		const contestResult = {
			...contest,
			endTime,
			actualDuration,
			score,
			correctCount,
			totalProblems: contest.problems.length,
			accuracy: (correctCount / contest.problems.length) * 100,
			problemResults,
			rank: calculateRank(score, contest.type),
		};

		const updatedHistory = [...contestHistory, contestResult];
		setContestHistory(updatedHistory);
		localStorage.setItem("contestHistory", JSON.stringify(updatedHistory));
		localStorage.removeItem("currentContest");

		setResults(contestResult);
		setContestFinished(true);
		setCurrentContest(null);

		updateUserStats(contestResult);
	};

	const calculateRank = (score, type) => {
		const maxScore = contestTypes[type].problems * 300;
		const percentage = (score / maxScore) * 100;

		if (percentage >= 90) return "Grandmaster";
		if (percentage >= 80) return "Master";
		if (percentage >= 70) return "Expert";
		if (percentage >= 60) return "Specialist";
		if (percentage >= 40) return "Pupil";
		return "Newbie";
	};

	const updateUserStats = (contestResult) => {
		const users = JSON.parse(localStorage.getItem("users") || "[]");
		const userIndex = users.findIndex((u) => u.id === user.id);

		if (userIndex !== -1) {
			users[userIndex].contestStats = users[userIndex].contestStats || {
				totalContests: 0,
				totalScore: 0,
				bestRank: "Newbie",
				averageAccuracy: 0,
				totalProblems: 0,
				correctProblems: 0,
			};

			const stats = users[userIndex].contestStats;
			stats.totalContests++;
			stats.totalScore += contestResult.score;
			stats.totalProblems += contestResult.totalProblems;
			stats.correctProblems += contestResult.correctCount;
			stats.averageAccuracy =
				(stats.correctProblems / stats.totalProblems) * 100;

			const rankValues = {
				Newbie: 0,
				Pupil: 1,
				Specialist: 2,
				Expert: 3,
				Master: 4,
				Grandmaster: 5,
			};
			if (rankValues[contestResult.rank] > rankValues[stats.bestRank]) {
				stats.bestRank = contestResult.rank;
			}

			users[userIndex].totalXP =
				(users[userIndex].totalXP || 0) + contestResult.score / 10;
			localStorage.setItem("users", JSON.stringify(users));
		}
	};

	const handleAnswerChange = (problemIndex, selectedAnswers) => {
		setAnswers((prev) => ({
			...prev,
			[problemIndex]: selectedAnswers,
		}));
	};

	const formatTime = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return hours > 0
			? `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
			: `${minutes}:${secs.toString().padStart(2, "0")}`;
	};

	const getRankColor = (rank) => {
		const colors = {
			Newbie: "#808080",
			Pupil: "#008000",
			Specialist: "#03A89E",
			Expert: "#0000FF",
			Master: "#AA00AA",
			Grandmaster: "#FF8C00",
		};
		return colors[rank] || "#808080";
	};

	if (results) {
		return (
			<div className="contest-results">
				<div className="results-header">
					<h2>🏆 Contest Results</h2>
					<div className="contest-info">
						<h3>{results.name}</h3>
						<p>Duration: {formatTime(results.actualDuration)}</p>
					</div>
				</div>

				<div className="results-summary">
					<div className="summary-stats">
						<div className="stat-item">
							<span className="stat-label">Score:</span>
							<span className="stat-value">{results.score}</span>
						</div>
						<div className="stat-item">
							<span className="stat-label">Problems Solved:</span>
							<span className="stat-value">
								{results.correctCount}/{results.totalProblems}
							</span>
						</div>
						<div className="stat-item">
							<span className="stat-label">Accuracy:</span>
							<span className="stat-value">{results.accuracy.toFixed(1)}%</span>
						</div>
						<div className="stat-item">
							<span className="stat-label">Rank:</span>
							<span
								className="stat-value"
								style={{ color: getRankColor(results.rank) }}
							>
								{results.rank}
							</span>
						</div>
					</div>
				</div>

				<div className="problem-results">
					<h4>Problem Breakdown</h4>
					{results.problemResults.map((result, index) => (
						<div
							key={index}
							className={`problem-result ${result.isCorrect ? "correct" : "incorrect"}`}
						>
							<div className="problem-header">
								<span className="problem-title">
									#{index + 1}. {result.problem.title}
								</span>
								<span
									className={`difficulty ${result.problem.difficulty.toLowerCase()}`}
								>
									{result.problem.difficulty}
								</span>
								<span className="points">+{result.points}</span>
							</div>
							<div className="answer-details">
								<div className="your-answers">
									<strong>Your Answer:</strong>{" "}
									{result.userAnswers.join(", ") || "No answer"}
								</div>
								<div className="correct-answers">
									<strong>Correct:</strong> {result.correctAnswers.join(", ")}
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="results-actions">
					<button
						onClick={() => {
							setResults(null);
							setContestFinished(false);
						}}
						className="new-contest-btn"
					>
						🚀 Start New Contest
					</button>
				</div>
			</div>
		);
	}

	if (currentContest && !contestFinished) {
		const currentProblem = problems[currentProblemIndex];

		return (
			<div className="contest-active">
				<div className="contest-header">
					<div className="contest-info">
						<h2>{currentContest.name}</h2>
						<div className="contest-progress">
							Problem {currentProblemIndex + 1} of {problems.length}
						</div>
					</div>
					<div className="contest-timer">
						<div className={`timer ${timeRemaining < 300 ? "warning" : ""}`}>
							⏱️ {formatTime(timeRemaining)}
						</div>
					</div>
				</div>

				<div className="contest-navigation">
					{problems.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentProblemIndex(index)}
							className={`nav-problem ${index === currentProblemIndex ? "active" : ""} 
								${answers[index]?.length > 0 ? "answered" : ""}`}
						>
							{index + 1}
						</button>
					))}
				</div>

				{currentProblem && (
					<div className="problem-container">
						<div className="problem-header">
							<h3>
								#{currentProblem.id}. {currentProblem.title}
							</h3>
							<span
								className={`difficulty ${currentProblem.difficulty.toLowerCase()}`}
							>
								{currentProblem.difficulty}
							</span>
						</div>

						<div className="problem-description">
							<p>{currentProblem.description}</p>
						</div>

						<div className="algorithm-selection">
							<h4>Select the best algorithm(s) for this problem:</h4>
							<div className="algorithm-options">
								{currentProblem.algorithms.map((algorithm, index) => (
									<label key={index} className="algorithm-option">
										<input
											type="checkbox"
											checked={
												answers[currentProblemIndex]?.includes(algorithm) ||
												false
											}
											onChange={(e) => {
												const currentAnswers =
													answers[currentProblemIndex] || [];
												const newAnswers = e.target.checked
													? [...currentAnswers, algorithm]
													: currentAnswers.filter((a) => a !== algorithm);
												handleAnswerChange(currentProblemIndex, newAnswers);
											}}
										/>
										<span>{algorithm}</span>
									</label>
								))}
							</div>
						</div>

						<div className="problem-actions">
							<button
								onClick={() =>
									setCurrentProblemIndex(Math.max(0, currentProblemIndex - 1))
								}
								disabled={currentProblemIndex === 0}
								className="nav-btn"
							>
								← Previous
							</button>
							<button
								onClick={() =>
									setCurrentProblemIndex(
										Math.min(problems.length - 1, currentProblemIndex + 1),
									)
								}
								disabled={currentProblemIndex === problems.length - 1}
								className="nav-btn"
							>
								Next →
							</button>
							<button onClick={() => finishContest()} className="finish-btn">
								🏁 Finish Contest
							</button>
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="contest-mode">
			<div className="contest-header">
				<h2>🏆 Contest Mode</h2>
				<p>Test your skills in competitive programming challenges</p>
			</div>

			<div className="contest-setup">
				<div className="setup-section">
					<h3>Contest Type</h3>
					<div className="contest-type-grid">
						{Object.entries(contestTypes).map(([type, config]) => (
							<button
								key={type}
								onClick={() => setContestType(type)}
								className={`contest-type-btn ${contestType === type ? "active" : ""}`}
							>
								<div className="contest-type-info">
									<strong>{config.name}</strong>
									<div className="contest-details">
										<span>⏱️ {config.duration}min</span>
										<span>📝 {config.problems} problems</span>
									</div>
								</div>
							</button>
						))}
					</div>
				</div>

				<div className="setup-section">
					<h3>Difficulty</h3>
					<div className="difficulty-options">
						{["mixed", "Easy", "Medium", "Hard"].map((diff) => (
							<button
								key={diff}
								onClick={() => setDifficulty(diff)}
								className={`difficulty-btn ${difficulty === diff ? "active" : ""} ${diff.toLowerCase()}`}
							>
								{diff === "mixed" ? "Mixed" : diff}
							</button>
						))}
					</div>
				</div>

				<button onClick={startContest} className="start-contest-btn">
					🚀 Start Contest
				</button>
			</div>

			{contestHistory.length > 0 && (
				<div className="contest-history">
					<h3>📊 Contest History</h3>
					<div className="history-list">
						{contestHistory
							.slice(-5)
							.reverse()
							.map((contest, _index) => (
								<div key={contest.id} className="history-item">
									<div className="contest-info">
										<h4>{contest.name}</h4>
										<div className="contest-meta">
											<span>
												📅 {new Date(contest.startTime).toLocaleDateString()}
											</span>
											<span>⏱️ {formatTime(contest.actualDuration)}</span>
										</div>
									</div>
									<div className="contest-stats">
										<div className="stat">
											<span className="label">Score:</span>
											<span className="value">{contest.score}</span>
										</div>
										<div className="stat">
											<span className="label">Solved:</span>
											<span className="value">
												{contest.correctCount}/{contest.totalProblems}
											</span>
										</div>
										<div className="stat">
											<span className="label">Rank:</span>
											<span
												className="value"
												style={{ color: getRankColor(contest.rank) }}
											>
												{contest.rank}
											</span>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			)}

			{user.contestStats && (
				<div className="user-contest-stats">
					<h3>🎯 Your Contest Statistics</h3>
					<div className="stats-grid">
						<div className="stat-card">
							<div className="stat-icon">🏁</div>
							<div className="stat-info">
								<span className="stat-value">
									{user.contestStats.totalContests}
								</span>
								<span className="stat-label">Total Contests</span>
							</div>
						</div>
						<div className="stat-card">
							<div className="stat-icon">⭐</div>
							<div className="stat-info">
								<span className="stat-value">
									{user.contestStats.totalScore}
								</span>
								<span className="stat-label">Total Score</span>
							</div>
						</div>
						<div className="stat-card">
							<div className="stat-icon">🎖️</div>
							<div className="stat-info">
								<span
									className="stat-value"
									style={{ color: getRankColor(user.contestStats.bestRank) }}
								>
									{user.contestStats.bestRank}
								</span>
								<span className="stat-label">Best Rank</span>
							</div>
						</div>
						<div className="stat-card">
							<div className="stat-icon">🎯</div>
							<div className="stat-info">
								<span className="stat-value">
									{user.contestStats.averageAccuracy.toFixed(1)}%
								</span>
								<span className="stat-label">Average Accuracy</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ContestMode;
