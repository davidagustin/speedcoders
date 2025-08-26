import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

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
      },
      "Example 2": {
        "Input": "nums = [3,2,4], target = 6",
        "Output": "[1,2]"
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
      },
      "Example 2": {
        "Input": "s = \"bbbbb\"",
        "Output": "1",
        "Explanation": "The answer is \"b\", with the length of 1."
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
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Array",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    examples: JSON.stringify({
      "Example 1": {
        "Input": "nums1 = [1,3], nums2 = [2]",
        "Output": "2.00000",
        "Explanation": "merged array = [1,2,3] and median is 2."
      },
      "Example 2": {
        "Input": "nums1 = [1,2], nums2 = [3,4]",
        "Output": "2.50000",
        "Explanation": "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
      }
    }),
    constraints: JSON.stringify([
      "nums1.length + nums2.length >= 1",
      "nums1.length + nums2.length <= 2000",
      "-106 <= nums1[i], nums2[i] <= 106"
    ]),
    solutions: JSON.stringify(["Array", "Binary Search", "Divide and Conquer"]),
    leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/"
  },
  {
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "String",
    description: "Given a string s, return the longest palindromic substring in s.",
    examples: JSON.stringify({
      "Example 1": {
        "Input": "s = \"babad\"",
        "Output": "\"bab\"",
        "Explanation": "\"aba\" is also a valid answer."
      },
      "Example 2": {
        "Input": "s = \"cbbd\"",
        "Output": "\"bb\""
      }
    }),
    constraints: JSON.stringify([
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters."
    ]),
    solutions: JSON.stringify(["String", "Dynamic Programming", "Two Pointers"]),
    leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/"
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
  },
  {
    title: "3Sum",
    difficulty: "Medium",
    category: "Array",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    examples: JSON.stringify({
      "Example 1": {
        "Input": "nums = [-1,0,1,2,-1,-4]",
        "Output": "[[-1,-1,2],[-1,0,1]]",
        "Explanation": "The triplets that sum to zero are [-1,-1,2] and [-1,0,1]."
      }
    }),
    constraints: JSON.stringify([
      "3 <= nums.length <= 3000",
      "-105 <= nums[i] <= 105"
    ]),
    solutions: JSON.stringify(["Array", "Two Pointers", "Sorting"]),
    leetcodeUrl: "https://leetcode.com/problems/3sum/"
  },
  {
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    category: "Linked List",
    description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    examples: JSON.stringify({
      "Example 1": {
        "Input": "head = [1,2,3,4,5], n = 2",
        "Output": "[1,2,3,5]"
      },
      "Example 2": {
        "Input": "head = [1], n = 1",
        "Output": "[]"
      }
    }),
    constraints: JSON.stringify([
      "The number of nodes in the list is sz",
      "1 <= sz <= 30",
      "0 <= Node.val <= 100",
      "1 <= n <= sz"
    ]),
    solutions: JSON.stringify(["Linked List", "Two Pointers"]),
    leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"
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
      },
      "Example 3": {
        "Input": "s = \"(]\"",
        "Output": "false"
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
      },
      "Example 2": {
        "Input": "list1 = [], list2 = []",
        "Output": "[]"
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
    title: "Generate Parentheses",
    difficulty: "Medium",
    category: "String",
    description: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    examples: JSON.stringify({
      "Example 1": {
        "Input": "n = 3",
        "Output": "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]"
      },
      "Example 2": {
        "Input": "n = 1",
        "Output": "[\"()\"]"
      }
    }),
    constraints: JSON.stringify([
      "1 <= n <= 8"
    ]),
    solutions: JSON.stringify(["String", "Backtracking", "Recursion"]),
    leetcodeUrl: "https://leetcode.com/problems/generate-parentheses/"
  },
  {
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Linked List",
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    examples: JSON.stringify({
      "Example 1": {
        "Input": "lists = [[1,4,5],[1,3,4],[2,6]]",
        "Output": "[1,1,2,3,4,4,5,6]",
        "Explanation": "merging the above 3 lists results in [1,1,2,3,4,4,5,6]"
      }
    }),
    constraints: JSON.stringify([
      "k == lists.length",
      "0 <= k <= 104",
      "0 <= lists[i].length <= 500",
      "-104 <= lists[i][j] <= 104",
      "lists[i] is sorted in ascending order"
    ]),
    solutions: JSON.stringify(["Linked List", "Heap (Priority Queue)", "Divide and Conquer"]),
    leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/"
  }
]

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if problems already exist
    const { data: existingProblems } = await supabase
      .from('problems')
      .select('title')
      .limit(1)
    
    if (existingProblems && existingProblems.length > 0) {
      return NextResponse.json({ 
        message: 'Problems already exist in database',
        count: existingProblems.length 
      })
    }

    // Insert problems
    const { data, error } = await supabase
      .from('problems')
      .insert(problems)
      .select()

    if (error) {
      console.error('Error seeding problems:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Problems seeded successfully',
      count: data?.length || 0
    })
  } catch (error) {
    console.error('Error in seed problems route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
