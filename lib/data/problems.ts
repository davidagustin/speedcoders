export interface LeetCodeProblem {
  id: number;
  title: string;
  slug?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics?: string[];
  algorithms: string[];
  correctAlgorithms: string[];
  description: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  constraints?: string[];
  editorial?: {
    approach: string;
    timeComplexity: string;
    spaceComplexity: string;
    solutions: Array<{
      name: string;
      description: string;
      code: string;
      explanation: string;
    }>;
  };
  leetcodeUrl?: string;
}

export const comprehensiveProblems = [
  {
    id: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Table"],
    algorithms: ["Hash Table", "Array", "Brute Force"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
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
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    editorial: {
      approach: "Use a hash table to store complements. For each number, check if its complement (target - num) exists in the hash table.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      solutions: [
        {
          name: "Hash Table Approach",
          description: "Use a hash map to store numbers and their indices. For each number, check if target - num exists in the map.",
          code: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  
  return [];
}`,
          explanation: "We iterate through the array once, storing each number and its index in a hash map. For each number, we check if its complement (target - current number) exists in the map. If found, we return the indices."
        }
      ]
    },
    leetcodeUrl: "https://leetcode.com/problems/two-sum/"
  },
  {
    id: 2,
    title: "Add Two Numbers",
    slug: "add-two-numbers",
    difficulty: "Medium",
    topics: ["Linked List", "Math"],
    algorithms: ["Linked List", "Math", "Recursion"],
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807"
      }
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100]",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ],
    editorial: {
      approach: "Simulate the addition process digit by digit, handling carry-over at each step.",
      timeComplexity: "O(max(M,N))",
      spaceComplexity: "O(max(M,N))",
      solutions: [
        {
          name: "Iterative Approach",
          description: "Iterate through both lists simultaneously, adding digits and handling carry.",
          code: `function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;
  let carry = 0;
  
  while (l1 || l2 || carry) {
    const val1 = l1 ? l1.val : 0;
    const val2 = l2 ? l2.val : 0;
    const sum = val1 + val2 + carry;
    
    carry = Math.floor(sum / 10);
    current.next = new ListNode(sum % 10);
    current = current.next;
    
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  
  return dummy.next;
}`,
          explanation: "We use a dummy head to simplify the logic. We iterate through both lists, adding corresponding digits and the carry from the previous addition. We create a new node for each digit of the result."
        }
      ]
    },
    leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/"
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    topics: ["String", "Hash Table"],
    algorithms: ["Sliding Window", "Hash Table", "Two Pointers"],
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
    editorial: {
      approach: "Use sliding window technique with a hash set to track unique characters in the current window.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(min(m,n))",
      solutions: [
        {
          name: "Sliding Window",
          description: "Maintain a sliding window of unique characters using a hash set.",
          code: `function lengthOfLongestSubstring(s: string): number {
  const set = new Set<string>();
  let left = 0;
  let maxLength = 0;
  
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
          explanation: "We use two pointers (left and right) to maintain a sliding window. We expand the window by moving the right pointer and shrink it by moving the left pointer when we encounter a duplicate character."
        }
      ]
    },
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
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
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2."
      }
    ],
    constraints: [
      "nums1.length + nums2.length >= 1",
      "nums1.length + nums2.length <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    editorial: {
      approach: "Use binary search to find the correct partition of both arrays that gives us the median.",
      timeComplexity: "O(log(min(m,n)))",
      spaceComplexity: "O(1)",
      solutions: [
        {
          name: "Binary Search Approach",
          description: "Find the correct partition using binary search on the smaller array.",
          code: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }
  
  const m = nums1.length;
  const n = nums2.length;
  const left = Math.floor((m + n + 1) / 2);
  
  let low = 0;
  let high = m;
  
  while (low <= high) {
    const partitionX = Math.floor((low + high) / 2);
    const partitionY = left - partitionX;
    
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
  
  return 0;
}`,
          explanation: "We use binary search on the smaller array to find the correct partition. We check if the partition is correct by ensuring all elements on the left are less than all elements on the right."
        }
      ]
    },
    leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/"
  },
  {
    id: 5,
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    topics: ["String", "Stack"],
    algorithms: ["Stack", "String"],
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
    editorial: {
      approach: "Use a stack to keep track of opening brackets and match them with closing brackets.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      solutions: [
        {
          name: "Stack Approach",
          description: "Use a stack to validate parentheses matching.",
          code: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: { [key: string]: string } = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (const char of s) {
    if (pairs[char]) {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }
  
  return stack.length === 0;
}`,
          explanation: "We iterate through the string, pushing opening brackets onto the stack and popping them when we encounter matching closing brackets. If the stack is empty at the end, the string is valid."
        }
      ]
    },
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/"
  }
];

// Batch 1 Problems (1-500)
const batch1Problems = [
  {id:6,title:"Zigzag Conversion",difficulty:"Medium" as const,algorithms:["String","Simulation","Math","Pattern","Array"],correctAlgorithms:["String"],description:"Convert string to zigzag pattern"},
  {id:7,title:"Reverse Integer",difficulty:"Medium" as const,algorithms:["Math","String","Overflow Check","Modulo","Division"],correctAlgorithms:["Math"],description:"Reverse digits of integer"},
  {id:8,title:"String to Integer (atoi)",difficulty:"Medium" as const,algorithms:["String","Math","State Machine","Parsing","Edge Cases"],correctAlgorithms:["String","Math"],description:"Implement atoi function"},
  {id:9,title:"Palindrome Number",difficulty:"Easy" as const,algorithms:["Math","String","Two Pointers","Reverse","Modulo"],correctAlgorithms:["Math"],description:"Check if integer is palindrome"},
  {id:10,title:"Regular Expression Matching",difficulty:"Hard" as const,algorithms:["String","Dynamic Programming","Recursion","Backtracking","State Machine"],correctAlgorithms:["String","Dynamic Programming","Recursion"],description:"Implement regex matching"},
  {id:12,title:"Integer to Roman",difficulty:"Medium" as const,algorithms:["Hash Table","Math","String","Greedy","Lookup Table"],correctAlgorithms:["Hash Table","Math","String"],description:"Convert integer to Roman numeral"},
  {id:13,title:"Roman to Integer",difficulty:"Easy" as const,algorithms:["Hash Table","Math","String","Parsing","Lookup"],correctAlgorithms:["Hash Table","Math","String"],description:"Convert Roman numeral to integer"},
  {id:14,title:"Longest Common Prefix",difficulty:"Easy" as const,algorithms:["String","Trie","Binary Search","Vertical Scanning","Horizontal Scanning"],correctAlgorithms:["String","Trie"],description:"Find longest common prefix"},
  {id:16,title:"3Sum Closest",difficulty:"Medium" as const,algorithms:["Array","Two Pointers","Sorting","Binary Search","Optimization"],correctAlgorithms:["Array","Two Pointers","Sorting"],description:"Find triplet with sum closest to target"},
  {id:17,title:"Letter Combinations of a Phone Number",difficulty:"Medium" as const,algorithms:["Hash Table","String","Backtracking","DFS","BFS"],correctAlgorithms:["Hash Table","String","Backtracking"],description:"Generate letter combinations from phone digits"},
  {id:18,title:"4Sum",difficulty:"Medium" as const,algorithms:["Array","Two Pointers","Sorting","Hash Table","Recursion"],correctAlgorithms:["Array","Two Pointers","Sorting"],description:"Find all unique quadruplets"},
  {id:19,title:"Remove Nth Node From End of List",difficulty:"Medium" as const,algorithms:["Linked List","Two Pointers","Fast & Slow","Dummy Node","One Pass"],correctAlgorithms:["Linked List","Two Pointers"],description:"Remove nth node from end"},
  {id:22,title:"Generate Parentheses",difficulty:"Medium" as const,algorithms:["String","Dynamic Programming","Backtracking","DFS","Catalan Number"],correctAlgorithms:["String","Dynamic Programming","Backtracking"],description:"Generate valid parentheses combinations"},
  {id:23,title:"Merge k Sorted Lists",difficulty:"Hard" as const,algorithms:["Linked List","Divide and Conquer","Heap","Priority Queue","Merge Sort"],correctAlgorithms:["Linked List","Divide and Conquer","Heap"],description:"Merge k sorted linked lists"},
  {id:24,title:"Swap Nodes in Pairs",difficulty:"Medium" as const,algorithms:["Linked List","Recursion","Iteration","Two Pointers","Dummy Node"],correctAlgorithms:["Linked List","Recursion"],description:"Swap every two adjacent nodes"},
  {id:25,title:"Reverse Nodes in k-Group",difficulty:"Hard" as const,algorithms:["Linked List","Recursion","Stack","Two Pointers","Iteration"],correctAlgorithms:["Linked List","Recursion"],description:"Reverse nodes in k-group"},
  {id:28,title:"Find the Index of First Occurrence",difficulty:"Easy" as const,algorithms:["Two Pointers","String","String Matching","KMP","Rabin-Karp"],correctAlgorithms:["Two Pointers","String","String Matching"],description:"Find first occurrence of substring"},
  {id:29,title:"Divide Two Integers",difficulty:"Medium" as const,algorithms:["Math","Bit Manipulation","Binary Search","Exponential Search","Edge Cases"],correctAlgorithms:["Math","Bit Manipulation"],description:"Divide without multiplication/division"},
  {id:30,title:"Substring with Concatenation",difficulty:"Hard" as const,algorithms:["Hash Table","String","Sliding Window","Two Pointers","Permutation"],correctAlgorithms:["Hash Table","String","Sliding Window"],description:"Find substring with word concatenation"},
  {id:32,title:"Longest Valid Parentheses",difficulty:"Hard" as const,algorithms:["String","Dynamic Programming","Stack","Two Pass","Counter"],correctAlgorithms:["String","Dynamic Programming","Stack"],description:"Find longest valid parentheses substring"},
  {id:37,title:"Sudoku Solver",difficulty:"Hard" as const,algorithms:["Array","Hash Table","Backtracking","Matrix","Constraint Propagation"],correctAlgorithms:["Array","Hash Table","Backtracking","Matrix"],description:"Solve Sudoku puzzle"},
  {id:38,title:"Count and Say",difficulty:"Medium" as const,algorithms:["String","Simulation","Recursion","Iteration","Pattern"],correctAlgorithms:["String"],description:"Generate count and say sequence"},
  {id:43,title:"Multiply Strings",difficulty:"Medium" as const,algorithms:["Math","String","Simulation","Grade School Algorithm","Array"],correctAlgorithms:["Math","String","Simulation"],description:"Multiply two string numbers"},
  {id:44,title:"Wildcard Matching",difficulty:"Hard" as const,algorithms:["String","Dynamic Programming","Greedy","Recursion","Two Pointers"],correctAlgorithms:["String","Dynamic Programming","Greedy"],description:"Implement wildcard pattern matching"}
];

// Batch 2 Problems (501-1000) - Sample
const batch2Problems = [
  {id:501,title:"Find Mode in Binary Search Tree",difficulty:"Easy" as const,algorithms:["Tree","DFS","Binary Search Tree","Inorder","Hash Table"],correctAlgorithms:["Tree","DFS","Binary Search Tree"],description:"Find mode in BST"},
  {id:502,title:"IPO",difficulty:"Hard" as const,algorithms:["Array","Greedy","Sorting","Heap","Priority Queue"],correctAlgorithms:["Array","Greedy","Sorting","Heap"],description:"Maximum capital after IPOs"},
  {id:503,title:"Next Greater Element II",difficulty:"Medium" as const,algorithms:["Array","Stack","Monotonic Stack","Circular Array","Modulo"],correctAlgorithms:["Array","Stack","Monotonic Stack"],description:"Next greater in circular array"},
  {id:509,title:"Fibonacci Number",difficulty:"Easy" as const,algorithms:["Math","Dynamic Programming","Recursion","Memoization","Matrix"],correctAlgorithms:["Math","Dynamic Programming","Recursion","Memoization"],description:"Calculate Fibonacci number"},
  {id:516,title:"Longest Palindromic Subsequence",difficulty:"Medium" as const,algorithms:["String","Dynamic Programming","Palindrome","LCS","Memoization"],correctAlgorithms:["String","Dynamic Programming"],description:"Longest palindromic subsequence"},
  {id:518,title:"Coin Change II",difficulty:"Medium" as const,algorithms:["Array","Dynamic Programming","Knapsack","Combination","Unbounded"],correctAlgorithms:["Array","Dynamic Programming"],description:"Number of coin combinations"},
  {id:523,title:"Continuous Subarray Sum",difficulty:"Medium" as const,algorithms:["Array","Hash Table","Math","Prefix Sum","Modulo"],correctAlgorithms:["Array","Hash Table","Math","Prefix Sum"],description:"Subarray sum multiple of k"},
  {id:525,title:"Contiguous Array",difficulty:"Medium" as const,algorithms:["Array","Hash Table","Prefix Sum","Balance","Counter"],correctAlgorithms:["Array","Hash Table","Prefix Sum"],description:"Maximum length balanced array"},
  {id:560,title:"Subarray Sum Equals K",difficulty:"Medium" as const,algorithms:["Array","Hash Table","Prefix Sum","Counter","Subarray"],correctAlgorithms:["Array","Hash Table","Prefix Sum"],description:"Count subarrays with sum k"}
];

// Combine all problems
const allLeetCodeProblems = [...comprehensiveProblems, ...batch1Problems, ...batch2Problems];

// Export for backward compatibility  
export const leetcodeProblems = allLeetCodeProblems;
export const batchProblems = [...batch1Problems, ...batch2Problems];
