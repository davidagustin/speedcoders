const fs = require('fs');
const path = require('path');

class ProblemLoader {
  constructor() {
    this.problemsPath = path.join(__dirname, '../data/all-leetcode-problems.json');
    this.allProblems = this.loadAllProblems();
    this.agentDistPath = path.join(__dirname, '../data/agent-distribution.json');
    this.agentDistribution = this.loadAgentDistribution();
  }

  loadAllProblems() {
    try {
      const problemsData = fs.readFileSync(this.problemsPath, 'utf8');
      return JSON.parse(problemsData);
    } catch (error) {
      console.error('Error loading problems:', error.message);
      return [];
    }
  }

  loadAgentDistribution() {
    try {
      const distributionData = fs.readFileSync(this.agentDistPath, 'utf8');
      return JSON.parse(distributionData);
    } catch (error) {
      console.error('Error loading agent distribution:', error.message);
      return {};
    }
  }

  // Get all problems
  getAllProblems() {
    return this.allProblems;
  }

  // Get problems by difficulty
  getProblemsByDifficulty(difficulty) {
    return this.allProblems.filter(problem => 
      problem.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }

  // Get random problems
  getRandomProblems(count = 10, difficulty = null) {
    let problems = difficulty ? 
      this.getProblemsByDifficulty(difficulty) : 
      this.allProblems;
    
    // Shuffle array and take first 'count' items
    const shuffled = [...problems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  // Get problems by agent ID
  getProblemsByAgent(agentId) {
    return this.agentDistribution[agentId] || [];
  }

  // Get problems by algorithm
  getProblemsByAlgorithm(algorithm) {
    return this.allProblems.filter(problem => 
      problem.algorithms.some(alg => 
        alg.toLowerCase().includes(algorithm.toLowerCase())
      )
    );
  }

  // Get problem statistics
  getStatistics() {
    const stats = {
      total: this.allProblems.length,
      byDifficulty: {},
      byAgent: {},
      algorithms: new Set(),
      totalAgents: Object.keys(this.agentDistribution).length
    };

    // Count by difficulty
    this.allProblems.forEach(problem => {
      stats.byDifficulty[problem.difficulty] = 
        (stats.byDifficulty[problem.difficulty] || 0) + 1;
      
      // Collect all algorithms
      problem.algorithms.forEach(alg => stats.algorithms.add(alg));
    });

    // Count by agent
    Object.keys(this.agentDistribution).forEach(agentId => {
      stats.byAgent[agentId] = this.agentDistribution[agentId].length;
    });

    // Convert Set to Array for algorithms
    stats.algorithms = Array.from(stats.algorithms);

    return stats;
  }

  // Search problems
  searchProblems(query) {
    const searchTerm = query.toLowerCase();
    return this.allProblems.filter(problem => 
      problem.title.toLowerCase().includes(searchTerm) ||
      problem.description.toLowerCase().includes(searchTerm) ||
      problem.algorithms.some(alg => alg.toLowerCase().includes(searchTerm))
    );
  }

  // Get problem by ID
  getProblemById(id) {
    return this.allProblems.find(problem => problem.id === parseInt(id));
  }

  // Get problems in range
  getProblemsInRange(startId, endId) {
    return this.allProblems.filter(problem => 
      problem.id >= startId && problem.id <= endId
    );
  }

  // Export for client-side use
  exportForClient() {
    return {
      problems: this.allProblems,
      statistics: this.getStatistics(),
      totalAgents: Object.keys(this.agentDistribution).length
    };
  }
}

module.exports = ProblemLoader;