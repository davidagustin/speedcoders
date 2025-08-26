import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Enhanced learning paths based on batch1 and batch2 data
    const learningPaths = [
      {
        title: 'Fundamentals to Advanced Dynamic Programming',
        description: 'Master DP from basic concepts to complex patterns like interval DP, tree DP, and state compression',
        category: 'beginner',
        difficulty: 'Hard',
        duration: 40,
        topics: JSON.stringify([
          'Basic DP Patterns',
          'Memoization & Tabulation',
          'Interval DP',
          'Tree DP',
          'State Compression',
          'Matrix Exponentiation'
        ]),
        prerequisites: JSON.stringify(['Basic recursion', 'Array manipulation']),
        isActive: true
      },
      {
        title: 'Graph Algorithms Mastery',
        description: 'Comprehensive coverage of graph algorithms from basic traversal to advanced network flow',
        category: 'intermediate',
        difficulty: 'Hard',
        duration: 35,
        topics: JSON.stringify([
          'DFS & BFS',
          'Shortest Path Algorithms',
          'Minimum Spanning Tree',
          'Network Flow',
          'Strongly Connected Components',
          'Bipartite Graphs'
        ]),
        prerequisites: JSON.stringify(['Basic tree traversal', 'Queue & Stack']),
        isActive: true
      },
      {
        title: 'Advanced String Processing',
        description: 'Master complex string algorithms, pattern matching, and text processing techniques',
        category: 'intermediate',
        difficulty: 'Hard',
        duration: 30,
        topics: JSON.stringify([
          'Pattern Matching',
          'String DP',
          'Trie Data Structure',
          'Suffix Arrays',
          'Rolling Hash',
          'Parsing Algorithms'
        ]),
        prerequisites: JSON.stringify(['Basic string operations', 'Hash tables']),
        isActive: true
      },
      {
        title: 'System Design & Data Structures',
        description: 'Learn to design efficient data structures and system architectures',
        category: 'advanced',
        difficulty: 'Hard',
        duration: 45,
        topics: JSON.stringify([
          'Custom Data Structures',
          'System Architecture',
          'Design Patterns',
          'Performance Optimization',
          'Scalability',
          'Trade-offs Analysis'
        ]),
        prerequisites: JSON.stringify(['Basic data structures', 'Algorithm analysis']),
        isActive: true
      },
      {
        title: 'Advanced Database & SQL',
        description: 'Master complex SQL queries, window functions, and database optimization',
        category: 'intermediate',
        difficulty: 'Medium',
        duration: 25,
        topics: JSON.stringify([
          'Window Functions',
          'Complex Joins',
          'Subqueries & CTEs',
          'Performance Optimization',
          'Indexing Strategies',
          'Query Planning'
        ]),
        prerequisites: JSON.stringify(['Basic SQL', 'Database concepts']),
        isActive: true
      },
      {
        title: 'Mathematical Algorithms',
        description: 'Advanced mathematical algorithms and number theory concepts',
        category: 'advanced',
        difficulty: 'Hard',
        duration: 35,
        topics: JSON.stringify([
          'Number Theory',
          'Bit Manipulation',
          'Combinatorics',
          'Probability & Statistics',
          'Geometric Algorithms',
          'Optimization Techniques'
        ]),
        prerequisites: JSON.stringify(['Basic math', 'Binary operations']),
        isActive: true
      }
    ];

    // Enhanced system design challenges
    const systemDesigns = [
      {
        title: 'Design a URL Shortener',
        description: 'Design a URL shortening service like TinyURL or Bitly',
        category: 'scalability',
        difficulty: 'Medium',
        requirements: JSON.stringify([
          'Shorten long URLs to short URLs',
          'Redirect short URLs to original URLs',
          'Handle high traffic',
          'Ensure URL uniqueness',
          'Track click analytics'
        ]),
        solutions: JSON.stringify([
          'Hash-based URL generation',
          'Database design with caching',
          'Load balancing strategies',
          'Analytics tracking system'
        ]),
        resources: JSON.stringify([
          'Database design patterns',
          'Caching strategies',
          'Hash functions',
          'Load balancing'
        ]),
        isActive: true
      },
      {
        title: 'Design a File System',
        description: 'Design an in-memory file system with hierarchical structure',
        category: 'data-structures',
        difficulty: 'Hard',
        requirements: JSON.stringify([
          'Create directories and files',
          'Navigate file hierarchy',
          'Read and write file content',
          'Handle nested paths',
          'Efficient path operations'
        ]),
        solutions: JSON.stringify([
          'Trie-based directory structure',
          'Hash table for file content',
          'Path parsing algorithms',
          'Memory management'
        ]),
        resources: JSON.stringify([
          'Trie data structure',
          'File system concepts',
          'Path algorithms',
          'Memory optimization'
        ]),
        isActive: true
      },
      {
        title: 'Design a Max Stack',
        description: 'Design a stack data structure that supports finding the maximum element',
        category: 'data-structures',
        difficulty: 'Medium',
        requirements: JSON.stringify([
          'Push and pop operations',
          'Find maximum element',
          'Remove maximum element',
          'Maintain stack order',
          'Efficient operations'
        ]),
        solutions: JSON.stringify([
          'Doubly linked list with heap',
          'Two stacks approach',
          'Ordered map with stack',
          'Custom node structure'
        ]),
        resources: JSON.stringify([
          'Stack operations',
          'Heap data structure',
          'Linked list design',
          'Time complexity analysis'
        ]),
        isActive: true
      },
      {
        title: 'Design a Range Module',
        description: 'Design a module to track ranges of numbers efficiently',
        category: 'data-structures',
        difficulty: 'Hard',
        requirements: JSON.stringify([
          'Add ranges',
          'Remove ranges',
          'Query if number is in range',
          'Handle overlapping ranges',
          'Efficient range operations'
        ]),
        solutions: JSON.stringify([
          'Segment tree implementation',
          'Ordered map with intervals',
          'Binary search tree',
          'Interval merging algorithms'
        ]),
        resources: JSON.stringify([
          'Segment trees',
          'Interval algorithms',
          'Tree data structures',
          'Range queries'
        ]),
        isActive: true
      },
      {
        title: 'Design a Distributed Cache',
        description: 'Design a distributed caching system for high-performance applications',
        category: 'distributed-systems',
        difficulty: 'Hard',
        requirements: JSON.stringify([
          'Distributed key-value storage',
          'Consistency guarantees',
          'Fault tolerance',
          'Load balancing',
          'Cache eviction policies'
        ]),
        solutions: JSON.stringify([
          'Consistent hashing',
          'Replication strategies',
          'Cache invalidation',
          'Partitioning schemes'
        ]),
        resources: JSON.stringify([
          'Distributed systems',
          'Consistent hashing',
          'Cache strategies',
          'Fault tolerance'
        ]),
        isActive: true
      }
    ];

    // Enhanced algorithms with batch1 and batch2 data
    const algorithms = [
      // Advanced DP Algorithms
      {
        name: 'Interval Dynamic Programming',
        category: 'Dynamic Programming',
        description: 'DP technique for problems involving intervals or ranges, commonly used in string and array problems',
        timeComplexity: 'O(n³)',
        spaceComplexity: 'O(n²)',
        examples: JSON.stringify([
          {
            problem: 'Remove Boxes',
            approach: 'Use 3D DP with states for left, right, and consecutive count',
            code: 'dp[left][right][count] = max(dp[left][i-1][0] + (count+1)² + dp[i+1][right][0])'
          },
          {
            problem: 'Longest Palindromic Subsequence',
            approach: '2D DP with states for start and end indices',
            code: 'dp[i][j] = 2 + dp[i+1][j-1] if s[i]==s[j] else max(dp[i+1][j], dp[i][j-1])'
          }
        ])
      },
      {
        name: 'State Machine Dynamic Programming',
        category: 'Dynamic Programming',
        description: 'DP technique for problems with multiple states or state transitions',
        timeComplexity: 'O(n * states)',
        spaceComplexity: 'O(n * states)',
        examples: JSON.stringify([
          {
            problem: 'Student Attendance Record II',
            approach: 'Track states for A count and L streak',
            code: 'dp[i][a][l] = sum of valid states for length i with a absences and l late streak'
          }
        ])
      },
      {
        name: 'Tree Dynamic Programming',
        category: 'Dynamic Programming',
        description: 'DP technique applied to tree structures, often involving subtree problems',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        examples: JSON.stringify([
          {
            problem: 'Binary Tree Longest Consecutive Sequence II',
            approach: 'Track increasing and decreasing sequences in tree paths',
            code: 'dfs(node) returns [inc, dec] for longest consecutive sequences'
          }
        ])
      },

      // Advanced Graph Algorithms
      {
        name: 'Multi-source Shortest Path',
        category: 'Graph',
        description: 'Find shortest paths from multiple source nodes to all other nodes',
        timeComplexity: 'O((V + E) log V)',
        spaceComplexity: 'O(V)',
        examples: JSON.stringify([
          {
            problem: 'Network Delay Time',
            approach: 'Use Dijkstra\'s with heap optimization',
            code: 'Use priority queue to process nodes in order of distance'
          }
        ])
      },
      {
        name: 'Bounded Shortest Path',
        category: 'Graph',
        description: 'Find shortest path with constraints on number of edges or stops',
        timeComplexity: 'O(V * K)',
        spaceComplexity: 'O(V * K)',
        examples: JSON.stringify([
          {
            problem: 'Cheapest Flights Within K Stops',
            approach: 'BFS with state tracking for stops used',
            code: 'Use queue with (node, stops, cost) states'
          }
        ])
      },
      {
        name: 'Bipartite Graph Detection',
        category: 'Graph',
        description: 'Determine if a graph can be colored with two colors',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        examples: JSON.stringify([
          {
            problem: 'Is Graph Bipartite?',
            approach: 'DFS/BFS with color assignment',
            code: 'Color adjacent nodes with different colors, detect conflicts'
          }
        ])
      },

      // Advanced String Algorithms
      {
        name: 'Complex String DP',
        category: 'String',
        description: 'Advanced dynamic programming techniques for string problems',
        timeComplexity: 'O(n²) to O(n³)',
        spaceComplexity: 'O(n²)',
        examples: JSON.stringify([
          {
            problem: 'Count Different Palindromic Subsequences',
            approach: 'Interval DP with state tracking',
            code: 'dp[i][j] = count of distinct palindromic subsequences in s[i:j]'
          },
          {
            problem: 'Minimum Window Subsequence',
            approach: 'DP with sliding window optimization',
            code: 'Track minimum window containing subsequence'
          }
        ])
      },
      {
        name: 'Advanced Trie Design',
        category: 'String',
        description: 'Specialized trie structures for complex string operations',
        timeComplexity: 'O(L) for search',
        spaceComplexity: 'O(AL)',
        examples: JSON.stringify([
          {
            problem: 'Prefix and Suffix Search',
            approach: 'Trie with prefix-suffix mapping',
            code: 'Design trie supporting both prefix and suffix queries'
          }
        ])
      },

      // Advanced Array Algorithms
      {
        name: 'Segment Tree with Lazy Propagation',
        category: 'Array',
        description: 'Advanced segment tree technique for range updates and queries',
        timeComplexity: 'O(log n) per operation',
        spaceComplexity: 'O(n)',
        examples: JSON.stringify([
          {
            problem: 'Falling Squares',
            approach: 'Range updates and range maximum queries',
            code: 'Use segment tree to track maximum height in ranges'
          }
        ])
      },
      {
        name: 'Monotonic Stack with Advanced Patterns',
        category: 'Array',
        description: 'Advanced monotonic stack techniques for complex array problems',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        examples: JSON.stringify([
          {
            problem: 'Max Chunks To Make Sorted II',
            approach: 'Monotonic stack with prefix maximum',
            code: 'Maintain stack of maximum values for chunk detection'
          }
        ])
      },

      // Advanced Design Patterns
      {
        name: 'Advanced Data Structure Design',
        category: 'Design',
        description: 'Design patterns for complex data structures with multiple operations',
        timeComplexity: 'Varies by operation',
        spaceComplexity: 'O(n)',
        examples: JSON.stringify([
          {
            problem: 'Max Stack',
            approach: 'Doubly linked list with heap',
            code: 'DLL for order, heap for maximum tracking'
          },
          {
            problem: 'Design In-Memory File System',
            approach: 'Trie with file system operations',
            code: 'Trie for hierarchy, hash table for content'
          }
        ])
      },

      // Advanced Database Patterns
      {
        name: 'Complex Window Functions',
        category: 'Database',
        description: 'Advanced SQL window functions for complex aggregations',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        examples: JSON.stringify([
          {
            problem: 'Find Cumulative Salary',
            approach: 'Window function with self join exclusion',
            code: 'SUM(salary) OVER (PARTITION BY id ORDER BY month) - MAX(salary)'
          },
          {
            problem: 'Median Employee Salary',
            approach: 'Window function with PARTITION BY',
            code: 'ROW_NUMBER() OVER (PARTITION BY company ORDER BY salary)'
          }
        ])
      },

      // Advanced Math Algorithms
      {
        name: 'Number Theory with Binary Search',
        category: 'Math',
        description: 'Mathematical algorithms combined with binary search optimization',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        examples: JSON.stringify([
          {
            problem: 'Preimage Size of Factorial Zeroes',
            approach: 'Binary search with trailing zero count',
            code: 'Binary search on answer space with efficient zero counting'
          },
          {
            problem: 'Reach a Number',
            approach: 'Pattern analysis with binary search',
            code: 'Analyze reachable numbers pattern, use binary search'
          }
        ])
      }
    ];

    // Create learning paths
    for (const path of learningPaths) {
      await supabase.from('learning_paths').upsert(path, { onConflict: 'title' });
    }

    // Create system designs
    for (const design of systemDesigns) {
      await supabase.from('system_designs').upsert(design, { onConflict: 'title' });
    }

    // Create algorithms
    for (const algorithm of algorithms) {
      await supabase.from('algorithms').upsert(algorithm, { onConflict: 'name' });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Comprehensive seeding completed successfully! Created:
      - ${learningPaths.length} enhanced learning paths
      - ${systemDesigns.length} advanced system design challenges  
      - ${algorithms.length} advanced algorithms
      
      All data from batch1 and batch2 has been integrated with comprehensive coverage of:
      - Advanced Dynamic Programming (Interval DP, State Machine DP, Tree DP)
      - Graph Algorithms (Multi-source SP, Bounded SP, Bipartite Detection)
      - String Processing (Complex DP, Advanced Trie Design)
      - Array Operations (Segment Trees, Monotonic Stack Patterns)
      - System Design (Data Structure Design, Distributed Systems)
      - Database (Complex Window Functions, Advanced SQL)
      - Mathematical Algorithms (Number Theory, Binary Search Optimization)` 
    });

  } catch (error) {
    console.error('Comprehensive seeding error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed comprehensive data' 
    }, { status: 500 });
  }
}
