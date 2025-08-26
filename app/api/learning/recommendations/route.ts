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

		// Get user profile first
		const profile = await adaptiveLearningEngine.generateUserProfile(
			session.user.email,
		);

		// Generate ML recommendations
		const recommendations =
			await adaptiveLearningEngine.generateMLRecommendations(profile);

		return NextResponse.json({
			success: true,
			recommendations,
			profile: {
				strengths: profile.strengths,
				weaknesses: profile.weaknesses,
				preferredDifficulty: profile.preferredDifficulty,
				learningVelocity: profile.learningVelocity,
				averageAccuracy: profile.averageAccuracy,
			},
		});
	} catch (error) {
		console.error("Error getting recommendations:", error);
		return NextResponse.json(
			{ error: "Failed to get recommendations" },
			{ status: 500 },
		);
	}
}
