import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { adaptiveLearningEngine } from "@/lib/AdaptiveLearningEngine";
import { authOptions } from "@/lib/auth/next-auth";

export async function GET(_request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const profile = await adaptiveLearningEngine.generateUserProfile(
			session.user.email,
		);

		return NextResponse.json({
			success: true,
			profile,
		});
	} catch (error) {
		console.error("Error getting learning profile:", error);
		return NextResponse.json(
			{ error: "Failed to get learning profile" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { goals } = await request.json();

		if (!Array.isArray(goals)) {
			return NextResponse.json(
				{ error: "Goals must be an array of strings" },
				{ status: 400 },
			);
		}

		// Create personalized learning path
		const learningPath =
			await adaptiveLearningEngine.createPersonalizedLearningPath(
				session.user.email,
				goals,
			);

		return NextResponse.json({
			success: true,
			learningPath,
		});
	} catch (error) {
		console.error("Error creating learning path:", error);
		return NextResponse.json(
			{ error: "Failed to create learning path" },
			{ status: 500 },
		);
	}
}
