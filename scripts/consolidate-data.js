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

// Main consolidation function
function consolidateData() {
  const dataDir = path.join(__dirname, '..', 'data');
  const outputFile = path.join(__dirname, '..', 'data', 'consolidated-leetcode-data.json');
  
  console.log('Starting data consolidation...');
  
  // Initialize the consolidated data structure
  const consolidatedData = {
    metadata: {
      consolidationDate: new Date().toISOString(),
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
    }
  };

  // List of files to process with their categories
  const filesToProcess = [
    { file: 'all-leetcode-problems.json', category: 'problems', key: 'allProblems' },
    { file: 'curated-leetcode-problems.json', category: 'problems', key: 'curatedProblems' },
    { file: 'real-leetcode-problems.json', category: 'problems', key: 'realProblems' },
    { file: 'verified-leetcode-problems.json', category: 'problems', key: 'verifiedProblems' },
    { file: 'verification-report.json', category: 'verification', key: 'verificationReport' },
    { file: 'agent-distribution.json', category: 'distribution', key: 'agentDistribution' },
    { file: 'agent-status.json', category: 'distribution', key: 'agentStatus' },
    { file: 'sample-quiz.json', category: 'quiz', key: 'sampleQuiz' },
    { file: 'quiz-problems.js', category: 'quiz', key: 'quizProblems' },
    { file: 'client-data.json', category: 'other', key: 'clientData' },
    { file: 'problems-export.js', category: 'other', key: 'problemsExport' }
  ];

  // Process each file
  filesToProcess.forEach(({ file, category, key }) => {
    const filePath = path.join(dataDir, file);
    
    if (fs.existsSync(filePath)) {
      console.log(`Processing ${file}...`);
      
      const fileStats = getFileStats(filePath);
      const data = readJsonFile(filePath);
      
      if (data) {
        // Add to consolidated data
        consolidatedData.datasets[category][key] = {
          data: data,
          fileInfo: {
            filename: file,
            ...fileStats
          }
        };
        
        // Update metadata
        consolidatedData.metadata.totalFiles++;
        consolidatedData.metadata.totalSize += fileStats ? fileStats.size : 0;
        consolidatedData.metadata.dataSources.push({
          file: file,
          category: category,
          key: key,
          size: fileStats ? fileStats.size : 0,
          records: Array.isArray(data) ? data.length : 
                   typeof data === 'object' && data.problems ? data.problems.length :
                   typeof data === 'object' ? Object.keys(data).length : 1
        });
        
        console.log(`✓ Processed ${file} (${fileStats ? Math.round(fileStats.size / 1024) : 0}KB)`);
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
          ...fileStats
        },
        note: 'TypeScript/JavaScript file - content not parsed'
      };
      
      consolidatedData.metadata.totalFiles++;
      consolidatedData.metadata.totalSize += fileStats ? fileStats.size : 0;
    });
    
    console.log(`✓ Processed ${batchFiles.length} curation batch files`);
  }

  // Add summary statistics
  consolidatedData.metadata.summary = {
    totalProblems: consolidatedData.datasets.problems.curatedProblems?.data?.metadata?.totalProblems || 0,
    totalVerified: consolidatedData.datasets.verification.verificationReport?.data?.summary?.verified || 0,
    totalCorrected: consolidatedData.datasets.verification.verificationReport?.data?.summary?.corrected || 0,
    totalUnverified: consolidatedData.datasets.verification.verificationReport?.data?.summary?.unverified || 0,
    totalAgents: Object.keys(consolidatedData.datasets.distribution.agentDistribution?.data || {}).length,
    totalQuizCategories: Object.keys(consolidatedData.datasets.quiz.sampleQuiz?.data || {}).length
  };

  // Write the consolidated data
  console.log('Writing consolidated data...');
  fs.writeFileSync(outputFile, JSON.stringify(consolidatedData, null, 2));
  
  const outputStats = getFileStats(outputFile);
  console.log(`✓ Consolidated data written to: ${outputFile}`);
  console.log(`✓ Total size: ${Math.round(outputStats.size / 1024 / 1024 * 100) / 100}MB`);
  console.log(`✓ Total files processed: ${consolidatedData.metadata.totalFiles}`);
  console.log(`✓ Total data sources: ${consolidatedData.metadata.dataSources.length}`);
  
  // Print summary
  console.log('\n📊 Data Summary:');
  console.log(`- Total Problems: ${consolidatedData.metadata.summary.totalProblems}`);
  console.log(`- Verified: ${consolidatedData.metadata.summary.totalVerified}`);
  console.log(`- Corrected: ${consolidatedData.metadata.summary.totalCorrected}`);
  console.log(`- Unverified: ${consolidatedData.metadata.summary.totalUnverified}`);
  console.log(`- Agents: ${consolidatedData.metadata.summary.totalAgents}`);
  console.log(`- Quiz Categories: ${consolidatedData.metadata.summary.totalQuizCategories}`);
  
  return consolidatedData;
}

// Run the consolidation
if (require.main === module) {
  consolidateData();
}

module.exports = { consolidateData };
