"use client";

import {
	ChartBarIcon,
	CloudIcon,
	CpuChipIcon,
	CircleStackIcon as DatabaseIcon,
	GlobeAltIcon,
	ServerIcon,
	WifiIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface SystemDesign {
	id: string;
	title: string;
	description: string;
	difficulty: "Easy" | "Medium" | "Hard";
	category: string;
	requirements: string[];
	constraints: string[];
	components: string[];
	solutions: string[];
	estimatedTime: number;
	tags: string[];
}

export default function SystemDesignPage() {
	const [designs, setDesigns] = useState<SystemDesign[]>([]);
	const [selectedDesign, setSelectedDesign] = useState<SystemDesign | null>(
		null,
	);
	const [filter, setFilter] = useState<"all" | "Easy" | "Medium" | "Hard">(
		"all",
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [_loading, _setLoading] = useState(false);

	const _supabase = createClient();

	useEffect(() => {
		loadSystemDesigns();
	}, [loadSystemDesigns]);

	const loadSystemDesigns = async () => {
		try {
			// Mock data for system designs
			const mockDesigns: SystemDesign[] = [
				{
					id: "1",
					title: "Design URL Shortener",
					description: "Design a URL shortening service like TinyURL or Bitly",
					difficulty: "Easy",
					category: "Web Services",
					requirements: [
						"Shorten long URLs to short URLs",
						"Redirect short URLs to original URLs",
						"Handle high traffic (100M+ requests/day)",
						"Support custom short URLs",
						"Track click analytics",
					],
					constraints: [
						"URLs should be as short as possible",
						"System should be highly available",
						"Low latency for URL redirection",
						"Support for custom URLs",
					],
					components: [
						"Load Balancer",
						"Application Servers",
						"Database (SQL + NoSQL)",
						"Cache Layer",
						"URL Generation Service",
						"Analytics Service",
					],
					solutions: [
						"Use hash-based URL generation",
						"Implement caching for frequently accessed URLs",
						"Use CDN for global distribution",
						"Database sharding for scalability",
					],
					estimatedTime: 45,
					tags: [
						"URL Shortening",
						"Hash Functions",
						"Caching",
						"Database Design",
					],
				},
				{
					id: "2",
					title: "Design Chat System",
					description: "Design a real-time chat system like WhatsApp or Slack",
					difficulty: "Medium",
					category: "Real-time Systems",
					requirements: [
						"Real-time messaging between users",
						"Support group chats",
						"Message delivery status",
						"File sharing capabilities",
						"Message history and search",
						"Push notifications",
					],
					constraints: [
						"Low latency message delivery",
						"High availability and reliability",
						"Support millions of concurrent users",
						"Message ordering and consistency",
					],
					components: [
						"WebSocket Servers",
						"Message Queue System",
						"Database (SQL + NoSQL)",
						"File Storage Service",
						"Push Notification Service",
						"Search Service",
					],
					solutions: [
						"Use WebSockets for real-time communication",
						"Implement message queues for reliability",
						"Use Redis for session management",
						"Database sharding for scalability",
					],
					estimatedTime: 60,
					tags: [
						"Real-time",
						"WebSockets",
						"Message Queues",
						"Push Notifications",
					],
				},
				{
					id: "3",
					title: "Design Rate Limiter",
					description: "Design a rate limiting system to control API usage",
					difficulty: "Medium",
					category: "API Design",
					requirements: [
						"Limit requests per user/IP",
						"Support different rate limit rules",
						"Handle distributed systems",
						"Provide rate limit headers",
						"Support sliding window and fixed window",
					],
					constraints: [
						"Low latency rate limit checking",
						"High availability",
						"Accurate rate limiting",
						"Support for different time windows",
					],
					components: [
						"Rate Limiter Service",
						"Redis/Cache Layer",
						"Configuration Service",
						"Monitoring Service",
					],
					solutions: [
						"Use Redis for distributed rate limiting",
						"Implement sliding window algorithm",
						"Use token bucket algorithm",
						"Cache rate limit data",
					],
					estimatedTime: 30,
					tags: ["Rate Limiting", "Redis", "Algorithms", "API Design"],
				},
				{
					id: "4",
					title: "Design Distributed Cache",
					description: "Design a distributed caching system like Redis Cluster",
					difficulty: "Hard",
					category: "Caching",
					requirements: [
						"High availability and fault tolerance",
						"Consistent hashing for data distribution",
						"Automatic failover and recovery",
						"Support for different data types",
						"Configurable TTL and eviction policies",
					],
					constraints: [
						"Low latency data access",
						"High throughput",
						"Data consistency",
						"Minimal data loss during failures",
					],
					components: [
						"Cache Nodes",
						"Load Balancer",
						"Consistent Hashing Service",
						"Replication Service",
						"Failover Manager",
					],
					solutions: [
						"Use consistent hashing for data distribution",
						"Implement master-slave replication",
						"Use gossip protocol for node communication",
						"Implement automatic failover",
					],
					estimatedTime: 75,
					tags: [
						"Distributed Systems",
						"Consistent Hashing",
						"Replication",
						"Fault Tolerance",
					],
				},
				{
					id: "5",
					title: "Design Search Engine",
					description: "Design a search engine like Google or Elasticsearch",
					difficulty: "Hard",
					category: "Search Systems",
					requirements: [
						"Fast full-text search",
						"Support for complex queries",
						"Ranking and relevance scoring",
						"Autocomplete suggestions",
						"Handle billions of documents",
						"Real-time indexing",
					],
					constraints: [
						"Sub-second search response time",
						"High availability",
						"Accurate search results",
						"Support for multiple languages",
					],
					components: [
						"Crawler Service",
						"Indexing Service",
						"Search Service",
						"Ranking Service",
						"Suggestion Service",
						"Storage Layer",
					],
					solutions: [
						"Use inverted index for fast search",
						"Implement TF-IDF for ranking",
						"Use distributed indexing",
						"Implement caching for popular queries",
					],
					estimatedTime: 90,
					tags: ["Search", "Indexing", "Ranking", "Distributed Systems"],
				},
				{
					id: "6",
					title: "Design Video Streaming",
					description:
						"Design a video streaming platform like Netflix or YouTube",
					difficulty: "Hard",
					category: "Media Systems",
					requirements: [
						"Stream videos in different qualities",
						"Support live streaming",
						"Video transcoding and processing",
						"Content delivery optimization",
						"User recommendations",
						"Analytics and monitoring",
					],
					constraints: [
						"Low latency video delivery",
						"High bandwidth efficiency",
						"Global content distribution",
						"Support for multiple devices",
					],
					components: [
						"Video Processing Service",
						"CDN Network",
						"Streaming Servers",
						"Recommendation Engine",
						"Analytics Service",
						"Storage Service",
					],
					solutions: [
						"Use CDN for global distribution",
						"Implement adaptive bitrate streaming",
						"Use video transcoding for multiple formats",
						"Implement recommendation algorithms",
					],
					estimatedTime: 120,
					tags: ["Video Streaming", "CDN", "Transcoding", "Recommendations"],
				},
			];

			setDesigns(mockDesigns);
		} catch (error) {
			console.error("Error loading system designs:", error);
		}
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "bg-green-100 text-green-800";
			case "Medium":
				return "bg-yellow-100 text-yellow-800";
			case "Hard":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "Web Services":
				return <GlobeAltIcon className="w-5 h-5" />;
			case "Real-time Systems":
				return <WifiIcon className="w-5 h-5" />;
			case "API Design":
				return <ServerIcon className="w-5 h-5" />;
			case "Caching":
				return <DatabaseIcon className="w-5 h-5" />;
			case "Search Systems":
				return <ChartBarIcon className="w-5 h-5" />;
			case "Media Systems":
				return <CloudIcon className="w-5 h-5" />;
			default:
				return <CpuChipIcon className="w-5 h-5" />;
		}
	};

	const filteredDesigns = designs.filter((design) => {
		const matchesFilter = filter === "all" || design.difficulty === filter;
		const matchesSearch =
			design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			design.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			design.tags.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase()),
			);
		return matchesFilter && matchesSearch;
	});

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="px-4 py-6 sm:px-0">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-indigo-100 rounded-lg">
							<CpuChipIcon className="w-6 h-6 text-indigo-600" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								System Design
							</h1>
							<p className="text-gray-600">
								Master scalable system architecture and design patterns
							</p>
						</div>
					</div>

					{/* Search and Filters */}
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="flex-1">
							<input
								type="text"
								placeholder="Search system designs..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
						<div className="flex space-x-2">
							{["all", "Easy", "Medium", "Hard"].map((difficulty) => (
								<button
									key={difficulty}
									onClick={() => setFilter(difficulty as any)}
									className={`px-4 py-2 rounded-md text-sm font-medium ${
										filter === difficulty
											? "bg-indigo-100 text-indigo-700"
											: "text-gray-500 hover:text-gray-700"
									}`}
								>
									{difficulty === "all" ? "All" : difficulty}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* System Designs Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
					{filteredDesigns.map((design) => (
						<div
							key={design.id}
							className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
						>
							<div className="p-6">
								{/* Header */}
								<div className="flex items-start justify-between mb-4">
									<div className="flex items-center gap-2">
										{getCategoryIcon(design.category)}
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(design.difficulty)}`}
										>
											{design.difficulty}
										</span>
									</div>
									<div className="text-right">
										<div className="text-sm text-gray-500">
											{design.estimatedTime} min
										</div>
									</div>
								</div>

								{/* Content */}
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{design.title}
								</h3>
								<p className="text-gray-600 text-sm mb-4">
									{design.description}
								</p>

								{/* Tags */}
								<div className="flex flex-wrap gap-1 mb-4">
									{design.tags.slice(0, 3).map((tag) => (
										<span
											key={tag}
											className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
										>
											{tag}
										</span>
									))}
									{design.tags.length > 3 && (
										<span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
											+{design.tags.length - 3} more
										</span>
									)}
								</div>

								{/* Requirements Preview */}
								<div className="mb-4">
									<h4 className="text-sm font-medium text-gray-900 mb-2">
										Key Requirements:
									</h4>
									<ul className="text-xs text-gray-600 space-y-1">
										{design.requirements.slice(0, 2).map((req, index) => (
											<li key={index} className="flex items-start gap-2">
												<span className="text-indigo-500 mt-1">•</span>
												<span>{req}</span>
											</li>
										))}
										{design.requirements.length > 2 && (
											<li className="text-gray-500">
												+{design.requirements.length - 2} more requirements
											</li>
										)}
									</ul>
								</div>

								{/* Action Button */}
								<button
									onClick={() => setSelectedDesign(design)}
									className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
								>
									Start Design
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Design Detail Modal */}
				{selectedDesign && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
							<div className="p-6">
								{/* Header */}
								<div className="flex items-start justify-between mb-6">
									<div>
										<h2 className="text-2xl font-bold text-gray-900 mb-2">
											{selectedDesign.title}
										</h2>
										<p className="text-gray-600">
											{selectedDesign.description}
										</p>
									</div>
									<button
										onClick={() => setSelectedDesign(null)}
										className="text-gray-400 hover:text-gray-600"
									>
										✕
									</button>
								</div>

								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									{/* Requirements */}
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3">
											Requirements
										</h3>
										<ul className="space-y-2">
											{selectedDesign.requirements.map((req, index) => (
												<li key={index} className="flex items-start gap-3">
													<span className="text-indigo-500 mt-1">•</span>
													<span className="text-gray-700">{req}</span>
												</li>
											))}
										</ul>
									</div>

									{/* Constraints */}
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3">
											Constraints
										</h3>
										<ul className="space-y-2">
											{selectedDesign.constraints.map((constraint, index) => (
												<li key={index} className="flex items-start gap-3">
													<span className="text-red-500 mt-1">•</span>
													<span className="text-gray-700">{constraint}</span>
												</li>
											))}
										</ul>
									</div>

									{/* System Components */}
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3">
											System Components
										</h3>
										<div className="grid grid-cols-2 gap-2">
											{selectedDesign.components.map((component, index) => (
												<div
													key={index}
													className="p-2 bg-gray-50 rounded text-sm"
												>
													{component}
												</div>
											))}
										</div>
									</div>

									{/* Solutions */}
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-3">
											Key Solutions
										</h3>
										<ul className="space-y-2">
											{selectedDesign.solutions.map((solution, index) => (
												<li key={index} className="flex items-start gap-3">
													<span className="text-green-500 mt-1">•</span>
													<span className="text-gray-700">{solution}</span>
												</li>
											))}
										</ul>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
									<button
										onClick={() => setSelectedDesign(null)}
										className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
									>
										Close
									</button>
									<button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
										Start Design Session
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
