import { editorialProblems } from "./editorial-problems";

export interface AlgorithmValidationResult {
	isCorrect: boolean;
	confidence: number;
	explanation: string;
	alternativeApproaches: string[];
	optimizationSuggestions: string[];
}

export interface DifficultyAnalysis {
	estimatedDifficulty: "Easy" | "Medium" | "Hard";
	factors: {
		algorithmComplexity: number;
		implementationComplexity: number;
		conceptualDifficulty: number;
		edgeCaseHandling: number;
	};
	reasoning: string;
}

// Algorithm complexity scoring
const ALGORITHM_COMPLEXITY_SCORES = {
	Array: 2,
	String: 2,
	"Hash Table": 3,
	"Two Pointers": 3,
	"Sliding Window": 4,
	"Binary Search": 4,
	Stack: 3,
	Queue: 3,
	"Linked List": 3,
	Tree: 5,
	"Binary Tree": 5,
	BST: 6,
	Graph: 7,
	DFS: 6,
	BFS: 6,
	"Dynamic Programming": 8,
	Greedy: 5,
	Backtracking: 7,
	"Divide and Conquer": 6,
	Heap: 6,
	Trie: 7,
	"Union Find": 6,
	"Topological Sort": 7,
	"Bit Manipulation": 5,
	Math: 4,
	Geometry: 6,
	Design: 5,
	Simulation: 3,
	Interactive: 4,
	"String Matching": 6,
	"Rolling Hash": 7,
	"Suffix Array": 8,
	"Segment Tree": 9,
	"Binary Indexed Tree": 8,
	"Monotonic Stack": 6,
	"Monotonic Queue": 6,
};

export class AlgorithmValidator {
	private algorithmPatterns: Map<string, RegExp[]>;

	constructor() {
		this.algorithmPatterns = new Map();
		this.initializePatterns();
	}

	private initializePatterns() {
		this.algorithmPatterns.set("Two Pointers", [
			/let\s+(\w+)\s*=\s*0[,;]?\s*let\s+(\w+)\s*=\s*\w+\.length\s*-\s*1/,
			/while\s*\(\s*\w+\s*<\s*\w+\s*\)/,
			/\w+\+\+.*\w+--/,
		]);

		this.algorithmPatterns.set("Sliding Window", [
			/let\s+(\w+)\s*=\s*0[,;]?\s*let\s+(\w+)\s*=\s*0/,
			/for\s*\(\s*let\s+\w+\s*=\s*0.*\w+\.length/,
			/while\s*\(.*\w+\s*-\s*\w+/,
			/Math\.max\(.*\w+\s*-\s*\w+/,
		]);

		this.algorithmPatterns.set("Hash Table", [
			/new\s+(Map|Set)\(\)/,
			/\.has\(/,
			/\.set\(/,
			/\.get\(/,
			/\{\}/,
		]);

		this.algorithmPatterns.set("Stack", [
			/\.push\(/,
			/\.pop\(/,
			/\[\].*push|pop/,
			/stack/i,
		]);

		this.algorithmPatterns.set("Dynamic Programming", [
			/dp\[/,
			/memo/i,
			/cache/i,
			/for.*for.*dp/,
			/dp\[i\]\[j\]/,
		]);

		this.algorithmPatterns.set("Binary Search", [
			/let\s+(\w+)\s*=\s*0[,;]?\s*let\s+(\w+)\s*=\s*\w+\.length/,
			/while\s*\(\s*\w+\s*<=?\s*\w+\s*\)/,
			/let\s+\w+\s*=\s*Math\.floor\(.*\/\s*2\)/,
			/mid/,
		]);

		this.algorithmPatterns.set("DFS", [
			/function\s+dfs/,
			/const\s+dfs\s*=/,
			/recursive.*call|call.*recursive/i,
			/if.*return/,
			/dfs\(/,
		]);

		this.algorithmPatterns.set("BFS", [
			/new\s+Queue|queue/i,
			/\.shift\(\)/,
			/while\s*\(\s*queue\.length/,
			/for.*of.*queue/,
		]);
	}

	validateAlgorithm(
		code: string,
		expectedAlgorithms: string[],
	): AlgorithmValidationResult {
		let correctCount = 0;
		let _totalPatterns = 0;
		const detectedAlgorithms: string[] = [];
		const explanations: string[] = [];

		for (const algorithm of expectedAlgorithms) {
			const patterns = this.algorithmPatterns.get(algorithm);
			if (patterns) {
				_totalPatterns += patterns.length;
				let algorithmScore = 0;

				for (const pattern of patterns) {
					if (pattern.test(code)) {
						algorithmScore++;
					}
				}

				const algorithmConfidence = algorithmScore / patterns.length;
				if (algorithmConfidence > 0.5) {
					correctCount++;
					detectedAlgorithms.push(algorithm);
					explanations.push(
						`✓ ${algorithm} approach detected (${Math.round(algorithmConfidence * 100)}% confidence)`,
					);
				} else {
					explanations.push(`✗ ${algorithm} approach not clearly implemented`);
				}
			}
		}

		const overallConfidence = correctCount / expectedAlgorithms.length;

		return {
			isCorrect: overallConfidence >= 0.7,
			confidence: overallConfidence,
			explanation: explanations.join("\n"),
			alternativeApproaches: this.suggestAlternatives(expectedAlgorithms),
			optimizationSuggestions: this.generateOptimizations(
				code,
				expectedAlgorithms,
			),
		};
	}

	private suggestAlternatives(algorithms: string[]): string[] {
		const alternatives: string[] = [];

		if (algorithms.includes("Two Pointers")) {
			alternatives.push("Hash Table approach for O(n) space trade-off");
			alternatives.push("Sorting + Two Pointers for different constraints");
		}

		if (algorithms.includes("Dynamic Programming")) {
			alternatives.push("Memoization (top-down) vs Tabulation (bottom-up)");
			alternatives.push("Space-optimized DP using rolling arrays");
		}

		if (algorithms.includes("DFS")) {
			alternatives.push("Iterative DFS using explicit stack");
			alternatives.push("BFS for shortest path problems");
		}

		return alternatives;
	}

	private generateOptimizations(code: string, algorithms: string[]): string[] {
		const optimizations: string[] = [];

		if (
			code.includes("for") &&
			code.includes("for") &&
			algorithms.includes("Dynamic Programming")
		) {
			optimizations.push("Consider space optimization with 1D array");
		}

		if (code.includes("recursion") && !code.includes("memo")) {
			optimizations.push("Add memoization to avoid redundant calculations");
		}

		if (code.includes("sort") && algorithms.includes("Hash Table")) {
			optimizations.push(
				"Hash table approach can avoid sorting for better time complexity",
			);
		}

		return optimizations;
	}

	analyzeDifficulty(problemId: number, userCode: string): DifficultyAnalysis {
		const problem = editorialProblems.find((p) =>
			p.title.includes(problemId.toString()),
		);

		if (!problem) {
			return {
				estimatedDifficulty: "Medium",
				factors: {
					algorithmComplexity: 5,
					implementationComplexity: 5,
					conceptualDifficulty: 5,
					edgeCaseHandling: 5,
				},
				reasoning: "Problem not found in database",
			};
		}

		// Calculate algorithm complexity
		const algorithmComplexity = this.calculateAlgorithmComplexity(
			problem.solutions[0]?.name || "",
		);

		// Analyze implementation complexity from code
		const implementationComplexity =
			this.analyzeImplementationComplexity(userCode);

		// Analyze conceptual difficulty
		const conceptualDifficulty = this.analyzeConceptualDifficulty(problem);

		// Analyze edge case handling
		const edgeCaseHandling = this.analyzeEdgeCaseHandling(userCode, problem);

		const averageScore =
			(algorithmComplexity +
				implementationComplexity +
				conceptualDifficulty +
				edgeCaseHandling) /
			4;

		let estimatedDifficulty: "Easy" | "Medium" | "Hard";
		if (averageScore <= 3) estimatedDifficulty = "Easy";
		else if (averageScore <= 6) estimatedDifficulty = "Medium";
		else estimatedDifficulty = "Hard";

		return {
			estimatedDifficulty,
			factors: {
				algorithmComplexity,
				implementationComplexity,
				conceptualDifficulty,
				edgeCaseHandling,
			},
			reasoning: this.generateDifficultyReasoning(estimatedDifficulty, {
				algorithmComplexity,
				implementationComplexity,
				conceptualDifficulty,
				edgeCaseHandling,
			}),
		};
	}

	private calculateAlgorithmComplexity(algorithm: string): number {
		return (ALGORITHM_COMPLEXITY_SCORES as any)[algorithm] || 5;
	}

	private analyzeImplementationComplexity(code: string): number {
		let complexity = 1;

		// Count nested loops
		const nestedLoops = (code.match(/for.*for/g) || []).length;
		complexity += nestedLoops * 2;

		// Count conditional branches
		const branches = (code.match(/if|else|switch/g) || []).length;
		complexity += branches * 0.5;

		// Count function calls
		const functionCalls = (code.match(/\w+\(/g) || []).length;
		complexity += functionCalls * 0.2;

		return Math.min(Math.ceil(complexity), 10);
	}

	private analyzeConceptualDifficulty(problem: any): number {
		let difficulty = 3;

		if (problem.category === "Dynamic Programming") difficulty += 3;
		if (problem.category === "Graph") difficulty += 2;
		if (problem.category === "Tree") difficulty += 2;
		if (problem.solutions?.length > 1) difficulty += 1;

		return Math.min(difficulty, 10);
	}

	private analyzeEdgeCaseHandling(code: string, _problem: any): number {
		let score = 1;

		// Check for null/undefined checks
		if (code.includes("null") || code.includes("undefined")) score += 2;

		// Check for empty array/string checks
		if (code.includes("length") && code.includes("0")) score += 2;

		// Check for boundary conditions
		if (code.includes("<=") || code.includes(">=")) score += 1;

		// Check for error handling
		if (code.includes("try") || code.includes("catch")) score += 2;

		return Math.min(score, 10);
	}

	private generateDifficultyReasoning(
		difficulty: string,
		factors: any,
	): string {
		const reasonParts = [];

		if (factors.algorithmComplexity > 6) {
			reasonParts.push("requires advanced algorithmic knowledge");
		}

		if (factors.implementationComplexity > 6) {
			reasonParts.push("complex implementation with multiple edge cases");
		}

		if (factors.conceptualDifficulty > 6) {
			reasonParts.push("challenging conceptual understanding needed");
		}

		return `${difficulty} difficulty due to: ${reasonParts.join(", ") || "standard implementation requirements"}`;
	}
}

export const algorithmValidator = new AlgorithmValidator();
