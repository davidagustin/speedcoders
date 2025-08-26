import { NextResponse } from "next/server";

export async function POST(request: Request) {
	// For now, create a simple version without complex auth middleware
	try {
		const body = await request.json();
		const { problemIds, timeLimit, userId } = body;

		if (!userId) {
			return NextResponse.json({ error: "User ID required" }, { status: 400 });
		}

		if (!problemIds || problemIds.length === 0) {
			return NextResponse.json(
				{ error: "At least one problem required" },
				{ status: 400 },
			);
		}

		// Create a simple quiz object
		const quiz = {
			id: `quiz_${Date.now()}`,
			userId,
			problemIds,
			timeLimit: timeLimit || 30,
			createdAt: new Date().toISOString(),
		};

		return NextResponse.json({
			success: true,
			...quiz,
		});
	} catch (error) {
		console.error("Quiz creation error:", error);
		return NextResponse.json(
			{ error: "Failed to create quiz" },
			{ status: 500 },
		);
	}
}
