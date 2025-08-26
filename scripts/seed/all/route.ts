import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const results = {
      algorithms: { success: false, count: 0, error: null },
      problems: { success: false, count: 0, error: null },
      quizzes: { success: false, count: 0, error: null }
    }

    // Step 1: Seed Algorithms
    try {
      const { data: existingAlgorithms } = await supabase
        .from('algorithms')
        .select('name')
        .limit(1)
      
      if (!existingAlgorithms || existingAlgorithms.length === 0) {
        const algorithms = [
          {
            name: "Hash Table",
            category: "Data Structures",
            description: "A data structure that provides fast key-value lookups using hash functions to map keys to array indices.",
            timeComplexity: "O(1) average, O(n) worst case",
            spaceComplexity: "O(n)",
            examples: JSON.stringify({
              "Basic Usage": "Used for fast lookups, duplicate detection, and caching",
              "Common Applications": "Two Sum, Group Anagrams, First Unique Character",
              "Implementation": "HashMap in Java, dict in Python, Object in JavaScript"
            })
          },
          {
            name: "Two Pointers",
            category: "Techniques",
            description: "A technique using two pointers to traverse arrays or linked lists efficiently, often reducing time complexity.",
            timeComplexity: "O(n)",
            spaceComplexity: "O(1)",
            examples: JSON.stringify({
              "Basic Usage": "Used for array traversal, palindrome checking, and container problems",
              "Common Applications": "Container With Most Water, 3Sum, Remove Duplicates",
              "Variations": "Fast and slow pointers, left and right pointers"
            })
          },
          {
            name: "Sliding Window",
            category: "Techniques",
            description: "A technique that maintains a subset of elements (window) that slides through the array to solve subarray problems.",
            timeComplexity: "O(n)",
            spaceComplexity: "O(1)",
            examples: JSON.stringify({
              "Basic Usage": "Used for substring problems, subarray sums, and window optimization",
              "Common Applications": "Longest Substring Without Repeating Characters, Minimum Window Substring",
              "Types": "Fixed size window, variable size window"
            })
          },
          {
            name: "Dynamic Programming",
            category: "Techniques",
            description: "A method for solving complex problems by breaking them down into simpler subproblems and storing their solutions.",
            timeComplexity: "Varies (typically O(n²) to O(n³))",
            spaceComplexity: "Varies (typically O(n) to O(n²))",
            examples: JSON.stringify({
              "Basic Usage": "Used for optimization problems, counting problems, and sequence problems",
              "Common Applications": "Longest Palindromic Substring, Climbing Stairs, Coin Change",
              "Approaches": "Top-down (memoization), bottom-up (tabulation)"
            })
          },
          {
            name: "Binary Search",
            category: "Search",
            description: "An efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.",
            timeComplexity: "O(log n)",
            spaceComplexity: "O(1)",
            examples: JSON.stringify({
              "Basic Usage": "Used for searching in sorted arrays, finding insertion points, and optimization problems",
              "Common Applications": "Search Insert Position, Find First and Last Position, Median of Two Sorted Arrays",
              "Variations": "Standard binary search, binary search on answer"
            })
          },
          {
            name: "Stack",
            category: "Data Structures",
            description: "A linear data structure that follows LIFO (Last In First Out) principle, useful for tracking state and backtracking.",
            timeComplexity: "O(1) for push/pop",
            spaceComplexity: "O(n)",
            examples: JSON.stringify({
              "Basic Usage": "Used for parenthesis matching, function calls, and undo operations",
              "Common Applications": "Valid Parentheses, Evaluate Reverse Polish Notation, Min Stack",
              "Implementation": "Array-based stack, linked list-based stack"
            })
          },
          {
            name: "Recursion",
            category: "Techniques",
            description: "A programming technique where a function calls itself to solve problems by breaking them into smaller subproblems.",
            timeComplexity: "Varies by problem",
            spaceComplexity: "O(depth of recursion)",
            examples: JSON.stringify({
              "Basic Usage": "Used for tree traversal, backtracking, and divide-and-conquer problems",
              "Common Applications": "Merge Two Sorted Lists, Generate Parentheses, Path Sum",
              "Types": "Direct recursion, indirect recursion, tail recursion"
            })
          },
          {
            name: "Greedy",
            category: "Techniques",
            description: "An algorithmic paradigm that builds up a solution piece by piece, always choosing the next piece that offers the most obvious and immediate benefit.",
            timeComplexity: "Varies by problem",
            spaceComplexity: "Varies by problem",
            examples: JSON.stringify({
              "Basic Usage": "Used for optimization problems where local optimal choice leads to global optimal solution",
              "Common Applications": "Container With Most Water, Jump Game, Gas Station",
              "When to Use": "When local optimal choice leads to global optimal solution"
            })
          }
        ]

        const { data: algoData, error: algoError } = await supabase
          .from('algorithms')
          .insert(algorithms)
          .select()

        if (algoError) throw algoError
        results.algorithms = { success: true, count: algoData?.length || 0, error: null }
      } else {
        results.algorithms = { success: true, count: existingAlgorithms.length, error: null }
      }
    } catch (error) {
      results.algorithms = { success: false, count: 0, error: error instanceof Error ? error.message : 'Unknown error' }
    }

    // Step 2: Seed Problems
    try {
      const { data: existingProblems } = await supabase
        .from('problems')
        .select('title')
        .limit(1)
      
      if (!existingProblems || existingProblems.length === 0) {
        const problems = [
          {
            title: "Two Sum",
            difficulty: "Easy",
            category: "Array",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            examples: JSON.stringify({
              "Example 1": {
                "Input": "nums = [2,7,11,15], target = 9",
                "Output": "[0,1]",
                "Explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
              }
            }),
            constraints: JSON.stringify([
              "2 <= nums.length <= 104",
              "-109 <= nums[i] <= 109",
              "-109 <= target <= 109",
              "Only one valid answer exists."
            ]),
            solutions: JSON.stringify(["Hash Table", "Two Pointers"]),
            leetcodeUrl: "https://leetcode.com/problems/two-sum/"
          },
          {
            title: "Add Two Numbers",
            difficulty: "Medium",
            category: "Linked List",
            description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
            examples: JSON.stringify({
              "Example 1": {
                "Input": "l1 = [2,4,3], l2 = [5,6,4]",
                "Output": "[7,0,8]",
                "Explanation": "342 + 465 = 807."
              }
            }),
            constraints: JSON.stringify([
              "The number of nodes in each linked list is in the range [1, 100]",
              "0 <= Node.val <= 9",
              "It is guaranteed that the list represents a number that does not have leading zeros."
            ]),
            solutions: JSON.stringify(["Linked List", "Math", "Recursion"]),
            leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/"
          },
          {
            title: "Longest Substring Without Repeating Characters",
            difficulty: "Medium",
            category: "String",
            description: "Given a string s, find the length of the longest substring without repeating characters.",
            examples: JSON.stringify({
              "Example 1": {
                "Input": "s = \"abcabcbb\"",
                "Output": "3",
                "Explanation": "The answer is \"abc\", with the length of 3."
              }
            }),
            constraints: JSON.stringify([
              "0 <= s.length <= 5 * 104",
              "s consists of English letters, digits, symbols and spaces."
            ]),
            solutions: JSON.stringify(["Hash Table", "String", "Sliding Window"]),
            leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
          },
          {
            title: "Valid Parentheses",
            difficulty: "Easy",
            category: "String",
            description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
            examples: JSON.stringify({
              "Example 1": {
                "Input": "s = \"()\"",
                "Output": "true"
              },
              "Example 2": {
                "Input": "s = \"()[]{}\"",
                "Output": "true"
              }
            }),
            constraints: JSON.stringify([
              "1 <= s.length <= 104",
              "s consists of parentheses only '()[]{}'"
            ]),
            solutions: JSON.stringify(["String", "Stack"]),
            leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/"
          },
          {
            title: "Merge Two Sorted Lists",
            difficulty: "Easy",
            category: "Linked List",
            description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
            examples: JSON.stringify({
              "Example 1": {
                "Input": "list1 = [1,2,4], list2 = [1,3,4]",
                "Output": "[1,1,2,3,4,4]"
              }
            }),
            constraints: JSON.stringify([
              "The number of nodes in both lists is in the range [0, 50]",
              "-100 <= Node.val <= 100",
              "Both list1 and list2 are sorted in non-decreasing order"
            ]),
            solutions: JSON.stringify(["Linked List", "Recursion"]),
            leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/"
          },
          {
            title: "Container With Most Water",
            difficulty: "Medium",
            category: "Array",
            description: "Given n non-negative integers height where each represents a point at coordinate (i, height[i]), find two lines that together with the x-axis form a container that would hold the maximum amount of water.",
            examples: JSON.stringify({
              "Example 1": {
                "Input": "height = [1,8,6,2,5,4,8,3,7]",
                "Output": "49",
                "Explanation": "The maximum area is obtained by choosing height[1] = 8 and height[8] = 7."
              }
            }),
            constraints: JSON.stringify([
              "n == height.length",
              "2 <= n <= 105",
              "0 <= height[i] <= 104"
            ]),
            solutions: JSON.stringify(["Array", "Two Pointers", "Greedy"]),
            leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/"
          }
        ]

        const { data: probData, error: probError } = await supabase
          .from('problems')
          .insert(problems)
          .select()

        if (probError) throw probError
        results.problems = { success: true, count: probData?.length || 0, error: null }
      } else {
        results.problems = { success: true, count: existingProblems.length, error: null }
      }
    } catch (error) {
      results.problems = { success: false, count: 0, error: error instanceof Error ? error.message : 'Unknown error' }
    }

    // Step 3: Seed Quizzes (only if problems and algorithms exist)
    if (results.problems.success && results.algorithms.success) {
      try {
        const { data: existingQuizzes } = await supabase
          .from('quizzes')
          .select('title')
          .limit(1)
        
        if (!existingQuizzes || existingQuizzes.length === 0) {
          // Get problems for quiz creation
          const { data: problems } = await supabase
            .from('problems')
            .select('id, title, difficulty, category')
            .order('difficulty')
            .order('title')

          if (problems && problems.length > 0) {
            const quizzes = [
              {
                title: "Array Fundamentals",
                description: "Master basic array operations and common patterns",
                timeLimit: 15,
                difficulty: "Easy",
                category: "Array",
                createdBy: "system"
              },
              {
                title: "String Manipulation",
                description: "Learn string processing techniques and algorithms",
                timeLimit: 20,
                difficulty: "Medium",
                category: "String",
                createdBy: "system"
              },
              {
                title: "Linked List Basics",
                description: "Practice linked list operations and traversal",
                timeLimit: 18,
                difficulty: "Medium",
                category: "Linked List",
                createdBy: "system"
              }
            ]

            const { data: quizData, error: quizError } = await supabase
              .from('quizzes')
              .insert(quizzes)
              .select()

            if (quizError) throw quizError

            // Create quiz questions
            const quizQuestions = []

            // Array Fundamentals Quiz
            const arrayProblems = problems.filter(p => p.category === 'Array' && p.difficulty === 'Easy').slice(0, 2)
            arrayProblems.forEach((problem, index) => {
              quizQuestions.push({
                quizId: quizData[0].id,
                problemId: problem.id,
                order: index + 1
              })
            })

            // String Manipulation Quiz
            const stringProblems = problems.filter(p => p.category === 'String').slice(0, 2)
            stringProblems.forEach((problem, index) => {
              quizQuestions.push({
                quizId: quizData[1].id,
                problemId: problem.id,
                order: index + 1
              })
            })

            // Linked List Basics Quiz
            const linkedListProblems = problems.filter(p => p.category === 'Linked List').slice(0, 2)
            linkedListProblems.forEach((problem, index) => {
              quizQuestions.push({
                quizId: quizData[2].id,
                problemId: problem.id,
                order: index + 1
              })
            })

            const { error: questionError } = await supabase
              .from('quiz_questions')
              .insert(quizQuestions)

            if (questionError) throw questionError
            results.quizzes = { success: true, count: quizData.length, error: null }
          }
        } else {
          results.quizzes = { success: true, count: existingQuizzes.length, error: null }
        }
      } catch (error) {
        results.quizzes = { success: false, count: 0, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }

    return NextResponse.json({
      message: 'Database seeding completed',
      results,
      summary: {
        totalAlgorithms: results.algorithms.count,
        totalProblems: results.problems.count,
        totalQuizzes: results.quizzes.count,
        allSuccessful: results.algorithms.success && results.problems.success && results.quizzes.success
      }
    })
  } catch (error) {
    console.error('Error in seed all route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
