import { NextRequest, NextResponse } from 'next/server'

interface EditorialContent {
  problemTitle: string
  editorialUrl: string
  approaches: {
    name: string
    description: string
    timeComplexity: string
    spaceComplexity: string
    code: string
    explanation: string
  }[]
  relatedTopics: string[]
}

// Mock editorial data - in production, this would fetch from LeetCode's API
const editorialDatabase: Record<string, EditorialContent> = {
  'two-sum': {
    problemTitle: "Two Sum",
    editorialUrl: "https://leetcode.com/problems/two-sum/editorial/",
    approaches: [
      {
        name: "Brute Force",
        description: "Check every pair of elements",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[] {i, j};
                }
            }
        }
        return new int[] {};
    }
}`,
        explanation: "The brute force approach checks every possible pair of elements in the array. For each element, we check if there's another element that sums to the target."
      },
      {
        name: "Hash Map",
        description: "Use a hash map to store complements",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] {map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
        explanation: "The hash map approach is more efficient. For each element, we check if its complement (target - current_element) exists in the hash map. If found, we return the indices."
      }
    ],
    relatedTopics: ["Array", "Hash Table", "Two Pointers"]
  },
  'add-two-numbers': {
    problemTitle: "Add Two Numbers",
    editorialUrl: "https://leetcode.com/problems/add-two-numbers/editorial/",
    approaches: [
      {
        name: "Elementary Math",
        description: "Simulate the addition process digit by digit",
        timeComplexity: "O(max(M,N))",
        spaceComplexity: "O(max(M,N))",
        code: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummyHead = new ListNode(0);
        ListNode curr = dummyHead;
        int carry = 0;
        
        while (l1 != null || l2 != null || carry != 0) {
            int x = (l1 != null) ? l1.val : 0;
            int y = (l2 != null) ? l2.val : 0;
            int sum = carry + x + y;
            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;
            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }
        return dummyHead.next;
    }
}`,
        explanation: "We simulate the elementary math addition process. We iterate through both linked lists, adding corresponding digits and handling the carry."
      }
    ],
    relatedTopics: ["Linked List", "Math", "Recursion"]
  },
  'longest-substring-without-repeating-characters': {
    problemTitle: "Longest Substring Without Repeating Characters",
    editorialUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/editorial/",
    approaches: [
      {
        name: "Sliding Window",
        description: "Use two pointers to maintain a window of unique characters",
        timeComplexity: "O(n)",
        spaceComplexity: "O(min(m,n))",
        code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int[] chars = new int[128];
        int left = 0;
        int right = 0;
        int res = 0;
        
        while (right < s.length()) {
            char r = s.charAt(right);
            chars[r]++;
            
            while (chars[r] > 1) {
                char l = s.charAt(left);
                chars[l]--;
                left++;
            }
            
            res = Math.max(res, right - left + 1);
            right++;
        }
        return res;
    }
}`,
        explanation: "We use a sliding window approach with two pointers. The right pointer expands the window, and the left pointer contracts it when we encounter a repeating character."
      }
    ],
    relatedTopics: ["Hash Table", "String", "Sliding Window"]
  },
  'median-of-two-sorted-arrays': {
    problemTitle: "Median of Two Sorted Arrays",
    editorialUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/editorial/",
    approaches: [
      {
        name: "Binary Search",
        description: "Find the correct partition point using binary search",
        timeComplexity: "O(log(min(m,n)))",
        spaceComplexity: "O(1)",
        code: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }
        
        int x = nums1.length;
        int y = nums2.length;
        int low = 0;
        int high = x;
        
        while (low <= high) {
            int partitionX = (low + high) / 2;
            int partitionY = (x + y + 1) / 2 - partitionX;
            
            int maxLeftX = (partitionX == 0) ? Integer.MIN_VALUE : nums1[partitionX - 1];
            int minRightX = (partitionX == x) ? Integer.MAX_VALUE : nums1[partitionX];
            
            int maxLeftY = (partitionY == 0) ? Integer.MIN_VALUE : nums2[partitionY - 1];
            int minRightY = (partitionY == y) ? Integer.MAX_VALUE : nums2[partitionY];
            
            if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
                if ((x + y) % 2 == 0) {
                    return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2.0;
                } else {
                    return Math.max(maxLeftX, maxLeftY);
                }
            } else if (maxLeftX > minRightY) {
                high = partitionX - 1;
            } else {
                low = partitionX + 1;
            }
        }
        throw new IllegalArgumentException();
    }
}`,
        explanation: "We use binary search to find the correct partition point. The key insight is that the median divides both arrays into left and right halves."
      }
    ],
    relatedTopics: ["Array", "Binary Search", "Divide and Conquer"]
  },
  'longest-palindromic-substring': {
    problemTitle: "Longest Palindromic Substring",
    editorialUrl: "https://leetcode.com/problems/longest-palindromic-substring/editorial/",
    approaches: [
      {
        name: "Expand Around Center",
        description: "Expand from each character and between characters",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        code: `class Solution {
    public String longestPalindrome(String s) {
        if (s == null || s.length() < 1) return "";
        
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            int len1 = expandAroundCenter(s, i, i);
            int len2 = expandAroundCenter(s, i, i + 1);
            int len = Math.max(len1, len2);
            if (len > end - start) {
                start = i - (len - 1) / 2;
                end = i + len / 2;
            }
        }
        return s.substring(start, end + 1);
    }
    
    private int expandAroundCenter(String s, int left, int right) {
        int L = left, R = right;
        while (L >= 0 && R < s.length() && s.charAt(L) == s.charAt(R)) {
            L--;
            R++;
        }
        return R - L - 1;
    }
}`,
        explanation: "We expand around each character and between characters to find palindromes. This approach is more intuitive than dynamic programming."
      },
      {
        name: "Dynamic Programming",
        description: "Use DP table to track palindromic substrings",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(n²)",
        code: `class Solution {
    public String longestPalindrome(String s) {
        int n = s.length();
        boolean[][] dp = new boolean[n][n];
        int start = 0, maxLen = 1;
        
        // Single characters are palindromes
        for (int i = 0; i < n; i++) {
            dp[i][i] = true;
        }
        
        // Check for length 2
        for (int i = 0; i < n - 1; i++) {
            if (s.charAt(i) == s.charAt(i + 1)) {
                dp[i][i + 1] = true;
                start = i;
                maxLen = 2;
            }
        }
        
        // Check for lengths greater than 2
        for (int len = 3; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (s.charAt(i) == s.charAt(j) && dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                    if (len > maxLen) {
                        start = i;
                        maxLen = len;
                    }
                }
            }
        }
        return s.substring(start, start + maxLen);
    }
}`,
        explanation: "We use a 2D DP table where dp[i][j] represents if substring from i to j is a palindrome."
      }
    ],
    relatedTopics: ["String", "Dynamic Programming", "Two Pointers"]
  },
  'container-with-most-water': {
    problemTitle: "Container With Most Water",
    editorialUrl: "https://leetcode.com/problems/container-with-most-water/editorial/",
    approaches: [
      {
        name: "Two Pointers",
        description: "Move pointers from both ends towards center",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        code: `class Solution {
    public int maxArea(int[] height) {
        int maxArea = 0;
        int left = 0;
        int right = height.length - 1;
        
        while (left < right) {
            int width = right - left;
            int h = Math.min(height[left], height[right]);
            maxArea = Math.max(maxArea, width * h);
            
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
}`,
        explanation: "We use two pointers starting from both ends. The key insight is that we always move the pointer with the smaller height."
      }
    ],
    relatedTopics: ["Array", "Two Pointers", "Greedy"]
  },
  '3sum': {
    problemTitle: "3Sum",
    editorialUrl: "https://leetcode.com/problems/3sum/editorial/",
    approaches: [
      {
        name: "Two Pointers",
        description: "Sort array and use two pointers for each element",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        code: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums);
        
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            int left = i + 1;
            int right = nums.length - 1;
            
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return result;
    }
}`,
        explanation: "We sort the array first, then for each element, we use two pointers to find pairs that sum to the negative of the current element."
      }
    ],
    relatedTopics: ["Array", "Two Pointers", "Sorting"]
  },
  'remove-nth-node-from-end-of-list': {
    problemTitle: "Remove Nth Node From End of List",
    editorialUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/editorial/",
    approaches: [
      {
        name: "Two Pass",
        description: "First pass to count nodes, second pass to remove",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        code: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        int length = 0;
        ListNode first = head;
        
        while (first != null) {
            length++;
            first = first.next;
        }
        
        length -= n;
        first = dummy;
        while (length > 0) {
            length--;
            first = first.next;
        }
        first.next = first.next.next;
        return dummy.next;
    }
}`,
        explanation: "We first count the total number of nodes, then calculate which node to remove from the beginning."
      },
      {
        name: "One Pass",
        description: "Use two pointers with n distance apart",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        code: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode first = dummy;
        ListNode second = dummy;
        
        for (int i = 1; i <= n + 1; i++) {
            first = first.next;
        }
        
        while (first != null) {
            first = first.next;
            second = second.next;
        }
        second.next = second.next.next;
        return dummy.next;
    }
}`,
        explanation: "We use two pointers with n+1 distance apart. When the first pointer reaches the end, the second pointer is at the node before the one to be removed."
      }
    ],
    relatedTopics: ["Linked List", "Two Pointers"]
  },
  'valid-parentheses': {
    problemTitle: "Valid Parentheses",
    editorialUrl: "https://leetcode.com/problems/valid-parentheses/editorial/",
    approaches: [
      {
        name: "Stack",
        description: "Use stack to match opening and closing brackets",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        code: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if ((c == ')' && top != '(') || 
                    (c == '}' && top != '{') || 
                    (c == ']' && top != '[')) {
                    return false;
                }
            }
        }
        return stack.isEmpty();
    }
}`,
        explanation: "We use a stack to keep track of opening brackets. For each closing bracket, we check if it matches the most recent opening bracket."
      }
    ],
    relatedTopics: ["String", "Stack"]
  },
  'merge-two-sorted-lists': {
    problemTitle: "Merge Two Sorted Lists",
    editorialUrl: "https://leetcode.com/problems/merge-two-sorted-lists/editorial/",
    approaches: [
      {
        name: "Iterative",
        description: "Compare nodes and link them in sorted order",
        timeComplexity: "O(n + m)",
        spaceComplexity: "O(1)",
        code: `class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) {
                current.next = l1;
                l1 = l1.next;
            } else {
                current.next = l2;
                l2 = l2.next;
            }
            current = current.next;
        }
        
        current.next = l1 != null ? l1 : l2;
        return dummy.next;
    }
}`,
        explanation: "We compare the values of nodes from both lists and link the smaller one to our result list."
      },
      {
        name: "Recursive",
        description: "Use recursion to merge lists",
        timeComplexity: "O(n + m)",
        spaceComplexity: "O(n + m)",
        code: `class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        if (l1 == null) return l2;
        if (l2 == null) return l1;
        
        if (l1.val < l2.val) {
            l1.next = mergeTwoLists(l1.next, l2);
            return l1;
        } else {
            l2.next = mergeTwoLists(l1, l2.next);
            return l2;
        }
    }
}`,
        explanation: "We use recursion to merge the lists. The base case is when one of the lists is null."
      }
    ],
    relatedTopics: ["Linked List", "Recursion"]
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const problemSlug = searchParams.get('problem')

  if (!problemSlug) {
    return NextResponse.json(
      { error: 'Problem slug is required' },
      { status: 400 }
    )
  }

  const editorial = editorialDatabase[problemSlug]

  if (!editorial) {
    return NextResponse.json(
      { error: 'Editorial not found for this problem' },
      { status: 404 }
    )
  }

  return NextResponse.json(editorial)
}
