const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function showDatabaseStatus() {
	console.log("📊 SpeedCoders Database Status Report\n");

	try {
		// Get counts
		const totalUsers = await prisma.user.count();
		const totalProblems = await prisma.problem.count();
		const totalAlgorithms = await prisma.algorithm.count();
		const totalQuizzes = await prisma.quiz.count();
		const totalQuizQuestions = await prisma.quizQuestion.count();

		// Get problems by difficulty
		const problemsByDifficulty = await prisma.problem.groupBy({
			by: ["difficulty"],
			_count: {
				difficulty: true,
			},
		});

		// Get problems by category
		const problemsByCategory = await prisma.algorithm.groupBy({
			by: ["category"],
			_count: {
				category: true,
			},
		});

		// Get quizzes by difficulty
		const quizzesByDifficulty = await prisma.quiz.groupBy({
			by: ["difficulty"],
			_count: {
				difficulty: true,
			},
		});

		// Get quizzes by category
		const quizzesByCategory = await prisma.quiz.groupBy({
			by: ["category"],
			_count: {
				category: true,
			},
		});

		console.log("🎯 Overall Statistics:");
		console.log(`👥 Users: ${totalUsers}`);
		console.log(`📝 Problems: ${totalProblems}`);
		console.log(`🧮 Algorithms: ${totalAlgorithms}`);
		console.log(`📋 Quizzes: ${totalQuizzes}`);
		console.log(`❓ Quiz Questions: ${totalQuizQuestions}\n`);

		console.log("📝 Problems by Difficulty:");
		problemsByDifficulty.forEach((diff) => {
			console.log(`  ${diff.difficulty}: ${diff._count.difficulty}`);
		});
		console.log("");

		console.log("🧮 Algorithms by Category:");
		problemsByCategory.forEach((cat) => {
			console.log(`  ${cat.category}: ${cat._count.category}`);
		});
		console.log("");

		console.log("📋 Quizzes by Difficulty:");
		quizzesByDifficulty.forEach((diff) => {
			console.log(`  ${diff.difficulty}: ${diff._count.difficulty}`);
		});
		console.log("");

		console.log("📋 Quizzes by Category:");
		quizzesByCategory.forEach((cat) => {
			console.log(`  ${cat.category}: ${cat._count.category}`);
		});
		console.log("");

		// Show sample problems
		console.log("📝 Sample Problems:");
		const sampleProblems = await prisma.problem.findMany({
			take: 5,
			orderBy: {
				difficulty: "asc",
			},
		});
		sampleProblems.forEach((problem, index) => {
			console.log(
				`  ${index + 1}. ${problem.title} (${problem.difficulty} - ${problem.category})`,
			);
		});
		console.log("");

		// Show sample quizzes
		console.log("📋 Sample Quizzes:");
		const sampleQuizzes = await prisma.quiz.findMany({
			take: 5,
			orderBy: {
				difficulty: "asc",
			},
			include: {
				questions: {
					include: {
						problem: true,
					},
				},
			},
		});
		sampleQuizzes.forEach((quiz, index) => {
			console.log(
				`  ${index + 1}. ${quiz.title} (${quiz.difficulty} - ${quiz.timeLimit}min)`,
			);
			console.log(`     Questions: ${quiz.questions.length}`);
			console.log(`     Category: ${quiz.category}`);
		});
		console.log("");

		// Show users
		console.log("👥 Users:");
		const users = await prisma.user.findMany({
			take: 5,
		});
		users.forEach((user, index) => {
			console.log(`  ${index + 1}. ${user.email} (${user.name || "No name"})`);
		});
		console.log("");

		console.log("🎉 Database is ready for use!");
		console.log("🚀 You can now:");
		console.log("  1. Register new users");
		console.log("  2. Start taking quizzes");
		console.log("  3. Practice with different problem categories");
		console.log("  4. Track progress and performance");
	} catch (error) {
		console.error("❌ Error getting database status:", error);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the status report
showDatabaseStatus();
