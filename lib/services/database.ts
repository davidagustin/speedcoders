// Centralized database service layer

import { PrismaClient } from "@prisma/client";
import type { Problem, Quiz, QuizSession } from "@/types";

const prisma = new PrismaClient();

export class DatabaseService {
	// Problem operations
	static async getProblems(filters?: any): Promise<any[]> {
		return prisma.problem.findMany({
			where: filters,
			orderBy: { title: "asc" },
		});
	}

	static async getProblemById(id: number): Promise<any | null> {
		return prisma.problem.findUnique({
			where: { id },
		});
	}

	static async createProblem(problem: any): Promise<any> {
		return prisma.problem.create({
			data: {
				title: problem.title,
				difficulty: problem.difficulty,
				category: problem.category,
				description: problem.description,
				examples: JSON.stringify(problem.examples || []),
				constraints: JSON.stringify(problem.constraints || []),
				solutions: JSON.stringify(problem.solutions || []),
				leetcodeUrl: problem.leetcodeUrl || "",
			},
		});
	}

	static async updateProblem(id: number, problem: any): Promise<any> {
		return prisma.problem.update({
			where: { id },
			data: {
				title: problem.title,
				difficulty: problem.difficulty,
				category: problem.category,
				description: problem.description,
				examples: JSON.stringify(problem.examples || []),
				constraints: JSON.stringify(problem.constraints || []),
				solutions: JSON.stringify(problem.solutions || []),
				leetcodeUrl: problem.leetcodeUrl || "",
			},
		});
	}

	// Quiz operations
	static async createQuiz(quiz: any): Promise<any> {
		return prisma.quiz.create({
			data: {
				title: quiz.title,
				description: quiz.description,
				timeLimit: quiz.timeLimit || 30,
				difficulty: quiz.difficulty,
				category: quiz.category,
				createdBy: quiz.createdBy,
			},
		});
	}

	static async getQuizById(id: string): Promise<any | null> {
		return prisma.quiz.findUnique({
			where: { id },
			include: {
				questions: {
					include: {
						problem: true,
					},
				},
			},
		});
	}

	static async getQuizzes(filters?: any): Promise<any[]> {
		return prisma.quiz.findMany({
			where: filters,
			orderBy: { createdAt: "desc" },
		});
	}

	static async updateQuiz(id: string, quiz: any): Promise<any> {
		return prisma.quiz.update({
			where: { id },
			data: {
				title: quiz.title,
				description: quiz.description,
				timeLimit: quiz.timeLimit,
				difficulty: quiz.difficulty,
				category: quiz.category,
				isActive: quiz.isActive,
			},
		});
	}

	static async deleteQuiz(id: string): Promise<any> {
		return prisma.quiz.delete({
			where: { id },
		});
	}

	// Quiz Question operations
	static async createQuizQuestion(question: any): Promise<any> {
		return prisma.quizQuestion.create({
			data: {
				quizId: question.quizId,
				problemId: question.problemId,
				order: question.order,
			},
		});
	}

	static async getQuizQuestions(quizId: string): Promise<any[]> {
		return prisma.quizQuestion.findMany({
			where: { quizId },
			include: {
				problem: true,
			},
			orderBy: { order: "asc" },
		});
	}

	// Quiz Attempt operations
	static async createQuizAttempt(attempt: any): Promise<any> {
		return prisma.quizAttempt.create({
			data: {
				quizId: attempt.quizId,
				userId: attempt.userId,
				score: attempt.score || 0,
				timeSpent: attempt.timeSpent || 0,
				completed: attempt.completed || false,
			},
		});
	}

	static async updateQuizAttempt(id: string, updates: any): Promise<any> {
		return prisma.quizAttempt.update({
			where: { id },
			data: {
				score: updates.score,
				timeSpent: updates.timeSpent,
				completed: updates.completed,
				completedAt: updates.completed ? new Date() : null,
			},
		});
	}

	static async getQuizAttempts(userId: string): Promise<any[]> {
		return prisma.quizAttempt.findMany({
			where: { userId },
			include: {
				quiz: true,
			},
			orderBy: { startedAt: "desc" },
		});
	}

	// User operations
	static async getUserById(id: string): Promise<any | null> {
		return prisma.user.findUnique({
			where: { id },
		});
	}

	static async getUserByEmail(email: string): Promise<any | null> {
		return prisma.user.findUnique({
			where: { email },
		});
	}

	static async createUser(user: any): Promise<any> {
		return prisma.user.create({
			data: {
				email: user.email,
				name: user.name,
				password: user.password,
			},
		});
	}

	static async updateUser(id: string, user: any): Promise<any> {
		return prisma.user.update({
			where: { id },
			data: {
				name: user.name,
				email: user.email,
				image: user.image,
			},
		});
	}

	// Algorithm operations
	static async getAlgorithms(): Promise<any[]> {
		return prisma.algorithm.findMany({
			orderBy: { name: "asc" },
		});
	}

	static async createAlgorithm(algorithm: any): Promise<any> {
		return prisma.algorithm.create({
			data: {
				name: algorithm.name,
				category: algorithm.category,
				description: algorithm.description,
				timeComplexity: algorithm.timeComplexity,
				spaceComplexity: algorithm.spaceComplexity,
				examples: JSON.stringify(algorithm.examples || []),
			},
		});
	}

	// Study Goal operations
	static async createStudyGoal(goal: any): Promise<any> {
		return prisma.studyGoal.create({
			data: {
				userId: goal.userId,
				title: goal.title,
				description: goal.description,
				targetDate: goal.targetDate,
				category: goal.category,
				difficulty: goal.difficulty,
				targetCount: goal.targetCount,
			},
		});
	}

	static async getStudyGoals(userId: string): Promise<any[]> {
		return prisma.studyGoal.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});
	}

	// Study Session operations
	static async createStudySession(session: any): Promise<any> {
		return prisma.studySession.create({
			data: {
				userId: session.userId,
				title: session.title,
				description: session.description,
				category: session.category,
				problemsSolved: session.problemsSolved || 0,
				score: session.score,
				notes: session.notes,
			},
		});
	}

	static async getStudySessions(userId: string): Promise<any[]> {
		return prisma.studySession.findMany({
			where: { userId },
			orderBy: { startTime: "desc" },
		});
	}

	// Achievement operations
	static async createAchievement(achievement: any): Promise<any> {
		return prisma.achievement.create({
			data: {
				userId: achievement.userId,
				title: achievement.title,
				description: achievement.description,
				category: achievement.category,
				icon: achievement.icon,
			},
		});
	}

	static async getAchievements(userId: string): Promise<any[]> {
		return prisma.achievement.findMany({
			where: { userId },
			orderBy: { unlockedAt: "desc" },
		});
	}

	// Statistics and analytics
	static async getUserStats(userId: string): Promise<any> {
		const attempts = await prisma.quizAttempt.findMany({
			where: { userId },
		});

		const totalAttempts = attempts.length;
		const completedAttempts = attempts.filter((a) => a.completed).length;
		const averageScore =
			totalAttempts > 0
				? attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts
				: 0;

		return {
			totalAttempts,
			completedAttempts,
			averageScore,
			completionRate:
				totalAttempts > 0 ? (completedAttempts / totalAttempts) * 100 : 0,
		};
	}
}
