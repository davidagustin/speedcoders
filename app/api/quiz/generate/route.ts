import { type NextRequest, NextResponse } from "next/server";
import { quizManager } from "@/lib/QuizManager";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { difficulty, categories, questionCount, timeLimit } = body;

		// Validate inputs
		if (
			!difficulty ||
			!categories ||
			!Array.isArray(categories) ||
			categories.length === 0
		) {
			return NextResponse.json(
				{ error: "Difficulty and categories are required" },
				{ status: 400 },
			);
		}

		if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
			return NextResponse.json(
				{ error: "Invalid difficulty level" },
				{ status: 400 },
			);
		}

		const count = questionCount || 5;
		const time = timeLimit || 30;

		if (count < 1 || count > 20) {
			return NextResponse.json(
				{ error: "Question count must be between 1 and 20" },
				{ status: 400 },
			);
		}

		if (time < 5 || time > 180) {
			return NextResponse.json(
				{ error: "Time limit must be between 5 and 180 minutes" },
				{ status: 400 },
			);
		}

		const quiz = await quizManager.generateQuiz({
			difficulty,
			categories,
			questionCount: count,
			timeLimit: time,
		});

		return NextResponse.json({
			success: true,
			quiz,
			message: "Quiz generated successfully",
		});
	} catch (error) {
		console.error("Quiz generation error:", error);
		return NextResponse.json(
			{
				error: "Failed to generate quiz",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
