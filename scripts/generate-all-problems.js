const fs = require('fs');
const path = require('path');

// Sample algorithm categories for assignment
const algorithmCategories = [
  ["Hash Table", "Array", "Two Pointers"],
  ["Linked List", "Math", "Recursion"],
  ["Hash Table", "String", "Sliding Window"],
  ["Array", "Binary Search", "Divide and Conquer"],
  ["String", "Dynamic Programming", "Two Pointers"],
  ["Array", "Two Pointers", "Greedy"],
  ["Array", "Two Pointers", "Sorting"],
  ["Stack", "String"],
  ["Linked List", "Two Pointers", "Divide and Conquer"],
  ["Array", "Dynamic Programming", "Greedy"],
  ["Dynamic Programming", "Math"],
  ["Tree", "Depth-First Search", "Breadth-First Search"],
  ["Array", "Dynamic Programming", "Greedy"],
  ["Two Pointers", "String"],
  ["Matrix", "Depth-First Search", "Breadth-First Search", "Union Find"],
  ["Linked List", "Two Pointers"],
  ["Tree", "Depth-First Search", "Breadth-First Search"],
  ["Array", "Prefix Sum"],
  ["Array", "Dynamic Programming", "Binary Search"],
  ["Array", "Dynamic Programming", "Breadth-First Search"],
  ["Array", "Hash Table", "Heap", "Sorting", "Counting"],
  ["Hash Table", "String", "Sliding Window"],
  ["String", "Backtracking"],
  ["Array", "Backtracking", "Matrix"],
  ["Tree", "Depth-First Search", "Breadth-First Search"],
  ["Dynamic Programming", "String"],
  ["Tree", "Depth-First Search"],
  ["Array", "Hash Table", "Stack", "Monotonic Stack"],
  ["Array", "Two Pointers", "Binary Search"],
  ["Array", "Hash Table", "Divide and Conquer", "Sorting"],
  ["Tree", "Depth-First Search", "Breadth-First Search"],
  ["Array", "Greedy", "Sorting"],
  ["String", "Hash Table", "Two Pointers"],
  ["Linked List", "Two Pointers"],
  ["Array", "Hash Table", "Two Pointers", "Binary Search", "Sorting"],
  ["Tree", "Depth-First Search", "Breadth-First Search"],
  ["Dynamic Programming", "Combinatorics"],
  ["Array", "Hash Table", "Two Pointers", "Sorting"],
  ["String", "Two Pointers"],
  ["Array", "Hash Table", "Stack", "Heap"],
  ["Array", "Binary Search"],
  ["Array", "Two Pointers", "Greedy"],
  ["Tree", "Depth-First Search", "Breadth-First Search"],
  ["Array", "Hash Table", "String"],
  ["Matrix", "Simulation"],
  ["String", "Dynamic Programming"],
  ["Array", "Hash Table", "Math", "Two Pointers", "Sorting"],
  ["Array", "Greedy", "Sorting"],
  ["String", "Backtracking"],
  ["Array", "Backtracking"]
];

const difficulties = ["Easy", "Medium", "Hard"];

// Function to get random algorithm set
function getRandomAlgorithms() {
  const randomIndex = Math.floor(Math.random() * algorithmCategories.length);
  return algorithmCategories[randomIndex];
}

// Function to get random difficulty
function getRandomDifficulty() {
  return difficulties[Math.floor(Math.random() * difficulties.length)];
}

// Generate problem titles (you would replace these with actual LeetCode titles)
const problemTitleTemplates = [
  "Array Problem", "String Problem", "Tree Problem", "Graph Problem",
  "Dynamic Programming Problem", "Greedy Problem", "Math Problem",
  "Binary Search Problem", "Two Pointers Problem", "Sliding Window Problem",
  "Hash Table Problem", "Stack Problem", "Queue Problem", "Heap Problem",
  "Trie Problem", "Union Find Problem", "Backtracking Problem",
  "Bit Manipulation Problem", "Sorting Problem", "Linked List Problem"
];

function generateProblems() {
  const problems = [];
  
  for (let i = 1; i <= 3662; i++) {
    const templateIndex = (i - 1) % problemTitleTemplates.length;
    const title = `${problemTitleTemplates[templateIndex]} ${Math.ceil(i / problemTitleTemplates.length)}`;
    
    problems.push({
      id: i,
      title: title,
      difficulty: getRandomDifficulty(),
      algorithms: getRandomAlgorithms(),
      description: `Problem ${i}: ${title}. This is a sample description for demonstration purposes.`,
      agentAssigned: Math.floor((i - 1) / 100) + 1, // Assign to agent groups of 100
      processed: false
    });
  }
  
  return problems;
}

// Generate all problems
console.log('Generating all 3662 LeetCode problems...');
const allProblems = generateProblems();

// Save to JSON file
const outputPath = path.join(__dirname, '../data/all-leetcode-problems.json');
fs.writeFileSync(outputPath, JSON.stringify(allProblems, null, 2));

console.log(`✅ Generated ${allProblems.length} problems and saved to ${outputPath}`);

// Create agent distribution
const agentGroups = {};
allProblems.forEach(problem => {
  const agentId = problem.agentAssigned;
  if (!agentGroups[agentId]) {
    agentGroups[agentId] = [];
  }
  agentGroups[agentId].push(problem);
});

console.log(`📊 Created ${Object.keys(agentGroups).length} agent groups`);
console.log(`📝 Each agent processes ~100 problems on average`);

// Save agent distribution
const agentDistPath = path.join(__dirname, '../data/agent-distribution.json');
fs.writeFileSync(agentDistPath, JSON.stringify(agentGroups, null, 2));

console.log(`🤖 Agent distribution saved to ${agentDistPath}`);