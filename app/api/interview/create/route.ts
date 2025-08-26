import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { interviewSimulator } from "@/lib/InterviewSimulator";

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const {
			type = "technical",
			difficulty = "mid-level",
			company = "Generic Tech Company",
			settings = {},
		} = await request.json();

		// Validate input parameters
		const validTypes = ["technical", "system-design", "behavioral", "mixed"];
		const validDifficulties = ["junior", "mid-level", "senior", "staff"];

		if (!validTypes.includes(type)) {
			return NextResponse.json(
				{ error: "Invalid interview type" },
				{ status: 400 },
			);
		}

		if (!validDifficulties.includes(difficulty)) {
			return NextResponse.json(
				{ error: "Invalid difficulty level" },
				{ status: 400 },
			);
		}

		// Create interview session
		const interviewSession = await interviewSimulator.createInterviewSession(
			session.user.email,
			type,
			difficulty,
			company,
			settings,
		);

		return NextResponse.json({
			success: true,
			session: {
				id: interviewSession.id,
				type: interviewSession.type,
				difficulty: interviewSession.difficulty,
				company: interviewSession.company,
				duration: interviewSession.duration,
				problemCount: interviewSession.problems.length,
				status: interviewSession.status,
				settings: interviewSession.settings,
			},
		});
	} catch (error) {
		console.error("Error creating interview session:", error);
		return NextResponse.json(
			{ error: "Failed to create interview session" },
			{ status: 500 },
		);
	}
}
