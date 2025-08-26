import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
	try {
		const supabase = await createClient();

		// Advanced problems from batch3 (problems 1001-1500)
		const batch3Problems = [
			// Advanced Dynamic Programming Problems
			{
				title: "Minimum Cost to Merge Stones",
				difficulty: "Hard",
				category: "Dynamic Programming",
				description:
					"There are N piles of stones arranged in a row. The i-th pile has stones[i] stones. A move consists of merging exactly K consecutive piles into one pile.",
				examples: JSON.stringify([
					{
						input: "stones = [3,2,4,1], K = 2",
						output: "20",
						explanation:
							"We start with [3, 2, 4, 1]. We merge [3, 2] for a cost of 5, and we are left with [5, 4, 1].",
					},
					{
						input: "stones = [3,2,4,1], K = 3",
						output: "-1",
						explanation:
							"After any merge operation, there are 2 piles left, and we can't merge anymore.",
					},
				]),
				constraints: JSON.stringify([
					"1 <= stones.length <= 30",
					"2 <= K <= 30",
					"1 <= stones[i] <= 100",
				]),
				solutions: JSON.stringify([
					"Array",
					"Dynamic Programming",
					"Memoization",
				]),
				leetcodeUrl:
					"https://leetcode.com/problems/minimum-cost-to-merge-stones/",
			},
			{
				title: "Distinct Subsequences II",
				difficulty: "Hard",
				category: "Dynamic Programming",
				description:
					"Given a string S, count the number of distinct, non-empty subsequences of S.",
				examples: JSON.stringify([
					{
						input: 'S = "abc"',
						output: "7",
						explanation:
							'The 7 distinct subsequences are "a", "b", "c", "ab", "ac", "bc", and "abc".',
					},
					{
						input: 'S = "aba"',
						output: "6",
						explanation:
							'The 6 distinct subsequences are "a", "b", "ab", "ba", "aa", and "aba".',
					},
				]),
				constraints: JSON.stringify([
					"1 <= S.length <= 2000",
					"S consists of lowercase English letters.",
				]),
				solutions: JSON.stringify(["String", "Dynamic Programming"]),
				leetcodeUrl: "https://leetcode.com/problems/distinct-subsequences-ii/",
			},
			{
				title: "Minimum Number of Refueling Stops",
				difficulty: "Hard",
				category: "Dynamic Programming",
				description:
					"A car travels from a starting position to a destination which is target miles east of the starting position.",
				examples: JSON.stringify([
					{
						input: "target = 1, startFuel = 1, stations = []",
						output: "0",
						explanation: "We can reach the target without refueling.",
					},
					{
						input: "target = 100, startFuel = 1, stations = [[10,100]]",
						output: "-1",
						explanation: "We can't even reach the first gas station.",
					},
				]),
				constraints: JSON.stringify([
					"1 <= target, startFuel, fueli <= 109",
					"0 <= stations.length <= 500",
					"0 <= positioni < positioni+1 < target",
				]),
				solutions: JSON.stringify(["Array", "Dynamic Programming", "Heap"]),
				leetcodeUrl:
					"https://leetcode.com/problems/minimum-number-of-refueling-stops/",
			},

			// Advanced Graph Problems
			{
				title: "Reachable Nodes In Subdivided Graph",
				difficulty: "Hard",
				category: "Graph",
				description:
					'You are given an undirected graph (the "original graph") with n nodes labeled from 0 to n - 1.',
				examples: JSON.stringify([
					{
						input: "edges = [[0,1,10],[0,2,1],[1,2,2]], maxMoves = 6, n = 3",
						output: "13",
						explanation: "The edge subdivisions are shown in the figure above.",
					},
					{
						input:
							"edges = [[0,1,4],[1,2,6],[0,2,8],[1,3,1]], maxMoves = 10, n = 4",
						output: "23",
						explanation: "The edge subdivisions are shown in the figure above.",
					},
				]),
				constraints: JSON.stringify([
					"0 <= edges.length <= min(n * (n - 1) / 2, 104)",
					"edges[i].length == 3",
					"0 <= ui < vi < n",
					"There are no multiple edges in the original graph.",
				]),
				solutions: JSON.stringify(["Graph", "Heap", "Shortest Path"]),
				leetcodeUrl:
					"https://leetcode.com/problems/reachable-nodes-in-subdivided-graph/",
			},
			{
				title: "Minimum Cost to Connect Sticks",
				difficulty: "Medium",
				category: "Graph",
				description:
					"You have some number of sticks with positive integer lengths. These lengths are given as an array sticks.",
				examples: JSON.stringify([
					{
						input: "sticks = [2,4,3]",
						output: "14",
						explanation:
							"You start with sticks = [2,4,3]. Combine sticks 2 and 3 for a cost of 2 + 3 = 5.",
					},
					{
						input: "sticks = [1,8,3,5]",
						output: "30",
						explanation:
							"You start with sticks = [1,8,3,5]. Combine sticks 1 and 3 for a cost of 1 + 3 = 4.",
					},
				]),
				constraints: JSON.stringify([
					"1 <= sticks.length <= 104",
					"1 <= sticks[i] <= 104",
				]),
				solutions: JSON.stringify(["Array", "Greedy", "Heap"]),
				leetcodeUrl:
					"https://leetcode.com/problems/minimum-cost-to-connect-sticks/",
			},
			{
				title: "Network Delay Time",
				difficulty: "Medium",
				category: "Graph",
				description:
					"You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges.",
				examples: JSON.stringify([
					{
						input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
						output: "2",
						explanation: "The signal takes 2 time units to reach all nodes.",
					},
					{
						input: "times = [[1,2,1]], n = 2, k = 1",
						output: "1",
						explanation: "The signal takes 1 time unit to reach node 2.",
					},
				]),
				constraints: JSON.stringify([
					"1 <= k <= n <= 100",
					"1 <= times.length <= 6000",
					"times[i].length == 3",
				]),
				solutions: JSON.stringify(["Graph", "Heap", "Shortest Path"]),
				leetcodeUrl: "https://leetcode.com/problems/network-delay-time/",
			},

			// Advanced String Problems
			{
				title: "Longest Duplicate Substring",
				difficulty: "Hard",
				category: "String",
				description:
					"Given a string s, consider all duplicated substrings: (contiguous) substrings of s that occur 2 or more times.",
				examples: JSON.stringify([
					{
						input: 's = "banana"',
						output: '"ana"',
						explanation: '"ana" is the longest duplicated substring.',
					},
					{
						input: 's = "abcd"',
						output: '""',
						explanation: "No duplicated substring exists.",
					},
				]),
				constraints: JSON.stringify([
					"2 <= s.length <= 3 * 104",
					"s consists of lowercase English letters.",
				]),
				solutions: JSON.stringify(["String", "Binary Search", "Rolling Hash"]),
				leetcodeUrl:
					"https://leetcode.com/problems/longest-duplicate-substring/",
			},
			{
				title: "Valid Palindrome III",
				difficulty: "Hard",
				category: "String",
				description:
					"Given a string s and an integer k, return true if s is a k-palindrome. A string is k-palindrome if it can be transformed into a palindrome by removing at most k characters from it.",
				examples: JSON.stringify([
					{
						input: 's = "abcdeca", k = 2',
						output: "true",
						explanation: "Remove 'b' and 'e' characters.",
					},
					{
						input: 's = "abbababa", k = 1',
						output: "true",
						explanation: "Remove 'b' at index 1.",
					},
				]),
				constraints: JSON.stringify([
					"1 <= s.length <= 1000",
					"s consists of only lowercase English letters.",
					"0 <= k <= s.length",
				]),
				solutions: JSON.stringify(["String", "Dynamic Programming"]),
				leetcodeUrl: "https://leetcode.com/problems/valid-palindrome-iii/",
			},
			{
				title: "Shortest Common Supersequence",
				difficulty: "Hard",
				category: "String",
				description:
					"Given two strings str1 and str2, return the shortest string that has both str1 and str2 as subsequences.",
				examples: JSON.stringify([
					{
						input: 'str1 = "abac", str2 = "cab"',
						output: '"cabac"',
						explanation: 'str1 = "abac" is a subsequence of "cabac".',
					},
					{
						input: 'str1 = "aaaaaaaa", str2 = "aaaaaaaa"',
						output: '"aaaaaaaa"',
						explanation: "The strings are equal.",
					},
				]),
				constraints: JSON.stringify([
					"1 <= str1.length, str2.length <= 1000",
					"str1 and str2 consist of lowercase English letters.",
				]),
				solutions: JSON.stringify(["String", "Dynamic Programming"]),
				leetcodeUrl:
					"https://leetcode.com/problems/shortest-common-supersequence/",
			},

			// Advanced Array Problems
			{
				title: "Maximum Sum of Two Non-Overlapping Subarrays",
				difficulty: "Medium",
				category: "Array",
				description:
					"Given an array A of non-negative integers, return the maximum sum of elements in two non-overlapping (contiguous) subarrays.",
				examples: JSON.stringify([
					{
						input: "A = [0,6,5,2,2,5,1,9,4], L = 1, M = 2",
						output: "20",
						explanation:
							"One choice of subarrays is [9] with length 1, and [6,5] with length 2.",
					},
					{
						input: "A = [3,8,1,3,2,1,8,9,0], L = 3, M = 2",
						output: "29",
						explanation:
							"One choice of subarrays is [3,8,1] with length 3, and [8,9] with length 2.",
					},
				]),
				constraints: JSON.stringify([
					"L >= 1, M >= 1",
					"L + M <= A.length <= 1000",
					"0 <= A[i] <= 1000",
				]),
				solutions: JSON.stringify(["Array", "Dynamic Programming"]),
				leetcodeUrl:
					"https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/",
			},
			{
				title: "Stream of Characters",
				difficulty: "Hard",
				category: "Array",
				description:
					"Design an algorithm that accepts a stream of characters and checks if a suffix of these characters is a string of a given array of strings words.",
				examples: JSON.stringify([
					{
						input:
							'["StreamChecker", "query", "query", "query", "query", "query", "query", "query", "query", "query", "query", "query", "query"]\n[[["cd", "f", "kl"]], ["a"], ["b"], ["c"], ["d"], ["e"], ["f"], ["g"], ["h"], ["i"], ["j"], ["k"], ["l"]]',
						output:
							"[null, false, false, false, true, false, true, false, false, false, false, false, true]",
						explanation:
							'StreamChecker streamChecker = new StreamChecker(["cd", "f", "kl"]);',
					},
				]),
				constraints: JSON.stringify([
					"1 <= words.length <= 2000",
					"1 <= words[i].length <= 2000",
					"words[i] consists of lowercase English letters.",
					"letter is a lowercase English letter.",
					"At most 4 * 104 calls will be made to query.",
				]),
				solutions: JSON.stringify(["Array", "String", "Trie"]),
				leetcodeUrl: "https://leetcode.com/problems/stream-of-characters/",
			},
			{
				title: "Moving Stones Until Consecutive II",
				difficulty: "Medium",
				category: "Array",
				description:
					"On an infinite number line, the position of the i-th stone is given by stones[i].",
				examples: JSON.stringify([
					{
						input: "stones = [7,4,9]",
						output: "[1,2]",
						explanation:
							"We can move the 4 -> 8 for one move to finish the game.",
					},
					{
						input: "stones = [6,5,4,3,10]",
						output: "[2,3]",
						explanation:
							"We can move the 3 -> 8 then 10 -> 7 to make the stones consecutive.",
					},
				]),
				constraints: JSON.stringify([
					"3 <= stones.length <= 10^4",
					"1 <= stones[i] <= 10^9",
					"stones[i] have distinct values.",
				]),
				solutions: JSON.stringify(["Array", "Sliding Window"]),
				leetcodeUrl:
					"https://leetcode.com/problems/moving-stones-until-consecutive-ii/",
			},

			// Advanced Tree Problems
			{
				title: "Binary Tree Cameras",
				difficulty: "Hard",
				category: "Tree",
				description:
					"Given a binary tree, we install cameras on the nodes of the tree. Each camera at a node can monitor its parent, itself, and its immediate children.",
				examples: JSON.stringify([
					{
						input: "root = [0,0,null,0,0]",
						output: "1",
						explanation:
							"One camera is sufficient to monitor all nodes of the tree.",
					},
					{
						input: "root = [0,0,null,0,null,0,null,null,0]",
						output: "2",
						explanation:
							"At least two cameras are needed to monitor all nodes of the tree.",
					},
				]),
				constraints: JSON.stringify([
					"The number of nodes in the tree is in the range [1, 1000].",
					"Node.val == 0",
				]),
				solutions: JSON.stringify(["Tree", "Dynamic Programming", "Greedy"]),
				leetcodeUrl: "https://leetcode.com/problems/binary-tree-cameras/",
			},
			{
				title: "Distribute Coins in Binary Tree",
				difficulty: "Medium",
				category: "Tree",
				description:
					"You are given the root of a binary tree with n nodes where each node in the tree has node.val coins.",
				examples: JSON.stringify([
					{
						input: "root = [3,0,0]",
						output: "2",
						explanation:
							"From the root of the tree, we move one coin to its left child, and one coin to its right child.",
					},
					{
						input: "root = [0,3,0]",
						output: "3",
						explanation:
							"From the left child of the root, we move two coins to the root [taking two moves].",
					},
				]),
				constraints: JSON.stringify([
					"The number of nodes in the tree is n.",
					"1 <= n <= 100",
					"0 <= Node.val <= n",
					"The sum of Node.val is n.",
				]),
				solutions: JSON.stringify(["Tree", "DFS"]),
				leetcodeUrl:
					"https://leetcode.com/problems/distribute-coins-in-binary-tree/",
			},
			{
				title: "Binary Tree Coloring Game",
				difficulty: "Medium",
				category: "Tree",
				description:
					"Two players play a turn based game on a binary tree. We are given the root of this binary tree, and the number of nodes n in the tree.",
				examples: JSON.stringify([
					{
						input: "root = [1,2,3,4,5,6,7,8,9,10,11], n = 11, x = 3",
						output: "true",
						explanation:
							"The second player can choose the node with value 2 and win the game.",
					},
					{
						input: "root = [1,2,3], n = 3, x = 1",
						output: "false",
						explanation: "The second player cannot win the game.",
					},
				]),
				constraints: JSON.stringify([
					"root is the root of a binary tree with n nodes and distinct values from 1 to n.",
					"n is odd.",
					"1 <= x <= n <= 100",
				]),
				solutions: JSON.stringify(["Tree", "DFS"]),
				leetcodeUrl: "https://leetcode.com/problems/binary-tree-coloring-game/",
			},

			// Advanced Design Problems
			{
				title: "Design Underground System",
				difficulty: "Medium",
				category: "Design",
				description:
					"An underground railway system is keeping track of customer travel times between different stations.",
				examples: JSON.stringify([
					{
						input:
							'["UndergroundSystem","checkIn","checkIn","checkOut","getAverageTime","checkIn","checkOut","getAverageTime"]\n[[],[45,"Leyton",3],[32,"Paradise",8],[45,"Waterloo",15],[45,"Leyton","Waterloo"],[27,"Leyton",10],[27,"Waterloo",20],[27,"Leyton","Waterloo"]]',
						output: "[null,null,null,null,14.00000,null,null,11.00000]",
						explanation:
							"UndergroundSystem undergroundSystem = new UndergroundSystem();",
					},
				]),
				constraints: JSON.stringify([
					"1 <= id, t <= 106",
					"1 <= stationName.length, startStation.length, endStation.length <= 10",
					"All strings consist of uppercase and lowercase English letters and digits.",
					"There will be at most 2 * 104 calls in total to checkIn, checkOut, and getAverageTime.",
					"Answers within 10-5 of the actual value will be accepted as correct.",
				]),
				solutions: JSON.stringify(["Hash Table", "Design"]),
				leetcodeUrl: "https://leetcode.com/problems/design-underground-system/",
			},
			{
				title: "Design Browser History",
				difficulty: "Medium",
				category: "Design",
				description:
					"You have a browser of one tab where you start on the homepage and you can visit another url.",
				examples: JSON.stringify([
					{
						input:
							'["BrowserHistory","visit","visit","visit","back","back","forward","visit","forward","back","back"]\n[["leetcode.com"],["google.com"],["facebook.com"],["youtube.com"],[1],[1],[1],["linkedin.com"],[2],[2],[7]]',
						output:
							'[null,null,null,null,"facebook.com","google.com","facebook.com",null,"linkedin.com","google.com","leetcode.com"]',
						explanation:
							'BrowserHistory browserHistory = new BrowserHistory("leetcode.com");',
					},
				]),
				constraints: JSON.stringify([
					"1 <= homepage.length <= 20",
					"1 <= url.length <= 20",
					"1 <= steps <= 100",
					"homepage and url consist of '.' or lowercase English letters.",
					"At most 5000 calls will be made to visit, back, and forward.",
				]),
				solutions: JSON.stringify(["Array", "Design"]),
				leetcodeUrl: "https://leetcode.com/problems/design-browser-history/",
			},
			{
				title: "Design a Stack With Increment Operation",
				difficulty: "Medium",
				category: "Design",
				description: "Design a stack which supports the following operations.",
				examples: JSON.stringify([
					{
						input:
							'["CustomStack","push","push","pop","push","push","push","increment","increment","pop","pop","pop","pop"]\n[[3],[1],[2],[],[2],[3],[4],[5,100],[2,100],[],[],[],[]]',
						output:
							"[null,null,null,2,null,null,null,null,null,103,202,201,-1]",
						explanation: "CustomStack customStack = new CustomStack(3);",
					},
				]),
				constraints: JSON.stringify([
					"1 <= maxSize <= 1000",
					"1 <= x <= 1000",
					"1 <= k <= 1000",
					"0 <= val <= 100",
					"At most 1000 calls will be made to each method of increment, push and pop each separately.",
				]),
				solutions: JSON.stringify(["Stack", "Design"]),
				leetcodeUrl:
					"https://leetcode.com/problems/design-a-stack-with-increment-operation/",
			},

			// Advanced Database Problems
			{
				title: "Game Play Analysis V",
				difficulty: "Hard",
				category: "Database",
				description:
					"Write an SQL query that reports for each player and date, how many games played so far by the player.",
				examples: JSON.stringify([
					{
						input:
							"Activity table: [[1, 1, 2019-01-01, 2], [1, 2, 2019-01-02, 2], [2, 1, 2019-01-03, 3], [2, 3, 2019-01-04, 1]]",
						output:
							"[[1, 2019-01-01, 1], [1, 2019-01-02, 2], [2, 2019-01-03, 1], [2, 2019-01-04, 2]]",
						explanation: "Games played so far by each player on each date.",
					},
				]),
				constraints: JSON.stringify([
					"Use window functions with PARTITION BY.",
					"Handle cumulative sum calculations.",
				]),
				solutions: JSON.stringify(["Database", "SQL", "Window Function"]),
				leetcodeUrl: "https://leetcode.com/problems/game-play-analysis-v/",
			},
			{
				title: "Report Contiguous Dates",
				difficulty: "Hard",
				category: "Database",
				description:
					"Write an SQL query to generate a report of period_state for each continuous interval of days.",
				examples: JSON.stringify([
					{
						input:
							"Failed table: [[2018-12-28, failed], [2018-12-29, failed], [2019-01-04, failed], [2019-01-05, failed]]\nSucceeded table: [[2018-12-30, succeeded], [2018-12-31, succeeded], [2019-01-01, succeeded], [2019-01-02, succeeded], [2019-01-03, succeeded], [2019-01-06, succeeded]]",
						output:
							"[[2018-12-28, 2018-12-29, failed], [2018-12-30, 2019-01-03, succeeded], [2019-01-04, 2019-01-05, failed], [2019-01-06, 2019-01-06, succeeded]]",
						explanation: "Continuous intervals of success and failure states.",
					},
				]),
				constraints: JSON.stringify([
					"Use window functions and date arithmetic.",
					"Handle continuous date ranges.",
				]),
				solutions: JSON.stringify(["Database", "SQL", "Window Function"]),
				leetcodeUrl: "https://leetcode.com/problems/report-contiguous-dates/",
			},
			{
				title: "User Purchase Platform",
				difficulty: "Hard",
				category: "Database",
				description:
					"Write an SQL query to find the number of users and the total amount of money they have spent.",
				examples: JSON.stringify([
					{
						input:
							"Spending table: [[1, 2019-07-01, mobile, 100], [1, 2019-07-02, desktop, 100], [2, 2019-07-01, desktop, 100], [2, 2019-07-02, desktop, 100], [3, 2019-07-01, mobile, 100], [3, 2019-07-02, mobile, 100]]",
						output:
							"[[2019-07-01, desktop, 1, 100], [2019-07-01, mobile, 1, 100], [2019-07-02, desktop, 2, 200], [2019-07-02, mobile, 1, 100]]",
						explanation: "User count and total spending per platform per date.",
					},
				]),
				constraints: JSON.stringify([
					"Use GROUP BY with multiple columns.",
					"Handle aggregation functions.",
				]),
				solutions: JSON.stringify(["Database", "SQL", "Group By"]),
				leetcodeUrl: "https://leetcode.com/problems/user-purchase-platform/",
			},

			// Advanced Math Problems
			{
				title: "Numbers With Repeated Digits",
				difficulty: "Hard",
				category: "Math",
				description:
					"Given a positive integer n, return the number of positive integers less than or equal to n that have at least one repeated digit.",
				examples: JSON.stringify([
					{
						input: "n = 20",
						output: "1",
						explanation:
							"The only positive number less than or equal to 20 with at least one repeated digit is 11.",
					},
					{
						input: "n = 100",
						output: "10",
						explanation:
							"The positive numbers less than or equal to 100 with at least one repeated digit are 11,22,33,44,55,66,77,88,99, and 100.",
					},
				]),
				constraints: JSON.stringify(["1 <= n <= 109"]),
				solutions: JSON.stringify(["Math", "Dynamic Programming"]),
				leetcodeUrl:
					"https://leetcode.com/problems/numbers-with-repeated-digits/",
			},
			{
				title: "Valid Permutations for DI Sequence",
				difficulty: "Hard",
				category: "Math",
				description:
					"We are given S, a length n string of characters from the set {'D', 'I'}. (These letters stand for \"decreasing\" and \"increasing\".)",
				examples: JSON.stringify([
					{
						input: 'S = "DID"',
						output: "5",
						explanation:
							"The 5 valid permutations of [0,1,2,3] are: [1,0,3,2], [2,0,3,1], [2,1,3,0], [3,0,2,1], [3,1,2,0]",
					},
				]),
				constraints: JSON.stringify([
					"1 <= S.length <= 200",
					"S consists only of characters from the set {'D', 'I'}.",
				]),
				solutions: JSON.stringify(["Math", "Dynamic Programming"]),
				leetcodeUrl:
					"https://leetcode.com/problems/valid-permutations-for-di-sequence/",
			},
			{
				title: "Three Equal Parts",
				difficulty: "Hard",
				category: "Math",
				description:
					"You are given an array arr which consists of only zeros and ones, divide the array into three non-empty parts such that all of these parts represent the same binary value.",
				examples: JSON.stringify([
					{
						input: "arr = [1,0,1,0,1]",
						output: "[0,3]",
						explanation:
							"The first, second and third parts are: [1,0], [1,0], [1].",
					},
					{
						input: "arr = [1,1,0,1,1]",
						output: "[-1,-1]",
						explanation:
							"In this case, it is not possible to divide the array into three parts with equal binary values.",
					},
				]),
				constraints: JSON.stringify([
					"3 <= arr.length <= 3 * 104",
					"arr[i] is 0 or 1",
				]),
				solutions: JSON.stringify(["Array", "Math"]),
				leetcodeUrl: "https://leetcode.com/problems/three-equal-parts/",
			},
		];

		// Insert all batch3 problems
		for (const problem of batch3Problems) {
			await supabase.from("problems").upsert(problem, { onConflict: "title" });
		}

		return NextResponse.json({
			success: true,
			message: `Successfully seeded ${batch3Problems.length} advanced problems from batch3 (problems 1001-1500) covering complex algorithmic concepts including:
      - Advanced Dynamic Programming (Minimum Cost to Merge Stones, Distinct Subsequences II)
      - Graph Algorithms (Reachable Nodes, Network Delay Time)
      - String Processing (Longest Duplicate Substring, Valid Palindrome III)
      - Array Operations (Non-overlapping Subarrays, Stream of Characters)
      - Tree Algorithms (Binary Tree Cameras, Distribute Coins)
      - System Design (Underground System, Browser History)
      - Database (Game Play Analysis V, Report Contiguous Dates)
      - Mathematical Algorithms (Numbers With Repeated Digits, DI Sequence)`,
		});
	} catch (error) {
		console.error("Batch3 problem seeding error:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to seed batch3 problems",
			},
			{ status: 500 },
		);
	}
}
