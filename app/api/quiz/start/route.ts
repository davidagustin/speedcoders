import { NextResponse } from "next/server";
import { comprehensiveProblems } from "@/lib/data/comprehensive-problems";

export async function POST(request: Request) {
	try {
		const {
			userId = "demo-user",
			problemCount = 10,
			difficulty = "Mixed",
			category = null,
			specificProblem = null,
			specificProblems = null,
		} = await request.json();

		// Type the selectedProblems array properly
		let selectedProblems: typeof comprehensiveProblems = [];

		if (specificProblems && Array.isArray(specificProblems)) {
			// Use specific problems if provided
			selectedProblems = comprehensiveProblems.filter((p) =>
				specificProblems.includes(p.title),
			);
		} else if (specificProblem) {
			// Use single specific problem if provided
			const problem = comprehensiveProblems.find(
				(p) => p.title === specificProblem,
			);
			if (problem) {
				selectedProblems = [problem];
			}
		} else {
			// Filter problems based on criteria
			let filteredProblems = comprehensiveProblems;

			if (difficulty !== "Mixed") {
				filteredProblems = filteredProblems.filter(
					(p) => p.difficulty === difficulty,
				);
			}

			if (category) {
				filteredProblems = filteredProblems.filter((p) =>
					p.algorithms.includes(category),
				);
			}

			// Shuffle and select problems
			const shuffled = filteredProblems.sort(() => Math.random() - 0.5);
			selectedProblems = shuffled.slice(
				0,
				Math.min(problemCount, shuffled.length),
			);
		}

		if (selectedProblems.length === 0) {
			return NextResponse.json(
				{ error: "No problems found matching criteria" },
				{ status: 400 },
			);
		}

		// Create mock quiz object
		const quiz = {
			id: `quiz_${Date.now()}`,
			title: `Quiz - ${selectedProblems.length} problems`,
			description: `Quiz with ${selectedProblems.length} problems`,
			difficulty: difficulty,
			category: category,
			timeLimit: selectedProblems.length * 5, // 5 minutes per problem
			problemCount: selectedProblems.length,
			problems: selectedProblems.map((p, i) => ({
				id: i + 1,
				title: p.title,
				difficulty: p.difficulty,
				category: p.category,
				algorithms: p.algorithms,
				description: p.description,
				editorial: p.editorial,
				leetcodeUrl: p.leetcodeUrl,
			})),
		};

		// Create mock attempt
		const attempt = {
			id: `attempt_${Date.now()}`,
			userId: userId,
			quizId: quiz.id,
			score: 0,
			timeSpent: 0,
			completed: false,
			startedAt: new Date().toISOString(),
			completedAt: null,
		};

		return NextResponse.json({
			success: true,
			attempt,
			quiz,
		});
	} catch (error) {
		console.error("Error creating quiz:", error);
		return NextResponse.json(
			{ error: "Failed to create quiz" },
			{ status: 500 },
		);
	}
}