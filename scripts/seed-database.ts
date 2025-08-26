import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.$transaction([
    prisma.quizResult.deleteMany(),
    prisma.quiz.deleteMany(),
    prisma.userProgress.deleteMany(),
    prisma.problem.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'demo@speedcoders.com',
        name: 'Demo User',
        password: await bcrypt.hash('demo123', 10),
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin@speedcoders.com',
        name: 'Admin User',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'pro@speedcoders.com',
        name: 'Pro User',
        password: await bcrypt.hash('pro123', 10),
        role: 'USER',
        isPremium: true,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create problems with various difficulties and categories
  const problemData = [
    // Arrays
    {
      title: 'Two Sum',
      description: 'Given an array of integers and a target sum, return indices of two numbers that add up to the target.',
      difficulty: 'Easy',
      category: 'Arrays',
      algorithms: ['Hash Table', 'Array'],
      hints: [
        'Can you solve it in one pass?',
        'Use a hash table to store complements',
      ],
      solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      companies: ['Google', 'Amazon', 'Facebook'],
      frequency: 95,
      acceptanceRate: 47.3,
    },
    {
      title: 'Maximum Subarray',
      description: 'Find the contiguous subarray with the largest sum.',
      difficulty: 'Medium',
      category: 'Arrays',
      algorithms: ['Dynamic Programming', 'Kadane\'s Algorithm'],
      hints: [
        'Think about how the maximum sum changes as you iterate',
        'Can you solve it with dynamic programming?',
      ],
      solution: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  
  return maxSoFar;
}`,
      companies: ['Microsoft', 'LinkedIn', 'Apple'],
      frequency: 88,
      acceptanceRate: 49.1,
    },
    // Strings
    {
      title: 'Valid Palindrome',
      description: 'Determine if a string is a palindrome, considering only alphanumeric characters.',
      difficulty: 'Easy',
      category: 'Strings',
      algorithms: ['Two Pointers', 'String'],
      hints: [
        'Use two pointers from both ends',
        'Skip non-alphanumeric characters',
      ],
      solution: `function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = s.length - 1;
  
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  
  return true;
}`,
      companies: ['Facebook', 'Microsoft'],
      frequency: 76,
      acceptanceRate: 38.7,
    },
    {
      title: 'Longest Substring Without Repeating Characters',
      description: 'Find the length of the longest substring without repeating characters.',
      difficulty: 'Medium',
      category: 'Strings',
      algorithms: ['Sliding Window', 'Hash Table'],
      hints: [
        'Use a sliding window approach',
        'Keep track of character positions',
      ],
      solution: `function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let maxLength = 0;
  let start = 0;
  
  for (let end = 0; end < s.length; end++) {
    if (seen.has(s[end])) {
      start = Math.max(start, seen.get(s[end]) + 1);
    }
    seen.set(s[end], end);
    maxLength = Math.max(maxLength, end - start + 1);
  }
  
  return maxLength;
}`,
      companies: ['Amazon', 'Google', 'Bloomberg'],
      frequency: 92,
      acceptanceRate: 33.8,
    },
    // Trees
    {
      title: 'Binary Tree Inorder Traversal',
      description: 'Return the inorder traversal of a binary tree.',
      difficulty: 'Easy',
      category: 'Trees',
      algorithms: ['Tree', 'DFS', 'Stack'],
      hints: [
        'Can you do it recursively?',
        'Try using a stack for iterative solution',
      ],
      solution: `function inorderTraversal(root) {
  const result = [];
  
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    result.push(node.val);
    inorder(node.right);
  }
  
  inorder(root);
  return result;
}`,
      companies: ['Microsoft', 'Amazon'],
      frequency: 68,
      acceptanceRate: 66.8,
    },
    {
      title: 'Validate Binary Search Tree',
      description: 'Determine if a binary tree is a valid BST.',
      difficulty: 'Medium',
      category: 'Trees',
      algorithms: ['Tree', 'DFS', 'Recursion'],
      hints: [
        'Each node must be within a valid range',
        'Update the range as you traverse',
      ],
      solution: `function isValidBST(root, min = null, max = null) {
  if (!root) return true;
  
  if ((min !== null && root.val <= min) || 
      (max !== null && root.val >= max)) {
    return false;
  }
  
  return isValidBST(root.left, min, root.val) && 
         isValidBST(root.right, root.val, max);
}`,
      companies: ['Facebook', 'Amazon', 'Microsoft'],
      frequency: 84,
      acceptanceRate: 31.7,
    },
    // Dynamic Programming
    {
      title: 'Climbing Stairs',
      description: 'Count the number of ways to climb n stairs (1 or 2 steps at a time).',
      difficulty: 'Easy',
      category: 'Dynamic Programming',
      algorithms: ['Dynamic Programming', 'Fibonacci'],
      hints: [
        'This is similar to Fibonacci',
        'Think about the last step',
      ],
      solution: `function climbStairs(n) {
  if (n <= 2) return n;
  
  let prev1 = 2, prev2 = 1;
  
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}`,
      companies: ['Adobe', 'Amazon'],
      frequency: 72,
      acceptanceRate: 51.7,
    },
    {
      title: 'Longest Common Subsequence',
      description: 'Find the length of the longest common subsequence of two strings.',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      algorithms: ['Dynamic Programming', '2D DP'],
      hints: [
        'Use a 2D DP table',
        'Compare characters and decide',
      ],
      solution: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}`,
      companies: ['Google', 'Amazon'],
      frequency: 79,
      acceptanceRate: 58.9,
    },
    // Graphs
    {
      title: 'Number of Islands',
      description: 'Count the number of islands in a 2D grid.',
      difficulty: 'Medium',
      category: 'Graphs',
      algorithms: ['DFS', 'BFS', 'Union Find'],
      hints: [
        'Use DFS or BFS to explore islands',
        'Mark visited cells',
      ],
      solution: `function numIslands(grid) {
  if (!grid || !grid.length) return 0;
  
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  
  function dfs(i, j) {
    if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] === '0') {
      return;
    }
    
    grid[i][j] = '0';
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  }
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === '1') {
        count++;
        dfs(i, j);
      }
    }
  }
  
  return count;
}`,
      companies: ['Amazon', 'Facebook', 'Google'],
      frequency: 87,
      acceptanceRate: 50.5,
    },
    {
      title: 'Course Schedule',
      description: 'Determine if you can finish all courses given prerequisites.',
      difficulty: 'Medium',
      category: 'Graphs',
      algorithms: ['Topological Sort', 'DFS', 'BFS'],
      hints: [
        'This is a cycle detection problem',
        'Use topological sorting',
      ],
      solution: `function canFinish(numCourses, prerequisites) {
  const graph = Array(numCourses).fill().map(() => []);
  const indegree = Array(numCourses).fill(0);
  
  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    indegree[course]++;
  }
  
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) queue.push(i);
  }
  
  let count = 0;
  while (queue.length) {
    const course = queue.shift();
    count++;
    
    for (const next of graph[course]) {
      indegree[next]--;
      if (indegree[next] === 0) {
        queue.push(next);
      }
    }
  }
  
  return count === numCourses;
}`,
      companies: ['Google', 'Uber', 'Facebook'],
      frequency: 81,
      acceptanceRate: 45.4,
    },
    // Hard Problems
    {
      title: 'Median of Two Sorted Arrays',
      description: 'Find the median of two sorted arrays.',
      difficulty: 'Hard',
      category: 'Arrays',
      algorithms: ['Binary Search', 'Divide and Conquer'],
      hints: [
        'Use binary search on the smaller array',
        'Think about partitioning',
      ],
      solution: `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) {
    return findMedianSortedArrays(nums2, nums1);
  }
  
  const m = nums1.length, n = nums2.length;
  let low = 0, high = m;
  
  while (low <= high) {
    const partitionX = Math.floor((low + high) / 2);
    const partitionY = Math.floor((m + n + 1) / 2) - partitionX;
    
    const maxLeftX = partitionX === 0 ? -Infinity : nums1[partitionX - 1];
    const minRightX = partitionX === m ? Infinity : nums1[partitionX];
    const maxLeftY = partitionY === 0 ? -Infinity : nums2[partitionY - 1];
    const minRightY = partitionY === n ? Infinity : nums2[partitionY];
    
    if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
      if ((m + n) % 2 === 0) {
        return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2;
      } else {
        return Math.max(maxLeftX, maxLeftY);
      }
    } else if (maxLeftX > minRightY) {
      high = partitionX - 1;
    } else {
      low = partitionX + 1;
    }
  }
}`,
      companies: ['Google', 'Amazon', 'Apple'],
      frequency: 74,
      acceptanceRate: 32.8,
    },
    {
      title: 'Regular Expression Matching',
      description: 'Implement regular expression matching with . and *',
      difficulty: 'Hard',
      category: 'Strings',
      algorithms: ['Dynamic Programming', 'Recursion'],
      hints: [
        'Use dynamic programming',
        'Handle * carefully',
      ],
      solution: `function isMatch(s, p) {
  const m = s.length, n = p.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(false));
  dp[0][0] = true;
  
  for (let j = 2; j <= n; j++) {
    if (p[j - 1] === '*') {
      dp[0][j] = dp[0][j - 2];
    }
  }
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === s[i - 1] || p[j - 1] === '.') {
        dp[i][j] = dp[i - 1][j - 1];
      } else if (p[j - 1] === '*') {
        dp[i][j] = dp[i][j - 2];
        if (p[j - 2] === s[i - 1] || p[j - 2] === '.') {
          dp[i][j] = dp[i][j] || dp[i - 1][j];
        }
      }
    }
  }
  
  return dp[m][n];
}`,
      companies: ['Facebook', 'Google', 'Uber'],
      frequency: 69,
      acceptanceRate: 27.7,
    },
  ];

  const problems = await Promise.all(
    problemData.map(data =>
      prisma.problem.create({ data })
    )
  );

  console.log(`✅ Created ${problems.length} problems`);

  // Create quizzes
  const quizzes = await Promise.all([
    prisma.quiz.create({
      data: {
        title: 'Arrays Fundamentals',
        description: 'Master array manipulation techniques',
        difficulty: 'Easy',
        category: 'Arrays',
        timeLimit: 30,
        userId: users[0].id,
        problems: {
          connect: problems
            .filter(p => p.category === 'Arrays' && p.difficulty === 'Easy')
            .map(p => ({ id: p.id }))
        },
      },
    }),
    prisma.quiz.create({
      data: {
        title: 'Dynamic Programming Challenge',
        description: 'Test your DP skills',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        timeLimit: 45,
        userId: users[1].id,
        problems: {
          connect: problems
            .filter(p => p.category === 'Dynamic Programming')
            .map(p => ({ id: p.id }))
        },
      },
    }),
    prisma.quiz.create({
      data: {
        title: 'Interview Preparation Mix',
        description: 'Popular interview questions from top companies',
        difficulty: 'Mixed',
        category: 'Mixed',
        timeLimit: 60,
        userId: users[2].id,
        problems: {
          connect: problems
            .filter(p => p.frequency > 80)
            .slice(0, 5)
            .map(p => ({ id: p.id }))
        },
      },
    }),
  ]);

  console.log(`✅ Created ${quizzes.length} quizzes`);

  // Create user progress
  const progressData = [];
  for (const user of users) {
    for (let i = 0; i < Math.min(5, problems.length); i++) {
      progressData.push({
        userId: user.id,
        problemId: problems[i].id,
        status: i < 3 ? 'SOLVED' : 'ATTEMPTED',
        attemptCount: Math.floor(Math.random() * 3) + 1,
        lastAttempted: new Date(),
        timeTaken: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
        hintsUsed: Math.floor(Math.random() * 2),
      });
    }
  }

  await prisma.userProgress.createMany({
    data: progressData,
  });

  console.log(`✅ Created ${progressData.length} progress records`);

  // Create quiz results
  const quizResults = await Promise.all([
    prisma.quizResult.create({
      data: {
        quizId: quizzes[0].id,
        userId: users[0].id,
        score: 85,
        completedAt: new Date(),
        timeSpent: 1500,
        correctAnswers: 17,
        totalQuestions: 20,
      },
    }),
    prisma.quizResult.create({
      data: {
        quizId: quizzes[1].id,
        userId: users[0].id,
        score: 72,
        completedAt: new Date(),
        timeSpent: 2100,
        correctAnswers: 14,
        totalQuestions: 20,
      },
    }),
  ]);

  console.log(`✅ Created ${quizResults.length} quiz results`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });