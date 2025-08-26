import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { algorithmCategories, companyTags } from "../data/allProblems";

function StudyPlans({ user }) {
	const navigate = useNavigate();
	const [selectedPlan, setSelectedPlan] = useState(null);
	const [customPlan, setCustomPlan] = useState({
		name: "",
		duration: 30,
		difficulty: "Mixed",
		algorithms: [],
		company: "all",
		problemsPerDay: 2,
	});
	const [showCustomPlanModal, setShowCustomPlanModal] = useState(false);

	// Predefined study plans
	const studyPlans = {
		"faang-prep": {
			name: "FAANG Interview Prep",
			description: "Comprehensive preparation for top tech companies",
			duration: 60,
			difficulty: "Mixed",
			icon: "🏢",
			color: "#4CAF50",
			problemsPerDay: 3,
			totalProblems: 180,
			categories: [
				"Array",
				"Dynamic Programming",
				"Tree",
				"Graph",
				"System Design",
			],
			companies: ["Google", "Amazon", "Facebook", "Apple", "Netflix"],
			schedule: [
				{ week: "1-2", focus: "Arrays & Strings", problems: 42 },
				{ week: "3-4", focus: "Linked Lists & Trees", problems: 42 },
				{ week: "5-6", focus: "Dynamic Programming", problems: 42 },
				{ week: "7-8", focus: "Graphs & Advanced Topics", problems: 42 },
				{ week: "9+", focus: "Mock Interviews & Review", problems: 12 },
			],
		},
		"algorithm-mastery": {
			name: "Algorithm Mastery Path",
			description: "Master all fundamental algorithms step by step",
			duration: 90,
			difficulty: "Easy to Hard",
			icon: "🎯",
			color: "#2196F3",
			problemsPerDay: 2,
			totalProblems: 180,
			categories: [
				"Array",
				"Hash Table",
				"Two Pointers",
				"Sliding Window",
				"Binary Search",
			],
			companies: [],
			schedule: [
				{ week: "1-3", focus: "Basic Data Structures", problems: 36 },
				{ week: "4-6", focus: "Searching & Sorting", problems: 36 },
				{ week: "7-9", focus: "Tree & Graph Algorithms", problems: 36 },
				{ week: "10-12", focus: "Dynamic Programming", problems: 36 },
				{ week: "13+", focus: "Advanced Algorithms", problems: 36 },
			],
		},
		"speed-coding": {
			name: "Speed Coding Challenge",
			description: "Improve coding speed and pattern recognition",
			duration: 21,
			difficulty: "Easy to Medium",
			icon: "⚡",
			color: "#FF9800",
			problemsPerDay: 5,
			totalProblems: 105,
			categories: ["Array", "String", "Hash Table", "Two Pointers"],
			companies: [],
			schedule: [
				{ week: "1", focus: "Array Patterns", problems: 35 },
				{ week: "2", focus: "String Manipulation", problems: 35 },
				{ week: "3", focus: "Mixed Practice", problems: 35 },
			],
		},
		"data-structures": {
			name: "Data Structures Deep Dive",
			description: "Master all data structures with focused practice",
			duration: 45,
			difficulty: "Medium to Hard",
			icon: "🏗️",
			color: "#9C27B0",
			problemsPerDay: 2,
			totalProblems: 90,
			categories: [
				"Stack",
				"Queue",
				"Heap",
				"Trie",
				"Union Find",
				"Segment Tree",
			],
			companies: [],
			schedule: [
				{ week: "1-2", focus: "Stack & Queue", problems: 28 },
				{ week: "3-4", focus: "Heap & Priority Queue", problems: 28 },
				{ week: "5-6", focus: "Advanced Structures", problems: 34 },
			],
		},
		"beginner-friendly": {
			name: "Beginner to Intermediate",
			description: "Perfect starting point for coding interview prep",
			duration: 30,
			difficulty: "Easy to Medium",
			icon: "🌱",
			color: "#8BC34A",
			problemsPerDay: 1,
			totalProblems: 30,
			categories: ["Array", "String", "Math", "Simulation"],
			companies: [],
			schedule: [
				{ week: "1-2", focus: "Basic Problem Solving", problems: 14 },
				{ week: "3-4", focus: "Pattern Recognition", problems: 16 },
			],
		},
		"competitive-programming": {
			name: "Competitive Programming",
			description: "Advanced algorithms for competitive programming",
			duration: 120,
			difficulty: "Hard",
			icon: "🏆",
			color: "#F44336",
			problemsPerDay: 1,
			totalProblems: 120,
			categories: [
				"Graph",
				"Dynamic Programming",
				"Math",
				"Greedy",
				"Binary Search",
			],
			companies: [],
			schedule: [
				{ week: "1-4", focus: "Graph Algorithms", problems: 28 },
				{ week: "5-8", focus: "Advanced DP", problems: 28 },
				{ week: "9-12", focus: "Mathematical Algorithms", problems: 32 },
				{ week: "13+", focus: "Contest Practice", problems: 32 },
			],
		},
	};

	// Get user's current progress on study plans
	const getUserProgress = (planId) => {
		const users = JSON.parse(localStorage.getItem("users") || "[]");
		const currentUser = users.find((u) => u.id === user.id);

		if (!currentUser?.studyPlans)
			return { started: false, progress: 0, streak: 0 };

		const userPlan = currentUser.studyPlans[planId];
		if (!userPlan) return { started: false, progress: 0, streak: 0 };

		return userPlan;
	};

	// Start a study plan
	const startStudyPlan = (planId) => {
		const users = JSON.parse(localStorage.getItem("users") || "[]");
		const userIndex = users.findIndex((u) => u.id === user.id);

		if (userIndex !== -1) {
			if (!users[userIndex].studyPlans) users[userIndex].studyPlans = {};

			users[userIndex].studyPlans[planId] = {
				started: true,
				startDate: new Date().toISOString(),
				progress: 0,
				streak: 0,
				completedDays: [],
				totalProblems: studyPlans[planId].totalProblems,
			};

			localStorage.setItem("users", JSON.stringify(users));
		}

		// Navigate to first quiz for this plan
		navigate("/quiz", {
			state: {
				mode: "study-plan",
				planId,
				plan: studyPlans[planId],
			},
		});
	};

	// Create custom study plan
	const createCustomStudyPlan = () => {
		if (!customPlan.name) return;

		const customPlanId = `custom-${Date.now()}`;
		const totalProblems = customPlan.duration * customPlan.problemsPerDay;

		const newPlan = {
			name: customPlan.name,
			description: "Custom study plan",
			duration: customPlan.duration,
			difficulty: customPlan.difficulty,
			icon: "📋",
			color: "#607D8B",
			problemsPerDay: customPlan.problemsPerDay,
			totalProblems,
			categories: customPlan.algorithms,
			companies: customPlan.company !== "all" ? [customPlan.company] : [],
			schedule: [
				{
					week: `1-${Math.ceil(customPlan.duration / 7)}`,
					focus: "Custom Practice",
					problems: totalProblems,
				},
			],
			isCustom: true,
		};

		// Save to user's custom plans
		const users = JSON.parse(localStorage.getItem("users") || "[]");
		const userIndex = users.findIndex((u) => u.id === user.id);

		if (userIndex !== -1) {
			if (!users[userIndex].customStudyPlans)
				users[userIndex].customStudyPlans = {};
			users[userIndex].customStudyPlans[customPlanId] = newPlan;
			localStorage.setItem("users", JSON.stringify(users));
		}

		setShowCustomPlanModal(false);
		setCustomPlan({
			name: "",
			duration: 30,
			difficulty: "Mixed",
			algorithms: [],
			company: "all",
			problemsPerDay: 2,
		});
	};

	// Get user's custom study plans
	const getCustomStudyPlans = () => {
		const users = JSON.parse(localStorage.getItem("users") || "[]");
		const currentUser = users.find((u) => u.id === user.id);
		return currentUser?.customStudyPlans || {};
	};

	const customStudyPlans = getCustomStudyPlans();

	const PlanCard = ({ planId, plan, isCustom = false }) => {
		const progress = getUserProgress(planId);
		const progressPercentage =
			plan.totalProblems > 0
				? Math.round((progress.progress / plan.totalProblems) * 100)
				: 0;

		return (
			<div className="study-plan-card">
				<div className="plan-header">
					<div className="plan-icon" style={{ backgroundColor: plan.color }}>
						{plan.icon}
					</div>
					<div className="plan-info">
						<h3>{plan.name}</h3>
						<p>{plan.description}</p>
						{isCustom && <span className="custom-badge">Custom</span>}
					</div>
				</div>

				<div className="plan-stats">
					<div className="stat-item">
						<span className="stat-value">{plan.duration}</span>
						<span className="stat-label">Days</span>
					</div>
					<div className="stat-item">
						<span className="stat-value">{plan.totalProblems}</span>
						<span className="stat-label">Problems</span>
					</div>
					<div className="stat-item">
						<span className="stat-value">{plan.problemsPerDay}</span>
						<span className="stat-label">Per Day</span>
					</div>
					<div className="stat-item">
						<span className="stat-value">{plan.difficulty}</span>
						<span className="stat-label">Difficulty</span>
					</div>
				</div>

				{progress.started && (
					<div className="plan-progress">
						<div className="progress-header">
							<span>Progress: {progressPercentage}%</span>
							<span>Streak: {progress.streak} days</span>
						</div>
						<div className="progress-bar">
							<div
								className="progress-fill"
								style={{
									width: `${progressPercentage}%`,
									backgroundColor: plan.color,
								}}
							/>
						</div>
					</div>
				)}

				<div className="plan-categories">
					<h4>Focus Areas</h4>
					<div className="categories-list">
						{plan.categories.slice(0, 4).map((category) => (
							<span key={category} className="category-tag">
								{category}
							</span>
						))}
						{plan.categories.length > 4 && (
							<span className="more-categories">
								+{plan.categories.length - 4} more
							</span>
						)}
					</div>
				</div>

				{selectedPlan === planId && (
					<div className="plan-details">
						<h4>Study Schedule</h4>
						<div className="schedule-list">
							{plan.schedule.map((phase, index) => (
								<div key={index} className="schedule-item">
									<div className="schedule-week">{phase.week}</div>
									<div className="schedule-focus">{phase.focus}</div>
									<div className="schedule-problems">
										{phase.problems} problems
									</div>
								</div>
							))}
						</div>

						{plan.companies && plan.companies.length > 0 && (
							<div className="plan-companies">
								<h4>Target Companies</h4>
								<div className="companies-list">
									{plan.companies.map((company) => (
										<span key={company} className="company-tag">
											{company}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				<div className="plan-actions">
					<button
						className="plan-btn details-btn"
						onClick={() =>
							setSelectedPlan(selectedPlan === planId ? null : planId)
						}
					>
						{selectedPlan === planId ? "Hide Details" : "View Details"}
					</button>

					{progress.started ? (
						<button
							className="plan-btn continue-btn"
							onClick={() => startStudyPlan(planId)}
							style={{ backgroundColor: plan.color }}
						>
							Continue Plan
						</button>
					) : (
						<button
							className="plan-btn start-btn"
							onClick={() => startStudyPlan(planId)}
							style={{ backgroundColor: plan.color }}
						>
							Start Plan
						</button>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="study-plans">
			{/* Header */}
			<div className="plans-header">
				<h1>📚 Study Plans</h1>
				<p>Structured learning paths to master coding interviews</p>

				<div className="header-actions">
					<button
						className="create-plan-btn"
						onClick={() => setShowCustomPlanModal(true)}
					>
						+ Create Custom Plan
					</button>
				</div>
			</div>

			{/* User's Active Plans */}
			{Object.entries(studyPlans).some(
				([planId]) => getUserProgress(planId).started,
			) && (
				<div className="active-plans-section">
					<h2>🎯 Active Plans</h2>
					<div className="plans-grid">
						{Object.entries(studyPlans)
							.filter(([planId]) => getUserProgress(planId).started)
							.map(([planId, plan]) => (
								<PlanCard key={planId} planId={planId} plan={plan} />
							))}

						{Object.entries(customStudyPlans)
							.filter(([planId]) => getUserProgress(planId).started)
							.map(([planId, plan]) => (
								<PlanCard
									key={planId}
									planId={planId}
									plan={plan}
									isCustom={true}
								/>
							))}
					</div>
				</div>
			)}

			{/* All Study Plans */}
			<div className="all-plans-section">
				<h2>🗂️ Available Study Plans</h2>
				<div className="plans-grid">
					{Object.entries(studyPlans).map(([planId, plan]) => (
						<PlanCard key={planId} planId={planId} plan={plan} />
					))}
				</div>
			</div>

			{/* Custom Study Plans */}
			{Object.keys(customStudyPlans).length > 0 && (
				<div className="custom-plans-section">
					<h2>📋 Your Custom Plans</h2>
					<div className="plans-grid">
						{Object.entries(customStudyPlans).map(([planId, plan]) => (
							<PlanCard
								key={planId}
								planId={planId}
								plan={plan}
								isCustom={true}
							/>
						))}
					</div>
				</div>
			)}

			{/* Custom Plan Modal */}
			{showCustomPlanModal && (
				<div className="modal-overlay">
					<div className="custom-plan-modal">
						<div className="modal-header">
							<h3>Create Custom Study Plan</h3>
							<button
								className="close-btn"
								onClick={() => setShowCustomPlanModal(false)}
							>
								×
							</button>
						</div>

						<div className="modal-content">
							<div className="form-group">
								<label>Plan Name</label>
								<input
									type="text"
									value={customPlan.name}
									onChange={(e) =>
										setCustomPlan((prev) => ({ ...prev, name: e.target.value }))
									}
									placeholder="My Custom Study Plan"
								/>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label>Duration (days)</label>
									<input
										type="number"
										value={customPlan.duration}
										onChange={(e) =>
											setCustomPlan((prev) => ({
												...prev,
												duration: parseInt(e.target.value, 10),
											}))
										}
										min="1"
										max="365"
									/>
								</div>

								<div className="form-group">
									<label>Problems per day</label>
									<input
										type="number"
										value={customPlan.problemsPerDay}
										onChange={(e) =>
											setCustomPlan((prev) => ({
												...prev,
												problemsPerDay: parseInt(e.target.value, 10),
											}))
										}
										min="1"
										max="10"
									/>
								</div>
							</div>

							<div className="form-group">
								<label>Difficulty</label>
								<select
									value={customPlan.difficulty}
									onChange={(e) =>
										setCustomPlan((prev) => ({
											...prev,
											difficulty: e.target.value,
										}))
									}
								>
									<option value="Mixed">Mixed</option>
									<option value="Easy">Easy</option>
									<option value="Medium">Medium</option>
									<option value="Hard">Hard</option>
								</select>
							</div>

							<div className="form-group">
								<label>Focus Algorithms</label>
								<select
									multiple
									value={customPlan.algorithms}
									onChange={(e) => {
										const selected = Array.from(
											e.target.selectedOptions,
											(option) => option.value,
										);
										setCustomPlan((prev) => ({
											...prev,
											algorithms: selected,
										}));
									}}
									className="algorithms-select"
								>
									{Object.keys(algorithmCategories).map((category) => (
										<optgroup key={category} label={category}>
											{algorithmCategories[category].map((algo) => (
												<option key={algo} value={algo}>
													{algo}
												</option>
											))}
										</optgroup>
									))}
								</select>
							</div>

							<div className="form-group">
								<label>Target Company (optional)</label>
								<select
									value={customPlan.company}
									onChange={(e) =>
										setCustomPlan((prev) => ({
											...prev,
											company: e.target.value,
										}))
									}
								>
									<option value="all">All Companies</option>
									{Object.keys(companyTags).map((company) => (
										<option key={company} value={company}>
											{company}
										</option>
									))}
								</select>
							</div>

							<div className="plan-summary">
								<h4>Plan Summary</h4>
								<div className="summary-stats">
									<span>
										Total Problems:{" "}
										{customPlan.duration * customPlan.problemsPerDay}
									</span>
									<span>
										Daily Commitment: ~{customPlan.problemsPerDay * 20} minutes
									</span>
								</div>
							</div>
						</div>

						<div className="modal-actions">
							<button
								className="cancel-btn"
								onClick={() => setShowCustomPlanModal(false)}
							>
								Cancel
							</button>
							<button
								className="create-btn"
								onClick={createCustomStudyPlan}
								disabled={!customPlan.name}
							>
								Create Plan
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Study Tips */}
			<div className="study-tips">
				<h2>💡 Study Plan Tips</h2>
				<div className="tips-grid">
					<div className="tip-card">
						<div className="tip-icon">🎯</div>
						<h3>Consistency is Key</h3>
						<p>
							Better to solve 1-2 problems daily than 20 problems once a week.
							Build a habit.
						</p>
					</div>

					<div className="tip-card">
						<div className="tip-icon">📝</div>
						<h3>Track Your Progress</h3>
						<p>
							Review your solutions, note patterns, and track weak areas for
							focused improvement.
						</p>
					</div>

					<div className="tip-card">
						<div className="tip-icon">🤝</div>
						<h3>Join Communities</h3>
						<p>
							Discuss solutions, learn different approaches, and stay motivated
							with peers.
						</p>
					</div>

					<div className="tip-card">
						<div className="tip-icon">⏰</div>
						<h3>Time Management</h3>
						<p>
							Practice with time constraints. Most interviews allow 20-30
							minutes per problem.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StudyPlans;
