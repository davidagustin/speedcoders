import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    
    // First, seed all problems from batches 1-5
    const allProblems = [
      // Batch 1 problems (1-500) - adding more comprehensive set
      { id: 1, title: "Two Sum", difficulty: "Easy", category: "Array", algorithms: ["Hash Table", "Two Pointers"], description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", leetcodeUrl: "https://leetcode.com/problems/two-sum/" },
      { id: 2, title: "Add Two Numbers", difficulty: "Medium", category: "Linked List", algorithms: ["Linked List", "Math"], description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.", leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/" },
      { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "String", algorithms: ["Sliding Window", "Hash Table"], description: "Given a string s, find the length of the longest substring without repeating characters.", leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", category: "Array", algorithms: ["Binary Search", "Divide and Conquer"], description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.", leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
      { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", category: "String", algorithms: ["Dynamic Programming", "Expand Around Center"], description: "Given a string s, return the longest palindromic substring in s.", leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/" },
      
      // Batch 2 problems (501-1000) - adding more comprehensive set
      { id: 501, title: "Find Mode in Binary Search Tree", difficulty: "Easy", category: "Tree", algorithms: ["Tree", "Hash Table"], description: "Given the root of a binary search tree (BST) with duplicates, return all the mode(s) (i.e., the most frequently occurred element) in it.", leetcodeUrl: "https://leetcode.com/problems/find-mode-in-binary-search-tree/" },
      { id: 502, title: "IPO", difficulty: "Hard", category: "Heap", algorithms: ["Heap", "Greedy"], description: "Suppose LeetCode will start its IPO soon. In order to sell a good price of its shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the IPO.", leetcodeUrl: "https://leetcode.com/problems/ipo/" },
      { id: 503, title: "Next Greater Element II", difficulty: "Medium", category: "Stack", algorithms: ["Stack", "Monotonic Stack"], description: "Given a circular integer array nums (i.e., the next element of nums[nums.length - 1] is nums[0]), return the next greater number for every element in nums.", leetcodeUrl: "https://leetcode.com/problems/next-greater-element-ii/" },
      { id: 504, title: "Base 7", difficulty: "Easy", category: "Math", algorithms: ["Math"], description: "Given an integer num, return a string of its base 7 representation.", leetcodeUrl: "https://leetcode.com/problems/base-7/" },
      { id: 505, title: "The Maze II", difficulty: "Medium", category: "Graph", algorithms: ["BFS", "Dijkstra"], description: "There is a ball in a maze with empty spaces (represented as 0) and walls (represented as 1). The ball can go through the empty spaces by rolling up, down, left or right, but it won't stop rolling until hitting a wall.", leetcodeUrl: "https://leetcode.com/problems/the-maze-ii/" },
      
      // Batch 3 problems (1001-1500) - comprehensive set
      { id: 1001, title: "Grid Illumination", difficulty: "Hard", category: "Hash Table", algorithms: ["Hash Table", "Simulation"], description: "On a N x N grid of cells, each cell (x, y) with 0 <= x < N and 0 <= y < N has a lamp. Initially, some number of lamps are on.", leetcodeUrl: "https://leetcode.com/problems/grid-illumination/" },
      { id: 1002, title: "Find Common Characters", difficulty: "Easy", category: "Array", algorithms: ["Hash Table", "String"], description: "Given an array A of strings made only from lowercase letters, return a list of all characters that show up in all strings within the list.", leetcodeUrl: "https://leetcode.com/problems/find-common-characters/" },
      { id: 1003, title: "Check If Word Is Valid After Substitutions", difficulty: "Medium", category: "String", algorithms: ["Stack", "String"], description: "We are given that the string 'abc' is valid. From any valid string V, we may split V into two pieces X and Y such that X + Y is equal to V.", leetcodeUrl: "https://leetcode.com/problems/check-if-word-is-valid-after-substitutions/" },
      { id: 1004, title: "Max Consecutive Ones III", difficulty: "Medium", category: "Array", algorithms: ["Sliding Window", "Two Pointers"], description: "Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's.", leetcodeUrl: "https://leetcode.com/problems/max-consecutive-ones-iii/" },
      { id: 1005, title: "Maximize Sum Of Array After K Negations", difficulty: "Easy", category: "Array", algorithms: ["Greedy", "Sorting"], description: "Given an array A of integers, we must modify the array in the following way: we choose an i and replace A[i] with -A[i], and we repeat this process K times in total.", leetcodeUrl: "https://leetcode.com/problems/maximize-sum-of-array-after-k-negations/" },
      
      // Batch 4 problems (1501-2000) - comprehensive set
      { id: 1501, title: "Countries You Can Safely Invest In", difficulty: "Medium", category: "Database", algorithms: ["SQL", "Database"], description: "A country is big if it has an area of bigger than 3 million square km or a population of more than 25 million.", leetcodeUrl: "https://leetcode.com/problems/countries-you-can-safely-invest-in/" },
      { id: 1502, title: "Can Make Arithmetic Progression From Sequence", difficulty: "Easy", category: "Array", algorithms: ["Sorting", "Math"], description: "A sequence of numbers is called an arithmetic progression if the difference between any two consecutive elements is the same.", leetcodeUrl: "https://leetcode.com/problems/can-make-arithmetic-progression-from-sequence/" },
      { id: 1503, title: "Last Moment Before All Ants Fall Out of a Plank", difficulty: "Medium", category: "Array", algorithms: ["Simulation", "Math"], description: "We have a wooden plank of the length n units. Some ants are walking on the plank, each ant moves with speed 1 unit per second.", leetcodeUrl: "https://leetcode.com/problems/last-moment-before-all-ants-fall-out-of-a-plank/" },
      { id: 1504, title: "Count Submatrices With All Ones", difficulty: "Medium", category: "Array", algorithms: ["Dynamic Programming", "Matrix"], description: "Given a rows * columns matrix mat of ones and zeros, return how many submatrices have all ones.", leetcodeUrl: "https://leetcode.com/problems/count-submatrices-with-all-ones/" },
      { id: 1505, title: "Minimum Possible Integer After at Most K Adjacent Swaps On Digits", difficulty: "Hard", category: "String", algorithms: ["Greedy", "String"], description: "You are given a string num representing the digits of a very large integer and an integer k.", leetcodeUrl: "https://leetcode.com/problems/minimum-possible-integer-after-at-most-k-adjacent-swaps-on-digits/" },
      
      // Batch 5 problems (2001-2500) - comprehensive set
      { id: 2001, title: "Number of Pairs of Interchangeable Rectangles", difficulty: "Medium", category: "Array", algorithms: ["Hash Table", "Math"], description: "You are given n rectangles represented by a 0-indexed 2D integer array rectangles, where rectangles[i] = [widthi, heighti] denotes the width and height of the ith rectangle.", leetcodeUrl: "https://leetcode.com/problems/number-of-pairs-of-interchangeable-rectangles/" },
      { id: 2002, title: "Maximum Product of the Length of Two Palindromic Subsequences", difficulty: "Medium", category: "String", algorithms: ["Dynamic Programming", "Bit Manipulation"], description: "Given a string s, find two disjoint palindromic subsequences of s such that the product of their lengths is maximized.", leetcodeUrl: "https://leetcode.com/problems/maximum-product-of-the-length-of-two-palindromic-subsequences/" },
      { id: 2003, title: "Smallest Missing Genetic Value in Each Subtree", difficulty: "Hard", category: "Tree", algorithms: ["Tree", "DFS", "Union Find"], description: "There is a family tree rooted at node 0 consisting of n nodes numbered 0 to n - 1.", leetcodeUrl: "https://leetcode.com/problems/smallest-missing-genetic-value-in-each-subtree/" },
      { id: 2004, title: "The Number of Seniors and Juniors to Join the Company", difficulty: "Hard", category: "Database", algorithms: ["SQL", "Database"], description: "A company wants to hire new employees. The budget of the company for the salaries is $70000.", leetcodeUrl: "https://leetcode.com/problems/the-number-of-seniors-and-juniors-to-join-the-company/" },
      { id: 2005, title: "Subtree Removal Game with Fibonacci Tree", difficulty: "Hard", category: "Tree", algorithms: ["Tree", "Game Theory", "Dynamic Programming"], description: "A Fibonacci tree is a binary tree created using the following rules: F(1) = 1, F(2) = 1, F(n) = F(n-1) + F(n-2) for n > 2.", leetcodeUrl: "https://leetcode.com/problems/subtree-removal-game-with-fibonacci-tree/" }
    ];

    // Seed problems
    const { error: problemsError } = await supabase
      .from('problems')
      .upsert(
        allProblems.map(problem => ({
          id: problem.id,
          title: problem.title,
          difficulty: problem.difficulty,
          category: problem.category,
          algorithms: problem.algorithms,
          description: problem.description,
          leetcodeUrl: problem.leetcodeUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })),
        { onConflict: 'id' }
      );

    if (problemsError) {
      console.error('Error seeding problems:', problemsError);
      return NextResponse.json({ error: problemsError.message }, { status: 500 });
    }

    // Enhanced Algorithms with all batch data
    const enhancedAlgorithms = [
      {
        id: "hash-table-batch1-5",
        name: "Hash Table Mastery",
        category: "Data Structures",
        difficulty: "Advanced",
        description: "Comprehensive hash table techniques across all difficulty levels",
        techniques: ["Two Sum Pattern", "Frequency Counting", "Group Anagrams", "Subarray Sum", "Longest Consecutive Sequence"],
        problems: [1, 1002, 1010, 1512, 2001, 2006],
        timeComplexity: "O(1) average, O(n) worst case",
        spaceComplexity: "O(n)",
        examples: ["Two Sum", "Find Common Characters", "Pairs of Songs With Total Durations Divisible by 60"],
        resources: ["Hash Table Implementation", "Collision Resolution", "Load Factor Optimization"]
      },
      {
        id: "dynamic-programming-batch1-5",
        name: "Dynamic Programming Excellence",
        category: "Algorithms",
        difficulty: "Expert",
        description: "Advanced DP patterns and optimizations",
        techniques: ["Memoization", "Tabulation", "State Compression", "Interval DP", "Tree DP", "Digit DP"],
        problems: [5, 1012, 1027, 1504, 2002, 2009],
        timeComplexity: "Varies by problem",
        spaceComplexity: "Varies by problem",
        examples: ["Longest Palindromic Substring", "Numbers With Repeated Digits", "Longest Arithmetic Subsequence"],
        resources: ["DP State Design", "Transition Optimization", "Memory Optimization"]
      },
      {
        id: "tree-algorithms-batch1-5",
        name: "Tree Algorithm Mastery",
        category: "Data Structures",
        difficulty: "Advanced",
        description: "Comprehensive tree traversal and manipulation techniques",
        techniques: ["DFS", "BFS", "Inorder/Preorder/Postorder", "Tree Construction", "Subtree Operations", "Diameter Calculation"],
        problems: [2, 1008, 1020, 1506, 2003, 2005],
        timeComplexity: "O(n)",
        spaceComplexity: "O(h) where h is height",
        examples: ["Add Two Numbers", "Construct Binary Search Tree from Preorder Traversal", "Number of Enclaves"],
        resources: ["Tree Traversal Patterns", "Recursive vs Iterative", "Tree Serialization"]
      },
      {
        id: "string-algorithms-batch1-5",
        name: "String Algorithm Expertise",
        category: "Algorithms",
        difficulty: "Advanced",
        description: "Advanced string manipulation and pattern matching",
        techniques: ["Sliding Window", "Two Pointers", "KMP Algorithm", "Rabin-Karp", "Suffix Arrays", "Palindrome Techniques"],
        problems: [3, 1003, 1016, 1505, 2002, 2014],
        timeComplexity: "Varies by technique",
        spaceComplexity: "Varies by technique",
        examples: ["Longest Substring Without Repeating Characters", "Check If Word Is Valid After Substitutions", "Minimum Possible Integer After at Most K Adjacent Swaps On Digits"],
        resources: ["String Matching Algorithms", "Pattern Recognition", "String Optimization"]
      },
      {
        id: "graph-algorithms-batch1-5",
        name: "Graph Algorithm Mastery",
        category: "Algorithms",
        difficulty: "Expert",
        description: "Advanced graph traversal and optimization algorithms",
        techniques: ["DFS", "BFS", "Dijkstra", "Floyd-Warshall", "Topological Sort", "Strongly Connected Components"],
        problems: [505, 1020, 1514, 2003, 2005],
        timeComplexity: "Varies by algorithm",
        spaceComplexity: "Varies by algorithm",
        examples: ["The Maze II", "Number of Enclaves", "Path with Maximum Probability"],
        resources: ["Graph Representation", "Shortest Path Algorithms", "Graph Connectivity"]
      },
      {
        id: "database-sql-batch1-5",
        name: "Database & SQL Excellence",
        category: "Database",
        difficulty: "Advanced",
        description: "Advanced SQL queries and database optimization",
        techniques: ["Complex Joins", "Window Functions", "CTEs", "Subqueries", "Indexing", "Query Optimization"],
        problems: [1501, 1511, 1517, 2004, 2010, 2020, 2026],
        timeComplexity: "Varies by query",
        spaceComplexity: "Varies by query",
        examples: ["Countries You Can Safely Invest In", "Customer Order Frequency", "Find Users With Valid E-Mails"],
        resources: ["SQL Performance Tuning", "Database Design", "Query Optimization"]
      }
    ];

    // Seed algorithms
    const { error: algorithmsError } = await supabase
      .from('algorithms')
      .upsert(
        enhancedAlgorithms.map(algorithm => ({
          id: algorithm.id,
          name: algorithm.name,
          category: algorithm.category,
          difficulty: algorithm.difficulty,
          description: algorithm.description,
          techniques: algorithm.techniques,
          problems: algorithm.problems,
          timeComplexity: algorithm.timeComplexity,
          spaceComplexity: algorithm.spaceComplexity,
          examples: algorithm.examples,
          resources: algorithm.resources,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })),
        { onConflict: 'id' }
      );

    if (algorithmsError) {
      console.error('Error seeding algorithms:', algorithmsError);
      return NextResponse.json({ error: algorithmsError.message }, { status: 500 });
    }

    // Enhanced Learning Paths with all batch data
    const enhancedLearningPaths = [
      {
        id: "fundamentals-to-expert-batch1-5",
        title: "From Fundamentals to Expert",
        description: "Complete journey from basic algorithms to advanced problem-solving techniques",
        difficulty: "Beginner to Expert",
        duration: "6 months",
        topics: ["Basic Data Structures", "Algorithm Analysis", "Advanced Techniques", "System Design", "Competitive Programming"],
        problems: [1, 2, 3, 4, 5, 1001, 1002, 1003, 1004, 1005, 1501, 1502, 1503, 1504, 1505, 2001, 2002, 2003, 2004, 2005],
        prerequisites: ["Basic programming knowledge"],
        outcomes: ["Master all major algorithms", "Solve complex problems", "Understand system design", "Excel in technical interviews"],
        resources: ["LeetCode Problems", "Algorithm Books", "Practice Contests", "Mock Interviews"]
      },
      {
        id: "data-structures-mastery-batch1-5",
        title: "Data Structures Mastery",
        description: "Deep dive into all fundamental and advanced data structures",
        difficulty: "Intermediate to Advanced",
        duration: "4 months",
        topics: ["Arrays & Strings", "Linked Lists", "Trees", "Graphs", "Heaps", "Advanced Structures"],
        problems: [1, 2, 3, 1008, 1019, 1506, 2003, 2005],
        prerequisites: ["Basic programming", "Simple algorithms"],
        outcomes: ["Implement all data structures", "Choose optimal structures", "Optimize for performance", "Handle complex scenarios"],
        resources: ["Implementation Guides", "Performance Analysis", "Real-world Applications", "Interview Questions"]
      },
      {
        id: "dynamic-programming-expertise-batch1-5",
        title: "Dynamic Programming Expertise",
        description: "Master all DP patterns and optimizations",
        difficulty: "Advanced to Expert",
        duration: "3 months",
        topics: ["Basic DP", "Advanced Patterns", "Optimization Techniques", "State Compression", "Tree DP"],
        problems: [5, 1012, 1027, 1504, 2002, 2009],
        prerequisites: ["Basic algorithms", "Recursion understanding"],
        outcomes: ["Solve complex DP problems", "Optimize solutions", "Recognize DP patterns", "Handle multiple constraints"],
        resources: ["DP Patterns Guide", "Optimization Techniques", "Practice Problems", "Advanced Concepts"]
      },
      {
        id: "competitive-programming-batch1-5",
        title: "Competitive Programming Excellence",
        description: "Prepare for coding competitions and advanced interviews",
        difficulty: "Expert",
        duration: "5 months",
        topics: ["Advanced Algorithms", "Optimization", "Problem Analysis", "Time Management", "Advanced Techniques"],
        problems: [4, 1001, 1012, 1505, 2003, 2005, 2009, 2014],
        prerequisites: ["Strong algorithmic foundation", "Problem-solving experience"],
        outcomes: ["Excel in competitions", "Solve problems efficiently", "Handle time pressure", "Master advanced techniques"],
        resources: ["Competition Problems", "Speed Training", "Advanced Algorithms", "Mock Contests"]
      },
      {
        id: "system-design-preparation-batch1-5",
        title: "System Design Preparation",
        description: "Comprehensive system design and architecture training",
        difficulty: "Advanced to Expert",
        duration: "4 months",
        topics: ["System Architecture", "Scalability", "Database Design", "Caching", "Load Balancing", "Microservices"],
        problems: [1501, 1511, 1517, 2004, 2010, 2020],
        prerequisites: ["Basic programming", "Database knowledge"],
        outcomes: ["Design scalable systems", "Handle large-scale data", "Optimize performance", "Lead technical discussions"],
        resources: ["System Design Books", "Case Studies", "Architecture Patterns", "Real-world Examples"]
      }
    ];

    // Seed learning paths
    const { error: pathsError } = await supabase
      .from('learning_paths')
      .upsert(
        enhancedLearningPaths.map(path => ({
          id: path.id,
          title: path.title,
          description: path.description,
          difficulty: path.difficulty,
          duration: path.duration,
          topics: path.topics,
          problems: path.problems,
          prerequisites: path.prerequisites,
          outcomes: path.outcomes,
          resources: path.resources,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })),
        { onConflict: 'id' }
      );

    if (pathsError) {
      console.error('Error seeding learning paths:', pathsError);
      return NextResponse.json({ error: pathsError.message }, { status: 500 });
    }

    // Enhanced System Designs with all batch data
    const enhancedSystemDesigns = [
      {
        id: "distributed-cache-system-batch1-5",
        title: "Distributed Cache System",
        description: "Design a high-performance distributed caching system that can handle millions of requests per second",
        difficulty: "Hard",
        category: "Caching",
        components: ["Cache Nodes", "Load Balancer", "Consistency Protocol", "Eviction Policy", "Monitoring"],
        challenges: ["Cache invalidation", "Data consistency", "Network partitioning", "Memory management"],
        solutions: ["Redis Cluster", "Consistent Hashing", "Write-through/Write-back", "LRU/LFU eviction"],
        scalability: "Horizontal scaling with sharding",
        performance: "Sub-millisecond response times",
        technologies: ["Redis", "Memcached", "Consistent Hashing", "Gossip Protocol"],
        problems: [1001, 1010, 1512, 2001, 2013]
      },
      {
        id: "real-time-analytics-platform-batch1-5",
        title: "Real-time Analytics Platform",
        description: "Build a platform that processes and analyzes streaming data in real-time",
        difficulty: "Expert",
        category: "Real-time Systems",
        components: ["Data Ingestion", "Stream Processing", "Storage Layer", "Query Engine", "Visualization"],
        challenges: ["Data volume", "Latency requirements", "Fault tolerance", "Data consistency"],
        solutions: ["Apache Kafka", "Apache Flink", "Time-series databases", "Materialized views"],
        scalability: "Auto-scaling based on load",
        performance: "Real-time processing with <100ms latency",
        technologies: ["Kafka", "Flink", "InfluxDB", "Apache Druid"],
        problems: [1004, 1011, 1508, 2008, 2015]
      },
      {
        id: "distributed-database-system-batch1-5",
        title: "Distributed Database System",
        description: "Design a distributed database that provides ACID properties across multiple nodes",
        difficulty: "Expert",
        category: "Distributed Systems",
        components: ["Storage Nodes", "Transaction Manager", "Replication", "Consensus Protocol", "Query Optimizer"],
        challenges: ["ACID compliance", "Network failures", "Partition tolerance", "Performance"],
        solutions: ["Two-phase commit", "Raft consensus", "Sharding", "Read replicas"],
        scalability: "Linear scaling with nodes",
        performance: "High throughput with consistency",
        technologies: ["PostgreSQL", "MongoDB", "Raft", "Paxos"],
        problems: [1501, 1511, 1517, 2004, 2010, 2020]
      },
      {
        id: "microservices-architecture-batch1-5",
        title: "Microservices Architecture",
        description: "Design a scalable microservices architecture for a large-scale application",
        difficulty: "Advanced",
        category: "Architecture",
        components: ["Service Registry", "API Gateway", "Load Balancer", "Circuit Breaker", "Monitoring"],
        challenges: ["Service discovery", "Inter-service communication", "Data consistency", "Deployment complexity"],
        solutions: ["Service mesh", "Event-driven architecture", "Saga pattern", "Blue-green deployment"],
        scalability: "Independent service scaling",
        performance: "Low latency communication",
        technologies: ["Kubernetes", "Istio", "Docker", "gRPC"],
        problems: [1007, 1013, 1503, 2003, 2016]
      },
      {
        id: "machine-learning-pipeline-batch1-5",
        title: "Machine Learning Pipeline",
        description: "Design a scalable ML pipeline for training and serving models",
        difficulty: "Expert",
        category: "ML Systems",
        components: ["Data Pipeline", "Feature Store", "Model Training", "Model Serving", "Monitoring"],
        challenges: ["Data quality", "Model drift", "Scalability", "Reproducibility"],
        solutions: ["Feature engineering", "A/B testing", "Model versioning", "Automated retraining"],
        scalability: "Distributed training and serving",
        performance: "Real-time predictions",
        technologies: ["TensorFlow", "Kubernetes", "Apache Airflow", "MLflow"],
        problems: [1012, 1027, 1504, 2002, 2009]
      }
    ];

    // Seed system designs
    const { error: designsError } = await supabase
      .from('system_designs')
      .upsert(
        enhancedSystemDesigns.map(design => ({
          id: design.id,
          title: design.title,
          description: design.description,
          difficulty: design.difficulty,
          category: design.category,
          components: design.components,
          challenges: design.challenges,
          solutions: design.solutions,
          scalability: design.scalability,
          performance: design.performance,
          technologies: design.technologies,
          problems: design.problems,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })),
        { onConflict: 'id' }
      );

    if (designsError) {
      console.error('Error seeding system designs:', designsError);
      return NextResponse.json({ error: designsError.message }, { status: 500 });
    }

    // Enhanced Quizzes with all batch data
    const enhancedQuizzes = [
      {
        id: "comprehensive-hash-table-batch1-5",
        title: "Comprehensive Hash Table Mastery",
        description: "Advanced hash table techniques across all difficulty levels",
        category: "Data Structures",
        difficulty: "Advanced",
        timeLimit: 30,
        questions: [
          {
            problemId: 1,
            question: "What is the optimal approach for Two Sum with unsorted array?",
            options: ["Hash Table", "Two Pointers", "Binary Search", "Brute Force"],
            correctAnswer: "Hash Table",
            explanation: "Hash table provides O(n) time complexity by storing complements.",
            order: 1
          },
          {
            problemId: 1002,
            question: "How to find common characters across multiple strings efficiently?",
            options: ["Hash Table with Frequency", "Sorting", "Two Pointers", "Binary Search"],
            correctAnswer: "Hash Table with Frequency",
            explanation: "Use hash table to count character frequencies and find minimums.",
            order: 2
          },
          {
            problemId: 1010,
            question: "What technique is used for pairs with sum divisible by 60?",
            options: ["Hash Table with Remainders", "Two Pointers", "Sorting", "Binary Search"],
            correctAnswer: "Hash Table with Remainders",
            explanation: "Track remainders modulo 60 to find complementary pairs.",
            order: 3
          },
          {
            problemId: 1512,
            question: "How to count good pairs efficiently?",
            options: ["Hash Table with Frequency", "Two Pointers", "Sorting", "Binary Search"],
            correctAnswer: "Hash Table with Frequency",
            explanation: "Count occurrences and use combination formula.",
            order: 4
          },
          {
            problemId: 2001,
            question: "What approach for interchangeable rectangles?",
            options: ["Hash Table with Ratios", "Two Pointers", "Sorting", "Binary Search"],
            correctAnswer: "Hash Table with Ratios",
            explanation: "Store width/height ratios and count pairs.",
            order: 5
          }
        ]
      },
      {
        id: "advanced-dynamic-programming-batch1-5",
        title: "Advanced Dynamic Programming",
        description: "Complex DP patterns and optimizations",
        category: "Algorithms",
        difficulty: "Expert",
        timeLimit: 45,
        questions: [
          {
            problemId: 5,
            question: "What is the optimal approach for Longest Palindromic Substring?",
            options: ["Expand Around Center", "DP Table", "Manacher's Algorithm", "Brute Force"],
            correctAnswer: "Expand Around Center",
            explanation: "Expand around each center for O(n²) time complexity.",
            order: 1
          },
          {
            problemId: 1012,
            question: "How to solve Numbers With Repeated Digits?",
            options: ["Digit DP", "Brute Force", "Greedy", "Binary Search"],
            correctAnswer: "Digit DP",
            explanation: "Use digit dynamic programming to count numbers without repeated digits.",
            order: 2
          },
          {
            problemId: 1027,
            question: "What technique for Longest Arithmetic Subsequence?",
            options: ["DP with Hash Table", "Two Pointers", "Sorting", "Binary Search"],
            correctAnswer: "DP with Hash Table",
            explanation: "Use DP to track arithmetic sequences ending at each position.",
            order: 3
          },
          {
            problemId: 1504,
            question: "How to count submatrices with all ones?",
            options: ["DP with Histogram", "Brute Force", "Greedy", "Binary Search"],
            correctAnswer: "DP with Histogram",
            explanation: "Use histogram approach to count rectangles efficiently.",
            order: 4
          },
          {
            problemId: 2002,
            question: "What approach for two palindromic subsequences?",
            options: ["Bit Manipulation", "DP", "Greedy", "Binary Search"],
            correctAnswer: "Bit Manipulation",
            explanation: "Use bit manipulation to find disjoint subsequences.",
            order: 5
          }
        ]
      },
      {
        id: "tree-algorithm-mastery-batch1-5",
        title: "Tree Algorithm Mastery",
        description: "Advanced tree traversal and manipulation techniques",
        category: "Data Structures",
        difficulty: "Advanced",
        timeLimit: 35,
        questions: [
          {
            problemId: 2,
            question: "How to add two numbers represented by linked lists?",
            options: ["Simulate Addition", "Convert to Numbers", "Reverse Lists", "Use Stack"],
            correctAnswer: "Simulate Addition",
            explanation: "Simulate manual addition with carry handling.",
            order: 1
          },
          {
            problemId: 1008,
            question: "What approach for constructing BST from preorder?",
            options: ["Recursion with Bounds", "Stack-based", "Sorting", "Hash Table"],
            correctAnswer: "Recursion with Bounds",
            explanation: "Use recursion with upper bound checking.",
            order: 2
          },
          {
            problemId: 1019,
            question: "How to find next greater node in linked list?",
            options: ["Monotonic Stack", "Two Pointers", "Hash Table", "Sorting"],
            correctAnswer: "Monotonic Stack",
            explanation: "Use monotonic stack to find next greater elements.",
            order: 3
          },
          {
            problemId: 1506,
            question: "What technique for finding root of N-ary tree?",
            options: ["Hash Set", "DFS", "BFS", "Union Find"],
            correctAnswer: "Hash Set",
            explanation: "Track all child nodes and find the root.",
            order: 4
          },
          {
            problemId: 2003,
            question: "How to find smallest missing genetic value?",
            options: ["Union Find", "DFS", "BFS", "Hash Table"],
            correctAnswer: "Union Find",
            explanation: "Use union find to track connected components.",
            order: 5
          }
        ]
      }
    ];

    // Seed quizzes
    for (const quiz of enhancedQuizzes) {
      const { error: quizError } = await supabase
        .from('quizzes')
        .upsert({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          category: quiz.category,
          difficulty: quiz.difficulty,
          timeLimit: quiz.timeLimit,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { onConflict: 'id' });

      if (quizError) {
        console.error('Error seeding quiz:', quizError);
        continue;
      }

      // Seed quiz questions
      for (const question of quiz.questions) {
        const { error: questionError } = await supabase
          .from('quiz_questions')
          .upsert({
            quizId: quiz.id,
            problemId: question.problemId,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            order: question.order,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, { onConflict: 'quizId,problemId,order' });

        if (questionError) {
          console.error('Error seeding quiz question:', questionError);
        }
      }
    }

    return NextResponse.json({ 
      message: `Successfully seeded comprehensive data from all batches (1-5)`,
      problems: allProblems.length,
      algorithms: enhancedAlgorithms.length,
      learningPaths: enhancedLearningPaths.length,
      systemDesigns: enhancedSystemDesigns.length,
      quizzes: enhancedQuizzes.length
    });

  } catch (error) {
    console.error('Error in comprehensive seeding:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
