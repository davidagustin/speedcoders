"use client";

import {
	BookOpenIcon,
	CheckCircleIcon,
	PlayIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";

export default function StudyPage() {
	const { data: session } = useSession();
	const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

	const topics = [
		{
			id: "arrays",
			name: "Arrays",
			description:
				"Learn about array manipulation, searching, and sorting algorithms",
			icon: "📊",
			progress: 75,
			lessons: [
				{ id: 1, title: "Array Basics", duration: "15 min", completed: true },
				{
					id: 2,
					title: "Array Traversal",
					duration: "20 min",
					completed: true,
				},
				{
					id: 3,
					title: "Two Pointers Technique",
					duration: "25 min",
					completed: false,
				},
				{
					id: 4,
					title: "Sliding Window",
					duration: "30 min",
					completed: false,
				},
			],
		},
		{
			id: "strings",
			name: "Strings",
			description: "Master string manipulation and pattern matching",
			icon: "📝",
			progress: 60,
			lessons: [
				{ id: 1, title: "String Basics", duration: "15 min", completed: true },
				{
					id: 2,
					title: "String Manipulation",
					duration: "20 min",
					completed: true,
				},
				{
					id: 3,
					title: "Pattern Matching",
					duration: "25 min",
					completed: false,
				},
				{
					id: 4,
					title: "Regular Expressions",
					duration: "30 min",
					completed: false,
				},
			],
		},
		{
			id: "linked-lists",
			name: "Linked Lists",
			description: "Understand linked list operations and algorithms",
			icon: "🔗",
			progress: 40,
			lessons: [
				{
					id: 1,
					title: "Linked List Basics",
					duration: "15 min",
					completed: true,
				},
				{
					id: 2,
					title: "Traversal and Search",
					duration: "20 min",
					completed: false,
				},
				{
					id: 3,
					title: "Insertion and Deletion",
					duration: "25 min",
					completed: false,
				},
				{
					id: 4,
					title: "Advanced Operations",
					duration: "30 min",
					completed: false,
				},
			],
		},
		{
			id: "trees",
			name: "Trees",
			description: "Explore tree data structures and traversal algorithms",
			icon: "🌳",
			progress: 25,
			lessons: [
				{ id: 1, title: "Tree Basics", duration: "15 min", completed: true },
				{
					id: 2,
					title: "Tree Traversal",
					duration: "20 min",
					completed: false,
				},
				{
					id: 3,
					title: "Binary Search Trees",
					duration: "25 min",
					completed: false,
				},
				{
					id: 4,
					title: "Balanced Trees",
					duration: "30 min",
					completed: false,
				},
			],
		},
		{
			id: "graphs",
			name: "Graphs",
			description: "Learn graph algorithms and traversal techniques",
			icon: "🕸️",
			progress: 10,
			lessons: [
				{ id: 1, title: "Graph Basics", duration: "15 min", completed: false },
				{
					id: 2,
					title: "Graph Traversal",
					duration: "20 min",
					completed: false,
				},
				{ id: 3, title: "Shortest Path", duration: "25 min", completed: false },
				{
					id: 4,
					title: "Minimum Spanning Tree",
					duration: "30 min",
					completed: false,
				},
			],
		},
		{
			id: "dynamic-programming",
			name: "Dynamic Programming",
			description: "Master dynamic programming techniques and optimization",
			icon: "⚡",
			progress: 5,
			lessons: [
				{ id: 1, title: "DP Basics", duration: "15 min", completed: false },
				{ id: 2, title: "Memoization", duration: "20 min", completed: false },
				{ id: 3, title: "Tabulation", duration: "25 min", completed: false },
				{ id: 4, title: "Advanced DP", duration: "30 min", completed: false },
			],
		},
	];

	if (!session) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900">
						Please sign in to study
					</h1>
					<Link
						href="/auth/login"
						className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg"
					>
						Sign In
					</Link>
				</div>
			</div>
		);
	}

	const selectedTopicData = topics.find((topic) => topic.id === selectedTopic);

	return (
		<div className="h-full flex">
			<Sidebar />
			<div className="flex-1 flex flex-col min-w-0">
				<Navbar />

				<main className="flex-1 overflow-y-auto bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						{/* Header */}
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-gray-900">Study Mode</h1>
							<p className="mt-2 text-gray-600">
								Learn algorithms and data structures through structured lessons
							</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Topics List */}
							<div className="lg:col-span-1">
								<h2 className="text-lg font-semibold text-gray-900 mb-4">
									Topics
								</h2>
								<div className="space-y-3">
									{topics.map((topic) => (
										<button
											key={topic.id}
											onClick={() => setSelectedTopic(topic.id)}
											className={`w-full text-left p-4 rounded-lg border transition-colors ${
												selectedTopic === topic.id
													? "border-blue-500 bg-blue-50"
													: "border-gray-200 bg-white hover:border-gray-300"
											}`}
										>
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center space-x-3">
													<span className="text-2xl">{topic.icon}</span>
													<div>
														<h3 className="font-medium text-gray-900">
															{topic.name}
														</h3>
														<p className="text-sm text-gray-600">
															{topic.description}
														</p>
													</div>
												</div>
												<div className="text-right">
													<div className="text-sm font-medium text-gray-900">
														{topic.progress}%
													</div>
													<div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
														<div
															className="h-2 bg-blue-600 rounded-full transition-all"
															style={{ width: `${topic.progress}%` }}
														></div>
													</div>
												</div>
											</div>
										</button>
									))}
								</div>
							</div>

							{/* Topic Details */}
							<div className="lg:col-span-2">
								{selectedTopicData ? (
									<div className="bg-white rounded-lg shadow p-6">
										<div className="flex items-center space-x-3 mb-6">
											<span className="text-3xl">{selectedTopicData.icon}</span>
											<div>
												<h2 className="text-2xl font-bold text-gray-900">
													{selectedTopicData.name}
												</h2>
												<p className="text-gray-600">
													{selectedTopicData.description}
												</p>
											</div>
										</div>

										<div className="mb-6">
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium text-gray-700">
													Progress
												</span>
												<span className="text-sm text-gray-500">
													{selectedTopicData.progress}% complete
												</span>
											</div>
											<div className="w-full h-3 bg-gray-200 rounded-full">
												<div
													className="h-3 bg-blue-600 rounded-full transition-all"
													style={{ width: `${selectedTopicData.progress}%` }}
												></div>
											</div>
										</div>

										<div>
											<h3 className="text-lg font-semibold text-gray-900 mb-4">
												Lessons
											</h3>
											<div className="space-y-3">
												{selectedTopicData.lessons.map((lesson) => (
													<div
														key={lesson.id}
														className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
													>
														<div className="flex items-center space-x-3">
															{lesson.completed ? (
																<CheckCircleIcon className="w-5 h-5 text-green-500" />
															) : (
																<div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
															)}
															<div>
																<h4 className="font-medium text-gray-900">
																	{lesson.title}
																</h4>
																<p className="text-sm text-gray-500">
																	{lesson.duration}
																</p>
															</div>
														</div>
														<button className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
															<PlayIcon className="w-4 h-4 mr-1" />
															{lesson.completed ? "Review" : "Start"}
														</button>
													</div>
												))}
											</div>
										</div>
									</div>
								) : (
									<div className="bg-white rounded-lg shadow p-12 text-center">
										<BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											Select a topic to start studying
										</h3>
										<p className="text-gray-600">
											Choose a topic from the list to view lessons and track
											your progress.
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
