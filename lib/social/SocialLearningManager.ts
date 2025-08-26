import { EventEmitter } from 'events';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
  experience: number;
  badges: Badge[];
  followers: number;
  following: number;
  joinDate: Date;
  lastActive: Date;
  preferences: UserPreferences;
  stats: UserStats;
}

interface UserPreferences {
  privacy: 'public' | 'friends' | 'private';
  notifications: {
    mentions: boolean;
    follows: boolean;
    likes: boolean;
    comments: boolean;
    achievements: boolean;
  };
  visibility: {
    profile: boolean;
    progress: boolean;
    solutions: boolean;
    activity: boolean;
  };
}

interface UserStats {
  totalProblems: number;
  problemsSolved: number;
  accuracy: number;
  streak: number;
  maxStreak: number;
  totalTime: number;
  averageTime: number;
  rank: number;
  points: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earnedDate: Date;
  category: 'achievement' | 'streak' | 'social' | 'special';
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: GroupMember[];
  privacy: 'public' | 'private' | 'invite-only';
  tags: string[];
  focusAreas: string[];
  schedule?: GroupSchedule[];
  resources: GroupResource[];
  challenges: GroupChallenge[];
  createdAt: Date;
  isActive: boolean;
  memberLimit: number;
  rules: string[];
}

interface GroupMember {
  userId: string;
  role: 'owner' | 'moderator' | 'member';
  joinedAt: Date;
  contributions: number;
  lastActive: Date;
  permissions: {
    canPost: boolean;
    canModerate: boolean;
    canInvite: boolean;
  };
}

interface GroupSchedule {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  duration: number;
  type: 'study-session' | 'discussion' | 'contest' | 'review';
  organizer: string;
  attendees: string[];
  location?: string; // virtual meeting link
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
}

interface GroupResource {
  id: string;
  title: string;
  type: 'link' | 'file' | 'note' | 'solution' | 'explanation';
  content: string;
  url?: string;
  authorId: string;
  createdAt: Date;
  likes: number;
  tags: string[];
  category: string;
}

interface GroupChallenge {
  id: string;
  title: string;
  description: string;
  problemIds: string[];
  creatorId: string;
  startDate: Date;
  endDate: Date;
  participants: ChallengeParticipant[];
  prizes: string[];
  rules: string[];
  status: 'upcoming' | 'active' | 'completed';
  leaderboard: LeaderboardEntry[];
}

interface ChallengeParticipant {
  userId: string;
  joinedAt: Date;
  submissions: ChallengeSubmission[];
  score: number;
  rank: number;
}

interface ChallengeSubmission {
  problemId: string;
  submittedAt: Date;
  code: string;
  language: string;
  timeSpent: number;
  isCorrect: boolean;
  score: number;
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  rank: number;
  badge?: string;
  streak: number;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  type: 'question' | 'discussion' | 'solution' | 'tip' | 'announcement';
  tags: string[];
  problemId?: string;
  groupId?: string;
  createdAt: Date;
  updatedAt: Date;
  replies: Reply[];
  upvotes: number;
  downvotes: number;
  views: number;
  isResolved: boolean;
  isPinned: boolean;
  isClosed: boolean;
}

interface Reply {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt?: Date;
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  parentReplyId?: string;
  mentions: string[];
  attachments: Attachment[];
}

interface Attachment {
  id: string;
  type: 'code' | 'image' | 'file' | 'link';
  content: string;
  filename?: string;
  language?: string;
  size?: number;
}

interface Mentorship {
  id: string;
  mentorId: string;
  menteeId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  focusAreas: string[];
  goals: string[];
  sessions: MentorshipSession[];
  feedback: MentorshipFeedback[];
  progress: MentorshipProgress;
}

interface MentorshipSession {
  id: string;
  scheduledAt: Date;
  duration: number;
  type: 'one-on-one' | 'code-review' | 'mock-interview' | 'problem-solving';
  notes: string;
  completed: boolean;
  rating?: number;
  feedback?: string;
}

interface MentorshipFeedback {
  from: 'mentor' | 'mentee';
  content: string;
  rating: number;
  createdAt: Date;
  isPublic: boolean;
}

interface MentorshipProgress {
  goalsCompleted: number;
  totalGoals: number;
  skillsImproved: string[];
  challengesOvercome: string[];
  nextMilestones: string[];
}

interface SocialActivity {
  id: string;
  userId: string;
  type: 'solved_problem' | 'joined_group' | 'earned_badge' | 'posted_solution' | 'helped_user' | 'started_streak' | 'completed_challenge';
  content: string;
  metadata: { [key: string]: any };
  timestamp: Date;
  visibility: 'public' | 'friends' | 'private';
  likes: number;
  comments: ActivityComment[];
}

interface ActivityComment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  likes: number;
}

export class SocialLearningManager extends EventEmitter {
  private static instance: SocialLearningManager;
  private users: Map<string, User> = new Map();
  private studyGroups: Map<string, StudyGroup> = new Map();
  private discussions: Map<string, Discussion> = new Map();
  private mentorships: Map<string, Mentorship> = new Map();
  private activities: Map<string, SocialActivity> = new Map();
  private friendships: Map<string, Set<string>> = new Map();

  private constructor() {
    super();
  }

  static getInstance(): SocialLearningManager {
    if (!SocialLearningManager.instance) {
      SocialLearningManager.instance = new SocialLearningManager();
    }
    return SocialLearningManager.instance;
  }

  // User management
  async createUser(userData: Omit<User, 'id' | 'joinDate' | 'lastActive'>): Promise<User> {
    const user: User = {
      id: this.generateId('user'),
      joinDate: new Date(),
      lastActive: new Date(),
      ...userData
    };

    this.users.set(user.id, user);
    this.friendships.set(user.id, new Set());
    
    // Create welcome activity
    await this.createActivity(user.id, 'joined_platform', 'Welcome to SpeedCoders!', {}, 'public');
    
    this.emit('user:created', user);
    return user;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    const updatedUser = { ...user, ...updates, lastActive: new Date() };
    this.users.set(userId, updatedUser);
    
    this.emit('user:updated', updatedUser);
    return updatedUser;
  }

  // Friend system
  async sendFriendRequest(fromUserId: string, toUserId: string): Promise<boolean> {
    const fromUser = this.users.get(fromUserId);
    const toUser = this.users.get(toUserId);
    
    if (!fromUser || !toUser || fromUserId === toUserId) return false;

    // Check if already friends
    const fromFriends = this.friendships.get(fromUserId) || new Set();
    if (fromFriends.has(toUserId)) return false;

    // Send notification (would integrate with notification system)
    this.emit('friend_request:sent', { from: fromUser, to: toUser });
    
    return true;
  }

  async acceptFriendRequest(userId: string, friendId: string): Promise<boolean> {
    const userFriends = this.friendships.get(userId) || new Set();
    const friendFriends = this.friendships.get(friendId) || new Set();
    
    userFriends.add(friendId);
    friendFriends.add(userId);
    
    this.friendships.set(userId, userFriends);
    this.friendships.set(friendId, friendFriends);
    
    // Update follower counts
    const user = this.users.get(userId);
    const friend = this.users.get(friendId);
    if (user) {
      user.followers++;
      user.following++;
    }
    if (friend) {
      friend.followers++;
      friend.following++;
    }

    // Create activity
    await this.createActivity(userId, 'made_friend', `Now friends with ${friend?.displayName}`, { friendId }, 'friends');
    
    this.emit('friend_request:accepted', { userId, friendId });
    return true;
  }

  async getFriends(userId: string): Promise<User[]> {
    const friendIds = this.friendships.get(userId) || new Set();
    const friends: User[] = [];
    
    friendIds.forEach(friendId => {
      const friend = this.users.get(friendId);
      if (friend) friends.push(friend);
    });
    
    return friends.sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());
  }

  // Study groups
  async createStudyGroup(creatorId: string, groupData: Omit<StudyGroup, 'id' | 'creatorId' | 'members' | 'createdAt'>): Promise<StudyGroup> {
    const creator = this.users.get(creatorId);
    if (!creator) throw new Error('Creator not found');

    const group: StudyGroup = {
      id: this.generateId('group'),
      creatorId,
      members: [{
        userId: creatorId,
        role: 'owner',
        joinedAt: new Date(),
        contributions: 0,
        lastActive: new Date(),
        permissions: {
          canPost: true,
          canModerate: true,
          canInvite: true
        }
      }],
      createdAt: new Date(),
      ...groupData
    };

    this.studyGroups.set(group.id, group);
    
    // Create activity
    await this.createActivity(creatorId, 'created_group', `Created study group: ${group.name}`, { groupId: group.id }, 'public');
    
    this.emit('study_group:created', group);
    return group;
  }

  async joinStudyGroup(userId: string, groupId: string, inviteCode?: string): Promise<boolean> {
    const group = this.studyGroups.get(groupId);
    const user = this.users.get(userId);
    
    if (!group || !user) return false;
    if (group.members.length >= group.memberLimit) return false;
    if (group.members.some(m => m.userId === userId)) return false;

    // Check privacy settings
    if (group.privacy === 'private' || (group.privacy === 'invite-only' && !inviteCode)) {
      return false;
    }

    const member: GroupMember = {
      userId,
      role: 'member',
      joinedAt: new Date(),
      contributions: 0,
      lastActive: new Date(),
      permissions: {
        canPost: true,
        canModerate: false,
        canInvite: group.privacy === 'public'
      }
    };

    group.members.push(member);
    
    // Create activity
    await this.createActivity(userId, 'joined_group', `Joined study group: ${group.name}`, { groupId }, 'friends');
    
    this.emit('study_group:joined', { group, member });
    return true;
  }

  async leaveStudyGroup(userId: string, groupId: string): Promise<boolean> {
    const group = this.studyGroups.get(groupId);
    if (!group) return false;

    const memberIndex = group.members.findIndex(m => m.userId === userId);
    if (memberIndex === -1) return false;

    // If owner is leaving, transfer ownership
    const member = group.members[memberIndex];
    if (member.role === 'owner' && group.members.length > 1) {
      const nextModerator = group.members.find(m => m.role === 'moderator');
      const nextOwner = nextModerator || group.members.find(m => m.userId !== userId);
      if (nextOwner) {
        nextOwner.role = 'owner';
        nextOwner.permissions.canModerate = true;
      }
    }

    group.members.splice(memberIndex, 1);

    // If no members left, deactivate group
    if (group.members.length === 0) {
      group.isActive = false;
    }

    this.emit('study_group:left', { groupId, userId });
    return true;
  }

  // Group activities
  async scheduleGroupSession(
    groupId: string,
    organizerId: string,
    sessionData: Omit<GroupSchedule, 'id' | 'organizer' | 'attendees'>
  ): Promise<GroupSchedule | null> {
    const group = this.studyGroups.get(groupId);
    const organizer = group?.members.find(m => m.userId === organizerId && m.permissions.canModerate);
    
    if (!group || !organizer) return null;

    const session: GroupSchedule = {
      id: this.generateId('session'),
      organizer: organizerId,
      attendees: [],
      ...sessionData
    };

    group.schedule = group.schedule || [];
    group.schedule.push(session);

    // Notify group members
    this.emit('group_session:scheduled', { group, session });
    return session;
  }

  async addGroupResource(
    groupId: string,
    authorId: string,
    resourceData: Omit<GroupResource, 'id' | 'authorId' | 'createdAt' | 'likes'>
  ): Promise<GroupResource | null> {
    const group = this.studyGroups.get(groupId);
    const member = group?.members.find(m => m.userId === authorId && m.permissions.canPost);
    
    if (!group || !member) return null;

    const resource: GroupResource = {
      id: this.generateId('resource'),
      authorId,
      createdAt: new Date(),
      likes: 0,
      ...resourceData
    };

    group.resources.push(resource);
    member.contributions++;

    // Create activity
    await this.createActivity(authorId, 'shared_resource', `Shared resource in ${group.name}`, { groupId, resourceId: resource.id }, 'friends');
    
    this.emit('group_resource:added', { group, resource });
    return resource;
  }

  async createGroupChallenge(
    groupId: string,
    creatorId: string,
    challengeData: Omit<GroupChallenge, 'id' | 'creatorId' | 'participants' | 'leaderboard' | 'status'>
  ): Promise<GroupChallenge | null> {
    const group = this.studyGroups.get(groupId);
    const creator = group?.members.find(m => m.userId === creatorId && m.permissions.canModerate);
    
    if (!group || !creator) return null;

    const challenge: GroupChallenge = {
      id: this.generateId('challenge'),
      creatorId,
      participants: [],
      leaderboard: [],
      status: challengeData.startDate <= new Date() ? 'active' : 'upcoming',
      ...challengeData
    };

    group.challenges.push(challenge);

    // Create activity
    await this.createActivity(creatorId, 'created_challenge', `Created challenge: ${challenge.title}`, { groupId, challengeId: challenge.id }, 'public');
    
    this.emit('group_challenge:created', { group, challenge });
    return challenge;
  }

  // Discussions and forums
  async createDiscussion(
    authorId: string,
    discussionData: Omit<Discussion, 'id' | 'authorId' | 'createdAt' | 'updatedAt' | 'replies' | 'upvotes' | 'downvotes' | 'views' | 'isResolved' | 'isPinned' | 'isClosed'>
  ): Promise<Discussion> {
    const discussion: Discussion = {
      id: this.generateId('discussion'),
      authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
      replies: [],
      upvotes: 0,
      downvotes: 0,
      views: 0,
      isResolved: false,
      isPinned: false,
      isClosed: false,
      ...discussionData
    };

    this.discussions.set(discussion.id, discussion);

    // Create activity
    await this.createActivity(authorId, 'posted_discussion', `Posted: ${discussion.title}`, { discussionId: discussion.id }, 'public');
    
    this.emit('discussion:created', discussion);
    return discussion;
  }

  async replyToDiscussion(
    discussionId: string,
    authorId: string,
    content: string,
    parentReplyId?: string
  ): Promise<Reply | null> {
    const discussion = this.discussions.get(discussionId);
    if (!discussion || discussion.isClosed) return null;

    const reply: Reply = {
      id: this.generateId('reply'),
      content,
      authorId,
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      isAccepted: false,
      parentReplyId,
      mentions: this.extractMentions(content),
      attachments: []
    };

    discussion.replies.push(reply);
    discussion.updatedAt = new Date();

    // Notify mentioned users
    reply.mentions.forEach(mentionedUserId => {
      this.emit('user:mentioned', { discussionId, replyId: reply.id, mentionedUserId, authorId });
    });

    this.emit('discussion:replied', { discussion, reply });
    return reply;
  }

  async voteOnDiscussion(userId: string, discussionId: string, voteType: 'up' | 'down'): Promise<boolean> {
    const discussion = this.discussions.get(discussionId);
    if (!discussion || discussion.authorId === userId) return false;

    if (voteType === 'up') {
      discussion.upvotes++;
    } else {
      discussion.downvotes++;
    }

    // Award reputation to author
    const author = this.users.get(discussion.authorId);
    if (author) {
      const points = voteType === 'up' ? 10 : -5;
      author.stats.points += points;
    }

    this.emit('discussion:voted', { discussionId, userId, voteType });
    return true;
  }

  // Mentorship system
  async requestMentorship(
    menteeId: string,
    mentorId: string,
    focusAreas: string[],
    goals: string[]
  ): Promise<Mentorship | null> {
    const mentee = this.users.get(menteeId);
    const mentor = this.users.get(mentorId);
    
    if (!mentee || !mentor || menteeId === mentorId) return null;

    const mentorship: Mentorship = {
      id: this.generateId('mentorship'),
      mentorId,
      menteeId,
      status: 'pending',
      startDate: new Date(),
      focusAreas,
      goals,
      sessions: [],
      feedback: [],
      progress: {
        goalsCompleted: 0,
        totalGoals: goals.length,
        skillsImproved: [],
        challengesOvercome: [],
        nextMilestones: goals.slice(0, 3)
      }
    };

    this.mentorships.set(mentorship.id, mentorship);

    // Notify mentor
    this.emit('mentorship:requested', { mentorship, mentee, mentor });
    return mentorship;
  }

  async acceptMentorship(mentorshipId: string, mentorId: string): Promise<boolean> {
    const mentorship = this.mentorships.get(mentorshipId);
    if (!mentorship || mentorship.mentorId !== mentorId || mentorship.status !== 'pending') {
      return false;
    }

    mentorship.status = 'active';
    
    // Create activities
    await this.createActivity(mentorship.menteeId, 'started_mentorship', `Started mentorship with ${this.users.get(mentorId)?.displayName}`, { mentorshipId }, 'friends');
    await this.createActivity(mentorship.mentorId, 'became_mentor', `Mentoring ${this.users.get(mentorship.menteeId)?.displayName}`, { mentorshipId }, 'friends');
    
    this.emit('mentorship:accepted', mentorship);
    return true;
  }

  async scheduleMentorshipSession(
    mentorshipId: string,
    userId: string,
    sessionData: Omit<MentorshipSession, 'id' | 'completed' | 'rating' | 'feedback'>
  ): Promise<MentorshipSession | null> {
    const mentorship = this.mentorships.get(mentorshipId);
    if (!mentorship || (userId !== mentorship.mentorId && userId !== mentorship.menteeId)) {
      return null;
    }

    const session: MentorshipSession = {
      id: this.generateId('mentorship_session'),
      completed: false,
      ...sessionData
    };

    mentorship.sessions.push(session);

    this.emit('mentorship_session:scheduled', { mentorship, session });
    return session;
  }

  // Leaderboards
  async getGlobalLeaderboard(category: 'points' | 'problems_solved' | 'streak', limit: number = 100): Promise<LeaderboardEntry[]> {
    const users = Array.from(this.users.values());
    
    let sortedUsers: User[];
    switch (category) {
      case 'points':
        sortedUsers = users.sort((a, b) => b.stats.points - a.stats.points);
        break;
      case 'problems_solved':
        sortedUsers = users.sort((a, b) => b.stats.problemsSolved - a.stats.problemsSolved);
        break;
      case 'streak':
        sortedUsers = users.sort((a, b) => b.stats.streak - a.stats.streak);
        break;
      default:
        sortedUsers = users;
    }

    return sortedUsers.slice(0, limit).map((user, index) => ({
      userId: user.id,
      username: user.username,
      score: category === 'points' ? user.stats.points : 
             category === 'problems_solved' ? user.stats.problemsSolved : 
             user.stats.streak,
      rank: index + 1,
      streak: user.stats.streak,
      badge: this.getUserBadge(user)
    }));
  }

  async getGroupLeaderboard(groupId: string): Promise<LeaderboardEntry[]> {
    const group = this.studyGroups.get(groupId);
    if (!group) return [];

    const memberStats = await Promise.all(
      group.members.map(async member => {
        const user = this.users.get(member.userId);
        return {
          member,
          user,
          score: member.contributions * 10 + (user?.stats.points || 0)
        };
      })
    );

    return memberStats
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        userId: entry.member.userId,
        username: entry.user?.username || 'Unknown',
        score: entry.score,
        rank: index + 1,
        streak: entry.user?.stats.streak || 0,
        badge: entry.user ? this.getUserBadge(entry.user) : undefined
      }));
  }

  // Activities and feed
  async createActivity(
    userId: string,
    type: SocialActivity['type'],
    content: string,
    metadata: { [key: string]: any },
    visibility: 'public' | 'friends' | 'private' = 'public'
  ): Promise<SocialActivity> {
    const activity: SocialActivity = {
      id: this.generateId('activity'),
      userId,
      type,
      content,
      metadata,
      timestamp: new Date(),
      visibility,
      likes: 0,
      comments: []
    };

    this.activities.set(activity.id, activity);
    this.emit('activity:created', activity);
    return activity;
  }

  async getFeed(userId: string, limit: number = 20): Promise<SocialActivity[]> {
    const user = this.users.get(userId);
    if (!user) return [];

    const friends = this.friendships.get(userId) || new Set();
    const activities = Array.from(this.activities.values());

    return activities
      .filter(activity => {
        if (activity.visibility === 'public') return true;
        if (activity.userId === userId) return true;
        if (activity.visibility === 'friends' && friends.has(activity.userId)) return true;
        return false;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Achievements and badges
  async awardBadge(userId: string, badgeData: Omit<Badge, 'earnedDate'>): Promise<Badge> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');

    const badge: Badge = {
      ...badgeData,
      earnedDate: new Date()
    };

    user.badges.push(badge);

    // Create activity
    await this.createActivity(userId, 'earned_badge', `Earned ${badge.name} badge!`, { badgeId: badge.id }, 'public');
    
    this.emit('badge:awarded', { user, badge });
    return badge;
  }

  async checkAndAwardAchievements(userId: string): Promise<Badge[]> {
    const user = this.users.get(userId);
    if (!user) return [];

    const newBadges: Badge[] = [];
    const earnedBadgeIds = new Set(user.badges.map(b => b.id));

    // Check various achievements
    const achievements = [
      {
        id: 'first_problem',
        condition: () => user.stats.problemsSolved >= 1,
        badge: {
          id: 'first_problem',
          name: 'First Steps',
          description: 'Solved your first problem',
          icon: '🎯',
          rarity: 'common' as const,
          category: 'achievement' as const
        }
      },
      {
        id: 'problem_solver_10',
        condition: () => user.stats.problemsSolved >= 10,
        badge: {
          id: 'problem_solver_10',
          name: 'Problem Solver',
          description: 'Solved 10 problems',
          icon: '⭐',
          rarity: 'common' as const,
          category: 'achievement' as const
        }
      },
      {
        id: 'streak_master',
        condition: () => user.stats.maxStreak >= 7,
        badge: {
          id: 'streak_master',
          name: 'Streak Master',
          description: 'Maintained a 7-day solving streak',
          icon: '🔥',
          rarity: 'rare' as const,
          category: 'streak' as const
        }
      },
      {
        id: 'social_butterfly',
        condition: () => user.followers >= 50,
        badge: {
          id: 'social_butterfly',
          name: 'Social Butterfly',
          description: 'Gained 50 followers',
          icon: '🦋',
          rarity: 'uncommon' as const,
          category: 'social' as const
        }
      }
    ];

    for (const achievement of achievements) {
      if (!earnedBadgeIds.has(achievement.id) && achievement.condition()) {
        const badge = await this.awardBadge(userId, achievement.badge);
        newBadges.push(badge);
      }
    }

    return newBadges;
  }

  // Helper methods
  private extractMentions(content: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    
    while ((match = mentionRegex.exec(content)) !== null) {
      const username = match[1];
      const user = Array.from(this.users.values()).find(u => u.username === username);
      if (user) mentions.push(user.id);
    }
    
    return mentions;
  }

  private getUserBadge(user: User): string | undefined {
    const legendaryBadges = user.badges.filter(b => b.rarity === 'legendary');
    const epicBadges = user.badges.filter(b => b.rarity === 'epic');
    const rareBadges = user.badges.filter(b => b.rarity === 'rare');
    
    if (legendaryBadges.length > 0) return legendaryBadges[0].icon;
    if (epicBadges.length > 0) return epicBadges[0].icon;
    if (rareBadges.length > 0) return rareBadges[0].icon;
    
    return user.badges[0]?.icon;
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  // Public getters
  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getStudyGroup(groupId: string): StudyGroup | undefined {
    return this.studyGroups.get(groupId);
  }

  getDiscussion(discussionId: string): Discussion | undefined {
    return this.discussions.get(discussionId);
  }

  getMentorship(mentorshipId: string): Mentorship | undefined {
    return this.mentorships.get(mentorshipId);
  }

  // Search and discovery
  async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    const users = Array.from(this.users.values());
    return users
      .filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.displayName.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit);
  }

  async searchGroups(query: string, limit: number = 20): Promise<StudyGroup[]> {
    const groups = Array.from(this.studyGroups.values());
    return groups
      .filter(group => 
        group.isActive && (
          group.name.toLowerCase().includes(query.toLowerCase()) ||
          group.description.toLowerCase().includes(query.toLowerCase()) ||
          group.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
      )
      .slice(0, limit);
  }

  async getRecommendedGroups(userId: string, limit: number = 10): Promise<StudyGroup[]> {
    const user = this.users.get(userId);
    if (!user) return [];

    const groups = Array.from(this.studyGroups.values());
    const userLevel = user.level;
    
    return groups
      .filter(group => 
        group.isActive &&
        group.privacy === 'public' &&
        !group.members.some(m => m.userId === userId) &&
        group.members.length < group.memberLimit
      )
      .sort(() => Math.random() - 0.5) // Shuffle for demo
      .slice(0, limit);
  }

  async getRecommendedMentors(userId: string, focusAreas: string[], limit: number = 10): Promise<User[]> {
    const users = Array.from(this.users.values());
    
    return users
      .filter(user => 
        user.id !== userId &&
        user.level >= 5 && // Mentor level requirement
        user.stats.problemsSolved >= 100 // Experience requirement
      )
      .sort((a, b) => b.stats.points - a.stats.points)
      .slice(0, limit);
  }
}