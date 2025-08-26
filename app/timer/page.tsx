"use client";

import { useState, useEffect, useRef } from "react";
import { PlayIcon, PauseIcon, ArrowPathIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";

export default function TimerPage() {
	const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
	const [isRunning, setIsRunning] = useState(false);
	const [isBreak, setIsBreak] = useState(false);
	const [cycles, setCycles] = useState(0);
	const [isMuted, setIsMuted] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const workTime = 25 * 60; // 25 minutes
	const breakTime = 5 * 60; // 5 minutes
	const longBreakTime = 15 * 60; // 15 minutes

	useEffect(() => {
		if (isRunning) {
			intervalRef.current = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						// Timer finished
						playNotification();
						if (isBreak) {
							// Break finished, start work
							setIsBreak(false);
							setTimeLeft(workTime);
							setCycles(prev => prev + 1);
						} else {
							// Work finished, start break
							setIsBreak(true);
							// Long break every 4 cycles
							const shouldTakeLongBreak = (cycles + 1) % 4 === 0;
							setTimeLeft(shouldTakeLongBreak ? longBreakTime : breakTime);
						}
						return isBreak ? workTime : (cycles + 1) % 4 === 0 ? longBreakTime : breakTime;
					}
					return prev - 1;
				});
			}, 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isRunning, isBreak, cycles]);

	const playNotification = () => {
		if (!isMuted) {
			// Create audio notification
			const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
			audio.play().catch(() => {
				// Fallback for browsers that don't support audio
				console.log('Timer finished!');
			});
		}
	};

	const startTimer = () => {
		setIsRunning(true);
	};

	const pauseTimer = () => {
		setIsRunning(false);
	};

	const resetTimer = () => {
		setIsRunning(false);
		setIsBreak(false);
		setTimeLeft(workTime);
		setCycles(0);
	};

	const skipTimer = () => {
		if (isBreak) {
			// Skip break, start work
			setIsBreak(false);
			setTimeLeft(workTime);
			setCycles(prev => prev + 1);
		} else {
			// Skip work, start break
			setIsBreak(true);
			const shouldTakeLongBreak = (cycles + 1) % 4 === 0;
			setTimeLeft(shouldTakeLongBreak ? longBreakTime : breakTime);
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	const getProgress = () => {
		const total = isBreak ? (cycles % 4 === 3 ? longBreakTime : breakTime) : workTime;
		return ((total - timeLeft) / total) * 100;
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Study Timer</h1>
					<p className="text-gray-600">Pomodoro Technique - Stay focused and productive</p>
				</div>

				{/* Timer Display */}
				<div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
					<div className="text-center">
						{/* Progress Circle */}
						<div className="relative w-64 h-64 mx-auto mb-8">
							<svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
								{/* Background circle */}
								<circle
									cx="50"
									cy="50"
									r="45"
									fill="none"
									stroke="#e5e7eb"
									strokeWidth="8"
								/>
								{/* Progress circle */}
								<circle
									cx="50"
									cy="50"
									r="45"
									fill="none"
									stroke={isBreak ? "#10b981" : "#3b82f6"}
									strokeWidth="8"
									strokeDasharray={`${2 * Math.PI * 45}`}
									strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
									strokeLinecap="round"
									className="transition-all duration-1000 ease-out"
								/>
							</svg>
							
							{/* Timer text */}
							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<div className={`text-4xl font-bold ${isBreak ? 'text-green-600' : 'text-blue-600'}`}>
									{formatTime(timeLeft)}
								</div>
								<div className="text-lg text-gray-600 mt-2">
									{isBreak ? (cycles % 4 === 3 ? 'Long Break' : 'Short Break') : 'Focus Time'}
								</div>
							</div>
						</div>

						{/* Controls */}
						<div className="flex items-center justify-center gap-4 mb-6">
							{!isRunning ? (
								<button
									onClick={startTimer}
									className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
								>
									<PlayIcon className="h-5 w-5" />
									Start
								</button>
							) : (
								<button
									onClick={pauseTimer}
									className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
								>
									<PauseIcon className="h-5 w-5" />
									Pause
								</button>
							)}

							<button
								onClick={resetTimer}
								className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
							>
								<ArrowPathIcon className="h-5 w-5" />
								Reset
							</button>

							<button
								onClick={skipTimer}
								className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
							>
								Skip
							</button>
						</div>

						{/* Sound toggle */}
						<button
							onClick={() => setIsMuted(!isMuted)}
							className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
						>
							{isMuted ? (
								<SpeakerXMarkIcon className="h-5 w-5" />
							) : (
								<SpeakerWaveIcon className="h-5 w-5" />
							)}
							{isMuted ? 'Unmute' : 'Mute'} Notifications
						</button>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white p-6 rounded-lg shadow-sm border text-center">
						<div className="text-2xl font-bold text-blue-600">{cycles}</div>
						<div className="text-gray-600">Completed Cycles</div>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-sm border text-center">
						<div className="text-2xl font-bold text-green-600">{Math.floor(cycles * 25 / 60)}h {cycles * 25 % 60}m</div>
						<div className="text-gray-600">Total Focus Time</div>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-sm border text-center">
						<div className="text-2xl font-bold text-purple-600">{Math.floor(cycles / 4)}</div>
						<div className="text-gray-600">Long Breaks Taken</div>
					</div>
				</div>

				{/* Pomodoro Info */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
					<h3 className="font-semibold text-blue-900 mb-3">🍅 Pomodoro Technique</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
						<div>
							<h4 className="font-medium mb-2">Work Session (25 minutes)</h4>
							<ul className="space-y-1">
								<li>• Focus on a single task</li>
								<li>• Avoid distractions</li>
								<li>• Work until timer rings</li>
							</ul>
						</div>
						<div>
							<h4 className="font-medium mb-2">Break Session (5 minutes)</h4>
							<ul className="space-y-1">
								<li>• Take a short break</li>
								<li>• Stretch or walk around</li>
								<li>• Long break every 4 cycles</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
