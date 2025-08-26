import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { allLeetcodeProblems, companyTags } from "../data/allProblems";

function Quiz({ user, onComplete }) {
	const navigate = useNavigate();
	const location = useLocation();
	const quizOptions = location.state || {};

	const [questions, setQuestions] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState({});
	const [timeLeft, setTimeLeft] = useState(600);
	const [quizStarted, setQuizStarted] = useState(false);
	const [quizConfig, setQuizConfig] = useState({
		mode: "smart",
		difficulty: "Mixed",
		timeLimit: 600,
		questionCount: 10,
		algorithms: [],
		company: null,
	});

	useEffect(() => {
		generateQuiz();
	}, [generateQuiz]);

	useEffect(() => {
		if (!quizStarted || timeLeft <= 0) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					handleSubmit();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [quizStarted, timeLeft, handleSubmit]);

	const generateQuiz = () => {
		let selectedProblems = [...allLeetcodeProblems];
		let config = {
			mode: quizOptions.mode || "smart",
			difficulty: quizOptions.difficulty || "Mixed",
			timeLimit: quizOptions.timeLimit || 600,
			questionCount: quizOptions.questionCount || 10,
			algorithms: quizOptions.algorithms || [],
			company: quizOptions.company || null,
		};

		// Handle custom quiz mode
		if (config.mode === "custom" && quizOptions.customProblems) {
			const finalQuestions = quizOptions.customProblems.map((q) => ({
				...q,
				selectedAlgorithms: [],
			}));

			setQuestions(finalQuestions);
			setQuizConfig(config);
			setTimeLeft(config.timeLimit);

			const initialAnswers = {};
			finalQuestions.forEach((q) => {
				initialAnswers[q.id] = [];
			});
			setAnswers(initialAnswers);
			return;
		}

		// Apply filters based on quiz mode
		switch (config.mode) {
			case "company":
				if (config.company && companyTags[config.company]) {
					selectedProblems = selectedProblems.filter((p) =>
						companyTags[config.company].includes(p.id),
					);
					config.questionCount = Math.min(15, selectedProblems.length);
					config.timeLimit = 900;
				}
				break;

			case "algorithm":
				if (config.algorithms.length > 0) {
					selectedProblems = selectedProblems.filter((p) =>
						p.correctAlgorithms.some((algo) =>
							config.algorithms.includes(algo),
						),
					);
					config.questionCount = Math.min(12, selectedProblems.length);
				}
				break;

			case "difficulty":
				if (config.difficulty !== "Mixed") {
					selectedProblems = selectedProblems.filter(
						(p) => p.difficulty === config.difficulty,
					);
				}
				break;

			case "smart":
				// AI-powered selection based on user's weak areas
				selectedProblems = generateSmartQuiz(user);
				config.questionCount = 15;
				config.timeLimit = 1200;
				break;

			case "speed":
				config.timeLimit = 300; // 5 minutes
				config.questionCount = 8;
				selectedProblems = selectedProblems.filter(
					(p) => p.difficulty === "Easy",
				);
				break;

			case "challenge":
				if (quizOptions.challenge) {
					config = adaptForChallenge(quizOptions.challenge, config);
				}
				break;

			default:
				// Standard mixed quiz
				break;
		}

		// Apply difficulty filter if specified
		if (config.difficulty !== "Mixed" && config.mode !== "difficulty") {
			selectedProblems = selectedProblems.filter(
				(p) => p.difficulty === config.difficulty,
			);
		}

		// Shuffle and select questions
		const finalQuestions = selectedProblems
			.sort(() => 0.5 - Math.random())
			.slice(0, config.questionCount)
			.map((q) => ({
				...q,
				selectedAlgorithms: [],
			}));

		setQuestions(finalQuestions);
		setQuizConfig(config);
		setTimeLeft(config.timeLimit);

		// Initialize answers
		const initialAnswers = {};
		finalQuestions.forEach((q) => {
			initialAnswers[q.id] = [];
		});
		setAnswers(initialAnswers);
	};

	const generateSmartQuiz = (user) => {
		// Get user's performance history
		const users = JSON.parse(localStorage.getItem("users") || "[]");
		const currentUser = users.find((u) => u.id === user.id);

		if (!currentUser?.scores || currentUser.scores.length === 0) {
			// New user - return balanced mix
			return getBalancedMix();
		}

		// Analyze weak algorithms
		const algorithmPerformance = {};
		currentUser.scores.forEach((score) => {
			if (score.details) {
				score.details.forEach((detail) => {
					detail.correctAnswer.forEach((algo) => {
						if (!algorithmPerformance[algo]) {
							algorithmPerformance[algo] = { correct: 0, total: 0 };
						}
						algorithmPerformance[algo].total++;
						if (detail.isCorrect) {
							algorithmPerformance[algo].correct++;
						}
					});
				});
			}
		});

		// Find algorithms with <70% accuracy
		const weakAlgorithms = Object.entries(algorithmPerformance)
			.filter(([_, stats]) => stats.correct / stats.total < 0.7)
			.map(([algo]) => algo);

		if (weakAlgorithms.length === 0) {
			return getBalancedMix();
		}

		// Select problems focusing on weak algorithms
		return allLeetcodeProblems.filter((p) =>
			p.correctAlgorithms.some((algo) => weakAlgorithms.includes(algo)),
		);
	};

	const getBalancedMix = () => {
		const easy = allLeetcodeProblems
			.filter((p) => p.difficulty === "Easy")
			.slice(0, 1000);
		const medium = allLeetcodeProblems
			.filter((p) => p.difficulty === "Medium")
			.slice(0, 1000);
		const hard = allLeetcodeProblems
			.filter((p) => p.difficulty === "Hard")
			.slice(0, 500);
		return [...easy, ...medium, ...hard];
	};

	const adaptForChallenge = (challenge, config) => {
		switch (challenge.type) {
			case "speed":
				config.timeLimit = 600; // 10 minutes
				config.difficulty = "Medium";
				config.questionCount = 8;
				break;
			case "accuracy":
				config.questionCount = 5;
				config.timeLimit = 900;
				break;
			case "variety":
				config.questionCount = 12;
				config.timeLimit = 1200;
				break;
		}
		return config;
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const handleAlgorithmToggle = (questionId, algorithm) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: prev[questionId].includes(algorithm)
				? prev[questionId].filter((a) => a !== algorithm)
				: [...prev[questionId], algorithm],
		}));
	};

	const handleSubmit = () => {
		let correct = 0;
		const detailedResults = questions.map((q) => {
			const userAnswer = answers[q.id] || [];
			const isCorrect =
				userAnswer.length === q.correctAlgorithms.length &&
				userAnswer.every((a) => q.correctAlgorithms.includes(a));

			if (isCorrect) correct++;

			return {
				question: q.title,
				questionId: q.id,
				difficulty: q.difficulty,
				userAnswer,
				correctAnswer: q.correctAlgorithms,
				allAlgorithms: q.algorithms,
				isCorrect,
				url: q.url,
			};
		});

		const percentage = Math.round((correct / questions.length) * 100);
		const timeSpent = quizConfig.timeLimit - timeLeft;

		// Calculate XP earned
		let xpEarned = percentage * 10; // Base XP
		if (quizConfig.difficulty === "Hard") xpEarned *= 2;
		else if (quizConfig.difficulty === "Medium") xpEarned *= 1.5;

		// Bonus XP for challenges
		if (quizOptions.challenge) {
			if (quizOptions.challenge.type === "speed" && timeSpent < 600) {
				xpEarned += 200;
			}
			if (quizOptions.challenge.type === "accuracy" && percentage === 100) {
				xpEarned += 300;
			}
		}

		const result = {
			date: new Date().toISOString(),
			mode: quizConfig.mode,
			difficulty: quizConfig.difficulty,
			correct,
			totalQuestions: questions.length,
			percentage,
			timeSpent,
			timeLimit: quizConfig.timeLimit,
			xpEarned: Math.round(xpEarned),
			details: detailedResults,
			challenge: quizOptions.challenge || null,
		};

		// Update user XP and stats
		const users = JSON.parse(localStorage.getItem("users") || "[]");
		const userIndex = users.findIndex((u) => u.id === user.id);
		if (userIndex !== -1) {
			if (!users[userIndex].scores) users[userIndex].scores = [];
			if (!users[userIndex].totalXP) users[userIndex].totalXP = 0;

			users[userIndex].scores.push(result);
			users[userIndex].totalXP += result.xpEarned;
			localStorage.setItem("users", JSON.stringify(users));
		}

		onComplete(result);
		navigate("/results");
	};

	const handleNext = () => {
		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1);
		}
	};

	const handlePrevious = () => {
		if (currentQuestion > 0) {
			setCurrentQuestion(currentQuestion - 1);
		}
	};

	const getTimeColor = () => {
		const percentage = (timeLeft / quizConfig.timeLimit) * 100;
		if (percentage > 50) return "#4CAF50";
		if (percentage > 25) return "#FF9800";
		return "#F44336";
	};

	if (!quizStarted) {
		return (
			<div className="quiz-setup">
				<div className="setup-container">
					<h1>🎯 Quiz Setup</h1>

					<div className="quiz-info">
						<div className="info-card">
							<h3>📊 Quiz Details</h3>
							<div className="quiz-stats">
								<div className="stat">
									<span className="label">Mode:</span>
									<span className="value">
										{quizConfig.mode.charAt(0).toUpperCase() +
											quizConfig.mode.slice(1)}
									</span>
								</div>
								<div className="stat">
									<span className="label">Questions:</span>
									<span className="value">{questions.length}</span>
								</div>
								<div className="stat">
									<span className="label">Time Limit:</span>
									<span className="value">
										{formatTime(quizConfig.timeLimit)}
									</span>
								</div>
								<div className="stat">
									<span className="label">Difficulty:</span>
									<span className="value">{quizConfig.difficulty}</span>
								</div>
							</div>
						</div>

						{quizOptions.challenge && (
							<div className="challenge-info">
								<h3>🎯 Daily Challenge</h3>
								<div className="challenge-details">
									<span className="challenge-icon">
										{quizOptions.challenge.icon}
									</span>
									<div>
										<h4>{quizOptions.challenge.title}</h4>
										<p>{quizOptions.challenge.description}</p>
										<span className="challenge-reward">
											Reward: {quizOptions.challenge.reward}
										</span>
									</div>
								</div>
							</div>
						)}

						<div className="instructions">
							<h3>📝 Instructions</h3>
							<ul>
								<li>Select ALL algorithms that can solve each problem</li>
								<li>Multiple selections are usually required</li>
								<li>Navigate between questions using Previous/Next</li>
								<li>Submit when ready or timer expires</li>
								<li>Earn XP based on accuracy and difficulty</li>
							</ul>
						</div>
					</div>

					<div className="setup-actions">
						<button className="start-btn" onClick={() => setQuizStarted(true)}>
							🚀 Start Quiz
						</button>
						<button className="back-btn" onClick={() => navigate("/dashboard")}>
							← Back to Dashboard
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (questions.length === 0)
		return <div className="loading">Loading quiz...</div>;

	const question = questions[currentQuestion];
	const progress = ((currentQuestion + 1) / questions.length) * 100;

	return (
		<div className="enhanced-quiz">
			{/* Quiz Header */}
			<div className="quiz-header">
				<div className="quiz-progress">
					<div className="progress-info">
						<span>
							Question {currentQuestion + 1} of {questions.length}
						</span>
						<span
							className={`difficulty-badge ${question.difficulty.toLowerCase()}`}
						>
							{question.difficulty}
						</span>
					</div>
					<div className="progress-bar">
						<div className="progress-fill" style={{ width: `${progress}%` }} />
					</div>
				</div>

				<div className="quiz-timer" style={{ color: getTimeColor() }}>
					<span className="timer-icon">⏱️</span>
					<span className="timer-text">{formatTime(timeLeft)}</span>
					<div className="timer-bar">
						<div
							className="timer-fill"
							style={{
								width: `${(timeLeft / quizConfig.timeLimit) * 100}%`,
								backgroundColor: getTimeColor(),
							}}
						/>
					</div>
				</div>
			</div>

			{/* Question Content */}
			<div className="question-content">
				<div className="problem-card">
					<div className="problem-header">
						<h2>
							#{question.id}. {question.title}
						</h2>
						<a
							href={question.url}
							target="_blank"
							rel="noopener noreferrer"
							className="leetcode-link"
						>
							View on LeetCode →
						</a>
					</div>
					<p className="problem-description">{question.description}</p>
				</div>

				<div className="algorithm-selection">
					<h3>Select ALL applicable algorithms/techniques:</h3>
					<div className="algorithm-grid">
						{question.algorithms.map((algorithm) => (
							<label
								key={algorithm}
								className={`algorithm-option ${
									answers[question.id]?.includes(algorithm) ? "selected" : ""
								}`}
							>
								<input
									type="checkbox"
									checked={answers[question.id]?.includes(algorithm) || false}
									onChange={() => handleAlgorithmToggle(question.id, algorithm)}
								/>
								<span className="algorithm-text">{algorithm}</span>
							</label>
						))}
					</div>
				</div>
			</div>

			{/* Navigation */}
			<div className="quiz-navigation">
				<button
					onClick={handlePrevious}
					disabled={currentQuestion === 0}
					className="nav-btn prev-btn"
				>
					← Previous
				</button>

				<div className="question-indicators">
					{questions.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentQuestion(index)}
							className={`question-indicator ${
								index === currentQuestion ? "current" : ""
							} ${answers[questions[index].id]?.length > 0 ? "answered" : ""}`}
						>
							{index + 1}
						</button>
					))}
				</div>

				{currentQuestion === questions.length - 1 ? (
					<button className="nav-btn submit-btn" onClick={handleSubmit}>
						Submit Quiz 📤
					</button>
				) : (
					<button onClick={handleNext} className="nav-btn next-btn">
						Next →
					</button>
				)}
			</div>

			{/* Quiz Stats */}
			<div className="quiz-stats-sidebar">
				<h4>📊 Progress</h4>
				<div className="stat">
					<span>Answered:</span>
					<span>
						{Object.values(answers).filter((ans) => ans.length > 0).length}/
						{questions.length}
					</span>
				</div>
				<div className="stat">
					<span>Mode:</span>
					<span>{quizConfig.mode}</span>
				</div>
				<div className="stat">
					<span>Time Used:</span>
					<span>{formatTime(quizConfig.timeLimit - timeLeft)}</span>
				</div>
			</div>
		</div>
	);
}

export default Quiz;
