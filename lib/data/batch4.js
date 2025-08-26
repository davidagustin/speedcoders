export const batch4Problems = [
	{
		id: 1501,
		title: "Countries You Can Safely Invest In",
		difficulty: "Medium",
		category: "Database",
		algorithms: ["SQL", "Database"],
		description:
			"A country is big if it has an area of bigger than 3 million square km or a population of more than 25 million. Write a SQL solution to output big countries' name, population and area.",
		examples: [
			"Input: World table\n+-------------+-----------+---------+------------+--------------+\n| name        | continent | area     | population  | gdp          |\n+-------------+-----------+---------+------------+--------------+\n| Afghanistan | Asia      | 652230   | 25500100   | 20343000000  |\n| Albania     | Europe    | 28748    | 2831741    | 12960000000  |\n| Algeria     | Africa    | 2381741  | 37100000   | 188681000000 |\n| Andorra     | Europe    | 468      | 78115      | 3712000000   |\n| Angola      | Africa    | 1246700  | 20609294   | 100990000000 |\n+-------------+-----------+---------+------------+--------------+\nOutput:\n+-------------+------------+---------+\n| name        | population | area    |\n+-------------+------------+---------+\n| Afghanistan | 25500100   | 652230  |\n| Algeria     | 37100000   | 2381741 |\n+-------------+------------+---------+",
		],
		constraints: ["No constraints provided for this database problem"],
		solutions: [
			"Use WHERE clause to filter countries by area > 3000000 OR population > 25000000",
			"SELECT name, population, area FROM World WHERE area > 3000000 OR population > 25000000",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(1)",
		leetcodeUrl:
			"https://leetcode.com/problems/countries-you-can-safely-invest-in/",
		tags: ["database", "sql"],
	},
	{
		id: 1502,
		title: "Can Make Arithmetic Progression From Sequence",
		difficulty: "Easy",
		category: "Array",
		algorithms: ["Sorting", "Math"],
		description:
			"A sequence of numbers is called an arithmetic progression if the difference between any two consecutive elements is the same. Given an array of numbers arr, return true if the array can be rearranged to form an arithmetic progression. Otherwise, return false.",
		examples: [
			"Input: arr = [3,5,1]\nOutput: true\nExplanation: We can reorder the elements as [1,3,5] or [5,3,1] with differences 2 and -2 respectively, between each consecutive elements.",
			"Input: arr = [1,2,4]\nOutput: false\nExplanation: There is no way to reorder the elements to obtain an arithmetic progression.",
		],
		constraints: ["2 <= arr.length <= 1000", "-10^6 <= arr[i] <= 10^6"],
		solutions: [
			"Sort the array",
			"Check if the difference between consecutive elements is constant",
		],
		timeComplexity: "O(N log N)",
		spaceComplexity: "O(1)",
		leetcodeUrl:
			"https://leetcode.com/problems/can-make-arithmetic-progression-from-sequence/",
		tags: ["array", "sorting", "math"],
	},
	{
		id: 1503,
		title: "Last Moment Before All Ants Fall Out of a Plank",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Simulation", "Math"],
		description:
			"We have a wooden plank of the length n units. Some ants are walking on the plank, each ant moves with speed 1 unit per second. Some of the ants move to the left, the other move to the right. When two ants moving in two different directions meet at some point, they change their directions and continue moving again. Assume that changing directions doesn't take any additional time. When an ant reaches one end of the plank at a time t, it falls out of the plank immediately. Given an integer n and two integer arrays left and right, the positions of the ants moving left and right, return the last moment when the last ant(s) fall out of the plank.",
		examples: [
			"Input: n = 4, left = [4,3], right = [0,1]\nOutput: 4\nExplanation: In the image above:\n-The ant at index 0 is named A and going to the right.\n-The ant at index 1 is named B and going to the right.\n-The ant at index 3 is named C and going to the left.\n-The ant at index 4 is named D and going to the left.\nNote that the last moment when an ant was on the plank is t = 4 second, after that it falls immediately out of the plank. (i.e., We can say that at t = 4.0000000001, there is no ants on the plank).",
			"Input: n = 7, left = [], right = [0,1,2,3,4,5,6,7]\nOutput: 7\nExplanation: All ants are going to the right, the ant at index 0 needs 7 seconds to reach the leftmost end of the plank.",
		],
		constraints: [
			"1 <= n <= 10^4",
			"0 <= left.length <= n + 1",
			"0 <= left[i] <= n",
			"0 <= right.length <= n + 1",
			"0 <= right[i] <= n",
			"1 <= left.length + right.length <= n + 1",
			"All values of left and right are unique, and each value can appear only in one of the two arrays.",
		],
		solutions: [
			"The key insight is that ants passing through each other is equivalent to them continuing in their original direction",
			"Find the maximum time for left-moving ants to reach the left end",
			"Find the maximum time for right-moving ants to reach the right end",
			"Return the maximum of these two times",
		],
		timeComplexity: "O(L + R)",
		spaceComplexity: "O(1)",
		leetcodeUrl:
			"https://leetcode.com/problems/last-moment-before-all-ants-fall-out-of-a-plank/",
		tags: ["array", "simulation", "math"],
	},
	{
		id: 1504,
		title: "Count Submatrices With All Ones",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Dynamic Programming", "Matrix"],
		description:
			"Given a rows * columns matrix mat of ones and zeros, return how many submatrices have all ones.",
		examples: [
			"Input: mat = [[1,0,1],\n        [1,1,0],\n        [1,1,0]]\nOutput: 13\nExplanation:\nThere are 6 rectangles of side 1x1.\nThere are 2 rectangles of side 1x2.\nThere are 3 rectangles of side 2x1.\nThere is 1 rectangle of side 2x2.\nThere is 1 rectangle of side 3x1.\nTotal number of rectangles = 6 + 2 + 3 + 1 + 1 = 13.",
			"Input: mat = [[0,1,1,0],\n        [0,1,1,1],\n        [1,1,1,0]]\nOutput: 24\nExplanation:\nThere are 8 rectangles of side 1x1.\nThere are 5 rectangles of side 1x2.\nThere are 2 rectangles of side 1x3.\nThere are 4 rectangles of side 2x1.\nThere are 2 rectangles of side 2x2.\nThere are 2 rectangles of side 3x1.\nThere is 1 rectangle of side 3x2.\nTotal number of rectangles = 8 + 5 + 2 + 4 + 2 + 2 + 1 = 24.",
		],
		constraints: [
			"1 <= rows <= 150",
			"1 <= columns <= 150",
			"0 <= mat[i][j] <= 1",
		],
		solutions: [
			"Use dynamic programming to count consecutive ones in each row",
			"For each cell, calculate the number of rectangles ending at that cell",
			"Use the minimum height of consecutive ones to count valid rectangles",
		],
		timeComplexity: "O(M * N)",
		spaceComplexity: "O(M * N)",
		leetcodeUrl:
			"https://leetcode.com/problems/count-submatrices-with-all-ones/",
		tags: ["array", "dynamic-programming", "matrix"],
	},
	{
		id: 1505,
		title: "Minimum Possible Integer After at Most K Adjacent Swaps On Digits",
		difficulty: "Hard",
		category: "String",
		algorithms: ["Greedy", "String"],
		description:
			"You are given a string num representing the digits of a very large integer and an integer k. You are allowed to swap any two adjacent digits of the integer at most k times. Return the minimum integer you can obtain also as a string.",
		examples: [
			'Input: num = "4321", k = 4\nOutput: "1342"\nExplanation: The steps to obtain the minimum integer from 4321 with 4 adjacent swaps are shown.\nStep 1: 4321 -> 3421\nStep 2: 3421 -> 3241\nStep 3: 3241 -> 2341\nStep 4: 2341 -> 1342\nHence, the minimum integer is 1342.',
			'Input: num = "100", k = 1\nOutput: "010"\nExplanation: It\'s ok for the output to have leading zeros, but the input is guaranteed not to have any leading zeros.',
			'Input: num = "36789", k = 1000\nOutput: "36789"\nExplanation: We can keep the number without any swaps.',
		],
		constraints: [
			"1 <= num.length <= 3 * 10^4",
			"num consists of only digits and does not contain leading zeros.",
			"1 <= k <= 10^9",
		],
		solutions: [
			"Use greedy approach to find the smallest digit that can be moved to the front",
			"Calculate the minimum number of swaps needed to move each digit",
			"Choose the digit that requires the least swaps within the limit k",
		],
		timeComplexity: "O(N^2)",
		spaceComplexity: "O(N)",
		leetcodeUrl:
			"https://leetcode.com/problems/minimum-possible-integer-after-at-most-k-adjacent-swaps-on-digits/",
		tags: ["string", "greedy"],
	},
	{
		id: 1506,
		title: "Find Root of N-Ary Tree",
		difficulty: "Medium",
		category: "Tree",
		algorithms: ["Tree", "Hash Table"],
		description:
			"You are given all the nodes of an N-ary tree as an array of Node objects, where each node has a unique value. Return the root of the N-ary tree. Custom testing: An N-ary tree can be serialized as represented in its level order traversal, where each group of children is separated by the null value (See examples).",
		examples: [
			"Input: tree = [1,null,3,2,4,null,5,6]\nOutput: [1,null,3,2,4,null,5,6]\nExplanation: From the serialization of the given tree, we can see that the root is 1.",
			"Input: tree = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]\nOutput: [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]",
		],
		constraints: [
			"The total number of nodes is between [1, 5 * 10^4].",
			"Each node has a unique value.",
			"-10^5 <= Node.val <= 10^5",
		],
		solutions: [
			"Use a hash set to track all child nodes",
			"The root is the node that is not a child of any other node",
			"Iterate through all nodes and add their children to the set",
			"Find the node that is not in the children set",
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/find-root-of-n-ary-tree/",
		tags: ["tree", "hash-table"],
	},
	{
		id: 1507,
		title: "Reformat Date",
		difficulty: "Easy",
		category: "String",
		algorithms: ["String", "Parsing"],
		description:
			'Given a date string in the form Day Month Year, where: Day is in the set {"1st", "2nd", "3rd", "4th", ..., "30th", "31st"}. Month is in the set {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"}. Year is in the range [1900, 2100]. Convert the date string to the format YYYY-MM-DD, where: YYYY denotes the 4 digit year. MM denotes the 2 digit month. DD denotes the 2 digit day.',
		examples: [
			'Input: date = "20th Oct 2052"\nOutput: "2052-10-20"',
			'Input: date = "6th Jun 1933"\nOutput: "1933-06-06"',
			'Input: date = "26th May 1960"\nOutput: "1960-05-26"',
		],
		constraints: [
			"The given dates are guaranteed to be valid, so no error handling is necessary.",
		],
		solutions: [
			"Parse the day by removing the suffix (st, nd, rd, th)",
			"Map month names to numbers",
			"Format the year, month, and day with proper padding",
		],
		timeComplexity: "O(1)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/reformat-date/",
		tags: ["string", "parsing"],
	},
	{
		id: 1508,
		title: "Range Sum of Sorted Subarray Sums",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Array", "Sorting"],
		description:
			"You are given the array nums consisting of n positive integers. You computed the sum of all non-empty continuous subarrays from the array and then sorted them in non-decreasing order, creating a new array of n * (n + 1) / 2 numbers. Return the sum of the numbers from index left to index right (indexed from 1), inclusive, in the new array. Since the answer can be a huge number return it modulo 10^9 + 7.",
		examples: [
			"Input: nums = [1,2,3,4], n = 4, left = 1, right = 5\nOutput: 13\nExplanation: All subarray sums are 1, 3, 6, 10, 2, 5, 9, 3, 7, 4. After sorting them in non-decreasing order we have the new array [1, 2, 3, 3, 4, 5, 6, 7, 9, 10]. The sum of the numbers from index le = 1 to ri = 5 is 1 + 2 + 3 + 3 + 4 = 13.",
			"Input: nums = [1,2,3,4], n = 4, left = 3, right = 4\nOutput: 6\nExplanation: The given array is the same as example 1. We have the new array [1, 2, 3, 3, 4, 5, 6, 7, 9, 10]. The sum of the numbers from index le = 3 to ri = 4 is 3 + 3 = 6.",
			"Input: nums = [1,2,3,4], n = 4, left = 1, right = 10\nOutput: 50",
		],
		constraints: [
			"n == nums.length",
			"1 <= nums.length <= 10^3",
			"1 <= nums[i] <= 10^3",
			"1 <= left <= right <= n * (n + 1) / 2",
		],
		solutions: [
			"Generate all subarray sums",
			"Sort the sums",
			"Calculate the sum of elements from left to right (1-indexed)",
		],
		timeComplexity: "O(N^2 log N)",
		spaceComplexity: "O(N^2)",
		leetcodeUrl:
			"https://leetcode.com/problems/range-sum-of-sorted-subarray-sums/",
		tags: ["array", "sorting"],
	},
	{
		id: 1509,
		title:
			"Minimum Difference Between Largest and Smallest Value in Three Moves",
		difficulty: "Medium",
		category: "Array",
		algorithms: ["Greedy", "Sorting"],
		description:
			"You are given an integer array nums. In one move, you can choose one element of nums and change it by any value in one move. Return the minimum difference between the largest and smallest value of nums after performing at most three moves.",
		examples: [
			"Input: nums = [5,3,2,4]\nOutput: 0\nExplanation: Change the array [5,3,2,4] to [2,2,2,2].\nThe difference between the maximum and minimum is 2-2 = 0.",
			"Input: nums = [1,5,0,10,14]\nOutput: 1\nExplanation: Change the array [1,5,0,10,14] to [1,1,0,1,1].\nThe difference between the maximum and minimum is 1-0 = 1.",
			"Input: nums = [3,100,20]\nOutput: 0\nExplanation: Change the array [3,100,20] to [3,3,3].\nThe difference between the maximum and minimum is 3-3 = 0.",
		],
		constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
		solutions: [
			"Sort the array",
			"Consider all possible combinations of removing 3 elements",
			"The minimum difference is the minimum of (max - min) after removing 3 elements",
		],
		timeComplexity: "O(N log N)",
		spaceComplexity: "O(1)",
		leetcodeUrl:
			"https://leetcode.com/problems/minimum-difference-between-largest-and-smallest-value-in-three-moves/",
		tags: ["array", "greedy", "sorting"],
	},
	{
		id: 1510,
		title: "Stone Game IV",
		difficulty: "Hard",
		category: "Dynamic Programming",
		algorithms: ["Dynamic Programming", "Game Theory"],
		description:
			"Alice and Bob take turns playing a game, with Alice starting first. Initially, there are n stones in a pile. On each player's turn, that player makes a move consisting of removing any non-zero square number of stones in the pile. Also, if a player cannot make a move, he/she loses the game. Given a positive integer n, return true if and only if Alice wins the game otherwise return false, assuming both players play optimally.",
		examples: [
			"Input: n = 1\nOutput: true\nExplanation: Alice can remove 1 stone winning the game because Bob doesn't have any moves.",
			"Input: n = 2\nOutput: false\nExplanation: Alice can only remove 1 stone, after that Bob removes the last stone winning the game (2 -> 1 -> 0).",
			"Input: n = 4\nOutput: true\nExplanation: n is already a perfect square, Alice can win by removing 4 stones (4 -> 0).",
			"Input: n = 7\nOutput: false\nExplanation: Alice can't win the game because if Alice removes 4 stones, the heap will be 3, and Bob will remove 1 stone then Alice should remove 1 stone and finally Bob removes the last stone (7 -> 3 -> 2 -> 1 -> 0). If Alice removes 1 stone first, the heap will be 6, and Bob will remove 4 stones then Alice should remove 1 stone and finally Bob removes the last stone (7 -> 6 -> 2 -> 1 -> 0).",
		],
		constraints: ["1 <= n <= 10^5"],
		solutions: [
			"Use dynamic programming to determine if a player can win from a given position",
			"For each position, check if there's a move that leads to a losing position for the opponent",
			"A position is winning if there's at least one move to a losing position",
		],
		timeComplexity: "O(N * sqrt(N))",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/stone-game-iv/",
		tags: ["dynamic-programming", "game-theory"],
	},
	{
		id: 1511,
		title: "Customer Order Frequency",
		difficulty: "Easy",
		category: "Database",
		algorithms: ["SQL", "Aggregation"],
		description: "Write an SQL query to report the customer_id and customer_name of customers who bought products \"A\" and \"B\" but did not buy the product \"C\" since we want to recommend them buy product \"C\". Return the result table in any order.",
		examples: [
			"Input: Customers table\n+-------------+---------------+\n| customer_id | customer_name |\n+-------------+---------------+\n| 1           | Daniel        |\n| 2           | Diana         |\n| 3           | Elizabeth     |\n| 4           | Jhon          |\n+-------------+---------------+\nOrders table\n+------------+--------------+---------------+\n| order_id   | customer_id  | product_name  |\n+------------+--------------+---------------+\n| 10         | 1            | A             |\n| 20         | 1            | B             |\n| 30         | 1            | D             |\n| 40         | 1            | C             |\n| 50         | 2            | A             |\n| 60         | 3            | A             |\n| 70         | 3            | B             |\n| 80         | 3            | D             |\n| 90         | 4            | C             |\n+------------+--------------+---------------+\nOutput:\n+-------------+---------------+\n| customer_id | customer_name |\n+-------------+---------------+\n| 3           | Elizabeth     |\n+-------------+---------------+"
		],
		constraints: [
			"No constraints provided for this database problem"
		],
		solutions: [
			"Use GROUP BY to group by customer_id",
			"Use HAVING to filter customers who bought A and B but not C",
			"Join with Customers table to get customer names"
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/customer-order-frequency/",
		tags: ["database", "sql", "aggregation"]
	},
	{
		id: 1512,
		title: "Number of Good Pairs",
		difficulty: "Easy",
		category: "Array",
		algorithms: ["Hash Table", "Math"],
		description: "Given an array of integers nums, return the number of good pairs. A pair (i, j) is called good if nums[i] == nums[j] and i < j.",
		examples: [
			"Input: nums = [1,2,3,1,1,3]\nOutput: 4\nExplanation: There are 4 good pairs (0,3), (0,4), (3,4), (2,5) 0-indexed.",
			"Input: nums = [1,1,1,1]\nOutput: 6\nExplanation: Each pair in the array are good.",
			"Input: nums = [1,2,3]\nOutput: 0"
		],
		constraints: [
			"1 <= nums.length <= 100",
			"1 <= nums[i] <= 100"
		],
		solutions: [
			"Use a hash table to count frequencies",
			"For each frequency, calculate the number of pairs using combination formula",
			"Sum up all pair counts"
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/number-of-good-pairs/",
		tags: ["array", "hash-table", "math"]
	},
	{
		id: 1513,
		title: "Number of Substrings With Only 1s",
		difficulty: "Medium",
		category: "String",
		algorithms: ["String", "Math"],
		description: "Given a binary string s, return the number of substrings with all characters 1's. Since the answer may be too large, return it modulo 10^9 + 7.",
		examples: [
			"Input: s = \"0110111\"\nOutput: 9\nExplanation: There are 9 substring in total with only 1's characters.\n\"1\" -> 5 times.\n\"11\" -> 3 times.\n\"111\" -> 1 time.",
			"Input: s = \"101\"\nOutput: 2\nExplanation: Substring \"1\" is shown 2 times in s.",
			"Input: s = \"111111\"\nOutput: 21\nExplanation: Each substring contains only 1's characters."
		],
		constraints: [
			"1 <= s.length <= 10^5",
			"s[i] is either '0' or '1'"
		],
		solutions: [
			"Find consecutive 1s in the string",
			"For each group of n consecutive 1s, calculate n*(n+1)/2 substrings",
			"Sum up all substring counts"
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/number-of-substrings-with-only-1s/",
		tags: ["string", "math"]
	},
	{
		id: 1514,
		title: "Path with Maximum Probability",
		difficulty: "Medium",
		category: "Graph",
		algorithms: ["Dijkstra", "Graph"],
		description: "You are given an undirected weighted graph of n nodes (0-indexed), represented by an edge list where edges[i] = [a, b] is an undirected edge connecting the nodes a and b with a probability of success of traversing that edge succProb[i]. Given two nodes start and end, find the path with the maximum probability of success to go from start to end and return its success probability. If there is no path from start to end, return 0. Your answer will be accepted if it differs from the correct answer by at most 1e-5.",
		examples: [
			"Input: n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.2], start = 0, end = 2\nOutput: 0.25000\nExplanation: There are two paths from start to end, one having a probability of success = 0.2 and the other has 0.5 * 0.5 = 0.25.",
			"Input: n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.3], start = 0, end = 2\nOutput: 0.30000",
			"Input: n = 3, edges = [[0,1]], succProb = [0.5], start = 0, end = 2\nOutput: 0.00000\nExplanation: There is no path between 0 and 2."
		],
		constraints: [
			"2 <= n <= 10^4",
			"0 <= start, end < n",
			"start != end",
			"0 <= a, b < n",
			"a != b",
			"0 <= succProb.length == edges.length <= 2*10^4",
			"0 <= succProb[i] <= 1",
			"There is at most one edge between every two nodes."
		],
		solutions: [
			"Use modified Dijkstra's algorithm",
			"Instead of finding shortest path, find path with maximum probability",
			"Use max-heap instead of min-heap"
		],
		timeComplexity: "O((V + E) log V)",
		spaceComplexity: "O(V + E)",
		leetcodeUrl: "https://leetcode.com/problems/path-with-maximum-probability/",
		tags: ["graph", "dijkstra"]
	},
	{
		id: 1515,
		title: "Best Position for a Service Centre",
		difficulty: "Hard",
		category: "Math",
		algorithms: ["Math", "Geometry"],
		description: "A delivery company wants to build a new service centre in a new city. The company knows the positions of all the customers in this city on a 2D-Map and wants to build the new centre in a position such that the sum of the euclidean distances to all customers is minimum. Given an array positions where positions[i] = [xi, yi] is the position of the ith customer on the map, return the minimum sum of the euclidean distances to all customers. In other words, you need to choose the position of the service centre [xcentre, ycentre] such that the following formula is minimized: Answers within 10^-5 of the actual value will be accepted as correct.",
		examples: [
			"Input: positions = [[0,1],[1,0],[1,2],[2,1]]\nOutput: 4.00000\nExplanation: As shown, you can see that choosing [xcentre, ycentre] = [1, 1] will make the distance to each customer = 1, the sum of all distances is 4 which is the minimum possible we can achieve.",
			"Input: positions = [[1,1],[3,3]]\nOutput: 2.82843\nExplanation: The minimum sum of distances is sqrt(2) + sqrt(2) = 2.82843",
			"Input: positions = [[1,1]]\nOutput: 0.00000\nExplanation: Since there is only one customer, the service centre is built at their location and the distance is 0."
		],
		constraints: [
			"1 <= positions.length <= 50",
			"positions[i].length == 2",
			"0 <= positions[i][0], positions[i][1] <= 100"
		],
		solutions: [
			"Use gradient descent or optimization algorithms",
			"Start from centroid and iteratively improve position",
			"Use geometric median approximation"
		],
		timeComplexity: "O(N * I)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/best-position-for-a-service-centre/",
		tags: ["math", "geometry"]
	},
	{
		id: 1516,
		title: "Move Sub-Tree of N-Ary Tree",
		difficulty: "Hard",
		category: "Tree",
		algorithms: ["Tree", "DFS"],
		description: "Given the root of an N-ary tree of unique values, and two nodes of the tree p and q. You should move the subtree of node p to become a direct child of node q. If p is already a direct child of q, don't change anything. If it's impossible to do it, return null. The move is one step operation that involves changing the parent of one node only. Return the root of the tree after adjusting it. There are 3 cases for the nodes p and q: node q is in the subtree of node p or vice versa (in which case moving p inside q would create a cycle). node p is an ancestor of node q at the same level. node p is not related to q at all. In the first 2 cases described above, you cannot move a subtree inside its own descendant while maintaining a tree structure. So, the final result of the move is null. However, in the 3rd case, the subtree can be moved successfully. Keep in mind that the S-Tree of a node is a tree consisting of the node, plus all descendants of the node.",
		examples: [
			"Input: root = [1,null,2,3,null,4,5,null,6,7,8], p = 4, q = 1\nOutput: [1,null,2,3,4,null,5,null,6,7,8]\nExplanation: This example follows the second case as node p is an ancestor of node q. The node p can be moved because p is not already a direct child of q, and p is not an ancestor of q at the same level.",
			"Input: root = [1,null,2,3,null,4,5,null,6,7,8], p = 6, q = 4\nOutput: [1,null,2,3,null,4,5,6,null,7,8]\nExplanation: Node 6 becomes the direct child of node 4 and retains its subtree which consists of node 7 and 8.",
			"Input: root = [1,null,2,3,null,4,5,null,6,7,8], p = 3, q = 8\nOutput: null\nExplanation: Node 3 cannot be moved because node 8 is in its subtree (3->2->4->6->8)."
		],
		constraints: [
			"The total number of nodes is between [2, 1000].",
			"Each node has a unique value.",
			"p != null and q != null and p != q."
		],
		solutions: [
			"Check if q is in p's subtree or p is in q's subtree",
			"If so, return null (would create cycle)",
			"Otherwise, perform the move operation"
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(H)",
		leetcodeUrl: "https://leetcode.com/problems/move-sub-tree-of-n-ary-tree/",
		tags: ["tree", "dfs"]
	},
	{
		id: 1517,
		title: "Find Users With Valid E-Mails",
		difficulty: "Easy",
		category: "Database",
		algorithms: ["SQL", "Regex"],
		description: "Write an SQL query to find the users who have valid emails. A valid e-mail has a prefix name and a domain where: The prefix name is a string that may contain letters (upper or lower case), digits, underscore '_', period '.', and/or dash '-'. The prefix name must start with a letter. The domain is '@leetcode.com'. Return the result table in any order.",
		examples: [
			"Input: Users table:\n+---------+-----------+-------------------------+\n| user_id | name      | mail                    |\n+---------+-----------+-------------------------+\n| 1       | Winston   | winston@leetcode.com    |\n| 2       | Jonathan  | jonathanisgreat         |\n| 3       | Annabelle | bella-@leetcode.com     |\n| 4       | Sally     | sally.come@leetcode.com |\n| 5       | Marwan    | quarz#2020@leetcode.com |\n| 6       | David     | david69@gmail.com       |\n| 7       | Shapiro   | .shapo@leetcode.com     |\n+---------+-----------+-------------------------+\nOutput:\n+---------+-----------+-------------------------+\n| user_id | name      | mail                    |\n+---------+-----------+-------------------------+\n| 1       | Winston   | winston@leetcode.com    |\n| 3       | Annabelle | bella-@leetcode.com     |\n| 4       | Sally     | sally.come@leetcode.com |\n+---------+-----------+-------------------------+\nExplanation:\nThe mail of user 2 doesn't have a domain.\nThe mail of user 5 has # sign which is not allowed.\nThe mail of user 6 doesn't have leetcode as domain.\nThe mail of user 7 starts with a period."
		],
		constraints: [
			"No constraints provided for this database problem"
		],
		solutions: [
			"Use REGEXP to match email pattern",
			"Check that prefix starts with letter and contains only allowed characters",
			"Check that domain is exactly '@leetcode.com'"
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/find-users-with-valid-e-mails/",
		tags: ["database", "sql", "regex"]
	},
	{
		id: 1518,
		title: "Water Bottles",
		difficulty: "Easy",
		category: "Math",
		algorithms: ["Math", "Simulation"],
		description: "Given numBottles full water bottles, you can exchange numExchange empty water bottles for one full water bottle. The operation of drinking a full water bottle turns it into an empty bottle. Return the maximum number of water bottles you can drink.",
		examples: [
			"Input: numBottles = 9, numExchange = 3\nOutput: 13\nExplanation: You can exchange 3 empty bottles to get 1 full water bottle.\nNumber of water bottles you can drink: 9 + 3 + 1 = 13.",
			"Input: numBottles = 15, numExchange = 4\nOutput: 19\nExplanation: You can exchange 4 empty bottles to get 1 full water bottle.\nNumber of water bottles you can drink: 15 + 3 + 1 = 19.",
			"Input: numBottles = 5, numExchange = 5\nOutput: 6",
			"Input: numBottles = 2, numExchange = 3\nOutput: 2"
		],
		constraints: [
			"1 <= numBottles <= 100",
			"2 <= numExchange <= 100"
		],
		solutions: [
			"Simulate the process step by step",
			"Keep track of empty bottles and exchange them for full ones",
			"Continue until no more exchanges are possible"
		],
		timeComplexity: "O(log N)",
		spaceComplexity: "O(1)",
		leetcodeUrl: "https://leetcode.com/problems/water-bottles/",
		tags: ["math", "simulation"]
	},
	{
		id: 1519,
		title: "Number of Nodes in the Sub-Tree With the Same Label",
		difficulty: "Medium",
		category: "Tree",
		algorithms: ["Tree", "DFS"],
		description: "You are given a tree (i.e. a connected, undirected graph that has no cycles) consisting of n nodes numbered from 0 to n - 1 and exactly n - 1 edges. The root of the tree is the node 0, and each node of the tree has a label which is given as a 0-indexed integer array labels (i.e., the ith node has the label labels[i]). The edges array is given on the form edges[i] = [ai, bi], which means there is an edge between nodes ai and bi in the tree. Return an array ans of size n where ans[i] is the number of nodes in the subtree of the ith node which have the same label as node i. A subtree of a tree T is the tree consisting of a node in T and all of its descendant nodes.",
		examples: [
			"Input: n = 7, edges = [[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]], labels = \"abaedcd\"\nOutput: [2,1,1,1,1,1,1]\nExplanation: Node 0 has label 'a' and its sub-tree has node 2 with label 'a' as well, thus the answer is 2. Notice that any node is part of its sub-tree.\nNode 1 has a label 'b'. The sub-tree of node 1 contains nodes 1,4 and 5, as nodes 4 and 5 have different labels than node 1, the answer is just 1 (the node itself).",
			"Input: n = 4, edges = [[0,1],[1,2],[0,3]], labels = \"bbbb\"\nOutput: [4,2,1,1]\nExplanation: The sub-tree of node 2 contains only node 2, so the answer is 1.\nThe sub-tree of node 3 contains only node 3, so the answer is 1.\nThe sub-tree of node 1 contains nodes 1 and 2, both have label 'b', so the answer is 2.\nThe sub-tree of node 0 contains nodes 0,1,2 and 3, all with label 'b', so the answer is 4.",
			"Input: n = 5, edges = [[0,1],[0,2],[1,3],[0,4]], labels = \"aabab\"\nOutput: [3,2,1,1,1]"
		],
		constraints: [
			"1 <= n <= 10^5",
			"edges.length == n - 1",
			"edges[i].length == 2",
			"0 <= ai, bi < n",
			"ai != bi",
			"labels.length == n",
			"labels is consisting of only of lowercase English letters."
		],
		solutions: [
			"Use DFS to traverse the tree",
			"For each node, count nodes with same label in its subtree",
			"Use a frequency array to track counts"
		],
		timeComplexity: "O(N)",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/number-of-nodes-in-the-sub-tree-with-the-same-label/",
		tags: ["tree", "dfs"]
	},
	{
		id: 1520,
		title: "Maximum Number of Non-Overlapping Substrings",
		difficulty: "Hard",
		category: "String",
		algorithms: ["Greedy", "String"],
		description: "Given a string s of lowercase letters, you need to find the maximum number of non-empty substrings of s that meet the following conditions: The substrings are non-overlapping, that is for any two substrings s[i..j] and s[k..l], either j < k or i > l must be true. A substring that contains a certain character c must also contain all occurrences of c in s. Return the maximum number of substrings that meet the given conditions. Notice that you can return the substrings in any order.",
		examples: [
			"Input: s = \"adefaddaccc\"\nOutput: 2\nExplanation: The following are all the possible substrings that meet the conditions:\n[\n  \"adefaddaccc\"\n  \"adefadda\",\n  \"ef\",\n  \"ccc\",\n]\nIf we choose the first string, we cannot choose anything else and we'd get only 1. If we choose \"adefadda\", we are left with \"ccc\" which is the only one that doesn't overlap, thus obtaining 2 substrings. Notice also, that it's not optimal to choose \"ef\" since it can overlap with the first answer. Furthermore, notice that overlapping substrings cannot be chosen even if they conform to the second rule.",
			"Input: s = \"abbaccd\"\nOutput: 2\nExplanation: The following are all the possible substrings that meet the conditions:\n[\n  \"abbaccd\",\n  \"bb\",\n  \"cc\",\n]\nThe answer is 2 since choosing \"bb\" and \"cc\" will result in the maximum number of non-overlapping substrings."
		],
		constraints: [
			"1 <= s.length <= 10^5",
			"s only contains lowercase English letters."
		],
		solutions: [
			"Find all valid substrings that contain all occurrences of their characters",
			"Use greedy approach to select non-overlapping substrings",
			"Sort by end position and select earliest ending valid substring"
		],
		timeComplexity: "O(N^2)",
		spaceComplexity: "O(N)",
		leetcodeUrl: "https://leetcode.com/problems/maximum-number-of-non-overlapping-substrings/",
		tags: ["string", "greedy"]
	}
	// ... continuing with more problems from 1501-2000
];
