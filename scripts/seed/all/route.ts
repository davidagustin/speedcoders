import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/services/database';

interface SeedResult {
	algorithms: { success: boolean; count: number; error: string | null };
	problems: { success: boolean; count: number; error: string | null };
	quizzes: { success: boolean; count: number; error: string | null };
}

export async function POST(request: NextRequest) {
	const result: SeedResult = {
		algorithms: { success: false, count: 0, error: null },
		problems: { success: false, count: 0, error: null },
		quizzes: { success: false, count: 0, error: null },
	};

	try {
		// Seed algorithms
		try {
			const algorithms = [
				{
					name: "Two Pointers",
					category: "Array",
					description: "Use two pointers to traverse array efficiently",
					timeComplexity: "O(n)",
					spaceComplexity: "O(1)",
					examples: JSON.stringify([
						{ problem: "Two Sum", approach: "Use hash map with two pointers" }
					])
				},
				{
					name: "Binary Search",
					category: "Search",
					description: "Efficient search in sorted arrays",
					timeComplexity: "O(log n)",
					spaceComplexity: "O(1)",
					examples: JSON.stringify([
						{ problem: "Search in Rotated Sorted Array", approach: "Modified binary search" }
					])
				},
				{
					name: "Dynamic Programming",
					category: "Optimization",
					description: "Solve complex problems by breaking them into simpler subproblems",
					timeComplexity: "O(n²)",
					spaceComplexity: "O(n)",
					examples: JSON.stringify([
						{ problem: "Climbing Stairs", approach: "DP with memoization" }
					])
				},
				{
					name: "Depth-First Search",
					category: "Graph",
					description: "Traverse graph by exploring as far as possible along each branch",
					timeComplexity: "O(V + E)",
					spaceComplexity: "O(V)",
					examples: JSON.stringify([
						{ problem: "Number of Islands", approach: "DFS to mark visited cells" }
					])
				},
				{
					name: "Breadth-First Search",
					category: "Graph",
					description: "Traverse graph level by level",
					timeComplexity: "O(V + E)",
					spaceComplexity: "O(V)",
					examples: JSON.stringify([
						{ problem: "Word Ladder", approach: "BFS to find shortest path" }
					])
				}
			];

			for (const algorithm of algorithms) {
				await DatabaseService.createAlgorithm(algorithm);
			}

			result.algorithms = { success: true, count: algorithms.length, error: null };
		} catch (error) {
			result.algorithms = {
				success: false,
				count: 0,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}

		// Seed problems
		try {
			const problems = [
				{
					title: "Two Sum",
					difficulty: "Easy",
					category: "Array",
					description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
					examples: JSON.stringify([
						{
							input: "nums = [2,7,11,15], target = 9",
							output: "[0,1]",
							explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
						}
					]),
					constraints: JSON.stringify([
						"2 <= nums.length <= 104",
						"-109 <= nums[i] <= 109",
						"-109 <= target <= 109"
					]),
					solutions: JSON.stringify([
						{
							name: "Hash Table",
							description: "Use hash table to store complements",
							timeComplexity: "O(n)",
							spaceComplexity: "O(n)",
							approach: "Iterate through array, check if complement exists in hash table"
						}
					]),
					leetcodeUrl: "https://leetcode.com/problems/two-sum/"
				},
				{
					title: "Add Two Numbers",
					difficulty: "Medium",
					category: "Linked List",
					description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
					examples: JSON.stringify([
						{
							input: "l1 = [2,4,3], l2 = [5,6,4]",
							output: "[7,0,8]",
							explanation: "342 + 465 = 807"
						}
					]),
					constraints: JSON.stringify([
						"The number of nodes in each linked list is in the range [1, 100]",
						"0 <= Node.val <= 9",
						"It is guaranteed that the list represents a number that does not have leading zeros"
					]),
					solutions: JSON.stringify([
						{
							name: "Elementary Math",
							description: "Add digits and handle carry",
							timeComplexity: "O(max(M,N))",
							spaceComplexity: "O(max(M,N))",
							approach: "Simulate addition digit by digit, handle carry"
						}
					]),
					leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/"
				},
				{
					title: "Longest Substring Without Repeating Characters",
					difficulty: "Medium",
					category: "String",
					description: "Given a string s, find the length of the longest substring without repeating characters.",
					examples: JSON.stringify([
						{
							input: 's = "abcabcbb"',
							output: "3",
							explanation: "The answer is 'abc', with the length of 3."
						}
					]),
					constraints: JSON.stringify([
						"0 <= s.length <= 5 * 104",
						"s consists of English letters, digits, symbols and spaces"
					]),
					solutions: JSON.stringify([
						{
							name: "Sliding Window",
							description: "Use sliding window with hash set",
							timeComplexity: "O(n)",
							spaceComplexity: "O(min(m,n))",
							approach: "Expand window until duplicate found, then contract"
						}
					]),
					leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
				}
			];

			for (const problem of problems) {
				await DatabaseService.createProblem(problem);
			}

			result.problems = { success: true, count: problems.length, error: null };
		} catch (error) {
			result.problems = {
				success: false,
				count: 0,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}

		// Seed quizzes
		try {
			const quizzes = [
				{
					title: "Array Basics",
					description: "Basic array manipulation problems",
					timeLimit: 30,
					difficulty: "Easy",
					category: "Array",
					createdBy: "system"
				},
				{
					title: "String Manipulation",
					description: "String processing and manipulation",
					timeLimit: 45,
					difficulty: "Medium",
					category: "String",
					createdBy: "system"
				}
			];

			for (const quiz of quizzes) {
				await DatabaseService.createQuiz(quiz);
			}

			// Create quiz questions
			const quizQuestions: any[] = [];
			const problems = await DatabaseService.getProblems();
			
			if (problems.length > 0) {
				// Add questions to first quiz
				for (let i = 0; i < Math.min(3, problems.length); i++) {
					quizQuestions.push({
						quizId: "1", // Assuming first quiz gets ID "1"
						problemId: problems[i].id,
						order: i + 1
					});
				}

				// Add questions to second quiz
				for (let i = 0; i < Math.min(2, problems.length); i++) {
					quizQuestions.push({
						quizId: "2", // Assuming second quiz gets ID "2"
						problemId: problems[i].id,
						order: i + 1
					});
				}

				// Create quiz questions in database
				for (const question of quizQuestions) {
					await DatabaseService.createQuizQuestion(question);
				}
			}

			result.quizzes = { success: true, count: quizzes.length, error: null };
		} catch (error) {
			result.quizzes = {
				success: false,
				count: 0,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}

		return NextResponse.json({
			success: true,
			message: "Database seeded successfully",
			result
		});

	} catch (error) {
		return NextResponse.json({
			success: false,
			message: "Failed to seed database",
			error: error instanceof Error ? error.message : "Unknown error",
			result
		}, { status: 500 });
	}
}
