"use client";

import { useState } from "react";
import { UserGroupIcon, PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface StudyGroup {
	id: string;
	name: string;
	description: string;
	memberCount: number;
	maxMembers: number;
	topics: string[];
	level: "Beginner" | "Intermediate" | "Advanced";
	isPublic: boolean;
	createdBy: string;
}

export default function StudyGroupsPage() {
	const [groups, setGroups] = useState<StudyGroup[]>([
		{
			id: "1",
			name: "Algorithms & Data Structures",
			description: "Weekly study group focusing on core algorithms and data structures",
			memberCount: 12,
			maxMembers: 20,
			topics: ["Arrays", "Trees", "Graphs", "Dynamic Programming"],
			level: "Intermediate",
			isPublic: true,
			createdBy: "alex_coder"
		},
		{
			id: "2",
			name: "System Design Masters",
			description: "Advanced system design discussions and mock interviews",
			memberCount: 8,
			maxMembers: 15,
			topics: ["Scalability", "Microservices", "Database Design"],
			level: "Advanced",
			isPublic: true,
			createdBy: "system_designer"
		},
		{
			id: "3",
			name: "LeetCode Beginners",
			description: "Perfect for those just starting their coding journey",
			memberCount: 25,
			maxMembers: 30,
			topics: ["Easy Problems", "Basic Algorithms", "Problem Solving"],
			level: "Beginner",
			isPublic: true,
			createdBy: "coding_mentor"
		}
	]);

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedLevel, setSelectedLevel] = useState<string>("all");

	const filteredGroups = groups.filter(group => {
		const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			group.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
		
		const matchesLevel = selectedLevel === "all" || group.level === selectedLevel;
		
		return matchesSearch && matchesLevel;
	});

	const getLevelColor = (level: string) => {
		switch (level) {
			case "Beginner": return "bg-green-100 text-green-800";
			case "Intermediate": return "bg-yellow-100 text-yellow-800";
			case "Advanced": return "bg-red-100 text-red-800";
			default: return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 mb-2">Study Groups</h1>
							<p className="text-gray-600">Join study groups and learn with others</p>
						</div>
						<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
							<PlusIcon className="h-5 w-5" />
							Create Group
						</button>
					</div>
				</div>

				{/* Filters */}
				<div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									type="text"
									placeholder="Search groups..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						</div>
						<select
							value={selectedLevel}
							onChange={(e) => setSelectedLevel(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="all">All Levels</option>
							<option value="Beginner">Beginner</option>
							<option value="Intermediate">Intermediate</option>
							<option value="Advanced">Advanced</option>
						</select>
					</div>
				</div>

				{/* Groups Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredGroups.map((group) => (
						<div key={group.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<h3 className="font-semibold text-gray-900 text-lg mb-1">{group.name}</h3>
									<p className="text-gray-600 text-sm mb-3">{group.description}</p>
								</div>
								<UserGroupIcon className="h-6 w-6 text-gray-400 flex-shrink-0 ml-2" />
							</div>

							<div className="flex items-center gap-2 mb-4">
								<span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(group.level)}`}>
									{group.level}
								</span>
								<span className="text-sm text-gray-500">
									{group.memberCount}/{group.maxMembers} members
								</span>
							</div>

							<div className="mb-4">
								<h4 className="text-sm font-medium text-gray-900 mb-2">Topics:</h4>
								<div className="flex flex-wrap gap-1">
									{group.topics.map((topic, index) => (
										<span
											key={index}
											className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
										>
											{topic}
										</span>
									))}
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500">by {group.createdBy}</span>
								<button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
									Join Group
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Empty State */}
				{filteredGroups.length === 0 && (
					<div className="text-center py-12">
						<UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
						<p className="text-gray-600">Try adjusting your search or create a new group</p>
					</div>
				)}
			</div>
		</div>
	);
}
