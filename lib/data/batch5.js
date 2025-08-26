export const batch5Problems = [
	{
		id: 2001,
		title: "Number of Pairs of Interchangeable Rectangles",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Hash Table", "Math"],
		description:
			"You are given n rectangles represented by a 0-indexed 2D integer array rectangles, where rectangles[i] = [widthi, heighti] represents the width and height of the ith rectangle. Two rectangles i and j (i < j) are considered interchangeable if they have the same width-to-height ratio. More formally, two rectangles are interchangeable if widthi/heighti == widthj/heightj (using decimal division, not integer division). Return the number of pairs of interchangeable rectangles in rectangles.",
		examples: [
			"Input: rectangles = [[4,8],[3,6],[10,20],[15,30]]\nOutput: 6\nExplanation: The following are the interchangeable pairs of rectangles by index (0-indexed):\n- Rectangle 0 with rectangle 1: 4/8 == 3/6 == 0.5.\n- Rectangle 0 with rectangle 2: 4/8 == 10/20 == 0.5.\n- Rectangle 0 with rectangle 3: 4/8 == 15/30 == 0.5.\n- Rectangle 1 with rectangle 2: 3/6 == 10/20 == 0.5.\n- Rectangle 1 with rectangle 3: 3/6 == 15/30 == 0.5.\n- Rectangle 2 with rectangle 3: 10/20 == 15/30 == 0.5.",
			"Input: rectangles = [[4,5],[7,8]]\nOutput: 0\nExplanation: There are no interchangeable pairs of rectangles.",
		],
		constraints: [
			"n == rectangles.length",
			"1 <= n <= 10^5",
			"rectangles[i].length == 2",
			"1 <= widthi, heighti <= 10^5",
		],
		solutions: [
			"Calculate the ratio for each rectangle",
			"Use a hash table to count rectangles with the same ratio",
			"For each ratio, calculate the number of pairs using combination formula",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl:
			"https://leetcode.com/problems/number-of-pairs-of-interchangeable-rectangles/",
		tags: ["array", "hash-table", "math"],
	},
	{
		id: 2002,
		title: "Maximum Product of the Length of Two Palindromic Subsequences",
		difficulty: "Medium",
		category: "String",
		algorithms: ["Dynamic Programming", "Bit Manipulation"],
		description:
			"Given a string s, find two disjoint palindromic subsequences of s such that the product of their lengths is maximized. The two subsequences are disjoint if they do not share the same index in s. Return the maximum possible product of the lengths of the two palindromic subsequences. A subsequence is a string that can be derived from another string by deleting some or no characters without changing the order of the remaining characters. A string is palindromic if it reads the same forward and backward.",
		examples: [
			'Input: s = "leetcodecom"\nOutput: 9\nExplanation: An optimal solution is to choose "ete" for the 1st subsequence and "cdc" for the 2nd subsequence.\nThe product of their lengths is: 3 * 3 = 9.',
			'Input: s = "bb"\nOutput: 1\nExplanation: An optimal solution is to choose "b" (the first character) for the 1st subsequence and "b" (the second character) for the 2nd subsequence.\nThe product of their lengths is: 1 * 1 = 1.',
			'Input: s = "accbcaxxcxx"\nOutput: 25\nExplanation: An optimal solution is to choose "accca" for the 1st subsequence and "xxcxx" for the 2nd subsequence.\nThe product of their lengths is: 5 * 5 = 25.',
		],
		constraints: [
			"2 <= s.length <= 12",
			"s consists of lowercase English letters only.",
		],
		solutions: [
			"Use bit manipulation to generate all possible subsequences",
			"Check if each subsequence is a palindrome",
			"Find the maximum product of two disjoint palindromic subsequences",
		],
		timeComplexity: "O(3^N)",
		spaceComplexity: "O(2^N)",
		leetcodeUrl:
			"https://leetcode.com/problems/maximum-product-of-the-length-of-two-palindromic-subsequences/",
		tags: ["string", "dynamic-programming", "bit-manipulation"],
	},
	{
		id: 2003,
		title: "Smallest Missing Genetic Value in Each Subtree",
		difficulty: "Hard",
		category: "Tree",
		algorithms: ["Tree", "Union Find", "DFS"],
		description:
			"There is a family tree rooted at node 0 consisting of n nodes numbered 0 to n - 1. You are given a 0-indexed integer array parents, where parents[i] is the parent for node i. Since node 0 is the root, parents[0] == -1. You are also given a 0-indexed integer array nums, where nums[i] is a unique genetic value for node i. Return an array ans of length n where ans[i] is the smallest genetic value that is missing from the subtree rooted at node i.",
		examples: [
			"Input: parents = [-1,0,0,1,1,2,2], nums = [1,2,3,4,5,6,7]\nOutput: [1,1,1,1,1,1,1]\nExplanation: The value 1 is missing from all the subtrees.",
			"Input: parents = [-1,0,1,0,3,3], nums = [5,4,6,2,1,3]\nOutput: [7,1,1,1,3,2]\nExplanation:\n- Node 0: The subtree contains nodes [0,1,2,3,4,5] with values [5,4,6,2,1,3]. 1 is missing.\n- Node 1: The subtree contains nodes [1,2] with values [4,6]. 1 is missing.\n- Node 2: The subtree contains only node 2 with value 6. 1 is missing.\n- Node 3: The subtree contains nodes [3,4,5] with values [2,1,3]. 1 is missing.\n- Node 4: The subtree contains only node 4 with value 1. 3 is missing.\n- Node 5: The subtree contains only node 5 with value 3. 1 is missing.",
		],
		constraints: [
			"n == parents.length == nums.length",
			"2 <= n <= 10^5",
			"0 <= parents[i] <= n - 1 for i != 0",
			"parents[0] == -1",
			"parents represents a valid tree.",
			"1 <= nums[i] <= 10^5",
			"Each nums[i] is unique.",
		],
		solutions: [
			"Use DFS to traverse the tree",
			"For each subtree, find the smallest missing genetic value",
			"Use a set to track genetic values in the current subtree",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl:
			"https://leetcode.com/problems/smallest-missing-genetic-value-in-each-subtree/",
		tags: ["tree", "union-find", "dfs"],
	},
	{
		id: 2004,
		title: "The Number of Seniors and Juniors to Join the Company",
		difficulty: "Hard",
		category: "Database",
		algorithms: ["SQL", "Window Functions"],
		description:
			"A company wants to hire new employees. The budget of the company for the salaries is $70000. The company's criteria for hiring are: Hiring the largest number of seniors. After hiring the maximum number of seniors, use the remaining budget to hire the largest number of juniors. Write an SQL query to find the number of seniors and juniors hired under the mentioned criteria.",
		examples: [
			"Input: Candidates table\n+-------------+------+--------+\n| employee_id | experience | salary |\n+-------------+------+--------+\n| 1           | Junior     | 10000  |\n| 9           | Junior     | 10000  |\n| 2           | Senior     | 20000  |\n| 11          | Senior     | 20000  |\n| 13          | Senior     | 50000  |\n| 4           | Junior     | 40000  |\n+-------------+------+--------+\nOutput:\n+------------+---------------------+\n| experience | accepted_candidates |\n+------------+---------------------+\n| Senior     | 2                   |\n| Junior     | 2                   |\n+------------+---------------------+\nExplanation:\nWe can hire 2 seniors with IDs (2, 11). Since the budget is $70000 and the sum of their salaries is $40000, we still have $30000 but they are not enough to hire the remaining senior with ID 13.\nWe can hire 2 juniors with IDs (1, 9). Since the remaining budget is $30000 and the sum of their salaries is $20000, we still have $10000 but they are not enough to hire the remaining junior with ID 4.",
		],
		constraints: ["No constraints provided for this database problem"],
		solutions: [
			"Use window functions to calculate cumulative salary for each experience level",
			"Find the maximum number of seniors that can be hired within budget",
			"Use remaining budget to hire maximum number of juniors",
		],
		timeComplexity: "O(N log N)",
		spaceComplexity: "O(N)",
		leetcodeUrl:
			"https://leetcode.com/problems/the-number-of-seniors-and-juniors-to-join-the-company/",
		tags: ["database", "sql", "window-functions"],
	},
	{
		id: 2005,
		title: "Subtree Removal Game with Fibonacci Tree",
		difficulty: "Hard",
		category: "Tree",
		algorithms: ["Tree", "Game Theory", "Dynamic Programming"],
		description:
			"Alice and Bob play a game with a Fibonacci tree. A Fibonacci tree is a binary tree where each node has either 0 or 2 children. The game starts with Alice, and they take turns removing entire subtrees. The player who cannot make a move loses. Given the root of a Fibonacci tree, return true if Alice can win the game, or false if Bob can win.",
		examples: [
			"Input: root = [1,2,3]\nOutput: true\nExplanation: Alice can remove the entire tree in one move, so she wins.",
			"Input: root = [1,2,3,4,5,6,7,8,9,10,11]\nOutput: false\nExplanation: Bob can win by removing the left subtree of the root, leaving Alice with no moves.",
		],
		constraints: [
			"The number of nodes in the tree is in the range [1, 100].",
			"1 <= Node.val <= 100",
		],
		solutions: [
			"Use game theory with dynamic programming",
			"Calculate the Grundy number for each subtree",
			"Alice wins if the XOR of all Grundy numbers is non-zero",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl:
			"https://leetcode.com/problems/subtree-removal-game-with-fibonacci-tree/",
		tags: ["tree", "game-theory", "dynamic-programming"],
	},
	{
		id: 2006,
		title: "Count Number of Pairs With Absolute Difference K",
		difficulty: "Easy",
		category: "Array",
		algorithms: ["Hash Table", "Two Pointers"],
		description:
			"Given an integer array nums and an integer k, return the number of pairs (i, j) where i < j such that |nums[i] - nums[j]| == k. The value of |x| is defined as: x if x >= 0. -x if x < 0.",
		examples: [
			"Input: nums = [1,2,2,1], k = 1\nOutput: 4\nExplanation: The pairs with an absolute difference of 1 are:\n- [1,2,2,1], [1,2,2,1], [1,2,2,1], [1,2,2,1]",
			"Input: nums = [1,3], k = 3\nOutput: 0\nExplanation: There are no pairs with an absolute difference of 3.",
			"Input: nums = [3,2,1,5,4], k = 2\nOutput: 3\nExplanation: The pairs with an absolute difference of 2 are:\n- [3,2,1,5,4], [3,2,1,5,4], [3,2,1,5,4]",
		],
		constraints: [
			"1 <= nums.length <= 200",
			"1 <= nums[i] <= 100",
			"1 <= k <= 99",
		],
		solutions: [
			"Use a hash table to count frequencies",
			"For each number, check if (num + k) or (num - k) exists",
			"Count all valid pairs",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl:
			"https://leetcode.com/problems/count-number-of-pairs-with-absolute-difference-k/",
		tags: ["array", "hash-table", "two-pointers"],
	},
	{
		id: 2007,
		title: "Find Original Array From Doubled Array",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Hash Table", "Sorting"],
		description:
			"An integer array original is transformed into a doubled array changed by appending twice the value of every element in original, and then randomly shuffling the resulting array. Given an array changed, return original if changed is a doubled array. If changed is not a doubled array, return an empty array. The elements in original may be returned in any order.",
		examples: [
			"Input: changed = [1,3,4,2,6,8]\nOutput: [1,3,4]\nExplanation: One possible original array could be [1,3,4]:\n- Twice the value of 1 is 1 * 2 = 2.\n- Twice the value of 3 is 3 * 2 = 6.\n- Twice the value of 4 is 4 * 2 = 8.\nOther original arrays could be [4,3,1] or [3,1,4].",
			"Input: changed = [6,3,0,1]\nOutput: []\nExplanation: changed is not a doubled array.",
			"Input: changed = [1]\nOutput: []\nExplanation: changed is not a doubled array.",
		],
		constraints: ["1 <= changed.length <= 10^5", "0 <= changed[i] <= 10^5"],
		solutions: [
			"Sort the array",
			"Use a hash table to track available numbers",
			"For each number, check if its double exists and remove both",
		],
		timeComplexity: "O(N log N)",
		spaceComplexity: "O(N)",
		leetcodeUrl:
			"https://leetcode.com/problems/find-original-array-from-doubled-array/",
		tags: ["array", "hash-table", "sorting"],
	},
	{
		id: 2008,
		title: "Maximum Earnings From Taxi",
		difficulty: "Medium",
		category: "Dynamic Programming",
		algorithms: ["Dynamic Programming", "Sorting"],
		description:
			"There are n points on a road you are driving your taxi on. The n points on the road are labeled from 1 to n in the direction you are going, and you want to drive from point 1 to point n to make money by picking up passengers. You cannot change the direction of the taxi. The passengers are represented by a 0-indexed 2D integer array rides, where rides[i] = [starti, endi, tipi] denotes the ith passenger requesting a ride from point starti to point endi who is willing to give you a tipi dollar tip. For each passenger i you pick up, you earn endi - starti + tipi dollars. You may only drive at most one passenger at a time. Given n and rides, return the maximum number of dollars you can earn by picking up the passengers optimally.",
		examples: [
			"Input: n = 5, rides = [[2,5,4],[1,5,1]]\nOutput: 7\nExplanation: We can pick up passenger 0 to earn 5 - 2 + 4 = 7 dollars.",
			"Input: n = 20, rides = [[1,6,1],[3,10,2],[10,12,3],[11,12,2],[12,15,2],[13,18,1]]\nOutput: 20\nExplanation: We will pick up the following passengers:\n- Drive passenger 1 from point 3 to point 10 for a profit of 10 - 3 + 2 = 9 dollars.\n- Drive passenger 2 from point 10 to point 12 for a profit of 12 - 10 + 3 = 5 dollars.\n- Drive passenger 5 from point 13 to point 18 for a profit of 18 - 13 + 1 = 6 dollars.\nWe earn 9 + 5 + 6 = 20 dollars in total.",
		],
		constraints: [
			"1 <= n <= 10^5",
			"1 <= rides.length <= 3 * 10^4",
			"1 <= starti < endi <= n",
			"1 <= tipi <= 10^5",
		],
		solutions: [
			"Use dynamic programming with sorting",
			"Sort rides by end time",
			"For each position, choose the maximum profit from available rides",
		],
		timeComplexity: "O(N + R log R)",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/maximum-earnings-from-taxi/",
		tags: ["dynamic-programming", "sorting"],
	},
	{
		id: 2009,
		title: "Minimum Number of Operations to Make Array Continuous",
		difficulty: "Hard",
		category: "Array",
		algorithms: ["Sliding Window", "Sorting"],
		description:
			"You are given an integer array nums. In one operation, you can replace any element in nums with any integer. nums is considered continuous if both of the following conditions are fulfilled: All elements in nums are unique. The difference between the maximum element and the minimum element in nums equals nums.length - 1. For example, nums = [4, 2, 5, 3] is continuous, but nums = [1, 2, 3, 5, 6] is not continuous. Return the minimum number of operations to make nums continuous.",
		examples: [
			"Input: nums = [4,2,5,3]\nOutput: 0\nExplanation: nums is already continuous.",
			"Input: nums = [1,2,3,5,6]\nOutput: 1\nExplanation: One possible solution is to change the last element to 4.\nThe resulting array is [1,2,3,5,4], which is continuous.",
			"Input: nums = [1,10,100,1000]\nOutput: 3\nExplanation: One possible solution is to:\n- Change the second element to 2.\n- Change the third element to 3.\n- Change the fourth element to 4.\nThe resulting array is [1,2,3,4], which is continuous.",
		],
		constraints: ["1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^9"],
		solutions: [
			"Sort the array and remove duplicates",
			"Use sliding window to find the longest continuous subarray",
			"The minimum operations is the array length minus the longest continuous subarray",
		],
		timeComplexity: "O(N log N)",
		spaceComplexity: "O(N)",
		leetcodeUrl:
			"https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/",
		tags: ["array", "sliding-window", "sorting"],
	},
	{
		id: 2010,
		title: "The Number of Seniors and Juniors to Join the Company II",
		difficulty: "Hard",
		category: "Database",
		algorithms: ["SQL", "Window Functions"],
		description:
			'This is a follow-up question to "The Number of Seniors and Juniors to Join the Company". The company wants to hire new employees. The budget of the company for the salaries is $70000. The company\'s criteria for hiring are: Hiring the largest number of seniors. After hiring the maximum number of seniors, use the remaining budget to hire the largest number of juniors. Write an SQL query to find the number of seniors and juniors hired under the mentioned criteria.',
		examples: [
			"Input: Candidates table\n+-------------+------+--------+\n| employee_id | experience | salary |\n+-------------+------+--------+\n| 1           | Junior     | 10000  |\n| 9           | Junior     | 10000  |\n| 2           | Senior     | 20000  |\n| 11          | Senior     | 20000  |\n| 13          | Senior     | 50000  |\n| 4           | Junior     | 40000  |\n+-------------+------+--------+\nOutput:\n+------------+---------------------+\n| experience | accepted_candidates |\n+------------+---------------------+\n| Senior     | 2                   |\n| Junior     | 2                   |\n+------------+---------------------+",
		],
		constraints: ["No constraints provided for this database problem"],
		solutions: [
			"Use window functions to calculate cumulative salary for each experience level",
			"Find the maximum number of seniors that can be hired within budget",
			"Use remaining budget to hire maximum number of juniors",
		],
		timeComplexity: "O(N log N)",
		spaceComplexity: "O(N)",
		leetcodeUrl:
			"https://leetcode.com/problems/the-number-of-seniors-and-juniors-to-join-the-company-ii/",
		tags: ["database", "sql", "window-functions"],
	},
	{
		id: 2011,
		title: "Final Value of Variable After Performing Operations",
		difficulty: "Easy",
		category: "Array",
		algorithms: ["Array", "String"],
		description: "There is a programming language with only four operations and one variable X: ++X and X++ increments the value of the variable X by 1. --X and X-- decrements the value of the variable X by 1. Initially, the value of X is 0. Given an array of strings operations containing a list of operations, return the final value of X after performing all the operations.",
		examples: [
			"Input: operations = [\"--X\",\"X++\",\"X++\"]\nOutput: 1\nExplanation: The operations are performed as follows:\nInitially, X = 0.\n--X: X becomes -1.\nX++: X becomes 0.\nX++: X becomes 1.",
			"Input: operations = [\"++X\",\"++X\",\"X++\"]\nOutput: 3\nExplanation: The operations are performed as follows:\nInitially, X = 0.\n++X: X becomes 1.\n++X: X becomes 2.\nX++: X becomes 3.",
			"Input: operations = [\"X++\",\"++X\",\"--X\",\"X--\"]\nOutput: 0\nExplanation: The operations are performed as follows:\nInitially, X = 0.\nX++: X becomes 1.\n++X: X becomes 2.\n--X: X becomes 1.\nX--: X becomes 0."
		],
		constraints: [
			"1 <= operations.length <= 100",
			"operations[i] will be either \"++X\", \"X++\", \"--X\", or \"X--\"."
		],
		solutions: [
			"Iterate through each operation",
			"Check if operation starts with '+' (increment) or '-' (decrement)",
			"Update X accordingly"
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/final-value-of-variable-after-performing-operations/",
		tags: ["array", "string"]
	},
	{
		id: 2012,
		title: "Sum of Beauty in the Array",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Array", "Prefix Sum"],
		description: "You are given a 0-indexed integer array nums. For each index i (1 <= i <= nums.length - 2) the beauty of nums[i] equals: 2, if nums[j] < nums[i] < nums[k], for all 0 <= j < i and for all i < k <= nums.length - 1. 1, if nums[i - 1] < nums[i] < nums[i + 1], and the previous condition is not satisfied. 0, if none of the previous conditions holds. Return the sum of beauty of all nums[i] where 1 <= i <= nums.length - 2.",
		examples: [
			"Input: nums = [1,2,3]\nOutput: 2\nExplanation: For each index i in the range 1 <= i <= 1:\n- The beauty of nums[1] equals 2.",
			"Input: nums = [2,4,6,4]\nOutput: 1\nExplanation: For each index i in the range 1 <= i <= 2:\n- The beauty of nums[1] equals 1.\n- The beauty of nums[2] equals 0.",
			"Input: nums = [3,2,1]\nOutput: 0\nExplanation: For each index i in the range 1 <= i <= 1:\n- The beauty of nums[1] equals 0."
		],
		constraints: [
			"3 <= nums.length <= 10^5",
			"1 <= nums[i] <= 10^5"
		],
		solutions: [
			"For each position, check if it's greater than all elements to the left",
			"Check if it's less than all elements to the right",
			"Calculate beauty based on these conditions"
		],
		timeComplexity: "O(N^2)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/sum-of-beauty-in-the-array/",
		tags: ["array", "prefix-sum"]
	},
	{
		id: 2013,
		title: "Detect Squares",
		difficulty: "Medium",
		category: "Hash Table",
		algorithms: ["Hash Table", "Geometry"],
		description: "You are given a stream of points on the X-Y plane. Design an algorithm that: Adds new points from the stream into a data structure. Duplicate points are allowed and should be treated as different points. Given a query point, counts the number of ways to choose three points from the data structure such that the three points and the query point form an axis-aligned square with positive area. An axis-aligned square is a square whose edges are all aligned with the x-axis and y-axis. Implement the DetectSquares class: DetectSquares() Initializes the object with an empty data structure. void add(int[] point) Adds a new point point = [x, y] to the data structure. int count(int[] point) Counts the number of ways to form axis-aligned squares with point point = [x, y] as one of the vertices of the squares.",
		examples: [
			"Input\n[\"DetectSquares\", \"add\", \"add\", \"add\", \"count\", \"count\", \"add\", \"count\"]\n[[], [[3, 10]], [[11, 2]], [[3, 2]], [[11, 10]], [[14, 8]], [[11, 2]], [[11, 10]]]\nOutput\n[null, null, null, null, 1, 0, null, 2]\n\nExplanation\nDetectSquares detectSquares = new DetectSquares();\ndetectSquares.add([3, 10]);\ndetectSquares.add([11, 2]);\ndetectSquares.add([3, 2]);\ndetectSquares.count([11, 10]); // return 1. You can choose:\n                               //   - The first, second, and third points\ndetectSquares.count([14, 8]);  // return 0. The query point cannot form any square with the points in the data structure.\ndetectSquares.add([11, 2]);    // Adding duplicate points is allowed.\ndetectSquares.count([11, 10]); // return 2. You can choose:\n                               //   - The first, second, and third points\n                               //   - The first, third, and fourth points"
		],
		constraints: [
			"point.length == 2",
			"0 <= x, y <= 1000",
			"At most 3000 calls in total will be made to add and count."
		],
		solutions: [
			"Use a hash table to store point frequencies",
			"For each query point, find all possible square configurations",
			"Count the number of ways to form squares with the query point"
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/detect-squares/",
		tags: ["hash-table", "geometry"]
	},
	{
		id: 2014,
		title: "Longest Subsequence Repeated k Times",
		difficulty: "Hard",
		category: "String",
		algorithms: ["String", "Binary Search"],
		description: "You are given a string s of length n, and an integer k. You are tasked to find the longest subsequence repeated k times in string s. A subsequence is a string that can be derived from another string by deleting some or no characters without changing the order of the remaining characters. A subsequence seq is repeated k times in the string s if seq * k is a subsequence of s, where seq * k represents a string constructed by concatenating seq k times. For example, \"bba\" is repeated 2 times in \"cabcabc\", because the string \"bbacbbac\" constructed from \"bba\" concatenated 2 times, is a subsequence of \"cabcabc\". Return the longest subsequence repeated k times in string s. If there are multiple such subsequences, return the lexicographically largest one. If there is no such subsequence, return an empty string.",
		examples: [
			"Input: s = \"letsleetcode\", k = 2\nOutput: \"let\"\nExplanation: There are two longest subsequences repeated 2 times: \"let\" and \"ete\".\n\"let\" is the lexicographically largest one.",
			"Input: s = \"bb\", k = 2\nOutput: \"b\"\nExplanation: The longest subsequence repeated k times is \"b\".",
			"Input: s = \"ab\", k = 2\nOutput: \"\"\nExplanation: There is no subsequence repeated 2 times. Empty string is returned."
		],
		constraints: [
			"n == s.length",
			"2 <= k <= 2000",
			"2 <= n < k * 8",
			"s consists of lowercase English letters."
		],
		solutions: [
			"Use binary search on the length of the subsequence",
			"For each length, check if a subsequence of that length can be repeated k times",
			"Use greedy approach to find the lexicographically largest subsequence"
		],
		timeComplexity: "O(N * log N)",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/longest-subsequence-repeated-k-times/",
		tags: ["string", "binary-search"]
	},
	{
		id: 2015,
		title: "Average Height of Buildings in Each Segment",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Array", "Line Sweep"],
		description: "A perfectly straight street is represented by a number line. The street has building(s) on it and is represented by a 2D integer array buildings where buildings[i] = [starti, endi, heighti]. This means that there is a building with heighti in the half-closed interval [starti, endi). You want to describe the heights of the street with the minimum number of non-overlapping segments. Each segment has a starting x-coordinate, an ending x-coordinate, and an integer height. If a segment's left coordinate is the same as its right coordinate, then the segment represents a single point on the street. Return a 2D integer array segments where segments[j] = [leftj, rightj, averageHeightj] describes a segment with: leftj < rightj, and averageHeightj is the average height of the buildings in range [leftj, rightj) (rounded down to the nearest integer). You may return the segments in any order. The average height is calculated by summing up the heights of all the buildings in the range and dividing it by the number of buildings that are partially or fully inside the range.",
		examples: [
			"Input: buildings = [[1,4,2],[3,9,4]]\nOutput: [[1,3,2],[3,4,3],[4,9,4]]\nExplanation:\nFrom x = 1 to x = 3, there is only the first building with an average height of 2 / 1 = 2.\nFrom x = 3 to x = 4, both buildings are in the range. The average height is (2 + 4) / 2 = 3.\nFrom x = 4 to x = 9, there is only the second building with an average height of 4 / 1 = 4.",
			"Input: buildings = [[1,3,2],[2,4,3],[2,4,4]]\nOutput: [[1,2,2],[2,4,3]]\nExplanation:\nFrom x = 1 to x = 2, there is only the first building with an average height of 2 / 1 = 2.\nFrom x = 2 to x = 4, there are three buildings. The average height is (2 + 3 + 4) / 3 = 3."
		],
		constraints: [
			"1 <= buildings.length <= 10^4",
			"0 <= starti < endi <= 10^8",
			"1 <= heighti <= 10^6"
		],
		solutions: [
			"Use line sweep algorithm",
			"Sort all start and end points",
			"Calculate average height for each segment"
		],
		timeComplexity: "O(N log N)",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/average-height-of-buildings-in-each-segment/",
		tags: ["array", "line-sweep"]
	},
	{
		id: 2016,
		title: "Maximum Difference Between Increasing Elements",
		difficulty: "Easy",
		category: "Array",
		algorithms: ["Array", "Greedy"],
		description: "Given a 0-indexed integer array nums of size n, find the maximum difference nums[j] - nums[i] such that 0 <= i < j < n and nums[i] < nums[j]. Return the maximum difference. If no such i and j exists, return -1.",
		examples: [
			"Input: nums = [7,1,5,4]\nOutput: 4\nExplanation:\nThe maximum difference occurs with i = 1 and j = 2, nums[j] - nums[i] = 5 - 1 = 4.\nNote that with i = 1 and j = 3, the difference nums[j] - nums[i] = 4 - 1 = 3, but this is not the maximum difference because 5 > 4.",
			"Input: nums = [9,4,3,2]\nOutput: -1\nExplanation:\nThere is no i and j such that i < j and nums[i] < nums[j].",
			"Input: nums = [1,5,2,10]\nOutput: 9\nExplanation:\nThe maximum difference occurs with i = 0 and j = 3, nums[j] - nums[i] = 10 - 1 = 9."
		],
		constraints: [
			"n == nums.length",
			"2 <= n <= 1000",
			"1 <= nums[i] <= 10^9"
		],
		solutions: [
			"Keep track of minimum element seen so far",
			"For each element, calculate difference with minimum",
			"Update maximum difference if current difference is larger"
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/maximum-difference-between-increasing-elements/",
		tags: ["array", "greedy"]
	},
	{
		id: 2017,
		title: "Grid Game",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Array", "Prefix Sum"],
		description: "You are given a 0-indexed 2D array grid of size 2 x n, where grid[r][c] represents the number of points at position (r, c) on the matrix. Two robots are playing a game on this matrix. Both robots initially start at (0, 0) and want to reach (1, n-1). Each robot may only move to the right ((r, c) to (r, c + 1)) or down ((r, c) to (r + 1, c)). At the start of the game, the first robot moves from (0, 0) to (1, n-1), collecting all the points from the cells on its path. For all cells (r, c) traversed by the first robot, grid[r][c] is set to 0. Then, the second robot moves from (0, 0) to (1, n-1), collecting all the points from the cells on its path. Note that their paths may intersect with one another. The first robot wants to minimize the number of points collected by the second robot. In contrast, the second robot wants to maximize the number of points it can collect. If both robots play optimally, return the number of points collected by the second robot.",
		examples: [
			"Input: grid = [[2,5,4],[1,5,1]]\nOutput: 4\nExplanation: The optimal path taken by the first robot is shown in red, and that taken by the second robot is shown in blue.\nThe cells visited by the first robot are set to 0.\nThe second robot will collect 0 + 0 + 4 + 0 = 4 points.",
			"Input: grid = [[3,3,1],[8,5,2]]\nOutput: 4\nExplanation: The optimal path taken by the first robot is shown in red, and that taken by the second robot is shown in blue.\nThe cells visited by the first robot are set to 0.\nThe second robot will collect 0 + 3 + 1 + 0 = 4 points.",
			"Input: grid = [[1,3,1,15],[1,3,3,1]]\nOutput: 7\nExplanation: The optimal path taken by the first robot is shown in red, and that taken by the second robot is shown in blue.\nThe cells visited by the first robot are set to 0.\nThe second robot will collect 0 + 1 + 3 + 3 + 0 = 7 points."
		],
		constraints: [
			"grid.length == 2",
			"n == grid[r].length",
			"1 <= n <= 5 * 10^4",
			"1 <= grid[r][c] <= 10^5"
		],
		solutions: [
			"The first robot will choose the path that minimizes the second robot's maximum possible score",
			"Use dynamic programming to find optimal paths",
			"Calculate the maximum score the second robot can achieve after the first robot's move"
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/grid-game/",
		tags: ["array", "prefix-sum"]
	},
	{
		id: 2018,
		title: "Check if Word Can Be Placed In Crossword",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Array", "String"],
		description: "You are given an m x n matrix board, representing the current state of a crossword puzzle. The crossword contains lowercase English letters (from solved words), ' ' to represent any empty cell, and '#' to represent any blocked cell. You are also given a string word, which you need to place in the board. A word can be placed horizontally (left to right or right to left) or vertically (top to bottom or bottom to top) in the board if: It fits in the available space by length. For each character in word, there is a corresponding cell in the board with the same letter, or it is an empty cell (' '). The word should not use a blocked cell ('#'). Here is an example for better understanding. Return true if word can be placed in board, or false otherwise. Note: A word can be placed multiple times in different locations.",
		examples: [
			"Input: board = [[\"#\", \" \", \"#\"], [\" \", \" \", \"#\"], [\"#\", \"c\", \" \"]], word = \"abc\"\nOutput: true\nExplanation: The word \"abc\" can be placed as shown above (top to bottom).",
			"Input: board = [[\" \", \"#\", \"a\"], [\" \", \"#\", \"c\"], [\" \", \"#\", \"a\"]], word = \"ac\"\nOutput: false\nExplanation: It is impossible to place the word because there will always be a space/letter above or below it.",
			"Input: board = [[\"#\", \" \", \"#\"], [\" \", \" \", \"#\"], [\"#\", \" \", \"c\"]], word = \"ca\"\nOutput: true\nExplanation: The word \"ca\" can be placed as shown above (right to left)."
		],
		constraints: [
			"m == board.length",
			"n == board[i].length",
			"1 <= m * n <= 2 * 10^5",
			"board[i][j] will be ' ', '#', or a lowercase English letter.",
			"1 <= word.length <= max(m, n)",
			"word will contain only lowercase English letters."
		],
		solutions: [
			"Check all possible positions and orientations for the word",
			"For each position, verify if the word can fit",
			"Check both horizontal and vertical directions"
		],
		timeComplexity: "O(M * N * L)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/check-if-word-can-be-placed-in-crossword/",
		tags: ["array", "string"]
	},
	{
		id: 2019,
		title: "The Score of Students Solving Math Expression",
		difficulty: "Hard",
		category: "String",
		algorithms: ["String", "Dynamic Programming"],
		description: "You are given a string s that contains digits 0-9, addition symbols '+', and multiplication symbols '*' only, representing a valid mathematical expression. You are also given an array answers of length n, which contains the answers submitted by n students. You are tasked with finding the score of each student. The score of a student is calculated as follows: If the answer submitted by the student equals the correct evaluation of the expression, then the student gets 5 points. Otherwise, if the answer submitted by the student equals the evaluation of the expression with any number of parentheses inserted, then the student gets 2 points. Otherwise, the student gets 0 points. Return the sum of the scores of all students.",
		examples: [
			"Input: s = \"7+3*1*2\", answers = [20,13,42]\nOutput: 7\nExplanation: As illustrated above, the correct evaluation of the expression is 13.\nStudent 1 submitted 20, so they get 0 points.\nStudent 2 submitted 13, so they get 5 points.\nStudent 3 submitted 42, so they get 2 points.\nThe total score is 0 + 5 + 2 = 7.",
			"Input: s = \"3+5*2\", answers = [13,0,10,13,13,16,16]\nOutput: 19\nExplanation: The correct evaluation of the expression is 13.\nStudent 1 submitted 13, so they get 5 points.\nStudent 2 submitted 0, so they get 0 points.\nStudent 3 submitted 10, so they get 2 points.\nStudent 4 submitted 13, so they get 5 points.\nStudent 5 submitted 13, so they get 5 points.\nStudent 6 submitted 16, so they get 2 points.\nStudent 7 submitted 16, so they get 2 points.\nThe total score is 5 + 0 + 2 + 5 + 5 + 2 + 2 = 19.",
			"Input: s = \"6+0*1\", answers = [12,9,6,4,8,6]\nOutput: 10\nExplanation: The correct evaluation of the expression is 6.\nStudent 1 submitted 12, so they get 2 points.\nStudent 2 submitted 9, so they get 0 points.\nStudent 3 submitted 6, so they get 5 points.\nStudent 4 submitted 4, so they get 0 points.\nStudent 5 submitted 8, so they get 2 points.\nStudent 6 submitted 6, so they get 5 points.\nThe total score is 2 + 0 + 5 + 0 + 2 + 5 = 14."
		],
		constraints: [
			"3 <= s.length <= 31",
			"s represents a valid expression that contains only digits 0-9, '+', and '*'.",
			"2 <= answers.length <= 10^4",
			"1 <= answers[i] <= 10^5"
		],
		solutions: [
			"Calculate the correct evaluation of the expression",
			"Generate all possible evaluations with different parentheses placements",
			"Score each student based on their answer"
		],
		timeComplexity: "O(2^N)",
		spaceComplexity: "O(2^N)",
		leetcodeUrl: "https://leetcode.com/problems/the-score-of-students-solving-math-expression/",
		tags: ["string", "dynamic-programming"]
	},
	{
		id: 2020,
		title: "Number of Accounts That Did Not Stream",
		difficulty: "Medium",
		category: "Database",
		algorithms: ["SQL", "Aggregation"],
		description: "Write an SQL query to report the number of accounts that bought a subscription but did not stream any shows in 2021. Return the result table in any order.",
		examples: [
			"Input: Subscriptions table:\n+------------+-------------+------------+\n| account_id | start_date  | end_date   |\n+------------+-------------+------------+\n| 9          | 2020-02-18  | 2022-10-30 |\n| 3          | 2021-10-21  | 2021-12-27 |\n| 11         | 2020-02-28  | 2020-08-18 |\n| 13         | 2021-04-20  | 2021-12-28 |\n| 4          | 2020-10-26  | 2021-03-08 |\n| 5          | 2020-09-11  | 2021-01-17 |\n+------------+-------------+------------+\nStreams table:\n+------------+------------+\n| session_id | account_id |\n+------------+------------+\n| 14         | 9          |\n| 16         | 3          |\n| 18         | 11         |\n| 17         | 13         |\n| 19         | 4          |\n| 13         | 5          |\n+------------+------------+\nOutput:\n+---------------------+\n| accounts_count      |\n+---------------------+\n| 2                   |\n+---------------------+\nExplanation:\nAccount 9 bought a subscription and streamed shows in 2021.\nAccount 3 bought a subscription and streamed shows in 2021.\nAccount 11 bought a subscription but did not stream any shows in 2021.\nAccount 13 bought a subscription and streamed shows in 2021.\nAccount 4 bought a subscription and streamed shows in 2021.\nAccount 5 bought a subscription but did not stream any shows in 2021.\nSo, 2 accounts bought a subscription but did not stream any shows in 2021."
		],
		constraints: [
			"No constraints provided for this database problem"
		],
		solutions: [
			"Use LEFT JOIN to find accounts with subscriptions but no streams in 2021",
			"Filter by subscription dates that overlap with 2021",
			"Count accounts that have no matching streams"
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/number-of-accounts-that-did-not-stream/",
		tags: ["database", "sql", "aggregation"]
	}
	// ... continuing with more problems from 2001-2500
];
