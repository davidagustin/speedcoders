'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Video, 
  Mic, 
  MicOff,
  Camera,
  CameraOff,
  Clock, 
  Play, 
  Pause, 
  Square,
  MessageCircle,
  Code,
  Lightbulb,
  Target,
  Trophy,
  Settings,
  Send,
  CheckCircle,
  AlertTriangle,
  Brain,
  Users,
  BarChart3
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Editor } from '@monaco-editor/react';
import { InterviewSession, InterviewProblem, InterviewFeedback, interviewSimulator } from '@/lib/InterviewSimulator';

interface LiveInterviewSimulatorProps {
  className?: string;
}

type InterviewSetup = {
  type: 'technical' | 'system-design' | 'behavioral' | 'mixed';
  difficulty: 'junior' | 'mid-level' | 'senior' | 'staff';
  company: string;
  duration: number;
  language: string;
  allowHints: boolean;
  recordSession: boolean;
  companyStyle: 'google' | 'meta' | 'amazon' | 'microsoft' | 'netflix' | 'generic';
};

export function LiveInterviewSimulator({ className }: LiveInterviewSimulatorProps) {
  const { data: session } = useSession();
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [setup, setSetup] = useState<InterviewSetup>({
    type: 'technical',
    difficulty: 'mid-level',
    company: 'Generic Tech Company',
    duration: 60,
    language: 'javascript',
    allowHints: true,
    recordSession: true,
    companyStyle: 'generic'
  });
  
  const [isStarted, setIsStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentCode, setCurrentCode] = useState('');
  const [currentNotes, setCurrentNotes] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  
  // Media states
  const [isMuted, setIsMuted] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const companies = [
    { value: 'google', label: 'Google', style: 'google' as const },
    { value: 'meta', label: 'Meta', style: 'meta' as const },
    { value: 'amazon', label: 'Amazon', style: 'amazon' as const },
    { value: 'microsoft', label: 'Microsoft', style: 'microsoft' as const },
    { value: 'netflix', label: 'Netflix', style: 'netflix' as const },
    { value: 'generic', label: 'Generic Tech Company', style: 'generic' as const }
  ];

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isStarted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStarted, timeRemaining]);

  const createInterview = async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      setError(null);

      const interviewSession = await interviewSimulator.createInterviewSession(
        session.user.email,
        setup.type,
        setup.difficulty,
        setup.company,
        {
          allowHints: setup.allowHints,
          recordSession: setup.recordSession,
          companyStyle: setup.companyStyle,
          language: setup.language,
          allowIDE: true,
          allowInternet: false,
          realTimeEvaluation: true
        }
      );

      setCurrentSession(interviewSession);
      setTimeRemaining(interviewSession.duration * 60); // Convert to seconds
      
      if (interviewSession.problems.length > 0) {
        setCurrentCode('// Write your solution here\n');
      }

      // Initialize chat with welcome message
      setChatMessages([{
        id: '1',
        timestamp: Date.now(),
        sender: 'interviewer',
        message: generateWelcomeMessage(interviewSession),
        type: 'text'
      }]);

    } catch (err) {
      console.error('Error creating interview:', err);
      setError('Failed to create interview session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    if (!currentSession) return;

    try {
      setLoading(true);
      const startedSession = await interviewSimulator.startInterview(currentSession.id);
      setCurrentSession(startedSession);
      setIsStarted(true);
      
      if (setup.recordSession) {
        setIsRecording(true);
      }

    } catch (err) {
      console.error('Error starting interview:', err);
      setError('Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitCurrentProblem = async () => {
    if (!currentSession || !isStarted) return;

    try {
      setLoading(true);
      const result = await interviewSimulator.submitProblemSolution(
        currentSession.id,
        currentSession.currentProblemIndex,
        currentCode,
        currentNotes
      );

      if (result.success) {
        // Move to next problem or complete interview
        const updatedSession = { ...currentSession };
        updatedSession.currentProblemIndex++;
        
        if (updatedSession.currentProblemIndex >= updatedSession.problems.length) {
          await completeInterview();
        } else {
          setCurrentSession(updatedSession);
          setCurrentCode('// Write your solution here\n');
          setCurrentNotes('');
          
          // Add success message to chat
          setChatMessages(prev => [...prev, {
            id: Date.now().toString(),
            timestamp: Date.now(),
            sender: 'system',
            message: `Problem submitted successfully! Score: ${result.score}/100. Moving to next problem.`,
            type: 'success'
          }]);
        }
      }

    } catch (err) {
      console.error('Error submitting solution:', err);
      setError('Failed to submit solution. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getHint = async () => {
    if (!currentSession || !isStarted) return;

    try {
      const problem = currentSession.problems[currentSession.currentProblemIndex];
      const availableHints = problem.hints.filter(h => h.available);
      
      if (availableHints.length === 0) {
        setError('No more hints available for this problem.');
        return;
      }

      const hint = await interviewSimulator.getHint(
        currentSession.id,
        currentSession.currentProblemIndex,
        problem.hintsUsed
      );

      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        timestamp: Date.now(),
        sender: 'system',
        message: `💡 Hint: ${hint.content} (Score penalty: -${hint.penalty} points)`,
        type: 'hint'
      }]);

      // Update session
      const updatedSession = { ...currentSession };
      updatedSession.problems[currentSession.currentProblemIndex].hintsUsed++;
      setCurrentSession(updatedSession);

    } catch (err) {
      console.error('Error getting hint:', err);
      setError('No hints available or maximum hints used.');
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || !currentSession) return;

    const userMessage = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      sender: 'candidate',
      message: currentMessage,
      type: 'text'
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    try {
      const response = await interviewSimulator.simulateInterviewer(
        currentSession.id,
        currentMessage
      );

      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        timestamp: Date.now(),
        sender: 'interviewer',
        message: response,
        type: 'text'
      }]);

    } catch (err) {
      console.error('Error getting interviewer response:', err);
    }
  };

  const completeInterview = async () => {
    if (!currentSession) return;

    try {
      setLoading(true);
      const completedSession = await interviewSimulator.completeInterview(currentSession.id);
      setCurrentSession(completedSession);
      setFeedback(completedSession.feedback);
      setIsStarted(false);
      setIsRecording(false);
      setShowResults(true);

    } catch (err) {
      console.error('Error completing interview:', err);
      setError('Failed to complete interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = async () => {
    await completeInterview();
  };

  const resetInterview = () => {
    setCurrentSession(null);
    setIsStarted(false);
    setTimeRemaining(0);
    setCurrentCode('');
    setCurrentNotes('');
    setChatMessages([]);
    setCurrentMessage('');
    setShowResults(false);
    setFeedback(null);
    setError(null);
    setIsRecording(false);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const generateWelcomeMessage = (session: InterviewSession): string => {
    return `Welcome to your ${session.company} ${session.type} interview! I'm excited to work with you today. We have ${session.duration} minutes to complete ${session.problems.length} problem${session.problems.length > 1 ? 's' : ''}. Feel free to think out loud and ask questions. Ready to begin?`;
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    // In a real implementation, this would control actual camera
  };

  const toggleMicrophone = () => {
    setIsMuted(!isMuted);
    // In a real implementation, this would control actual microphone
  };

  if (!session) {
    return (
      <div className={`p-6 ${className}`}>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to access the live interview simulator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (showResults && feedback) {
    return (
      <div className={`p-6 space-y-6 ${className}`}>
        {/* Results Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-600" />
            Interview Complete!
          </h1>
          <p className="text-gray-600 mt-2">Here's your detailed feedback and score breakdown</p>
        </div>

        {/* Overall Score */}
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-4">
                {currentSession?.score?.overall || 0}
              </div>
              <p className="text-xl text-gray-600 mb-4">Overall Score</p>
              <Badge 
                variant={
                  feedback.overall.recommendation === 'strong-hire' ? 'default' :
                  feedback.overall.recommendation === 'hire' ? 'secondary' : 'destructive'
                }
                className="text-lg px-4 py-2"
              >
                {feedback.overall.recommendation.replace('-', ' ').toUpperCase()}
              </Badge>
              <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
                {feedback.overall.summary}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Technical Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Technical Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(feedback.technical).map(([skill, rating]) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="capitalize">{skill.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-semibold">{rating}/10</span>
                    </div>
                    <Progress value={rating * 10} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Behavioral Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Behavioral Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(feedback.behavioral).map(([skill, rating]) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="capitalize">{skill}</span>
                      <span className="font-semibold">{rating}/10</span>
                    </div>
                    <Progress value={rating * 10} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strengths and Areas for Improvement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.areas.strengths.map((strength, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {strength}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Target className="h-5 w-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.areas.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-600" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={resetInterview} variant="outline" size="lg">
            Start New Interview
          </Button>
          <Button size="lg">
            View Detailed Analysis
          </Button>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className={`p-6 space-y-6 ${className}`}>
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <Video className="h-8 w-8 text-blue-600" />
            Live Interview Simulator
          </h1>
          <p className="text-gray-600 mt-2">Practice real technical interviews with AI-powered feedback</p>
        </div>

        {/* Setup Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Interview Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Interview Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Interview Type</label>
                <Select 
                  value={setup.type} 
                  onValueChange={(value: any) => setSetup(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="system-design">System Design</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                <Select 
                  value={setup.difficulty} 
                  onValueChange={(value: any) => setSetup(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                    <SelectItem value="mid-level">Mid-level (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5+ years)</SelectItem>
                    <SelectItem value="staff">Staff (8+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Company and Language */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company Style</label>
                <Select 
                  value={setup.companyStyle} 
                  onValueChange={(value: any) => setSetup(prev => ({ ...prev, companyStyle: value, company: companies.find(c => c.style === value)?.label || 'Generic Tech Company' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.value} value={company.style}>
                        {company.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Programming Language</label>
                <Select 
                  value={setup.language} 
                  onValueChange={(value: any) => setSetup(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <h3 className="font-medium">Interview Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={setup.allowHints}
                    onChange={(e) => setSetup(prev => ({ ...prev, allowHints: e.target.checked }))}
                  />
                  <span className="text-sm">Allow Hints</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={setup.recordSession}
                    onChange={(e) => setSetup(prev => ({ ...prev, recordSession: e.target.checked }))}
                  />
                  <span className="text-sm">Record Session</span>
                </label>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={createInterview} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Creating Interview...' : 'Create Interview Session'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Interview Interface
  const currentProblem = currentSession.problems[currentSession.currentProblemIndex];
  const progress = ((currentSession.currentProblemIndex + (isStarted ? 0.5 : 0)) / currentSession.problems.length) * 100;

  return (
    <div className={`h-screen flex flex-col ${className}`}>
      {/* Header */}
      <div className="border-b p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">{currentSession.company} Interview</h1>
            <Badge variant="secondary">
              Problem {currentSession.currentProblemIndex + 1} of {currentSession.problems.length}
            </Badge>
            <Progress value={progress} className="w-32" />
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-red-600" />
              <span className={`font-mono font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>

            {/* Media Controls */}
            <div className="flex gap-2">
              <Button
                variant={isMuted ? 'outline' : 'default'}
                size="sm"
                onClick={toggleMicrophone}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                variant={isCameraOn ? 'default' : 'outline'}
                size="sm"
                onClick={toggleCamera}
              >
                {isCameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
              </Button>
            </div>

            {/* Action Buttons */}
            {!isStarted ? (
              <Button onClick={startInterview} disabled={loading}>
                <Play className="h-4 w-4 mr-2" />
                Start Interview
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={submitCurrentProblem} disabled={loading}>
                  {currentSession.currentProblemIndex < currentSession.problems.length - 1 ? 'Next Problem' : 'Complete Interview'}
                </Button>
                <Button onClick={completeInterview} variant="outline" disabled={loading}>
                  <Square className="h-4 w-4 mr-2" />
                  End Early
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Problem & Code */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="problem" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start bg-gray-50 p-1 m-0 rounded-none border-b">
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="problem" className="flex-1 p-4 overflow-auto">
              {currentProblem && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{currentProblem.title}</h2>
                    <div className="flex items-center gap-2">
                      <Badge variant={currentProblem.difficulty === 'Hard' ? 'destructive' : 
                                   currentProblem.difficulty === 'Medium' ? 'secondary' : 'default'}>
                        {currentProblem.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentProblem.timeLimit}min
                      </Badge>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap">{currentProblem.description}</div>
                  </div>

                  {setup.allowHints && (
                    <div className="border-t pt-4">
                      <Button
                        onClick={getHint}
                        variant="outline"
                        disabled={currentProblem.hintsUsed >= currentProblem.hints.length}
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Get Hint ({currentProblem.hintsUsed}/{currentProblem.hints.length} used)
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="code" className="flex-1 flex flex-col p-0">
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={setup.language}
                  value={currentCode}
                  onChange={(value) => setCurrentCode(value || '')}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="notes" className="flex-1 p-4">
              <Textarea
                placeholder="Write your approach, thoughts, and solution explanation here..."
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                className="h-full resize-none"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Chat & Video */}
        <div className="w-80 border-l flex flex-col">
          {/* Video Panel */}
          {isCameraOn && (
            <div className="h-40 bg-gray-900 relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
              />
              {isRecording && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-xs">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  REC
                </div>
              )}
            </div>
          )}

          {/* Chat Panel */}
          <div className="flex-1 flex flex-col">
            <div className="p-3 border-b bg-gray-50">
              <h3 className="font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Interview Chat
              </h3>
            </div>

            <div className="flex-1 overflow-auto p-3 space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'candidate' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                      message.sender === 'candidate'
                        ? 'bg-blue-600 text-white'
                        : message.sender === 'system'
                        ? message.type === 'hint'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : message.type === 'success'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-800'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.message}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask a question or share your thoughts..."
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                  disabled={!isStarted}
                />
                <Button
                  onClick={sendMessage}
                  size="sm"
                  disabled={!currentMessage.trim() || !isStarted}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}