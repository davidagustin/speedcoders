import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/services/database';

export async function POST(request: NextRequest) {
	try {
		// Create sample quizzes
		const quizzes = [
			{
				title: "Array Fundamentals",
				description: "Master basic array operations and common patterns",
				timeLimit: 15,
				difficulty: "Easy",
				category: "Array",
				createdBy: "system"
			},
			{
				title: "String Manipulation",
				description: "Learn string processing techniques and algorithms",
				timeLimit: 20,
				difficulty: "Medium",
				category: "String",
				createdBy: "system"
			},
			{
				title: "Linked List Basics",
				description: "Practice linked list operations and traversal",
				timeLimit: 18,
				difficulty: "Medium",
				category: "Linked List",
				createdBy: "system"
			},
			{
				title: "Dynamic Programming Intro",
				description: "Introduction to dynamic programming concepts",
				timeLimit: 25,
				difficulty: "Hard",
				category: "Dynamic Programming",
				createdBy: "system"
			},
			{
				title: "Tree Traversal",
				description: "Master tree data structure traversal techniques",
				timeLimit: 22,
				difficulty: "Medium",
				category: "Tree",
				createdBy: "system"
			}
		];

		const createdQuizzes = [];
		for (const quiz of quizzes) {
			const createdQuiz = await DatabaseService.createQuiz(quiz);
			createdQuizzes.push(createdQuiz);
		}

		// Get problems to create quiz questions
		const problems = await DatabaseService.getProblems();
		
		if (problems.length > 0) {
			// Create quiz questions for each quiz
			const quizQuestions: Array<{
				quizId: string;
				problemId: number;
				order: number;
			}> = [];

			// Array Fundamentals Quiz
			const arrayProblems = problems
				.filter(p => p.category === "Array" && p.difficulty === "Easy")
				.slice(0, 3);
			arrayProblems.forEach((problem, index) => {
				quizQuestions.push({
					quizId: createdQuizzes[0]?.id || "1",
					problemId: problem.id,
					order: index + 1
				});
			});

			// String Manipulation Quiz
			const stringProblems = problems
				.filter(p => p.category === "String")
				.slice(0, 3);
			stringProblems.forEach((problem, index) => {
				quizQuestions.push({
					quizId: createdQuizzes[1]?.id || "2",
					problemId: problem.id,
					order: index + 1
				});
			});

			// Linked List Basics Quiz
			const linkedListProblems = problems
				.filter(p => p.category === "Linked List")
				.slice(0, 2);
			linkedListProblems.forEach((problem, index) => {
				quizQuestions.push({
					quizId: createdQuizzes[2]?.id || "3",
					problemId: problem.id,
					order: index + 1
				});
			});

			// Dynamic Programming Quiz
			const dpProblems = problems
				.filter(p => p.category === "Dynamic Programming" || p.difficulty === "Hard")
				.slice(0, 2);
			dpProblems.forEach((problem, index) => {
				quizQuestions.push({
					quizId: createdQuizzes[3]?.id || "4",
					problemId: problem.id,
					order: index + 1
				});
			});

			// Tree Traversal Quiz
			const treeProblems = problems
				.filter(p => p.category === "Tree")
				.slice(0, 2);
			treeProblems.forEach((problem, index) => {
				quizQuestions.push({
					quizId: createdQuizzes[4]?.id || "5",
					problemId: problem.id,
					order: index + 1
				});
			});

			// Create quiz questions in database
			for (const question of quizQuestions) {
				await DatabaseService.createQuizQuestion(question);
			}
		}

		return NextResponse.json({
			success: true,
			message: "Quizzes seeded successfully",
			quizzesCreated: createdQuizzes.length,
			questionsCreated: problems.length > 0 ? "Quiz questions created" : "No problems available for questions"
		});

	} catch (error) {
		console.error("Error seeding quizzes:", error);
		return NextResponse.json({
			success: false,
			message: "Failed to seed quizzes",
			error: error instanceof Error ? error.message : "Unknown error"
		}, { status: 500 });
	}
}
