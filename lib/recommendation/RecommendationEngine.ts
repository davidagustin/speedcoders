import { comprehensiveProblems } from '@/lib/data/comprehensive-problems';

interface UserProfile {
  id: string;
  solvedProblems: Set<number>;
  strengths: Map<string, number>; // category -> proficiency (0-100)
  weaknesses: Map<string, number>;
  averageTime: Map<string, number>; // category -> avg time in seconds
  lastSolved: Date;
  preferredDifficulty: 'Easy' | 'Medium' | 'Hard';
  learningPace: 'slow' | 'moderate' | 'fast';
}

interface ProblemRecommendation {
  problemId: number;
  score: number;
  reason: string;
  category: string;
  difficulty: string;
  estimatedTime: number;
}

export class RecommendationEngine {
  private readonly WEIGHTS = {
    weakness: 0.35,
    progression: 0.25,
    diversity: 0.2,
    recency: 0.1,
    popularity: 0.1
  };

  private readonly DIFFICULTY_PROGRESSION = {
    Easy: 'Medium',
    Medium: 'Hard',
    Hard: 'Hard'
  } as const;

  private readonly CATEGORY_RELATIONSHIPS = new Map<string, string[]>([
    ['Array', ['Two Pointers', 'Sliding Window', 'Binary Search']],
    ['String', ['Two Pointers', 'Sliding Window', 'Trie']],
    ['Tree', ['DFS', 'BFS', 'Binary Search Tree']],
    ['Graph', ['DFS', 'BFS', 'Union Find', 'Topological Sort']],
    ['Dynamic Programming', ['Recursion', 'Memoization']],
    ['Linked List', ['Two Pointers', 'Recursion']],
    ['Stack', ['Recursion', 'Monotonic Stack']],
    ['Queue', ['BFS', 'Sliding Window']],
    ['Binary Search', ['Two Pointers', 'Divide and Conquer']],
    ['Greedy', ['Dynamic Programming', 'Sorting']],
    ['Backtracking', ['DFS', 'Recursion']],
    ['Math', ['Bit Manipulation', 'Number Theory']]
  ]);

  analyzeUserProfile(userData: any): UserProfile {
    const solvedProblems = new Set<number>();
    const categoryStats = new Map<string, { solved: number; total: number; totalTime: number }>();
    
    // Initialize category stats
    comprehensiveProblems.forEach(problem => {
      if (!categoryStats.has(problem.category)) {
        categoryStats.set(problem.category, { solved: 0, total: 0, totalTime: 0 });
      }
      const stats = categoryStats.get(problem.category)!;
      stats.total++;
    });

    // Process user's solved problems
    if (userData.solvedProblems) {
      userData.solvedProblems.forEach((problemData: any) => {
        solvedProblems.add(problemData.id);
        const problem = comprehensiveProblems.find(p => p.id === problemData.id);
        if (problem) {
          const stats = categoryStats.get(problem.category)!;
          stats.solved++;
          stats.totalTime += problemData.time || 1800; // Default 30 minutes
        }
      });
    }

    // Calculate strengths and weaknesses
    const strengths = new Map<string, number>();
    const weaknesses = new Map<string, number>();
    const averageTime = new Map<string, number>();

    categoryStats.forEach((stats, category) => {
      const proficiency = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;
      const avgTime = stats.solved > 0 ? stats.totalTime / stats.solved : 1800;
      
      averageTime.set(category, avgTime);
      
      if (proficiency >= 70) {
        strengths.set(category, proficiency);
      } else if (proficiency < 40) {
        weaknesses.set(category, 100 - proficiency);
      }
    });

    // Determine learning pace
    const totalSolved = solvedProblems.size;
    const daysSinceStart = userData.createdAt 
      ? Math.ceil((Date.now() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 30;
    const problemsPerDay = totalSolved / Math.max(daysSinceStart, 1);
    
    let learningPace: 'slow' | 'moderate' | 'fast' = 'moderate';
    if (problemsPerDay < 0.5) learningPace = 'slow';
    else if (problemsPerDay > 2) learningPace = 'fast';

    // Determine preferred difficulty
    const difficultyCount = { Easy: 0, Medium: 0, Hard: 0 };
    userData.solvedProblems?.forEach((problemData: any) => {
      const problem = comprehensiveProblems.find(p => p.id === problemData.id);
      if (problem) {
        difficultyCount[problem.difficulty as keyof typeof difficultyCount]++;
      }
    });
    
    const preferredDifficulty = Object.entries(difficultyCount)
      .sort(([, a], [, b]) => b - a)[0][0] as 'Easy' | 'Medium' | 'Hard';

    return {
      id: userData.id,
      solvedProblems,
      strengths,
      weaknesses,
      averageTime,
      lastSolved: userData.lastSolved ? new Date(userData.lastSolved) : new Date(),
      preferredDifficulty,
      learningPace
    };
  }

  getRecommendations(
    userProfile: UserProfile,
    count: number = 10
  ): ProblemRecommendation[] {
    const recommendations: ProblemRecommendation[] = [];
    const unseenProblems = comprehensiveProblems.filter(
      p => !userProfile.solvedProblems.has(p.id)
    );

    unseenProblems.forEach(problem => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Weakness-based scoring
      if (userProfile.weaknesses.has(problem.category)) {
        const weaknessLevel = userProfile.weaknesses.get(problem.category)!;
        score += this.WEIGHTS.weakness * weaknessLevel;
        reasons.push('Targets weakness in ' + problem.category);
      }

      // 2. Progression-based scoring
      const categoryProficiency = this.getCategoryProficiency(userProfile, problem.category);
      if (categoryProficiency > 60 && problem.difficulty === this.getNextDifficulty(userProfile, problem.category)) {
        score += this.WEIGHTS.progression * 80;
        reasons.push('Next step in difficulty progression');
      }

      // 3. Diversity scoring
      const relatedCategories = this.CATEGORY_RELATIONSHIPS.get(problem.category) || [];
      const relatedStrength = relatedCategories.some(cat => userProfile.strengths.has(cat));
      if (relatedStrength) {
        score += this.WEIGHTS.diversity * 60;
        reasons.push('Builds on existing strengths');
      }

      // 4. Recency scoring
      const daysSinceLastSolved = Math.floor(
        (Date.now() - userProfile.lastSolved.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastSolved > 3) {
        score += this.WEIGHTS.recency * Math.min(daysSinceLastSolved * 10, 100);
        reasons.push('Maintains consistency');
      }

      // 5. Popularity/success rate scoring
      const successRate = this.getGlobalSuccessRate(problem.id);
      if (successRate > 0.6 && successRate < 0.8) {
        score += this.WEIGHTS.popularity * 70;
        reasons.push('Optimal challenge level');
      }

      // Adjust for learning pace
      if (userProfile.learningPace === 'slow' && problem.difficulty === 'Easy') {
        score += 15;
      } else if (userProfile.learningPace === 'fast' && problem.difficulty === 'Hard') {
        score += 15;
      }

      // Estimate time based on category average and difficulty
      const categoryAvgTime = userProfile.averageTime.get(problem.category) || 1800;
      const difficultyMultiplier = { Easy: 0.7, Medium: 1, Hard: 1.5 };
      const estimatedTime = Math.round(
        categoryAvgTime * difficultyMultiplier[problem.difficulty as keyof typeof difficultyMultiplier]
      );

      recommendations.push({
        problemId: problem.id,
        score,
        reason: reasons[0] || 'Recommended for practice',
        category: problem.category,
        difficulty: problem.difficulty,
        estimatedTime
      });
    });

    // Sort by score and return top N
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  private getCategoryProficiency(profile: UserProfile, category: string): number {
    if (profile.strengths.has(category)) {
      return profile.strengths.get(category)!;
    }
    if (profile.weaknesses.has(category)) {
      return 100 - profile.weaknesses.get(category)!;
    }
    return 50; // Default middle proficiency
  }

  private getNextDifficulty(profile: UserProfile, category: string): string {
    const proficiency = this.getCategoryProficiency(profile, category);
    
    if (proficiency < 40) return 'Easy';
    if (proficiency < 70) return 'Medium';
    return 'Hard';
  }

  private getGlobalSuccessRate(problemId: number): number {
    // In a real app, this would query a database
    // For now, return a simulated success rate based on problem difficulty
    const problem = comprehensiveProblems.find(p => p.id === problemId);
    if (!problem) return 0.5;
    
    const baseRates = { Easy: 0.75, Medium: 0.5, Hard: 0.25 };
    return baseRates[problem.difficulty as keyof typeof baseRates] + Math.random() * 0.2;
  }

  generateLearningPath(
    userProfile: UserProfile,
    targetSkills: string[],
    duration: number = 30 // days
  ): ProblemRecommendation[][] {
    const path: ProblemRecommendation[][] = [];
    const problemsPerDay = Math.ceil(
      userProfile.learningPace === 'slow' ? 1 :
      userProfile.learningPace === 'moderate' ? 2 : 3
    );

    for (let day = 0; day < duration; day++) {
      const dayRecommendations = this.getRecommendations(
        userProfile,
        problemsPerDay
      );
      
      // Filter to focus on target skills
      const filtered = dayRecommendations.filter(rec =>
        targetSkills.includes(rec.category) ||
        this.CATEGORY_RELATIONSHIPS.get(rec.category)?.some(
          related => targetSkills.includes(related)
        )
      );

      path.push(filtered.length > 0 ? filtered : dayRecommendations.slice(0, problemsPerDay));
      
      // Simulate solving problems to update profile for next day
      filtered.forEach(rec => {
        userProfile.solvedProblems.add(rec.problemId);
      });
    }

    return path;
  }
}

// Singleton instance
export const recommendationEngine = new RecommendationEngine();