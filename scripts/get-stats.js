const fs = require('fs');
const path = require('path');

// Load the verified problems data
const dataPath = path.join(__dirname, '../data/verified-leetcode-problems.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('📊 Real LeetCode Problems Statistics:');
console.log('Total Problems:', data.problems.length);

const stats = data.problems.reduce((acc, p) => { 
  acc[p.difficulty] = (acc[p.difficulty] || 0) + 1; 
  return acc; 
}, {});

console.log('Easy:', stats.Easy, '(' + Math.round(stats.Easy/data.problems.length*100) + '%)');
console.log('Medium:', stats.Medium, '(' + Math.round(stats.Medium/data.problems.length*100) + '%)');
console.log('Hard:', stats.Hard, '(' + Math.round(stats.Hard/data.problems.length*100) + '%)');

const free = data.problems.filter(p => !p.isPremium).length;
console.log('Free Problems:', free, '(' + Math.round(free/data.problems.length*100) + '%)');
console.log('Premium Problems:', data.problems.length - free, '(' + Math.round((data.problems.length - free)/data.problems.length*100) + '%)');

const algorithms = new Set();
data.problems.forEach(p => p.algorithms.forEach(a => algorithms.add(a)));
console.log('Total Algorithms:', algorithms.size);

// Sample of real problems
console.log('\n📋 Sample Real Problems:');
data.problems.slice(0, 10).forEach(problem => {
  console.log(`  ${problem.id}: ${problem.title} (${problem.difficulty}) - ${problem.acceptanceRate}`);
});