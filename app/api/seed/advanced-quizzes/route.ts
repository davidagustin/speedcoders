import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Advanced quiz categories based on batch1 and batch2 data
    const advancedQuizzes = [
      {
        title: 'Advanced Dynamic Programming',
        description: 'Master complex DP patterns including interval DP, tree DP, and state compression',
        timeLimit: 45,
        difficulty: 'Hard',
        category: 'Dynamic Programming',
        createdBy: 'system'
      },
      {
        title: 'Graph Algorithms & Network Flow',
        description: 'Advanced graph algorithms including shortest paths, network flow, and connectivity',
        timeLimit: 40,
        difficulty: 'Hard',
        category: 'Graph',
        createdBy: 'system'
      },
      {
        title: 'Advanced Tree & Binary Search',
        description: 'Complex tree operations, advanced BST techniques, and binary search variations',
        timeLimit: 35,
        difficulty: 'Hard',
        category: 'Tree',
        createdBy: 'system'
      },
      {
        title: 'String Processing & Pattern Matching',
        description: 'Advanced string algorithms, pattern matching, and text processing techniques',
        timeLimit: 40,
        difficulty: 'Hard',
        category: 'String',
        createdBy: 'system'
      },
      {
        title: 'Advanced Array & Matrix Operations',
        description: 'Complex array manipulations, matrix algorithms, and geometric computations',
        timeLimit: 35,
        difficulty: 'Hard',
        category: 'Array',
        createdBy: 'system'
      },
      {
        title: 'Design Patterns & System Architecture',
        description: 'Data structure design, system architecture patterns, and optimization techniques',
        timeLimit: 30,
        difficulty: 'Hard',
        category: 'Design',
        createdBy: 'system'
      },
      {
        title: 'Advanced Database & SQL',
        description: 'Complex SQL queries, window functions, and database optimization techniques',
        timeLimit: 25,
        difficulty: 'Medium',
        category: 'Database',
        createdBy: 'system'
      },
      {
        title: 'Bit Manipulation & Math',
        description: 'Advanced bit manipulation, mathematical algorithms, and number theory',
        timeLimit: 30,
        difficulty: 'Hard',
        category: 'Math',
        createdBy: 'system'
      }
    ];

    // Create advanced quizzes
    for (const quiz of advancedQuizzes) {
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .insert(quiz)
        .select()
        .single();

      if (quizError) {
        console.error('Error creating advanced quiz:', quizError);
        continue;
      }

      // Create advanced questions for each quiz
      const questions = getAdvancedQuestionsForQuiz(quiz.category, quizData.id);
      
      for (const question of questions) {
        await supabase
          .from('quiz_questions')
          .insert({
            ...question,
            quizId: quizData.id
          });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Advanced quizzes created successfully with complex algorithmic questions from batch1 and batch2 data' 
    });

  } catch (error) {
    console.error('Advanced quiz seeding error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed advanced quizzes' 
    }, { status: 500 });
  }
}

function getAdvancedQuestionsForQuiz(category: string, quizId: string) {
  const questions = [];

  switch (category) {
    case 'Dynamic Programming':
      questions.push(
        {
          problemId: 546,
          question: 'What is the optimal approach for Remove Boxes (Interval DP)?',
          options: JSON.stringify([
            'Interval DP with Memoization',
            'Greedy Algorithm',
            'Two Pointers',
            'Binary Search'
          ]),
          correctAnswer: 'Interval DP with Memoization',
          explanation: 'Remove Boxes requires interval DP to handle the complex state transitions when removing boxes and combining adjacent groups.',
          order: 1
        },
        {
          problemId: 552,
          question: 'Which approach is best for Student Attendance Record II (State Machine DP)?',
          options: JSON.stringify([
            'State Machine DP with Matrix Exponentiation',
            'Backtracking',
            'Greedy Algorithm',
            'Two Pointers'
          ]),
          correctAnswer: 'State Machine DP with Matrix Exponentiation',
          explanation: 'This problem requires tracking multiple states (A count, L streak) and can be optimized with matrix exponentiation for large n.',
          order: 2
        },
        {
          problemId: 568,
          question: 'What is optimal for Maximum Vacation Days (Multi-dimensional DP)?',
          options: JSON.stringify([
            'Multi-dimensional DP with State Optimization',
            'Greedy Algorithm',
            'Binary Search',
            'Two Pointers'
          ]),
          correctAnswer: 'Multi-dimensional DP with State Optimization',
          explanation: 'This requires DP with states for current city, weeks remaining, and can be optimized by tracking maximum vacation days achievable.',
          order: 3
        },
        {
          problemId: 741,
          question: 'Which approach for Cherry Pickup (Two Path DP)?',
          options: JSON.stringify([
            'Two Path DP with State Compression',
            'Greedy Algorithm',
            'Binary Search',
            'Two Pointers'
          ]),
          correctAnswer: 'Two Path DP with State Compression',
          explanation: 'Cherry Pickup requires tracking two paths simultaneously using DP with state compression to avoid double counting.',
          order: 4
        },
        {
          problemId: 790,
          question: 'What is best for Domino and Tromino Tiling (Pattern DP)?',
          options: JSON.stringify([
            'Pattern DP with Matrix Exponentiation',
            'Greedy Algorithm',
            'Binary Search',
            'Two Pointers'
          ]),
          correctAnswer: 'Pattern DP with Matrix Exponentiation',
          explanation: 'This requires identifying tiling patterns and can be optimized with matrix exponentiation for large n.',
          order: 5
        }
      );
      break;

    case 'Graph':
      questions.push(
        {
          problemId: 743,
          question: 'What is the optimal approach for Network Delay Time (Multi-source Shortest Path)?',
          options: JSON.stringify([
            'Dijkstra\'s with Heap Optimization',
            'Floyd-Warshall',
            'Bellman-Ford',
            'DFS'
          ]),
          correctAnswer: 'Dijkstra\'s with Heap Optimization',
          explanation: 'Network Delay Time requires finding shortest paths from a source to all nodes, best solved with Dijkstra\'s using a min-heap.',
          order: 1
        },
        {
          problemId: 787,
          question: 'Which approach for Cheapest Flights Within K Stops (Bounded Shortest Path)?',
          options: JSON.stringify([
            'BFS with State Tracking',
            'Dijkstra\'s Algorithm',
            'Bellman-Ford',
            'DFS'
          ]),
          correctAnswer: 'BFS with State Tracking',
          explanation: 'This requires finding shortest path with bounded number of stops, best solved with BFS tracking stops used.',
          order: 2
        },
        {
          problemId: 785,
          question: 'What is optimal for Is Graph Bipartite? (Bipartite Detection)?',
          options: JSON.stringify([
            'DFS/BFS with Color Assignment',
            'Union Find',
            'Topological Sort',
            'Floyd-Warshall'
          ]),
          correctAnswer: 'DFS/BFS with Color Assignment',
          explanation: 'Bipartite detection requires coloring nodes with two colors such that no adjacent nodes have the same color.',
          order: 3
        },
        {
          problemId: 721,
          question: 'Which approach for Accounts Merge (Connected Components)?',
          options: JSON.stringify([
            'Union Find with Email Mapping',
            'DFS with Hash Table',
            'BFS with Set Operations',
            'Topological Sort'
          ]),
          correctAnswer: 'Union Find with Email Mapping',
          explanation: 'Accounts Merge requires finding connected components of emails, efficiently solved with Union Find.',
          order: 4
        },
        {
          problemId: 753,
          question: 'What is best for Cracking the Safe (Eulerian Path)?',
          options: JSON.stringify([
            'Hierholzer\'s Algorithm for Eulerian Path',
            'DFS with Backtracking',
            'BFS with State Space',
            'Dijkstra\'s Algorithm'
          ]),
          correctAnswer: 'Hierholzer\'s Algorithm for Eulerian Path',
          explanation: 'This is essentially finding an Eulerian path in a de Bruijn graph, solved with Hierholzer\'s algorithm.',
          order: 5
        }
      );
      break;

    case 'Tree':
      questions.push(
        {
          problemId: 776,
          question: 'What is the optimal approach for Split BST (BST Manipulation)?',
          options: JSON.stringify([
            'Recursive Split with BST Properties',
            'Inorder Traversal',
            'Level Order Traversal',
            'Postorder Traversal'
          ]),
          correctAnswer: 'Recursive Split with BST Properties',
          explanation: 'Split BST requires maintaining BST properties while splitting, best done recursively using BST ordering.',
          order: 1
        },
        {
          problemId: 742,
          question: 'Which approach for Closest Leaf in Binary Tree (Tree to Graph)?',
          options: JSON.stringify([
            'Convert Tree to Graph then BFS',
            'DFS with Distance Tracking',
            'Inorder Traversal',
            'Level Order Traversal'
          ]),
          correctAnswer: 'Convert Tree to Graph then BFS',
          explanation: 'This requires converting the tree to a graph (including parent pointers) then using BFS to find closest leaf.',
          order: 2
        },
        {
          problemId: 545,
          question: 'What is optimal for Boundary of Binary Tree (Complex Traversal)?',
          options: JSON.stringify([
            'Multi-step Traversal: Left, Leaves, Right',
            'Inorder Traversal',
            'Level Order Traversal',
            'Postorder Traversal'
          ]),
          correctAnswer: 'Multi-step Traversal: Left, Leaves, Right',
          explanation: 'Boundary traversal requires left boundary, leaves, and right boundary in specific order.',
          order: 3
        },
        {
          problemId: 549,
          question: 'Which approach for Binary Tree Longest Consecutive Sequence II (Path DP)?',
          options: JSON.stringify([
            'DFS with Path Tracking',
            'BFS with Level Tracking',
            'Inorder Traversal',
            'Postorder Traversal'
          ]),
          correctAnswer: 'DFS with Path Tracking',
          explanation: 'This requires tracking both increasing and decreasing consecutive sequences in tree paths.',
          order: 4
        },
        {
          problemId: 783,
          question: 'What is best for Minimum Distance Between BST Nodes (Inorder)?',
          options: JSON.stringify([
            'Inorder Traversal with Adjacent Tracking',
            'BFS with Level Tracking',
            'DFS with Path Tracking',
            'Postorder Traversal'
          ]),
          correctAnswer: 'Inorder Traversal with Adjacent Tracking',
          explanation: 'Inorder traversal of BST gives sorted order, so minimum difference is between adjacent elements.',
          order: 5
        }
      );
      break;

    case 'String':
      questions.push(
        {
          problemId: 730,
          question: 'What is the optimal approach for Count Different Palindromic Subsequences (Complex DP)?',
          options: JSON.stringify([
            'Interval DP with State Tracking',
            'Two Pointers',
            'Sliding Window',
            'Hash Table'
          ]),
          correctAnswer: 'Interval DP with State Tracking',
          explanation: 'This requires complex DP to count distinct palindromic subsequences, avoiding duplicates.',
          order: 1
        },
        {
          problemId: 727,
          question: 'Which approach for Minimum Window Subsequence (Advanced Sliding Window)?',
          options: JSON.stringify([
            'Dynamic Programming with Sliding Window',
            'Two Pointers',
            'Binary Search',
            'Hash Table'
          ]),
          correctAnswer: 'Dynamic Programming with Sliding Window',
          explanation: 'This requires finding minimum window containing a subsequence, solved with DP and sliding window.',
          order: 2
        },
        {
          problemId: 745,
          question: 'What is optimal for Prefix and Suffix Search (Trie Design)?',
          options: JSON.stringify([
            'Trie with Prefix-Suffix Mapping',
            'Hash Table with Brute Force',
            'Binary Search',
            'Two Pointers'
          ]),
          correctAnswer: 'Trie with Prefix-Suffix Mapping',
          explanation: 'This requires efficient search by both prefix and suffix, best solved with specialized trie design.',
          order: 3
        },
        {
          problemId: 736,
          question: 'Which approach for Parse Lisp Expression (Complex Parsing)?',
          options: JSON.stringify([
            'Recursive Descent Parser with Scope',
            'Stack-based Parsing',
            'Two Pointers',
            'Hash Table'
          ]),
          correctAnswer: 'Recursive Descent Parser with Scope',
          explanation: 'Lisp expression parsing requires handling nested scopes and variable bindings recursively.',
          order: 4
        },
        {
          problemId: 761,
          question: 'What is best for Special Binary String (Recursive Pattern)?',
          options: JSON.stringify([
            'Recursive Pattern Matching with Sorting',
            'Two Pointers',
            'Sliding Window',
            'Hash Table'
          ]),
          correctAnswer: 'Recursive Pattern Matching with Sorting',
          explanation: 'This requires identifying and sorting special binary string patterns recursively.',
          order: 5
        }
      );
      break;

    case 'Array':
      questions.push(
        {
          problemId: 699,
          question: 'What is the optimal approach for Falling Squares (Segment Tree)?',
          options: JSON.stringify([
            'Segment Tree with Lazy Propagation',
            'Binary Search',
            'Two Pointers',
            'Hash Table'
          ]),
          correctAnswer: 'Segment Tree with Lazy Propagation',
          explanation: 'Falling Squares requires range updates and range maximum queries, efficiently solved with segment tree.',
          order: 1
        },
        {
          problemId: 715,
          question: 'Which approach for Range Module (Interval Management)?',
          options: JSON.stringify([
            'Ordered Map with Interval Operations',
            'Binary Search',
            'Two Pointers',
            'Hash Table'
          ]),
          correctAnswer: 'Ordered Map with Interval Operations',
          explanation: 'Range Module requires efficient interval operations (add, remove, query), best with ordered map.',
          order: 2
        },
        {
          problemId: 719,
          question: 'What is optimal for Find K-th Smallest Pair Distance (Binary Search)?',
          options: JSON.stringify([
            'Binary Search with Two Pointers',
            'Heap-based Approach',
            'Sorting with Brute Force',
            'Hash Table'
          ]),
          correctAnswer: 'Binary Search with Two Pointers',
          explanation: 'This requires binary search on the answer space with two pointers to count pairs.',
          order: 3
        },
        {
          problemId: 768,
          question: 'Which approach for Max Chunks To Make Sorted II (Monotonic Stack)?',
          options: JSON.stringify([
            'Monotonic Stack with Prefix Max',
            'Binary Search',
            'Two Pointers',
            'Hash Table'
          ]),
          correctAnswer: 'Monotonic Stack with Prefix Max',
          explanation: 'This requires finding maximum chunks that can be sorted, solved with monotonic stack.',
          order: 4
        },
        {
          problemId: 782,
          question: 'What is best for Transform to Chessboard (Pattern Analysis)?',
          options: JSON.stringify([
            'Pattern Analysis with Bit Manipulation',
            'Binary Search',
            'Two Pointers',
            'Hash Table'
          ]),
          correctAnswer: 'Pattern Analysis with Bit Manipulation',
          explanation: 'This requires analyzing chessboard patterns and calculating minimum moves with bit manipulation.',
          order: 5
        }
      );
      break;

    case 'Design':
      questions.push(
        {
          problemId: 716,
          question: 'What is the optimal approach for Max Stack (Advanced Data Structure)?',
          options: JSON.stringify([
            'Doubly Linked List with Heap',
            'Single Stack',
            'Hash Table',
            'Binary Search Tree'
          ]),
          correctAnswer: 'Doubly Linked List with Heap',
          explanation: 'Max Stack requires O(1) push, pop, and max operations, best implemented with DLL and heap.',
          order: 1
        },
        {
          problemId: 588,
          question: 'Which approach for Design In-Memory File System (Trie Design)?',
          options: JSON.stringify([
            'Trie with File System Operations',
            'Hash Table',
            'Binary Search Tree',
            'Linked List'
          ]),
          correctAnswer: 'Trie with File System Operations',
          explanation: 'File system requires hierarchical structure with efficient path operations, best with trie.',
          order: 2
        },
        {
          problemId: 535,
          question: 'What is optimal for Encode and Decode TinyURL (Hash Design)?',
          options: JSON.stringify([
            'Hash Function with Base Conversion',
            'Random String Generation',
            'Sequential IDs',
            'UUID Generation'
          ]),
          correctAnswer: 'Hash Function with Base Conversion',
          explanation: 'URL shortening requires efficient encoding/decoding with collision handling.',
          order: 3
        },
        {
          problemId: 705,
          question: 'Which approach for Design HashSet (Hash Table Design)?',
          options: JSON.stringify([
            'Hash Table with Chaining',
            'Array with Linear Probing',
            'Binary Search Tree',
            'Linked List'
          ]),
          correctAnswer: 'Hash Table with Chaining',
          explanation: 'HashSet requires O(1) average operations, best implemented with hash table and chaining.',
          order: 4
        },
        {
          problemId: 707,
          question: 'What is best for Design Linked List (Data Structure Implementation)?',
          options: JSON.stringify([
            'Doubly Linked List with Sentinel Nodes',
            'Singly Linked List',
            'Array-based Implementation',
            'Hash Table'
          ]),
          correctAnswer: 'Doubly Linked List with Sentinel Nodes',
          explanation: 'Linked list design requires efficient insert/delete operations, best with DLL and sentinel nodes.',
          order: 5
        }
      );
      break;

    case 'Database':
      questions.push(
        {
          problemId: 579,
          question: 'What is the optimal approach for Find Cumulative Salary (Advanced Window Functions)?',
          options: JSON.stringify([
            'Window Function with Self Join Exclusion',
            'Subquery Approach',
            'CTE with Recursion',
            'Temporary Table'
          ]),
          correctAnswer: 'Window Function with Self Join Exclusion',
          explanation: 'This requires cumulative sum excluding the maximum salary, solved with window functions and self join.',
          order: 1
        },
        {
          problemId: 571,
          question: 'Which approach for Find Median Given Frequency (Advanced Statistics)?',
          options: JSON.stringify([
            'Window Function with Cumulative Sum',
            'Subquery with ROW_NUMBER',
            'CTE with Recursion',
            'Temporary Table'
          ]),
          correctAnswer: 'Window Function with Cumulative Sum',
          explanation: 'Finding median from frequency table requires cumulative sum and window functions.',
          order: 2
        },
        {
          problemId: 569,
          question: 'What is optimal for Median Employee Salary (Advanced Window Functions)?',
          options: JSON.stringify([
            'Window Function with PARTITION BY',
            'Subquery Approach',
            'CTE with Recursion',
            'Temporary Table'
          ]),
          correctAnswer: 'Window Function with PARTITION BY',
          explanation: 'Finding median per department requires window functions with partitioning.',
          order: 3
        },
        {
          problemId: 585,
          question: 'Which approach for Investments in 2016 (Complex Aggregation)?',
          options: JSON.stringify([
            'Window Function with Multiple Conditions',
            'Subquery Approach',
            'CTE with Recursion',
            'Temporary Table'
          ]),
          correctAnswer: 'Window Function with Multiple Conditions',
          explanation: 'This requires complex aggregation with multiple conditions, best with window functions.',
          order: 4
        },
        {
          problemId: 550,
          question: 'What is best for Game Play Analysis IV (Retention Analysis)?',
          options: JSON.stringify([
            'Self Join with Date Functions',
            'Window Function',
            'Subquery Approach',
            'CTE with Recursion'
          ]),
          correctAnswer: 'Self Join with Date Functions',
          explanation: 'Player retention analysis requires self join with date arithmetic.',
          order: 5
        }
      );
      break;

    case 'Math':
      questions.push(
        {
          problemId: 793,
          question: 'What is the optimal approach for Preimage Size of Factorial Zeroes (Number Theory)?',
          options: JSON.stringify([
            'Binary Search with Trailing Zero Count',
            'Brute Force',
            'Dynamic Programming',
            'Hash Table'
          ]),
          correctAnswer: 'Binary Search with Trailing Zero Count',
          explanation: 'This requires binary search on the answer space with efficient trailing zero counting.',
          order: 1
        },
        {
          problemId: 780,
          question: 'Which approach for Reaching Points (Reverse Math)?',
          options: JSON.stringify([
            'Reverse Process with GCD',
            'Forward Simulation',
            'Dynamic Programming',
            'Binary Search'
          ]),
          correctAnswer: 'Reverse Process with GCD',
          explanation: 'This requires working backwards from target to source using GCD properties.',
          order: 2
        },
        {
          problemId: 754,
          question: 'What is optimal for Reach a Number (Pattern Analysis)?',
          options: JSON.stringify([
            'Pattern Analysis with Binary Search',
            'Brute Force',
            'Dynamic Programming',
            'Hash Table'
          ]),
          correctAnswer: 'Pattern Analysis with Binary Search',
          explanation: 'This requires analyzing the pattern of reachable numbers and using binary search.',
          order: 3
        },
        {
          problemId: 564,
          question: 'Which approach for Find the Closest Palindrome (Palindrome Construction)?',
          options: JSON.stringify([
            'Palindrome Construction with Edge Cases',
            'Brute Force',
            'Dynamic Programming',
            'Binary Search'
          ]),
          correctAnswer: 'Palindrome Construction with Edge Cases',
          explanation: 'This requires constructing palindromes and handling edge cases carefully.',
          order: 4
        },
        {
          problemId: 762,
          question: 'What is best for Prime Number of Set Bits (Bit Manipulation)?',
          options: JSON.stringify([
            'Bit Manipulation with Prime Check',
            'Brute Force',
            'Dynamic Programming',
            'Hash Table'
          ]),
          correctAnswer: 'Bit Manipulation with Prime Check',
          explanation: 'This requires counting set bits and checking primality efficiently.',
          order: 5
        }
      );
      break;
  }

  return questions;
}
