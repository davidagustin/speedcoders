import { NextResponse } from "next/server";
import { comprehensiveProblems } from "@/lib/data/comprehensive-problems";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const difficulty = url.searchParams.get("difficulty");
    const category = url.searchParams.get("category");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    
    let filteredProblems = [...comprehensiveProblems];
    
    if (difficulty && difficulty !== "All") {
      filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty);
    }
    
    if (category && category !== "All") {
      filteredProblems = filteredProblems.filter(p => 
        p.algorithms.includes(category) || p.category === category
      );
    }
    
    const paginatedProblems = filteredProblems.slice(0, limit);
    
    return NextResponse.json({
      problems: paginatedProblems,
      total: filteredProblems.length,
      categories: [...new Set(comprehensiveProblems.map(p => p.category))],
      algorithms: [...new Set(comprehensiveProblems.flatMap(p => p.algorithms))]
    });
  } catch (error) {
    console.error("Problems API error:", error);
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 });
  }
}
