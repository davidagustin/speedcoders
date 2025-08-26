import { NextResponse } from 'next/server'
import { editorialProblems } from '@/lib/editorial-problems'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const difficulty = searchParams.get('difficulty')
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    let filteredProblems = editorialProblems

    // Filter by difficulty
    if (difficulty && difficulty !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty)
    }

    // Filter by category
    if (category && category !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.category === category)
    }

    // Apply pagination
    const paginatedProblems = filteredProblems.slice(offset, offset + limit)

    // Get statistics
    const stats = {
      total: editorialProblems.length,
      easy: editorialProblems.filter(p => p.difficulty === 'Easy').length,
      medium: editorialProblems.filter(p => p.difficulty === 'Medium').length,
      hard: editorialProblems.filter(p => p.difficulty === 'Hard').length,
      categories: [...new Set(editorialProblems.map(p => p.category))].sort(),
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

    let filteredProblems = editorialProblems

    // Search by title or description
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filteredProblems = filteredProblems.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
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
          p.solutions.some(s => 
            filters.algorithms.some((alg: string) => 
              s.name.toLowerCase().includes(alg.toLowerCase())
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
