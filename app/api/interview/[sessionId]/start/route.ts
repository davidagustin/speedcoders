import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";
import { interviewSimulator } from "@/lib/InterviewSimulator";

interface RouteParams {
	params: Promise<{
		sessionId: string;
	}>;
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
	const { sessionId } = await params;

	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!sessionId) {
			return NextResponse.json(
				{ error: "Session ID is required" },
				{ status: 400 },
			);
		}

		// Start the interview session
		const startedSession = await interviewSimulator.startInterview(sessionId);

		return NextResponse.json({
			success: true,
			session: {
				id: startedSession.id,
				status: startedSession.status,
				startTime: startedSession.startTime,
				currentProblem:
					startedSession.problems[startedSession.currentProblemIndex],
				recording: startedSession.recording
					? {
							isRecording: true,
							chatLog: startedSession.recording.chatLog,
						}
					: null,
			},
		});
	} catch (error) {
		console.error("Error starting interview:", error);
		return NextResponse.json(
			{ error: "Failed to start interview session" },
			{ status: 500 },
		);
	}
}
