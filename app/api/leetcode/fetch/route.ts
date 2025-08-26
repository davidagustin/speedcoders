import { NextRequest, NextResponse } from 'next/server'
import { fetchLeetCodeProblem, saveProblemToDatabase } from '@/lib/leetcode-scraper'
import { createClient } from '@/utils/supabase/server'

const LEETCODE_PROBLEMS = [
  // Easy
  { slug: 'two-sum', title: 'Two Sum', difficulty: 'Easy' },
  { slug: 'reverse-integer', title: 'Reverse Integer', difficulty: 'Easy' },
  { slug: 'palindrome-number', title: 'Palindrome Number', difficulty: 'Easy' },
  { slug: 'roman-to-integer', title: 'Roman to Integer', difficulty: 'Easy' },
  { slug: 'longest-common-prefix', title: 'Longest Common Prefix', difficulty: 'Easy' },
  { slug: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'Easy' },
  { slug: 'merge-two-sorted-lists', title: 'Merge Two Sorted Lists', difficulty: 'Easy' },
  { slug: 'remove-duplicates-from-sorted-array', title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy' },
  { slug: 'maximum-subarray', title: 'Maximum Subarray', difficulty: 'Easy' },
  { slug: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy' },
  
  // Medium
  { slug: 'add-two-numbers', title: 'Add Two Numbers', difficulty: 'Medium' },
  { slug: 'longest-substring-without-repeating-characters', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium' },
  { slug: 'longest-palindromic-substring', title: 'Longest Palindromic Substring', difficulty: 'Medium' },
  { slug: '3sum', title: '3Sum', difficulty: 'Medium' },
  { slug: 'letter-combinations-of-a-phone-number', title: 'Letter Combinations of a Phone Number', difficulty: 'Medium' },
  { slug: 'remove-nth-node-from-end-of-list', title: 'Remove Nth Node From End of List', difficulty: 'Medium' },
  { slug: 'generate-parentheses', title: 'Generate Parentheses', difficulty: 'Medium' },
  { slug: 'swap-nodes-in-pairs', title: 'Swap Nodes in Pairs', difficulty: 'Medium' },
  { slug: 'next-permutation', title: 'Next Permutation', difficulty: 'Medium' },
  { slug: 'search-in-rotated-sorted-array', title: 'Search in Rotated Sorted Array', difficulty: 'Medium' },
  
  // Hard
  { slug: 'median-of-two-sorted-arrays', title: 'Median of Two Sorted Arrays', difficulty: 'Hard' },
  { slug: 'regular-expression-matching', title: 'Regular Expression Matching', difficulty: 'Hard' },
  { slug: 'merge-k-sorted-lists', title: 'Merge k Sorted Lists', difficulty: 'Hard' },
  { slug: 'reverse-nodes-in-k-group', title: 'Reverse Nodes in k-Group', difficulty: 'Hard' },
  { slug: 'substring-with-concatenation-of-all-words', title: 'Substring with Concatenation of All Words', difficulty: 'Hard' },
  { slug: 'first-missing-positive', title: 'First Missing Positive', difficulty: 'Hard' },
  { slug: 'trapping-rain-water', title: 'Trapping Rain Water', difficulty: 'Hard' },
  { slug: 'wildcard-matching', title: 'Wildcard Matching', difficulty: 'Hard' },
  { slug: 'n-queens', title: 'N-Queens', difficulty: 'Hard' },
  { slug: 'n-queens-ii', title: 'N-Queens II', difficulty: 'Hard' },
]

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { slug } = await req.json()
    
    if (slug) {
      // Fetch specific problem
      const problem = await fetchLeetCodeProblem(slug)
      if (problem) {
        const saved = await saveProblemToDatabase(problem, slug)
        return NextResponse.json({ success: true, problem: saved })
      }
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
    } else {
      // Populate database with sample problems
      const saved = []
      for (const prob of LEETCODE_PROBLEMS.slice(0, 10)) {
        const problem = await fetchLeetCodeProblem(prob.slug)
        if (problem) {
          const savedProblem = await saveProblemToDatabase(problem, prob.slug)
          saved.push(savedProblem)
        }
      }
      return NextResponse.json({ success: true, problems: saved })
    }
  } catch (error) {
    console.error('Error fetching LeetCode problems:', error)
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    )
  }
}