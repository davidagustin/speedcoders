import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/lib/auth/next-auth";

interface RouteParams {
	params: Promise<{
		id: string;
	}>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
	const { id } = await params;
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get the quiz attempt for this quiz and user
		const attempt = await prisma.quizAttempt.findFirst({
			where: {
				quizId: id,
				userId: session.user.email,
			},
			orderBy: {
				completedAt: "desc",
			},
		});

		if (!attempt) {
			return NextResponse.json(
				{ error: "No attempt found for this quiz" },
				{ status: 404 },
			);
		}

		return NextResponse.json(attempt);
	} catch (error) {
		console.error("Error fetching quiz results:", error);
		return NextResponse.json(
			{ error: "Failed to fetch quiz results" },
			{ status: 500 },
		);
	}
}
