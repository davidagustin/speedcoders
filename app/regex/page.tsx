"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface RegexExercise {
	id: string;
	title: string;
	description: string;
	pattern: string;
	testStrings: string[];
	explanation: string;
	difficulty: "Beginner" | "Intermediate" | "Advanced";
	category: string;
}

const sampleExercises: RegexExercise[] = [
	{
		id: "1",
		title: "Email Validation",
		description: "Create a regex pattern to validate email addresses",
		pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
		testStrings: [
			"user@example.com",
			"test.email@domain.co.uk",
			"invalid-email",
			"user@.com",
			"user@domain.",
			"user name@domain.com",
		],
		explanation:
			"This pattern matches: username@domain.tld where username can contain letters, numbers, dots, underscores, plus signs, and hyphens. Domain must have at least one dot and a valid TLD.",
		difficulty: "Beginner",
		category: "Validation",
	},
	{
		id: "2",
		title: "Phone Number Matching",
		description: "Match phone numbers in various formats",
		pattern:
			"^\\+?1?[-.\\s]?\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$",
		testStrings: [
			"+1-555-123-4567",
			"(555) 123-4567",
			"555.123.4567",
			"555 123 4567",
			"5551234567",
			"123-456-7890",
		],
		explanation:
			"This pattern matches US phone numbers in various formats including international format, parentheses, dots, spaces, and hyphens.",
		difficulty: "Intermediate",
		category: "Formatting",
	},
	{
		id: "3",
		title: "URL Extraction",
		description: "Extract URLs from text",
		pattern: 'https?://[^\\s<>"{}|\\\\^`\\[\\]]+',
		testStrings: [
			"Visit https://example.com for more info",
			"Check out http://test.org/path?param=value",
			"No URL here",
			"https://domain.com/path#fragment",
			"ftp://invalid-protocol.com",
		],
		explanation:
			"This pattern matches HTTP and HTTPS URLs, capturing the protocol and domain with optional path, query parameters, and fragments.",
		difficulty: "Intermediate",
		category: "Extraction",
	},
	{
		id: "4",
		title: "Password Strength",
		description: "Validate password strength requirements",
		pattern:
			"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
		testStrings: [
			"StrongPass1!",
			"weakpass",
			"NoNumbers!",
			"nouppercase1!",
			"NoSpecialChar1",
			"Short1!",
		],
		explanation:
			"This pattern requires: at least 8 characters, one lowercase letter, one uppercase letter, one digit, and one special character.",
		difficulty: "Advanced",
		category: "Validation",
	},
];

export default function RegexPage() {
	const [exercises, _setExercises] = useState<RegexExercise[]>(sampleExercises);
	const [selectedExercise, setSelectedExercise] =
		useState<RegexExercise | null>(null);
	const [userPattern, setUserPattern] = useState("");
	const [testInput, setTestInput] = useState("");
	const [matches, setMatches] = useState<string[]>([]);
	const [isValid, setIsValid] = useState<boolean | null>(null);
	const [showSolution, setShowSolution] = useState(false);
	const [difficulty, setDifficulty] = useState<
		"all" | "Beginner" | "Intermediate" | "Advanced"
	>("all");
	const [category, setCategory] = useState<string>("all");

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

	const testRegex = () => {
		try {
			const regex = new RegExp(userPattern, "g");
			const testMatches = testInput.match(regex) || [];
			setMatches(testMatches);
			setIsValid(true);
		} catch (_error) {
			setIsValid(false);
			setMatches([]);
		}
	};

	const selectExercise = (exercise: RegexExercise) => {
		setSelectedExercise(exercise);
		setUserPattern("");
		setTestInput(exercise.testStrings.join("\n"));
		setMatches([]);
		setIsValid(null);
		setShowSolution(false);
	};

	const checkExercise = () => {
		if (!selectedExercise) return;

		try {
			const userRegex = new RegExp(userPattern, "g");
			const correctRegex = new RegExp(selectedExercise.pattern, "g");

			const userMatches = selectedExercise.testStrings.map((str) =>
				userRegex.test(str),
			);
			const correctMatches = selectedExercise.testStrings.map((str) =>
				correctRegex.test(str),
			);

			const isCorrect = userMatches.every(
				(match, index) => match === correctMatches[index],
			);
			setIsValid(isCorrect);

			if (isCorrect) {
				setMatches(
					selectedExercise.testStrings.filter(
						(_, index) => correctMatches[index],
					),
				);
			}
		} catch (_error) {
			setIsValid(false);
		}
	};

	const filteredExercises = exercises.filter((exercise) => {
		const difficultyMatch =
			difficulty === "all" || exercise.difficulty === difficulty;
		const categoryMatch = category === "all" || exercise.category === category;
		return difficultyMatch && categoryMatch;
	});

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="px-4 py-6 sm:px-0">
					<h1 className="text-3xl font-bold text-gray-900">Regex Trainer</h1>
					<p className="mt-2 text-gray-600">
						Master regular expressions with interactive exercises
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Exercise List */}
					<div className="lg:col-span-1">
						<div className="bg-white shadow rounded-lg">
							<div className="px-4 py-5 sm:p-6">
								<h3 className="text-lg font-medium text-gray-900 mb-4">
									Exercises
								</h3>

								{/* Filters */}
								<div className="mb-4 space-y-2">
									<select
										value={difficulty}
										onChange={(e) => setDifficulty(e.target.value as any)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
									>
										<option value="all">All Difficulties</option>
										<option value="Beginner">Beginner</option>
										<option value="Intermediate">Intermediate</option>
										<option value="Advanced">Advanced</option>
									</select>

									<select
										value={category}
										onChange={(e) => setCategory(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
									>
										<option value="all">All Categories</option>
										<option value="Validation">Validation</option>
										<option value="Formatting">Formatting</option>
										<option value="Extraction">Extraction</option>
									</select>
								</div>

								<div className="space-y-2">
									{filteredExercises.map((exercise) => (
										<button
											key={exercise.id}
											onClick={() => selectExercise(exercise)}
											className={`w-full text-left p-3 rounded-lg border transition-colors ${
												selectedExercise?.id === exercise.id
													? "border-indigo-500 bg-indigo-50"
													: "border-gray-200 hover:border-gray-300"
											}`}
										>
											<div className="font-medium text-gray-900">
												{exercise.title}
											</div>
											<div className="text-sm text-gray-500 mt-1">
												{exercise.description}
											</div>
											<div className="flex items-center space-x-2 mt-2">
												<span
													className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
														exercise.difficulty === "Beginner"
															? "bg-green-100 text-green-800"
															: exercise.difficulty === "Intermediate"
																? "bg-yellow-100 text-yellow-800"
																: "bg-red-100 text-red-800"
													}`}
												>
													{exercise.difficulty}
												</span>
												<span className="text-xs text-gray-500">
													{exercise.category}
												</span>
											</div>
										</button>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Exercise Workspace */}
					<div className="lg:col-span-2">
						{selectedExercise ? (
							<div className="bg-white shadow rounded-lg">
								<div className="px-4 py-5 sm:p-6">
									<div className="mb-6">
										<h2 className="text-xl font-semibold text-gray-900">
											{selectedExercise.title}
										</h2>
										<p className="text-gray-600 mt-1">
											{selectedExercise.description}
										</p>
									</div>

									{/* Pattern Input */}
									<div className="mb-6">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Your Regex Pattern
										</label>
										<div className="flex space-x-2">
											<input
												type="text"
												value={userPattern}
												onChange={(e) => setUserPattern(e.target.value)}
												placeholder="Enter your regex pattern..."
												className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
											/>
											<button
												onClick={checkExercise}
												className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
											>
												Test
											</button>
											<button
												onClick={() => setShowSolution(!showSolution)}
												className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
											>
												{showSolution ? "Hide" : "Show"} Solution
											</button>
										</div>

										{isValid !== null && (
											<div
												className={`mt-2 p-2 rounded-md ${
													isValid
														? "bg-green-50 text-green-800"
														: "bg-red-50 text-red-800"
												}`}
											>
												{isValid
													? "✓ Pattern is correct!"
													: "✗ Pattern needs adjustment"}
											</div>
										)}
									</div>

									{/* Solution */}
									{showSolution && (
										<div className="mb-6 p-4 bg-blue-50 rounded-md">
											<h4 className="font-medium text-blue-900 mb-2">
												Solution:
											</h4>
											<code className="text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded">
												{selectedExercise.pattern}
											</code>
											<p className="text-sm text-blue-700 mt-2">
												{selectedExercise.explanation}
											</p>
										</div>
									)}

									{/* Test Strings */}
									<div className="mb-6">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Test Strings
										</label>
										<textarea
											value={testInput}
											onChange={(e) => setTestInput(e.target.value)}
											rows={6}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
											placeholder="Enter test strings (one per line)..."
										/>
										<button
											onClick={testRegex}
											className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
										>
											Test Pattern
										</button>
									</div>

									{/* Results */}
									{matches.length > 0 && (
										<div>
											<h4 className="font-medium text-gray-900 mb-2">
												Matches:
											</h4>
											<div className="bg-gray-50 p-3 rounded-md">
												{matches.map((match, index) => (
													<div
														key={index}
														className="text-sm text-gray-700 bg-white p-2 rounded mb-1"
													>
														{match}
													</div>
												))}
											</div>
										</div>
									)}
								</div>
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
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<h3 className="mt-2 text-sm font-medium text-gray-900">
										Select an Exercise
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										Choose an exercise from the list to start practicing regex
										patterns.
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
