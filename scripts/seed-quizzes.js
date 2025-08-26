const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const quizzes = [
	{
		title: "Array Fundamentals",
		description:
			"Master the basics of array manipulation with these essential problems.",
		timeLimit: 30,
		difficulty: "Easy",
		category: "Array",
		questions: [
			"Two Sum",
			"Contains Duplicate",
			"Best Time to Buy and Sell Stock",
		],
	},
	{
		title: "Array Advanced",
		description:
			"Tackle more complex array problems requiring advanced techniques.",
		timeLimit: 45,
		difficulty: "Medium",
		category: "Array",
		questions: ["Product of Array Except Self", "Maximum Subarray"],
	},
	{
		title: "String Manipulation",
		description: "Learn essential string processing techniques and algorithms.",
		timeLimit: 40,
		difficulty: "Mixed",
		category: "String",
		questions: [
			"Valid Parentheses",
			"Longest Substring Without Repeating Characters",
		],
	},
	{
		title: "Linked List Basics",
		description: "Understand linked list operations and common patterns.",
		timeLimit: 35,
		difficulty: "Easy",
		category: "Linked List",
		questions: ["Reverse Linked List", "Linked List Cycle"],
	},
	{
		title: "Tree Traversal",
		description:
			"Master different tree traversal techniques and tree-based algorithms.",
		timeLimit: 50,
		difficulty: "Mixed",
		category: "Tree",
		questions: ["Maximum Depth of Binary Tree", "Validate Binary Search Tree"],
	},
	{
		title: "Dynamic Programming Intro",
		description: "Introduction to dynamic programming with classic problems.",
		timeLimit: 60,
		difficulty: "Mixed",
		category: "Dynamic Programming",
		questions: ["Climbing Stairs", "House Robber"],
	},
	{
		title: "Graph Algorithms",
		description: "Explore graph traversal and search algorithms.",
		timeLimit: 55,
		difficulty: "Medium",
		category: "Graph",
		questions: ["Number of Islands"],
	},
	{
		title: "Hash Table Problems",
		description: "Learn to use hash tables effectively for various problems.",
		timeLimit: 45,
		difficulty: "Medium",
		category: "Hash Table",
		questions: ["Group Anagrams"],
	},
	{
		title: "Two Pointers Technique",
		description:
			"Master the two pointers technique for efficient array and string problems.",
		timeLimit: 40,
		difficulty: "Medium",
		category: "Two Pointers",
		questions: ["Container With Most Water"],
	},
	{
		title: "Binary Search Practice",
		description: "Practice binary search on sorted arrays and variations.",
		timeLimit: 30,
		difficulty: "Easy",
		category: "Binary Search",
		questions: ["Binary Search"],
	},
	{
		title: "Stack Operations",
		description: "Learn stack-based problem solving and data structure design.",
		timeLimit: 35,
		difficulty: "Medium",
		category: "Stack",
		questions: ["Min Stack"],
	},
	{
		title: "Sliding Window Advanced",
		description:
			"Advanced sliding window problems for string and array manipulation.",
		timeLimit: 60,
		difficulty: "Hard",
		category: "Sliding Window",
		questions: ["Minimum Window Substring"],
	},
	{
		title: "Mixed Easy Problems",
		description:
			"A collection of easy problems across different categories to build confidence.",
		timeLimit: 45,
		difficulty: "Easy",
		category: "Mixed",
		questions: [
			"Two Sum",
			"Contains Duplicate",
			"Valid Parentheses",
			"Reverse Linked List",
			"Maximum Depth of Binary Tree",
			"Climbing Stairs",
			"Binary Search",
		],
	},
	{
		title: "Mixed Medium Problems",
		description:
			"Medium difficulty problems covering various algorithms and data structures.",
		timeLimit: 90,
		difficulty: "Medium",
		category: "Mixed",
		questions: [
			"Product of Array Except Self",
			"Maximum Subarray",
			"Longest Substring Without Repeating Characters",
			"Validate Binary Search Tree",
			"House Robber",
			"Number of Islands",
			"Group Anagrams",
			"Container With Most Water",
			"Min Stack",
		],
	},
	{
		title: "Interview Preparation",
		description:
			"A comprehensive quiz covering common interview problems across all difficulty levels.",
		timeLimit: 120,
		difficulty: "Mixed",
		category: "Interview",
		questions: [
			"Two Sum",
			"Valid Parentheses",
			"Reverse Linked List",
			"Maximum Depth of Binary Tree",
			"Product of Array Except Self",
			"House Robber",
			"Number of Islands",
			"Group Anagrams",
			"Container With Most Water",
			"Binary Search",
		],
	},
];

async function seedQuizzes() {
	console.log("🌱 Starting to seed quizzes...");

	try {
		// Get a default user for creating quizzes
		const users = await prisma.user.findMany();
		if (users.length === 0) {
			console.log("❌ No users found. Please create a user first.");
			return;
		}
		const defaultUserId = users[0].id;

		for (const quizData of quizzes) {
			// Check if quiz already exists
			const existingQuiz = await prisma.quiz.findFirst({
				where: { title: quizData.title },
			});

			if (existingQuiz) {
				console.log(`⏭️  Skipping "${quizData.title}" - already exists`);
				continue;
			}

			// Create the quiz
			const quiz = await prisma.quiz.create({
				data: {
					title: quizData.title,
					description: quizData.description,
					timeLimit: quizData.timeLimit,
					difficulty: quizData.difficulty,
					category: quizData.category,
					createdBy: defaultUserId,
					isActive: true,
				},
			});

			console.log(`✅ Created quiz: "${quiz.title}"`);

			// Add questions to the quiz
			for (let i = 0; i < quizData.questions.length; i++) {
				const questionTitle = quizData.questions[i];

				// Find the problem
				const problem = await prisma.problem.findUnique({
					where: { title: questionTitle },
				});

				if (problem) {
					await prisma.quizQuestion.create({
						data: {
							quizId: quiz.id,
							problemId: problem.id,
							order: i + 1,
						},
					});
					console.log(`  📝 Added question: "${questionTitle}"`);
				} else {
					console.log(`  ⚠️  Problem not found: "${questionTitle}"`);
				}
			}
		}

		console.log("🎉 Quiz seeding completed!");

		// Print summary
		const totalQuizzes = await prisma.quiz.count();
		const activeQuizzes = await prisma.quiz.count({
			where: { isActive: true },
		});
		const difficulties = await prisma.quiz.groupBy({
			by: ["difficulty"],
			_count: {
				difficulty: true,
			},
		});

		console.log("\n📊 Summary:");
		console.log(`Total Quizzes: ${totalQuizzes}`);
		console.log(`Active Quizzes: ${activeQuizzes}`);
		console.log("By Difficulty:");
		difficulties.forEach((diff) => {
			console.log(`  ${diff.difficulty}: ${diff._count.difficulty}`);
		});

		// Show questions per quiz
		const quizzesWithQuestions = await prisma.quiz.findMany({
			include: {
				questions: {
					include: {
						problem: true,
					},
					orderBy: {
						order: "asc",
					},
				},
			},
		});

		console.log("\n📋 Quizzes with Questions:");
		quizzesWithQuestions.forEach((quiz) => {
			console.log(
				`\n${quiz.title} (${quiz.difficulty} - ${quiz.timeLimit}min):`,
			);
			quiz.questions.forEach((q) => {
				console.log(
					`  ${q.order}. ${q.problem.title} (${q.problem.difficulty})`,
				);
			});
		});
	} catch (error) {
		console.error("❌ Error seeding quizzes:", error);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the seeding
seedQuizzes();
