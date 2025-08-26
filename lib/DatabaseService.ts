import { supabase } from './supabase'
import type { Database } from './supabase'

type Problem = Database['public']['Tables']['problems']['Row']
type Algorithm = Database['public']['Tables']['algorithms']['Row']
type Quiz = Database['public']['Tables']['quizzes']['Row']
type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row']

interface GetProblemsOptions {
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  category?: string
  limit?: number
}

export class DatabaseService {
  async getProblems(options: GetProblemsOptions = {}): Promise<Problem[]> {
    try {
      let query = supabase.from('problems').select('*')
      
      if (options.difficulty) {
        query = query.eq('difficulty', options.difficulty)
      }
      
      if (options.category) {
        query = query.eq('category', options.category)
      }
      
      const { data, error } = await query.limit(options.limit || 50)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching problems:', error)
      throw error
    }
  }

  async getProblemById(id: string): Promise<Problem | null> {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching problem:', error)
      return null
    }
  }

  async createProblem(problem: Database['public']['Tables']['problems']['Insert']): Promise<Problem> {
    try {
      // Validate required fields
      if (!problem.title || !problem.difficulty || !problem.category || !problem.description) {
        throw new Error('Missing required fields: title, difficulty, category, description')
      }

      const { data, error } = await supabase
        .from('problems')
        .insert([problem])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating problem:', error)
      throw error
    }
  }

  async getAlgorithms(): Promise<Algorithm[]> {
    try {
      const { data, error } = await supabase
        .from('algorithms')
        .select('*')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching algorithms:', error)
      throw error
    }
  }

  async createAlgorithm(algorithm: Database['public']['Tables']['algorithms']['Insert']): Promise<Algorithm> {
    try {
      const { data, error } = await supabase
        .from('algorithms')
        .insert([algorithm])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating algorithm:', error)
      throw error
    }
  }

  async createQuiz(quiz: Database['public']['Tables']['quizzes']['Insert']): Promise<Quiz> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert([quiz])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating quiz:', error)
      throw error
    }
  }

  async getQuizAttempts(userId: string): Promise<QuizAttempt[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching quiz attempts:', error)
      throw error
    }
  }

  async createQuizAttempt(attempt: Database['public']['Tables']['quiz_attempts']['Insert']): Promise<QuizAttempt> {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert([attempt])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating quiz attempt:', error)
      throw error
    }
  }
}