import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Advanced problems from batch2.js data
    const batch2Problems = [
      // Advanced Dynamic Programming Problems
      {
        title: 'Remove Boxes',
        difficulty: 'Hard',
        category: 'Dynamic Programming',
        description: 'Given several boxes with different colors represented by different positive numbers, you may experience several rounds to remove boxes until there is no box left.',
        examples: JSON.stringify([
          { input: 'boxes = [1,3,2,2,2,3,4,3,1]', output: '23', explanation: '[1, 3, 2, 2, 2, 3, 4, 3, 1] --> [1, 3, 3, 4, 3, 1] --> [1, 3, 3, 3, 1] --> [1, 1] --> []' },
          { input: 'boxes = [1,1,1]', output: '9', explanation: 'Remove all boxes at once.' }
        ]),
        constraints: JSON.stringify([
          '1 <= boxes.length <= 100',
          '1 <= boxes[i] <= 100'
        ]),
        solutions: JSON.stringify(['Array', 'Dynamic Programming', 'Memoization']),
        leetcodeUrl: 'https://leetcode.com/problems/remove-boxes/'
      },
      {
        title: 'Student Attendance Record II',
        difficulty: 'Hard',
        category: 'Dynamic Programming',
        description: 'An attendance record for a student can be represented as a string where each character signifies whether the student was absent, late, or present on that day.',
        examples: JSON.stringify([
          { input: 'n = 2', output: '8', explanation: 'There are 8 records with length 2 that are eligible for an award: "PP", "AP", "PA", "LP", "PL", "AL", "LA", "LL"' },
          { input: 'n = 1', output: '3', explanation: 'The 3 eligible records are "P", "A", "L".' }
        ]),
        constraints: JSON.stringify([
          '1 <= n <= 105'
        ]),
        solutions: JSON.stringify(['Dynamic Programming']),
        leetcodeUrl: 'https://leetcode.com/problems/student-attendance-record-ii/'
      },
      {
        title: 'Maximum Vacation Days',
        difficulty: 'Hard',
        category: 'Dynamic Programming',
        description: 'You want to schedule a list of flights in d days. The flights are represented as a n x n matrix, where flights[i][j] means there is a flight from city i to city j.',
        examples: JSON.stringify([
          { input: 'flights = [[0,1,1],[1,0,1],[1,1,0]], days = [[1,3,1],[6,0,3],[3,3,3]]', output: '12', explanation: 'One of the best strategies is: 1st week : fly from city 0 to city 1 on Monday, and play 6 days and work 1 day.' }
        ]),
        constraints: JSON.stringify([
          '1 <= n, K <= 100',
          'flights[i][i] == 0 for all i',
          '0 <= days[i][j] <= 1000'
        ]),
        solutions: JSON.stringify(['Array', 'Dynamic Programming', 'Matrix']),
        leetcodeUrl: 'https://leetcode.com/problems/maximum-vacation-days/'
      },

      // Advanced Graph Problems
      {
        title: 'Network Delay Time',
        difficulty: 'Medium',
        category: 'Graph',
        description: 'You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges times[i] = (ui, vi, wi).',
        examples: JSON.stringify([
          { input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', output: '2', explanation: 'The signal takes 2 time units to reach all nodes.' },
          { input: 'times = [[1,2,1]], n = 2, k = 1', output: '1', explanation: 'The signal takes 1 time unit to reach node 2.' }
        ]),
        constraints: JSON.stringify([
          '1 <= k <= n <= 100',
          '1 <= times.length <= 6000',
          'times[i].length == 3'
        ]),
        solutions: JSON.stringify(['DFS', 'BFS', 'Graph', 'Heap', 'Shortest Path']),
        leetcodeUrl: 'https://leetcode.com/problems/network-delay-time/'
      },
      {
        title: 'Cheapest Flights Within K Stops',
        difficulty: 'Medium',
        category: 'Graph',
        description: 'There are n cities connected by some number of flights. You are given an array flights where flights[i] = [fromi, toi, pricei].',
        examples: JSON.stringify([
          { input: 'n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1', output: '700', explanation: 'The optimal path with at most 1 stop from city 0 to 3 is marked in red and costs 100 + 600 = 700.' }
        ]),
        constraints: JSON.stringify([
          '1 <= n <= 100',
          '0 <= flights.length <= (n * (n - 1) / 2)',
          '0 <= fromi, toi < n'
        ]),
        solutions: JSON.stringify(['Dynamic Programming', 'DFS', 'BFS', 'Graph', 'Heap', 'Shortest Path']),
        leetcodeUrl: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/'
      },
      {
        title: 'Is Graph Bipartite?',
        difficulty: 'Medium',
        category: 'Graph',
        description: 'There is an undirected graph with n nodes, where each node is numbered between 0 and n - 1. You are given a 2D array graph.',
        examples: JSON.stringify([
          { input: 'graph = [[1,2,3],[0,2],[0,1,3],[0,2]]', output: 'false', explanation: 'There is no way to partition the nodes into two independent sets such that every edge connects a node in one and a node in the other.' },
          { input: 'graph = [[1,3],[0,2],[1,3],[0,2]]', output: 'true', explanation: 'We can partition the nodes into two sets: {0, 2} and {1, 3}.' }
        ]),
        constraints: JSON.stringify([
          'graph.length == n',
          '1 <= n <= 100',
          '0 <= graph[u].length < n'
        ]),
        solutions: JSON.stringify(['DFS', 'BFS', 'Union Find', 'Graph', 'Bipartite']),
        leetcodeUrl: 'https://leetcode.com/problems/is-graph-bipartite/'
      },

      // Advanced Tree Problems
      {
        title: 'Split BST',
        difficulty: 'Medium',
        category: 'Tree',
        description: 'Given the root of a binary search tree (BST) and an integer target, split the tree into two subtrees where one subtree has nodes that are all smaller or equal to the target value.',
        examples: JSON.stringify([
          { input: 'root = [4,2,6,1,3,5,7], target = 2', output: '[[2,1],[4,3,6,null,null,5,7]]', explanation: 'Original tree is split into two BSTs.' }
        ]),
        constraints: JSON.stringify([
          'The number of nodes in the tree is in the range [1, 50].',
          '0 <= Node.val, target <= 1000'
        ]),
        solutions: JSON.stringify(['Tree', 'Binary Search Tree', 'Recursion', 'Binary Tree']),
        leetcodeUrl: 'https://leetcode.com/problems/split-bst/'
      },
      {
        title: 'Closest Leaf in Binary Tree',
        difficulty: 'Medium',
        category: 'Tree',
        description: 'Given the root of a binary tree where every node has a unique value and a target integer k, return the value of the nearest leaf node to the target k in the tree.',
        examples: JSON.stringify([
          { input: 'root = [1,3,2], k = 1', output: '2', explanation: 'Either 2 or 3 is the nearest leaf node to the target of 1.' },
          { input: 'root = [1], k = 1', output: '1', explanation: 'The root is the nearest leaf since it has no children.' }
        ]),
        constraints: JSON.stringify([
          'The number of nodes in the tree is in the range [1, 1000].',
          '1 <= Node.val <= 1000',
          'All the values Node.val are unique.',
          'target node is a node in the tree.'
        ]),
        solutions: JSON.stringify(['Tree', 'DFS', 'BFS', 'Binary Tree', 'Graph']),
        leetcodeUrl: 'https://leetcode.com/problems/closest-leaf-in-binary-tree/'
      },
      {
        title: 'Boundary of Binary Tree',
        difficulty: 'Medium',
        category: 'Tree',
        description: 'The boundary of a binary tree is the concatenation of the root, the left boundary, the leaves ordered from left-to-right, and the reverse order of the right boundary.',
        examples: JSON.stringify([
          { input: 'root = [1,null,2,3,4]', output: '[1,3,4,2]', explanation: 'The left boundary is [1]. The right boundary is [2]. The leaves are [3,4].' }
        ]),
        constraints: JSON.stringify([
          'The number of nodes in the tree is in the range [0, 104].',
          '-1000 <= Node.val <= 1000'
        ]),
        solutions: JSON.stringify(['Tree', 'DFS', 'BFS', 'Binary Tree']),
        leetcodeUrl: 'https://leetcode.com/problems/boundary-of-binary-tree/'
      },

      // Advanced String Problems
      {
        title: 'Count Different Palindromic Subsequences',
        difficulty: 'Hard',
        category: 'String',
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
        title: 'Minimum Window Subsequence',
        difficulty: 'Hard',
        category: 'String',
        description: 'Given strings s1 and s2, return the minimum contiguous substring part of s1, so that s2 is a subsequence of the part.',
        examples: JSON.stringify([
          { input: 's1 = "abcdebdde", s2 = "bde"', output: '"bcde"', explanation: '"bcde" is the answer because it occurs before "bdde" which has the same length.' },
          { input: 's1 = "jmeqksfrsdcmsiwvaovztaqenprpvnbstl", s2 = "u"', output: '""', explanation: 'No such window exists.' }
        ]),
        constraints: JSON.stringify([
          '1 <= s1.length <= 2 * 104',
          '1 <= s2.length <= 100',
          's1 and s2 consist of lowercase English letters.'
        ]),
        solutions: JSON.stringify(['String', 'Dynamic Programming', 'Sliding Window', 'Two Pointers']),
        leetcodeUrl: 'https://leetcode.com/problems/minimum-window-subsequence/'
      },
      {
        title: 'Prefix and Suffix Search',
        difficulty: 'Hard',
        category: 'String',
        description: 'Design a special dictionary with some words that allows you to search the words in it by a prefix and a suffix.',
        examples: JSON.stringify([
          { input: '["WordFilter", "f"]\n[[["apple"]], ["a", "e"]]', output: '[null, 0]', explanation: 'WordFilter wordFilter = new WordFilter(["apple"]); wordFilter.f("a", "e"); // return 0, because the word at index 0 has prefix = "a" and suffix = "e".' }
        ]),
        constraints: JSON.stringify([
          '1 <= words.length <= 15000',
          '1 <= words[i].length <= 10',
          '1 <= prefix.length, suffix.length <= 10',
          'words[i], prefix and suffix consist of lowercase English letters only.'
        ]),
        solutions: JSON.stringify(['Hash Table', 'String', 'Design', 'Trie']),
        leetcodeUrl: 'https://leetcode.com/problems/prefix-and-suffix-search/'
      },

      // Advanced Array Problems
      {
        title: 'Falling Squares',
        difficulty: 'Hard',
        category: 'Array',
        description: 'There are several squares being dropped onto the X-axis of a 2D plane. You are given a 2D integer array positions where positions[i] = [lefti, sideLengthi].',
        examples: JSON.stringify([
          { input: 'positions = [[1,2],[2,3],[6,1]]', output: '[2,5,5]', explanation: 'After the first drop, the tallest stack is square 1 with a height of 2.' },
          { input: 'positions = [[100,100],[200,100]]', output: '[100,100]', explanation: 'Adjacent squares don\'t get stucked together - their borders slide past each other.' }
        ]),
        constraints: JSON.stringify([
          '1 <= positions.length <= 1000',
          '1 <= lefti <= 108',
          '1 <= sideLengthi <= 106'
        ]),
        solutions: JSON.stringify(['Array', 'Segment Tree', 'Ordered Map']),
        leetcodeUrl: 'https://leetcode.com/problems/falling-squares/'
      },
      {
        title: 'Range Module',
        difficulty: 'Hard',
        category: 'Array',
        description: 'A Range Module is a module that tracks ranges of numbers. Your task is to design and implement the following interfaces in an efficient manner.',
        examples: JSON.stringify([
          { input: '["RangeModule", "addRange", "removeRange", "queryRange", "queryRange", "queryRange"]\n[[], [10, 20], [14, 16], [10, 14], [13, 15], [16, 17]]', output: '[null, null, null, true, false, true]', explanation: 'RangeModule rangeModule = new RangeModule(); rangeModule.addRange(10, 20); rangeModule.removeRange(14, 16); rangeModule.queryRange(10, 14); // return True' }
        ]),
        constraints: JSON.stringify([
          '1 <= left < right <= 109',
          'At most 104 calls will be made to addRange, removeRange, and queryRange.'
        ]),
        solutions: JSON.stringify(['Design', 'Segment Tree', 'Ordered Map']),
        leetcodeUrl: 'https://leetcode.com/problems/range-module/'
      },
      {
        title: 'Find K-th Smallest Pair Distance',
        difficulty: 'Hard',
        category: 'Array',
        description: 'The distance of a pair of integers a and b is defined as the absolute difference between a and b. Given an integer array nums and an integer k.',
        examples: JSON.stringify([
          { input: 'nums = [1,3,1], k = 1', output: '0', explanation: 'Here are all the pairs: (1,3) -> 2 (1,1) -> 0 (3,1) -> 2 Then the 1st smallest distance pair is (1,1), and its distance is 0.' },
          { input: 'nums = [1,1,1], k = 2', output: '0', explanation: 'The 2nd smallest distance pair is (1,1), and its distance is 0.' }
        ]),
        constraints: JSON.stringify([
          'n == nums.length',
          '2 <= n <= 104',
          '0 <= nums[i] <= 106',
          '1 <= k <= n * (n - 1) / 2'
        ]),
        solutions: JSON.stringify(['Array', 'Two Pointers', 'Binary Search', 'Sorting']),
        leetcodeUrl: 'https://leetcode.com/problems/find-k-th-smallest-pair-distance/'
      },

      // Advanced Design Problems
      {
        title: 'Max Stack',
        difficulty: 'Hard',
        category: 'Design',
        description: 'Design a max stack data structure that supports the stack operations and supports finding the stack\'s maximum element.',
        examples: JSON.stringify([
          { input: '["MaxStack", "push", "push", "push", "top", "popMax", "top", "peekMax", "pop", "top"]\n[[], [5], [1], [5], [], [], [], [], [], []]', output: '[null, null, null, null, 5, 5, 1, 5, 1, 5]', explanation: 'MaxStack stk = new MaxStack(); stk.push(5); stk.push(1); stk.push(5); stk.top(); // return 5' }
        ]),
        constraints: JSON.stringify([
          '-107 <= x <= 107',
          'At most 104 calls will be made to push, pop, top, peekMax, and popMax.',
          'There will be at least one element in the stack when calling pop, top, peekMax, or popMax.'
        ]),
        solutions: JSON.stringify(['Stack', 'Design', 'Heap', 'Ordered Map', 'Doubly Linked List']),
        leetcodeUrl: 'https://leetcode.com/problems/max-stack/'
      },
      {
        title: 'Design In-Memory File System',
        difficulty: 'Hard',
        category: 'Design',
        description: 'Design an in-memory file system to simulate the following functions: ls, mkdir, addContentToFile, readContentFromFile.',
        examples: JSON.stringify([
          { input: '["FileSystem", "ls", "mkdir", "addContentToFile", "ls", "readContentFromFile"]\n[[], ["/"], ["/a/b/c"], ["/a/b/c/d","hello"], ["/"], ["/a/b/c/d"]]', output: '[[], [], null, null, ["a"], "hello"]', explanation: 'FileSystem fileSystem = new FileSystem(); fileSystem.ls("/"); // return []' }
        ]),
        constraints: JSON.stringify([
          '1 <= path.length, filePath.length <= 100',
          'path and filePath are absolute paths which begin with \'/\' and do not end with \'/\' except in the case of the root directory.',
          'You can assume that all directory names and file names only contain lowercase letters.'
        ]),
        solutions: JSON.stringify(['Hash Table', 'String', 'Design', 'Trie']),
        leetcodeUrl: 'https://leetcode.com/problems/design-in-memory-file-system/'
      },
      {
        title: 'Encode and Decode TinyURL',
        difficulty: 'Medium',
        category: 'Design',
        description: 'Design the encode and decode methods for the TinyURL service. There is no restriction on how your encode/decode algorithm should work.',
        examples: JSON.stringify([
          { input: '["TinyURL", "encode", "decode"]\n[[], ["https://leetcode.com/problems/design-tinyurl"], ["http://tinyurl.com/4e9iAk"]]', output: '["http://tinyurl.com/4e9iAk", "https://leetcode.com/problems/design-tinyurl"]', explanation: 'TinyURL tinyURL = new TinyURL(); tinyURL.encode("https://leetcode.com/problems/design-tinyurl"); // returns "http://tinyurl.com/4e9iAk"' }
        ]),
        constraints: JSON.stringify([
          '1 <= url.length <= 104',
          'url is guranteed to be a valid URL.'
        ]),
        solutions: JSON.stringify(['Hash Table', 'String', 'Design', 'Math']),
        leetcodeUrl: 'https://leetcode.com/problems/encode-and-decode-tinyurl/'
      },

      // Advanced Database Problems
      {
        title: 'Find Cumulative Salary',
        difficulty: 'Hard',
        category: 'Database',
        description: 'Write a SQL query to get the cumulative sum of an employee\'s salary over a period of 3 months, but exclude the most recent month.',
        examples: JSON.stringify([
          { input: 'Employee table: [[1, 1, 20], [2, 1, 20], [3, 1, 40], [4, 1, 60], [5, 1, 70], [6, 1, 80]]', output: '[[1, 1, 20, 0], [2, 1, 20, 20], [3, 1, 40, 40], [4, 1, 60, 60], [5, 1, 70, 100], [6, 1, 80, 130]]', explanation: 'Cumulative salary excluding the most recent month.' }
        ]),
        constraints: JSON.stringify([
          'Use window functions with self join exclusion.',
          'Handle edge cases for employees with less than 3 months of data.'
        ]),
        solutions: JSON.stringify(['Database', 'SQL', 'Window Function']),
        leetcodeUrl: 'https://leetcode.com/problems/find-cumulative-salary/'
      },
      {
        title: 'Find Median Given Frequency',
        difficulty: 'Hard',
        category: 'Database',
        description: 'Write a SQL query to find the median of all numbers and name the result as median.',
        examples: JSON.stringify([
          { input: 'Numbers table: [[0, 7], [1, 1], [2, 3], [3, 1]]', output: '0', explanation: 'The median is 0 as it appears most frequently.' }
        ]),
        constraints: JSON.stringify([
          'Use window functions with cumulative sum.',
          'Handle frequency-based median calculation.'
        ]),
        solutions: JSON.stringify(['Database', 'SQL', 'Window Function']),
        leetcodeUrl: 'https://leetcode.com/problems/find-median-given-frequency/'
      },
      {
        title: 'Median Employee Salary',
        difficulty: 'Hard',
        category: 'Database',
        description: 'Write a SQL query to find the median salary of each company. Bonus points if you can solve it without using any built-in SQL functions.',
        examples: JSON.stringify([
          { input: 'Employee table: [[1, "A", 2341], [2, "A", 341], [3, "A", 15], [4, "A", 15314], [5, "A", 451], [6, "A", 513], [7, "B", 15], [8, "B", 13], [9, "B", 1154], [10, "B", 1345], [11, "B", 1221], [12, "B", 234], [13, "C", 2345], [14, "C", 2645], [15, "C", 2645], [16, "C", 2652], [17, "C", 65]]', output: '[[2341, "A"], [1221, "B"], [2645, "C"]]', explanation: 'Median salary per company.' }
        ]),
        constraints: JSON.stringify([
          'Use window functions with PARTITION BY.',
          'Handle even and odd number of employees per company.'
        ]),
        solutions: JSON.stringify(['Database', 'SQL', 'Window Function']),
        leetcodeUrl: 'https://leetcode.com/problems/median-employee-salary/'
      },

      // Advanced Math Problems
      {
        title: 'Preimage Size of Factorial Zeroes',
        difficulty: 'Hard',
        category: 'Math',
        description: 'Let f(x) be the number of zeroes at the end of x!. Recall that x! = 1 * 2 * 3 * ... * x and by convention, 0! = 1.',
        examples: JSON.stringify([
          { input: 'k = 0', output: '5', explanation: '0!, 1!, 2!, 3!, and 4! end with k = 0 zeroes.' },
          { input: 'k = 5', output: '0', explanation: 'There is no x such that x! ends with k = 5 zeroes.' }
        ]),
        constraints: JSON.stringify([
          '0 <= k <= 109'
        ]),
        solutions: JSON.stringify(['Math', 'Binary Search']),
        leetcodeUrl: 'https://leetcode.com/problems/preimage-size-of-factorial-zeroes/'
      },
      {
        title: 'Reaching Points',
        difficulty: 'Hard',
        category: 'Math',
        description: 'Given four integers sx, sy, tx, ty, return true if it is possible to convert the point (sx, sy) to the point (tx, ty) through some operations.',
        examples: JSON.stringify([
          { input: 'sx = 1, sy = 1, tx = 3, ty = 5', output: 'true', explanation: 'One series of moves that transforms the starting point to the target is: (1, 1) -> (1, 2) -> (1, 3) -> (1, 4) -> (1, 5) -> (2, 5) -> (3, 5)' },
          { input: 'sx = 1, sy = 1, tx = 2, ty = 2', output: 'false', explanation: 'It is impossible to reach (2, 2) from (1, 1).' }
        ]),
        constraints: JSON.stringify([
          '1 <= sx, sy, tx, ty <= 109'
        ]),
        solutions: JSON.stringify(['Math', 'Recursion']),
        leetcodeUrl: 'https://leetcode.com/problems/reaching-points/'
      },
      {
        title: 'Reach a Number',
        difficulty: 'Medium',
        category: 'Math',
        description: 'You are standing at position 0 on an infinite number line. There is a destination at position target.',
        examples: JSON.stringify([
          { input: 'target = 2', output: '3', explanation: 'On the 1st move, we step from 0 to 1. On the 2nd move, we step from 1 to -1. On the 3rd move, we step from -1 to 2.' },
          { input: 'target = 3', output: '2', explanation: 'On the 1st move, we step from 0 to 1. On the 2nd move, we step from 1 to 3.' }
        ]),
        constraints: JSON.stringify([
          '-109 <= target <= 109',
          'target != 0'
        ]),
        solutions: JSON.stringify(['Math', 'Binary Search']),
        leetcodeUrl: 'https://leetcode.com/problems/reach-a-number/'
      }
    ];

    // Insert all batch2 problems
    for (const problem of batch2Problems) {
      await supabase.from('problems').upsert(problem, { onConflict: 'title' });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${batch2Problems.length} advanced problems from batch2.js data covering complex algorithmic concepts` 
    });

  } catch (error) {
    console.error('Batch2 problem seeding error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed batch2 problems' 
    }, { status: 500 });
  }
}
