import { NextRequest, NextResponse } from 'next/server'
import { 
  systemDesignProblems, 
  getSystemDesignProblemsByDifficulty, 
  getSystemDesignProblemsByCategory,
  searchSystemDesignProblems 
} from '@/lib/data/system-design-problems'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get('difficulty')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let filteredProblems = systemDesignProblems

    // Apply filters
    if (difficulty && difficulty !== 'all') {
      filteredProblems = getSystemDesignProblemsByDifficulty(difficulty as 'Easy' | 'Medium' | 'Hard')
    }

    if (category && category !== 'all') {
      filteredProblems = filteredProblems.filter(p => p.category === category)
    }

    if (search) {
      filteredProblems = searchSystemDesignProblems(search)
    }

    // Apply pagination
    const paginatedProblems = filteredProblems.slice(offset, offset + limit)

    // Get statistics
    const stats = {
      total: systemDesignProblems.length,
      easy: systemDesignProblems.filter(p => p.difficulty === 'Easy').length,
      medium: systemDesignProblems.filter(p => p.difficulty === 'Medium').length,
      hard: systemDesignProblems.filter(p => p.difficulty === 'Hard').length,
      categories: [...new Set(systemDesignProblems.map(p => p.category))],
      technologies: [...new Set(systemDesignProblems.flatMap(p => p.technologies))],
      filtered: filteredProblems.length,
      returned: paginatedProblems.length
    }

    return NextResponse.json({
      success: true,
      data: {
        problems: paginatedProblems,
        stats,
        pagination: {
          limit,
          offset,
          total: filteredProblems.length,
          hasMore: offset + limit < filteredProblems.length
        }
      }
    })
  } catch (error) {
    console.error('Error fetching system design problems:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch system design problems' },
      { status: 500 }
    )
  }
}
