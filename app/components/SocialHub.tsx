"use client";

import {
	BookmarkIcon,
	ChatBubbleLeftRightIcon,
	CodeBracketIcon,
	EyeIcon,
	HeartIcon,
	PhotoIcon,
	ShareIcon,
	TrophyIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
	BookmarkIcon as BookmarkSolidIcon,
	HeartIcon as HeartSolidIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

interface User {
	id: string;
	username: string;
	avatar: string;
	level: number;
	title?: string;
	isFollowing?: boolean;
	isOnline?: boolean;
}

interface Post {
	id: string;
	author: User;
	content: string;
	code?: {
		language: string;
		snippet: string;
		problem: string;
	};
	image?: string;
	createdAt: string;
	likes: number;
	comments: number;
	isLiked: boolean;
	isBookmarked: boolean;
	tags: string[];
}

interface Comment {
	id: string;
	author: User;
	content: string;
	createdAt: string;
	likes: number;
	isLiked: boolean;
}

interface StudyGroup {
	id: string;
	name: string;
	description: string;
	members: User[];
	maxMembers: number;
	category: string;
	difficulty: "Beginner" | "Intermediate" | "Advanced";
	isJoined: boolean;
	nextSession?: string;
}

interface Challenge {
	id: string;
	creator: User;
	title: string;
	description: string;
	problem: string;
	difficulty: string;
	participants: number;
	deadline: string;
	prize?: string;
	isParticipating: boolean;
}

type TabType = "feed" | "friends" | "groups" | "challenges" | "leaderboard";

export default function SocialHub() {
	const [activeTab, setActiveTab] = useState<TabType>("feed");
	const [posts, setPosts] = useState<Post[]>([]);
	const [friends, setFriends] = useState<User[]>([]);
	const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const [newPost, setNewPost] = useState("");
	const [_selectedPost, _setSelectedPost] = useState<Post | null>(null);
	const [_comments, _setComments] = useState<Comment[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadSocialData();
	}, []);

	const loadSocialData = async () => {
		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Mock data
		const mockUsers: User[] = [
			{
				id: "1",
				username: "CodeMaster2024",
				avatar: "👨‍💻",
				level: 25,
				title: "Algorithm Expert",
				isFollowing: true,
				isOnline: true,
			},
			{
				id: "2",
				username: "PythonNinja",
				avatar: "🐍",
				level: 18,
				title: "Speed Demon",
				isFollowing: false,
				isOnline: false,
			},
			{
				id: "3",
				username: "DataStructGuru",
				avatar: "🧠",
				level: 30,
				title: "Legend",
				isFollowing: true,
				isOnline: true,
			},
		];

		const mockPosts: Post[] = [
			{
				id: "1",
				author: mockUsers[0],
				content:
					'Just solved the "Maximum Subarray" problem using Kadane\'s algorithm! The key insight is to keep track of the current sum and reset it when it becomes negative. Check out my solution below:',
				code: {
					language: "javascript",
					snippet: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}`,
					problem: "Maximum Subarray",
				},
				createdAt: "2 hours ago",
				likes: 24,
				comments: 8,
				isLiked: false,
				isBookmarked: true,
				tags: ["Dynamic Programming", "Arrays", "Kadane"],
			},
			{
				id: "2",
				author: mockUsers[1],
				content:
					"Finally reached level 18! 🎉 The grind is real but so worth it. Currently working through the graph problems - BFS and DFS are becoming second nature now.",
				createdAt: "4 hours ago",
				likes: 156,
				comments: 23,
				isLiked: true,
				isBookmarked: false,
				tags: ["Milestone", "Graph", "BFS", "DFS"],
			},
			{
				id: "3",
				author: mockUsers[2],
				content:
					"Pro tip for binary search: Always think about the invariant! What property remains true throughout your search? This mental model has helped me solve dozens of problems.",
				image: "/api/placeholder/400/300",
				createdAt: "6 hours ago",
				likes: 89,
				comments: 15,
				isLiked: false,
				isBookmarked: true,
				tags: ["Binary Search", "Tips", "Problem Solving"],
			},
		];

		const mockGroups: StudyGroup[] = [
			{
				id: "1",
				name: "Dynamic Programming Masters",
				description:
					"Deep dive into DP patterns and techniques. Weekly sessions covering classic problems.",
				members: mockUsers.slice(0, 2),
				maxMembers: 15,
				category: "Dynamic Programming",
				difficulty: "Advanced",
				isJoined: true,
				nextSession: "2024-01-25 19:00",
			},
			{
				id: "2",
				name: "Leetcode Beginners",
				description:
					"Friendly group for newcomers. We solve Easy problems together and explain concepts.",
				members: [mockUsers[1]],
				maxMembers: 20,
				category: "General",
				difficulty: "Beginner",
				isJoined: false,
				nextSession: "2024-01-23 18:00",
			},
			{
				id: "3",
				name: "Graph Algorithms Club",
				description:
					"Exploring graph theory and algorithms. From basic traversals to advanced topics.",
				members: mockUsers,
				maxMembers: 12,
				category: "Graph Theory",
				difficulty: "Intermediate",
				isJoined: false,
				nextSession: "2024-01-26 20:00",
			},
		];

		const mockChallenges: Challenge[] = [
			{
				id: "1",
				creator: mockUsers[0],
				title: "Binary Tree Challenge",
				description:
					"Solve 5 binary tree problems in the most efficient way possible. Focus on clean, readable code.",
				problem: "Binary Tree Traversals",
				difficulty: "Medium",
				participants: 47,
				deadline: "2024-01-30",
				prize: "🏆 Premium Badge + 500 XP",
				isParticipating: true,
			},
			{
				id: "2",
				creator: mockUsers[2],
				title: "Speed Coding Contest",
				description:
					"Race against time! Solve as many Easy problems as you can in 30 minutes.",
				problem: "Mixed Easy Problems",
				difficulty: "Easy",
				participants: 124,
				deadline: "2024-01-28",
				prize: "⚡ Speed Demon Badge",
				isParticipating: false,
			},
		];

		setPosts(mockPosts);
		setFriends(mockUsers);
		setStudyGroups(mockGroups);
		setChallenges(mockChallenges);
		setLoading(false);
	};

	const handleLike = (postId: string) => {
		setPosts((prev) =>
			prev.map((post) =>
				post.id === postId
					? {
							...post,
							isLiked: !post.isLiked,
							likes: post.isLiked ? post.likes - 1 : post.likes + 1,
						}
					: post,
			),
		);
	};

	const handleBookmark = (postId: string) => {
		setPosts((prev) =>
			prev.map((post) =>
				post.id === postId
					? { ...post, isBookmarked: !post.isBookmarked }
					: post,
			),
		);
	};

	const handleFollow = (userId: string) => {
		setFriends((prev) =>
			prev.map((user) =>
				user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user,
			),
		);
	};

	const joinGroup = (groupId: string) => {
		setStudyGroups((prev) =>
			prev.map((group) =>
				group.id === groupId ? { ...group, isJoined: !group.isJoined } : group,
			),
		);
	};

	const joinChallenge = (challengeId: string) => {
		setChallenges((prev) =>
			prev.map((challenge) =>
				challenge.id === challengeId
					? { ...challenge, isParticipating: !challenge.isParticipating }
					: challenge,
			),
		);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Social Hub</h1>
				<p className="text-gray-600">
					Connect with fellow coders and learn together
				</p>
			</div>

			{/* Tab Navigation */}
			<div className="border-b border-gray-200 mb-6">
				<nav className="flex space-x-8">
					{[
						{ id: "feed", name: "Feed", icon: ChatBubbleLeftRightIcon },
						{ id: "friends", name: "Friends", icon: UserGroupIcon },
						{ id: "groups", name: "Study Groups", icon: UserGroupIcon },
						{ id: "challenges", name: "Challenges", icon: TrophyIcon },
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id as TabType)}
							className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
								activeTab === tab.id
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							<tab.icon className="h-5 w-5" />
							{tab.name}
						</button>
					))}
				</nav>
			</div>

			{/* Feed Tab */}
			{activeTab === "feed" && (
				<div className="space-y-6">
					{/* Create Post */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex gap-4">
							<div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
								U
							</div>
							<div className="flex-1">
								<textarea
									value={newPost}
									onChange={(e) => setNewPost(e.target.value)}
									placeholder="Share your coding insights, solutions, or questions..."
									className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									rows={3}
								/>
								<div className="flex justify-between items-center mt-3">
									<div className="flex gap-2">
										<button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
											<CodeBracketIcon className="h-5 w-5" />
										</button>
										<button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
											<PhotoIcon className="h-5 w-5" />
										</button>
									</div>
									<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
										Share
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Posts */}
					{posts.map((post) => (
						<div
							key={post.id}
							className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
						>
							{/* Post Header */}
							<div className="flex items-center gap-3 mb-4">
								<div className="text-2xl">{post.author.avatar}</div>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-gray-900">
											{post.author.username}
										</span>
										{post.author.title && (
											<span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
												{post.author.title}
											</span>
										)}
										<span className="text-blue-600 text-sm">
											Level {post.author.level}
										</span>
									</div>
									<div className="text-sm text-gray-500">{post.createdAt}</div>
								</div>
								<button className="p-2 text-gray-400 hover:text-gray-600">
									<ShareIcon className="h-5 w-5" />
								</button>
							</div>

							{/* Post Content */}
							<div className="mb-4">
								<p className="text-gray-800 mb-3">{post.content}</p>

								{post.code && (
									<div className="bg-gray-900 rounded-lg p-4 mb-3">
										<div className="flex items-center justify-between mb-2">
											<span className="text-gray-400 text-sm">
												{post.code.language}
											</span>
											<span className="text-gray-400 text-sm">
												{post.code.problem}
											</span>
										</div>
										<pre className="text-green-400 text-sm overflow-x-auto">
											<code>{post.code.snippet}</code>
										</pre>
									</div>
								)}

								{post.image && (
									<img
										src={post.image}
										alt="Post content"
										className="w-full h-64 object-cover rounded-lg mb-3"
									/>
								)}

								{post.tags.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{post.tags.map((tag, index) => (
											<span
												key={index}
												className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
											>
												#{tag}
											</span>
										))}
									</div>
								)}
							</div>

							{/* Post Actions */}
							<div className="flex items-center justify-between pt-4 border-t border-gray-100">
								<div className="flex items-center gap-6">
									<button
										onClick={() => handleLike(post.id)}
										className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
									>
										{post.isLiked ? (
											<HeartSolidIcon className="h-5 w-5 text-red-500" />
										) : (
											<HeartIcon className="h-5 w-5" />
										)}
										<span>{post.likes}</span>
									</button>

									<button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
										<ChatBubbleLeftRightIcon className="h-5 w-5" />
										<span>{post.comments}</span>
									</button>

									<button
										onClick={() => handleBookmark(post.id)}
										className="text-gray-500 hover:text-yellow-500 transition-colors"
									>
										{post.isBookmarked ? (
											<BookmarkSolidIcon className="h-5 w-5 text-yellow-500" />
										) : (
											<BookmarkIcon className="h-5 w-5" />
										)}
									</button>
								</div>

								<div className="flex items-center gap-2 text-sm text-gray-500">
									<EyeIcon className="h-4 w-4" />
									<span>{Math.floor(Math.random() * 500) + 100} views</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Friends Tab */}
			{activeTab === "friends" && (
				<div className="space-y-6">
					{/* Friend Suggestions */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Suggested Friends
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{friends.map((friend) => (
								<div
									key={friend.id}
									className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg"
								>
									<div className="text-2xl">{friend.avatar}</div>
									<div className="flex-1">
										<div className="font-semibold text-gray-900">
											{friend.username}
										</div>
										<div className="text-sm text-gray-500">
											Level {friend.level}
										</div>
										{friend.title && (
											<div className="text-xs text-purple-600 mt-1">
												{friend.title}
											</div>
										)}
									</div>
									<button
										onClick={() => handleFollow(friend.id)}
										className={`px-3 py-1 text-sm rounded-lg transition-colors ${
											friend.isFollowing
												? "bg-gray-100 text-gray-700 hover:bg-gray-200"
												: "bg-blue-600 text-white hover:bg-blue-700"
										}`}
									>
										{friend.isFollowing ? "Following" : "Follow"}
									</button>
								</div>
							))}
						</div>
					</div>

					{/* Online Friends */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Online Now
						</h3>
						<div className="space-y-3">
							{friends
								.filter((f) => f.isOnline)
								.map((friend) => (
									<div
										key={friend.id}
										className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
									>
										<div className="relative">
											<div className="text-2xl">{friend.avatar}</div>
											<div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
										</div>
										<div className="flex-1">
											<div className="font-medium text-gray-900">
												{friend.username}
											</div>
											<div className="text-sm text-green-600">Online</div>
										</div>
										<button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors">
											Message
										</button>
									</div>
								))}
						</div>
					</div>
				</div>
			)}

			{/* Study Groups Tab */}
			{activeTab === "groups" && (
				<div className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{studyGroups.map((group) => (
							<div
								key={group.id}
								className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
							>
								<div className="flex justify-between items-start mb-4">
									<div>
										<h3 className="text-lg font-semibold text-gray-900">
											{group.name}
										</h3>
										<p className="text-sm text-gray-600 mt-1">
											{group.description}
										</p>
									</div>
									<span
										className={`px-2 py-1 text-xs rounded-full ${
											group.difficulty === "Beginner"
												? "bg-green-100 text-green-800"
												: group.difficulty === "Intermediate"
													? "bg-yellow-100 text-yellow-800"
													: "bg-red-100 text-red-800"
										}`}
									>
										{group.difficulty}
									</span>
								</div>

								<div className="space-y-3 mb-4">
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<UserGroupIcon className="h-4 w-4" />
										<span>
											{group.members.length}/{group.maxMembers} members
										</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<span className="font-medium">Category:</span>
										<span>{group.category}</span>
									</div>
									{group.nextSession && (
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<span className="font-medium">Next session:</span>
											<span>{group.nextSession}</span>
										</div>
									)}
								</div>

								<div className="flex justify-between items-center">
									<div className="flex -space-x-2">
										{group.members.slice(0, 3).map((member, index) => (
											<div
												key={index}
												className="text-lg border-2 border-white rounded-full bg-gray-100"
											>
												{member.avatar}
											</div>
										))}
										{group.members.length > 3 && (
											<div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600 border-2 border-white">
												+{group.members.length - 3}
											</div>
										)}
									</div>

									<button
										onClick={() => joinGroup(group.id)}
										className={`px-4 py-2 rounded-lg text-sm transition-colors ${
											group.isJoined
												? "bg-red-100 text-red-700 hover:bg-red-200"
												: "bg-blue-600 text-white hover:bg-blue-700"
										}`}
									>
										{group.isJoined ? "Leave" : "Join"}
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Challenges Tab */}
			{activeTab === "challenges" && (
				<div className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{challenges.map((challenge) => (
							<div
								key={challenge.id}
								className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
							>
								<div className="flex items-center gap-3 mb-4">
									<div className="text-xl">{challenge.creator.avatar}</div>
									<div>
										<div className="font-semibold text-gray-900">
											{challenge.creator.username}
										</div>
										<div className="text-sm text-gray-500">
											Challenge Creator
										</div>
									</div>
								</div>

								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{challenge.title}
								</h3>
								<p className="text-gray-600 mb-4">{challenge.description}</p>

								<div className="space-y-2 mb-4 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-600">Problem:</span>
										<span className="font-medium">{challenge.problem}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Difficulty:</span>
										<span
											className={`font-medium ${
												challenge.difficulty === "Easy"
													? "text-green-600"
													: challenge.difficulty === "Medium"
														? "text-yellow-600"
														: "text-red-600"
											}`}
										>
											{challenge.difficulty}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Participants:</span>
										<span className="font-medium">
											{challenge.participants}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Deadline:</span>
										<span className="font-medium">{challenge.deadline}</span>
									</div>
									{challenge.prize && (
										<div className="flex justify-between">
											<span className="text-gray-600">Prize:</span>
											<span className="font-medium text-purple-600">
												{challenge.prize}
											</span>
										</div>
									)}
								</div>

								<button
									onClick={() => joinChallenge(challenge.id)}
									className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
										challenge.isParticipating
											? "bg-green-100 text-green-700 hover:bg-green-200"
											: "bg-blue-600 text-white hover:bg-blue-700"
									}`}
								>
									{challenge.isParticipating
										? "Participating ✓"
										: "Join Challenge"}
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
