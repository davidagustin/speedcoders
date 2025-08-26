import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
	try {
		const supabase = await createClient();

		// Create comprehensive quizzes with questions from batch1.js and additional problems
		const quizzes = [
			{
				title: "String Manipulation Mastery",
				description:
					"Master string processing, pattern matching, and text manipulation techniques",
				timeLimit: 25,
				difficulty: "Medium",
				category: "String",
				createdBy: "system",
			},
			{
				title: "Array & Two Pointers Challenge",
				description: "Advanced array manipulation and two-pointer techniques",
				timeLimit: 30,
				difficulty: "Medium",
				category: "Array",
				createdBy: "system",
			},
			{
				title: "Dynamic Programming Fundamentals",
				description:
					"Core dynamic programming patterns and optimization techniques",
				timeLimit: 35,
				difficulty: "Hard",
				category: "Dynamic Programming",
				createdBy: "system",
			},
			{
				title: "Tree & Graph Traversal",
				description: "Master tree and graph traversal algorithms",
				timeLimit: 30,
				difficulty: "Medium",
				category: "Tree",
				createdBy: "system",
			},
			{
				title: "Linked List Operations",
				description: "Advanced linked list manipulation and algorithms",
				timeLimit: 25,
				difficulty: "Medium",
				category: "Linked List",
				createdBy: "system",
			},
			{
				title: "Backtracking & Recursion",
				description: "Solve complex problems using backtracking and recursion",
				timeLimit: 40,
				difficulty: "Hard",
				category: "Backtracking",
				createdBy: "system",
			},
			{
				title: "Database & SQL Mastery",
				description: "Advanced SQL queries and database operations",
				timeLimit: 20,
				difficulty: "Medium",
				category: "Database",
				createdBy: "system",
			},
			{
				title: "Bit Manipulation & Math",
				description: "Bit manipulation techniques and mathematical algorithms",
				timeLimit: 25,
				difficulty: "Medium",
				category: "Math",
				createdBy: "system",
			},
		];

		// Create quizzes first
		for (const quiz of quizzes) {
			const { data: quizData, error: quizError } = await supabase
				.from("quizzes")
				.insert(quiz)
				.select()
				.single();

			if (quizError) {
				console.error("Error creating quiz:", quizError);
				continue;
			}

			// Create questions for each quiz based on the quiz category
			const questions = getQuestionsForQuiz(quiz.category, quizData.id);

			for (const question of questions) {
				await supabase.from("quiz_questions").insert({
					...question,
					quizId: quizData.id,
				});
			}
		}

		return NextResponse.json({
			success: true,
			message:
				"Quizzes created successfully with comprehensive questions from batch1.js data",
		});
	} catch (error) {
		console.error("Quiz seeding error:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to seed quizzes",
			},
			{ status: 500 },
		);
	}
}

function getQuestionsForQuiz(category: string, _quizId: string) {
	const questions = [];

	switch (category) {
		case "String":
			questions.push(
				{
					problemId: 6,
					question:
						"What is the most efficient approach for Zigzag Conversion?",
					options: JSON.stringify([
						"Dynamic Programming",
						"String Simulation with Math",
						"Two Pointers",
						"Hash Table",
					]),
					correctAnswer: "String Simulation with Math",
					explanation:
						"Zigzag conversion requires simulating the zigzag pattern using mathematical calculations to determine row positions.",
					order: 1,
				},
				{
					problemId: 8,
					question:
						"Which algorithms are essential for String to Integer (atoi)?",
					options: JSON.stringify([
						"String Parsing and Math",
						"Dynamic Programming",
						"Two Pointers",
						"Hash Table",
					]),
					correctAnswer: "String Parsing and Math",
					explanation:
						"atoi requires string parsing to handle whitespace, signs, and numeric conversion with overflow checking.",
					order: 2,
				},
				{
					problemId: 10,
					question:
						"What is the optimal approach for Regular Expression Matching?",
					options: JSON.stringify([
						"Dynamic Programming with Recursion",
						"Two Pointers",
						"Hash Table",
						"Stack",
					]),
					correctAnswer: "Dynamic Programming with Recursion",
					explanation:
						"Regex matching requires DP to handle complex patterns and recursion for backtracking.",
					order: 3,
				},
				{
					problemId: 14,
					question:
						"Which data structure is most efficient for Longest Common Prefix?",
					options: JSON.stringify(["Trie", "Hash Table", "Stack", "Queue"]),
					correctAnswer: "Trie",
					explanation:
						"Trie provides O(S) time complexity where S is the sum of all characters in all strings.",
					order: 4,
				},
				{
					problemId: 17,
					question:
						"What approach is best for Letter Combinations of Phone Number?",
					options: JSON.stringify([
						"Backtracking with Hash Table",
						"Dynamic Programming",
						"Two Pointers",
						"Stack",
					]),
					correctAnswer: "Backtracking with Hash Table",
					explanation:
						"Backtracking generates all combinations while hash table maps digits to letters.",
					order: 5,
				},
			);
			break;

		case "Array":
			questions.push(
				{
					problemId: 16,
					question: "What is the optimal approach for 3Sum Closest?",
					options: JSON.stringify([
						"Two Pointers with Sorting",
						"Dynamic Programming",
						"Hash Table",
						"Binary Search",
					]),
					correctAnswer: "Two Pointers with Sorting",
					explanation:
						"Sorting + two pointers provides O(n²) time complexity, which is optimal for this problem.",
					order: 1,
				},
				{
					problemId: 18,
					question: "Which algorithms are needed for 4Sum?",
					options: JSON.stringify([
						"Two Pointers with Sorting",
						"Dynamic Programming",
						"Hash Table",
						"Binary Search",
					]),
					correctAnswer: "Two Pointers with Sorting",
					explanation:
						"4Sum extends 3Sum approach using two pointers after sorting to avoid duplicates.",
					order: 2,
				},
				{
					problemId: 80,
					question:
						"What is the best approach for Remove Duplicates from Sorted Array II?",
					options: JSON.stringify([
						"Two Pointers with Counter",
						"Hash Table",
						"Stack",
						"Dynamic Programming",
					]),
					correctAnswer: "Two Pointers with Counter",
					explanation:
						"Two pointers with counter allows at most two occurrences while maintaining O(1) space.",
					order: 3,
				},
				{
					problemId: 81,
					question:
						"How to handle Search in Rotated Sorted Array II with duplicates?",
					options: JSON.stringify([
						"Binary Search with Edge Cases",
						"Linear Search",
						"Hash Table",
						"Two Pointers",
					]),
					correctAnswer: "Binary Search with Edge Cases",
					explanation:
						"Binary search works but requires special handling for duplicate elements.",
					order: 4,
				},
				{
					problemId: 164,
					question: "What is the optimal approach for Maximum Gap?",
					options: JSON.stringify([
						"Bucket Sort or Radix Sort",
						"Quick Sort",
						"Merge Sort",
						"Linear Search",
					]),
					correctAnswer: "Bucket Sort or Radix Sort",
					explanation:
						"Bucket sort provides O(n) time complexity using pigeonhole principle.",
					order: 5,
				},
			);
			break;

		case "Dynamic Programming":
			questions.push(
				{
					problemId: 10,
					question:
						"What is the optimal approach for Regular Expression Matching?",
					options: JSON.stringify([
						"Dynamic Programming with Recursion",
						"Two Pointers",
						"Hash Table",
						"Stack",
					]),
					correctAnswer: "Dynamic Programming with Recursion",
					explanation:
						"DP handles complex regex patterns with recursion for backtracking.",
					order: 1,
				},
				{
					problemId: 32,
					question: "Which approach is best for Longest Valid Parentheses?",
					options: JSON.stringify([
						"Dynamic Programming with Stack",
						"Two Pointers",
						"Hash Table",
						"Greedy",
					]),
					correctAnswer: "Dynamic Programming with Stack",
					explanation:
						"DP tracks valid parentheses length while stack handles matching.",
					order: 2,
				},
				{
					problemId: 87,
					question: "What is needed for Scramble String?",
					options: JSON.stringify([
						"Dynamic Programming with Recursion",
						"Two Pointers",
						"Hash Table",
						"Stack",
					]),
					correctAnswer: "Dynamic Programming with Recursion",
					explanation:
						"DP with recursion handles all possible scramble combinations.",
					order: 3,
				},
				{
					problemId: 97,
					question: "Which approach for Interleaving String?",
					options: JSON.stringify([
						"Dynamic Programming with 2D DP",
						"Two Pointers",
						"Hash Table",
						"Stack",
					]),
					correctAnswer: "Dynamic Programming with 2D DP",
					explanation:
						"2D DP tracks if s3 can be formed by interleaving s1 and s2.",
					order: 4,
				},
				{
					problemId: 115,
					question: "What is optimal for Distinct Subsequences?",
					options: JSON.stringify([
						"Dynamic Programming with Memoization",
						"Two Pointers",
						"Hash Table",
						"Backtracking",
					]),
					correctAnswer: "Dynamic Programming with Memoization",
					explanation:
						"DP counts distinct subsequences with memoization for efficiency.",
					order: 5,
				},
			);
			break;

		case "Tree":
			questions.push(
				{
					problemId: 106,
					question:
						"What approach for Construct Binary Tree from Inorder and Postorder?",
					options: JSON.stringify([
						"Divide and Conquer with Hash Table",
						"Dynamic Programming",
						"Two Pointers",
						"Stack",
					]),
					correctAnswer: "Divide and Conquer with Hash Table",
					explanation:
						"Divide and conquer builds tree recursively using hash table for O(1) lookups.",
					order: 1,
				},
				{
					problemId: 109,
					question: "Which approach for Convert Sorted List to BST?",
					options: JSON.stringify([
						"Divide and Conquer with Two Pointers",
						"Dynamic Programming",
						"Hash Table",
						"Stack",
					]),
					correctAnswer: "Divide and Conquer with Two Pointers",
					explanation:
						"Divide and conquer finds middle using two pointers for balanced BST.",
					order: 2,
				},
				{
					problemId: 117,
					question: "What is needed for Populating Next Right Pointers II?",
					options: JSON.stringify([
						"BFS with Level Traversal",
						"DFS",
						"Two Pointers",
						"Stack",
					]),
					correctAnswer: "BFS with Level Traversal",
					explanation:
						"BFS connects nodes at same level using level-order traversal.",
					order: 3,
				},
				{
					problemId: 144,
					question: "Which approach for Binary Tree Preorder Traversal?",
					options: JSON.stringify([
						"Stack or Morris Traversal",
						"Recursion",
						"Two Pointers",
						"Hash Table",
					]),
					correctAnswer: "Stack or Morris Traversal",
					explanation:
						"Stack provides iterative solution, Morris traversal uses O(1) space.",
					order: 4,
				},
				{
					problemId: 173,
					question: "What is optimal for Binary Search Tree Iterator?",
					options: JSON.stringify([
						"Stack with Inorder Traversal",
						"Queue",
						"Hash Table",
						"Two Pointers",
					]),
					correctAnswer: "Stack with Inorder Traversal",
					explanation:
						"Stack maintains inorder traversal state for O(1) next() calls.",
					order: 5,
				},
			);
			break;

		case "Linked List":
			questions.push(
				{
					problemId: 19,
					question: "What approach for Remove Nth Node From End of List?",
					options: JSON.stringify([
						"Two Pointers (Fast & Slow)",
						"Stack",
						"Hash Table",
						"Recursion",
					]),
					correctAnswer: "Two Pointers (Fast & Slow)",
					explanation:
						"Fast pointer moves n steps ahead, then both move together to find nth from end.",
					order: 1,
				},
				{
					problemId: 23,
					question: "Which approach for Merge k Sorted Lists?",
					options: JSON.stringify([
						"Heap with Priority Queue",
						"Two Pointers",
						"Hash Table",
						"Stack",
					]),
					correctAnswer: "Heap with Priority Queue",
					explanation:
						"Heap maintains minimum element from all lists for O(n log k) time.",
					order: 2,
				},
				{
					problemId: 24,
					question: "What is optimal for Swap Nodes in Pairs?",
					options: JSON.stringify([
						"Recursion or Iteration",
						"Stack",
						"Hash Table",
						"Two Pointers",
					]),
					correctAnswer: "Recursion or Iteration",
					explanation:
						"Both approaches work - recursion is elegant, iteration is space-efficient.",
					order: 3,
				},
				{
					problemId: 25,
					question: "Which approach for Reverse Nodes in k-Group?",
					options: JSON.stringify([
						"Recursion with Two Pointers",
						"Stack",
						"Hash Table",
						"Dynamic Programming",
					]),
					correctAnswer: "Recursion with Two Pointers",
					explanation:
						"Recursion handles k-group reversal while two pointers reverse each group.",
					order: 4,
				},
				{
					problemId: 82,
					question: "What is best for Remove Duplicates from Sorted List II?",
					options: JSON.stringify([
						"Two Pointers with Dummy Node",
						"Stack",
						"Hash Table",
						"Recursion",
					]),
					correctAnswer: "Two Pointers with Dummy Node",
					explanation:
						"Two pointers track current and previous, dummy node handles head removal.",
					order: 5,
				},
			);
			break;

		case "Backtracking":
			questions.push(
				{
					problemId: 17,
					question: "What approach for Letter Combinations of Phone Number?",
					options: JSON.stringify([
						"Backtracking with Hash Table",
						"Dynamic Programming",
						"Two Pointers",
						"Stack",
					]),
					correctAnswer: "Backtracking with Hash Table",
					explanation:
						"Backtracking generates all combinations while hash table maps digits to letters.",
					order: 1,
				},
				{
					problemId: 22,
					question: "Which approach for Generate Parentheses?",
					options: JSON.stringify([
						"Backtracking with DFS",
						"Dynamic Programming",
						"Two Pointers",
						"Stack",
					]),
					correctAnswer: "Backtracking with DFS",
					explanation:
						"Backtracking generates valid parentheses combinations using DFS.",
					order: 2,
				},
				{
					problemId: 37,
					question: "What is optimal for Sudoku Solver?",
					options: JSON.stringify([
						"Backtracking with Constraint Propagation",
						"Dynamic Programming",
						"Two Pointers",
						"Hash Table",
					]),
					correctAnswer: "Backtracking with Constraint Propagation",
					explanation:
						"Backtracking tries all possibilities with constraint propagation for efficiency.",
					order: 3,
				},
				{
					problemId: 60,
					question: "Which approach for Permutation Sequence?",
					options: JSON.stringify([
						"Backtracking with Math",
						"Dynamic Programming",
						"Two Pointers",
						"Stack",
					]),
					correctAnswer: "Backtracking with Math",
					explanation:
						"Backtracking with mathematical optimization finds kth permutation efficiently.",
					order: 4,
				},
				{
					problemId: 93,
					question: "What is best for Restore IP Addresses?",
					options: JSON.stringify([
						"Backtracking with Validation",
						"Dynamic Programming",
						"Two Pointers",
						"Hash Table",
					]),
					correctAnswer: "Backtracking with Validation",
					explanation:
						"Backtracking generates all valid IP address combinations with validation.",
					order: 5,
				},
			);
			break;

		case "Database":
			questions.push(
				{
					problemId: 175,
					question: "What SQL operation for Combine Two Tables?",
					options: JSON.stringify([
						"LEFT JOIN",
						"INNER JOIN",
						"RIGHT JOIN",
						"FULL JOIN",
					]),
					correctAnswer: "LEFT JOIN",
					explanation:
						"LEFT JOIN ensures all records from left table are included even if no match in right table.",
					order: 1,
				},
				{
					problemId: 176,
					question: "Which approach for Second Highest Salary?",
					options: JSON.stringify([
						"Subquery with LIMIT",
						"Window Function",
						"Self Join",
						"Group By",
					]),
					correctAnswer: "Subquery with LIMIT",
					explanation:
						"Subquery with LIMIT and OFFSET finds second highest salary efficiently.",
					order: 2,
				},
				{
					problemId: 178,
					question: "What is optimal for Rank Scores?",
					options: JSON.stringify([
						"Window Function with DENSE_RANK",
						"Subquery",
						"Self Join",
						"Group By",
					]),
					correctAnswer: "Window Function with DENSE_RANK",
					explanation:
						"DENSE_RANK provides ranking without gaps, perfect for score ranking.",
					order: 3,
				},
				{
					problemId: 180,
					question: "Which approach for Consecutive Numbers?",
					options: JSON.stringify([
						"Self Join with Window Function",
						"Subquery",
						"Group By",
						"Union",
					]),
					correctAnswer: "Self Join with Window Function",
					explanation:
						"Self join finds consecutive numbers, window function provides efficient ranking.",
					order: 4,
				},
				{
					problemId: 185,
					question: "What is best for Department Top Three Salaries?",
					options: JSON.stringify([
						"Window Function with PARTITION",
						"Subquery",
						"Self Join",
						"Group By",
					]),
					correctAnswer: "Window Function with PARTITION",
					explanation:
						"Window function with PARTITION BY department provides top 3 salaries per department.",
					order: 5,
				},
			);
			break;

		case "Math":
			questions.push(
				{
					problemId: 7,
					question: "What approach for Reverse Integer?",
					options: JSON.stringify([
						"Math with Overflow Check",
						"String Conversion",
						"Two Pointers",
						"Hash Table",
					]),
					correctAnswer: "Math with Overflow Check",
					explanation:
						"Mathematical approach with overflow checking is most efficient.",
					order: 1,
				},
				{
					problemId: 12,
					question: "Which approach for Integer to Roman?",
					options: JSON.stringify([
						"Hash Table with Greedy",
						"Dynamic Programming",
						"Two Pointers",
						"Stack",
					]),
					correctAnswer: "Hash Table with Greedy",
					explanation:
						"Hash table maps values to symbols, greedy approach uses largest possible values.",
					order: 2,
				},
				{
					problemId: 29,
					question: "What is optimal for Divide Two Integers?",
					options: JSON.stringify([
						"Bit Manipulation with Binary Search",
						"Repeated Subtraction",
						"Two Pointers",
						"Hash Table",
					]),
					correctAnswer: "Bit Manipulation with Binary Search",
					explanation:
						"Bit manipulation with exponential search provides O(log n) time complexity.",
					order: 3,
				},
				{
					problemId: 89,
					question: "Which approach for Gray Code?",
					options: JSON.stringify([
						"Backtracking with Bit Manipulation",
						"Dynamic Programming",
						"Two Pointers",
						"Stack",
					]),
					correctAnswer: "Backtracking with Bit Manipulation",
					explanation:
						"Backtracking generates Gray code sequence using bit manipulation patterns.",
					order: 4,
				},
				{
					problemId: 172,
					question: "What is best for Factorial Trailing Zeroes?",
					options: JSON.stringify([
						"Math with Division",
						"Dynamic Programming",
						"Two Pointers",
						"Hash Table",
					]),
					correctAnswer: "Math with Division",
					explanation:
						"Mathematical approach counts factors of 5 using division.",
					order: 5,
				},
			);
			break;
	}

	return questions;
}
