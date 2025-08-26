import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    
    const batch5Problems = [
      {
        id: 2001,
        title: "Number of Pairs of Interchangeable Rectangles",
        difficulty: "Medium",
        category: "Array",
        algorithms: ["Hash Table", "Math"],
        description: "You are given n rectangles represented by a 0-indexed 2D integer array rectangles, where rectangles[i] = [widthi, heighti] denotes the width and height of the ith rectangle. Two rectangles i and j (i < j) are considered interchangeable if they have the same width-to-height ratio. More formally, two rectangles are interchangeable if widthi/heighti == widthj/heightj (using decimal division, not integer division). Return the number of pairs of interchangeable rectangles in rectangles.",
        leetcodeUrl: "https://leetcode.com/problems/number-of-pairs-of-interchangeable-rectangles/"
      },
      {
        id: 2002,
        title: "Maximum Product of the Length of Two Palindromic Subsequences",
        difficulty: "Medium",
        category: "String",
        algorithms: ["Dynamic Programming", "Bit Manipulation"],
        description: "Given a string s, find two disjoint palindromic subsequences of s such that the product of their lengths is maximized. The two subsequences are disjoint if they do not share the same index in s. Return the maximum possible product of the lengths of the two palindromic subsequences.",
        leetcodeUrl: "https://leetcode.com/problems/maximum-product-of-the-length-of-two-palindromic-subsequences/"
      },
      {
        id: 2003,
        title: "Smallest Missing Genetic Value in Each Subtree",
        difficulty: "Hard",
        category: "Tree",
        algorithms: ["Tree", "DFS", "Union Find"],
        description: "There is a family tree rooted at node 0 consisting of n nodes numbered 0 to n - 1. You are given a 0-indexed integer array parents, where parents[i] is the parent for node i. Since node 0 is the root, parents[0] == -1. You are also given a 0-indexed integer array nums, where nums[i] is a unique genetic value for node i. Return an array ans of length n where ans[i] is the smallest genetic value that is missing from the subtree rooted at node i.",
        leetcodeUrl: "https://leetcode.com/problems/smallest-missing-genetic-value-in-each-subtree/"
      },
      {
        id: 2004,
        title: "The Number of Seniors and Juniors to Join the Company",
        difficulty: "Hard",
        category: "Database",
        algorithms: ["SQL", "Database"],
        description: "A company wants to hire new employees. The budget of the company for the salaries is $70000. The company's criteria for hiring are: Hiring the largest number of seniors. After hiring the maximum number of seniors, use the remaining budget to hire the largest number of juniors. Write an SQL query to find the number of seniors and juniors hired under the mentioned criteria.",
        leetcodeUrl: "https://leetcode.com/problems/the-number-of-seniors-and-juniors-to-join-the-company/"
      },
      {
        id: 2005,
        title: "Subtree Removal Game with Fibonacci Tree",
        difficulty: "Hard",
        category: "Tree",
        algorithms: ["Tree", "Game Theory", "Dynamic Programming"],
        description: "A Fibonacci tree is a binary tree created using the following rules: F(1) = 1, F(2) = 1, F(n) = F(n-1) + F(n-2) for n > 2. Each node of this tree has a value. Alice and Bob play a game on this tree. In each turn, a player can remove a subtree. The player who removes the last node wins. Determine if Alice can win if both players play optimally.",
        leetcodeUrl: "https://leetcode.com/problems/subtree-removal-game-with-fibonacci-tree/"
      },
      {
        id: 2006,
        title: "Count Number of Pairs With Absolute Difference K",
        difficulty: "Easy",
        category: "Array",
        algorithms: ["Hash Table", "Array"],
        description: "Given an integer array nums and an integer k, return the number of pairs (i, j) where i < j such that |nums[i] - nums[j]| == k. The value of |x| is defined as: x if x >= 0, -x if x < 0.",
        leetcodeUrl: "https://leetcode.com/problems/count-number-of-pairs-with-absolute-difference-k/"
      },
      {
        id: 2007,
        title: "Find Original Array From Doubled Array",
        difficulty: "Medium",
        category: "Array",
        algorithms: ["Hash Table", "Sorting"],
        description: "An integer array original is transformed into a doubled array changed by appending twice the value of every element in original, and then randomly shuffling the resulting array. Given an array changed, return original if changed is a doubled array. If changed is not a doubled array, return an empty array. The elements in original may be returned in any order.",
        leetcodeUrl: "https://leetcode.com/problems/find-original-array-from-doubled-array/"
      },
      {
        id: 2008,
        title: "Maximum Earnings From Taxi",
        difficulty: "Medium",
        category: "Dynamic Programming",
        algorithms: ["Dynamic Programming", "Sorting"],
        description: "There are n points on a road you are driving your taxi on. The n points on the road are labeled from 0 to n - 1 in the direction you are going, and you want to drive from point 0 to point n - 1 (making n - 1 moves). You are given two integer arrays moveFrom and moveTo of length m and two integer arrays start and end, also of length m. The ith trip is from start[i] to end[i] and you earn end[i] - start[i] dollars. Return the maximum number of dollars you can earn by picking up passengers optimally.",
        leetcodeUrl: "https://leetcode.com/problems/maximum-earnings-from-taxi/"
      },
      {
        id: 2009,
        title: "Minimum Number of Operations to Make Array Continuous",
        difficulty: "Hard",
        category: "Array",
        algorithms: ["Sliding Window", "Sorting"],
        description: "You are given an integer array nums. In one operation, you can replace any element in nums with any integer. nums is considered continuous if both of the following conditions are fulfilled: All elements in nums are unique. The difference between the maximum element and the minimum element in nums equals nums.length - 1. For example, nums = [4, 2, 5, 3] is continuous, but nums = [1, 2, 3, 5, 6] is not continuous. Return the minimum number of operations to make nums continuous.",
        leetcodeUrl: "https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/"
      },
      {
        id: 2010,
        title: "The Number of Seniors and Juniors to Join the Company II",
        difficulty: "Hard",
        category: "Database",
        algorithms: ["SQL", "Database"],
        description: "A company wants to hire new employees. The budget of the company for the salaries is $70000. The company's criteria for hiring are: Hiring the largest number of seniors. After hiring the maximum number of seniors, use the remaining budget to hire the largest number of juniors. Write an SQL query to find the number of seniors and juniors hired under the mentioned criteria.",
        leetcodeUrl: "https://leetcode.com/problems/the-number-of-seniors-and-juniors-to-join-the-company-ii/"
      },
      {
        id: 2011,
        title: "Final Value of Variable After Performing Operations",
        difficulty: "Easy",
        category: "Array",
        algorithms: ["Array", "String"],
        description: "There is a programming language with only four operations and one variable X: ++X and X++ increments the value of the variable X by 1. --X and X-- decrements the value of the variable X by 1. Initially, the value of X is 0. Given an array of strings operations containing a list of operations, return the final value of X after performing all the operations.",
        leetcodeUrl: "https://leetcode.com/problems/final-value-of-variable-after-performing-operations/"
      },
      {
        id: 2012,
        title: "Sum of Beauty in the Array",
        difficulty: "Medium",
        category: "Array",
        algorithms: ["Array", "Prefix Sum"],
        description: "You are given a 0-indexed integer array nums. For each index i (1 <= i <= nums.length - 2) the beauty of nums[i] equals: 2, if nums[j] < nums[i] < nums[k], for all 0 <= j < i and for all i < k <= nums.length - 1. 1, if nums[i - 1] < nums[i] < nums[i + 1], and the previous condition is not satisfied. 0, if none of the previous conditions holds. Return the sum of beauty of all nums[i] where 1 <= i <= nums.length - 2.",
        leetcodeUrl: "https://leetcode.com/problems/sum-of-beauty-in-the-array/"
      },
      {
        id: 2013,
        title: "Detect Squares",
        difficulty: "Medium",
        category: "Hash Table",
        algorithms: ["Hash Table", "Geometry"],
        description: "You are given a stream of points on the X-Y plane. Design an algorithm that: Adds new points from the stream into a data structure. Duplicate points are allowed and should be treated as different points. Given a query point, counts the number of ways to choose three points from the data structure such that the three points and the query point form an axis-aligned square with positive area. An axis-aligned square is a square whose edges are all the same length and are either parallel or perpendicular to the x-axis and y-axis.",
        leetcodeUrl: "https://leetcode.com/problems/detect-squares/"
      },
      {
        id: 2014,
        title: "Longest Subsequence Repeated k Times",
        difficulty: "Hard",
        category: "String",
        algorithms: ["String", "Binary Search"],
        description: "You are given a string s of length n, and an integer k. You are tasked to find the longest subsequence repeated k times in string s. A subsequence is a string that can be derived from another string by deleting some or no characters without changing the order of the remaining characters. A subsequence seq is repeated k times in the string s if seq * k is a subsequence of s, where seq * k represents a string constructed by concatenating seq k times. For example, 'bba' is repeated 2 times in 'bbabcba' because 'bbabcba' contains 'bbabb' as a subsequence. Return the longest subsequence repeated k times in string s. If multiple such subsequences are found, return the lexicographically largest one. If there is no such subsequence, return an empty string.",
        leetcodeUrl: "https://leetcode.com/problems/longest-subsequence-repeated-k-times/"
      },
      {
        id: 2015,
        title: "Average Height of Buildings in Each Segment",
        difficulty: "Medium",
        category: "Array",
        algorithms: ["Line Sweep", "Sorting"],
        description: "A perfectly straight street is represented by a number line. The street has building(s) on it and is represented by a 2D integer array buildings where buildings[i] = [starti, endi, heighti]. This means that there is a building with heighti in the half-closed segment [starti, endi). You want to describe the heights of the buildings on the street with the minimum number of non-overlapping segments. Each segment should be described as {start, end, averageHeight} where start and end are the boundaries of the segment and averageHeight is the average height of all buildings in that segment. Return a 2D integer array segments where segments[i] = [starti, endi, averageHeighti] describes the ith segment.",
        leetcodeUrl: "https://leetcode.com/problems/average-height-of-buildings-in-each-segment/"
      },
      {
        id: 2016,
        title: "Maximum Difference Between Increasing Elements",
        difficulty: "Easy",
        category: "Array",
        algorithms: ["Array", "Greedy"],
        description: "Given a 0-indexed integer array nums of size n, find the maximum difference between nums[i] and nums[j] (i.e., nums[j] - nums[i]), such that 0 <= i < j < n and nums[i] < nums[j]. Return the maximum difference. If no such i and j exists, return -1.",
        leetcodeUrl: "https://leetcode.com/problems/maximum-difference-between-increasing-elements/"
      },
      {
        id: 2017,
        title: "Grid Game",
        difficulty: "Medium",
        category: "Array",
        algorithms: ["Array", "Prefix Sum"],
        description: "You are given a 0-indexed 2D array grid of size 2 x n, where grid[r][c] represents the number of points at position (r, c) on the matrix. Two robots are playing a game on this matrix. Both robots initially start at (0, 0) and want to reach (1, n-1). Each robot may only move to the right ((r, c) to (r, c + 1)) or down ((r, c) to (r + 1, c)). At the start of the game, the first robot moves from (0, 0) to (1, n-1), collecting all the points from the cells on its path. For all cells (r, c) traversed on the path, grid[r][c] is set to 0. Then, the second robot moves from (0, 0) to (1, n-1), collecting all the points from the cells on its path. Note that their paths may intersect with each other. The first robot wants to minimize the number of points collected by the second robot. In contrast, the second robot wants to maximize the number of points it collects. At the start, the first robot makes the first move. Return the number of points collected by the second robot.",
        leetcodeUrl: "https://leetcode.com/problems/grid-game/"
      },
      {
        id: 2018,
        title: "Check if Word Can Be Placed In Crossword",
        difficulty: "Medium",
        category: "Array",
        algorithms: ["Array", "String"],
        description: "You are given an m x n matrix board, representing the current state of a crossword puzzle. The crossword contains lowercase English letters (from solved words), ' ' to represent any empty cell, and '#' to represent any blocked cell. A word can be placed horizontally (left to right or right to left) or vertically (top to bottom or bottom to top) in a straight line. You are also given a string word, which you need to place, and your goal is to find if word can be placed in board. A word can be placed if: It does not conflict with a solved word or a blocked cell. Every cell it uses is empty ('.') or matches the letter at that position. Return true if word can be placed in board, or false otherwise.",
        leetcodeUrl: "https://leetcode.com/problems/check-if-word-can-be-placed-in-crossword/"
      },
      {
        id: 2019,
        title: "The Score of Students Solving Math Expression",
        difficulty: "Hard",
        category: "String",
        algorithms: ["Dynamic Programming", "String"],
        description: "You are given a string s that contains digits 0-9, addition symbols '+', and multiplication symbols '*' only, representing a valid math expression of single digit numbers (e.g., s = '5+7*4', t = '4*3+5'). Return the score of s according to the following rules: Any student that finds the correct answer gets 5 points. Any student that finds an answer that is within 1000 of the correct answer gets 2 points. Any student that finds an answer that is within 10000 of the correct answer gets 1 point. Any student that finds an answer that is more than 10000 away from the correct answer gets 0 points. The score of s is the sum of the points of all students that solve s correctly or within the given ranges.",
        leetcodeUrl: "https://leetcode.com/problems/the-score-of-students-solving-math-expression/"
      },
      {
        id: 2020,
        title: "Number of Accounts That Did Not Stream",
        difficulty: "Medium",
        category: "Database",
        algorithms: ["SQL", "Database"],
        description: "Write an SQL query to report the number of accounts that bought a subscription in 2021 but did not have any stream session. The result table should contain the number of accounts that bought a subscription in 2021 but did not have any stream session.",
        leetcodeUrl: "https://leetcode.com/problems/number-of-accounts-that-did-not-stream/"
      },
      {
        id: 2021,
        title: "Brightest Position on Street",
        difficulty: "Medium",
        category: "Array",
        algorithms: ["Line Sweep", "Sorting"],
        description: "A perfectly straight street is represented by a number line. The street has street lamp(s) on it and is represented by a 2D integer array lights. Each lights[i] = [positioni, rangei] indicates that there is a street lamp at position positioni that lights up the area from [positioni - rangei, positioni + rangei] (inclusive). The brightness of a position p is defined as the number of street lamp that light up the position p. Given lights, return the brightest position on the street. If there are multiple brightest positions, return the smallest one.",
        leetcodeUrl: "https://leetcode.com/problems/brightest-position-on-street/"
      },
      {
        id: 2022,
        title: "Convert 1D Array Into 2D Array",
        difficulty: "Easy",
        category: "Array",
        algorithms: ["Array", "Matrix"],
        description: "You are given a 0-indexed 1-dimensional (1D) integer array original, and two integers, m and n. You are tasked with creating a 2-dimensional (2D) array with m rows and n columns using all the elements from original. The elements from indices 0 to n - 1 (inclusive) of original should form the first row of the constructed 2D array, the elements from indices n to 2 * n - 1 (inclusive) should form the second row of the constructed 2D array, and so on. Return an m x n 2D array constructed according to the above procedure, or an empty 2D array if it is impossible to do so.",
        leetcodeUrl: "https://leetcode.com/problems/convert-1d-array-into-2d-array/"
      },
      {
        id: 2023,
        title: "Number of Pairs of Strings With Concatenation Equal to Target",
        difficulty: "Medium",
        category: "String",
        algorithms: ["Hash Table", "String"],
        description: "Given an array of digit strings nums and a digit string target, return the number of pairs of indices (i, j) (where i != j) such that the concatenation of nums[i] + nums[j] equals target.",
        leetcodeUrl: "https://leetcode.com/problems/number-of-pairs-of-strings-with-concatenation-equal-to-target/"
      },
      {
        id: 2024,
        title: "Maximize the Confusion of an Exam",
        difficulty: "Medium",
        category: "String",
        algorithms: ["Sliding Window", "Binary Search"],
        description: "A teacher is writing a test with n true/false questions, with 'T' denoting true and 'F' denoting false. He wants to confuse the students by maximizing the number of consecutive questions with the same answer (multiple trues or multiple falses in a row). You are given a string answerKey, where answerKey[i] is the original answer to the ith question. In addition, you are given an integer k, the maximum number of times you may perform the following operation: Change the answer key for any question to 'T' or 'F' (i.e., set answerKey[i] to 'T' or 'F'). Return the maximum number of consecutive 'T's or 'F's in the answer key after performing the operation at most k times.",
        leetcodeUrl: "https://leetcode.com/problems/maximize-the-confusion-of-an-exam/"
      },
      {
        id: 2025,
        title: "Maximum Number of Ways to Partition an Array",
        difficulty: "Hard",
        category: "Array",
        algorithms: ["Hash Table", "Prefix Sum"],
        description: "You are given a 0-indexed integer array nums of length n. The number of ways to partition nums is the number of pivot indices that satisfy both conditions: 1 <= pivot < n, nums[0] + nums[1] + ... + nums[pivot - 1] == nums[pivot] + nums[pivot + 1] + ... + nums[n - 1]. You are also given an integer k. You can choose to change the value of one element of nums to k, or to leave the array unchanged. Return the maximum possible number of ways to partition nums to satisfy both conditions after changing at most one element.",
        leetcodeUrl: "https://leetcode.com/problems/maximum-number-of-ways-to-partition-an-array/"
      },
      {
        id: 2026,
        title: "Low-Quality Problems",
        difficulty: "Easy",
        category: "Database",
        algorithms: ["SQL", "Database"],
        description: "Write an SQL query to report the IDs of the low-quality problems. A problem is low-quality if the like percentage of the problem (number of likes divided by the total number of votes) is strictly less than 60%. Return the result table ordered by problem_id in ascending order.",
        leetcodeUrl: "https://leetcode.com/problems/low-quality-problems/"
      },
      {
        id: 2027,
        title: "Minimum Moves to Convert String",
        difficulty: "Easy",
        category: "String",
        algorithms: ["String", "Greedy"],
        description: "You are given a string s consisting of n characters which are either 'X' or 'O'. A move is defined as selecting three consecutive characters of s and converting them to 'O'. Note that if a move is applied to the character 'O', it will stay the same. Return the minimum number of moves required so that all the characters of s are converted to 'O'.",
        leetcodeUrl: "https://leetcode.com/problems/minimum-moves-to-convert-string/"
      },
      {
        id: 2028,
        title: "Find Missing Observations",
        difficulty: "Medium",
        category: "Array",
        algorithms: ["Array", "Math"],
        description: "You have observations of n + m 6-sided dice rolls with each face numbered from 1 to 6. n of the observations went missing, and you only have the observations of m rolls. Fortunately, you have also calculated the average value of the n + m rolls. You are given an integer array rolls of length m where rolls[i] is the value of the ith observation. You are also given the two integers mean and n. Return an array of length n containing the missing observations such that the average value of all n + m rolls is exactly mean. If there are multiple valid answers, return any of them. If no such array exists, return an empty array. The average value of a set of k numbers is the sum of the numbers divided by k. Note that mean is an integer, so the sum of the n + m rolls should be divisible by n + m.",
        leetcodeUrl: "https://leetcode.com/problems/find-missing-observations/"
      },
      {
        id: 2029,
        title: "Stone Game IX",
        difficulty: "Medium",
        category: "Array",
        algorithms: ["Game Theory", "Math"],
        description: "Alice and Bob continue their games with stones. There is a row of n stones, and each stone has an associated value. You are given an integer array stones, where stones[i] is the value of the ith stone from the left. Alice and Bob take turns, with Alice starting first. On each turn, the player may remove any stone from stones. The player who removes a stone loses if the sum of the values of all removed stones is divisible by 3. Bob wins if the sum is not divisible by 3. Assuming both players play optimally, return true if Alice wins and false if Bob wins.",
        leetcodeUrl: "https://leetcode.com/problems/stone-game-ix/"
      },
      {
        id: 2030,
        title: "Smallest K-Length Subsequence With Occurrences of a Letter",
        difficulty: "Hard",
        category: "String",
        algorithms: ["String", "Stack"],
        description: "You are given a string s, an integer k, a letter letter, and an integer repetition. Return the lexicographically smallest subsequence of s of length k that has the letter letter appear at least repetition times. The test cases are generated so that letter appears in s at least repetition times. A subsequence is a string that can be derived from another string by deleting some or no characters without changing the order of the remaining characters. A string a is lexicographically smaller than a string b if in the first position where a and b differ, string a has a letter that appears earlier in the alphabet than the corresponding letter in b.",
        leetcodeUrl: "https://leetcode.com/problems/smallest-k-length-subsequence-with-occurrences-of-a-letter/"
      }
    ];

    const { data, error } = await supabase
      .from('problems')
      .upsert(
        batch5Problems.map(problem => ({
          id: problem.id,
          title: problem.title,
          difficulty: problem.difficulty,
          category: problem.category,
          algorithms: problem.algorithms,
          description: problem.description,
          leetcodeUrl: problem.leetcodeUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })),
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Error seeding batch5 problems:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: `Successfully seeded ${batch5Problems.length} batch5 problems`,
      count: batch5Problems.length 
    });

  } catch (error) {
    console.error('Error in batch5 seeding:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
