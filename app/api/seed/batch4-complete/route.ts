import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
	try {
		const supabase = await createClient();

		const batch4Problems = [
			{
				id: 1501,
				title: "Countries You Can Safely Invest In",
				difficulty: "Medium",
				category: "Database",
				algorithms: ["SQL", "Database"],
				description:
					"A country is big if it has an area of bigger than 3 million square km or a population of more than 25 million. Write a SQL solution to output big countries' name, population and area.",
				leetcodeUrl:
					"https://leetcode.com/problems/countries-you-can-safely-invest-in/",
			},
			{
				id: 1502,
				title: "Can Make Arithmetic Progression From Sequence",
				difficulty: "Easy",
				category: "Array",
				algorithms: ["Sorting", "Math"],
				description:
					"A sequence of numbers is called an arithmetic progression if the difference between any two consecutive elements is the same. Given an array of numbers arr, return true if the array can be rearranged to form an arithmetic progression. Otherwise, return false.",
				leetcodeUrl:
					"https://leetcode.com/problems/can-make-arithmetic-progression-from-sequence/",
			},
			{
				id: 1503,
				title: "Last Moment Before All Ants Fall Out of a Plank",
				difficulty: "Medium",
				category: "Array",
				algorithms: ["Simulation", "Math"],
				description:
					"We have a wooden plank of the length n units. Some ants are walking on the plank, each ant moves with speed 1 unit per second. Some of the ants move to the left, the other move to the right. When two ants moving in two different directions meet at some point, they change their directions and continue moving again. Assume that changing directions doesn't take any additional time. When an ant reaches one end of the plank at a time t, it falls out of the plank immediately. Given an integer n and two integer arrays left and right, the positions of the ants moving left and right, return the last moment when the last ant(s) fall out of the plank.",
				leetcodeUrl:
					"https://leetcode.com/problems/last-moment-before-all-ants-fall-out-of-a-plank/",
			},
			{
				id: 1504,
				title: "Count Submatrices With All Ones",
				difficulty: "Medium",
				category: "Array",
				algorithms: ["Dynamic Programming", "Matrix"],
				description:
					"Given a rows * columns matrix mat of ones and zeros, return how many submatrices have all ones.",
				leetcodeUrl:
					"https://leetcode.com/problems/count-submatrices-with-all-ones/",
			},
			{
				id: 1505,
				title:
					"Minimum Possible Integer After at Most K Adjacent Swaps On Digits",
				difficulty: "Hard",
				category: "String",
				algorithms: ["Greedy", "String"],
				description:
					"You are given a string num representing the digits of a very large integer and an integer k. You are allowed to swap any two adjacent digits of the integer at most k times. Return the minimum integer you can obtain also as a string.",
				leetcodeUrl:
					"https://leetcode.com/problems/minimum-possible-integer-after-at-most-k-adjacent-swaps-on-digits/",
			},
			{
				id: 1506,
				title: "Find Root of N-Ary Tree",
				difficulty: "Medium",
				category: "Tree",
				algorithms: ["Tree", "Hash Table"],
				description:
					"You are given all the nodes of an N-ary tree as an array of Node objects, where each node has a unique value. Return the root of the N-ary tree.",
				leetcodeUrl: "https://leetcode.com/problems/find-root-of-n-ary-tree/",
			},
			{
				id: 1507,
				title: "Reformat Date",
				difficulty: "Easy",
				category: "String",
				algorithms: ["String", "Parsing"],
				description:
					"Given a date string in the form Day Month Year, where: Day is in the set {'1st', '2nd', '3rd', '4th', ..., '30th', '31st'}. Month is in the set {'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'}. Year is in the range [1900, 2100]. Convert the date string to the format YYYY-MM-DD.",
				leetcodeUrl: "https://leetcode.com/problems/reformat-date/",
			},
			{
				id: 1508,
				title: "Range Sum of Sorted Subarray Sums",
				difficulty: "Medium",
				category: "Array",
				algorithms: ["Array", "Sorting"],
				description:
					"You are given the array nums consisting of n positive integers. You computed the sum of all non-empty continuous subarrays from the array and then sorted them in non-decreasing order, creating a new array of n * (n + 1) / 2 numbers. Return the sum of the numbers from index left to index right (indexed from 1), inclusive, in the new array.",
				leetcodeUrl:
					"https://leetcode.com/problems/range-sum-of-sorted-subarray-sums/",
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
				leetcodeUrl:
					"https://leetcode.com/problems/minimum-difference-between-largest-and-smallest-value-in-three-moves/",
			},
			{
				id: 1510,
				title: "Stone Game IV",
				difficulty: "Hard",
				category: "Dynamic Programming",
				algorithms: ["Dynamic Programming", "Game Theory"],
				description:
					"Alice and Bob take turns playing a game, with Alice starting first. Initially, there are n stones in a pile. On each player's turn, that player makes a move consisting of removing any non-zero square number of stones in the pile. Also, if a player cannot make a move, he/she loses the game. Given a positive integer n, return true if and only if Alice wins the game otherwise return false, assuming both players play optimally.",
				leetcodeUrl: "https://leetcode.com/problems/stone-game-iv/",
			},
			{
				id: 1511,
				title: "Customer Order Frequency",
				difficulty: "Easy",
				category: "Database",
				algorithms: ["SQL", "Database"],
				description:
					"Write a SQL query to find the customer_id and customer_name of customers who bought products 'A' and 'B' but didn't buy product 'C' since we want to recommend them buy product 'C'.",
				leetcodeUrl: "https://leetcode.com/problems/customer-order-frequency/",
			},
			{
				id: 1512,
				title: "Number of Good Pairs",
				difficulty: "Easy",
				category: "Array",
				algorithms: ["Hash Table", "Array"],
				description:
					"Given an array of integers nums, return the number of good pairs. A pair (i, j) is called good if nums[i] == nums[j] and i < j.",
				leetcodeUrl: "https://leetcode.com/problems/number-of-good-pairs/",
			},
			{
				id: 1513,
				title: "Number of Substrings With Only 1s",
				difficulty: "Medium",
				category: "String",
				algorithms: ["String", "Math"],
				description:
					"Given a binary string s, return the number of substrings with all characters 1's. Since the answer may be too large, return it modulo 10^9 + 7.",
				leetcodeUrl:
					"https://leetcode.com/problems/number-of-substrings-with-only-1s/",
			},
			{
				id: 1514,
				title: "Path with Maximum Probability",
				difficulty: "Medium",
				category: "Graph",
				algorithms: ["Dijkstra", "Graph"],
				description:
					"You are given an undirected weighted graph of n nodes (0-indexed), represented by an edge list where edges[i] = [a, b] is an undirected edge connecting the nodes a and b with a probability of success of traversing that edge succProb[i]. Given two nodes start and end, find the path with the maximum probability of success to go from start to end and return its success probability.",
				leetcodeUrl:
					"https://leetcode.com/problems/path-with-maximum-probability/",
			},
			{
				id: 1515,
				title: "Best Position for a Service Centre",
				difficulty: "Hard",
				category: "Math",
				algorithms: ["Math", "Geometry"],
				description:
					"A delivery company wants to build a new service centre in a new city. The company knows the positions of all the customers in this city on a 2D-Map and wants to build the new centre in a position such that the sum of the euclidean distances to all customers is minimum. Given an array positions where positions[i] = [xi, yi] is the position of the ith customer on the map, return the minimum sum of the euclidean distances to all customers.",
				leetcodeUrl:
					"https://leetcode.com/problems/best-position-for-a-service-centre/",
			},
			{
				id: 1516,
				title: "Move Sub-Tree of N-Ary Tree",
				difficulty: "Hard",
				category: "Tree",
				algorithms: ["Tree", "DFS"],
				description:
					"Given the root of an N-ary tree of unique values, and two nodes of the tree p and q. You should move the subtree of node p to become a direct child of node q. If p is already a direct child of q, don't change anything. Nodes p and q exist in the tree. Node p is not the root of the tree. Node p is not a descendant of node q.",
				leetcodeUrl:
					"https://leetcode.com/problems/move-sub-tree-of-n-ary-tree/",
			},
			{
				id: 1517,
				title: "Find Users With Valid E-Mails",
				difficulty: "Easy",
				category: "Database",
				algorithms: ["SQL", "Database"],
				description:
					"Write a solution to find the users who have valid emails. A valid e-mail has a prefix name and a domain where: The prefix name is a string that may contain letters (upper or lower case), digits, underscore '_', period '.', and/or dash '-'. The prefix name must start with a letter. The domain is '@leetcode.com'.",
				leetcodeUrl:
					"https://leetcode.com/problems/find-users-with-valid-e-mails/",
			},
			{
				id: 1518,
				title: "Water Bottles",
				difficulty: "Easy",
				category: "Math",
				algorithms: ["Math", "Simulation"],
				description:
					"Given numBottles full water bottles, you can exchange numExchange empty water bottles for one full water bottle. The operation of drinking a full water bottle turns it into an empty bottle. Return the maximum number of water bottles you can drink.",
				leetcodeUrl: "https://leetcode.com/problems/water-bottles/",
			},
			{
				id: 1519,
				title: "Number of Nodes in the Sub-Tree With the Same Label",
				difficulty: "Medium",
				category: "Tree",
				algorithms: ["Tree", "DFS"],
				description:
					"You are given a tree (i.e. a connected, undirected graph that has no cycles) consisting of n nodes numbered from 0 to n - 1 and exactly n - 1 edges. The root of the tree is the node 0, and each node of the tree has a label which is given as a string labels (i.e. The node with the number i has the label labels[i]). The edges array is given on the form edges[i] = [ai, bi], which means there is an edge between nodes ai and bi in the tree. Return an array of size n where ans[i] is the number of nodes in the subtree of the ith node which have the same label as node i.",
				leetcodeUrl:
					"https://leetcode.com/problems/number-of-nodes-in-the-sub-tree-with-the-same-label/",
			},
			{
				id: 1520,
				title: "Maximum Number of Non-Overlapping Substrings",
				difficulty: "Hard",
				category: "String",
				algorithms: ["Greedy", "String"],
				description:
					"Given a string s of lowercase letters, you need to find the maximum number of non-empty substrings of s that meet the following conditions: The substrings are non-overlapping, that is for any two substrings s[i..j] and s[k..l], either j < k or i > l is true. A substring that contains a certain character c must also contain all occurrences of c. Find the maximum number of substrings that meet the above conditions.",
				leetcodeUrl:
					"https://leetcode.com/problems/maximum-number-of-non-overlapping-substrings/",
			},
			{
				id: 1521,
				title: "Find a Value of a Mysterious Function Closest to Target",
				difficulty: "Hard",
				category: "Array",
				algorithms: ["Binary Search", "Bit Manipulation"],
				description:
					"Winston was given the above mysterious function func. He has an integer array arr and an integer target and he wants to find the values l and r that make the value |func(arr, l, r) - target| minimum possible. Return the minimum possible value of |func(arr, l, r) - target|. Notice that func should be called with the values l and r where 0 <= l, r < arr.length.",
				leetcodeUrl:
					"https://leetcode.com/problems/find-a-value-of-a-mysterious-function-closest-to-target/",
			},
			{
				id: 1522,
				title: "Diameter of N-Ary Tree",
				difficulty: "Medium",
				category: "Tree",
				algorithms: ["Tree", "DFS"],
				description:
					"Given a root of an N-ary tree, you need to compute the length of the diameter of the tree. The diameter of an N-ary tree is the length of the longest path between any two nodes in the tree. This path may or may not pass through the root.",
				leetcodeUrl: "https://leetcode.com/problems/diameter-of-n-ary-tree/",
			},
			{
				id: 1523,
				title: "Count Odd Numbers in an Interval Range",
				difficulty: "Easy",
				category: "Math",
				algorithms: ["Math"],
				description:
					"Given two non-negative integers low and high. Return the count of odd numbers between low and high (inclusive).",
				leetcodeUrl:
					"https://leetcode.com/problems/count-odd-numbers-in-an-interval-range/",
			},
			{
				id: 1524,
				title: "Number of Sub-arrays With Odd Sum",
				difficulty: "Medium",
				category: "Array",
				algorithms: ["Array", "Math"],
				description:
					"Given an array of integers arr, return the number of subarrays with an odd sum. Since the answer can be very large, return it modulo 10^9 + 7.",
				leetcodeUrl:
					"https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum/",
			},
			{
				id: 1525,
				title: "Number of Good Ways to Split a String",
				difficulty: "Medium",
				category: "String",
				algorithms: ["String", "Hash Table"],
				description:
					"You are given a string s, a split is called good if you can split s into 2 non-empty strings p and q where its concatenation is equal to s and the number of distinct letters in p and q are the same. Return the number of good splits you can make in s.",
				leetcodeUrl:
					"https://leetcode.com/problems/number-of-good-ways-to-split-a-string/",
			},
			{
				id: 1526,
				title:
					"Minimum Number of Increments on Subarrays to Form a Target Array",
				difficulty: "Hard",
				category: "Array",
				algorithms: ["Array", "Greedy"],
				description:
					"You are given an integer array target. You have an integer array initial of the same size as target with all elements initially zeros. In one operation you can choose any subarray from initial and increment each value by one. Return the minimum number of operations to form a target array from initial.",
				leetcodeUrl:
					"https://leetcode.com/problems/minimum-number-of-increments-on-subarrays-to-form-a-target-array/",
			},
			{
				id: 1527,
				title: "Patients With a Condition",
				difficulty: "Easy",
				category: "Database",
				algorithms: ["SQL", "Database"],
				description:
					"Write a SQL query to report the patient_id, patient_name and conditions of the patients who have Type I Diabetes. Type I Diabetes always starts with DIAB1 prefix.",
				leetcodeUrl: "https://leetcode.com/problems/patients-with-a-condition/",
			},
			{
				id: 1528,
				title: "Shuffle String",
				difficulty: "Easy",
				category: "String",
				algorithms: ["String", "Array"],
				description:
					"You are given a string s and an integer array indices of the same length. The string s will be shuffled such that the character at the ith position moves to indices[i] in the shuffled string. Return the shuffled string.",
				leetcodeUrl: "https://leetcode.com/problems/shuffle-string/",
			},
			{
				id: 1529,
				title: "Minimum Suffix Flips",
				difficulty: "Medium",
				category: "String",
				algorithms: ["String", "Greedy"],
				description:
					"You are given a 0-indexed binary string target of length n. You have another binary string s of length n that is initially set to all zeros. You want to make s equal to target. In one operation, you can pick an index i where 0 <= i < n and flip all bits in the inclusive range [i, n - 1]. Flip means changing '0' to '1' and '1' to '0'. Return the minimum number of operations needed to make s equal to target.",
				leetcodeUrl: "https://leetcode.com/problems/minimum-suffix-flips/",
			},
			{
				id: 1530,
				title: "Number of Good Leaf Nodes Pairs",
				difficulty: "Medium",
				category: "Tree",
				algorithms: ["Tree", "DFS"],
				description:
					"You are given the root of a binary tree and an integer distance. A pair of two different leaf nodes of a binary tree is said to be good if the length of the shortest path between them is less than or equal to distance. Return the number of good leaf node pairs in the tree.",
				leetcodeUrl:
					"https://leetcode.com/problems/number-of-good-leaf-nodes-pairs/",
			},
			// Add more problems from batch4 as needed...
		];

		const { data, error } = await supabase.from("problems").upsert(
			batch4Problems.map((problem) => ({
				id: problem.id,
				title: problem.title,
				difficulty: problem.difficulty,
				category: problem.category,
				algorithms: problem.algorithms,
				description: problem.description,
				leetcodeUrl: problem.leetcodeUrl,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			})),
			{ onConflict: "id" },
		);

		if (error) {
			console.error("Error seeding batch4 problems:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({
			message: `Successfully seeded ${batch4Problems.length} batch4 problems`,
			count: batch4Problems.length,
		});
	} catch (error) {
		console.error("Error in batch4 seeding:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
