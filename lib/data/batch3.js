export const batch3Problems = [
	{
		id: 1001,
		title: "Grid Illumination",
		difficulty: "Hard",
		category: "Hash Table",
		algorithms: ["Hash Table", "Simulation"],
		description:
			"On a N x N grid of cells, each cell (x, y) with 0 <= x < N and 0 <= y < N has a lamp. Initially, some number of lamps are on. lamps[i] tells us the location of the i-th lamp that is on. Each lamp that is on illuminates every square on its x-axis, y-axis, and both diagonals (similar to a Queen in chess). For the i-th query queries[i] = (x, y), the answer to the query is 1 if the cell (x, y) is illuminated, else 0. After each query (x, y), we turn off any lamps that are at cell (x, y) or are adjacent 8-directionally (ie., share a corner or edge with cell (x, y).)",
		examples: [
			"Input: N = 5, lamps = [[0,0],[4,4]], queries = [[1,1],[1,0]]\nOutput: [1,0]",
			"Input: N = 5, lamps = [[0,0],[0,4]], queries = [[0,4],[0,1],[1,4]]\nOutput: [1,1,0]",
		],
		constraints: [
			"1 <= N <= 10^9",
			"0 <= lamps.length <= 20000",
			"0 <= queries.length <= 20000",
			"lamps[i].length == queries[i].length == 2",
		],
		solutions: [
			"Use hash tables to track illuminated rows, columns, and diagonals",
			"For each query, check if the cell is illuminated and turn off adjacent lamps",
		],
		timeComplexity: "O(N + L + Q)",
		spaceComplexity: "O(L)",
		leetcodeUrl: "https://leetcode.com/problems/grid-illumination/",
		tags: ["hash-table", "simulation"],
	},
	{
		id: 1002,
		title: "Find Common Characters",
		difficulty: "Easy",
		category: "Array",
		algorithms: ["Hash Table", "String"],
		description:
			"Given an array A of strings made only from lowercase letters, return a list of all characters that show up in all strings within the list (including duplicates). For example, if a character occurs 3 times in all strings but not 4 times, you need to include that character three times in the final answer.",
		examples: [
			'Input: ["bella","label","roller"]\nOutput: ["e","l","l"]',
			'Input: ["cool","lock","cook"]\nOutput: ["c","o"]',
		],
		constraints: [
			"1 <= A.length <= 100",
			"1 <= A[i].length <= 100",
			"A[i][j] is a lowercase letter",
		],
		solutions: [
			"Count character frequencies in each string",
			"Find the minimum frequency for each character across all strings",
		],
		timeComplexity: "O(N * L)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/find-common-characters/",
		tags: ["array", "hash-table", "string"],
	},
	{
		id: 1003,
		title: "Check If Word Is Valid After Substitutions",
		difficulty: "Medium",
		category: "String",
		algorithms: ["Stack", "String"],
		description:
			'We are given that the string "abc" is valid. From any valid string V, we may split V into two pieces X and Y such that X + Y (X concatenated with Y) is equal to V. (X or Y may be empty.) Then, X + "abc" + Y is also valid. If for example S = "abc", then examples of valid strings are: "abc", "aabcbc", "abcabc", "abcabcababcc". Examples of invalid strings are: "abccba", "ab", "cababc", "bac".',
		examples: [
			'Input: "aabcbc"\nOutput: true',
			'Input: "abcabcababcc"\nOutput: true',
			'Input: "abccba"\nOutput: false',
		],
		constraints: ["1 <= S.length <= 20000", "S[i] is 'a', 'b', or 'c'"],
		solutions: [
			"Use a stack to track the pattern",
			"When we see 'c', check if the previous two characters are 'b' and 'a'",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl:
			"https://leetcode.com/problems/check-if-word-is-valid-after-substitutions/",
		tags: ["stack", "string"],
	},
	{
		id: 1004,
		title: "Max Consecutive Ones III",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Sliding Window", "Two Pointers"],
		description:
			"Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's.",
		examples: [
			"Input: nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2\nOutput: 6",
			"Input: nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3\nOutput: 10",
		],
		constraints: [
			"1 <= nums.length <= 10^5",
			"nums[i] is either 0 or 1",
			"0 <= k <= nums.length",
		],
		solutions: [
			"Use sliding window technique",
			"Keep track of zeros in the current window",
			"Expand window when possible, shrink when too many zeros",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/max-consecutive-ones-iii/",
		tags: ["array", "sliding-window", "two-pointers"],
	},
	{
		id: 1005,
		title: "Maximize Sum Of Array After K Negations",
		difficulty: "Easy",
		category: "Array",
		algorithms: ["Greedy", "Sorting"],
		description:
			"Given an array A of integers, we must modify the array in the following way: we choose an i and replace A[i] with -A[i], and we repeat this process K times in total. (We may choose the same index i multiple times.) Return the largest possible sum of the array after modifying it in this way.",
		examples: [
			"Input: A = [4,2,3], K = 1\nOutput: 5",
			"Input: A = [3,-1,0,2], K = 3\nOutput: 6",
			"Input: A = [2,-3,-1,5,-4], K = 2\nOutput: 13",
		],
		constraints: [
			"1 <= A.length <= 10000",
			"1 <= K <= 10000",
			"-100 <= A[i] <= 100",
		],
		solutions: [
			"Sort the array",
			"Negate the smallest numbers first",
			"If K is odd after negating all negatives, negate the smallest positive",
		],
		timeComplexity: "O(N log N)",
		spaceComplexity: "O(1)",
		leetcodeUrl:
			"https://leetcode.com/problems/maximize-sum-of-array-after-k-negations/",
		tags: ["array", "greedy", "sorting"],
	},
	{
		id: 1006,
		title: "Clumsy Factorial",
		difficulty: "Medium",
		category: "Math",
		algorithms: ["Math", "Simulation"],
		description:
			"Normally, the factorial of a positive integer n is the product of all positive integers less than or equal to n. For example, factorial(10) = 10 * 9 * 8 * 7 * 6 * 5 * 4 * 3 * 2 * 1. We instead make a clumsy factorial: using the integers in decreasing order, we swap out the multiply operations for a fixed rotation of operations: multiply (*), divide (/), add (+) and subtract (-) in this order.",
		examples: [
			"Input: 4\nOutput: 7\nExplanation: 7 = 4 * 3 / 2 + 1",
			"Input: 10\nOutput: 12\nExplanation: 12 = 10 * 9 / 8 + 7 - 6 * 5 / 4 + 3 - 2 * 1",
		],
		constraints: ["1 <= N <= 10000", "-2^31 <= answer <= 2^31 - 1"],
		solutions: [
			"Simulate the clumsy factorial operation",
			"Use a stack to handle the operations in order",
			"Process multiplication and division first, then addition and subtraction",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/clumsy-factorial/",
		tags: ["math", "simulation"],
	},
	{
		id: 1007,
		title: "Minimum Domino Rotations For Equal Row",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Greedy", "Array"],
		description:
			"In a row of dominoes, A[i] and B[i] represent the top and bottom halves of the i-th domino. (A domino is a tile with two numbers from 1 to 6 - one on each half of the tile.) We may rotate the i-th domino, so that A[i] and B[i] swap values. Return the minimum number of rotations so that all the values in A are the same, or all the values in B are the same. If it cannot be done, return -1.",
		examples: [
			"Input: A = [2,1,2,4,2,2], B = [5,2,6,2,3,2]\nOutput: 2",
			"Input: A = [3,5,1,2,3], B = [3,6,3,3,4]\nOutput: -1",
		],
		constraints: ["1 <= A[i], B[i] <= 6", "2 <= A.length == B.length <= 20000"],
		solutions: [
			"Check if it's possible to make all values in A or B the same",
			"For each possible value (1-6), calculate minimum rotations needed",
			"Return the minimum of all possible solutions",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(1)",
		leetcodeUrl:
			"https://leetcode.com/problems/minimum-domino-rotations-for-equal-row/",
		tags: ["array", "greedy"],
	},
	{
		id: 1008,
		title: "Construct Binary Search Tree from Preorder Traversal",
		difficulty: "Medium",
		category: "Tree",
		algorithms: ["Tree", "Recursion", "Stack"],
		description:
			"Return the root node of a binary search tree that matches the given preorder traversal. (Recall that a binary search tree is a binary tree where for every node, any descendant of node.left has a value < node.val, and any descendant of node.right has a value > node.val. Also recall that a preorder traversal displays the value of the node first, then traverses node.left, then traverses node.right.)",
		examples: [
			"Input: [8,5,1,7,10,12]\nOutput: [8,5,10,1,7,null,12]",
			"Input: [1,3]\nOutput: [1,null,3]",
		],
		constraints: [
			"1 <= preorder.length <= 100",
			"The values of preorder are distinct.",
		],
		solutions: [
			"Use recursion with bounds checking",
			"Use stack-based iterative approach",
			"Track the upper bound for each subtree",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl:
			"https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/",
		tags: ["tree", "recursion", "stack"],
	},
	{
		id: 1009,
		title: "Complement of Base 10 Integer",
		difficulty: "Easy",
		category: "Bit Manipulation",
		algorithms: ["Bit Manipulation"],
		description:
			'Every non-negative integer N has a binary representation. For example, 5 can be represented as "101" in binary, 11 as "1011" in binary, and so on. Note that except for N = 0, there are no leading zeroes in any binary representation. The complement of a binary representation is the number in binary you get when changing every 1 to a 0 and 0 to a 1. For example, the complement of "101" in binary is "010" in binary.',
		examples: [
			'Input: 5\nOutput: 2\nExplanation: 5 is "101" in binary, with complement "010" in binary, which is 2 in base-10.',
			'Input: 7\nOutput: 0\nExplanation: 7 is "111" in binary, with complement "000" in binary, which is 0 in base-10.',
			'Input: 10\nOutput: 5\nExplanation: 10 is "1010" in binary, with complement "0101" in binary, which is 5 in base-10.',
		],
		constraints: ["0 <= N < 10^9"],
		solutions: [
			"Find the highest power of 2 greater than N",
			"Subtract 1 to get all 1s up to that bit",
			"XOR with N to get the complement",
		],
		timeComplexity: "O(log N)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/complement-of-base-10-integer/",
		tags: ["bit-manipulation"],
	},
	{
		id: 1010,
		title: "Pairs of Songs With Total Durations Divisible by 60",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Hash Table", "Math"],
		description:
			"In a list of songs, the i-th song has a duration of time[i] seconds. Return the number of pairs of songs for which their total duration in seconds is divisible by 60. Formally, we want the number of indices i, j such that i < j with (time[i] + time[j]) % 60 == 0.",
		examples: [
			"Input: [30,20,150,100,40]\nOutput: 3\nExplanation: Three pairs have a total duration divisible by 60:\n(time[0] = 30, time[2] = 150): total duration 180\n(time[1] = 20, time[3] = 100): total duration 120\n(time[1] = 20, time[4] = 40): total duration 60",
			"Input: [60,60,60]\nOutput: 3\nExplanation: All three pairs have a total duration of 120, which is divisible by 60.",
		],
		constraints: ["1 <= time.length <= 60000", "1 <= time[i] <= 500"],
		solutions: [
			"Use hash table to count remainders",
			"For each number, find how many numbers have complementary remainder",
			"Handle special case of remainder 0 and 30",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(1)",
		leetcodeUrl:
			"https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60/",
		tags: ["array", "hash-table", "math"],
	},
	{
		id: 1011,
		title: "Capacity To Ship Packages Within D Days",
		difficulty: "Medium",
		category: "Binary Search",
		algorithms: ["Binary Search", "Greedy"],
		description:
			"A conveyor belt has packages that must be shipped from one port to another within days days. The ith package on the conveyor belt has a weight of weights[i]. Each day, we load the ship with packages on the conveyor belt (in the order given by weights). We may not load more weight than the maximum weight capacity of the ship. Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within days days.",
		examples: [
			"Input: weights = [1,2,3,4,5,6,7,8,9,10], days = 5\nOutput: 15\nExplanation: A ship capacity of 15 is the minimum to ship all the packages in 5 days like this:\n1st day: 1, 2, 3, 4, 5\n2nd day: 6, 7\n3rd day: 8\n4th day: 9\n5th day: 10",
			"Input: weights = [3,2,2,4,1,4], days = 3\nOutput: 6\nExplanation: A ship capacity of 6 is the minimum to ship all the packages in 3 days like this:\n1st day: 3, 2\n2nd day: 2, 4\n3rd day: 1, 4",
		],
		constraints: [
			"1 <= days <= weights.length <= 5 * 10^4",
			"1 <= weights[i] <= 500",
		],
		solutions: [
			"Use binary search on the capacity",
			"For each capacity, check if it's possible to ship within days",
			"Return the minimum valid capacity",
		],
		timeComplexity: "O(N log W)",
		spaceComplexity: "O(1)",
		leetcodeUrl:
			"https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
		tags: ["binary-search", "greedy"],
	},
	{
		id: 1012,
		title: "Numbers With Repeated Digits",
		difficulty: "Hard",
		category: "Dynamic Programming",
		algorithms: ["Dynamic Programming", "Math"],
		description:
			"Given an integer n, return the number of positive integers in the range [1, n] that have at least one repeated digit.",
		examples: [
			"Input: n = 20\nOutput: 1\nExplanation: The only positive number (<= 20) with at least 1 repeated digit is 11.",
			"Input: n = 100\nOutput: 10\nExplanation: The positive numbers (<= 100) with at least 1 repeated digit are 11, 22, 33, 44, 55, 66, 77, 88, 99, and 100.",
			"Input: n = 1000\nOutput: 262",
		],
		constraints: ["1 <= n <= 10^9"],
		solutions: [
			"Use digit dynamic programming",
			"Count numbers without repeated digits",
			"Subtract from total to get numbers with repeated digits",
		],
		timeComplexity: "O(log N)",
		spaceComplexity: "O(log N)",
		leetcodeUrl: "https://leetcode.com/problems/numbers-with-repeated-digits/",
		tags: ["dynamic-programming", "math"],
	},
	{
		id: 1013,
		title: "Partition Array Into Three Parts With Equal Sum",
		difficulty: "Easy",
		category: "Array",
		algorithms: ["Array", "Prefix Sum"],
		description:
			"Given an array of integers arr, return true if we can partition the array into three non-empty parts with equal sums. Formally, we can partition the array if we can find indexes i + 1 < j with (arr[0] + arr[1] + ... + arr[i] == arr[i + 1] + arr[i + 2] + ... + arr[j - 1] == arr[j] + arr[j + 1] + ... + arr[arr.length - 1]).",
		examples: [
			"Input: arr = [0,2,1,-6,6,-7,9,1,2,0,1]\nOutput: true\nExplanation: 0 + 2 + 1 = -6 + 6 - 7 + 9 + 1 = 2 + 0 + 1",
			"Input: arr = [0,2,1,-6,6,7,9,-1,2,0,1]\nOutput: false",
			"Input: arr = [3,3,6,5,-2,2,5,1,-9,4]\nOutput: true\nExplanation: 3 + 3 = 6 = 5 - 2 + 2 + 5 + 1 - 9 + 4",
		],
		constraints: ["3 <= arr.length <= 5 * 10^4", "-10^4 <= arr[i] <= 10^4"],
		solutions: [
			"Calculate total sum and check if it's divisible by 3",
			"Find two points where prefix sum equals total/3 and 2*total/3",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(1)",
		leetcodeUrl:
			"https://leetcode.com/problems/partition-array-into-three-parts-with-equal-sum/",
		tags: ["array", "prefix-sum"],
	},
	{
		id: 1014,
		title: "Best Sightseeing Pair",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Array", "Dynamic Programming"],
		description:
			"You are given an integer array values where values[i] represents the value of the ith sightseeing spot. Two sightseeing spots i and j have a distance j - i between them. The score of a pair (i < j) of sightseeing spots is values[i] + values[j] + i - j: the sum of the values of the sightseeing spots, minus the distance between them. Return the maximum score of a pair of sightseeing spots.",
		examples: [
			"Input: values = [8,1,5,2,6]\nOutput: 11\nExplanation: i = 0, j = 2, score = 8 + 5 + 0 - 2 = 11",
			"Input: values = [1,2]\nOutput: 2",
		],
		constraints: ["2 <= values.length <= 5 * 10^4", "1 <= values[i] <= 1000"],
		solutions: [
			"Use dynamic programming to track maximum value + index seen so far",
			"For each position, calculate score with previous maximum",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/best-sightseeing-pair/",
		tags: ["array", "dynamic-programming"],
	},
	{
		id: 1015,
		title: "Smallest Integer Divisible by K",
		difficulty: "Medium",
		category: "Math",
		algorithms: ["Math", "Modular Arithmetic"],
		description:
			"Given a positive integer k, you need to find the length of the smallest positive integer n such that n is divisible by k, and n only contains the digit 1. Return the length of n. If there is no such n, return -1. Note: n may not fit in a 64-bit signed integer.",
		examples: [
			"Input: k = 1\nOutput: 1\nExplanation: The smallest answer is n = 1, which has length 1.",
			"Input: k = 2\nOutput: -1\nExplanation: There is no such positive integer n divisible by 2.",
			"Input: k = 3\nOutput: 3\nExplanation: The smallest answer is n = 111, which has length 3.",
		],
		constraints: ["1 <= k <= 10^5"],
		solutions: [
			"Use modular arithmetic to track remainders",
			"If we see the same remainder twice, there's no solution",
			"Return the length when remainder becomes 0",
		],
		timeComplexity: "O(K)",
		spaceComplexity: "O(K)",
		leetcodeUrl:
			"https://leetcode.com/problems/smallest-integer-divisible-by-k/",
		tags: ["math", "modular-arithmetic"],
	},
	{
		id: 1016,
		title: "Binary String With Substrings Representing 1 To N",
		difficulty: "Medium",
		category: "String",
		algorithms: ["String", "Bit Manipulation"],
		description:
			"Given a binary string s and a positive integer n, return true if the binary representation of all the integers in the range [1, n] are substrings of s, or false otherwise. A substring is a contiguous sequence of characters within a string.",
		examples: [
			'Input: s = "0110", n = 3\nOutput: true',
			'Input: s = "0110", n = 4\nOutput: false',
			'Input: s = "0110", n = 1\nOutput: true',
		],
		constraints: [
			"1 <= s.length <= 1000",
			"s[i] is either '0' or '1'",
			"1 <= n <= 10^9",
		],
		solutions: [
			"Convert each number from 1 to n to binary string",
			"Check if each binary string is a substring of s",
			"Optimize by checking only numbers up to a certain limit",
		],
		timeComplexity: "O(N log N)",
		spaceComplexity: "O(log N)",
		leetcodeUrl:
			"https://leetcode.com/problems/binary-string-with-substrings-representing-1-to-n/",
		tags: ["string", "bit-manipulation"],
	},
	{
		id: 1017,
		title: "Convert to Base -2",
		difficulty: "Medium",
		category: "Math",
		algorithms: ["Math", "Bit Manipulation"],
		description:
			'Given an integer n, return a binary string representing its representation in base -2. Note that the returned string should not have leading zeros unless the string is "0".',
		examples: [
			'Input: n = 2\nOutput: "110"\nExplanation: (-2)^2 + (-2)^1 = 4 + (-2) = 2',
			'Input: n = 3\nOutput: "111"\nExplanation: (-2)^2 + (-2)^1 + (-2)^0 = 4 + (-2) + 1 = 3',
			'Input: n = 4\nOutput: "100"\nExplanation: (-2)^2 = 4',
		],
		constraints: ["0 <= n <= 10^9"],
		solutions: [
			"Use the same algorithm as base conversion but with -2",
			"Handle negative remainders by adding 2 and carrying 1",
		],
		timeComplexity: "O(log N)",
		spaceComplexity: "O(log N)",
		leetcodeUrl: "https://leetcode.com/problems/convert-to-base-2/",
		tags: ["math", "bit-manipulation"],
	},
	{
		id: 1018,
		title: "Binary Prefix Divisible By 5",
		difficulty: "Easy",
		category: "Array",
		algorithms: ["Array", "Math"],
		description:
			"You are given a binary array nums (0-indexed). We define xi as the number whose binary representation is the subarray nums[0..i] (from most-significant-bit to least-significant-bit). For example, if nums = [1,0,1], then x0 = 1, x1 = 2, and x2 = 5. Return an array of booleans answer where answer[i] is true if xi is divisible by 5.",
		examples: [
			"Input: nums = [0,1,1]\nOutput: [true,false,false]\nExplanation: The input numbers in binary are 0, 01, 011; which are 0, 1, and 3 in base-10.\nOnly the first number is divisible by 5, so answer[0] is true.",
			"Input: nums = [1,1,1]\nOutput: [false,false,false]",
		],
		constraints: ["1 <= nums.length <= 10^5", "nums[i] is 0 or 1"],
		solutions: [
			"Build the number incrementally",
			"Use modular arithmetic to avoid overflow",
			"Check if remainder is 0 for each prefix",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/binary-prefix-divisible-by-5/",
		tags: ["array", "math"],
	},
	{
		id: 1019,
		title: "Next Greater Node In Linked List",
		difficulty: "Medium",
		category: "Linked List",
		algorithms: ["Linked List", "Stack"],
		description:
			"You are given the head of a linked list with n nodes. For each node in the list, find the value of the next greater node. That is, for each node, find the value of the first node that is next to it and has a strictly larger value than it. Return an integer array answer where answer[i] is the value of the next greater node of the ith node (1-indexed). If the ith node does not have a next greater node, set answer[i] = 0.",
		examples: [
			"Input: head = [2,1,5]\nOutput: [5,5,0]",
			"Input: head = [2,7,4,3,5]\nOutput: [7,0,5,5,0]",
		],
		constraints: [
			"The number of nodes in the list is n.",
			"1 <= n <= 10^4",
			"1 <= Node.val <= 10^9",
		],
		solutions: [
			"Convert linked list to array",
			"Use monotonic stack to find next greater element",
			"Process from right to left",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl:
			"https://leetcode.com/problems/next-greater-node-in-linked-list/",
		tags: ["linked-list", "stack"],
	},
	{
		id: 1020,
		title: "Number of Enclaves",
		difficulty: "Medium",
		category: "Graph",
		algorithms: ["DFS", "BFS"],
		description:
			"You are given an m x n binary matrix grid, where 0 represents a sea cell and 1 represents a land cell. A move consists of walking from one land cell to another adjacent (4-directionally) land cell or walking off the boundary of the grid. Return the number of land cells in grid for which we cannot walk off the boundary of the grid in any number of moves.",
		examples: [
			"Input: grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]\nOutput: 3\nExplanation: There are three 1s that are enclosed by 0s, and one 1 that is not enclosed because its on the boundary.",
			"Input: grid = [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]]\nOutput: 0\nExplanation: All 1s are either on the boundary or can reach the boundary.",
		],
		constraints: [
			"m == grid.length",
			"n == grid[i].length",
			"1 <= m, n <= 500",
			"grid[i][j] is either 0 or 1",
		],
		solutions: [
			"Use DFS/BFS to mark all land cells connected to boundary",
			"Count remaining unmarked land cells",
		],
		timeComplexity: "O(M * N)",
		spaceComplexity: "O(M * N)",
		leetcodeUrl: "https://leetcode.com/problems/number-of-enclaves/",
		tags: ["graph", "dfs", "bfs"],
	},
	{
		id: 1021,
		title: "Remove Outermost Parentheses",
		difficulty: "Easy",
		category: "String",
		algorithms: ["String", "Stack"],
		description:
			'A valid parentheses string is either empty "", "(" + A + ")", or A + B, where A and B are valid parentheses strings, and + represents string concatenation. For example, "", "()", "(())()", and "(()(()))" are all valid parentheses strings. A valid parentheses string s is primitive if it is nonempty, and there does not exist a way to split it into s = A + B, with A and B nonempty valid parentheses strings. Given a valid parentheses string s, consider its primitive decomposition: s = P1 + P2 + ... + Pk, where Pi are primitive valid parentheses strings. Return s after removing the outermost parentheses of every primitive string in the primitive decomposition of s.',
		examples: [
			'Input: s = "(()())(())"\nOutput: "()()()"\nExplanation: The input string is "(()())(())", with primitive decomposition "(()())" + "(())".\nAfter removing outer parentheses of each part, this is "()()" + "()" = "()()()".',
			'Input: s = "(()())(())(()(()))"\nOutput: "()()()()(())"\nExplanation: The input string is "(()())(())(()(()))", with primitive decomposition "(()())" + "(())" + "(()(()))".\nAfter removing outer parentheses of each part, this is "()()" + "()" + "()(())" = "()()()()(())".',
			'Input: s = "()()"\nOutput: ""\nExplanation: The input string is "()()", with primitive decomposition "()" + "()".\nAfter removing outer parentheses of each part, this is "" + "" = "".',
		],
		constraints: [
			"1 <= s.length <= 10^5",
			"s[i] is either '(' or ')'",
			"s is a valid parentheses string",
		],
		solutions: [
			"Use a counter to track parentheses balance",
			"Skip the outermost parentheses of each primitive string",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/remove-outermost-parentheses/",
		tags: ["string", "stack"],
	},
	{
		id: 1022,
		title: "Sum of Root To Leaf Binary Numbers",
		difficulty: "Easy",
		category: "Tree",
		algorithms: ["Tree", "DFS"],
		description:
			"You are given the root of a binary tree where each node has a value 0 or 1. Each root-to-leaf path represents a binary number starting with the most significant bit. For example, if the path is 0 -> 1 -> 1 -> 0 -> 1, then this could represent 01101 in binary, which is 13. For all leaves in the tree, consider the numbers represented by the path from the root to that leaf. Return the sum of these numbers. The answer is guaranteed to fit in a 32-bits integer.",
		examples: [
			"Input: root = [1,0,1,0,1,0,1]\nOutput: 22\nExplanation: (100) + (101) + (110) + (111) = 4 + 5 + 6 + 7 = 22",
			"Input: root = [0]\nOutput: 0",
		],
		constraints: [
			"The number of nodes in the tree is in the range [1, 1000].",
			"Node.val is 0 or 1.",
		],
		solutions: [
			"Use DFS to traverse the tree",
			"Build binary number as we go down the path",
			"Add to sum when we reach a leaf",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(H)",
		leetcodeUrl:
			"https://leetcode.com/problems/sum-of-root-to-leaf-binary-numbers/",
		tags: ["tree", "dfs"],
	},
	{
		id: 1023,
		title: "Camelcase Matching",
		difficulty: "Medium",
		category: "String",
		algorithms: ["String", "Two Pointers"],
		description:
			"Given an array of strings queries and a string pattern, return a boolean array answer where answer[i] is true if queries[i] matches pattern, and false otherwise. A query word queries[i] matches pattern if you can insert lowercase English letters pattern so that it equals the query. You may insert each character at any position and you may not insert any characters.",
		examples: [
			'Input: queries = ["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"], pattern = "FB"\nOutput: [true,false,true,true,false]\nExplanation: "FooBar" can be generated like this "F" + "oo" + "B" + "ar".\n"FootBall" can be generated like this "F" + "oot" + "B" + "all".\n"FrameBuffer" can be generated like this "F" + "rame" + "B" + "uffer".',
			'Input: queries = ["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"], pattern = "FoBa"\nOutput: [true,false,true,false,false]\nExplanation: "FooBar" can be generated like this "Fo" + "o" + "Ba" + "r".\n"FootBall" can be generated like this "Fo" + "ot" + "Ba" + "ll".',
			'Input: queries = ["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"], pattern = "FoBaT"\nOutput: [false,true,false,false,false]\nExplanation: "FooBarTest" can be generated like this "Fo" + "o" + "Ba" + "r" + "T" + "est".',
		],
		constraints: [
			"1 <= pattern.length, queries.length <= 100",
			"1 <= queries[i].length <= 100",
			"queries[i] and pattern consist of English letters.",
		],
		solutions: [
			"Use two pointers to match pattern characters",
			"Check if uppercase letters match exactly",
			"Allow lowercase letters to be inserted anywhere",
		],
		timeComplexity: "O(N * M)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/camelcase-matching/",
		tags: ["string", "two-pointers"],
	},
	{
		id: 1024,
		title: "Video Stitching",
		difficulty: "Medium",
		category: "Dynamic Programming",
		algorithms: ["Dynamic Programming", "Greedy"],
		description:
			"You are given a series of video clips from a sporting event that lasted time seconds. These video clips can be overlapping with each other and have varying lengths. Each video clip is described by an array clips where clips[i] = [starti, endi] indicates that the ith clip started at starti and ended at endi. We can cut these clips into segments freely. For example, a clip [0, 7] can be cut into segments [0, 1] + [1, 3] + [3, 7]. Return the minimum number of clips needed so that we can cut the clips into segments that cover the entire sporting event [0, time]. If the task is impossible, return -1.",
		examples: [
			"Input: clips = [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]], time = 10\nOutput: 3\nExplanation: We take the clips [0,2], [8,10], [1,9]; a total of 3 clips.\nThen, we can reconstruct the sporting event as follows:\nWe cut [1,9] into segments [1,2] + [2,8] + [8,9].\nNow we have segments [0,2] + [2,8] + [8,10] which cover the sporting event [0, 10].",
			"Input: clips = [[0,1],[1,2]], time = 5\nOutput: -1\nExplanation: We can't cover [0,5] with only [0,1] and [1,2].",
			"Input: clips = [[0,1],[6,8],[0,2],[5,6],[0,4],[0,3],[6,7],[1,3],[4,7],[1,4],[2,5],[2,6],[3,4],[4,5],[5,7],[6,9]], time = 9\nOutput: 3\nExplanation: We can take clips [0,4], [4,7], and [6,9].",
		],
		constraints: [
			"1 <= clips.length <= 100",
			"0 <= starti <= endi <= 100",
			"1 <= time <= 100",
		],
		solutions: [
			"Use dynamic programming to find minimum clips needed",
			"Sort clips by start time",
			"For each position, find the minimum clips needed to reach it",
		],
		timeComplexity: "O(N * T)",
		spaceComplexity: "O(T)",
		leetcodeUrl: "https://leetcode.com/problems/video-stitching/",
		tags: ["dynamic-programming", "greedy"],
	},
	{
		id: 1025,
		title: "Divisor Game",
		difficulty: "Easy",
		category: "Math",
		algorithms: ["Math", "Dynamic Programming"],
		description:
			"Alice and Bob take turns playing a game, with Alice starting first. Initially, there is a number n on the chalkboard. On each player's turn, that player makes a move consisting of: Choosing any x with 0 < x < n and n % x == 0. Replacing the number n on the chalkboard with n - x. Also, if a player cannot make a move, they lose the game. Return true if and only if Alice wins the game, assuming both players play optimally.",
		examples: [
			"Input: n = 2\nOutput: true\nExplanation: Alice chooses 1, and Bob has no more moves.",
			"Input: n = 3\nOutput: false\nExplanation: Alice chooses 1, Bob chooses 1, and Alice has no more moves.",
		],
		constraints: ["1 <= n <= 1000"],
		solutions: [
			"Use dynamic programming to determine if a player can win from a given position",
			"A player wins if they can make a move that leaves the opponent in a losing position",
		],
		timeComplexity: "O(N * sqrt(N))",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/divisor-game/",
		tags: ["math", "dynamic-programming"],
	},
	{
		id: 1026,
		title: "Maximum Difference Between Node and Ancestor",
		difficulty: "Medium",
		category: "Tree",
		algorithms: ["Tree", "DFS"],
		description:
			"Given the root of a binary tree, find the maximum value v for which there exist different nodes a and b where v = |a.val - b.val| and a is an ancestor of b. A node a is an ancestor of b if either: any child of a is equal to b, or any child of a is an ancestor of b.",
		examples: [
			"Input: root = [8,3,10,1,6,null,14,null,null,4,7,13]\nOutput: 7\nExplanation: We have various ancestor-node differences, some of which are given below :\n|8 - 3| = 5\n|3 - 7| = 4\n|8 - 1| = 7\n|10 - 13| = 3\nAmong all possible differences, the maximum value of 7 is obtained by |8 - 1| = 7.",
			"Input: root = [1,null,2,null,0,3]\nOutput: 3",
		],
		constraints: [
			"The number of nodes in the tree is in the range [2, 5000].",
			"0 <= Node.val <= 10^5",
		],
		solutions: [
			"Use DFS to traverse the tree",
			"Track minimum and maximum values in the path from root to current node",
			"Update maximum difference at each node",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(H)",
		leetcodeUrl:
			"https://leetcode.com/problems/maximum-difference-between-node-and-ancestor/",
		tags: ["tree", "dfs"],
	},
	{
		id: 1027,
		title: "Longest Arithmetic Subsequence",
		difficulty: "Medium",
		category: "Dynamic Programming",
		algorithms: ["Dynamic Programming", "Hash Table"],
		description:
			"Given an array nums of integers, return the length of the longest arithmetic subsequence in nums. Recall that a subsequence of an array nums is a list nums[i1], nums[i2], ..., nums[ik] with 0 <= i1 < i2 < ... < ik <= nums.length - 1, and that a sequence seq is arithmetic if seq[i+1] - seq[i] are all the same value (for 0 <= i < seq.length - 1).",
		examples: [
			"Input: nums = [3,6,9,12]\nOutput: 4\nExplanation: The whole array is an arithmetic sequence with steps of length = 3.",
			"Input: nums = [9,4,7,2,10]\nOutput: 3\nExplanation: The longest arithmetic subsequence is [4,7,10].",
			"Input: nums = [20,1,15,3,10,5,8]\nOutput: 4\nExplanation: The longest arithmetic subsequence is [20,15,10,5].",
		],
		constraints: ["2 <= nums.length <= 1000", "0 <= nums[i] <= 500"],
		solutions: [
			"Use dynamic programming with hash table",
			"For each pair of indices, store the length of arithmetic subsequence ending at that pair",
			"Update maximum length found",
		],
		timeComplexity: "O(N^2)",
		spaceComplexity: "O(N^2)",
		leetcodeUrl:
			"https://leetcode.com/problems/longest-arithmetic-subsequence/",
		tags: ["dynamic-programming", "hash-table"],
	},
	{
		id: 1028,
		title: "Recover a Tree From Preorder Traversal",
		difficulty: "Hard",
		category: "Tree",
		algorithms: ["Tree", "Stack"],
		description:
			"We run a preorder depth-first search (DFS) on the root of a binary tree. At each node in this traversal, we output D dashes (where D is the depth of this node), then we output the value of this node. If the depth of a node is D, the depth of its immediate child is D + 1. The depth of the root node is 0. If a node has only one child, that child is guaranteed to be the left child. Given the output S of this traversal, recover the tree and return its root.",
		examples: [
			'Input: S = "1-2--3--4-5--6--7"\nOutput: [1,2,5,3,4,6,7]',
			'Input: S = "1-2--3---4-5--6---7"\nOutput: [1,2,5,3,null,6,null,4,null,7]',
			'Input: S = "1-401--349---90--88"\nOutput: [1,401,null,349,88,90]',
		],
		constraints: [
			"The number of nodes in the original tree is in the range [1, 1000].",
			"1 <= Node.val <= 10^9",
		],
		solutions: [
			"Parse the string to extract depth and value information",
			"Use a stack to build the tree",
			"Handle the case where a node has only one child",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl:
			"https://leetcode.com/problems/recover-a-tree-from-preorder-traversal/",
		tags: ["tree", "stack"],
	},
	{
		id: 1029,
		title: "Two City Scheduling",
		difficulty: "Medium",
		category: "Greedy",
		algorithms: ["Greedy", "Sorting"],
		description:
			"A company is planning to interview 2n people. Given the array costs where costs[i] = [aCosti, bCosti], the cost of flying the ith person to city A is aCosti, and the cost of flying the ith person to city B is bCosti. Return the minimum cost to fly every person to a city such that exactly n people arrive in each city.",
		examples: [
			"Input: costs = [[10,20],[30,200],[400,50],[30,20]]\nOutput: 110\nExplanation: The first person goes to city A for a cost of 10.\nThe second person goes to city A for a cost of 30.\nThe third person goes to city B for a cost of 50.\nThe fourth person goes to city B for a cost of 20.\nThe total minimum cost is 10 + 30 + 50 + 20 = 110 to have half the people interviewing in each city.",
			"Input: costs = [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]\nOutput: 1859",
			"Input: costs = [[515,563],[451,713],[537,709],[343,819],[855,779],[457,60],[650,359],[631,42]]\nOutput: 3086",
		],
		constraints: [
			"2 * n == costs.length",
			"2 <= costs.length <= 100",
			"costs.length is even.",
			"1 <= aCosti, bCosti <= 1000",
		],
		solutions: [
			"Sort by the difference between costs to city A and city B",
			"Send first n people to city A, rest to city B",
		],
		timeComplexity: "O(N log N)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/two-city-scheduling/",
		tags: ["greedy", "sorting"],
	},
	{
		id: 1030,
		title: "Matrix Cells in Distance Order",
		difficulty: "Easy",
		category: "Array",
		algorithms: ["Array", "Sorting"],
		description:
			"You are given four integers row, cols, rCenter, and cCenter. There is a rows x cols matrix and you are on the cell with the coordinates (rCenter, cCenter). Return the coordinates of all cells in the matrix, sorted by their distance from (rCenter, cCenter) from the smallest distance to the largest distance. You may return the answer in any order that satisfies this condition. The distance between two cells (r1, c1) and (r2, c2) is |r1 - r2| + |c1 - c2|.",
		examples: [
			"Input: rows = 1, cols = 2, rCenter = 0, cCenter = 0\nOutput: [[0,0],[0,1]]\nExplanation: The distances from (0, 0) to other cells are: [0,1]",
			"Input: rows = 2, cols = 2, rCenter = 0, cCenter = 1\nOutput: [[0,1],[0,0],[1,1],[1,0]]\nExplanation: The distances from (0, 1) to other cells are: [0,1,1,2]\nThe answer [[0,1],[1,1],[0,0],[1,0]] would also be accepted as correct.",
			"Input: rows = 2, cols = 3, rCenter = 1, cCenter = 2\nOutput: [[1,2],[0,2],[1,1],[0,1],[1,0],[0,0]]\nExplanation: The distances from (1, 2) to other cells are: [0,1,1,1,2,2]\nThe answer [[1,2],[0,2],[1,1],[0,1],[1,0],[0,0]] would also be accepted as correct.",
		],
		constraints: [
			"1 <= rows, cols <= 100",
			"0 <= rCenter < rows",
			"0 <= cCenter < cols",
		],
		solutions: [
			"Generate all cell coordinates",
			"Sort by Manhattan distance from center",
		],
		timeComplexity: "O(R * C * log(R * C))",
		spaceComplexity: "O(R * C)",
		leetcodeUrl:
			"https://leetcode.com/problems/matrix-cells-in-distance-order/",
		tags: ["array", "sorting"],
	},
	{
		id: 1031,
		title: "Maximum Sum of Two Non-Overlapping Subarrays",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Dynamic Programming", "Sliding Window"],
		description: "Given an array A of non-negative integers, return the maximum sum of elements in two non-overlapping (contiguous) subarrays, which have lengths L and M. (For clarification, the L-length subarray could occur before or after the M-length subarray.)",
		examples: [
			"Input: A = [0,6,5,2,2,5,1,9,4], L = 1, M = 2\nOutput: 20\nExplanation: One choice of subarrays is [9] with length 1, and [6,5] with length 2.",
			"Input: A = [3,8,1,3,2,1,8,9,0], L = 3, M = 2\nOutput: 29\nExplanation: One choice of subarrays is [3,8,1] with length 3, and [8,9] with length 2.",
			"Input: A = [2,1,5,6,0,9,5,0,3,8], L = 4, M = 3\nOutput: 31\nExplanation: One choice of subarrays is [5,6,0,9] with length 4, and [0,3,8] with length 3."
		],
		constraints: [
			"L >= 1",
			"M >= 1",
			"L + M <= A.length <= 1000",
			"0 <= A[i] <= 1000"
		],
		solutions: [
			"Use sliding window to find maximum sum for each length",
			"Try both L before M and M before L",
			"Return the maximum of both scenarios"
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/",
		tags: ["array", "dynamic-programming", "sliding-window"]
	},
	{
		id: 1032,
		title: "Stream of Characters",
		difficulty: "Hard",
		category: "Trie",
		algorithms: ["Trie", "String"],
		description: "Design an algorithm that accepts a stream of characters and checks if a suffix of these characters is a string of a given array of words. For example, if words = [\"abc\", \"xyz\"] and the stream added the four characters (one by one) 'a', 'x', 'y', and 'z', then your algorithm should detect that the suffix \"xyz\" of the characters matches the word \"xyz\" from words.",
		examples: [
			"Input: [\"StreamChecker\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\", \"query\"]\n[[[\"cd\", \"f\", \"kl\"]], [\"a\"], [\"b\"], [\"c\"], [\"d\"], [\"e\"], [\"f\"], [\"g\"], [\"h\"], [\"i\"], [\"j\"], [\"k\"], [\"l\"]]\nOutput: [null, false, false, false, true, false, true, false, false, false, false, false, true]\nExplanation:\nStreamChecker streamChecker = new StreamChecker([\"cd\", \"f\", \"kl\"]);\nstreamChecker.query(\"a\"); // return False\nstreamChecker.query(\"b\"); // return False\nstreamChecker.query(\"c\"); // return False\nstreamChecker.query(\"d\"); // return True, because 'cd' is in the wordlist\nstreamChecker.query(\"e\"); // return False\nstreamChecker.query(\"f\"); // return True, because 'f' is in the wordlist\nstreamChecker.query(\"g\"); // return False\nstreamChecker.query(\"h\"); // return False\nstreamChecker.query(\"i\"); // return False\nstreamChecker.query(\"j\"); // return False\nstreamChecker.query(\"k\"); // return False\nstreamChecker.query(\"l\"); // return True, because 'kl' is in the wordlist"
		],
		constraints: [
			"1 <= words.length <= 2000",
			"1 <= words[i].length <= 2000",
			"words[i] consists of lowercase English letters.",
			"query consists of lowercase English letters.",
			"At most 4 * 10^4 calls will be made to query."
		],
		solutions: [
			"Build a trie from the reversed words",
			"For each query, check if any suffix matches a word in the trie",
			"Use a sliding window approach to check recent characters"
		],
		timeComplexity: "O(N * L + Q * L)",
		spaceComplexity: "O(N * L)",
		leetcodeUrl: "https://leetcode.com/problems/stream-of-characters/",
		tags: ["trie", "string"]
	},
	{
		id: 1033,
		title: "Moving Stones Until Consecutive",
		difficulty: "Medium",
		category: "Math",
		algorithms: ["Math", "Sorting"],
		description: "Three stones are on a number line at positions a, b, and c. Each turn, you pick up a stone at an endpoint (ie., either the lowest or highest position stone), and move it to an unoccupied position between its endpoints (including on a point occupied by another stone). You cannot make a move that would cause the stone to jump to another stone's position. The game ends when you cannot make any more moves. (ie., the stones are in consecutive positions) When the game ends, what is the minimum and maximum number of moves that you could have made? Return the answer as an length 2 array: answer = [minimum_moves, maximum_moves]",
		examples: [
			"Input: a = 1, b = 2, c = 5\nOutput: [1,2]\nExplanation: Move the stone from 5 to 3, or move the stone from 5 to 4 to 3.",
			"Input: a = 4, b = 3, c = 2\nOutput: [0,0]\nExplanation: We cannot make any moves.",
			"Input: a = 3, b = 5, c = 1\nOutput: [1,2]\nExplanation: Move the stone from 1 to 4; or move the stone from 1 to 2 to 4."
		],
		constraints: [
			"1 <= a, b, c <= 10^9",
			"It's guaranteed that the positions are distinct."
		],
		solutions: [
			"Sort the positions",
			"Calculate minimum moves based on gaps",
			"Calculate maximum moves as total distance between endpoints"
		],
		timeComplexity: "O(1)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/moving-stones-until-consecutive/",
		tags: ["math", "sorting"]
	},
	{
		id: 1034,
		title: "Coloring A Border",
		difficulty: "Medium",
		category: "Graph",
		algorithms: ["DFS", "BFS"],
		description: "You are given an m x n integer matrix grid, and three integers row, col, and color. Each value in the grid represents the color of the grid square at that location. Two squares belong to the same connected component if they have the same color and are next to each other in any of the 4 directions. The border of a connected component is all the squares in the connected component that are either 4-directionally adjacent to a square not in the component, or on the boundary of the grid (the first or last row or column). You should color the border of the connected component of grid[row][col] with the given color. Return the final grid.",
		examples: [
			"Input: grid = [[1,1],[1,2]], row = 0, col = 0, color = 3\nOutput: [[3,3],[3,2]]",
			"Input: grid = [[1,2,2],[2,3,2]], row = 0, col = 1, color = 3\nOutput: [[1,3,3],[2,3,3]]",
			"Input: grid = [[1,1,1],[1,1,1],[1,1,1]], row = 1, col = 1, color = 2\nOutput: [[2,2,2],[2,1,2],[2,2,2]]"
		],
		constraints: [
			"m == grid.length",
			"n == grid[i].length",
			"1 <= m, n <= 50",
			"1 <= grid[i][j], color <= 1000",
			"0 <= row < m",
			"0 <= col < n"
		],
		solutions: [
			"Use DFS/BFS to find the connected component",
			"Identify border cells (adjacent to different color or grid boundary)",
			"Color only the border cells"
		],
		timeComplexity: "O(M * N)",
		spaceComplexity: "O(M * N)",
		leetcodeUrl: "https://leetcode.com/problems/coloring-a-border/",
		tags: ["graph", "dfs", "bfs"]
	},
	{
		id: 1035,
		title: "Uncrossed Lines",
		difficulty: "Medium",
		category: "Dynamic Programming",
		algorithms: ["Dynamic Programming", "LCS"],
		description: "You are given two integer arrays nums1 and nums2. We write the integers of nums1 and nums2 (in the order they are given) on two separate horizontal lines. We may draw connecting lines: a straight line connecting two numbers nums1[i] and nums2[j] such that: nums1[i] == nums2[j], and the line we draw does not intersect any other connecting (non-horizontal) line. Note that a connecting line cannot intersect even at the endpoints (i.e., each number can only belong to one connecting line). Return the maximum number of connecting lines we can draw in this way.",
		examples: [
			"Input: nums1 = [1,4,2], nums2 = [1,2,4]\nOutput: 2\nExplanation: We can draw 2 uncrossed lines as in the diagram.\nWe cannot draw 3 uncrossed lines, because the line from nums1[1]=4 to nums2[2]=4 will intersect the line from nums1[2]=2 to nums2[1]=2.",
			"Input: nums1 = [2,5,1,2,5], nums2 = [10,5,2,1,5,2]\nOutput: 3",
			"Input: nums1 = [1,3,7,1,7,5], nums2 = [1,9,2,5,1]\nOutput: 2"
		],
		constraints: [
			"1 <= nums1.length, nums2.length <= 500",
			"1 <= nums1[i], nums2[j] <= 2000"
		],
		solutions: [
			"This is equivalent to finding the longest common subsequence (LCS)",
			"Use dynamic programming to solve LCS",
			"The result is the length of the LCS"
		],
		timeComplexity: "O(M * N)",
		spaceComplexity: "O(M * N)",
		leetcodeUrl: "https://leetcode.com/problems/uncrossed-lines/",
		tags: ["dynamic-programming", "lcs"]
	},
	{
		id: 1036,
		title: "Escape a Large Maze",
		difficulty: "Hard",
		category: "Graph",
		algorithms: ["BFS", "DFS"],
		description: "There is a 1 million by 1 million grid on an XY-plane, and the coordinates of each grid square are (x, y). We start at the source = [sx, sy] and want to reach the target = [tx, ty]. There is also an array of blocked squares, where each blocked[i] = [xi, yi] represents a blocked square with coordinates (xi, yi). Each move, we can walk one square in one of the 4 cardinal directions. In addition, we cannot make a move that would place us in a blocked square. Return true if and only if it is possible to reach the target square from the source square through a sequence of valid moves.",
		examples: [
			"Input: blocked = [[0,1],[1,0]], source = [0,0], target = [0,2]\nOutput: false\nExplanation: The target square is unreachable because:\n- The source square is blocked.\n- Each square in the path is either blocked or adjacent to a blocked square.",
			"Input: blocked = [], source = [0,0], target = [999999,999999]\nOutput: true\nExplanation: Because there are no blocked cells, it is possible to reach the target square.",
			"Input: blocked = [[691938,300406],[710196,624190],[858790,609485],[268029,225806],[200010,188664],[132599,612099],[329444,633495],[196657,757958],[628509,883388]], source = [655988,180910], target = [267728,840949]\nOutput: false"
		],
		constraints: [
			"0 <= blocked.length <= 200",
			"blocked[i].length == 2",
			"0 <= xi, yi < 10^6",
			"source.length == target.length == 2",
			"0 <= sx, sy, tx, ty < 10^6",
			"source != target"
		],
		solutions: [
			"Use BFS/DFS with a limited search area",
			"If we can reach a certain distance from source, we can likely reach target",
			"Check if target is reachable within the search limit"
		],
		timeComplexity: "O(B^2)",
		spaceComplexity: "O(B^2)",
		leetcodeUrl: "https://leetcode.com/problems/escape-a-large-maze/",
		tags: ["graph", "bfs", "dfs"]
	},
	{
		id: 1037,
		title: "Valid Boomerang",
		difficulty: "Easy",
		category: "Math",
		algorithms: ["Math", "Geometry"],
		description: "Given an array points where points[i] = [xi, yi] represents a point on the X-Y plane, return true if these points are a boomerang. A boomerang is a set of three points that are all distinct and not in a straight line.",
		examples: [
			"Input: points = [[1,1],[2,3],[3,2]]\nOutput: true",
			"Input: points = [[1,1],[2,2],[3,3]]\nOutput: false",
			"Input: points = [[1,1],[2,2],[7,7]]\nOutput: false"
		],
		constraints: [
			"points.length == 3",
			"points[i].length == 2",
			"0 <= xi, yi <= 100"
		],
		solutions: [
			"Check if all three points are distinct",
			"Calculate the slope between points",
			"Check if the slopes are different (not collinear)"
		],
		timeComplexity: "O(1)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/valid-boomerang/",
		tags: ["math", "geometry"]
	},
	{
		id: 1038,
		title: "Binary Search Tree to Greater Sum Tree",
		difficulty: "Medium",
		category: "Tree",
		algorithms: ["Tree", "DFS"],
		description: "Given the root of a Binary Search Tree (BST), convert it to a Greater Tree such that every key of the original BST is changed to the original key plus the sum of all keys greater than the original key in BST. As a reminder, a binary search tree is a tree that satisfies these constraints: The left subtree of a node contains only nodes with keys less than the node's key. The right subtree of a node contains only nodes with keys greater than the node's key. Both the left and right subtrees must also be binary search trees.",
		examples: [
			"Input: root = [4,1,6,0,2,5,7,null,null,null,3,null,null,null,8]\nOutput: [30,36,21,36,35,26,15,null,null,null,33,null,null,null,8]",
			"Input: root = [0,null,1]\nOutput: [1,null,1]",
			"Input: root = [1,0,2]\nOutput: [3,3,2]",
			"Input: root = [3,2,4,1]\nOutput: [7,9,4,10]"
		],
		constraints: [
			"The number of nodes in the tree is in the range [1, 100].",
			"0 <= Node.val <= 100",
			"All the values in the tree are unique.",
			"root is guaranteed to be a valid binary search tree."
		],
		solutions: [
			"Use reverse in-order traversal (right-root-left)",
			"Keep track of running sum",
			"Update each node's value with the running sum"
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(H)",
		leetcodeUrl: "https://leetcode.com/problems/binary-search-tree-to-greater-sum-tree/",
		tags: ["tree", "dfs"]
	},
	{
		id: 1039,
		title: "Minimum Score Triangulation of Polygon",
		difficulty: "Medium",
		category: "Dynamic Programming",
		algorithms: ["Dynamic Programming", "Math"],
		description: "You have a convex n-sided polygon where each vertex has an integer value. You are given an integer array values where values[i] is the value of the ith vertex (clockwise order). You will triangulate the polygon into n - 2 triangles. For each triangle, the value of that triangle is the product of the values of its vertices, and the total score of the triangulation is the sum of these values over all n - 2 triangles in the triangulation. Return the smallest possible total score that you can achieve with some triangulation of the polygon.",
		examples: [
			"Input: values = [1,2,3]\nOutput: 6\nExplanation: The polygon is already triangulated, and the score of the only triangle is 6.",
			"Input: values = [3,7,4,5]\nOutput: 144\nExplanation: There are two triangulations, with possible scores:\n- The first, used in the solution, has a score of 3 * 7 * 5 + 4 * 5 * 7 = 245.\n- The second has a score of 3 * 4 * 5 + 3 * 4 * 7 = 144.\nThe minimum score is 144.",
			"Input: values = [1,3,1,4,1,5]\nOutput: 13\nExplanation: The minimum score triangulation has score 1 * 1 * 3 + 1 * 1 * 4 + 1 * 1 * 5 + 1 * 1 * 1 = 13."
		],
		constraints: [
			"n == values.length",
			"3 <= n <= 50",
			"1 <= values[i] <= 100"
		],
		solutions: [
			"Use dynamic programming with interval DP",
			"For each interval [i, j], try all possible intermediate points k",
			"Calculate minimum score for triangulation of polygon [i, k, j]"
		],
		timeComplexity: "O(N^3)",
		spaceComplexity: "O(N^2)",
		leetcodeUrl: "https://leetcode.com/problems/minimum-score-triangulation-of-polygon/",
		tags: ["dynamic-programming", "math"]
	},
	{
		id: 1040,
		title: "Moving Stones Until Consecutive II",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Sliding Window", "Sorting"],
		description: "On an infinite number line, the position of the i-th stone is given by stones[i]. Call a stone an endpoint stone if it has the smallest or largest position. Each turn, you pick up an endpoint stone and move it to an unoccupied position so that it is no longer an endpoint stone. In particular, if your stones are at positions [0,0,1,2,5], you cannot move the stone at position 5 since it is an endpoint stone (it has the largest position). However, you can move the stone at position 0 to position 4 so that the stones are at positions [1,2,4,5]. The game ends when you cannot make any more moves. The length of the game is the number of turns you make. Return the minimum and maximum length of the game.",
		examples: [
			"Input: stones = [7,4,9]\nOutput: [1,2]\nExplanation: We can play 7 -> 8, 4 -> 8 to make the stones consecutive [8,8,9].\nWe cannot play 7 -> 8, 9 -> 8 to make the stones consecutive [8,8,8] because 9 is an endpoint stone.",
			"Input: stones = [6,5,4,3,10]\nOutput: [2,3]\nWe can play 10 -> 7, 3 -> 8 to make the stones consecutive [4,5,6,7,8].\nWe cannot play 10 -> 7, 4 -> 8 to make the stones consecutive [3,5,6,7,8] because 3 is an endpoint stone.",
			"Input: stones = [100,101,104,102,103]\nOutput: [0,0]"
		],
		constraints: [
			"3 <= stones.length <= 10^4",
			"1 <= stones[i] <= 10^9",
			"All values in stones are distinct."
		],
		solutions: [
			"Sort the stones",
			"For minimum moves: find the smallest window that contains all stones",
			"For maximum moves: calculate total distance between endpoints"
		],
		timeComplexity: "O(N log N)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/moving-stones-until-consecutive-ii/",
		tags: ["array", "sliding-window", "sorting"]
	}
	// ... continuing with more problems from 1001-1500
];
