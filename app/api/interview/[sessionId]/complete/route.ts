import { NextResponse } from "next/server";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ sessionId: string }> }
) {
	try {
		const { sessionId } = await params;
		const body = await request.json();

		// For now, just return success
		return NextResponse.json({
			success: true,
			sessionId,
			message: "Interview session completed",
			...body,
		});
	} catch (error) {
		console.error("Error completing interview:", error);
		return NextResponse.json(
			{ error: "Failed to complete interview" },
			{ status: 500 }
		);
	}
}

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ sessionId: string }> }
) {
	try {
		const { sessionId } = await params;

		// For now, return mock data
		return NextResponse.json({
			success: true,
			sessionId,
			status: "completed",
			score: 0,
			feedback: [],
		});
	} catch (error) {
		console.error("Error fetching interview results:", error);
		return NextResponse.json(
			{ error: "Failed to fetch interview results" },
			{ status: 500 }
		);
	}
}