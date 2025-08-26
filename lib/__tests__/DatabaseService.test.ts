import { DatabaseService } from '../DatabaseService'
import { supabase } from '../supabase'

// Mock Supabase
jest.mock('../supabase')
const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('DatabaseService', () => {
  let dbService: DatabaseService

  beforeEach(() => {
    dbService = new DatabaseService()
    jest.clearAllMocks()
  })

  describe('Problems', () => {
    const mockProblem = {
      id: '1',
      title: 'Two Sum',
      difficulty: 'Easy' as const,
      category: 'Array',
      description: 'Find two numbers that add up to target',
      examples: { input: '[2,7,11,15], 9', output: '[0,1]' },
      constraints: ['2 <= nums.length <= 104'],
      solutions: ['Hash Table', 'Two Pointers'],
      leetcode_url: 'https://leetcode.com/problems/two-sum/',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    describe('getProblems', () => {
      it('should fetch problems successfully', async () => {
        const mockResponse = { data: [mockProblem], error: null }
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockResponse)
          })
        } as any)

        const result = await dbService.getProblems()

        expect(result).toEqual([mockProblem])
        expect(mockSupabase.from).toHaveBeenCalledWith('problems')
      })

      it('should filter by difficulty', async () => {
        const mockResponse = { data: [mockProblem], error: null }
        const mockQuery = {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue(mockResponse)
            })
          })
        }
        mockSupabase.from.mockReturnValue(mockQuery as any)

        await dbService.getProblems({ difficulty: 'Easy' })

        expect(mockQuery.select().eq).toHaveBeenCalledWith('difficulty', 'Easy')
      })

      it('should handle database errors', async () => {
        const mockError = new Error('Database connection failed')
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({ data: null, error: mockError })
          })
        } as any)

        await expect(dbService.getProblems()).rejects.toThrow('Database connection failed')
      })
    })

    describe('getProblemById', () => {
      it('should fetch problem by ID successfully', async () => {
        const mockResponse = { data: [mockProblem], error: null }
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue(mockResponse)
            })
          })
        } as any)

        const result = await dbService.getProblemById('1')

        expect(result).toEqual(mockProblem)
        expect(mockSupabase.from).toHaveBeenCalledWith('problems')
      })

      it('should return null for non-existent problem', async () => {
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null, error: null })
            })
          })
        } as any)

        const result = await dbService.getProblemById('999')

        expect(result).toBeNull()
      })
    })

    describe('createProblem', () => {
      it('should create problem successfully', async () => {
        const newProblem = {
          title: 'New Problem',
          difficulty: 'Medium' as const,
          category: 'String',
          description: 'New problem description',
          examples: {},
          constraints: [],
          solutions: [],
          leetcode_url: 'https://leetcode.com/problems/new-problem/'
        }

        const mockResponse = { data: [{ ...newProblem, id: '2' }], error: null }
        mockSupabase.from.mockReturnValue({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(mockResponse)
          })
        } as any)

        const result = await dbService.createProblem(newProblem)

        expect(result).toEqual({ ...newProblem, id: '2' })
        expect(mockSupabase.from).toHaveBeenCalledWith('problems')
      })

      it('should handle creation errors', async () => {
        const newProblem = {
          title: 'New Problem',
          difficulty: 'Medium' as const,
          category: 'String',
          description: 'New problem description',
          examples: {},
          constraints: [],
          solutions: [],
          leetcode_url: 'https://leetcode.com/problems/new-problem/'
        }

        const mockError = new Error('Validation failed')
        mockSupabase.from.mockReturnValue({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({ data: null, error: mockError })
          })
        } as any)

        await expect(dbService.createProblem(newProblem)).rejects.toThrow('Validation failed')
      })
    })
  })

  describe('Algorithms', () => {
    const mockAlgorithm = {
      id: '1',
      name: 'Two Pointers',
      category: 'Array',
      description: 'Use two pointers to traverse array',
      time_complexity: 'O(n)',
      space_complexity: 'O(1)',
      created_at: '2024-01-01'
    }

    describe('getAlgorithms', () => {
      it('should fetch algorithms successfully', async () => {
        const mockResponse = { data: [mockAlgorithm], error: null }
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockResolvedValue(mockResponse)
        } as any)

        const result = await dbService.getAlgorithms()

        expect(result).toEqual([mockAlgorithm])
        expect(mockSupabase.from).toHaveBeenCalledWith('algorithms')
      })
    })

    describe('createAlgorithm', () => {
      it('should create algorithm successfully', async () => {
        const newAlgorithm = {
          name: 'Binary Search',
          category: 'Search',
          description: 'Efficient search in sorted array',
          time_complexity: 'O(log n)',
          space_complexity: 'O(1)'
        }

        const mockResponse = { data: [{ ...newAlgorithm, id: '2' }], error: null }
        mockSupabase.from.mockReturnValue({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(mockResponse)
          })
        } as any)

        const result = await dbService.createAlgorithm(newAlgorithm)

        expect(result).toEqual({ ...newAlgorithm, id: '2' })
      })
    })
  })

  describe('Quiz Operations', () => {
    const mockQuiz = {
      id: '1',
      title: 'Array Basics',
      description: 'Basic array problems',
      time_limit: 15,
      difficulty: 'Easy' as const,
      category: 'Array',
      created_by: 'user1',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    describe('createQuiz', () => {
      it('should create quiz successfully', async () => {
        const newQuiz = {
          title: 'New Quiz',
          description: 'New quiz description',
          time_limit: 20,
          difficulty: 'Medium' as const,
          category: 'String',
          created_by: 'user1'
        }

        const mockResponse = { data: [{ ...newQuiz, id: '2' }], error: null }
        mockSupabase.from.mockReturnValue({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(mockResponse)
          })
        } as any)

        const result = await dbService.createQuiz(newQuiz)

        expect(result).toEqual({ ...newQuiz, id: '2' })
      })
    })

    describe('getQuizAttempts', () => {
      it('should fetch quiz attempts for user', async () => {
        const mockAttempt = {
          id: '1',
          quiz_id: '1',
          user_id: 'user1',
          score: 8,
          total_questions: 10,
          time_taken: 900,
          completed_at: '2024-01-01',
          created_at: '2024-01-01'
        }

        const mockResponse = { data: [mockAttempt], error: null }
        mockSupabase.from.mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue(mockResponse)
            })
          })
        } as any)

        const result = await dbService.getQuizAttempts('user1')

        expect(result).toEqual([mockAttempt])
      })
    })

    describe('createQuizAttempt', () => {
      it('should create quiz attempt successfully', async () => {
        const newAttempt = {
          quiz_id: '1',
          user_id: 'user1',
          score: 7,
          total_questions: 10,
          time_taken: 1200
        }

        const mockResponse = { data: [{ ...newAttempt, id: '1' }], error: null }
        mockSupabase.from.mockReturnValue({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(mockResponse)
          })
        } as any)

        const result = await dbService.createQuizAttempt(newAttempt)

        expect(result).toEqual({ ...newAttempt, id: '1' })
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Network error')
      })

      await expect(dbService.getProblems()).rejects.toThrow('Network error')
    })

    it('should handle malformed responses', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue({ data: null, error: null })
        })
      } as any)

      const result = await dbService.getProblems()
      expect(result).toEqual([])
    })

    it('should validate required fields', async () => {
      const invalidProblem = {
        // Missing required fields
        description: 'Test'
      } as any

      await expect(dbService.createProblem(invalidProblem)).rejects.toThrow()
    })
  })

  describe('Caching Integration', () => {
    it('should work with cache layer', async () => {
      const mockResponse = { data: [mockProblem], error: null }
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockResponse)
        })
      } as any)

      // First call
      const result1 = await dbService.getProblems()
      expect(result1).toEqual([mockProblem])

      // Second call should use same service
      const result2 = await dbService.getProblems()
      expect(result2).toEqual([mockProblem])
      expect(mockSupabase.from).toHaveBeenCalledTimes(2)
    })
  })
})