"use client";

import {
	ArrowPathIcon,
	BackwardIcon,
	Cog6ToothIcon,
	ForwardIcon,
	PauseIcon,
	PlayIcon,
	StopIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";

interface VisualizationStep {
	id: number;
	description: string;
	code?: string;
	highlight?: number[];
	data: any;
	comparison?: { indices: number[]; type: "compare" | "swap" | "access" };
}

interface AlgorithmVisualizerProps {
	algorithm:
		| "bubble_sort"
		| "quick_sort"
		| "merge_sort"
		| "binary_search"
		| "dfs"
		| "bfs";
	data: number[] | TreeNode[] | GraphNode[];
	onStepChange?: (step: number, totalSteps: number) => void;
	autoPlay?: boolean;
	speed?: number;
}

interface TreeNode {
	id: string;
	value: number;
	children: TreeNode[];
	x?: number;
	y?: number;
	visited?: boolean;
	current?: boolean;
}

interface GraphNode {
	id: string;
	value: number;
	neighbors: string[];
	x: number;
	y: number;
	visited?: boolean;
	current?: boolean;
	distance?: number;
}

export function AlgorithmVisualizer({
	algorithm,
	data,
	onStepChange,
	autoPlay = false,
	speed = 1000,
}: AlgorithmVisualizerProps) {
	const [steps, setSteps] = useState<VisualizationStep[]>([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [visualData, setVisualData] = useState<any[]>([]);

	useEffect(() => {
		generateSteps();
	}, [algorithm, data]);

	useEffect(() => {
		if (steps.length > 0) {
			setVisualData([...(steps[currentStep]?.data || data)]);
		}
	}, [currentStep, steps, data]);

	useEffect(() => {
		onStepChange?.(currentStep, steps.length);
	}, [currentStep, steps.length, onStepChange]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isPlaying && currentStep < steps.length - 1) {
			interval = setInterval(
				() => {
					setCurrentStep((prev) => {
						if (prev >= steps.length - 1) {
							setIsPlaying(false);
							return prev;
						}
						return prev + 1;
					});
				},
				Math.max(100, 2000 - speed * 1.8),
			);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isPlaying, currentStep, steps.length, speed]);

	useEffect(() => {
		if (autoPlay && steps.length > 0) {
			setIsPlaying(true);
		}
	}, [autoPlay, steps.length]);

	const generateSteps = () => {
		switch (algorithm) {
			case "bubble_sort":
				setSteps(generateBubbleSortSteps(data as number[]));
				break;
			case "quick_sort":
				setSteps(generateQuickSortSteps(data as number[]));
				break;
			case "merge_sort":
				setSteps(generateMergeSortSteps(data as number[]));
				break;
			case "binary_search":
				setSteps(generateBinarySearchSteps(data as number[]));
				break;
			case "dfs":
				setSteps(generateDFSSteps(data as TreeNode[]));
				break;
			case "bfs":
				setSteps(generateBFSSteps(data as TreeNode[]));
				break;
			default:
				setSteps([]);
		}
	};

	const play = () => setIsPlaying(true);
	const pause = () => setIsPlaying(false);
	const stop = () => {
		setIsPlaying(false);
		setCurrentStep(0);
	};
	const stepForward = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep((prev) => prev + 1);
		}
	};
	const stepBackward = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};
	const reset = () => {
		setCurrentStep(0);
		setIsPlaying(false);
	};

	const currentStepData = steps[currentStep];

	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold capitalize">
						{algorithm.replace("_", " ")} Visualization
					</h3>
					<div className="text-sm text-gray-600">
						Step {currentStep + 1} of {steps.length}
					</div>
				</div>

				{/* Controls */}
				<div className="flex items-center gap-2 mb-4">
					<button
						onClick={stepBackward}
						disabled={currentStep === 0}
						className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<BackwardIcon className="w-4 h-4" />
					</button>

					<button
						onClick={isPlaying ? pause : play}
						disabled={currentStep >= steps.length - 1}
						className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isPlaying ? (
							<PauseIcon className="w-4 h-4" />
						) : (
							<PlayIcon className="w-4 h-4" />
						)}
					</button>

					<button
						onClick={stepForward}
						disabled={currentStep >= steps.length - 1}
						className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<ForwardIcon className="w-4 h-4" />
					</button>

					<button
						onClick={stop}
						className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
					>
						<StopIcon className="w-4 h-4" />
					</button>

					<button
						onClick={reset}
						className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
					>
						<ArrowPathIcon className="w-4 h-4" />
					</button>

					<div className="ml-4 flex items-center gap-2">
						<Cog6ToothIcon className="w-4 h-4 text-gray-500" />
						<input
							type="range"
							min="100"
							max="1900"
							value={speed}
							onChange={(e) =>
								onStepChange?.(parseInt(e.target.value), steps.length)
							}
							className="w-20"
						/>
						<span className="text-xs text-gray-500">Speed</span>
					</div>
				</div>

				{/* Progress bar */}
				<div className="w-full bg-gray-200 rounded-full h-2 mb-4">
					<div
						className="bg-blue-600 h-2 rounded-full transition-all duration-300"
						style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
					/>
				</div>

				{/* Step description */}
				{currentStepData && (
					<div className="bg-blue-50 p-3 rounded-lg mb-4">
						<p className="text-sm text-blue-800">
							{currentStepData.description}
						</p>
					</div>
				)}
			</div>

			{/* Visualization Area */}
			<div className="border rounded-lg p-4 min-h-[300px] bg-gray-50">
				{algorithm.includes("sort") || algorithm === "binary_search" ? (
					<ArrayVisualization
						data={visualData}
						comparison={currentStepData?.comparison}
						algorithm={algorithm}
					/>
				) : algorithm === "dfs" || algorithm === "bfs" ? (
					<TreeVisualization data={visualData} algorithm={algorithm} />
				) : (
					<div className="flex items-center justify-center h-full text-gray-500">
						Select an algorithm to visualize
					</div>
				)}
			</div>

			{/* Code display */}
			{currentStepData?.code && (
				<div className="mt-4">
					<h4 className="font-medium mb-2">Current Code:</h4>
					<pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
						{currentStepData.code}
					</pre>
				</div>
			)}
		</div>
	);
}

function ArrayVisualization({
	data,
	comparison,
	algorithm,
}: {
	data: number[];
	comparison?: { indices: number[]; type: "compare" | "swap" | "access" };
	algorithm: string;
}) {
	const maxValue = Math.max(...data);

	return (
		<div className="flex items-end justify-center gap-2 h-64">
			{data.map((value, index) => {
				let bgColor = "bg-blue-500";

				if (comparison?.indices.includes(index)) {
					switch (comparison.type) {
						case "compare":
							bgColor = "bg-yellow-500";
							break;
						case "swap":
							bgColor = "bg-red-500";
							break;
						case "access":
							bgColor = "bg-green-500";
							break;
					}
				}

				const height = (value / maxValue) * 200;

				return (
					<div key={index} className="flex flex-col items-center">
						<div className="text-xs mb-1 text-gray-600">{value}</div>
						<div
							className={`${bgColor} rounded-t transition-all duration-300 min-w-[20px] flex items-end justify-center text-white text-xs font-medium`}
							style={{ height: `${height}px` }}
						>
							{height > 20 && value}
						</div>
						<div className="text-xs mt-1 text-gray-500">{index}</div>
					</div>
				);
			})}
		</div>
	);
}

function TreeVisualization({
	data,
	algorithm,
}: {
	data: TreeNode[];
	algorithm: string;
}) {
	// This is a simplified tree visualization
	// In a real implementation, you'd use a proper graph layout algorithm

	return (
		<div className="flex items-center justify-center h-64">
			<div className="space-y-4">
				{data.map((node, level) => (
					<div key={node.id} className="flex justify-center">
						<div
							className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
								node.current
									? "bg-red-500 text-white border-red-600"
									: node.visited
										? "bg-green-500 text-white border-green-600"
										: "bg-white text-gray-700 border-gray-300"
							}`}
						>
							{node.value}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// Algorithm step generators
function generateBubbleSortSteps(arr: number[]): VisualizationStep[] {
	const steps: VisualizationStep[] = [];
	const data = [...arr];
	let stepId = 0;

	steps.push({
		id: stepId++,
		description:
			"Starting Bubble Sort - Compare adjacent elements and swap if they are in wrong order",
		data: [...data],
	});

	for (let i = 0; i < data.length - 1; i++) {
		for (let j = 0; j < data.length - i - 1; j++) {
			steps.push({
				id: stepId++,
				description: `Comparing elements at positions ${j} and ${j + 1}: ${data[j]} and ${data[j + 1]}`,
				data: [...data],
				comparison: { indices: [j, j + 1], type: "compare" },
			});

			if (data[j] > data[j + 1]) {
				[data[j], data[j + 1]] = [data[j + 1], data[j]];
				steps.push({
					id: stepId++,
					description: `Swapping ${data[j + 1]} and ${data[j]}`,
					data: [...data],
					comparison: { indices: [j, j + 1], type: "swap" },
				});
			}
		}
	}

	steps.push({
		id: stepId++,
		description: "Bubble Sort completed! Array is now sorted.",
		data: [...data],
	});

	return steps;
}

function generateQuickSortSteps(arr: number[]): VisualizationStep[] {
	const steps: VisualizationStep[] = [];
	const data = [...arr];
	let stepId = 0;

	steps.push({
		id: stepId++,
		description: "Starting Quick Sort - Choose pivot and partition array",
		data: [...data],
	});

	// This is a simplified version - a full implementation would be more complex
	const quickSort = (arr: number[], low: number, high: number) => {
		if (low < high) {
			const pivotIndex = partition(arr, low, high);
			quickSort(arr, low, pivotIndex - 1);
			quickSort(arr, pivotIndex + 1, high);
		}
	};

	const partition = (arr: number[], low: number, high: number): number => {
		const pivot = arr[high];
		steps.push({
			id: stepId++,
			description: `Choosing pivot: ${pivot} at position ${high}`,
			data: [...arr],
			comparison: { indices: [high], type: "access" },
		});

		let i = low - 1;
		for (let j = low; j < high; j++) {
			steps.push({
				id: stepId++,
				description: `Comparing ${arr[j]} with pivot ${pivot}`,
				data: [...arr],
				comparison: { indices: [j, high], type: "compare" },
			});

			if (arr[j] < pivot) {
				i++;
				[arr[i], arr[j]] = [arr[j], arr[i]];
				if (i !== j) {
					steps.push({
						id: stepId++,
						description: `Swapping ${arr[j]} and ${arr[i]}`,
						data: [...arr],
						comparison: { indices: [i, j], type: "swap" },
					});
				}
			}
		}

		[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
		steps.push({
			id: stepId++,
			description: `Placing pivot ${pivot} in correct position`,
			data: [...arr],
			comparison: { indices: [i + 1, high], type: "swap" },
		});

		return i + 1;
	};

	quickSort(data, 0, data.length - 1);

	steps.push({
		id: stepId++,
		description: "Quick Sort completed!",
		data: [...data],
	});

	return steps;
}

function generateMergeSortSteps(arr: number[]): VisualizationStep[] {
	// Simplified merge sort visualization
	return [
		{
			id: 0,
			description: "Merge Sort visualization (simplified)",
			data: [...arr].sort((a, b) => a - b),
		},
	];
}

function generateBinarySearchSteps(arr: number[]): VisualizationStep[] {
	const steps: VisualizationStep[] = [];
	const sortedArr = [...arr].sort((a, b) => a - b);
	const target = sortedArr[Math.floor(Math.random() * sortedArr.length)];
	let stepId = 0;

	let left = 0;
	let right = sortedArr.length - 1;

	steps.push({
		id: stepId++,
		description: `Starting Binary Search for target value: ${target}`,
		data: [...sortedArr],
	});

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);

		steps.push({
			id: stepId++,
			description: `Checking middle element at position ${mid}: ${sortedArr[mid]}`,
			data: [...sortedArr],
			comparison: { indices: [mid], type: "access" },
		});

		if (sortedArr[mid] === target) {
			steps.push({
				id: stepId++,
				description: `Found target ${target} at position ${mid}!`,
				data: [...sortedArr],
				comparison: { indices: [mid], type: "access" },
			});
			break;
		} else if (sortedArr[mid] < target) {
			steps.push({
				id: stepId++,
				description: `${sortedArr[mid]} < ${target}, searching right half`,
				data: [...sortedArr],
				comparison: { indices: [mid], type: "compare" },
			});
			left = mid + 1;
		} else {
			steps.push({
				id: stepId++,
				description: `${sortedArr[mid]} > ${target}, searching left half`,
				data: [...sortedArr],
				comparison: { indices: [mid], type: "compare" },
			});
			right = mid - 1;
		}
	}

	return steps;
}

function generateDFSSteps(nodes: TreeNode[]): VisualizationStep[] {
	// Simplified DFS visualization
	return nodes.map((node, index) => ({
		id: index,
		description: `Visiting node ${node.value}`,
		data: nodes.map((n, i) => ({
			...n,
			visited: i <= index,
			current: i === index,
		})),
	}));
}

function generateBFSSteps(nodes: TreeNode[]): VisualizationStep[] {
	// Simplified BFS visualization
	return nodes.map((node, index) => ({
		id: index,
		description: `Visiting node ${node.value} (BFS order)`,
		data: nodes.map((n, i) => ({
			...n,
			visited: i <= index,
			current: i === index,
		})),
	}));
}
