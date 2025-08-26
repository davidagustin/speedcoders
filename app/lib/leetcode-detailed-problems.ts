export interface LeetCodeProblem {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  algorithms: string[];
  description: string;
  examples: string[];
  constraints: string[];
  solutions: {
    approach: string;
    complexity: string;
    code: string;
  }[];
  hints: string[];
  similarQuestions: string[];
  techniques: string[];
  acceptanceRate?: number;
  frequency?: number;
  companies?: string[];
  premium?: boolean;
}

export const detailedProblems: LeetCodeProblem[] = [
  {
    id: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Table"],
    algorithms: ["Hash Table", "Two Pointers", "Brute Force"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
      "Input: nums = [3,2,4], target = 6\nOutput: [1,2]",
      "Input: nums = [3,3], target = 6\nOutput: [0,1]"
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    solutions: [
      {
        approach: "Hash Table",
        complexity: "Time: O(n), Space: O(n)",
        code: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
      }
    ],
    hints: [
      "Use a hash table to store numbers you've seen",
      "For each number, check if its complement exists in the hash table",
      "The complement is target - current number"
    ],
    similarQuestions: ["3Sum", "Two Sum II - Input Array Is Sorted", "Two Sum IV - Input is a BST"],
    techniques: ["Hash Table", "Two Pointers", "Complement Search"],
    acceptanceRate: 49.5,
    frequency: 85.2,
    companies: ["Google", "Amazon", "Microsoft", "Facebook"],
    premium: false
  },
  {
    id: 2,
    title: "Add Two Numbers",
    slug: "add-two-numbers",
    difficulty: "Medium",
    topics: ["Linked List", "Math"],
    algorithms: ["Linked List", "Math", "Carry"],
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    examples: [
      "Input: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807.",
      "Input: l1 = [0], l2 = [0]\nOutput: [0]",
      "Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]\nOutput: [8,9,9,9,0,0,0,1]"
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100]",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ],
    solutions: [
      {
        approach: "Elementary Math",
        complexity: "Time: O(max(M,N)), Space: O(max(M,N))",
        code: `function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;
  let carry = 0;
  
  while (l1 || l2 || carry) {
    const x = l1 ? l1.val : 0;
    const y = l2 ? l2.val : 0;
    const sum = x + y + carry;
    
    carry = Math.floor(sum / 10);
    current.next = new ListNode(sum % 10);
    current = current.next;
    
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  
  return dummy.next;
}`
      }
    ],
    hints: [
      "Keep track of the carry using a variable",
      "Create a dummy head to simplify the code",
      "Process both lists until you reach the end and have no carry"
    ],
    similarQuestions: ["Multiply Strings", "Add Binary", "Plus One"],
    techniques: ["Linked List Manipulation", "Carry Handling", "Dummy Head"],
    acceptanceRate: 37.8,
    frequency: 72.1,
    companies: ["Amazon", "Microsoft", "Google", "Bloomberg"],
    premium: false
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    topics: ["String", "Sliding Window"],
    algorithms: ["Sliding Window", "Hash Table", "Two Pointers"],
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      'Input: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with the length of 3.',
      'Input: s = "bbbbb"\nOutput: 1\nExplanation: The answer is "b", with the length of 1.',
      'Input: s = "pwwkew"\nOutput: 3\nExplanation: The answer is "wke", with the length of 3.'
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    solutions: [
      {
        approach: "Sliding Window",
        complexity: "Time: O(n), Space: O(min(m,n))",
        code: `function lengthOfLongestSubstring(s: string): number {
  const charSet = new Set();
  let left = 0;
  let maxLength = 0;
  
  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}`
      }
    ],
    hints: [
      "Use a sliding window approach",
      "Keep track of characters in the current window using a set",
      "When you encounter a duplicate, move the left pointer"
    ],
    similarQuestions: ["Longest Repeating Character Replacement", "Minimum Window Substring", "Longest Palindromic Substring"],
    techniques: ["Sliding Window", "Hash Set", "Two Pointers"],
    acceptanceRate: 33.8,
    frequency: 78.9,
    companies: ["Amazon", "Google", "Microsoft", "Facebook"],
    premium: false
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    slug: "median-of-two-sorted-arrays",
    difficulty: "Hard",
    topics: ["Array", "Binary Search"],
    algorithms: ["Binary Search", "Divide and Conquer"],
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    examples: [
      "Input: nums1 = [1,3], nums2 = [2]\nOutput: 2.00000\nExplanation: merged array = [1,2,3] and median is 2.",
      "Input: nums1 = [1,2], nums2 = [3,4]\nOutput: 2.50000\nExplanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
    ],
    constraints: [
      "nums1.length + nums2.length >= 1",
      "nums1.length + nums2.length <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    solutions: [
      {
        approach: "Binary Search",
        complexity: "Time: O(log(min(m,n))), Space: O(1)",
        code: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }
  
  const m = nums1.length;
  const n = nums2.length;
  const left = 0;
  const right = m;
  
  while (left <= right) {
    const partitionX = Math.floor((left + right) / 2);
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
      right = partitionX - 1;
    } else {
      left = partitionX + 1;
    }
  }
  
  throw new Error("Input arrays are not sorted");
}`
      }
    ],
    hints: [
      "Think about partitioning both arrays",
      "Use binary search to find the correct partition",
      "The median divides the combined array into two equal halves"
    ],
    similarQuestions: ["Kth Smallest Element in a Sorted Matrix", "Find K-th Smallest Pair Distance", "Kth Smallest Number in Multiplication Table"],
    techniques: ["Binary Search", "Partitioning", "Median Properties"],
    acceptanceRate: 32.1,
    frequency: 65.4,
    companies: ["Google", "Microsoft", "Amazon", "Apple"],
    premium: false
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    slug: "longest-palindromic-substring",
    difficulty: "Medium",
    topics: ["String", "Dynamic Programming"],
    algorithms: ["Dynamic Programming", "Expand Around Center"],
    description: "Given a string s, return the longest palindromic substring in s.",
    examples: [
      'Input: s = "babad"\nOutput: "bab"\nExplanation: "aba" is also a valid answer.',
      'Input: s = "cbbd"\nOutput: "bb"',
      'Input: s = "a"\nOutput: "a"'
    ],
    constraints: [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters."
    ],
    solutions: [
      {
        approach: "Expand Around Center",
        complexity: "Time: O(n²), Space: O(1)",
        code: `function longestPalindrome(s: string): string {
  let start = 0;
  let maxLength = 1;
  
  function expandAroundCenter(left: number, right: number): number {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  }
  
  for (let i = 0; i < s.length; i++) {
    const len1 = expandAroundCenter(i, i); // odd length
    const len2 = expandAroundCenter(i, i + 1); // even length
    const maxLen = Math.max(len1, len2);
    
    if (maxLen > maxLength) {
      start = i - Math.floor((maxLen - 1) / 2);
      maxLength = maxLen;
    }
  }
  
  return s.substring(start, start + maxLength);
}`
      }
    ],
    hints: [
      "Consider expanding around each character as a center",
      "Handle both odd and even length palindromes",
      "Keep track of the longest palindrome found so far"
    ],
    similarQuestions: ["Palindromic Substrings", "Longest Palindromic Subsequence", "Valid Palindrome"],
    techniques: ["Expand Around Center", "Palindrome Properties", "String Manipulation"],
    acceptanceRate: 31.2,
    frequency: 71.8,
    companies: ["Amazon", "Google", "Microsoft", "Facebook"],
    premium: false
  }
];

export const algorithmCategories = {
  "Array": ["Two Pointers", "Sliding Window", "Prefix Sum", "Binary Search"],
  "Linked List": ["Fast & Slow Pointers", "Reversal", "Merge", "Cycle Detection"],
  "Tree": ["DFS", "BFS", "Binary Search Tree", "Trie"],
  "Dynamic Programming": ["Memoization", "Tabulation", "State Machine", "Knapsack"],
  "Graph": ["DFS", "BFS", "Dijkstra", "Union Find", "Topological Sort"],
  "String": ["Sliding Window", "Two Pointers", "String Matching", "Palindrome"],
  "Hash Table": ["Hash Map", "Hash Set", "Frequency Counting"],
  "Stack": ["Monotonic Stack", "Parentheses", "Expression Evaluation"],
  "Queue": ["BFS", "Priority Queue", "Monotonic Queue"],
  "Heap": ["Min Heap", "Max Heap", "Priority Queue", "K-th Element"],
  "Binary Search": ["Binary Search", "Search in Rotated Array", "Median"],
  "Backtracking": ["Recursion", "State Space Tree", "Pruning"],
  "Greedy": ["Sorting", "Local Optimal Choice", "Activity Selection"],
  "Math": ["Bit Manipulation", "Number Theory", "Geometry"],
  "Design": ["Data Structure Design", "System Design", "API Design"]
};