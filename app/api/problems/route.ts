import { type NextRequest, NextResponse } from "next/server";
import { comprehensiveProblems } from "@/lib/data/comprehensive-problems";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const difficulty = searchParams.get("difficulty");
		const category = searchParams.get("category");
		const search = searchParams.get("search");
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "20", 10);
		const offset = (page - 1) * limit;

		let filteredProblems = comprehensiveProblems;

		// Apply filters
		if (difficulty && difficulty !== "All") {
			filteredProblems = filteredProblems.filter(
				(p) => p.difficulty === difficulty,
			);
		}

		if (category && category !== "All") {
			filteredProblems = filteredProblems.filter(
				(p) => p.category === category || p.algorithms.includes(category),
			);
		}

		if (search) {
			filteredProblems = filteredProblems.filter(
				(p) =>
					p.title.toLowerCase().includes(search.toLowerCase()) ||
					p.description.toLowerCase().includes(search.toLowerCase()) ||
					p.category.toLowerCase().includes(search.toLowerCase()) ||
					p.algorithms.some((algo) =>
						algo.toLowerCase().includes(search.toLowerCase()),
					),
			);
		}

		// Apply pagination
		const paginatedProblems = filteredProblems.slice(offset, offset + limit);

		// Get statistics
		const stats = {
			total: comprehensiveProblems.length,
			easy: comprehensiveProblems.filter((p) => p.difficulty === "Easy").length,
			medium: comprehensiveProblems.filter((p) => p.difficulty === "Medium")
				.length,
			hard: comprehensiveProblems.filter((p) => p.difficulty === "Hard").length,
			categories: [
				...new Set(comprehensiveProblems.map((p: any) => p.category)),
			],
			algorithms: [
				...new Set(comprehensiveProblems.flatMap((p: any) => p.algorithms)),
			],
			filtered: filteredProblems.length,
			returned: paginatedProblems.length,
		};

		return NextResponse.json({
			success: true,
			data: {
				problems: paginatedProblems,
				stats,
				pagination: {
					limit,
					offset,
					total: filteredProblems.length,
					hasMore: offset + limit < filteredProblems.length,
				},
			},
		});
	} catch (error) {
		console.error("Error fetching problems:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch problems" },
			{ status: 500 },
		);
	}
}
