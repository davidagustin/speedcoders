import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/lib/auth/next-auth";
import { comprehensiveProblems } from "@/lib/data/comprehensive-problems";

interface RouteParams {
	params: Promise<{
		id: string;
	}>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
	const { id } = await params;
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { selectedAlgorithms, timeSpent } = await request.json();

		if (!selectedAlgorithms || typeof timeSpent !== "number") {
			return NextResponse.json(
				{ error: "Invalid submission data" },
				{ status: 400 },
			);
		}

		const quiz = await prisma.quiz.findUnique({
			where: {
				id: id,
			},
		});

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		if (quiz.createdBy !== (session.user?.email || "anonymous")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		if (!quiz.isActive) {
			return NextResponse.json(
				{ error: "Quiz is not active" },
				{ status: 400 },
			);
		}

		// Get quiz questions with problems from database
		const quizQuestions = await prisma.quizQuestion.findMany({
			where: { quizId: id },
			include: { problem: true },
			orderBy: { order: "asc" },
		});

		// Map database problems to comprehensive problems for algorithm data
		const problems = quizQuestions
			.map((qq) => {
				const dbProblem = qq.problem;
				const compProblem = comprehensiveProblems.find(
					(p) => p.title === dbProblem.title,
				);
				return compProblem ? { ...compProblem, dbId: dbProblem.id } : null;
			})
			.filter(Boolean);

		let correctAnswers = 0;
		const problemResults = [];

		for (let i = 0; i < problems.length; i++) {
			const problem = problems[i];
			if (!problem) continue;

			const userAlgorithms = selectedAlgorithms[problem.id] || [];
			// Get algorithms directly from problem data
			const correctAlgorithms = problem.algorithms || [];

			// Simple scoring: if at least 70% of selected algorithms are correct
			const correctSelections = userAlgorithms.filter((algo: string) =>
				correctAlgorithms.includes(algo),
			).length;

			const totalUserSelections = userAlgorithms.length;
			const accuracy =
				totalUserSelections > 0 ? correctSelections / totalUserSelections : 0;
			const isCorrect = accuracy >= 0.7 && correctSelections > 0;

			if (isCorrect) {
				correctAnswers++;
			}

			problemResults.push({
				problemId: problem.id,
				selectedAlgorithms: userAlgorithms,
				correctAlgorithms: correctAlgorithms,
				isCorrect,
				accuracy,
				timeSpent: Math.floor(timeSpent / problems.length),
			});
		}

		const scorePercentage = Math.round(
			(correctAnswers / problems.length) * 100,
		);
		const overallAccuracy =
			(problemResults.reduce((sum, result) => sum + result.accuracy, 0) /
				problemResults.length) *
			100;

		// Update quiz status to inactive
		const updatedQuiz = await prisma.quiz.update({
			where: {
				id: id,
			},
			data: {
				isActive: false,
			},
		});

		// Create quiz attempt record
		const attempt = await prisma.quizAttempt.create({
			data: {
				quizId: id,
				userId: session.user.email,
				score: scorePercentage,
				timeSpent,
				completed: true,
				completedAt: new Date(),
			},
		});

		return NextResponse.json({
			quiz: updatedQuiz,
			result: {
				id: attempt.id,
				scorePercentage,
				correctAnswers,
				totalQuestions: problems.length,
				timeSpent,
				accuracy: Math.round(overallAccuracy),
				problemResults,
			},
		});
	} catch (error) {
		console.error("Error submitting quiz:", error);
		return NextResponse.json(
			{ error: "Failed to submit quiz" },
			{ status: 500 },
		);
	}
}
