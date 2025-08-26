const fs = require('fs');
const path = require('path');

// Read the generated problems
const problemsPath = path.join(__dirname, '../data/all-leetcode-problems.json');
const problems = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));

// Generate README table content
function generateReadmeTable() {
  let tableContent = `## 📚 All 3662 LeetCode Problems

| # | Problem | Difficulty | Algorithms | Agent |
|---|---------|------------|------------|-------|
`;

  problems.forEach(problem => {
    const algorithmsStr = problem.algorithms.join(', ');
    tableContent += `| ${problem.id} | ${problem.title} | ${problem.difficulty} | ${algorithmsStr} | Agent ${problem.agentAssigned} |\n`;
  });

  return tableContent;
}

// Read current README
const readmePath = path.join(__dirname, '../README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf8');

// Find the section to replace (after the current problems table)
const startMarker = '## 📚 LeetCode Problems Included';
const endMarker = '## 🛠 Algorithm Types Covered';

const startIndex = readmeContent.indexOf(startMarker);
const endIndex = readmeContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  // Replace the section
  const beforeSection = readmeContent.substring(0, startIndex);
  const afterSection = readmeContent.substring(endIndex);
  
  const newTableContent = generateReadmeTable();
  
  const updatedReadme = beforeSection + newTableContent + '\n' + afterSection;
  
  // Write updated README
  fs.writeFileSync(readmePath, updatedReadme);
  
  console.log('✅ README.md updated with all 3662 problems');
  console.log(`📊 Total problems: ${problems.length}`);
  console.log(`🤖 Agent groups: ${Math.max(...problems.map(p => p.agentAssigned))}`);
} else {
  console.error('❌ Could not find sections to replace in README.md');
}

// Generate summary statistics
const difficultyCount = problems.reduce((acc, problem) => {
  acc[problem.difficulty] = (acc[problem.difficulty] || 0) + 1;
  return acc;
}, {});

const agentCount = Math.max(...problems.map(p => p.agentAssigned));

console.log('\n📈 Statistics:');
console.log(`Easy: ${difficultyCount.Easy || 0}`);
console.log(`Medium: ${difficultyCount.Medium || 0}`);
console.log(`Hard: ${difficultyCount.Hard || 0}`);
console.log(`Total Agents: ${agentCount}`);