import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/lib/auth/next-auth";

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const userId = (session?.user as any)?.id;

		const { searchParams } = new URL(request.url);
		const difficulty = searchParams.get("difficulty");
		const category = searchParams.get("category");
		const yoloMode = searchParams.get("yoloMode") === "true";

		const whereClause: any = {
			isActive: true,
		};

		if (difficulty && difficulty !== "Mixed") {
			whereClause.difficulty = difficulty;
		}

		if (category) {
			whereClause.category = category;
		}

		// Try to get quizzes from database, fallback to demo data
		let quizzes = [];
		
		try {
			if (userId) {
				quizzes = await prisma.quiz.findMany({
					where: whereClause,
					include: {
						questions: {
							include: {
								problem: true,
							},
						},
						attempts: {
							where: {
								userId: userId,
							},
						},
					},
					orderBy: { createdAt: "desc" },
				});
			}
		} catch (dbError) {
			console.log("Database not available, using demo data");
		}
		
		// If no quizzes from DB, return demo quizzes
		if (quizzes.length === 0) {
			quizzes = [
				{
					id: 1,
					title: "Two Pointers Technique",
					description: "Master the two pointers pattern for array and string problems",
					difficulty: "Easy",
					questionCount: 10,
					timeLimit: 30,
					category: "Algorithms",
					questions: [],
					attempts: []
				},
				{
					id: 2,
					title: "Dynamic Programming Basics",
					description: "Learn fundamental dynamic programming concepts and patterns",
					difficulty: "Medium",
					questionCount: 15,
					timeLimit: 45,
					category: "Algorithms",
					questions: [],
					attempts: []
				},
				{
					id: 3,
					title: "Binary Tree Traversal",
					description: "Practice different tree traversal methods",
					difficulty: "Medium",
					questionCount: 12,
					timeLimit: 35,
					category: "Data Structures",
					questions: [],
					attempts: []
				},
				{
					id: 4,
					title: "Graph Algorithms",
					description: "Explore BFS, DFS, and shortest path algorithms",
					difficulty: "Hard",
					questionCount: 20,
					timeLimit: 60,
					category: "Algorithms",
					questions: [],
					attempts: []
				},
				{
					id: 5,
					title: "Hash Table Problems",
					description: "Solve problems using hash maps and sets efficiently",
					difficulty: "Easy",
					questionCount: 8,
					timeLimit: 25,
					category: "Data Structures",
					questions: [],
					attempts: []
				}
			].filter(quiz => {
				if (difficulty && difficulty !== "Mixed" && quiz.difficulty !== difficulty) return false;
				if (category && quiz.category !== category) return false;
				return true;
			});
		}

		// YOLO MODE: NO RESTRICTIONS, MAXIMUM CHAOS! 🔥
		if (yoloMode) {
			console.log(
				"🔥 YOLO MODE ACTIVATED - NO RESTRICTIONS, MAXIMUM CHAOS! 🔥",
			);

			// Shuffle quizzes and add some chaos
			quizzes = quizzes.sort(() => Math.random() - 0.5);

			// Add some quizzes multiple times for extra chaos
			const yoloQuizzes = [];
			for (let i = 0; i < Math.min(20, quizzes.length * 2); i++) {
				const randomIndex = Math.floor(Math.random() * quizzes.length);
				yoloQuizzes.push(quizzes[randomIndex]);
			}
			quizzes = yoloQuizzes;
		}

		return NextResponse.json(quizzes);
	} catch (error) {
		console.error("Error fetching quizzes:", error);
		return NextResponse.json(
			{ error: "Failed to fetch quizzes" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = (session.user as any).id;
		if (!userId) {
			return NextResponse.json({ error: "User ID not found" }, { status: 401 });
		}

		const body = await request.json();
		const { title, description, timeLimit, difficulty, category, problemIds } =
			body;

		// Create the quiz
		const quiz = await prisma.quiz.create({
			data: {
				title,
				description,
				timeLimit,
				difficulty,
				category,
				createdBy: userId,
			},
		});

		// Add questions to the quiz
		if (problemIds && problemIds.length > 0) {
			const questions = problemIds.map((problemId: number, index: number) => ({
				quizId: quiz.id,
				problemId,
				order: index + 1,
			}));

			await prisma.quizQuestion.createMany({
				data: questions,
			});
		}

		return NextResponse.json(quiz, { status: 201 });
	} catch (error) {
		console.error("Error creating quiz:", error);
		return NextResponse.json(
			{ error: "Failed to create quiz" },
			{ status: 500 },
		);
	}
}
