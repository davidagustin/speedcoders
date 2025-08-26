const fs = require('fs');
const path = require('path');

async function fetchRealLeetCodeProblems() {
  console.log('🔍 Fetching real LeetCode problems data...');
  
  try {
    // First, let's try to fetch from LeetCode's API using built-in fetch
    console.log('📡 Attempting to fetch from LeetCode API...');
    
    const response = await fetch('https://leetcode.com/api/problems/all/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched LeetCode problems data!');
    
    // Process the data
    const problems = data.stat_status_pairs || [];
    console.log(`📊 Total problems fetched: ${problems.length}`);
    
    // Transform the data to our format
    const processedProblems = problems.map(item => {
      const stat = item.stat;
      const difficulty = item.difficulty;
      const paidOnly = item.paid_only;
      
      // Map difficulty levels
      const difficultyMap = {
        1: 'Easy',
        2: 'Medium', 
        3: 'Hard'
      };
      
      return {
        id: stat.frontend_question_id,
        title: stat.question__title,
        titleSlug: stat.question__title_slug,
        difficulty: difficultyMap[difficulty.level] || 'Unknown',
        isPremium: paidOnly,
        totalAccepted: stat.total_acs,
        totalSubmitted: stat.total_submitted,
        acceptanceRate: stat.total_submitted > 0 ? 
          ((stat.total_acs / stat.total_submitted) * 100).toFixed(1) + '%' : 'N/A',
        algorithms: [], // Will be populated later
        description: `LeetCode Problem ${stat.frontend_question_id}: ${stat.question__title}`,
        leetcodeUrl: `https://leetcode.com/problems/${stat.question__title_slug}/`
      };
    }).filter(problem => problem.id > 0) // Filter out invalid problems
    .sort((a, b) => a.id - b.id); // Sort by problem ID

    // Calculate statistics
    const stats = {
      total: processedProblems.length,
      easy: processedProblems.filter(p => p.difficulty === 'Easy').length,
      medium: processedProblems.filter(p => p.difficulty === 'Medium').length,
      hard: processedProblems.filter(p => p.difficulty === 'Hard').length,
      premium: processedProblems.filter(p => p.isPremium).length,
      free: processedProblems.filter(p => !p.isPremium).length,
      lastUpdated: new Date().toISOString()
    };

    console.log('📈 Problem Statistics:');
    console.log(`  Total: ${stats.total}`);
    console.log(`  Easy: ${stats.easy} (${(stats.easy/stats.total*100).toFixed(1)}%)`);
    console.log(`  Medium: ${stats.medium} (${(stats.medium/stats.total*100).toFixed(1)}%)`);
    console.log(`  Hard: ${stats.hard} (${(stats.hard/stats.total*100).toFixed(1)}%)`);
    console.log(`  Premium: ${stats.premium} (${(stats.premium/stats.total*100).toFixed(1)}%)`);
    console.log(`  Free: ${stats.free} (${(stats.free/stats.total*100).toFixed(1)}%)`);

    // Save the processed data
    const outputPath = path.join(__dirname, '../data/real-leetcode-problems.json');
    const fullData = {
      metadata: {
        source: 'LeetCode Official API',
        fetchDate: new Date().toISOString(),
        totalProblems: processedProblems.length,
        statistics: stats
      },
      problems: processedProblems
    };

    fs.writeFileSync(outputPath, JSON.stringify(fullData, null, 2));
    console.log(`💾 Saved ${processedProblems.length} real LeetCode problems to ${outputPath}`);

    // Show sample problems
    console.log('\n📋 Sample Problems:');
    processedProblems.slice(0, 10).forEach(problem => {
      console.log(`  ${problem.id}: ${problem.title} (${problem.difficulty}) - ${problem.acceptanceRate} acceptance`);
    });

    return processedProblems;

  } catch (error) {
    console.error('❌ Error fetching LeetCode problems:', error.message);
    
    // Fallback: Use a sample dataset of real problems
    console.log('🔄 Using fallback dataset with real LeetCode problems...');
    
    const fallbackProblems = [
      { id: 1, title: "Two Sum", difficulty: "Easy", algorithms: ["Hash Table", "Array"] },
      { id: 2, title: "Add Two Numbers", difficulty: "Medium", algorithms: ["Linked List", "Math", "Recursion"] },
      { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", algorithms: ["Hash Table", "String", "Sliding Window"] },
      { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", algorithms: ["Array", "Binary Search", "Divide and Conquer"] },
      { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", algorithms: ["String", "Dynamic Programming"] },
      // Add more real problems here...
    ];

    console.log('⚠️ Using limited fallback dataset. For complete data, API access is needed.');
    return fallbackProblems;
  }
}

// Run the fetch operation
if (require.main === module) {
  fetchRealLeetCodeProblems()
    .then(problems => {
      console.log(`\n🎉 Successfully processed ${problems.length} real LeetCode problems!`);
      console.log('✅ Data is ready for manual curation of algorithm mappings.');
    })
    .catch(console.error);
}

module.exports = fetchRealLeetCodeProblems;