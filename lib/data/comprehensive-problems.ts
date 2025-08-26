export interface LeetCodeProblem {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  category: string;
  algorithms: string[];
  description: string;
  companies?: string[];
  editorial: {
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
  leetcodeUrl: string;
}

export const comprehensiveProblems: LeetCodeProblem[] = [
  {
    id: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    category: "Array",
    algorithms: ["Hash Table", "Array", "Brute Force"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    companies: ["Google", "Amazon", "Microsoft"],
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
    category: "Linked List",
    algorithms: ["Linked List", "Math", "Recursion"],
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    companies: ["Amazon", "Microsoft", "Bloomberg"],
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
    category: "String",
    algorithms: ["Sliding Window", "Hash Table", "Two Pointers"],
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    companies: ["Google", "Amazon", "Microsoft"],
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
    category: "Array",
    algorithms: ["Binary Search", "Divide and Conquer"],
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    companies: ["Google", "Amazon", "Microsoft"],
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
    category: "Stack",
    algorithms: ["Stack", "String"],
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    companies: ["Google", "Amazon", "Microsoft"],
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

// Export for backward compatibility
export const leetcodeProblems = comprehensiveProblems;