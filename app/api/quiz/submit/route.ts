import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
	try {
		const { userId, quizResults, totalTime } = await request.json();

		if (!userId || !quizResults) {
			return NextResponse.json(
				{ error: "Missing required data" },
				{ status: 400 },
			);
		}

		const score = quizResults.filter((r: any) => r.isCorrect).length;
		const totalQuestions = quizResults.length;

		// Create quiz attempt record
		const _attempt = await prisma.quizAttempt.create({
			data: {
				userId,
				quizId: `default-quiz-${Date.now()}`,
				score,
				timeSpent: totalTime,
				completed: true,
				completedAt: new Date(),
			},
		});

		return NextResponse.json({
			success: true,
			score,
			totalQuestions,
			percentage: Math.round((score / totalQuestions) * 100),
			timeSpent: totalTime,
		});
	} catch (error) {
		console.error("Submit quiz error:", error);
		return NextResponse.json(
			{ error: "Failed to submit quiz" },
			{ status: 500 },
		);
	}
}
