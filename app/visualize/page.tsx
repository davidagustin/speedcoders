"use client";

import { useEffect, useRef, useState } from "react";

type AlgorithmType = "sorting" | "searching" | "graph" | "dynamic" | "tree";

interface Visualization {
	id: string;
	name: string;
	type: AlgorithmType;
	description: string;
	complexity: {
		time: string;
		space: string;
	};
}

export default function VisualizePage() {
	const [selectedAlgo, setSelectedAlgo] = useState<string>("bubble-sort");
	const [array, setArray] = useState<number[]>([]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [speed, setSpeed] = useState(50);
	const [comparing, setComparing] = useState<number[]>([]);
	const [sorted, setSorted] = useState<number[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [code, setCode] = useState<string[]>([]);
	const [highlightedLine, setHighlightedLine] = useState<number>(-1);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const algorithms: Record<string, Visualization> = {
		"bubble-sort": {
			id: "bubble-sort",
			name: "Bubble Sort",
			type: "sorting",
			description:
				"Repeatedly steps through the list, compares adjacent elements and swaps them if they are in wrong order",
			complexity: { time: "O(n²)", space: "O(1)" },
		},
		"quick-sort": {
			id: "quick-sort",
			name: "Quick Sort",
			type: "sorting",
			description:
				"Divides array into smaller sub-arrays around a pivot element",
			complexity: { time: "O(n log n)", space: "O(log n)" },
		},
		"merge-sort": {
			id: "merge-sort",
			name: "Merge Sort",
			type: "sorting",
			description:
				"Divides array in half, sorts each half, then merges them back together",
			complexity: { time: "O(n log n)", space: "O(n)" },
		},
		"binary-search": {
			id: "binary-search",
			name: "Binary Search",
			type: "searching",
			description:
				"Searches a sorted array by repeatedly dividing the search interval in half",
			complexity: { time: "O(log n)", space: "O(1)" },
		},
		bfs: {
			id: "bfs",
			name: "Breadth-First Search",
			type: "graph",
			description:
				"Explores all vertices at the present depth before moving to vertices at the next depth",
			complexity: { time: "O(V + E)", space: "O(V)" },
		},
		dfs: {
			id: "dfs",
			name: "Depth-First Search",
			type: "graph",
			description:
				"Explores as far as possible along each branch before backtracking",
			complexity: { time: "O(V + E)", space: "O(V)" },
		},
		dijkstra: {
			id: "dijkstra",
			name: "Dijkstra's Algorithm",
			type: "graph",
			description: "Finds the shortest paths between nodes in a graph",
			complexity: { time: "O(V²)", space: "O(V)" },
		},
	};

	useEffect(() => {
		generateRandomArray();
		loadCode(selectedAlgo);
	}, [selectedAlgo, generateRandomArray, loadCode]);

	const generateRandomArray = () => {
		const newArray = Array.from(
			{ length: 20 },
			() => Math.floor(Math.random() * 100) + 1,
		);
		setArray(newArray);
		setComparing([]);
		setSorted([]);
		setCurrentStep(0);
	};

	const loadCode = (algoId: string) => {
		const codes: Record<string, string[]> = {
			"bubble-sort": [
				"function bubbleSort(arr) {",
				"  for (let i = 0; i < arr.length; i++) {",
				"    for (let j = 0; j < arr.length - i - 1; j++) {",
				"      if (arr[j] > arr[j + 1]) {",
				"        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];",
				"      }",
				"    }",
				"  }",
				"  return arr;",
				"}",
			],
			"quick-sort": [
				"function quickSort(arr, low = 0, high = arr.length - 1) {",
				"  if (low < high) {",
				"    const pi = partition(arr, low, high);",
				"    quickSort(arr, low, pi - 1);",
				"    quickSort(arr, pi + 1, high);",
				"  }",
				"  return arr;",
				"}",
			],
			"binary-search": [
				"function binarySearch(arr, target) {",
				"  let left = 0, right = arr.length - 1;",
				"  while (left <= right) {",
				"    const mid = Math.floor((left + right) / 2);",
				"    if (arr[mid] === target) return mid;",
				"    if (arr[mid] < target) left = mid + 1;",
				"    else right = mid - 1;",
				"  }",
				"  return -1;",
				"}",
			],
		};
		setCode(codes[algoId] || []);
	};

	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	const bubbleSort = async () => {
		const arr = [...array];
		const n = arr.length;

		for (let i = 0; i < n; i++) {
			setHighlightedLine(1);
			for (let j = 0; j < n - i - 1; j++) {
				setHighlightedLine(2);
				setComparing([j, j + 1]);
				await sleep(100 - speed);

				if (arr[j] > arr[j + 1]) {
					setHighlightedLine(3);
					await sleep(100 - speed);
					[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
					setArray([...arr]);
					setHighlightedLine(4);
					await sleep(100 - speed);
				}
			}
			setSorted((prev) => [...prev, n - i - 1]);
		}
		setHighlightedLine(-1);
		setComparing([]);
	};

	const startVisualization = async () => {
		setIsPlaying(true);
		setSorted([]);
		setComparing([]);

		switch (selectedAlgo) {
			case "bubble-sort":
				await bubbleSort();
				break;
			// Add other algorithm implementations
		}

		setIsPlaying(false);
	};

	const drawGraph = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw nodes
		const nodes = [
			{ x: 100, y: 100, label: "A" },
			{ x: 250, y: 100, label: "B" },
			{ x: 400, y: 100, label: "C" },
			{ x: 100, y: 250, label: "D" },
			{ x: 250, y: 250, label: "E" },
			{ x: 400, y: 250, label: "F" },
		];

		// Draw edges
		const edges = [
			[0, 1],
			[0, 3],
			[1, 2],
			[1, 4],
			[2, 5],
			[3, 4],
			[4, 5],
		];

		ctx.strokeStyle = "#CBD5E0";
		ctx.lineWidth = 2;
		edges.forEach(([from, to]) => {
			ctx.beginPath();
			ctx.moveTo(nodes[from].x, nodes[from].y);
			ctx.lineTo(nodes[to].x, nodes[to].y);
			ctx.stroke();
		});

		// Draw nodes
		nodes.forEach((node, index) => {
			ctx.beginPath();
			ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
			ctx.fillStyle = currentStep === index ? "#3B82F6" : "#6366F1";
			ctx.fill();
			ctx.strokeStyle = "#4338CA";
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.fillStyle = "white";
			ctx.font = "bold 16px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(node.label, node.x, node.y);
		});
	};

	useEffect(() => {
		if (algorithms[selectedAlgo]?.type === "graph") {
			drawGraph();
		}
	}, [selectedAlgo, drawGraph]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-8">
			<div className="container mx-auto px-4">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold mb-4">🎨 Algorithm Visualizer</h1>
					<p className="text-gray-600 dark:text-gray-300">
						Watch algorithms come to life with interactive visualizations
					</p>
				</div>

				{/* Algorithm Selection */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
					<h2 className="text-xl font-bold mb-4">Select Algorithm</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
						{Object.values(algorithms).map((algo) => (
							<button
								key={algo.id}
								onClick={() => setSelectedAlgo(algo.id)}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
									selectedAlgo === algo.id
										? "bg-indigo-600 text-white"
										: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
								}`}
							>
								{algo.name}
							</button>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Visualization Area */}
					<div className="lg:col-span-2">
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-xl font-bold">
									{algorithms[selectedAlgo]?.name}
								</h3>
								<div className="flex gap-2">
									<button
										onClick={generateRandomArray}
										disabled={isPlaying}
										className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
									>
										Generate New
									</button>
									<button
										onClick={startVisualization}
										disabled={isPlaying}
										className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
									>
										{isPlaying ? "Running..." : "Start"}
									</button>
								</div>
							</div>

							{/* Array Visualization */}
							{algorithms[selectedAlgo]?.type === "sorting" && (
								<div className="mb-6">
									<div
										className="flex justify-center items-end gap-1"
										style={{ height: "300px" }}
									>
										{array.map((value, index) => (
											<div
												key={index}
												className={`transition-all duration-300 ${
													comparing.includes(index)
														? "bg-yellow-500"
														: sorted.includes(index)
															? "bg-green-500"
															: "bg-indigo-500"
												}`}
												style={{
													height: `${(value / 100) * 280}px`,
													width: `${100 / array.length}%`,
													maxWidth: "40px",
												}}
											>
												<div className="text-xs text-white text-center mt-1">
													{value}
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Graph Visualization */}
							{algorithms[selectedAlgo]?.type === "graph" && (
								<div className="mb-6">
									<canvas
										ref={canvasRef}
										width={500}
										height={350}
										className="w-full border border-gray-200 dark:border-gray-700 rounded-lg"
									/>
								</div>
							)}

							{/* Speed Control */}
							<div className="flex items-center gap-4">
								<label className="text-sm font-medium">Speed:</label>
								<input
									type="range"
									min="0"
									max="90"
									value={speed}
									onChange={(e) => setSpeed(Number(e.target.value))}
									className="flex-1"
								/>
								<span className="text-sm">{speed}%</span>
							</div>

							{/* Algorithm Info */}
							<div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
									{algorithms[selectedAlgo]?.description}
								</p>
								<div className="flex gap-6 text-sm">
									<div>
										<span className="font-medium">Time Complexity:</span>{" "}
										<span className="text-indigo-600">
											{algorithms[selectedAlgo]?.complexity.time}
										</span>
									</div>
									<div>
										<span className="font-medium">Space Complexity:</span>{" "}
										<span className="text-purple-600">
											{algorithms[selectedAlgo]?.complexity.space}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Code Panel */}
					<div className="lg:col-span-1">
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
							<h3 className="text-xl font-bold mb-4">Code</h3>
							<div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
								{code.map((line, index) => (
									<div
										key={index}
										className={`${
											highlightedLine === index
												? "bg-yellow-500/20 border-l-4 border-yellow-500 pl-3"
												: "pl-4"
										} transition-all`}
									>
										<span className="text-gray-500 mr-4">{index + 1}</span>
										<span className="text-green-400">{line}</span>
									</div>
								))}
							</div>

							{/* Step-by-Step Explanation */}
							<div className="mt-6">
								<h4 className="font-bold mb-2">Current Step</h4>
								<div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
									<p className="text-sm">
										{highlightedLine === -1
											? "Click Start to begin visualization"
											: highlightedLine === 1
												? "Starting outer loop iteration"
												: highlightedLine === 2
													? "Comparing adjacent elements"
													: highlightedLine === 3
														? "Elements are in wrong order"
														: highlightedLine === 4
															? "Swapping elements"
															: "Processing..."}
									</p>
								</div>
							</div>

							{/* Learning Points */}
							<div className="mt-6">
								<h4 className="font-bold mb-2">Key Learning Points</h4>
								<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
									<li className="flex items-start">
										<span className="text-indigo-600 mr-2">•</span>
										<span>Observe how elements are compared and swapped</span>
									</li>
									<li className="flex items-start">
										<span className="text-indigo-600 mr-2">•</span>
										<span>Notice the pattern of sorted elements</span>
									</li>
									<li className="flex items-start">
										<span className="text-indigo-600 mr-2">•</span>
										<span>Understand time complexity through iterations</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				{/* Algorithm Categories */}
				<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
						<h3 className="text-xl font-bold mb-2">Sorting Algorithms</h3>
						<p className="text-sm opacity-90 mb-4">
							Bubble, Quick, Merge, Heap Sort
						</p>
						<div className="text-3xl">📊</div>
					</div>
					<div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-white">
						<h3 className="text-xl font-bold mb-2">Searching Algorithms</h3>
						<p className="text-sm opacity-90 mb-4">
							Binary, Linear, Jump Search
						</p>
						<div className="text-3xl">🔍</div>
					</div>
					<div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
						<h3 className="text-xl font-bold mb-2">Graph Algorithms</h3>
						<p className="text-sm opacity-90 mb-4">BFS, DFS, Dijkstra, A*</p>
						<div className="text-3xl">🕸️</div>
					</div>
					<div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
						<h3 className="text-xl font-bold mb-2">Dynamic Programming</h3>
						<p className="text-sm opacity-90 mb-4">
							Knapsack, LCS, Edit Distance
						</p>
						<div className="text-3xl">🧩</div>
					</div>
				</div>
			</div>
		</div>
	);
}
