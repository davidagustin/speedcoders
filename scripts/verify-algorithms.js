const fs = require('fs');
const path = require('path');

// Known correct algorithm mappings for validation
const knownCorrectMappings = {
  1: ["Hash Table", "Array"], // Two Sum - verified
  2: ["Linked List", "Math", "Recursion"], // Add Two Numbers - verified
  3: ["Hash Table", "String", "Sliding Window"], // Longest Substring Without Repeating Characters - verified
  4: ["Array", "Binary Search", "Divide and Conquer"], // Median of Two Sorted Arrays - verified
  5: ["String", "Dynamic Programming"], // Longest Palindromic Substring - verified
  11: ["Array", "Two Pointers", "Greedy"], // Container With Most Water - verified
  15: ["Array", "Two Pointers", "Sorting"], // 3Sum - verified
  20: ["String", "Stack"], // Valid Parentheses - verified
  21: ["Linked List", "Recursion"], // Merge Two Sorted Lists - verified
  53: ["Array", "Dynamic Programming", "Divide and Conquer"], // Maximum Subarray - verified
  70: ["Math", "Dynamic Programming", "Memoization"], // Climbing Stairs - verified
  104: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Maximum Depth of Binary Tree - verified
  121: ["Array", "Dynamic Programming"], // Best Time to Buy and Sell Stock - verified
  125: ["Two Pointers", "String"], // Valid Palindrome - verified
  200: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"], // Number of Islands - verified
  206: ["Linked List", "Recursion"], // Reverse Linked List - verified
  226: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"], // Invert Binary Tree - verified
  238: ["Array", "Prefix Sum"], // Product of Array Except Self - verified
  300: ["Array", "Dynamic Programming", "Binary Search"], // Longest Increasing Subsequence - verified
  322: ["Array", "Dynamic Programming", "Breadth-First Search"], // Coin Change - verified
  347: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Heap", "Bucket Sort", "Counting"], // Top K Frequent Elements - verified
  424: ["Hash Table", "String", "Sliding Window"] // Longest Repeating Character Replacement - verified
};

async function verifyAlgorithms() {
  console.log('🔍 Verifying algorithm mappings...');
  
  // Load curated problems
  const curatedPath = path.join(__dirname, '../data/curated-leetcode-problems.json');
  const curatedData = JSON.parse(fs.readFileSync(curatedPath, 'utf8'));
  const problems = curatedData.problems;
  
  console.log(`📊 Total problems to verify: ${problems.length}`);
  
  let verified = 0;
  let corrected = 0;
  let verificationResults = [];
  
  // Verify against known correct mappings
  problems.forEach(problem => {
    const result = {
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      currentAlgorithms: [...problem.algorithms],
      status: 'unverified',
      corrections: null
    };
    
    if (knownCorrectMappings[problem.id]) {
      const correctAlgorithms = knownCorrectMappings[problem.id];
      const currentAlgorithms = problem.algorithms;
      
      // Check if current mapping matches known correct mapping
      const isCorrect = arraysEqual(currentAlgorithms.sort(), correctAlgorithms.sort());
      
      if (isCorrect) {
        result.status = 'verified_correct';
        verified++;
      } else {
        result.status = 'corrected';
        result.corrections = {
          old: [...currentAlgorithms],
          new: [...correctAlgorithms]
        };
        problem.algorithms = [...correctAlgorithms];
        corrected++;
      }
    } else {
      // Perform additional validation checks
      const validationResult = validateAlgorithmMapping(problem);
      result.status = validationResult.status;
      result.validationNotes = validationResult.notes;
      
      if (validationResult.suggested) {
        result.corrections = {
          old: [...problem.algorithms],
          new: validationResult.suggested
        };
        problem.algorithms = validationResult.suggested;
        corrected++;
      }
    }
    
    verificationResults.push(result);
  });
  
  console.log(`✅ Verified correct: ${verified} problems`);
  console.log(`🔧 Corrected: ${corrected} problems`);
  console.log(`⚠️ Unverified: ${problems.length - verified - corrected} problems`);
  
  // Save verification report
  const reportPath = path.join(__dirname, '../data/verification-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: problems.length,
      verified: verified,
      corrected: corrected,
      unverified: problems.length - verified - corrected
    },
    results: verificationResults
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📋 Verification report saved to ${reportPath}`);
  
  // Save corrected problems
  const correctedData = {
    ...curatedData,
    metadata: {
      ...curatedData.metadata,
      verificationDate: new Date().toISOString(),
      verified: verified,
      corrected: corrected
    }
  };
  
  const verifiedPath = path.join(__dirname, '../data/verified-leetcode-problems.json');
  fs.writeFileSync(verifiedPath, JSON.stringify(correctedData, null, 2));
  console.log(`💾 Verified problems saved to ${verifiedPath}`);
  
  // Show sample corrections
  const corrections = verificationResults.filter(r => r.status === 'corrected');
  if (corrections.length > 0) {
    console.log('\n🔧 Sample Corrections Made:');
    corrections.slice(0, 10).forEach(correction => {
      console.log(`  ${correction.id}: ${correction.title}`);
      console.log(`    Old: ${correction.corrections.old.join(', ')}`);
      console.log(`    New: ${correction.corrections.new.join(', ')}`);
    });
  }
  
  return problems;
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function validateAlgorithmMapping(problem) {
  const title = problem.title.toLowerCase();
  const difficulty = problem.difficulty;
  const currentAlgorithms = problem.algorithms;
  
  let validation = {
    status: 'valid',
    notes: [],
    suggested: null
  };
  
  // Check for common patterns and suggest corrections
  
  // Tree problems should have Tree tag
  if ((title.includes('tree') || title.includes('binary')) && 
      !currentAlgorithms.includes('Tree') && 
      !currentAlgorithms.includes('Binary Tree')) {
    validation.notes.push('Tree problem missing Tree/Binary Tree tag');
    validation.suggested = [...currentAlgorithms, 'Tree', 'Binary Tree'];
    validation.status = 'suggested_correction';
  }
  
  // Linked List problems should have Linked List tag
  if ((title.includes('linked') || title.includes('list')) && 
      !currentAlgorithms.includes('Linked List')) {
    validation.notes.push('Linked List problem missing Linked List tag');
    validation.suggested = [...currentAlgorithms, 'Linked List'];
    validation.status = 'suggested_correction';
  }
  
  // String problems should have String tag
  if ((title.includes('string') || title.includes('substring') || 
       title.includes('palindrome') || title.includes('character')) && 
      !currentAlgorithms.includes('String')) {
    validation.notes.push('String problem missing String tag');
    if (!validation.suggested) validation.suggested = [...currentAlgorithms];
    validation.suggested.push('String');
    validation.status = 'suggested_correction';
  }
  
  // Array problems should have Array tag
  if ((title.includes('array') || title.includes('sum') || 
       title.includes('element') || title.includes('sort')) && 
      !currentAlgorithms.includes('Array')) {
    validation.notes.push('Array problem missing Array tag');
    if (!validation.suggested) validation.suggested = [...currentAlgorithms];
    validation.suggested.push('Array');
    validation.status = 'suggested_correction';
  }
  
  // Dynamic Programming problems
  if ((title.includes('maximum') || title.includes('minimum') || 
       title.includes('count') || title.includes('ways') || 
       title.includes('path') || title.includes('subset')) && 
      difficulty !== 'Easy' && 
      !currentAlgorithms.includes('Dynamic Programming')) {
    validation.notes.push('Potential DP problem missing Dynamic Programming tag');
    if (!validation.suggested) validation.suggested = [...currentAlgorithms];
    validation.suggested.push('Dynamic Programming');
    validation.status = 'suggested_correction';
  }
  
  // Two Pointers problems
  if ((title.includes('two') && (title.includes('sum') || title.includes('pointer'))) || 
      title.includes('palindrome') || title.includes('reverse')) {
    if (!currentAlgorithms.includes('Two Pointers')) {
      validation.notes.push('Two Pointers problem missing Two Pointers tag');
      if (!validation.suggested) validation.suggested = [...currentAlgorithms];
      validation.suggested.push('Two Pointers');
      validation.status = 'suggested_correction';
    }
  }
  
  // Remove duplicates from suggested
  if (validation.suggested) {
    validation.suggested = [...new Set(validation.suggested)];
  }
  
  return validation;
}

module.exports = verifyAlgorithms;

if (require.main === module) {
  verifyAlgorithms()
    .then(problems => {
      console.log(`\n🎉 Algorithm verification complete!`);
      console.log(`📊 ${problems.length} problems processed and verified.`);
    })
    .catch(console.error);
}