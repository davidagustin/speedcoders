'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  BookOpen,
  Zap,
  Award,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Settings
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { adaptiveLearningEngine, UserLearningProfile, LearningPath, MLRecommendation } from '@/lib/AdaptiveLearningEngine';

interface AdaptiveLearningDashboardProps {
  className?: string;
}

export function AdaptiveLearningDashboard({ className }: AdaptiveLearningDashboardProps) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserLearningProfile | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [recommendations, setRecommendations] = useState<MLRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingPath, setCreatingPath] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const availableGoals = [
    'Master Dynamic Programming',
    'Improve Graph Algorithms',
    'Strengthen Data Structures',
    'Optimize Time Complexity',
    'Learn Advanced Trees',
    'Practice System Design',
    'Build Interview Skills',
    'Understand Algorithms Deeply'
  ];

  useEffect(() => {
    if (session?.user?.email) {
      loadUserData();
    }
  }, [session]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate user learning profile
      const userProfile = await adaptiveLearningEngine.generateUserProfile(session?.user?.email || '');
      setProfile(userProfile);

      // Get ML recommendations
      const mlRecommendations = await adaptiveLearningEngine.generateMLRecommendations(userProfile);
      setRecommendations(mlRecommendations);

      // Try to load existing learning path
      // In a real implementation, you would fetch this from your database
      // For now, we'll check if user has sufficient data for a path
      if (userProfile.totalProblemsAttempted >= 5) {
        // Simulate loading an existing path or create a new one
        const existingPath = await adaptiveLearningEngine.createPersonalizedLearningPath(
          session?.user?.email || '', 
          userProfile.learningGoals
        );
        setLearningPath(existingPath);
      }

    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load learning data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createNewLearningPath = async () => {
    if (!session?.user?.email) return;

    try {
      setCreatingPath(true);
      const goals = selectedGoals.length > 0 ? selectedGoals : profile?.learningGoals || [];
      
      const newPath = await adaptiveLearningEngine.createPersonalizedLearningPath(
        session.user.email,
        goals
      );
      
      setLearningPath(newPath);
      setSelectedGoals([]);
    } catch (err) {
      console.error('Error creating learning path:', err);
      setError('Failed to create learning path. Please try again.');
    } finally {
      setCreatingPath(false);
    }
  };

  const adaptCurrentPath = async () => {
    if (!learningPath) return;

    try {
      setLoading(true);
      const adaptedPath = await adaptiveLearningEngine.adaptLearningPath(learningPath.id);
      setLearningPath(adaptedPath);
    } catch (err) {
      console.error('Error adapting learning path:', err);
      setError('Failed to adapt learning path. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  if (!session) {
    return (
      <div className={`p-6 ${className}`}>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to access your personalized learning dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 animate-pulse text-blue-600" />
            <p className="text-lg font-medium">Analyzing your learning patterns...</p>
            <p className="text-sm text-gray-600 mt-2">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadUserData} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`p-6 ${className}`}>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No learning data found. Complete some quizzes to get personalized recommendations.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            Adaptive Learning Dashboard
          </h1>
          <p className="text-gray-600 mt-1">AI-powered personalized learning recommendations</p>
        </div>
        <Button onClick={loadUserData} variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="path">Learning Path</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Profile Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{profile.averageAccuracy}%</p>
                    <p className="text-sm text-gray-600">Average Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{profile.consistencyScore}</p>
                    <p className="text-sm text-gray-600">Consistency Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{profile.learningVelocity}</p>
                    <p className="text-sm text-gray-600">Problems/Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{profile.totalProblemsAttempted}</p>
                    <p className="text-sm text-gray-600">Total Attempts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.strengths.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.strengths.map(strength => (
                      <Badge key={strength} variant="secondary" className="bg-green-100 text-green-800">
                        {strength} ({profile.algorithmMastery[strength]}%)
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Complete more quizzes to identify your strengths</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-600" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.weaknesses.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.weaknesses.map(weakness => (
                      <Badge key={weakness} variant="secondary" className="bg-red-100 text-red-800">
                        {weakness} ({profile.algorithmMastery[weakness] || 0}%)
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Great job! No significant weaknesses identified</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Learning Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Current Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.learningGoals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Path Tab */}
        <TabsContent value="path" className="space-y-6">
          {learningPath ? (
            <div className="space-y-6">
              {/* Path Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{learningPath.title}</CardTitle>
                      <p className="text-gray-600 mt-1">{learningPath.description}</p>
                    </div>
                    <Badge variant={learningPath.difficulty === 'Advanced' ? 'destructive' : 
                                  learningPath.difficulty === 'Intermediate' ? 'secondary' : 'default'}>
                      {learningPath.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Progress</p>
                      <Progress value={learningPath.progress} className="mt-2" />
                      <p className="text-sm text-gray-600 mt-1">{learningPath.progress}% Complete</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Duration</p>
                      <p className="text-lg font-semibold">{learningPath.estimatedDuration} days</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Problems</p>
                      <p className="text-lg font-semibold">{learningPath.problems.length} problems</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={adaptCurrentPath} variant="outline">
                      <Brain className="h-4 w-4 mr-2" />
                      Adapt Path
                    </Button>
                    <Button onClick={() => setLearningPath(null)} variant="ghost">
                      Create New Path
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Problem List */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Sequence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {learningPath.problems.slice(0, 10).map((problem, index) => (
                      <div key={problem.problemId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{problem.title}</h4>
                            <p className="text-sm text-gray-600">{problem.reasoning}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {problem.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                ~{problem.estimatedTime}min
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={problem.completed ? 'default' : 'secondary'}>
                            {problem.completed ? 'Complete' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Create New Path */
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Personalized Learning Path</CardTitle>
                  <p className="text-gray-600">Select your learning goals to create a customized study plan</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-3">Choose your learning goals:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableGoals.map(goal => (
                          <Button
                            key={goal}
                            variant={selectedGoals.includes(goal) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleGoal(goal)}
                            className="justify-start text-left h-auto py-3 px-4"
                          >
                            {goal}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={createNewLearningPath}
                        disabled={creatingPath}
                        className="w-full md:w-auto"
                      >
                        {creatingPath ? 'Creating Path...' : 'Create Learning Path'}
                        {!creatingPath && <ArrowRight className="h-4 w-4 ml-2" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-5 w-5 text-yellow-600" />
                        <h3 className="font-semibold capitalize">{rec.type} Recommendation</h3>
                        <Badge variant="outline">
                          {Math.round(rec.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{rec.reasoning}</p>
                      
                      {rec.type === 'difficulty' && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="font-medium">Recommended Difficulty: {rec.data.recommendedDifficulty}</p>
                        </div>
                      )}
                      
                      {rec.type === 'topic' && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="font-medium">Focus Topic: {rec.data.topic}</p>
                          <p className="text-sm text-gray-600">Current Mastery: {rec.data.currentMastery}%</p>
                        </div>
                      )}
                      
                      {rec.type === 'pacing' && (
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="font-medium">Recommended Pace: {rec.data.recommendedProblemsPerWeek} problems/week</p>
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600">Expected Improvement</p>
                      <p className="text-lg font-bold text-green-600">+{rec.expectedImprovement}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Algorithm Mastery Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Algorithm Mastery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(profile.algorithmMastery)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([algorithm, mastery]) => (
                      <div key={algorithm} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{algorithm}</span>
                          <span>{mastery}%</span>
                        </div>
                        <Progress value={mastery} />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Spent by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(profile.timeSpentByCategory)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 6)
                    .map(([category, time]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm">{category}</span>
                        <Badge variant="outline">
                          {Math.round(time / 60)}h {Math.round(time % 60)}m
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Velocity Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{profile.learningVelocity}</p>
                  <p className="text-sm text-gray-600">Problems per Week</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{profile.consistencyScore}</p>
                  <p className="text-sm text-gray-600">Consistency Score</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {new Date(profile.lastActiveDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Last Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}