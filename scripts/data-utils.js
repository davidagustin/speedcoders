const fs = require('fs');
const path = require('path');

// Load consolidated data
function loadConsolidatedData(filename = 'consolidated-leetcode-data-enhanced.json') {
  const dataPath = path.join(__dirname, '..', 'data', filename);
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading consolidated data: ${error.message}`);
    return null;
  }
}

// Get problems by algorithm
function getProblemsByAlgorithm(data, algorithm) {
  const problemIds = data.indexes.algorithms[algorithm] || [];
  return problemIds.map(id => data.indexes.problems[id]).filter(Boolean);
}

// Get problems by difficulty
function getProblemsByDifficulty(data, difficulty) {
  const problemIds = data.indexes.difficulties[difficulty] || [];
  return problemIds.map(id => data.indexes.problems[id]).filter(Boolean);
}

// Get problems by agent
function getProblemsByAgent(data, agentId) {
  const problemIds = data.indexes.agents[agentId] || [];
  return problemIds.map(id => data.indexes.problems[id]).filter(Boolean);
}

// Get verification statistics
function getVerificationStats(data) {
  const problems = Object.values(data.indexes.problems);
  const stats = {
    verified: 0,
    corrected: 0,
    unverified: 0,
    valid: 0,
    suggested_correction: 0
  };
  
  problems.forEach(problem => {
    if (problem.verificationStatus) {
      stats[problem.verificationStatus] = (stats[problem.verificationStatus] || 0) + 1;
    }
  });
  
  return stats;
}

// Search problems by title
function searchProblemsByTitle(data, searchTerm) {
  const problems = Object.values(data.indexes.problems);
  const term = searchTerm.toLowerCase();
  return problems.filter(problem => 
    problem.title && problem.title.toLowerCase().includes(term)
  );
}

// Get algorithm statistics
function getAlgorithmStats(data) {
  const stats = {};
  Object.entries(data.indexes.algorithms).forEach(([algorithm, problemIds]) => {
    stats[algorithm] = {
      count: problemIds.length,
      problems: problemIds.slice(0, 10) // First 10 problem IDs
    };
  });
  return stats;
}

// Get difficulty distribution
function getDifficultyDistribution(data) {
  const stats = {};
  Object.entries(data.indexes.difficulties).forEach(([difficulty, problemIds]) => {
    stats[difficulty] = problemIds.length;
  });
  return stats;
}

// Export data subset
function exportDataSubset(data, options = {}) {
  const {
    algorithms = [],
    difficulties = [],
    agents = [],
    verificationStatus = [],
    outputFile = 'data-subset.json'
  } = options;
  
  let filteredProblems = Object.values(data.indexes.problems);
  
  if (algorithms.length > 0) {
    filteredProblems = filteredProblems.filter(problem => 
      problem.algorithms && algorithms.some(alg => problem.algorithms.includes(alg))
    );
  }
  
  if (difficulties.length > 0) {
    filteredProblems = filteredProblems.filter(problem => 
      difficulties.includes(problem.difficulty)
    );
  }
  
  if (agents.length > 0) {
    filteredProblems = filteredProblems.filter(problem => 
      agents.includes(problem.agentAssigned?.toString())
    );
  }
  
  if (verificationStatus.length > 0) {
    filteredProblems = filteredProblems.filter(problem => 
      verificationStatus.includes(problem.verificationStatus)
    );
  }
  
  const subset = {
    metadata: {
      exportDate: new Date().toISOString(),
      filters: options,
      totalProblems: filteredProblems.length
    },
    problems: filteredProblems
  };
  
  const outputPath = path.join(__dirname, '..', 'data', outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(subset, null, 2));
  
  console.log(`✓ Exported ${filteredProblems.length} problems to ${outputFile}`);
  return subset;
}

// Print summary report
function printSummaryReport(data) {
  console.log('\n📊 CONSOLIDATED DATA SUMMARY REPORT');
  console.log('=====================================');
  
  console.log(`\n📁 Metadata:`);
  console.log(`- Consolidation Date: ${data.metadata.consolidationDate}`);
  console.log(`- Version: ${data.metadata.version}`);
  console.log(`- Total Files: ${data.metadata.totalFiles}`);
  console.log(`- Total Size: ${Math.round(data.metadata.totalSize / 1024 / 1024 * 100) / 100}MB`);
  
  console.log(`\n📊 Summary Statistics:`);
  console.log(`- Total Problems: ${data.metadata.summary.totalProblems}`);
  console.log(`- Total Algorithms: ${data.metadata.summary.totalAlgorithms}`);
  console.log(`- Total Agents: ${data.metadata.summary.totalAgents}`);
  console.log(`- Total Quiz Categories: ${data.metadata.summary.totalQuizCategories}`);
  
  console.log(`\n🎯 Problems by Difficulty:`);
  Object.entries(data.metadata.summary.problemsByDifficulty).forEach(([difficulty, count]) => {
    console.log(`  - ${difficulty}: ${count}`);
  });
  
  console.log(`\n✅ Verification Status:`);
  console.log(`- Verified: ${data.metadata.summary.totalVerified}`);
  console.log(`- Corrected: ${data.metadata.summary.totalCorrected}`);
  console.log(`- Unverified: ${data.metadata.summary.totalUnverified}`);
  
  console.log(`\n📋 Data Sources:`);
  data.metadata.dataSources.forEach(source => {
    console.log(`  - ${source.file} (${source.type}): ${source.records} records, ${Math.round(source.size / 1024)}KB`);
  });
  
  console.log(`\n🔍 Available Indexes:`);
  console.log(`- Problems: ${Object.keys(data.indexes.problems).length} entries`);
  console.log(`- Algorithms: ${Object.keys(data.indexes.algorithms).length} algorithms`);
  console.log(`- Difficulties: ${Object.keys(data.indexes.difficulties).length} levels`);
  console.log(`- Agents: ${Object.keys(data.indexes.agents).length} agents`);
}

// CLI interface
function runCLI() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const data = loadConsolidatedData();
  if (!data) {
    console.error('Failed to load consolidated data');
    process.exit(1);
  }
  
  switch (command) {
    case 'summary':
      printSummaryReport(data);
      break;
      
    case 'search':
      if (args.length < 2) {
        console.log('Usage: node data-utils.js search <search-term>');
        break;
      }
      const results = searchProblemsByTitle(data, args[1]);
      console.log(`\n🔍 Search results for "${args[1]}":`);
      results.slice(0, 10).forEach(problem => {
        console.log(`- ${problem.id}: ${problem.title} (${problem.difficulty})`);
      });
      console.log(`\nFound ${results.length} problems total`);
      break;
      
    case 'algorithm':
      if (args.length < 2) {
        console.log('Usage: node data-utils.js algorithm <algorithm-name>');
        break;
      }
      const algProblems = getProblemsByAlgorithm(data, args[1]);
      console.log(`\n📚 Problems using "${args[1]}":`);
      algProblems.slice(0, 10).forEach(problem => {
        console.log(`- ${problem.id}: ${problem.title} (${problem.difficulty})`);
      });
      console.log(`\nFound ${algProblems.length} problems total`);
      break;
      
    case 'difficulty':
      if (args.length < 2) {
        console.log('Usage: node data-utils.js difficulty <Easy|Medium|Hard>');
        break;
      }
      const diffProblems = getProblemsByDifficulty(data, args[1]);
      console.log(`\n📊 ${args[1]} problems:`);
      diffProblems.slice(0, 10).forEach(problem => {
        console.log(`- ${problem.id}: ${problem.title}`);
      });
      console.log(`\nFound ${diffProblems.length} problems total`);
      break;
      
    case 'export':
      const options = {
        algorithms: args.includes('--algorithms') ? args[args.indexOf('--algorithms') + 1].split(',') : [],
        difficulties: args.includes('--difficulties') ? args[args.indexOf('--difficulties') + 1].split(',') : [],
        outputFile: args.includes('--output') ? args[args.indexOf('--output') + 1] : 'data-subset.json'
      };
      exportDataSubset(data, options);
      break;
      
    default:
      console.log('Available commands:');
      console.log('  summary                    - Print summary report');
      console.log('  search <term>              - Search problems by title');
      console.log('  algorithm <name>           - Get problems by algorithm');
      console.log('  difficulty <Easy|Medium|Hard> - Get problems by difficulty');
      console.log('  export [options]           - Export data subset');
      console.log('\nExport options:');
      console.log('  --algorithms <alg1,alg2>   - Filter by algorithms');
      console.log('  --difficulties <Easy,Medium> - Filter by difficulties');
      console.log('  --output <filename>        - Output filename');
      break;
  }
}

// Export functions
module.exports = {
  loadConsolidatedData,
  getProblemsByAlgorithm,
  getProblemsByDifficulty,
  getProblemsByAgent,
  getVerificationStats,
  searchProblemsByTitle,
  getAlgorithmStats,
  getDifficultyDistribution,
  exportDataSubset,
  printSummaryReport
};

// Run CLI if called directly
if (require.main === module) {
  runCLI();
}
