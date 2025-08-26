import { CacheService } from './CacheService'
import { RateLimiter } from './RateLimiter'

export interface CodeReview {
  id: string
  problemId: string
  userId: string
  code: string
  language: string
  timestamp: string
  feedback: CodeFeedback
  score: number
}

export interface CodeFeedback {
  overall: OverallFeedback
  suggestions: CodeSuggestion[]
  optimizations: OptimizationSuggestion[]
  bugs: BugReport[]
  style: StyleFeedback[]
  complexity: ComplexityAnalysis
  testCases: TestCaseSuggestion[]
}

export interface OverallFeedback {
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  score: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  nextSteps: string[]
}

export interface CodeSuggestion {
  id: string
  type: 'algorithm' | 'logic' | 'efficiency' | 'best_practice'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  example?: string
  line?: number
  column?: number
  suggestedFix?: string
}

export interface OptimizationSuggestion {
  id: string
  type: 'time_complexity' | 'space_complexity' | 'readability' | 'performance'
  title: string
  description: string
  currentComplexity: string
  suggestedComplexity: string
  impact: 'low' | 'medium' | 'high'
  implementation: string
}

export interface BugReport {
  id: string
  type: 'logic_error' | 'runtime_error' | 'edge_case' | 'off_by_one'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  line: number
  column?: number
  suggestedFix: string
  testCase?: string
}

export interface StyleFeedback {
  id: string
  type: 'naming' | 'formatting' | 'comments' | 'structure'
  title: string
  description: string
  line?: number
  before: string
  after: string
}

export interface ComplexityAnalysis {
  timeComplexity: {
    current: string
    optimal: string
    analysis: string
  }
  spaceComplexity: {
    current: string
    optimal: string
    analysis: string
  }
  cyclomatic: number
  maintainability: 'excellent' | 'good' | 'fair' | 'poor'
}

export interface TestCaseSuggestion {
  id: string
  type: 'edge_case' | 'boundary' | 'stress' | 'corner_case'
  description: string
  input: any
  expectedOutput: any
  reasoning: string
}

export interface HintRequest {
  problemId: string
  userId: string
  code: string
  language: string
  hintLevel: 'gentle' | 'moderate' | 'direct'
  specificArea?: 'algorithm' | 'implementation' | 'optimization' | 'debugging'
}

export interface Hint {
  id: string
  level: 'gentle' | 'moderate' | 'direct'
  type: 'algorithm' | 'implementation' | 'optimization' | 'debugging'
  title: string
  content: string
  followUp?: string[]
  codeExample?: string
  relatedConcepts: string[]
}

export class AICodeReviewer {
  private cache = CacheService.getInstance()
  private rateLimiter = new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5 // Max 5 reviews per minute per user
  })

  async reviewCode(
    problemId: string,
    userId: string,
    code: string,
    language: string
  ): Promise<CodeReview> {
    try {
      // Check rate limit
      const { allowed } = await this.rateLimiter.checkLimit(`review:${userId}`)
      if (!allowed) {
        throw new Error('Rate limit exceeded. Please wait before requesting another review.')
      }

      // Check cache for identical code
      const cacheKey = `review:${problemId}:${this.hashCode(code)}`
      const cached = await this.cache.get<CodeReview>(cacheKey)
      if (cached) {
        return { ...cached, userId, timestamp: new Date().toISOString() }
      }

      // Generate comprehensive review
      const feedback = await this.generateFeedback(problemId, code, language)
      const score = this.calculateScore(feedback)

      const review: CodeReview = {
        id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        problemId,
        userId,
        code,
        language,
        timestamp: new Date().toISOString(),
        feedback,
        score
      }

      // Cache the review
      await this.cache.set(cacheKey, review, 3600) // 1 hour

      return review
    } catch (error) {
      console.error('Error reviewing code:', error)
      throw error
    }
  }

  async getHint(request: HintRequest): Promise<Hint> {
    try {
      // Check rate limit
      const { allowed } = await this.rateLimiter.checkLimit(`hint:${request.userId}`)
      if (!allowed) {
        throw new Error('Rate limit exceeded. Please wait before requesting another hint.')
      }

      // Generate contextual hint
      return await this.generateHint(request)
    } catch (error) {
      console.error('Error generating hint:', error)
      throw error
    }
  }

  async analyzeComplexity(code: string, language: string): Promise<ComplexityAnalysis> {
    try {
      return await this.performComplexityAnalysis(code, language)
    } catch (error) {
      console.error('Error analyzing complexity:', error)
      throw error
    }
  }

  async suggestOptimizations(
    problemId: string,
    code: string,
    language: string
  ): Promise<OptimizationSuggestion[]> {
    try {
      const cacheKey = `optimizations:${problemId}:${this.hashCode(code)}`
      const cached = await this.cache.get<OptimizationSuggestion[]>(cacheKey)
      if (cached) return cached

      const optimizations = await this.generateOptimizations(problemId, code, language)
      
      // Cache for 30 minutes
      await this.cache.set(cacheKey, optimizations, 1800)
      
      return optimizations
    } catch (error) {
      console.error('Error suggesting optimizations:', error)
      return []
    }
  }

  private async generateFeedback(
    problemId: string,
    code: string,
    language: string
  ): Promise<CodeFeedback> {
    // In a real implementation, this would call an AI service like OpenAI GPT-4
    // For now, we'll simulate intelligent feedback generation
    
    await this.simulateProcessingDelay()

    const codeAnalysis = this.analyzeCodeStructure(code, language)
    const problemContext = await this.getProblemContext(problemId)

    return {
      overall: this.generateOverallFeedback(code, codeAnalysis, problemContext),
      suggestions: this.generateSuggestions(code, language, codeAnalysis),
      optimizations: await this.generateOptimizations(problemId, code, language),
      bugs: this.detectBugs(code, language),
      style: this.analyzeStyle(code, language),
      complexity: await this.performComplexityAnalysis(code, language),
      testCases: this.suggestTestCases(problemId, code)
    }
  }

  private async generateHint(request: HintRequest): Promise<Hint> {
    await this.simulateProcessingDelay()

    const problemContext = await this.getProblemContext(request.problemId)
    const codeAnalysis = this.analyzeCodeStructure(request.code, request.language)

    // Simulate AI-generated hints based on context
    const hints = this.getContextualHints(
      problemContext,
      codeAnalysis,
      request.hintLevel,
      request.specificArea
    )

    return hints[0] || this.getDefaultHint(request.hintLevel)
  }

  private generateOverallFeedback(
    code: string,
    analysis: any,
    problemContext: any
  ): OverallFeedback {
    // Simulate AI analysis
    const hasCorrectAlgorithm = analysis.algorithmDetected
    const hasGoodStructure = analysis.structureScore > 7
    const hasOptimalComplexity = analysis.complexityScore > 8

    let score = 70 // Base score
    let grade: OverallFeedback['grade'] = 'C'
    
    if (hasCorrectAlgorithm) score += 15
    if (hasGoodStructure) score += 10
    if (hasOptimalComplexity) score += 5

    if (score >= 95) grade = 'A'
    else if (score >= 85) grade = 'B'
    else if (score >= 70) grade = 'C'
    else if (score >= 60) grade = 'D'
    else grade = 'F'

    const strengths = []
    const weaknesses = []
    const nextSteps = []

    if (hasCorrectAlgorithm) {
      strengths.push('Correct algorithm approach')
    } else {
      weaknesses.push('Algorithm approach could be improved')
      nextSteps.push('Review the optimal algorithm for this problem type')
    }

    if (hasGoodStructure) {
      strengths.push('Well-structured and readable code')
    } else {
      weaknesses.push('Code structure needs improvement')
      nextSteps.push('Break down complex logic into smaller functions')
    }

    return {
      grade,
      score,
      summary: `Your solution demonstrates ${hasCorrectAlgorithm ? 'good' : 'partial'} understanding of the problem. ${
        hasGoodStructure ? 'Code is well-structured.' : 'Consider improving code organization.'
      }`,
      strengths,
      weaknesses,
      nextSteps
    }
  }

  private generateSuggestions(
    code: string,
    language: string,
    analysis: any
  ): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = []

    // Simulate intelligent suggestions
    if (code.includes('for') && code.includes('for')) {
      suggestions.push({
        id: 'nested_loops',
        type: 'efficiency',
        severity: 'medium',
        title: 'Nested Loops Detected',
        description: 'Consider if the nested loops are necessary. Sometimes a hash map can reduce complexity.',
        example: 'Use Map/Set for O(1) lookups instead of nested iterations',
        suggestedFix: 'Replace inner loop with hash map lookup'
      })
    }

    if (!code.includes('//') && !code.includes('/*')) {
      suggestions.push({
        id: 'missing_comments',
        type: 'best_practice',
        severity: 'low',
        title: 'Add Comments',
        description: 'Consider adding comments to explain complex logic',
        suggestedFix: 'Add inline comments for key algorithmic steps'
      })
    }

    if (language === 'javascript' && !code.includes('const') && !code.includes('let')) {
      suggestions.push({
        id: 'var_declaration',
        type: 'best_practice',
        severity: 'medium',
        title: 'Use Modern Variable Declarations',
        description: 'Use const/let instead of var for better scoping',
        suggestedFix: 'Replace var with const for immutable values, let for mutable ones'
      })
    }

    return suggestions
  }

  private async generateOptimizations(
    problemId: string,
    code: string,
    language: string
  ): Promise<OptimizationSuggestion[]> {
    const optimizations: OptimizationSuggestion[] = []

    // Simulate AI-powered optimization suggestions
    if (code.includes('sort()') || code.includes('sorted(')) {
      optimizations.push({
        id: 'unnecessary_sort',
        type: 'time_complexity',
        title: 'Avoid Unnecessary Sorting',
        description: 'Sorting adds O(n log n) complexity. Consider if you can solve without sorting.',
        currentComplexity: 'O(n log n)',
        suggestedComplexity: 'O(n)',
        impact: 'high',
        implementation: 'Use hash map for counting or finding duplicates instead of sorting'
      })
    }

    if (code.includes('slice(') || code.includes('substring(')) {
      optimizations.push({
        id: 'string_operations',
        type: 'space_complexity',
        title: 'Optimize String Operations',
        description: 'String slicing creates new objects. Consider using indices instead.',
        currentComplexity: 'O(n) space for each slice',
        suggestedComplexity: 'O(1) space with indices',
        impact: 'medium',
        implementation: 'Use start/end indices instead of creating substrings'
      })
    }

    return optimizations
  }

  private detectBugs(code: string, language: string): BugReport[] {
    const bugs: BugReport[] = []

    // Simulate bug detection
    if (code.includes('for (let i = 0; i <= ')) {
      bugs.push({
        id: 'off_by_one',
        type: 'off_by_one',
        severity: 'high',
        title: 'Potential Off-by-One Error',
        description: 'Using <= in loop condition might cause array index out of bounds',
        line: this.findLineNumber(code, 'for (let i = 0; i <= '),
        suggestedFix: 'Change <= to < in loop condition',
        testCase: 'Test with array of length 1'
      })
    }

    if (code.includes('parseInt(') && !code.includes(', 10')) {
      bugs.push({
        id: 'parseint_radix',
        type: 'logic_error',
        severity: 'medium',
        title: 'Missing Radix in parseInt',
        description: 'parseInt without radix can lead to unexpected behavior',
        line: this.findLineNumber(code, 'parseInt('),
        suggestedFix: 'Add radix parameter: parseInt(value, 10)'
      })
    }

    return bugs
  }

  private analyzeStyle(code: string, language: string): StyleFeedback[] {
    const styleIssues: StyleFeedback[] = []

    // Check naming conventions
    const varRegex = /\b[a-z]+[A-Z]/g
    const camelCaseVars = code.match(varRegex) || []
    
    if (language === 'python' && camelCaseVars.length > 0) {
      styleIssues.push({
        id: 'python_naming',
        type: 'naming',
        title: 'Python Naming Convention',
        description: 'Python prefers snake_case for variable names',
        before: camelCaseVars[0] || 'camelCase',
        after: 'snake_case'
      })
    }

    // Check for long lines
    const lines = code.split('\n')
    const longLines = lines.filter(line => line.length > 100)
    
    if (longLines.length > 0) {
      styleIssues.push({
        id: 'long_lines',
        type: 'formatting',
        title: 'Long Lines',
        description: 'Consider breaking long lines for better readability',
        line: lines.findIndex(line => line.length > 100) + 1,
        before: 'Long line example',
        after: 'Broken into multiple lines'
      })
    }

    return styleIssues
  }

  private async performComplexityAnalysis(code: string, language: string): Promise<ComplexityAnalysis> {
    // Simulate complexity analysis
    let timeComplexity = 'O(n)'
    let spaceComplexity = 'O(1)'
    let cyclomatic = 1

    // Count nested loops
    const nestedLoops = (code.match(/for.*{[\s\S]*for/g) || []).length
    if (nestedLoops > 0) {
      timeComplexity = nestedLoops > 1 ? 'O(n³)' : 'O(n²)'
    }

    // Check for sorting
    if (code.includes('sort') || code.includes('Sort')) {
      timeComplexity = 'O(n log n)'
    }

    // Count branches for cyclomatic complexity
    const branches = (code.match(/if|else|while|for|switch|case|\?/g) || []).length
    cyclomatic = Math.max(1, branches)

    // Check space usage
    if (code.includes('new Array') || code.includes('[]') || code.includes('new Map') || code.includes('new Set')) {
      spaceComplexity = 'O(n)'
    }

    return {
      timeComplexity: {
        current: timeComplexity,
        optimal: 'O(n)', // This would be determined based on problem type
        analysis: `Current solution has ${timeComplexity} time complexity. ${
          nestedLoops > 0 ? 'Consider using hash maps to avoid nested loops.' : 'This is generally efficient.'
        }`
      },
      spaceComplexity: {
        current: spaceComplexity,
        optimal: 'O(1)', // This would be determined based on problem type
        analysis: `Space usage is ${spaceComplexity}. ${
          spaceComplexity === 'O(1)' ? 'Excellent space efficiency!' : 'Consider if additional data structures are necessary.'
        }`
      },
      cyclomatic,
      maintainability: cyclomatic <= 5 ? 'excellent' : cyclomatic <= 10 ? 'good' : cyclomatic <= 15 ? 'fair' : 'poor'
    }
  }

  private suggestTestCases(problemId: string, code: string): TestCaseSuggestion[] {
    // Generate intelligent test case suggestions
    return [
      {
        id: 'empty_input',
        type: 'edge_case',
        description: 'Test with empty input',
        input: [],
        expectedOutput: [],
        reasoning: 'Edge case: function should handle empty arrays gracefully'
      },
      {
        id: 'single_element',
        type: 'boundary',
        description: 'Test with single element',
        input: [1],
        expectedOutput: [1],
        reasoning: 'Boundary case: verify algorithm works with minimal input'
      },
      {
        id: 'large_input',
        type: 'stress',
        description: 'Test with large input',
        input: Array.from({ length: 10000 }, (_, i) => i),
        expectedOutput: 'performance_test',
        reasoning: 'Stress test: ensure algorithm scales well with large inputs'
      }
    ]
  }

  private getContextualHints(
    problemContext: any,
    codeAnalysis: any,
    level: HintRequest['hintLevel'],
    area?: HintRequest['specificArea']
  ): Hint[] {
    const hints: Hint[] = []

    // Generate hints based on context and user code
    if (!codeAnalysis.algorithmDetected) {
      if (level === 'gentle') {
        hints.push({
          id: 'gentle_algorithm',
          level: 'gentle',
          type: 'algorithm',
          title: 'Think About the Approach',
          content: 'What data structure might help you efficiently look up values?',
          followUp: ['Consider the trade-offs between time and space complexity'],
          relatedConcepts: ['Hash Maps', 'Two Pointers', 'Sliding Window']
        })
      } else if (level === 'moderate') {
        hints.push({
          id: 'moderate_algorithm',
          level: 'moderate',
          type: 'algorithm',
          title: 'Algorithm Suggestion',
          content: 'Try using a hash map to store values you\'ve seen. This can turn O(n²) solutions into O(n).',
          followUp: ['What information do you need to store in the hash map?'],
          relatedConcepts: ['Hash Maps', 'O(1) Lookups']
        })
      } else {
        hints.push({
          id: 'direct_algorithm',
          level: 'direct',
          type: 'algorithm',
          title: 'Specific Algorithm',
          content: 'Use a HashMap/dictionary to store elements as you iterate. For each element, check if its complement exists.',
          codeExample: `const map = new Map();
for (let i = 0; i < nums.length; i++) {
  const complement = target - nums[i];
  if (map.has(complement)) {
    return [map.get(complement), i];
  }
  map.set(nums[i], i);
}`,
          relatedConcepts: ['Hash Maps', 'Complement Pattern']
        })
      }
    }

    return hints
  }

  private getDefaultHint(level: HintRequest['hintLevel']): Hint {
    return {
      id: 'default_hint',
      level,
      type: 'algorithm',
      title: 'General Advice',
      content: level === 'gentle' 
        ? 'Break down the problem step by step. What are you trying to achieve?'
        : level === 'moderate'
        ? 'Consider different approaches: brute force, optimization with data structures, or mathematical solutions.'
        : 'Start with a working solution, then optimize for time and space complexity.',
      relatedConcepts: ['Problem Solving', 'Algorithm Design']
    }
  }

  private calculateScore(feedback: CodeFeedback): number {
    let score = feedback.overall.score

    // Adjust based on bugs
    const criticalBugs = feedback.bugs.filter(b => b.severity === 'critical').length
    const highBugs = feedback.bugs.filter(b => b.severity === 'high').length
    
    score -= criticalBugs * 20
    score -= highBugs * 10

    // Bonus for good complexity
    if (feedback.complexity.maintainability === 'excellent') {
      score += 5
    }

    return Math.max(0, Math.min(100, score))
  }

  private analyzeCodeStructure(code: string, language: string): any {
    return {
      algorithmDetected: code.includes('Map') || code.includes('Set') || code.includes('{}'),
      structureScore: Math.random() * 3 + 7, // 7-10
      complexityScore: Math.random() * 3 + 7, // 7-10
      linesOfCode: code.split('\n').length,
      functionsCount: (code.match(/function|def|=>/g) || []).length
    }
  }

  private async getProblemContext(problemId: string): Promise<any> {
    // In a real implementation, this would fetch problem details
    return {
      type: 'array',
      difficulty: 'easy',
      optimalComplexity: 'O(n)',
      commonAlgorithms: ['Hash Map', 'Two Pointers']
    }
  }

  private findLineNumber(code: string, searchText: string): number {
    const lines = code.split('\n')
    return lines.findIndex(line => line.includes(searchText)) + 1
  }

  private hashCode(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString()
  }

  private async simulateProcessingDelay(): Promise<void> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  }
}

export const aiCodeReviewer = new AICodeReviewer()