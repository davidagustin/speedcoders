const fs = require('fs');
const path = require('path');

// Function to read JSON file safely
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

// Function to read JavaScript file and extract data
function readJsFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Try to extract module.exports or export default
    const moduleMatch = content.match(/module\.exports\s*=\s*({[\s\S]*?});?\s*$/);
    const exportMatch = content.match(/export\s+default\s*({[\s\S]*?});?\s*$/);
    const constMatch = content.match(/const\s+\w+\s*=\s*({[\s\S]*?});?\s*$/);
    
    if (moduleMatch) {
      try {
        // Create a safe evaluation context
        const sandbox = {};
        const result = new Function('module', 'exports', `
          ${content.replace(/module\.exports\s*=\s*/, 'exports = ')}
          return module.exports;
        `)({ exports: {} }, {});
        return result;
      } catch (e) {
        return { content: content.substring(0, 1000) + '...', note: 'Could not parse JS module' };
      }
    } else if (exportMatch) {
      try {
        return JSON.parse(exportMatch[1]);
      } catch (e) {
        return { content: content.substring(0, 1000) + '...', note: 'Could not parse export default' };
      }
    } else if (constMatch) {
      try {
        return JSON.parse(constMatch[1]);
      } catch (e) {
        return { content: content.substring(0, 1000) + '...', note: 'Could not parse const declaration' };
      }
    } else {
      return { content: content.substring(0, 1000) + '...', note: 'No export pattern found' };
    }
  } catch (error) {
    console.error(`Error reading JS file ${filePath}:`, error.message);
    return { error: error.message };
  }
}

// Function to get file stats
function getFileStats(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      modified: stats.mtime.toISOString(),
      created: stats.birthtime.toISOString()
    };
  } catch (error) {
    return null;
  }
}

// Function to create a flattened problems index
function createProblemsIndex(consolidatedData) {
  const problemsIndex = {};
  
  // Extract problems from different sources
  const sources = [
    { key: 'curatedProblems', data: consolidatedData.datasets.problems.curatedProblems?.data },
    { key: 'realProblems', data: consolidatedData.datasets.problems.realProblems?.data },
    { key: 'verifiedProblems', data: consolidatedData.datasets.problems.verifiedProblems?.data },
    { key: 'allProblems', data: consolidatedData.datasets.problems.allProblems?.data }
  ];
  
  sources.forEach(source => {
    if (source.data && source.data.problems) {
      source.data.problems.forEach(problem => {
        if (problem.id) {
          problemsIndex[problem.id] = {
            ...problem,
            source: source.key,
            verificationStatus: null
          };
        }
      });
    } else if (Array.isArray(source.data)) {
      source.data.forEach(problem => {
        if (problem.id) {
          problemsIndex[problem.id] = {
            ...problem,
            source: source.key,
            verificationStatus: null
          };
        }
      });
    }
  });
  
  // Add verification status
  if (consolidatedData.datasets.verification.verificationReport?.data?.results) {
    consolidatedData.datasets.verification.verificationReport.data.results.forEach(result => {
      if (problemsIndex[result.id]) {
        problemsIndex[result.id].verificationStatus = result.status;
        problemsIndex[result.id].corrections = result.corrections;
      }
    });
  }
  
  return problemsIndex;
}

// Main consolidation function
function consolidateDataEnhanced() {
  const dataDir = path.join(__dirname, '..', 'data');
  const outputFile = path.join(__dirname, '..', 'data', 'consolidated-leetcode-data-enhanced.json');
  
  console.log('Starting enhanced data consolidation...');
  
  // Initialize the consolidated data structure
  const consolidatedData = {
    metadata: {
      consolidationDate: new Date().toISOString(),
      version: "2.0",
      totalFiles: 0,
      totalSize: 0,
      dataSources: []
    },
    datasets: {
      problems: {},
      verification: {},
      distribution: {},
      quiz: {},
      curation: {},
      other: {}
    },
    indexes: {
      problems: {},
      algorithms: {},
      difficulties: {},
      agents: {}
    }
  };

  // List of files to process with their categories and file types
  const filesToProcess = [
    { file: 'all-leetcode-problems.json', category: 'problems', key: 'allProblems', type: 'json' },
    { file: 'curated-leetcode-problems.json', category: 'problems', key: 'curatedProblems', type: 'json' },
    { file: 'real-leetcode-problems.json', category: 'problems', key: 'realProblems', type: 'json' },
    { file: 'verified-leetcode-problems.json', category: 'problems', key: 'verifiedProblems', type: 'json' },
    { file: 'verification-report.json', category: 'verification', key: 'verificationReport', type: 'json' },
    { file: 'agent-distribution.json', category: 'distribution', key: 'agentDistribution', type: 'json' },
    { file: 'agent-status.json', category: 'distribution', key: 'agentStatus', type: 'json' },
    { file: 'sample-quiz.json', category: 'quiz', key: 'sampleQuiz', type: 'json' },
    { file: 'quiz-problems.js', category: 'quiz', key: 'quizProblems', type: 'js' },
    { file: 'client-data.json', category: 'other', key: 'clientData', type: 'json' },
    { file: 'problems-export.js', category: 'other', key: 'problemsExport', type: 'js' }
  ];

  // Process each file
  filesToProcess.forEach(({ file, category, key, type }) => {
    const filePath = path.join(dataDir, file);
    
    if (fs.existsSync(filePath)) {
      console.log(`Processing ${file} (${type})...`);
      
      const fileStats = getFileStats(filePath);
      const data = type === 'json' ? readJsonFile(filePath) : readJsFile(filePath);
      
      if (data) {
        // Add to consolidated data
        consolidatedData.datasets[category][key] = {
          data: data,
          fileInfo: {
            filename: file,
            type: type,
            ...fileStats
          }
        };
        
        // Update metadata
        consolidatedData.metadata.totalFiles++;
        consolidatedData.metadata.totalSize += fileStats ? fileStats.size : 0;
        
        let recordCount = 0;
        if (Array.isArray(data)) {
          recordCount = data.length;
        } else if (typeof data === 'object') {
          if (data.problems) recordCount = data.problems.length;
          else if (data.results) recordCount = data.results.length;
          else recordCount = Object.keys(data).length;
        }
        
        consolidatedData.metadata.dataSources.push({
          file: file,
          category: category,
          key: key,
          type: type,
          size: fileStats ? fileStats.size : 0,
          records: recordCount
        });
        
        console.log(`✓ Processed ${file} (${fileStats ? Math.round(fileStats.size / 1024) : 0}KB, ${recordCount} records)`);
      }
    } else {
      console.log(`⚠ File not found: ${file}`);
    }
  });

  // Process curation batch files
  const curationDir = path.join(dataDir, 'curation');
  if (fs.existsSync(curationDir)) {
    console.log('Processing curation batch files...');
    
    const batchFiles = fs.readdirSync(curationDir)
      .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
      .sort();
    
    consolidatedData.datasets.curation.batches = {};
    
    batchFiles.forEach(file => {
      const filePath = path.join(curationDir, file);
      const fileStats = getFileStats(filePath);
      
      // For TypeScript/JavaScript files, we'll store the file info
      // but not parse the content since it's code
      consolidatedData.datasets.curation.batches[file] = {
        fileInfo: {
          filename: file,
          type: file.endsWith('.ts') ? 'typescript' : 'javascript',
          ...fileStats
        },
        note: 'TypeScript/JavaScript file - content not parsed'
      };
      
      consolidatedData.metadata.totalFiles++;
      consolidatedData.metadata.totalSize += fileStats ? fileStats.size : 0;
    });
    
    console.log(`✓ Processed ${batchFiles.length} curation batch files`);
  }

  // Create indexes
  console.log('Creating indexes...');
  
  // Problems index
  consolidatedData.indexes.problems = createProblemsIndex(consolidatedData);
  
  // Algorithms index
  const algorithmsIndex = {};
  Object.values(consolidatedData.indexes.problems).forEach(problem => {
    if (problem.algorithms) {
      problem.algorithms.forEach(algorithm => {
        if (!algorithmsIndex[algorithm]) {
          algorithmsIndex[algorithm] = [];
        }
        algorithmsIndex[algorithm].push(problem.id);
      });
    }
  });
  consolidatedData.indexes.algorithms = algorithmsIndex;
  
  // Difficulties index
  const difficultiesIndex = { Easy: [], Medium: [], Hard: [] };
  Object.values(consolidatedData.indexes.problems).forEach(problem => {
    if (problem.difficulty && difficultiesIndex[problem.difficulty]) {
      difficultiesIndex[problem.difficulty].push(problem.id);
    }
  });
  consolidatedData.indexes.difficulties = difficultiesIndex;
  
  // Agents index
  const agentsIndex = {};
  if (consolidatedData.datasets.distribution.agentDistribution?.data) {
    Object.entries(consolidatedData.datasets.distribution.agentDistribution.data).forEach(([agentId, problems]) => {
      agentsIndex[agentId] = problems.map(p => p.id);
    });
  }
  consolidatedData.indexes.agents = agentsIndex;

  // Add summary statistics
  consolidatedData.metadata.summary = {
    totalProblems: Object.keys(consolidatedData.indexes.problems).length,
    totalVerified: consolidatedData.datasets.verification.verificationReport?.data?.summary?.verified || 0,
    totalCorrected: consolidatedData.datasets.verification.verificationReport?.data?.summary?.corrected || 0,
    totalUnverified: consolidatedData.datasets.verification.verificationReport?.data?.summary?.unverified || 0,
    totalAgents: Object.keys(consolidatedData.indexes.agents).length,
    totalAlgorithms: Object.keys(consolidatedData.indexes.algorithms).length,
    totalQuizCategories: Object.keys(consolidatedData.datasets.quiz.sampleQuiz?.data || {}).length,
    problemsByDifficulty: {
      Easy: consolidatedData.indexes.difficulties.Easy.length,
      Medium: consolidatedData.indexes.difficulties.Medium.length,
      Hard: consolidatedData.indexes.difficulties.Hard.length
    }
  };

  // Write the consolidated data
  console.log('Writing enhanced consolidated data...');
  fs.writeFileSync(outputFile, JSON.stringify(consolidatedData, null, 2));
  
  const outputStats = getFileStats(outputFile);
  console.log(`✓ Enhanced consolidated data written to: ${outputFile}`);
  console.log(`✓ Total size: ${Math.round(outputStats.size / 1024 / 1024 * 100) / 100}MB`);
  console.log(`✓ Total files processed: ${consolidatedData.metadata.totalFiles}`);
  console.log(`✓ Total data sources: ${consolidatedData.metadata.dataSources.length}`);
  
  // Print summary
  console.log('\n📊 Enhanced Data Summary:');
  console.log(`- Total Problems: ${consolidatedData.metadata.summary.totalProblems}`);
  console.log(`- Verified: ${consolidatedData.metadata.summary.totalVerified}`);
  console.log(`- Corrected: ${consolidatedData.metadata.summary.totalCorrected}`);
  console.log(`- Unverified: ${consolidatedData.metadata.summary.totalUnverified}`);
  console.log(`- Agents: ${consolidatedData.metadata.summary.totalAgents}`);
  console.log(`- Algorithms: ${consolidatedData.metadata.summary.totalAlgorithms}`);
  console.log(`- Quiz Categories: ${consolidatedData.metadata.summary.totalQuizCategories}`);
  console.log(`- Problems by Difficulty:`);
  console.log(`  - Easy: ${consolidatedData.metadata.summary.problemsByDifficulty.Easy}`);
  console.log(`  - Medium: ${consolidatedData.metadata.summary.problemsByDifficulty.Medium}`);
  console.log(`  - Hard: ${consolidatedData.metadata.summary.problemsByDifficulty.Hard}`);
  
  return consolidatedData;
}

// Run the consolidation
if (require.main === module) {
  consolidateDataEnhanced();
}

module.exports = { consolidateDataEnhanced };
