import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { comprehensiveProblems } from "@/lib/data/comprehensive-problems";

interface QuizConfig {
	userId: string;
	problemCount?: number;
	difficulty?: string;
	category?: string;
	includeSolutions?: boolean;
	includeHints?: boolean;
	timeLimit?: number;
}

export async function POST(request: Request) {
	try {
		const config: QuizConfig = await request.json();
		const {
			userId,
			problemCount = 10,
			difficulty = "Mixed",
			category = null,
			includeSolutions = false,
			includeHints = false,
			timeLimit = 30,
		} = config;

		if (!userId) {
			return NextResponse.json({ error: "User ID required" }, { status: 400 });
		}

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
		const selectedProblems = shuffled.slice(
			0,
			Math.min(problemCount, shuffled.length),
		);

		if (selectedProblems.length === 0) {
			return NextResponse.json(
				{ error: "No problems found matching criteria" },
				{ status: 400 },
			);
		}

		// Transform problems for quiz format
		const quizProblems = selectedProblems.map((p) => ({
			id: p.id,
			title: p.title,
			difficulty: p.difficulty,
			category: p.algorithms[0] || "General",
			description: p.description,
			examples: (p as any).examples || [],
			constraints: (p as any).constraints || [],
			solutions: includeSolutions ? p.editorial?.solutions || [] : [],
			hints: includeHints ? [] : [], // No hints available in current structure
			keyInsights: p.algorithms, // Use algorithms as key insights
			editorial: p.editorial,
			leetcodeUrl: p.leetcodeUrl,
		}));

		// Create quiz in database
		const quiz = await prisma.quiz.create({
			data: {
				title: `Enhanced Quiz - ${selectedProblems.length} problems`,
				description: `Quiz with ${selectedProblems.length} problems`,
				difficulty: difficulty,
				category: category,
				timeLimit: timeLimit * 60, // Convert to seconds
				createdBy: userId,
				isActive: true,
			},
		});

		// Create quiz questions
		for (let i = 0; i < selectedProblems.length; i++) {
			await prisma.quizQuestion.create({
				data: {
					quizId: quiz.id,
					problemId: selectedProblems[i].id,
					order: i + 1,
				},
			});
		}

		// Create quiz attempt
		const attempt = await prisma.quizAttempt.create({
			data: {
				userId: userId,
				quizId: quiz.id,
				score: 0,
				timeSpent: 0,
				completed: false,
				startedAt: new Date(),
				completedAt: null,
			},
		});

		return NextResponse.json({
			success: true,
			attempt: {
				id: attempt.id,
				quiz: {
					id: quiz.id,
					title: quiz.title,
					problemCount: selectedProblems.length,
				},
				problems: quizProblems,
			},
		});
	} catch (error) {
		console.error("Error creating enhanced quiz:", error);
		return NextResponse.json(
			{ error: "Failed to create quiz" },
			{ status: 500 },
		);
	}
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const _difficulty = searchParams.get("difficulty");
		const _category = searchParams.get("category");

		// Get available quiz configurations
		const configurations = [
			{
				name: "Quick Practice",
				difficulty: "Easy" as const,
				problemCount: 5,
				timeLimit: 15,
				description: "5 easy problems, 15 minutes",
			},
			{
				name: "Study Session",
				difficulty: "Mixed" as const,
				problemCount: 10,
				timeLimit: 25,
				description: "10 mixed problems, 25 minutes",
			},
			{
				name: "Challenge Mode",
				difficulty: "Hard" as const,
				problemCount: 8,
				timeLimit: 40,
				description: "8 hard problems, 40 minutes",
			},
			{
				name: "Category Focus",
				difficulty: "Mixed" as const,
				problemCount: 12,
				timeLimit: 30,
				description: "12 problems from specific category",
			},
		];

		// Get available difficulties and categories
		const difficulties = ["Easy", "Medium", "Hard", "Mixed"];
		const categories = [
			...new Set(comprehensiveProblems.map((p) => p.category)),
		].sort();

		// Get problem counts
		const problemCounts = {
			total: comprehensiveProblems.length,
			easy: comprehensiveProblems.filter((p) => p.difficulty === "Easy").length,
			medium: comprehensiveProblems.filter((p) => p.difficulty === "Medium")
				.length,
			hard: comprehensiveProblems.filter((p) => p.difficulty === "Hard").length,
			byCategory: categories.reduce(
				(acc, cat) => {
					acc[cat] = comprehensiveProblems.filter(
						(p) => p.category === cat,
					).length;
					return acc;
				},
				{} as Record<string, number>,
			),
		};

		return NextResponse.json({
			success: true,
			data: {
				configurations,
				difficulties,
				categories,
				problemCounts,
			},
		});
	} catch (error) {
		console.error("Error fetching quiz configurations:", error);
		return NextResponse.json(
			{ error: "Failed to fetch quiz configurations" },
			{ status: 500 },
		);
	}
}
