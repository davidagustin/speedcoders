import { DatabaseService } from "../services/database";
import { supabase } from "../supabase";

// Mock Supabase
jest.mock("../supabase");
const mockSupabase = supabase as jest.Mocked<typeof supabase>;

// Mock data
const mockProblem = {
	id: "1",
	title: "Two Sum",
	difficulty: "Easy" as const,
	category: "Array",
	description: "Find two numbers that add up to target",
	examples: { input: "[2,7,11,15], 9", output: "[0,1]" },
	constraints: ["2 <= nums.length <= 104"],
	solutions: ["Hash Table", "Two Pointers"],
	leetcode_url: "https://leetcode.com/problems/two-sum/",
	created_at: "2024-01-01",
	updated_at: "2024-01-01",
};

describe("DatabaseService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Problems", () => {
		describe("getProblems", () => {
			it("should fetch problems successfully", async () => {
				const mockResponse = { data: [mockProblem], error: null };
				mockSupabase.from.mockReturnValue({
					select: jest.fn().mockReturnValue({
						limit: jest.fn().mockResolvedValue(mockResponse),
					}),
				} as any);

				const result = await DatabaseService.getProblems();

				expect(result).toEqual([mockProblem]);
				expect(mockSupabase.from).toHaveBeenCalledWith("problems");
			});

			it("should filter by difficulty", async () => {
				const mockResponse = { data: [mockProblem], error: null };
				const mockQuery = {
					select: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							limit: jest.fn().mockResolvedValue(mockResponse),
						}),
					}),
				};
				mockSupabase.from.mockReturnValue(mockQuery as any);

				await DatabaseService.getProblems({ difficulty: "Easy" });

				expect(mockQuery.select().eq).toHaveBeenCalledWith(
					"difficulty",
					"Easy",
				);
			});

			it("should handle database errors", async () => {
				const mockError = new Error("Database connection failed");
				mockSupabase.from.mockReturnValue({
					select: jest.fn().mockReturnValue({
						limit: jest
							.fn()
							.mockResolvedValue({ data: null, error: mockError }),
					}),
				} as any);

				await expect(DatabaseService.getProblems()).rejects.toThrow(
					"Database connection failed",
				);
			});
		});

		describe("getProblemById", () => {
			it("should fetch problem by ID successfully", async () => {
				const mockResponse = { data: [mockProblem], error: null };
				mockSupabase.from.mockReturnValue({
					select: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							single: jest.fn().mockResolvedValue(mockResponse),
						}),
					}),
				} as any);

				const result = await DatabaseService.getProblemById(1);

				expect(result).toEqual(mockProblem);
				expect(mockSupabase.from).toHaveBeenCalledWith("problems");
			});

			it("should return null for non-existent problem", async () => {
				mockSupabase.from.mockReturnValue({
					select: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							single: jest.fn().mockResolvedValue({ data: null, error: null }),
						}),
					}),
				} as any);

				const result = await DatabaseService.getProblemById(999);

				expect(result).toBeNull();
			});
		});

		describe("createProblem", () => {
			it("should create problem successfully", async () => {
				const newProblem = {
					title: "New Problem",
					difficulty: "Medium" as const,
					category: "String",
					description: "A new problem",
					examples: { input: "test", output: "result" },
					constraints: ["1 <= n <= 100"],
					solutions: ["Brute Force"],
					leetcode_url: "https://leetcode.com/problems/new-problem/",
				};

				const mockResponse = {
					data: [{ ...newProblem, id: "2", created_at: "2024-01-01", updated_at: "2024-01-01" }],
					error: null,
				};
				mockSupabase.from.mockReturnValue({
					insert: jest.fn().mockReturnValue({
						select: jest.fn().mockResolvedValue(mockResponse),
					}),
				} as any);

				const result = await DatabaseService.createProblem(newProblem);

				expect(result).toEqual({ ...newProblem, id: "2", created_at: "2024-01-01", updated_at: "2024-01-01" });
			});
		});

		describe("updateProblem", () => {
			it("should update problem successfully", async () => {
				const updatedProblem = {
					title: "Updated Problem",
					difficulty: "Hard" as const,
					category: "Tree",
					description: "Updated description",
					examples: { input: "updated", output: "result" },
					constraints: ["1 <= n <= 1000"],
					solutions: ["DFS", "BFS"],
					leetcode_url: "https://leetcode.com/problems/updated-problem/",
				};

				const mockResponse = {
					data: [{ ...updatedProblem, id: "1", created_at: "2024-01-01", updated_at: "2024-01-02" }],
					error: null,
				};
				mockSupabase.from.mockReturnValue({
					update: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							select: jest.fn().mockResolvedValue(mockResponse),
						}),
					}),
				} as any);

				const result = await DatabaseService.updateProblem(1, updatedProblem);
				expect(result).toEqual({ ...updatedProblem, id: "1", created_at: "2024-01-01", updated_at: "2024-01-02" });
			});
		});
	});

	describe("Quizzes", () => {
		const mockQuiz = {
			id: "1",
			title: "Array Problems Quiz",
			description: "Test your array manipulation skills",
			difficulty: "Easy" as const,
			category: "Array",
			time_limit: 30,
			created_by: "user1",
			is_public: true,
			attempts: 0,
			average_score: 0,
			created_at: "2024-01-01",
			updated_at: "2024-01-01",
		};

		describe("getQuizzes", () => {
			it("should fetch quizzes successfully", async () => {
				const mockResponse = { data: [mockQuiz], error: null };
				mockSupabase.from.mockReturnValue({
					select: jest.fn().mockReturnValue({
						order: jest.fn().mockResolvedValue(mockResponse),
					}),
				} as any);

				const result = await DatabaseService.getQuizzes();

				expect(result).toEqual([mockQuiz]);
				expect(mockSupabase.from).toHaveBeenCalledWith("quizzes");
			});
		});

		describe("getQuizById", () => {
			it("should fetch quiz by ID successfully", async () => {
				const mockResponse = { data: [mockQuiz], error: null };
				mockSupabase.from.mockReturnValue({
					select: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							single: jest.fn().mockResolvedValue(mockResponse),
						}),
					}),
				} as any);

				const result = await DatabaseService.getQuizById("1");

				expect(result).toEqual(mockQuiz);
			});
		});

		describe("createQuiz", () => {
			it("should create quiz successfully", async () => {
				const newQuiz = {
					title: "New Quiz",
					description: "A new quiz",
					difficulty: "Medium" as const,
					category: "String",
					time_limit: 45,
					created_by: "user1",
					is_public: true,
				};

				const mockResponse = {
					data: [{ ...newQuiz, id: "2", attempts: 0, average_score: 0, created_at: "2024-01-01", updated_at: "2024-01-01" }],
					error: null,
				};
				mockSupabase.from.mockReturnValue({
					insert: jest.fn().mockReturnValue({
						select: jest.fn().mockResolvedValue(mockResponse),
					}),
				} as any);

				const result = await DatabaseService.createQuiz(newQuiz);

				expect(result).toEqual({ ...newQuiz, id: "2", attempts: 0, average_score: 0, created_at: "2024-01-01", updated_at: "2024-01-01" });
			});
		});
	});

	describe("Quiz Attempts", () => {
		describe("getQuizAttempts", () => {
			it("should fetch quiz attempts successfully", async () => {
				const mockAttempt = {
					id: "1",
					quiz_id: "1",
					user_id: "user1",
					answers: { "1": [0, 1] },
					score: 8,
					total_questions: 10,
					time_taken: 900,
					completed_at: "2024-01-01",
					created_at: "2024-01-01",
				};

				const mockResponse = { data: [mockAttempt], error: null };
				mockSupabase.from.mockReturnValue({
					select: jest.fn().mockReturnValue({
						eq: jest.fn().mockReturnValue({
							order: jest.fn().mockResolvedValue(mockResponse),
						}),
					}),
				} as any);

				const result = await DatabaseService.getQuizAttempts("user1");

				expect(result).toEqual([mockAttempt]);
			});
		});

		describe("createQuizAttempt", () => {
			it("should create quiz attempt successfully", async () => {
				const newAttempt = {
					quiz_id: "1",
					user_id: "user1",
					score: 7,
					total_questions: 10,
					time_taken: 1200,
				};

				const mockResponse = {
					data: [{ ...newAttempt, id: "1" }],
					error: null,
				};
				mockSupabase.from.mockReturnValue({
					insert: jest.fn().mockReturnValue({
						select: jest.fn().mockResolvedValue(mockResponse),
					}),
				} as any);

				const result = await DatabaseService.createQuizAttempt(newAttempt);

				expect(result).toEqual({ ...newAttempt, id: "1" });
			});
		});
	});

	describe("Error Handling", () => {
		it("should handle network errors gracefully", async () => {
			mockSupabase.from.mockImplementation(() => {
				throw new Error("Network error");
			});

			await expect(DatabaseService.getProblems()).rejects.toThrow("Network error");
		});

		it("should handle malformed responses", async () => {
			mockSupabase.from.mockReturnValue({
				select: jest.fn().mockReturnValue({
					limit: jest.fn().mockResolvedValue({ data: null, error: null }),
				}),
			} as any);

			const result = await DatabaseService.getProblems();
			expect(result).toEqual([]);
		});

		it("should validate required fields", async () => {
			const invalidProblem = {
				// Missing required fields
				description: "Test",
			} as any;

			await expect(DatabaseService.createProblem(invalidProblem)).rejects.toThrow();
		});
	});

	describe("Caching Integration", () => {
		it("should work with cache layer", async () => {
			const mockResponse = { data: [mockProblem], error: null };
			mockSupabase.from.mockReturnValue({
				select: jest.fn().mockReturnValue({
					limit: jest.fn().mockResolvedValue(mockResponse),
				}),
			} as any);

			// First call
			const result1 = await DatabaseService.getProblems();
			expect(result1).toEqual([mockProblem]);

			// Second call should use same service
			const result2 = await DatabaseService.getProblems();
			expect(result2).toEqual([mockProblem]);
			expect(mockSupabase.from).toHaveBeenCalledTimes(2);
		});
	});
});
