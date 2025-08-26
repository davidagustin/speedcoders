import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

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
    name: "Depth-First Search",
    category: "Graph",
    description: "A graph traversal algorithm that explores as far as possible along each branch before backtracking.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    examples: JSON.stringify({
      "Basic Usage": "Used for graph traversal, tree problems, and backtracking",
      "Common Applications": "Number of Islands, Path Sum, Generate Parentheses",
      "Implementation": "Recursive DFS, iterative DFS with stack"
    })
  },
  {
    name: "Breadth-First Search",
    category: "Graph",
    description: "A graph traversal algorithm that explores all vertices at the current depth before moving to vertices at the next depth.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    examples: JSON.stringify({
      "Basic Usage": "Used for level-order traversal, shortest path problems, and graph exploration",
      "Common Applications": "Binary Tree Level Order Traversal, Word Ladder, Number of Islands",
      "Implementation": "Queue-based BFS, level-by-level BFS"
    })
  },
  {
    name: "Sorting",
    category: "Algorithms",
    description: "Algorithms to arrange elements in a specific order, often used as a preprocessing step for other algorithms.",
    timeComplexity: "O(n log n) for efficient sorts",
    spaceComplexity: "O(1) for in-place sorts",
    examples: JSON.stringify({
      "Basic Usage": "Used for preprocessing data, finding duplicates, and optimization",
      "Common Applications": "3Sum, Merge Intervals, Meeting Rooms",
      "Types": "Quick Sort, Merge Sort, Heap Sort, Counting Sort"
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
    name: "Queue",
    category: "Data Structures",
    description: "A linear data structure that follows FIFO (First In First Out) principle, useful for BFS and task scheduling.",
    timeComplexity: "O(1) for enqueue/dequeue",
    spaceComplexity: "O(n)",
    examples: JSON.stringify({
      "Basic Usage": "Used for BFS, task scheduling, and buffering",
      "Common Applications": "Binary Tree Level Order Traversal, Sliding Window Maximum",
      "Types": "Simple queue, priority queue, circular queue"
    })
  },
  {
    name: "Heap (Priority Queue)",
    category: "Data Structures",
    description: "A specialized tree-based data structure that satisfies the heap property, useful for priority-based operations.",
    timeComplexity: "O(log n) for insert/extract",
    spaceComplexity: "O(n)",
    examples: JSON.stringify({
      "Basic Usage": "Used for priority scheduling, finding kth element, and merge operations",
      "Common Applications": "Merge k Sorted Lists, Find Median from Data Stream, Top K Frequent Elements",
      "Types": "Min heap, max heap"
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
    name: "Backtracking",
    category: "Techniques",
    description: "A systematic way to iterate through all possible configurations of a search space to find valid solutions.",
    timeComplexity: "Exponential in most cases",
    spaceComplexity: "O(depth of recursion)",
    examples: JSON.stringify({
      "Basic Usage": "Used for combination problems, permutation problems, and constraint satisfaction",
      "Common Applications": "Generate Parentheses, N-Queens, Sudoku Solver",
      "Key Concepts": "Choice, constraint, goal"
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
  },
  {
    name: "Divide and Conquer",
    category: "Techniques",
    description: "An algorithmic paradigm that recursively breaks down a problem into two or more subproblems until they become simple enough to solve directly.",
    timeComplexity: "Varies by problem",
    spaceComplexity: "Varies by problem",
    examples: JSON.stringify({
      "Basic Usage": "Used for problems that can be broken into independent subproblems",
      "Common Applications": "Merge Sort, Quick Sort, Median of Two Sorted Arrays",
      "Steps": "Divide, conquer, combine"
    })
  }
]

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if algorithms already exist
    const { data: existingAlgorithms } = await supabase
      .from('algorithms')
      .select('name')
      .limit(1)
    
    if (existingAlgorithms && existingAlgorithms.length > 0) {
      return NextResponse.json({ 
        message: 'Algorithms already exist in database',
        count: existingAlgorithms.length 
      })
    }

    // Insert algorithms
    const { data, error } = await supabase
      .from('algorithms')
      .insert(algorithms)
      .select()

    if (error) {
      console.error('Error seeding algorithms:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Algorithms seeded successfully',
      count: data?.length || 0
    })
  } catch (error) {
    console.error('Error in seed algorithms route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
