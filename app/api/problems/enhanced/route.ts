import { NextResponse } from 'next/server'
import { comprehensiveProblems } from '@/lib/data/comprehensive-problems'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get('difficulty')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredProblems = comprehensiveProblems

    // Apply filters
    if (difficulty && difficulty !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty)
    }

    if (category && category !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.category === category || p.algorithms.includes(category))
    }

    if (search) {
      filteredProblems = filteredProblems.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.algorithms.some(algo => algo.toLowerCase().includes(search.toLowerCase()))
      )
    }

    // Apply pagination
    const paginatedProblems = filteredProblems.slice(offset, offset + limit)

    // Get statistics
    const stats = {
      total: comprehensiveProblems.length,
      easy: comprehensiveProblems.filter(p => p.difficulty === 'Easy').length,
      medium: comprehensiveProblems.filter(p => p.difficulty === 'Medium').length,
      hard: comprehensiveProblems.filter(p => p.difficulty === 'Hard').length,
      categories: [...new Set(comprehensiveProblems.map(p => p.category))].sort(),
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
    console.error('Error fetching enhanced problems:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch problems' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { searchTerm, filters } = body

    let filteredProblems = comprehensiveProblems

    // Search by title, description, or category
    if (searchTerm) {
      filteredProblems = filteredProblems.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.algorithms.some(algo => algo.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply additional filters
    if (filters) {
      if (filters.difficulty && filters.difficulty !== 'All') {
        filteredProblems = filteredProblems.filter(p => p.difficulty === filters.difficulty)
      }
      if (filters.category && filters.category !== 'All') {
        filteredProblems = filteredProblems.filter(p => p.category === filters.category)
      }
      if (filters.algorithms && filters.algorithms.length > 0) {
        filteredProblems = filteredProblems.filter(p => 
          p.algorithms.some(algo => 
            filters.algorithms.some((alg: string) => 
              algo.toLowerCase().includes(alg.toLowerCase())
            )
          )
        )
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        problems: filteredProblems,
        count: filteredProblems.length
      }
    })
  } catch (error) {
    console.error('Error searching problems:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search problems' },
      { status: 500 }
    )
  }
}
