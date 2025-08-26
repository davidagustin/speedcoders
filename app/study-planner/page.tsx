"use client";

import { useState } from "react";
import StudyPlanner from "../components/StudyPlanner";

export default function StudyPlannerPage() {
	const [sessions, setSessions] = useState<any[]>([]);
	const [goals, setGoals] = useState<any[]>([]);

	const handleAddSession = (session: any) => {
		setSessions(prev => [...prev, { ...session, id: Date.now().toString() }]);
	};

	const handleUpdateSession = (id: string, session: any) => {
		setSessions(prev => prev.map(s => s.id === id ? { ...s, ...session } : s));
	};

	const handleDeleteSession = (id: string) => {
		setSessions(prev => prev.filter(s => s.id !== id));
	};

	const handleAddGoal = (goal: any) => {
		setGoals(prev => [...prev, { ...goal, id: Date.now().toString() }]);
	};

	const handleUpdateGoal = (id: string, goal: any) => {
		setGoals(prev => prev.map(g => g.id === id ? { ...g, ...goal } : g));
	};

	const handleDeleteGoal = (id: string) => {
		setGoals(prev => prev.filter(g => g.id !== id));
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Study Planner</h1>
					<p className="text-gray-600">Plan your learning journey and track your goals</p>
				</div>
				
				<StudyPlanner
					sessions={sessions}
					goals={goals}
					onAddSession={handleAddSession}
					onUpdateSession={handleUpdateSession}
					onDeleteSession={handleDeleteSession}
					onAddGoal={handleAddGoal}
					onUpdateGoal={handleUpdateGoal}
					onDeleteGoal={handleDeleteGoal}
				/>
			</div>
		</div>
	);
}
