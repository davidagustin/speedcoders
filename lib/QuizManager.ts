import { CacheService } from "./CacheService";
import { RateLimiter } from "./RateLimiter";
import { supabase } from "./supabase";

export interface QuizQuestion {
	id: string;
	problemId: string;
	questionText: string;
	options: string[];
	correctAnswers: number[];
	explanation: string;
	difficulty: "Easy" | "Medium" | "Hard";
	algorithms: string[];
	timeLimit?: number;
}

export interface Quiz {
	id: string;
	title: string;
	description: string;
	createdBy: string;
	questions: QuizQuestion[];
	timeLimit: number;
	difficulty: "Easy" | "Medium" | "Hard";
	categories: string[];
	isPublic: boolean;
	attempts: number;
	averageScore: number;
	createdAt: string;
	updatedAt: string;
}

export interface QuizAttempt {
	id: string;
	quizId: string;
	userId: string;
	answers: Record<string, number[]>;
	score: number;
	timeSpent: number;
	completedAt: string;
	feedback: QuizFeedback[];
}

export interface QuizFeedback {
	questionId: string;
	correct: boolean;
	userAnswer: number[];
	correctAnswer: number[];
	explanation: string;
	algorithm: string;
}

export class QuizManager {
	private cache = CacheService.getInstance();
	private rateLimiter = new RateLimiter({
		windowMs: 60 * 1000, // 1 minute
		maxRequests: 10,
	});

	async createQuiz(
		quiz: Omit<
			Quiz,
			"id" | "attempts" | "averageScore" | "createdAt" | "updatedAt"
		>,
	): Promise<Quiz> {
		try {
			const { data, error } = await supabase
				.from("quizzes")
				.insert({
					...quiz,
					attempts: 0,
					average_score: 0,
				})
				.select("*")
				.single();

			if (error) throw error;

			// Cache the new quiz
			await this.cache.set(`quiz:${data.id}`, data, 3600);

			// Invalidate quiz lists
			await this.cache.deletePattern("quiz:list:*");

			return this.mapDbQuizToQuiz(data);
		} catch (error) {
			console.error("Error creating quiz:", error);
			throw new Error("Failed to create quiz");
		}
	}

	async getQuiz(id: string): Promise<Quiz | null> {
		try {
			// Check cache first
			const cached = await this.cache.get<Quiz>(`quiz:${id}`);
			if (cached) return cached;

			const { data, error } = await supabase
				.from("quizzes")
				.select("*")
				.eq("id", id)
				.single();

			if (error || !data) return null;

			const quiz = this.mapDbQuizToQuiz(data);

			// Cache for 1 hour
			await this.cache.set(`quiz:${id}`, quiz, 3600);

			return quiz;
		} catch (error) {
			console.error("Error fetching quiz:", error);
			return null;
		}
	}

	async getQuizzes(
		filters: {
			userId?: string;
			difficulty?: string;
			category?: string;
			isPublic?: boolean;
			limit?: number;
			offset?: number;
		} = {},
	): Promise<{ quizzes: Quiz[]; total: number }> {
		try {
			const cacheKey = `quiz:list:${JSON.stringify(filters)}`;
			const cached = await this.cache.get<{ quizzes: Quiz[]; total: number }>(
				cacheKey,
			);
			if (cached) return cached;

			let query = supabase
				.from("quizzes")
				.select("*, quiz_attempts(score)", { count: "exact" });

			if (filters.userId) {
				query = query.eq("created_by", filters.userId);
			}

			if (filters.difficulty) {
				query = query.eq("difficulty", filters.difficulty);
			}

			if (filters.category) {
				query = query.contains("categories", [filters.category]);
			}

			if (filters.isPublic !== undefined) {
				query = query.eq("is_public", filters.isPublic);
			}

			if (filters.limit) {
				query = query.limit(filters.limit);
			}

			if (filters.offset) {
				query = query.range(
					filters.offset,
					filters.offset + (filters.limit || 10) - 1,
				);
			}

			const { data, error, count } = await query;

			if (error) throw error;

			const quizzes = data?.map(this.mapDbQuizToQuiz) || [];
			const result = { quizzes, total: count || 0 };

			// Cache for 15 minutes
			await this.cache.set(cacheKey, result, 900);

			return result;
		} catch (error) {
			console.error("Error fetching quizzes:", error);
			return { quizzes: [], total: 0 };
		}
	}

	async startQuizAttempt(
		quizId: string,
		userId: string,
	): Promise<{ attemptId: string; quiz: Quiz } | null> {
		try {
			// Check rate limit
			const rateLimitKey = `quiz_start:${userId}`;
			const { allowed } = await this.rateLimiter.checkLimit(rateLimitKey);
			if (!allowed) {
				throw new Error(
					"Rate limit exceeded. Please wait before starting another quiz.",
				);
			}

			const quiz = await this.getQuiz(quizId);
			if (!quiz) throw new Error("Quiz not found");

			// Create attempt record
			const { data, error } = await supabase
				.from("quiz_attempts")
				.insert({
					quiz_id: quizId,
					user_id: userId,
					started_at: new Date().toISOString(),
					status: "in_progress",
				})
				.select("id")
				.single();

			if (error) throw error;

			// Cache the attempt
			await this.cache.set(
				`attempt:${data.id}`,
				{
					id: data.id,
					quizId,
					userId,
					startedAt: new Date().toISOString(),
					answers: {},
					status: "in_progress",
				},
				7200,
			); // 2 hours

			return { attemptId: data.id, quiz };
		} catch (error) {
			console.error("Error starting quiz attempt:", error);
			return null;
		}
	}

	async submitQuizAttempt(
		attemptId: string,
		answers: Record<string, number[]>,
		timeSpent: number,
	): Promise<QuizAttempt | null> {
		try {
			// Get the attempt from cache
			const attempt = await this.cache.get<QuizAttempt>(`attempt:${attemptId}`);
			if (!attempt || !attempt.quizId) throw new Error("Attempt not found");

			const quiz = await this.getQuiz(attempt.quizId);
			if (!quiz) throw new Error("Quiz not found");

			// Calculate score and generate feedback
			const { score, feedback } = this.calculateScore(quiz, answers);

			// Update attempt in database
			const { data, error } = await supabase
				.from("quiz_attempts")
				.update({
					answers,
					score,
					time_spent: timeSpent,
					completed_at: new Date().toISOString(),
					status: "completed",
					feedback,
				})
				.eq("id", attemptId)
				.select("*")
				.single();

			if (error) throw error;

			// Update quiz statistics
			await this.updateQuizStats(quiz.id, score);

			// Remove from cache
			await this.cache.delete(`attempt:${attemptId}`);

			// Invalidate related caches
			await this.cache.deletePattern(`quiz:${quiz.id}:*`);
			await this.cache.delete(`quiz:${quiz.id}`);

			return {
				id: data.id,
				quizId: data.quiz_id,
				userId: data.user_id,
				answers: data.answers,
				score: data.score,
				timeSpent: data.time_spent,
				completedAt: data.completed_at,
				feedback,
			};
		} catch (error) {
			console.error("Error submitting quiz attempt:", error);
			return null;
		}
	}

	async getQuizAttempts(
		quizId: string,
		userId?: string,
	): Promise<QuizAttempt[]> {
		try {
			let query = supabase
				.from("quiz_attempts")
				.select("*")
				.eq("quiz_id", quizId)
				.eq("status", "completed");

			if (userId) {
				query = query.eq("user_id", userId);
			}

			const { data, error } = await query;

			if (error) throw error;

			return (
				data?.map((attempt) => ({
					id: attempt.id,
					quizId: attempt.quiz_id,
					userId: attempt.user_id,
					answers: attempt.answers,
					score: attempt.score,
					timeSpent: attempt.time_spent,
					completedAt: attempt.completed_at,
					feedback: attempt.feedback || [],
				})) || []
			);
		} catch (error) {
			console.error("Error fetching quiz attempts:", error);
			return [];
		}
	}

	async generateQuiz(options: {
		difficulty: "Easy" | "Medium" | "Hard";
		categories: string[];
		questionCount: number;
		timeLimit: number;
	}): Promise<Quiz> {
		try {
			// Get problems matching criteria
			const { data: problems, error } = await supabase
				.from("problems")
				.select("*")
				.eq("difficulty", options.difficulty)
				.in("category", options.categories)
				.limit(options.questionCount * 2); // Get more than needed for variety

			if (error) throw error;

			if (!problems || problems.length < options.questionCount) {
				throw new Error(
					"Not enough problems available for the specified criteria",
				);
			}

			// Randomly select problems
			const selectedProblems = this.shuffleArray(problems).slice(
				0,
				options.questionCount,
			);

			// Generate questions from problems
			const questions: QuizQuestion[] = selectedProblems.map(
				(problem, index) => ({
					id: `q${index + 1}`,
					problemId: problem.id,
					questionText: `Which algorithm(s) would be most suitable for solving: ${problem.title}?`,
					options: this.generateAlgorithmOptions(problem.category),
					correctAnswers: [0], // First option is always correct in generated quizzes
					explanation: `This problem is best solved using ${problem.category} techniques.`,
					difficulty: problem.difficulty,
					algorithms: [problem.category],
					timeLimit: Math.floor(options.timeLimit / options.questionCount),
				}),
			);

			// Create the quiz
			return await this.createQuiz({
				title: `Generated ${options.difficulty} Quiz`,
				description: `Auto-generated quiz covering ${options.categories.join(", ")} with ${options.questionCount} questions`,
				createdBy: "system",
				questions,
				timeLimit: options.timeLimit,
				difficulty: options.difficulty,
				categories: options.categories,
				isPublic: true,
			});
		} catch (error) {
			console.error("Error generating quiz:", error);
			throw new Error("Failed to generate quiz");
		}
	}

	private calculateScore(
		quiz: Quiz,
		answers: Record<string, number[]>,
	): { score: number; feedback: QuizFeedback[] } {
		let correctCount = 0;
		const feedback: QuizFeedback[] = [];

		quiz.questions.forEach((question) => {
			const userAnswer = answers[question.id] || [];
			const correct = this.arraysEqual(
				userAnswer.sort(),
				question.correctAnswers.sort(),
			);

			if (correct) correctCount++;

			feedback.push({
				questionId: question.id,
				correct,
				userAnswer,
				correctAnswer: question.correctAnswers,
				explanation: question.explanation,
				algorithm: question.algorithms[0] || "Unknown",
			});
		});

		const score = Math.round((correctCount / quiz.questions.length) * 100);
		return { score, feedback };
	}

	private async updateQuizStats(quizId: string, score: number): Promise<void> {
		try {
			// Get current stats
			const { data, error } = await supabase
				.from("quizzes")
				.select("attempts, average_score")
				.eq("id", quizId)
				.single();

			if (error) throw error;

			const newAttempts = (data.attempts || 0) + 1;
			const newAverageScore =
				((data.average_score || 0) * (data.attempts || 0) + score) /
				newAttempts;

			// Update stats
			await supabase
				.from("quizzes")
				.update({
					attempts: newAttempts,
					average_score: Math.round(newAverageScore * 10) / 10,
				})
				.eq("id", quizId);
		} catch (error) {
			console.error("Error updating quiz stats:", error);
		}
	}

	private mapDbQuizToQuiz(dbQuiz: any): Quiz {
		return {
			id: dbQuiz.id,
			title: dbQuiz.title,
			description: dbQuiz.description,
			createdBy: dbQuiz.created_by,
			questions: dbQuiz.questions || [],
			timeLimit: dbQuiz.time_limit,
			difficulty: dbQuiz.difficulty,
			categories: dbQuiz.categories || [],
			isPublic: dbQuiz.is_public,
			attempts: dbQuiz.attempts || 0,
			averageScore: dbQuiz.average_score || 0,
			createdAt: dbQuiz.created_at,
			updatedAt: dbQuiz.updated_at,
		};
	}

	private generateAlgorithmOptions(primaryCategory: string): string[] {
		const algorithmsByCategory: Record<string, string[]> = {
			Array: ["Two Pointers", "Sliding Window", "Binary Search", "Sorting"],
			String: ["Two Pointers", "Sliding Window", "KMP", "Rabin-Karp"],
			Tree: ["DFS", "BFS", "Binary Search Tree", "Tree Traversal"],
			Graph: ["DFS", "BFS", "Dijkstra", "Union Find"],
			"Dynamic Programming": ["Memoization", "1D DP", "2D DP", "Tree DP"],
		};

		const primary = algorithmsByCategory[primaryCategory] || ["Brute Force"];
		const others = Object.values(algorithmsByCategory)
			.flat()
			.filter((alg) => !primary.includes(alg));

		return [
			primary[0], // Correct answer first
			...this.shuffleArray(others).slice(0, 3), // Three incorrect options
		];
	}

	private shuffleArray<T>(array: T[]): T[] {
		const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	private arraysEqual<T>(a: T[], b: T[]): boolean {
		if (a.length !== b.length) return false;
		return a.every((val, i) => val === b[i]);
	}
}

export const quizManager = new QuizManager();
