"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface DataStructure {
	id: string;
	name: string;
	category: string;
	description: string;
	complexity: {
		time: {
			access: string;
			search: string;
			insertion: string;
			deletion: string;
		};
		space: string;
	};
	operations: string[];
	useCases: string[];
	visualization: string;
	code: string;
}

const dataStructures: DataStructure[] = [
	{
		id: "array",
		name: "Array",
		category: "Linear",
		description:
			"A collection of elements stored at contiguous memory locations.",
		complexity: {
			time: {
				access: "O(1)",
				search: "O(n)",
				insertion: "O(n)",
				deletion: "O(n)",
			},
			space: "O(n)",
		},
		operations: [
			"Access by index",
			"Search",
			"Insertion",
			"Deletion",
			"Traversal",
		],
		useCases: [
			"Storing sequential data",
			"Matrix operations",
			"Buffer management",
		],
		visualization: `
┌─────┬─────┬─────┬─────┬─────┐
│  1  │  2  │  3  │  4  │  5  │
└─────┴─────┴─────┴─────┴─────┘
  0     1     2     3     4
    `,
		code: `// Array declaration
int arr[5] = {1, 2, 3, 4, 5};

// Access element
int element = arr[2]; // O(1)

// Search element
for(int i = 0; i < 5; i++) {
    if(arr[i] == target) return i; // O(n)
}

// Insert at end
arr[5] = 6; // O(1) if space available

// Delete element
// Shift elements to fill gap - O(n)`,
	},
	{
		id: "linked-list",
		name: "Linked List",
		category: "Linear",
		description:
			"A linear data structure where elements are stored in nodes, and each node points to the next node.",
		complexity: {
			time: {
				access: "O(n)",
				search: "O(n)",
				insertion: "O(1)",
				deletion: "O(1)",
			},
			space: "O(n)",
		},
		operations: ["Insertion at head/tail", "Deletion", "Traversal", "Search"],
		useCases: [
			"Dynamic memory allocation",
			"Undo functionality",
			"Music playlist",
		],
		visualization: `
┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐
│  1  │───▶│  2  │───▶│  3  │───▶│  4  │
└─────┘    └─────┘    └─────┘    └─────┘
  head                              tail
    `,
		code: `// Node structure
struct Node {
    int data;
    Node* next;
};

// Insert at head
Node* newNode = new Node(data);
newNode->next = head;
head = newNode; // O(1)

// Delete node
prev->next = curr->next;
delete curr; // O(1) if position known

// Search
Node* current = head;
while(current != NULL) {
    if(current->data == target) return current; // O(n)
    current = current->next;
}`,
	},
	{
		id: "stack",
		name: "Stack",
		category: "Linear",
		description:
			"A LIFO (Last In, First Out) data structure where elements are added and removed from the same end.",
		complexity: {
			time: {
				access: "O(n)",
				search: "O(n)",
				insertion: "O(1)",
				deletion: "O(1)",
			},
			space: "O(n)",
		},
		operations: ["Push", "Pop", "Peek", "isEmpty", "Size"],
		useCases: [
			"Function call stack",
			"Undo operations",
			"Expression evaluation",
		],
		visualization: `
    ┌─────┐ ← Top
    │  5  │
    ├─────┤
    │  4  │
    ├─────┤
    │  3  │
    ├─────┤
    │  2  │
    ├─────┤
    │  1  │ ← Bottom
    └─────┘
    `,
		code: `// Stack using array
class Stack {
    int top;
    int arr[MAX];
    
public:
    void push(int x) {
        if(top < MAX) {
            arr[++top] = x; // O(1)
        }
    }
    
    int pop() {
        if(top >= 0) {
            return arr[top--]; // O(1)
        }
        return -1;
    }
    
    int peek() {
        return arr[top]; // O(1)
    }
};`,
	},
	{
		id: "queue",
		name: "Queue",
		category: "Linear",
		description:
			"A FIFO (First In, First Out) data structure where elements are added at the rear and removed from the front.",
		complexity: {
			time: {
				access: "O(n)",
				search: "O(n)",
				insertion: "O(1)",
				deletion: "O(1)",
			},
			space: "O(n)",
		},
		operations: ["Enqueue", "Dequeue", "Front", "Rear", "isEmpty", "Size"],
		useCases: ["Process scheduling", "Breadth-first search", "Print spooling"],
		visualization: `
┌─────┬─────┬─────┬─────┬─────┐
│  1  │  2  │  3  │  4  │  5  │
└─────┴─────┴─────┴─────┴─────┘
  ↑                           ↑
 Front                      Rear
    `,
		code: `// Queue using array
class Queue {
    int front, rear, size;
    int arr[MAX];
    
public:
    void enqueue(int x) {
        if(size < MAX) {
            arr[rear] = x;
            rear = (rear + 1) % MAX; // O(1)
            size++;
        }
    }
    
    int dequeue() {
        if(size > 0) {
            int x = arr[front];
            front = (front + 1) % MAX; // O(1)
            size--;
            return x;
        }
        return -1;
    }
};`,
	},
	{
		id: "binary-tree",
		name: "Binary Tree",
		category: "Tree",
		description:
			"A hierarchical data structure where each node has at most two children, referred to as left and right child.",
		complexity: {
			time: {
				access: "O(n)",
				search: "O(n)",
				insertion: "O(n)",
				deletion: "O(n)",
			},
			space: "O(n)",
		},
		operations: [
			"Insertion",
			"Deletion",
			"Traversal (Inorder, Preorder, Postorder)",
			"Search",
		],
		useCases: ["Expression trees", "File system", "Decision trees"],
		visualization: `
        ┌─── 1 ───┐
        │         │
    ┌─── 2 ───┐   3
    │         │
    4         5
    `,
		code: `// Binary Tree Node
struct Node {
    int data;
    Node* left;
    Node* right;
};

// Inorder Traversal
void inorder(Node* root) {
    if(root != NULL) {
        inorder(root->left);    // Left
        cout << root->data;     // Root
        inorder(root->right);   // Right
    }
}

// Insertion
Node* insert(Node* root, int data) {
    if(root == NULL) {
        return new Node(data);
    }
    if(data < root->data) {
        root->left = insert(root->left, data);
    } else {
        root->right = insert(root->right, data);
    }
    return root;
}`,
	},
	{
		id: "binary-search-tree",
		name: "Binary Search Tree",
		category: "Tree",
		description:
			"A binary tree where the left subtree contains nodes with values less than the parent, and right subtree contains greater values.",
		complexity: {
			time: {
				access: "O(log n)",
				search: "O(log n)",
				insertion: "O(log n)",
				deletion: "O(log n)",
			},
			space: "O(n)",
		},
		operations: [
			"Search",
			"Insertion",
			"Deletion",
			"Traversal",
			"Find Min/Max",
		],
		useCases: ["Database indexing", "Symbol tables", "Priority queues"],
		visualization: `
        ┌─── 8 ───┐
        │         │
    ┌─── 3 ───┐   10
    │         │
    1         6
    `,
		code: `// BST Search
Node* search(Node* root, int key) {
    if(root == NULL || root->data == key) {
        return root;
    }
    if(key < root->data) {
        return search(root->left, key);  // O(log n)
    }
    return search(root->right, key);
}

// BST Insertion
Node* insert(Node* root, int data) {
    if(root == NULL) {
        return new Node(data);
    }
    if(data < root->data) {
        root->left = insert(root->left, data);
    } else if(data > root->data) {
        root->right = insert(root->right, data);
    }
    return root; // O(log n)
}`,
	},
	{
		id: "hash-table",
		name: "Hash Table",
		category: "Hash",
		description:
			"A data structure that stores key-value pairs and uses a hash function to compute an index into an array of buckets.",
		complexity: {
			time: {
				access: "O(1)",
				search: "O(1)",
				insertion: "O(1)",
				deletion: "O(1)",
			},
			space: "O(n)",
		},
		operations: ["Insert", "Delete", "Search", "Update"],
		useCases: ["Database indexing", "Caching", "Symbol tables", "Dictionaries"],
		visualization: `
Hash Function: h(x) = x % 7

┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│  0  │  1  │  2  │  3  │  4  │  5  │  6  │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ 14  │ 15  │ 16  │ 17  │ 18  │ 19  │ 20  │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘
    `,
		code: `// Hash Table implementation
class HashTable {
    vector<list<pair<int, int>>> table;
    int size;
    
    int hash(int key) {
        return key % size;
    }
    
public:
    void insert(int key, int value) {
        int index = hash(key);
        table[index].push_back({key, value}); // O(1)
    }
    
    int search(int key) {
        int index = hash(key);
        for(auto& pair : table[index]) {
            if(pair.first == key) {
                return pair.second; // O(1) average
            }
        }
        return -1;
    }
};`,
	},
	{
		id: "heap",
		name: "Heap",
		category: "Tree",
		description:
			"A specialized tree-based data structure that satisfies the heap property (max-heap or min-heap).",
		complexity: {
			time: {
				access: "O(1)",
				search: "O(n)",
				insertion: "O(log n)",
				deletion: "O(log n)",
			},
			space: "O(n)",
		},
		operations: ["Insert", "Delete", "Extract Max/Min", "Heapify"],
		useCases: ["Priority queues", "Heap sort", "Graph algorithms (Dijkstra)"],
		visualization: `
        ┌─── 10 ───┐
        │          │
    ┌─── 8 ───┐    9
    │         │
    5         7
    `,
		code: `// Max Heap implementation
class MaxHeap {
    vector<int> heap;
    
    void heapifyUp(int index) {
        int parent = (index - 1) / 2;
        if(index > 0 && heap[parent] < heap[index]) {
            swap(heap[parent], heap[index]);
            heapifyUp(parent); // O(log n)
        }
    }
    
public:
    void insert(int value) {
        heap.push_back(value);
        heapifyUp(heap.size() - 1); // O(log n)
    }
    
    int extractMax() {
        if(heap.empty()) return -1;
        int max = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        heapifyDown(0); // O(log n)
        return max;
    }
};`,
	},
];

export default function DataStructuresPage() {
	const [structures, _setStructures] =
		useState<DataStructure[]>(dataStructures);
	const [selectedStructure, setSelectedStructure] =
		useState<DataStructure | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [showCode, setShowCode] = useState(false);
	const [animationSpeed, _setAnimationSpeed] = useState(1000);
	const [isAnimating, setIsAnimating] = useState(false);

	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			router.push("/auth/login");
		}
	};

	const selectStructure = (structure: DataStructure) => {
		setSelectedStructure(structure);
		setShowCode(false);
		setIsAnimating(false);
	};

	const startAnimation = () => {
		setIsAnimating(true);
		// Simulate animation
		setTimeout(() => setIsAnimating(false), animationSpeed);
	};

	const filteredStructures = structures.filter((structure) => {
		const categoryMatch =
			selectedCategory === "all" || structure.category === selectedCategory;
		return categoryMatch;
	});

	const categories = [
		...new Set(structures.map((structure) => structure.category)),
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="px-4 py-6 sm:px-0">
					<h1 className="text-3xl font-bold text-gray-900">
						Data Structures Visualizer
					</h1>
					<p className="mt-2 text-gray-600">
						Learn and visualize different data structures and their operations
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Structure List */}
					<div className="lg:col-span-1">
						<div className="bg-white shadow rounded-lg">
							<div className="px-4 py-5 sm:p-6">
								<h3 className="text-lg font-medium text-gray-900 mb-4">
									Data Structures
								</h3>

								{/* Category Filter */}
								<div className="mb-4">
									<select
										value={selectedCategory}
										onChange={(e) => setSelectedCategory(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
									>
										<option value="all">All Categories</option>
										{categories.map((cat) => (
											<option key={cat} value={cat}>
												{cat}
											</option>
										))}
									</select>
								</div>

								<div className="space-y-2">
									{filteredStructures.map((structure) => (
										<button
											key={structure.id}
											onClick={() => selectStructure(structure)}
											className={`w-full text-left p-3 rounded-lg border transition-colors ${
												selectedStructure?.id === structure.id
													? "border-indigo-500 bg-indigo-50"
													: "border-gray-200 hover:border-gray-300"
											}`}
										>
											<div className="font-medium text-gray-900">
												{structure.name}
											</div>
											<div className="text-sm text-gray-500 mt-1">
												{structure.description}
											</div>
											<div className="flex items-center space-x-2 mt-2">
												<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													{structure.category}
												</span>
												<span className="text-xs text-gray-500">
													Access: {structure.complexity.time.access}
												</span>
											</div>
										</button>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Structure Details */}
					<div className="lg:col-span-2">
						{selectedStructure ? (
							<div className="space-y-6">
								{/* Header and Controls */}
								<div className="bg-white shadow rounded-lg p-4">
									<div className="flex justify-between items-center">
										<div>
											<h2 className="text-xl font-semibold text-gray-900">
												{selectedStructure.name}
											</h2>
											<p className="text-gray-600">
												{selectedStructure.description}
											</p>
										</div>
										<div className="space-x-2">
											<button
												onClick={() => setShowCode(!showCode)}
												className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
											>
												{showCode ? "Hide" : "Show"} Code
											</button>
											<button
												onClick={startAnimation}
												disabled={isAnimating}
												className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:opacity-50"
											>
												{isAnimating ? "Animating..." : "Animate"}
											</button>
										</div>
									</div>
								</div>

								{/* Visualization */}
								<div className="bg-white shadow rounded-lg">
									<div className="px-4 py-5 sm:p-6">
										<h3 className="text-lg font-medium text-gray-900 mb-3">
											Visualization
										</h3>
										<div
											className={`bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm transition-all duration-${animationSpeed} ${
												isAnimating ? "scale-105" : "scale-100"
											}`}
										>
											<pre>{selectedStructure.visualization}</pre>
										</div>
									</div>
								</div>

								{/* Complexity Analysis */}
								<div className="bg-white shadow rounded-lg">
									<div className="px-4 py-5 sm:p-6">
										<h3 className="text-lg font-medium text-gray-900 mb-3">
											Time & Space Complexity
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<h4 className="font-medium text-gray-900 mb-2">
													Time Complexity
												</h4>
												<div className="space-y-1 text-sm">
													<div className="flex justify-between">
														<span>Access:</span>
														<span className="font-mono">
															{selectedStructure.complexity.time.access}
														</span>
													</div>
													<div className="flex justify-between">
														<span>Search:</span>
														<span className="font-mono">
															{selectedStructure.complexity.time.search}
														</span>
													</div>
													<div className="flex justify-between">
														<span>Insertion:</span>
														<span className="font-mono">
															{selectedStructure.complexity.time.insertion}
														</span>
													</div>
													<div className="flex justify-between">
														<span>Deletion:</span>
														<span className="font-mono">
															{selectedStructure.complexity.time.deletion}
														</span>
													</div>
												</div>
											</div>
											<div>
												<h4 className="font-medium text-gray-900 mb-2">
													Space Complexity
												</h4>
												<div className="text-sm">
													<span className="font-mono">
														{selectedStructure.complexity.space}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Operations and Use Cases */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="bg-white shadow rounded-lg">
										<div className="px-4 py-5 sm:p-6">
											<h3 className="text-lg font-medium text-gray-900 mb-3">
												Common Operations
											</h3>
											<ul className="list-disc list-inside space-y-1 text-sm">
												{selectedStructure.operations.map((op, index) => (
													<li key={index} className="text-gray-700">
														{op}
													</li>
												))}
											</ul>
										</div>
									</div>

									<div className="bg-white shadow rounded-lg">
										<div className="px-4 py-5 sm:p-6">
											<h3 className="text-lg font-medium text-gray-900 mb-3">
												Use Cases
											</h3>
											<ul className="list-disc list-inside space-y-1 text-sm">
												{selectedStructure.useCases.map((useCase, index) => (
													<li key={index} className="text-gray-700">
														{useCase}
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>

								{/* Code Implementation */}
								{showCode && (
									<div className="bg-white shadow rounded-lg">
										<div className="px-4 py-5 sm:p-6">
											<h3 className="text-lg font-medium text-gray-900 mb-3">
												Implementation
											</h3>
											<pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
												<code>{selectedStructure.code}</code>
											</pre>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="bg-white shadow rounded-lg">
								<div className="px-4 py-5 sm:p-6 text-center">
									<svg
										className="mx-auto h-12 w-12 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
										/>
									</svg>
									<h3 className="mt-2 text-sm font-medium text-gray-900">
										Select a Data Structure
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										Choose a data structure from the list to learn more about
										it.
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
