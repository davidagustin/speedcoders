"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Input, Card, Badge, Progress, Tabs } from "@/components/ui/UIComponents";
import { useToast } from "@/components/providers/ToastProvider";

export default function ProfilePage() {
	const { data: session } = useSession();
	const { showSuccess } = useToast();
	const [isEditing, setIsEditing] = useState(false);
	const [profileData, setProfileData] = useState({
		username: "speedcoder_pro",
		email: "user@example.com",
		bio: "Passionate software developer focused on algorithms and data structures. Currently preparing for FAANG interviews.",
		location: "San Francisco, CA",
		website: "https://github.com/speedcoder",
		company: "Tech Startup Inc.",
		skills: ["JavaScript", "Python", "React", "Node.js", "Algorithms"],
	});

	const [stats] = useState({
		problemsSolved: 847,
		totalSubmissions: 1203,
		acceptanceRate: 70.4,
		currentStreak: 23,
		maxStreak: 89,
		contestRating: 1847,
		globalRank: 15420,
		countryRank: 2340
	});

	const handleSave = () => {
		// In real app, save to API
		setIsEditing(false);
		showSuccess("Profile updated successfully!");
	};

	const tabsData = [
		{
			label: "Overview",
			content: (
				<div className="space-y-6">
					{/* Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card variant="bordered">
							<div className="text-center">
								<div className="text-3xl font-bold text-blue-600">{stats.problemsSolved}</div>
								<div className="text-gray-600">Problems Solved</div>
							</div>
						</Card>
						<Card variant="bordered">
							<div className="text-center">
								<div className="text-3xl font-bold text-green-600">{stats.acceptanceRate}%</div>
								<div className="text-gray-600">Acceptance Rate</div>
							</div>
						</Card>
						<Card variant="bordered">
							<div className="text-center">
								<div className="text-3xl font-bold text-purple-600">{stats.currentStreak}</div>
								<div className="text-gray-600">Current Streak</div>
							</div>
						</Card>
					</div>

					{/* Recent Activity */}
					<Card title="Recent Activity" icon="📊">
						<div className="space-y-4">
							<div className="flex items-center justify-between py-3 border-b">
								<div className="flex items-center gap-3">
									<Badge variant="success">Solved</Badge>
									<span className="font-medium">Two Sum II - Input Array Is Sorted</span>
								</div>
								<span className="text-gray-500">2 hours ago</span>
							</div>
							<div className="flex items-center justify-between py-3 border-b">
								<div className="flex items-center gap-3">
									<Badge variant="warning">Attempted</Badge>
									<span className="font-medium">Longest Palindromic Substring</span>
								</div>
								<span className="text-gray-500">5 hours ago</span>
							</div>
							<div className="flex items-center justify-between py-3">
								<div className="flex items-center gap-3">
									<Badge variant="success">Solved</Badge>
									<span className="font-medium">Valid Parentheses</span>
								</div>
								<span className="text-gray-500">1 day ago</span>
							</div>
						</div>
					</Card>
				</div>
			)
		},
		{
			label: "Edit Profile",
			content: (
				<div className="space-y-6 max-w-2xl">
					<Card>
						<div className="space-y-4">
							<Input
								label="Username"
								value={profileData.username}
								onChange={(e) => setProfileData({...profileData, username: e.target.value})}
								disabled={!isEditing}
								icon="👤"
							/>
							<Input
								label="Email"
								type="email"
								value={profileData.email}
								onChange={(e) => setProfileData({...profileData, email: e.target.value})}
								disabled={!isEditing}
								icon="📧"
							/>
							<div className="form-group">
								<label className="input-label">Bio</label>
								<textarea
									value={profileData.bio}
									onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
									disabled={!isEditing}
									className="input-field min-h-[100px] resize-none"
									placeholder="Tell us about yourself..."
								/>
							</div>
							<Input
								label="Location"
								value={profileData.location}
								onChange={(e) => setProfileData({...profileData, location: e.target.value})}
								disabled={!isEditing}
								icon="📍"
							/>
							<Input
								label="Website"
								value={profileData.website}
								onChange={(e) => setProfileData({...profileData, website: e.target.value})}
								disabled={!isEditing}
								icon="🌐"
							/>
							<Input
								label="Company"
								value={profileData.company}
								onChange={(e) => setProfileData({...profileData, company: e.target.value})}
								disabled={!isEditing}
								icon="🏢"
							/>
						</div>

						<div className="mt-6 flex gap-3">
							{isEditing ? (
								<>
									<Button variant="primary" onClick={handleSave}>
										Save Changes
									</Button>
									<Button variant="ghost" onClick={() => setIsEditing(false)}>
										Cancel
									</Button>
								</>
							) : (
								<Button variant="primary" onClick={() => setIsEditing(true)}>
									Edit Profile
								</Button>
							)}
						</div>
					</Card>
				</div>
			)
		},
		{
			label: "Statistics",
			content: (
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Card title="Problem Solving" icon="🧩">
							<div className="space-y-4">
								<Progress value={85} label="Easy Problems" color="green" />
								<Progress value={62} label="Medium Problems" color="purple" />
								<Progress value={34} label="Hard Problems" color="red" />
							</div>
						</Card>
						
						<Card title="Contest Performance" icon="🏆">
							<div className="space-y-3">
								<div className="flex justify-between">
									<span>Contest Rating:</span>
									<Badge variant="info">{stats.contestRating}</Badge>
								</div>
								<div className="flex justify-between">
									<span>Global Rank:</span>
									<span className="font-semibold">#{stats.globalRank.toLocaleString()}</span>
								</div>
								<div className="flex justify-between">
									<span>Country Rank:</span>
									<span className="font-semibold">#{stats.countryRank.toLocaleString()}</span>
								</div>
							</div>
						</Card>
					</div>

					<Card title="Skills & Technologies" icon="⚡">
						<div className="flex flex-wrap gap-2">
							{profileData.skills.map((skill, index) => (
								<Badge key={index} variant="default">{skill}</Badge>
							))}
						</div>
					</Card>
				</div>
			)
		}
	];

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				{/* Profile Header */}
				<Card className="mb-8">
					<div className="flex items-center gap-6">
						<div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
							{profileData.username.charAt(0).toUpperCase()}
						</div>
						<div className="flex-1">
							<h1 className="text-3xl font-bold text-gray-900">{profileData.username}</h1>
							<p className="text-gray-600 mt-1">{profileData.bio}</p>
							<div className="flex items-center gap-4 mt-3">
								<Badge variant="success" dot>Online</Badge>
								<span className="text-gray-500">📍 {profileData.location}</span>
								<span className="text-gray-500">🏢 {profileData.company}</span>
							</div>
						</div>
						<div className="text-right">
							<div className="text-sm text-gray-500">Level</div>
							<div className="text-2xl font-bold text-purple-600">42</div>
						</div>
					</div>
				</Card>

				{/* Tabs Content */}
				<Card>
					<Tabs tabs={tabsData} />
				</Card>
			</div>
		</div>
	);
}