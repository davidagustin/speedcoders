import { NextResponse } from "next/server";
import { comprehensiveProblems } from "@/lib/data/comprehensive-problems";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const difficulty = url.searchParams.get("difficulty");
    const category = url.searchParams.get("category");
    const algorithm = url.searchParams.get("algorithm");
    const search = url.searchParams.get("search");
    const sortBy = url.searchParams.get("sortBy") || "title";
    const sortOrder = url.searchParams.get("sortOrder") || "asc";
    
    let filteredProblems = [...comprehensiveProblems];
    
    // Apply filters
    if (difficulty && difficulty !== "All") {
      filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty);
    }
    
    if (category && category !== "All") {
      filteredProblems = filteredProblems.filter(p => 
        p.category === category || p.algorithms.includes(category)
      );
    }

    if (algorithm && algorithm !== "All") {
      filteredProblems = filteredProblems.filter(p => p.algorithms.includes(algorithm));
    }

    if (search) {
      filteredProblems = filteredProblems.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.algorithms.some(algo => algo.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Apply sorting
    filteredProblems.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'difficulty':
          const difficultyOrder: Record<string, number> = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          comparison = (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = a.id - b.id;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Apply pagination
    const total = filteredProblems.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProblems = filteredProblems.slice(startIndex, endIndex);

    // Transform to match expected format
    const transformedProblems = paginatedProblems.map(problem => ({
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      category: problem.category,
      description: problem.description,
      leetcodeUrl: problem.leetcodeUrl,
      algorithms: problem.algorithms,
      tags: problem.algorithms // Use algorithms as tags for compatibility
    }));
    
    return NextResponse.json({
      problems: transformedProblems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      categories: [...new Set(comprehensiveProblems.map(p => p.category))],
      algorithms: [...new Set(comprehensiveProblems.flatMap(p => p.algorithms))]
    });
  } catch (error) {
    console.error("Problems API error:", error);
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 });
  }
}
