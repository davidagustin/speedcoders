export interface EditorialProblem {
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  description: string
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  constraints: string[]
  solutions: Array<{
    name: string
    description: string
    timeComplexity: string
    spaceComplexity: string
    approach: string
    code: string
    explanation: string
    pros: string[]
    cons: string[]
  }>
  hints: Array<{
    level: 'easy' | 'medium' | 'hard'
    text: string
  }>
  keyInsights: string[]
  relatedProblems: string[]
  leetcodeUrl: string
}

// Additional problems will be added as they are created

// Combine all problems
export const editorialProblems: EditorialProblem[] = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    solutions: [
      {
        name: "Hash Table",
        description: "Use hash table to store complements",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        approach: "Use a hash table to store each number and its index. For each number, check if its complement exists.",
        code: `function twoSum(nums, target) {
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
        explanation: "We use a hash table to store each number and its index. For each number, we check if its complement (target - current number) exists in the hash table.",
        pros: ["Optimal time complexity", "Single pass solution"],
        cons: ["Uses extra space", "Requires hash table understanding"]
      }
    ],
    hints: [
      { level: "easy", text: "Think about using a hash table to store numbers you've seen." },
      { level: "medium", text: "For each number, check if its complement (target - number) exists in the hash table." },
      { level: "hard", text: "Use a Map to store both the number and its index for O(1) lookup." }
    ],
    keyInsights: ["Hash table for O(1) lookup", "Single pass solution", "Store complement approach"],
    relatedProblems: ["3Sum", "Two Sum II"],
    leetcodeUrl: "https://leetcode.com/problems/two-sum/"
  },
  {
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807"
      }
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100]",
      "0 <= Node.val <= 9"
    ],
    solutions: [
      {
        name: "Iterative",
        description: "Add digits and handle carry",
        timeComplexity: "O(max(m,n))",
        spaceComplexity: "O(max(m,n))",
        approach: "Iterate through both lists simultaneously, add corresponding digits and handle carry.",
        code: `function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let current = dummy;
  let carry = 0;
  
  while (l1 || l2 || carry) {
    const sum = (l1?.val || 0) + (l2?.val || 0) + carry;
    carry = Math.floor(sum / 10);
    
    current.next = new ListNode(sum % 10);
    current = current.next;
    
    l1 = l1?.next;
    l2 = l2?.next;
  }
  
  return dummy.next;
}`,
        explanation: "We iterate through both lists, adding corresponding digits and handling carry. We create a new list to store the result.",
        pros: ["Handles different lengths", "Clear logic"],
        cons: ["Creates new list", "Requires carry handling"]
      }
    ],
    hints: [
      { level: "easy", text: "Think about how you add numbers digit by digit." },
      { level: "medium", text: "You'll need to handle carry when the sum exceeds 9." },
      { level: "hard", text: "Use a dummy head to simplify the logic and handle edge cases." }
    ],
    keyInsights: ["Handle carry", "Dummy head", "Iterate simultaneously"],
    relatedProblems: ["Multiply Strings", "Add Binary"],
    leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/"
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: "The answer is 'abc', with the length of 3."
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    solutions: [
      {
        name: "Sliding Window",
        description: "Use sliding window with hash set",
        timeComplexity: "O(n)",
        spaceComplexity: "O(min(m,n))",
        approach: "Use a sliding window with a hash set to track unique characters.",
        code: `function lengthOfLongestSubstring(s) {
  const set = new Set();
  let maxLength = 0;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}`,
        explanation: "We use a sliding window approach with a hash set to track unique characters. When we encounter a duplicate, we shrink the window from the left.",
        pros: ["Optimal time complexity", "Single pass solution"],
        cons: ["Uses extra space", "Requires sliding window understanding"]
      }
    ],
    hints: [
      { level: "easy", text: "Think about using a sliding window to track unique characters." },
      { level: "medium", text: "Use a hash set to store characters in the current window." },
      { level: "hard", text: "When you encounter a duplicate, shrink the window from the left until it's unique again." }
    ],
    keyInsights: ["Sliding window", "Hash set for uniqueness", "Two pointers"],
    relatedProblems: ["Minimum Window Substring", "Longest Repeating Character Replacement"],
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "Simple valid parentheses."
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'"
    ],
    solutions: [
      {
        name: "Stack",
        description: "Use stack to track opening brackets",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        approach: "Use a stack to keep track of opening brackets and pop when we encounter matching closing brackets.",
        code: `function isValid(s) {
  const stack = [];
  const brackets = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== brackets[char]) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}`,
        explanation: "We use a stack to keep track of opening brackets. When we encounter a closing bracket, we check if it matches the most recent opening bracket.",
        pros: ["Simple and efficient", "Clear logic"],
        cons: ["Uses extra space", "Requires understanding of stack"]
      }
    ],
    hints: [
      { level: "easy", text: "Think about using a stack to keep track of opening brackets." },
      { level: "medium", text: "When you see a closing bracket, check if it matches the most recent opening bracket." },
      { level: "hard", text: "Make sure the stack is empty at the end to ensure all brackets are properly closed." }
    ],
    keyInsights: ["Use stack for bracket matching", "Check for matching pairs", "Ensure stack is empty at end"],
    relatedProblems: ["Generate Parentheses", "Longest Valid Parentheses"],
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/"
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    solutions: [
      {
        name: "Kadane's Algorithm",
        description: "Track current sum and maximum sum",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        approach: "Use Kadane's algorithm to track the current sum and update the maximum sum when we find a better subarray.",
        code: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}`,
        explanation: "We use Kadane's algorithm to find the maximum subarray sum. We keep track of the current sum and update it based on whether adding the current element improves the sum.",
        pros: ["Optimal time and space complexity", "Single pass solution"],
        cons: ["Requires understanding of dynamic programming", "Edge case handling"]
      }
    ],
    hints: [
      { level: "easy", text: "Think about how to track the current sum as you iterate through the array." },
      { level: "medium", text: "At each step, decide whether to start a new subarray or extend the current one." },
      { level: "hard", text: "Use Kadane's algorithm: currentSum = max(nums[i], currentSum + nums[i])." }
    ],
    keyInsights: ["Kadane's algorithm", "Track current and maximum sum", "Dynamic programming approach"],
    relatedProblems: ["Best Time to Buy and Sell Stock", "Maximum Product Subarray"],
    leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/"
  }
];

export function getProblemsByDifficulty(difficulty: string) {
  return editorialProblems.filter(p => p.difficulty === difficulty);
}

export function getProblemsByCategory(category: string) {
  return editorialProblems.filter(p => p.category === category);
}

export default editorialProblems;