import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/next-auth";

interface StudyGroup {
	id: string;
	name: string;
	description: string;
	category: string;
	difficulty: string;
	members: GroupMember[];
	maxMembers: number;
	isPrivate: boolean;
	inviteCode?: string;
	creator: string;
	createdAt: Date;
	settings: GroupSettings;
	challenges: GroupChallenge[];
	schedule: StudySession[];
	stats: GroupStats;
}

interface GroupMember {
	id: string;
	username: string;
	avatar?: string;
	role: "creator" | "moderator" | "member";
	joinedAt: Date;
	lastActive: Date;
	contributions: {
		problemsSolved: number;
		helpfulAnswers: number;
		sessionsAttended: number;
	};
	status: "active" | "inactive";
}

interface GroupSettings {
	allowMemberInvites: boolean;
	requireApproval: boolean;
	dailyGoal: number;
	weeklyGoal: number;
	focusAreas: string[];
	studyTime: string; // preferred time
	timezone: string;
	notifications: {
		newChallenges: boolean;
		studySessions: boolean;
		achievements: boolean;
	};
}

interface GroupChallenge {
	id: string;
	title: string;
	description: string;
	type: "individual" | "team" | "collaborative";
	difficulty: string;
	category: string;
	problemCount: number;
	timeLimit?: number;
	startDate: Date;
	endDate: Date;
	participants: ChallengeParticipant[];
	rewards: ChallengeReward[];
	status: "upcoming" | "active" | "completed";
	leaderboard: LeaderboardEntry[];
}

interface ChallengeParticipant {
	userId: string;
	username: string;
	score: number;
	problemsCompleted: number;
	rank: number;
	timeSpent: number;
	joinedAt: Date;
}

interface ChallengeReward {
	type: "badge" | "points" | "title";
	name: string;
	description: string;
	criteria: string;
	value: number;
}

interface StudySession {
	id: string;
	title: string;
	description: string;
	scheduledTime: Date;
	duration: number; // minutes
	host: string;
	attendees: string[];
	topics: string[];
	resources: SessionResource[];
	status: "scheduled" | "active" | "completed" | "cancelled";
	recordingUrl?: string;
}

interface SessionResource {
	type: "problem" | "article" | "video" | "notes";
	title: string;
	url: string;
	description?: string;
}

interface GroupStats {
	totalMembers: number;
	activeMembersWeek: number;
	totalProblemsShared: number;
	averageScore: number;
	sessionsCompleted: number;
	challengesCompleted: number;
	helpfulAnswers: number;
}

interface LeaderboardEntry {
	rank: number;
	userId: string;
	username: string;
	score: number;
	problemsCompleted: number;
	timeSpent: number;
	achievements: string[];
}

// In-memory storage for demo (use database in production)
const studyGroups: Map<string, StudyGroup> = new Map();

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { action, ...params } = await request.json();
		const userId = session.user.email;

		switch (action) {
			case "create":
				return createStudyGroup(userId, params);
			case "join":
				return joinStudyGroup(userId, params);
			case "leave":
				return leaveStudyGroup(userId, params);
			case "invite":
				return inviteToGroup(userId, params);
			case "createChallenge":
				return createGroupChallenge(userId, params);
			case "joinChallenge":
				return joinChallenge(userId, params);
			case "scheduleSession":
				return scheduleStudySession(userId, params);
			case "attendSession":
				return attendStudySession(userId, params);
			case "updateSettings":
				return updateGroupSettings(userId, params);
			case "kickMember":
				return kickMember(userId, params);
			case "promoteToModerator":
				return promoteToModerator(userId, params);
			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
	} catch (error) {
		console.error("Study groups error:", error);
		return NextResponse.json(
			{ error: "Study groups system error" },
			{ status: 500 },
		);
	}
}

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const groupId = searchParams.get("groupId");
		const userId = session.user.email;

		if (groupId) {
			return getStudyGroup(userId, groupId);
		}

		// List available study groups
		return listStudyGroups(userId);
	} catch (error) {
		console.error("Get study groups error:", error);
		return NextResponse.json(
			{ error: "Failed to get study groups" },
			{ status: 500 },
		);
	}
}

async function createStudyGroup(userId: string, params: any) {
	const {
		name,
		description,
		category = "General",
		difficulty = "Mixed",
		maxMembers = 50,
		isPrivate = false,
		settings = {},
	} = params;

	const groupId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
	const inviteCode = isPrivate ? generateInviteCode() : undefined;

	const group: StudyGroup = {
		id: groupId,
		name,
		description,
		category,
		difficulty,
		members: [
			{
				id: userId,
				username: getUserDisplayName(userId),
				role: "creator",
				joinedAt: new Date(),
				lastActive: new Date(),
				contributions: {
					problemsSolved: 0,
					helpfulAnswers: 0,
					sessionsAttended: 0,
				},
				status: "active",
			},
		],
		maxMembers,
		isPrivate,
		inviteCode,
		creator: userId,
		createdAt: new Date(),
		settings: {
			allowMemberInvites: true,
			requireApproval: false,
			dailyGoal: 3,
			weeklyGoal: 15,
			focusAreas: [category],
			studyTime: "19:00",
			timezone: "UTC",
			notifications: {
				newChallenges: true,
				studySessions: true,
				achievements: true,
			},
			...settings,
		},
		challenges: [],
		schedule: [],
		stats: {
			totalMembers: 1,
			activeMembersWeek: 1,
			totalProblemsShared: 0,
			averageScore: 0,
			sessionsCompleted: 0,
			challengesCompleted: 0,
			helpfulAnswers: 0,
		},
	};

	studyGroups.set(groupId, group);

	return NextResponse.json({
		success: true,
		groupId,
		inviteCode,
		group: sanitizeGroupForUser(group, userId),
	});
}

async function joinStudyGroup(userId: string, params: any) {
	const { groupId, inviteCode } = params;
	const group = studyGroups.get(groupId);

	if (!group) {
		return NextResponse.json({ error: "Group not found" }, { status: 404 });
	}

	if (group.members.some((m) => m.id === userId)) {
		return NextResponse.json({ error: "Already a member" }, { status: 400 });
	}

	if (group.members.length >= group.maxMembers) {
		return NextResponse.json({ error: "Group is full" }, { status: 400 });
	}

	if (group.isPrivate && group.inviteCode !== inviteCode) {
		return NextResponse.json({ error: "Invalid invite code" }, { status: 403 });
	}

	// Add member to group
	group.members.push({
		id: userId,
		username: getUserDisplayName(userId),
		role: "member",
		joinedAt: new Date(),
		lastActive: new Date(),
		contributions: {
			problemsSolved: 0,
			helpfulAnswers: 0,
			sessionsAttended: 0,
		},
		status: "active",
	});

	group.stats.totalMembers = group.members.length;
	studyGroups.set(groupId, group);

	return NextResponse.json({
		success: true,
		group: sanitizeGroupForUser(group, userId),
		message: `Joined ${group.name}`,
	});
}

async function createGroupChallenge(userId: string, params: any) {
	const {
		groupId,
		title,
		description,
		type = "individual",
		difficulty = "Mixed",
		category,
		problemCount = 10,
		timeLimit,
		duration = 7, // days
	} = params;

	const group = studyGroups.get(groupId);
	if (!group) {
		return NextResponse.json({ error: "Group not found" }, { status: 404 });
	}

	const member = group.members.find((m) => m.id === userId);
	if (!member || (member.role !== "creator" && member.role !== "moderator")) {
		return NextResponse.json(
			{ error: "Insufficient permissions" },
			{ status: 403 },
		);
	}

	const challengeId = `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
	const startDate = new Date();
	const endDate = new Date();
	endDate.setDate(startDate.getDate() + duration);

	const challenge: GroupChallenge = {
		id: challengeId,
		title,
		description,
		type,
		difficulty,
		category: category || group.category,
		problemCount,
		timeLimit,
		startDate,
		endDate,
		participants: [],
		rewards: generateChallengeRewards(type, difficulty, problemCount),
		status: "upcoming",
		leaderboard: [],
	};

	group.challenges.push(challenge);
	studyGroups.set(groupId, group);

	return NextResponse.json({
		success: true,
		challengeId,
		challenge,
		message: `Created challenge: ${title}`,
	});
}

async function joinChallenge(userId: string, params: any) {
	const { groupId, challengeId } = params;
	const group = studyGroups.get(groupId);

	if (!group) {
		return NextResponse.json({ error: "Group not found" }, { status: 404 });
	}

	const member = group.members.find((m) => m.id === userId);
	if (!member) {
		return NextResponse.json({ error: "Not a group member" }, { status: 403 });
	}

	const challenge = group.challenges.find((c) => c.id === challengeId);
	if (!challenge) {
		return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
	}

	if (challenge.status === "completed") {
		return NextResponse.json(
			{ error: "Challenge already completed" },
			{ status: 400 },
		);
	}

	if (challenge.participants.some((p) => p.userId === userId)) {
		return NextResponse.json(
			{ error: "Already joined challenge" },
			{ status: 400 },
		);
	}

	// Add participant
	challenge.participants.push({
		userId,
		username: member.username,
		score: 0,
		problemsCompleted: 0,
		rank: challenge.participants.length + 1,
		timeSpent: 0,
		joinedAt: new Date(),
	});

	// Start challenge if it was upcoming and now has participants
	if (challenge.status === "upcoming" && challenge.participants.length > 0) {
		challenge.status = "active";
	}

	studyGroups.set(groupId, group);

	return NextResponse.json({
		success: true,
		challenge,
		message: `Joined challenge: ${challenge.title}`,
	});
}

async function scheduleStudySession(userId: string, params: any) {
	const {
		groupId,
		title,
		description,
		scheduledTime,
		duration = 60,
		topics = [],
		resources = [],
	} = params;

	const group = studyGroups.get(groupId);
	if (!group) {
		return NextResponse.json({ error: "Group not found" }, { status: 404 });
	}

	const member = group.members.find((m) => m.id === userId);
	if (!member) {
		return NextResponse.json({ error: "Not a group member" }, { status: 403 });
	}

	const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

	const session: StudySession = {
		id: sessionId,
		title,
		description,
		scheduledTime: new Date(scheduledTime),
		duration,
		host: userId,
		attendees: [userId], // Host is automatically attending
		topics,
		resources,
		status: "scheduled",
	};

	group.schedule.push(session);
	studyGroups.set(groupId, group);

	return NextResponse.json({
		success: true,
		sessionId,
		session,
		message: `Scheduled session: ${title}`,
	});
}

async function getStudyGroup(userId: string, groupId: string) {
	const group = studyGroups.get(groupId);

	if (!group) {
		return NextResponse.json({ error: "Group not found" }, { status: 404 });
	}

	const member = group.members.find((m) => m.id === userId);
	if (!member && group.isPrivate) {
		return NextResponse.json({ error: "Access denied" }, { status: 403 });
	}

	return NextResponse.json({
		group: sanitizeGroupForUser(group, userId),
		userRole: member?.role || null,
		isMember: !!member,
	});
}

async function listStudyGroups(userId: string) {
	const publicGroups = Array.from(studyGroups.values())
		.filter((group) => !group.isPrivate)
		.map((group) => ({
			id: group.id,
			name: group.name,
			description: group.description,
			category: group.category,
			difficulty: group.difficulty,
			memberCount: group.members.length,
			maxMembers: group.maxMembers,
			createdAt: group.createdAt,
			isMember: group.members.some((m) => m.id === userId),
		}));

	const myGroups = Array.from(studyGroups.values())
		.filter((group) => group.members.some((m) => m.id === userId))
		.map((group) => ({
			id: group.id,
			name: group.name,
			description: group.description,
			category: group.category,
			role: group.members.find((m) => m.id === userId)?.role,
			memberCount: group.members.length,
			activeChallenges: group.challenges.filter((c) => c.status === "active")
				.length,
			upcomingSessions: group.schedule.filter(
				(s) =>
					s.status === "scheduled" && new Date(s.scheduledTime) > new Date(),
			).length,
		}));

	return NextResponse.json({
		myGroups,
		availableGroups: publicGroups,
		recommendations: generateGroupRecommendations(userId),
	});
}

// Helper functions
function getUserDisplayName(userId: string): string {
	return userId.split("@")[0] || userId;
}

function generateInviteCode(): string {
	return Math.random().toString(36).substr(2, 8).toUpperCase();
}

function sanitizeGroupForUser(group: StudyGroup, userId: string) {
	const member = group.members.find((m) => m.id === userId);
	const canViewPrivateInfo =
		member && (member.role === "creator" || member.role === "moderator");

	return {
		...group,
		inviteCode: canViewPrivateInfo ? group.inviteCode : undefined,
		members: group.members.map((m) => ({
			id: m.id,
			username: m.username,
			avatar: m.avatar,
			role: m.role,
			joinedAt: m.joinedAt,
			lastActive: m.lastActive,
			status: m.status,
			contributions:
				canViewPrivateInfo || m.id === userId ? m.contributions : undefined,
		})),
	};
}

function generateChallengeRewards(
	type: string,
	difficulty: string,
	problemCount: number,
): ChallengeReward[] {
	const basePoints =
		problemCount *
		(difficulty === "Easy" ? 10 : difficulty === "Medium" ? 20 : 30);

	const rewards: ChallengeReward[] = [
		{
			type: "points",
			name: "Completion Reward",
			description: "Points for completing the challenge",
			criteria: "Complete all problems",
			value: basePoints,
		},
	];

	if (type === "team") {
		rewards.push({
			type: "badge",
			name: "Team Player",
			description: "Participated in team challenge",
			criteria: "Complete team challenge",
			value: 50,
		});
	}

	if (difficulty === "Hard") {
		rewards.push({
			type: "title",
			name: "Challenge Master",
			description: "Completed hard difficulty challenge",
			criteria: "Complete hard challenge",
			value: 100,
		});
	}

	return rewards;
}

function generateGroupRecommendations(_userId: string): any[] {
	// In a real app, this would use AI/ML to recommend based on:
	// - User's skill level and interests
	// - Active groups with similar focus
	// - Groups with complementary skill sets
	// - Location/timezone preferences

	return [
		{
			id: "rec_1",
			name: "Beginner Algorithms Study",
			description: "Perfect for learning fundamental algorithms",
			category: "Array",
			memberCount: 23,
			reason: "Matches your current skill level",
		},
		{
			id: "rec_2",
			name: "Dynamic Programming Masters",
			description: "Advanced DP problem solving",
			category: "Dynamic Programming",
			memberCount: 15,
			reason: "Based on your interest in challenging problems",
		},
	];
}

// Additional helper functions for other actions would go here...
async function leaveStudyGroup(userId: string, params: any) {
	const { groupId } = params;
	const group = studyGroups.get(groupId);

	if (!group) {
		return NextResponse.json({ error: "Group not found" }, { status: 404 });
	}

	const memberIndex = group.members.findIndex((m) => m.id === userId);
	if (memberIndex === -1) {
		return NextResponse.json({ error: "Not a member" }, { status: 400 });
	}

	group.members.splice(memberIndex, 1);
	group.stats.totalMembers = group.members.length;

	// If creator left and there are other members, assign new creator
	if (group.creator === userId && group.members.length > 0) {
		const nextCreator =
			group.members.find((m) => m.role === "moderator") || group.members[0];
		nextCreator.role = "creator";
		group.creator = nextCreator.id;
	}

	// Delete group if no members left
	if (group.members.length === 0) {
		studyGroups.delete(groupId);
		return NextResponse.json({ success: true, message: "Left group" });
	}

	studyGroups.set(groupId, group);
	return NextResponse.json({ success: true, message: "Left group" });
}

async function attendStudySession(userId: string, params: any) {
	const { groupId, sessionId } = params;
	const group = studyGroups.get(groupId);

	if (!group) {
		return NextResponse.json({ error: "Group not found" }, { status: 404 });
	}

	const member = group.members.find((m) => m.id === userId);
	if (!member) {
		return NextResponse.json({ error: "Not a group member" }, { status: 403 });
	}

	const session = group.schedule.find((s) => s.id === sessionId);
	if (!session) {
		return NextResponse.json({ error: "Session not found" }, { status: 404 });
	}

	if (!session.attendees.includes(userId)) {
		session.attendees.push(userId);
		member.contributions.sessionsAttended++;
	}

	studyGroups.set(groupId, group);

	return NextResponse.json({
		success: true,
		session,
		message: `Registered for session: ${session.title}`,
	});
}

async function updateGroupSettings(userId: string, params: any) {
	const { groupId, settings } = params;
	const group = studyGroups.get(groupId);

	if (!group) {
		return NextResponse.json({ error: "Group not found" }, { status: 404 });
	}

	const member = group.members.find((m) => m.id === userId);
	if (!member || (member.role !== "creator" && member.role !== "moderator")) {
		return NextResponse.json(
			{ error: "Insufficient permissions" },
			{ status: 403 },
		);
	}

	group.settings = { ...group.settings, ...settings };
	studyGroups.set(groupId, group);

	return NextResponse.json({
		success: true,
		settings: group.settings,
		message: "Settings updated",
	});
}

async function kickMember(userId: string, params: any) {
	const { groupId, memberId } = params;
	const group = studyGroups.get(groupId);

	if (!group) {
		return NextResponse.json({ error: "Group not found" }, { status: 404 });
	}

	const requester = group.members.find((m) => m.id === userId);
	if (
		!requester ||
		(requester.role !== "creator" && requester.role !== "moderator")
	) {
		return NextResponse.json(
			{ error: "Insufficient permissions" },
			{ status: 403 },
		);
	}

	if (memberId === group.creator) {
		return NextResponse.json(
			{ error: "Cannot kick group creator" },
			{ status: 400 },
		);
	}

	const memberIndex = group.members.findIndex((m) => m.id === memberId);
	if (memberIndex === -1) {
		return NextResponse.json({ error: "Member not found" }, { status: 404 });
	}

	group.members.splice(memberIndex, 1);
	group.stats.totalMembers = group.members.length;
	studyGroups.set(groupId, group);

	return NextResponse.json({
		success: true,
		message: "Member removed from group",
	});
}

async function promoteToModerator(userId: string, params: any) {
	const { groupId, memberId } = params;
	const group = studyGroups.get(groupId);

	if (!group) {
		return NextResponse.json({ error: "Group not found" }, { status: 404 });
	}

	if (group.creator !== userId) {
		return NextResponse.json(
			{ error: "Only creator can promote members" },
			{ status: 403 },
		);
	}

	const member = group.members.find((m) => m.id === memberId);
	if (!member) {
		return NextResponse.json({ error: "Member not found" }, { status: 404 });
	}

	member.role = "moderator";
	studyGroups.set(groupId, group);

	return NextResponse.json({
		success: true,
		message: `${member.username} promoted to moderator`,
	});
}

async function inviteToGroup(userId: string, params: any) {
	const { groupId, inviteeEmail } = params;
	const group = studyGroups.get(groupId);

	if (!group) {
		return NextResponse.json({ error: "Group not found" }, { status: 404 });
	}

	const member = group.members.find((m) => m.id === userId);
	if (
		!member ||
		(!group.settings.allowMemberInvites && member.role === "member")
	) {
		return NextResponse.json(
			{ error: "Insufficient permissions" },
			{ status: 403 },
		);
	}

	// In a real app, this would send an email invitation
	return NextResponse.json({
		success: true,
		inviteCode: group.inviteCode || "PUBLIC",
		message: `Invitation sent to ${inviteeEmail}`,
	});
}
