import { comprehensiveProblems } from '@/lib/data/problems';

export interface LeetCodeProblem {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  algorithms: string[];
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  constraints: string[];
  editorial: {
    approach: string;
    timeComplexity: string;
    spaceComplexity: string;
    solutions: Array<{
      name: string;
      description: string;
      code: string;
      explanation: string;
    }>;
  };
  leetcodeUrl: string;
}

export interface ProblemSet {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  problems: LeetCodeProblem[];
  estimatedTime: number; // in minutes
  prerequisites: string[];
  learningObjectives: string[];
}

export interface ProblemGeneratorConfig {
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  topics?: string[];
  algorithms?: string[];
  count?: number;
  excludeSolved?: boolean;
  solvedProblems?: string[];
  yoloMode?: boolean; // YOLO mode - no restrictions, maximum chaos
}

export class ProblemGenerator {
  private allProblems: LeetCodeProblem[];

  constructor() {
    this.allProblems = comprehensiveProblems;
  }

  /**
   * Generate a random problem set based on configuration
   */
  generateProblemSet(config: ProblemGeneratorConfig): LeetCodeProblem[] {
    let filteredProblems = this.allProblems;

    // YOLO MODE: NO RESTRICTIONS, MAXIMUM CHAOS! 🚀
    if (config.yoloMode) {
      console.log('🔥 YOLO MODE ACTIVATED - NO RESTRICTIONS, MAXIMUM CHAOS! 🔥');
      
      // In YOLO mode, we ignore all filters and just go wild
      const shuffled = this.shuffleArray([...this.allProblems]);
      const count = config.count || Math.floor(Math.random() * 50) + 10; // Random count between 10-60
      
      // Add some extra chaos - maybe include some problems multiple times
      const yoloProblems = [];
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * shuffled.length);
        yoloProblems.push(shuffled[randomIndex]);
      }
      
      return yoloProblems;
    }

    // Normal mode - apply filters
    // Filter by difficulty
    if (config.difficulty) {
      filteredProblems = filteredProblems.filter(p => p.difficulty === config.difficulty);
    }

    // Filter by topics
    if (config.topics && config.topics.length > 0) {
      filteredProblems = filteredProblems.filter(p => 
        config.topics!.some((topic: string) => p.topics.includes(topic))
      );
    }

    // Filter by algorithms
    if (config.algorithms && config.algorithms.length > 0) {
      filteredProblems = filteredProblems.filter(p => 
        config.algorithms!.some((algorithm: string) => p.algorithms.includes(algorithm))
      );
    }

    // Exclude solved problems
    if (config.excludeSolved && config.solvedProblems) {
      filteredProblems = filteredProblems.filter(p => 
        !config.solvedProblems!.includes(p.slug)
      );
    }

    // Shuffle and limit count
    const shuffled = this.shuffleArray([...filteredProblems]);
    const count = config.count || 10;
    
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Generate a learning path with progressive difficulty
   */
  generateLearningPath(pathName: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): ProblemSet {
    const difficultyMap = {
      'Beginner': ['Easy'],
      'Intermediate': ['Easy', 'Medium'],
      'Advanced': ['Easy', 'Medium', 'Hard']
    };

    const difficulties = difficultyMap[difficulty];
    const problems = this.allProblems.filter(p => difficulties.includes(p.difficulty));
    
    // Sort by difficulty and complexity
    const sortedProblems = problems.sort((a, b) => {
      const difficultyOrder: Record<string, number> = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });

    return {
      id: `path-${pathName.toLowerCase().replace(/\s+/g, '-')}`,
      title: `${pathName} Learning Path`,
      description: `A comprehensive learning path for ${pathName.toLowerCase()} covering fundamental concepts to advanced techniques.`,
      difficulty,
      problems: sortedProblems.slice(0, 20), // Limit to 20 problems
      estimatedTime: this.calculateEstimatedTime(sortedProblems.slice(0, 20)),
      prerequisites: this.getPrerequisites(difficulty),
      learningObjectives: this.getLearningObjectives(pathName, difficulty)
    };
  }

  /**
   * Generate topic-specific problem sets
   */
  generateTopicSet(topic: string, difficulty?: 'Easy' | 'Medium' | 'Hard'): ProblemSet {
    let problems = this.allProblems.filter(p => p.topics.includes(topic));
    
    if (difficulty) {
      problems = problems.filter(p => p.difficulty === difficulty);
    }

    // Sort by difficulty
    problems.sort((a, b) => {
      const difficultyOrder: Record<string, number> = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });

    return {
      id: `topic-${topic.toLowerCase().replace(/\s+/g, '-')}`,
      title: `${topic} Problems`,
      description: `A curated collection of ${topic.toLowerCase()} problems to master this topic.`,
      difficulty: this.getDifficultyLevel(problems),
      problems: problems.slice(0, 15),
      estimatedTime: this.calculateEstimatedTime(problems.slice(0, 15)),
      prerequisites: [],
      learningObjectives: [`Master ${topic} concepts`, `Practice ${topic} algorithms`, `Build problem-solving skills`]
    };
  }

  /**
   * Generate algorithm-specific problem sets
   */
  generateAlgorithmSet(algorithm: string, difficulty?: 'Easy' | 'Medium' | 'Hard'): ProblemSet {
    let problems = this.allProblems.filter(p => p.algorithms.includes(algorithm));
    
    if (difficulty) {
      problems = problems.filter(p => p.difficulty === difficulty);
    }

    // Sort by difficulty
    problems.sort((a, b) => {
      const difficultyOrder: Record<string, number> = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });

    return {
      id: `algo-${algorithm.toLowerCase().replace(/\s+/g, '-')}`,
      title: `${algorithm} Algorithm Practice`,
      description: `Practice problems specifically designed to master the ${algorithm} algorithm.`,
      difficulty: this.getDifficultyLevel(problems),
      problems: problems.slice(0, 12),
      estimatedTime: this.calculateEstimatedTime(problems.slice(0, 12)),
      prerequisites: [],
      learningObjectives: [`Master ${algorithm} algorithm`, `Understand implementation details`, `Apply to real problems`]
    };
  }

  /**
   * Generate daily challenge problems
   */
  generateDailyChallenge(): LeetCodeProblem[] {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Use seed to generate consistent daily problems
    const shuffled = this.shuffleArrayWithSeed([...this.allProblems], seed);
    
    // Return one problem from each difficulty
    const easy = shuffled.find(p => p.difficulty === 'Easy');
    const medium = shuffled.find(p => p.difficulty === 'Medium');
    const hard = shuffled.find(p => p.difficulty === 'Hard');
    
    return [easy, medium, hard].filter(Boolean) as LeetCodeProblem[];
  }

  /**
   * Generate weekly focus area
   */
  generateWeeklyFocus(): ProblemSet {
    const topics = ['Array', 'String', 'Tree', 'Dynamic Programming', 'Graph', 'Linked List'];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    return this.generateTopicSet(randomTopic);
  }

  /**
   * Get recommended problems based on user performance
   */
  getRecommendedProblems(
    solvedProblems: string[],
    weakAreas: string[],
    targetDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium'
  ): LeetCodeProblem[] {
    // Find problems in weak areas
    let recommendations = this.allProblems.filter(p => 
      weakAreas.some(area => p.topics.includes(area) || p.algorithms.includes(area))
    );

    // Filter by difficulty
    recommendations = recommendations.filter(p => p.difficulty === targetDifficulty);

    // Exclude already solved problems
    recommendations = recommendations.filter(p => !solvedProblems.includes(p.slug));

    // Sort by relevance (more matching weak areas = higher priority)
    recommendations.sort((a, b) => {
      const aScore = weakAreas.filter(area => 
        a.topics.includes(area) || a.algorithms.includes(area)
      ).length;
      const bScore = weakAreas.filter(area => 
        b.topics.includes(area) || b.algorithms.includes(area)
      ).length;
      return bScore - aScore;
    });

    return recommendations.slice(0, 10);
  }

  /**
   * Get all available topics
   */
  getAllTopics(): string[] {
    const topics = new Set<string>();
    this.allProblems.forEach(p => {
      p.topics.forEach(topic => topics.add(topic));
    });
    return Array.from(topics).sort();
  }

  /**
   * Get all available algorithms
   */
  getAllAlgorithms(): string[] {
    const algorithms = new Set<string>();
    this.allProblems.forEach(p => {
      p.algorithms.forEach(algorithm => algorithms.add(algorithm));
    });
    return Array.from(algorithms).sort();
  }

  /**
   * Get problem statistics
   */
  getProblemStatistics() {
    const stats = {
      total: this.allProblems.length,
      byDifficulty: {
        Easy: this.allProblems.filter(p => p.difficulty === 'Easy').length,
        Medium: this.allProblems.filter(p => p.difficulty === 'Medium').length,
        Hard: this.allProblems.filter(p => p.difficulty === 'Hard').length
      },
      byTopic: {} as Record<string, number>,
      byAlgorithm: {} as Record<string, number>
    };

    // Count by topic
    this.getAllTopics().forEach(topic => {
      stats.byTopic[topic] = this.allProblems.filter(p => p.topics.includes(topic)).length;
    });

    // Count by algorithm
    this.getAllAlgorithms().forEach(algorithm => {
      stats.byAlgorithm[algorithm] = this.allProblems.filter(p => p.algorithms.includes(algorithm)).length;
    });

    return stats;
  }

  // Helper methods
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private shuffleArrayWithSeed<T>(array: T[], seed: number): T[] {
    const shuffled = [...array];
    let currentSeed = seed;
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      const j = Math.floor((currentSeed / 233280) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private calculateEstimatedTime(problems: LeetCodeProblem[]): number {
    const timePerProblem: Record<string, number> = {
      'Easy': 15,
      'Medium': 30,
      'Hard': 45
    };

    return problems.reduce((total, problem) => {
      return total + timePerProblem[problem.difficulty];
    }, 0);
  }

  private getDifficultyLevel(problems: LeetCodeProblem[]): 'Beginner' | 'Intermediate' | 'Advanced' {
    if (problems.length === 0) return 'Beginner';
    
    const difficulties = problems.map(p => p.difficulty);
    const hasHard = difficulties.includes('Hard');
    const hasMedium = difficulties.includes('Medium');
    
    if (hasHard) return 'Advanced';
    if (hasMedium) return 'Intermediate';
    return 'Beginner';
  }

  private getPrerequisites(difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): string[] {
    const prerequisites = {
      'Beginner': ['Basic programming knowledge', 'Understanding of variables and loops'],
      'Intermediate': ['Basic data structures', 'Understanding of recursion', 'Basic algorithms'],
      'Advanced': ['Advanced data structures', 'Dynamic programming concepts', 'Graph algorithms']
    };
    return prerequisites[difficulty];
  }

  private getLearningObjectives(topic: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): string[] {
    const objectives = {
      'Beginner': [
        `Understand basic ${topic.toLowerCase()} concepts`,
        'Build problem-solving foundation',
        'Practice fundamental algorithms'
      ],
      'Intermediate': [
        `Master ${topic.toLowerCase()} techniques`,
        'Improve algorithmic thinking',
        'Handle edge cases effectively'
      ],
      'Advanced': [
        `Expert-level ${topic.toLowerCase()} mastery`,
        'Optimize solutions for performance',
        'Solve complex algorithmic challenges'
      ]
    };
    return objectives[difficulty];
  }
}

// Export singleton instance
export const problemGenerator = new ProblemGenerator();