import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Extremely advanced problems from batch4 (problems 1501-2000)
    const batch4Problems = [
      // Ultra Advanced Dynamic Programming Problems
      {
        title: 'Minimum Cost to Cut a Stick',
        difficulty: 'Hard',
        category: 'Dynamic Programming',
        description: 'Given a wooden stick of length n units. The stick is labelled from 0 to n. Given an integer array cuts where cuts[i] denotes where you should cut the stick.',
        examples: JSON.stringify([
          { input: 'n = 7, cuts = [1,3,4,5]', output: '16', explanation: 'The first cut is made at position 1, the second at position 3, the third at position 4, and the fourth at position 5.' },
          { input: 'n = 9, cuts = [5,6,1,4,2]', output: '22', explanation: 'The cuts are made at positions 1, 2, 4, 5, and 6.' }
        ]),
        constraints: JSON.stringify([
          '2 <= n <= 106',
          '1 <= cuts.length <= min(n - 1, 100)',
          '1 <= cuts[i] <= n - 1',
          'All the integers in cuts array are distinct.'
        ]),
        solutions: JSON.stringify(['Array', 'Dynamic Programming', 'Memoization']),
        leetcodeUrl: 'https://leetcode.com/problems/minimum-cost-to-cut-a-stick/'
      },
      {
        title: 'Paint House III',
        difficulty: 'Hard',
        category: 'Dynamic Programming',
        description: 'There is a row of m houses in a small city, each house must be painted with one of the n colors (labeled from 1 to n).',
        examples: JSON.stringify([
          { input: 'houses = [0,0,0,0,0], cost = [[1,10],[10,1],[10,1],[1,10],[5,1]], m = 5, n = 2, target = 3', output: '9', explanation: 'Paint houses of this way [1,2,2,1,1].' },
          { input: 'houses = [0,2,1,2,0], cost = [[1,10],[10,1],[10,1],[1,10],[5,1]], m = 5, n = 2, target = 3', output: '11', explanation: 'Some houses are already painted, so we need to paint the remaining houses.' }
        ]),
        constraints: JSON.stringify([
          'm == houses.length == cost.length',
          'n == cost[i].length',
          '1 <= m <= 100',
          '1 <= n <= 20',
          '1 <= target <= m'
        ]),
        solutions: JSON.stringify(['Array', 'Dynamic Programming', 'Memoization']),
        leetcodeUrl: 'https://leetcode.com/problems/paint-house-iii/'
      },
      {
        title: 'Maximum Profit in Job Scheduling',
        difficulty: 'Hard',
        category: 'Dynamic Programming',
        description: 'We have n jobs, where every job is scheduled to be done from startTime[i] to endTime[i], obtaining a profit of profit[i].',
        examples: JSON.stringify([
          { input: 'startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]', output: '120', explanation: 'The subset chosen is the first and fourth job.' },
          { input: 'startTime = [1,2,3,4,6], endTime = [3,5,10,6,9], profit = [20,20,100,70,60]', output: '150', explanation: 'The subset chosen is the first, fourth and fifth job.' }
        ]),
        constraints: JSON.stringify([
          '1 <= startTime.length == endTime.length == profit.length <= 5 * 104',
          '1 <= startTime[i] < endTime[i] <= 109',
          '1 <= profit[i] <= 104'
        ]),
        solutions: JSON.stringify(['Array', 'Dynamic Programming', 'Binary Search']),
        leetcodeUrl: 'https://leetcode.com/problems/maximum-profit-in-job-scheduling/'
      },

      // Ultra Advanced Graph Problems
      {
        title: 'Critical Connections in a Network',
        difficulty: 'Hard',
        category: 'Graph',
        description: 'There are n servers numbered from 0 to n-1 connected by undirected server-to-server connections forming a network.',
        examples: JSON.stringify([
          { input: 'n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]', output: '[[1,3]]', explanation: '[[3,1]] is also accepted.' },
          { input: 'n = 2, connections = [[0,1]]', output: '[[0,1]]', explanation: 'The only critical connection is [0,1].' }
        ]),
        constraints: JSON.stringify([
          '2 <= n <= 105',
          'n - 1 <= connections.length <= 105',
          '0 <= ai, bi <= n - 1',
          'ai != bi',
          'There are no repeated connections.'
        ]),
        solutions: JSON.stringify(['Graph', 'DFS', 'Tarjan\'s Algorithm']),
        leetcodeUrl: 'https://leetcode.com/problems/critical-connections-in-a-network/'
      },
      {
        title: 'Minimum Cost to Reach Destination in Time',
        difficulty: 'Hard',
        category: 'Graph',
        description: 'There is a country of n cities numbered from 0 to n - 1 and n - 1 roads such that there is only one way to travel between two different cities.',
        examples: JSON.stringify([
          { input: 'maxTime = 30, edges = [[0,1,10],[1,2,10],[2,5,10],[0,3,1],[3,4,10],[4,5,15]], passingFees = [5,1,2,20,20,3]', output: '11', explanation: 'The path to take is 0 -> 1 -> 2 -> 5, which takes 30 minutes and has $11 worth of passing fees.' },
          { input: 'maxTime = 29, edges = [[0,1,10],[1,2,10],[2,5,10],[0,3,1],[3,4,10],[4,5,15]], passingFees = [5,1,2,20,20,3]', output: '48', explanation: 'The path to take is 0 -> 3 -> 4 -> 5, which takes 26 minutes and has $48 worth of passing fees.' }
        ]),
        constraints: JSON.stringify([
          '1 <= maxTime <= 1000',
          'n == passingFees.length',
          '2 <= n <= 1000',
          'n - 1 <= edges.length <= 1000',
          'edges[i].length == 3',
          '0 <= ui < vi <= n - 1'
        ]),
        solutions: JSON.stringify(['Graph', 'Dynamic Programming', 'Dijkstra\'s Algorithm']),
        leetcodeUrl: 'https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/'
      },
      {
        title: 'Parallel Courses III',
        difficulty: 'Hard',
        category: 'Graph',
        description: 'You are given an integer n, which indicates that there are n courses labeled from 1 to n. You are also given a 2D integer array relations.',
        examples: JSON.stringify([
          { input: 'n = 3, relations = [[1,3],[2,3]], time = [3,2,5]', output: '8', explanation: 'The figure above represents the given graph and the time required to complete each course.' },
          { input: 'n = 5, relations = [[1,5],[2,5],[3,5],[3,4],[4,5]], time = [1,2,3,4,5]', output: '12', explanation: 'The figure above represents the given graph and the time required to complete each course.' }
        ]),
        constraints: JSON.stringify([
          '1 <= n <= 5 * 104',
          '0 <= relations.length <= min(n * (n - 1) / 2, 5 * 104)',
          'relations[i].length == 2',
          '1 <= prevCoursei, nextCoursei <= n',
          'prevCoursei != nextCoursei',
          'All the pairs [prevCoursei, nextCoursei] are unique.',
          'time.length == n',
          '1 <= time[i] <= 104'
        ]),
        solutions: JSON.stringify(['Graph', 'Topological Sort', 'Dynamic Programming']),
        leetcodeUrl: 'https://leetcode.com/problems/parallel-courses-iii/'
      },

      // Ultra Advanced String Problems
      {
        title: 'Longest Happy String',
        difficulty: 'Medium',
        category: 'String',
        description: 'A string is called happy if it does not contain any of the strings "aaa", "bbb" or "ccc" as a substring.',
        examples: JSON.stringify([
          { input: 'a = 1, b = 1, c = 7', output: '"ccaccbcc"', explanation: '"ccbccacc" would also be a correct answer.' },
          { input: 'a = 7, b = 1, c = 0', output: '"aabaa"', explanation: 'It is the only correct answer in this case.' }
        ]),
        constraints: JSON.stringify([
          '0 <= a, b, c <= 100',
          'a + b + c > 0'
        ]),
        solutions: JSON.stringify(['String', 'Greedy', 'Heap']),
        leetcodeUrl: 'https://leetcode.com/problems/longest-happy-string/'
      },
      {
        title: 'Find the Closest Palindrome',
        difficulty: 'Hard',
        category: 'String',
        description: 'Given a string n representing an integer, return the closest integer (not including itself), which is a palindrome.',
        examples: JSON.stringify([
          { input: 'n = "123"', output: '"121"', explanation: 'The closest palindrome is 121.' },
          { input: 'n = "1"', output: '"0"', explanation: 'The closest palindrome is 0.' }
        ]),
        constraints: JSON.stringify([
          '1 <= n.length <= 18',
          'n consists of only digits.',
          'n does not have leading zeros.',
          'n is not a palindrome.'
        ]),
        solutions: JSON.stringify(['String', 'Math']),
        leetcodeUrl: 'https://leetcode.com/problems/find-the-closest-palindrome/'
      },
      {
        title: 'Valid Number',
        difficulty: 'Hard',
        category: 'String',
        description: 'A valid number can be split up into these components (in order): A decimal number or an integer.',
        examples: JSON.stringify([
          { input: 's = "0"', output: 'true', explanation: 'Valid number.' },
          { input: 's = "e"', output: 'false', explanation: 'Not a valid number.' },
          { input: 's = "."', output: 'false', explanation: 'Not a valid number.' }
        ]),
        constraints: JSON.stringify([
          '1 <= s.length <= 20',
          's consists of only English letters (both uppercase and lowercase), digits (0-9), plus \'+\', minus \'-\', or decimal point \'.\'.'
        ]),
        solutions: JSON.stringify(['String', 'State Machine']),
        leetcodeUrl: 'https://leetcode.com/problems/valid-number/'
      },

      // Ultra Advanced Array Problems
      {
        title: 'Maximum Sum of 3 Non-Overlapping Subarrays',
        difficulty: 'Hard',
        category: 'Array',
        description: 'Given an integer array nums and an integer k, find three non-overlapping subarrays of length k with maximum sum.',
        examples: JSON.stringify([
          { input: 'nums = [1,2,1,2,6,7,5,1], k = 2', output: '[0,3,5]', explanation: 'Subarrays [1, 2], [2, 6], [7, 5] correspond to the cases above, and we have max sum = 1 + 2 + 6 + 7 + 5 = 21.' },
          { input: 'nums = [1,2,1,2,1,2,1,2,1], k = 2', output: '[0,2,4]', explanation: 'Subarrays [1, 2], [1, 2], [1, 2] correspond to the cases above, and we have max sum = 1 + 2 + 1 + 2 + 1 + 2 = 9.' }
        ]),
        constraints: JSON.stringify([
          '1 <= nums.length <= 2 * 104',
          '1 <= nums[i] < 216',
          '1 <= k <= floor(nums.length / 3)'
        ]),
        solutions: JSON.stringify(['Array', 'Dynamic Programming']),
        leetcodeUrl: 'https://leetcode.com/problems/maximum-sum-of-3-non-overlapping-subarrays/'
      },
      {
        title: 'Sliding Window Maximum',
        difficulty: 'Hard',
        category: 'Array',
        description: 'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right.',
        examples: JSON.stringify([
          { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', explanation: 'Window position: [1 3 -1] -3 5 3 6 7, Max: 3' },
          { input: 'nums = [1], k = 1', output: '[1]', explanation: 'Window position: [1], Max: 1' }
        ]),
        constraints: JSON.stringify([
          '1 <= nums.length <= 105',
          '-104 <= nums[i] <= 104',
          '1 <= k <= nums.length'
        ]),
        solutions: JSON.stringify(['Array', 'Sliding Window', 'Monotonic Queue']),
        leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum/'
      },
      {
        title: 'Minimum Window Substring',
        difficulty: 'Hard',
        category: 'Array',
        description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.',
        examples: JSON.stringify([
          { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: 'The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.' },
          { input: 's = "a", t = "a"', output: '"a"', explanation: 'The entire string s is the minimum window.' }
        ]),
        constraints: JSON.stringify([
          'm == s.length',
          'n == t.length',
          '1 <= m, n <= 105',
          's and t consist of uppercase and lowercase English letters.'
        ]),
        solutions: JSON.stringify(['String', 'Sliding Window', 'Two Pointers']),
        leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/'
      },

      // Ultra Advanced Tree Problems
      {
        title: 'Serialize and Deserialize N-ary Tree',
        difficulty: 'Hard',
        category: 'Tree',
        description: 'Design an algorithm to serialize and deserialize an N-ary tree. An N-ary tree is a rooted tree in which each node has no more than N children.',
        examples: JSON.stringify([
          { input: 'root = [1,null,3,2,4,null,5,6]', output: '[1,null,3,2,4,null,5,6]', explanation: 'The tree is serialized and then deserialized.' },
          { input: 'root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]', output: '[1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]', explanation: 'The tree is serialized and then deserialized.' }
        ]),
        constraints: JSON.stringify([
          'The height of the n-ary tree is less than or equal to 1000',
          'The total number of nodes is between [0, 10^4]',
          'Do not use class member/global/static variables to store states. Your serialize and deserialize algorithms should be stateless.'
        ]),
        solutions: JSON.stringify(['Tree', 'DFS', 'String']),
        leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-n-ary-tree/'
      },
      {
        title: 'Binary Tree Maximum Path Sum',
        difficulty: 'Hard',
        category: 'Tree',
        description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them.',
        examples: JSON.stringify([
          { input: 'root = [1,2,3]', output: '6', explanation: 'The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.' },
          { input: 'root = [-10,9,20,null,null,15,7]', output: '42', explanation: 'The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.' }
        ]),
        constraints: JSON.stringify([
          'The number of nodes in the tree is in the range [1, 3 * 104].',
          '-1000 <= Node.val <= 1000'
        ]),
        solutions: JSON.stringify(['Tree', 'DFS', 'Dynamic Programming']),
        leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/'
      },
      {
        title: 'Binary Tree Vertical Order Traversal',
        difficulty: 'Medium',
        category: 'Tree',
        description: 'Given the root of a binary tree, return the vertical order traversal of its nodes\' values.',
        examples: JSON.stringify([
          { input: 'root = [3,9,20,null,null,15,7]', output: '[[9],[3,15],[20],[7]]', explanation: 'Column -1: Only node 9 is in this column.' },
          { input: 'root = [1,2,3,4,5,6,7]', output: '[[4],[2],[1,5,6],[3],[7]]', explanation: 'Column -2: Only node 4 is in this column.' }
        ]),
        constraints: JSON.stringify([
          'The number of nodes in the tree is in the range [0, 100].',
          '-100 <= Node.val <= 100'
        ]),
        solutions: JSON.stringify(['Tree', 'BFS', 'Hash Table']),
        leetcodeUrl: 'https://leetcode.com/problems/binary-tree-vertical-order-traversal/'
      },

      // Ultra Advanced Design Problems
      {
        title: 'Design Search Autocomplete System',
        difficulty: 'Hard',
        category: 'Design',
        description: 'Design a search autocomplete system for a search engine. Users may input a sentence (at least one word and end with a special character \'#\').',
        examples: JSON.stringify([
          { input: '["AutocompleteSystem", "input", "input", "input", "input"]\n[[["i love you", "island", "iroman", "i love leetcode"], [5, 3, 2, 2]], ["i"], [" "], ["a"], ["#"]]', output: '[null, ["i love you", "island", "i love leetcode"], ["i love you", "i love leetcode"], [], []]', explanation: 'AutocompleteSystem obj = new AutocompleteSystem(["i love you", "island", "iroman", "i love leetcode"], [5, 3, 2, 2]);' }
        ]),
        constraints: JSON.stringify([
          '1 <= sentences.length <= 100',
          '1 <= sentences[i].length <= 100',
          '1 <= times.length <= 100',
          '1 <= times[i] <= 50',
          'sentences[i] consists of lowercase English letters and spaces.',
          '1 <= c <= 26',
          'c is a lowercase English letter, a hash \'#\', or space \' \'.',
          'At most 1000 calls will be made to input.'
        ]),
        solutions: JSON.stringify(['Hash Table', 'String', 'Design', 'Trie']),
        leetcodeUrl: 'https://leetcode.com/problems/design-search-autocomplete-system/'
      },
      {
        title: 'Design a Leaderboard',
        difficulty: 'Medium',
        category: 'Design',
        description: 'Design a Leaderboard class, which has 3 functions: addScore(playerId, score), top(K), and reset(playerId).',
        examples: JSON.stringify([
          { input: '["Leaderboard","addScore","addScore","addScore","addScore","addScore","top","reset","reset","addScore","top"]\n[[],[1,73],[2,56],[3,39],[4,51],[5,4],[1],[1],[2],[2,51],[3]]', output: '[null,null,null,null,null,null,73,null,null,null,141]', explanation: 'Leaderboard leaderboard = new Leaderboard();' }
        ]),
        constraints: JSON.stringify([
          '1 <= playerId, K <= 10000',
          'It\'s guaranteed that K is less than or equal to the current number of players.',
          '1 <= score <= 100',
          'There will be at most 1000 function calls.'
        ]),
        solutions: JSON.stringify(['Hash Table', 'Design', 'Heap']),
        leetcodeUrl: 'https://leetcode.com/problems/design-a-leaderboard/'
      },
      {
        title: 'Design Hit Counter',
        difficulty: 'Medium',
        category: 'Design',
        description: 'Design a hit counter which counts the number of hits received in the past 5 minutes.',
        examples: JSON.stringify([
          { input: '["HitCounter", "hit", "hit", "hit", "getHits", "hit", "getHits", "getHits"]\n[[], [1], [2], [3], [4], [300], [300], [301]]', output: '[null, null, null, null, 3, null, 4, 3]', explanation: 'HitCounter hitCounter = new HitCounter();' }
        ]),
        constraints: JSON.stringify([
          '1 <= timestamp <= 2 * 109',
          'All the calls are being made to the system in chronological order (i.e., timestamp is monotonically increasing).',
          'At most 300 calls will be made to hit and getHits.'
        ]),
        solutions: JSON.stringify(['Design', 'Queue']),
        leetcodeUrl: 'https://leetcode.com/problems/design-hit-counter/'
      },

      // Ultra Advanced Database Problems
      {
        title: 'Active Users',
        difficulty: 'Hard',
        category: 'Database',
        description: 'Write an SQL query to find the id and the name of active users. Active users are those who logged in to their accounts for 5 or more consecutive days.',
        examples: JSON.stringify([
          { input: 'Accounts table: [[1, "Winston"], [7, "Jonathan"]]\nLogins table: [[7, 2020-05-30], [1, 2020-05-30], [7, 2020-05-31], [7, 2020-06-01], [7, 2020-06-02], [7, 2020-06-02], [7, 2020-06-03], [1, 2020-06-07], [7, 2020-06-10]]', output: '[[7, "Jonathan"]]', explanation: 'User 7 logged in 5 consecutive days in June 2020. User 1 logged in 2 consecutive days only, so he is not an active user.' }
        ]),
        constraints: JSON.stringify([
          'Use window functions with date arithmetic.',
          'Handle consecutive day calculations.'
        ]),
        solutions: JSON.stringify(['Database', 'SQL', 'Window Function']),
        leetcodeUrl: 'https://leetcode.com/problems/active-users/'
      },
      {
        title: 'Calculate Salaries',
        difficulty: 'Medium',
        category: 'Database',
        description: 'Write an SQL query to find the salaries of the employees after applying taxes.',
        examples: JSON.stringify([
          { input: 'Salaries table: [[1, 2000], [2, 3000], [3, 2000], [4, 5000], [5, 6000], [6, 7000], [7, 8000], [8, 9000], [9, 10000], [10, 10000]]', output: '[[1, 1500.00], [2, 2100.00], [3, 1500.00], [4, 3500.00], [5, 4200.00], [6, 4900.00], [7, 5600.00], [8, 6300.00], [9, 7000.00], [10, 7000.00]]', explanation: 'Tax rates applied based on salary ranges.' }
        ]),
        constraints: JSON.stringify([
          'Use CASE statements for tax calculations.',
          'Handle different tax rates for different salary ranges.'
        ]),
        solutions: JSON.stringify(['Database', 'SQL', 'Case Statement']),
        leetcodeUrl: 'https://leetcode.com/problems/calculate-salaries/'
      },
      {
        title: 'Restaurant Growth',
        difficulty: 'Medium',
        category: 'Database',
        description: 'Write an SQL query to compute the moving average of how much customer paid in a 7 days window.',
        examples: JSON.stringify([
          { input: 'Customer table: [[1, 1, 100, 2019-07-01], [2, 2, 200, 2019-07-01], [3, 2, 300, 2019-07-01], [4, 3, 400, 2019-07-01], [5, 4, 500, 2019-07-02], [6, 1, 600, 2019-07-02], [7, 2, 700, 2019-07-02], [8, 3, 800, 2019-07-02], [9, 4, 900, 2019-07-03]]', output: '[[2019-07-01, 250.00], [2019-07-02, 500.00], [2019-07-03, 600.00]]', explanation: 'Moving average of customer payments over 7-day windows.' }
        ]),
        constraints: JSON.stringify([
          'Use window functions with date ranges.',
          'Handle moving average calculations.'
        ]),
        solutions: JSON.stringify(['Database', 'SQL', 'Window Function']),
        leetcodeUrl: 'https://leetcode.com/problems/restaurant-growth/'
      },

      // Ultra Advanced Math Problems
      {
        title: 'Count Different Palindromic Subsequences',
        difficulty: 'Hard',
        category: 'Math',
        description: 'Given a string s, return the number of different non-empty palindromic subsequences in s. Since the answer may be very large, return it modulo 109 + 7.',
        examples: JSON.stringify([
          { input: 's = "bccb"', output: '6', explanation: 'The 6 different non-empty palindromic subsequences are: "b", "c", "bb", "cc", "bcb", "bccb".' },
          { input: 's = "abcdabcdabcdabcdabcdabcdabcdabcddcbadcbadcbadcbadcbadcbadcbadcba"', output: '104860361', explanation: 'There are 3104860382 different non-empty palindromic subsequences, which is 104860361 modulo 109 + 7.' }
        ]),
        constraints: JSON.stringify([
          '1 <= s.length <= 1000',
          's consists of lowercase English letters.'
        ]),
        solutions: JSON.stringify(['String', 'Dynamic Programming', 'Memoization']),
        leetcodeUrl: 'https://leetcode.com/problems/count-different-palindromic-subsequences/'
      },
      {
        title: 'Number of Digit One',
        difficulty: 'Hard',
        category: 'Math',
        description: 'Given an integer n, count the total number of digit 1 appearing in all non-negative integers less than or equal to n.',
        examples: JSON.stringify([
          { input: 'n = 13', output: '6', explanation: 'Digit 1 occurred in the following numbers: 1, 10, 11, 12, 13.' },
          { input: 'n = 0', output: '0', explanation: 'No digit 1 appears in numbers less than or equal to 0.' }
        ]),
        constraints: JSON.stringify([
          '0 <= n <= 109'
        ]),
        solutions: JSON.stringify(['Math', 'Dynamic Programming']),
        leetcodeUrl: 'https://leetcode.com/problems/number-of-digit-one/'
      },
      {
        title: 'Integer to English Words',
        difficulty: 'Hard',
        category: 'Math',
        description: 'Convert a non-negative integer num to its English words representation.',
        examples: JSON.stringify([
          { input: 'num = 123', output: '"One Hundred Twenty Three"', explanation: '123 is written as "One Hundred Twenty Three".' },
          { input: 'num = 12345', output: '"Twelve Thousand Three Hundred Forty Five"', explanation: '12345 is written as "Twelve Thousand Three Hundred Forty Five".' },
          { input: 'num = 1234567', output: '"One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven"', explanation: '1234567 is written as "One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven".' }
        ]),
        constraints: JSON.stringify([
          '0 <= num <= 231 - 1'
        ]),
        solutions: JSON.stringify(['Math', 'String', 'Recursion']),
        leetcodeUrl: 'https://leetcode.com/problems/integer-to-english-words/'
      }
    ];

    // Insert all batch4 problems
    for (const problem of batch4Problems) {
      await supabase.from('problems').upsert(problem, { onConflict: 'title' });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${batch4Problems.length} ultra-advanced problems from batch4 (problems 1501-2000) covering extremely complex algorithmic concepts including:
      - Ultra Advanced Dynamic Programming (Minimum Cost to Cut Stick, Paint House III, Job Scheduling)
      - Advanced Graph Algorithms (Critical Connections, Minimum Cost with Time, Parallel Courses)
      - Complex String Processing (Longest Happy String, Closest Palindrome, Valid Number)
      - Advanced Array Operations (3 Non-overlapping Subarrays, Sliding Window Maximum, Minimum Window)
      - Complex Tree Algorithms (Serialize N-ary Tree, Maximum Path Sum, Vertical Order)
      - Advanced System Design (Search Autocomplete, Leaderboard, Hit Counter)
      - Complex Database (Active Users, Calculate Salaries, Restaurant Growth)
      - Advanced Mathematical Algorithms (Palindromic Subsequences, Digit One, Integer to English)` 
    });

  } catch (error) {
    console.error('Batch4 problem seeding error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed batch4 problems' 
    }, { status: 500 });
  }
}
