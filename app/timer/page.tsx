"use client";

import {
	ArrowPathIcon,
	Cog6ToothIcon,
	ForwardIcon,
	PauseIcon,
	PlayIcon,
	StopIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

interface TimerSettings {
	workDuration: number;
	shortBreakDuration: number;
	longBreakDuration: number;
	longBreakInterval: number;
	autoStartBreaks: boolean;
	autoStartPomodoros: boolean;
	soundEnabled: boolean;
}

export default function TimerPage() {
	const [isRunning, setIsRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
	const [currentPhase, setCurrentPhase] = useState<
		"work" | "shortBreak" | "longBreak"
	>("work");
	const [completedPomodoros, setCompletedPomodoros] = useState(0);
	const [currentSession, setCurrentSession] = useState(1);
	const [showSettings, setShowSettings] = useState(false);
	const [settings, setSettings] = useState<TimerSettings>({
		workDuration: 25,
		shortBreakDuration: 5,
		longBreakDuration: 15,
		longBreakInterval: 4,
		autoStartBreaks: false,
		autoStartPomodoros: false,
		soundEnabled: true,
	});

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		// Initialize audio
		audioRef.current = new Audio("/notification.mp3");
		audioRef.current.volume = 0.5;

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (isRunning && !isPaused) {
			intervalRef.current = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						handlePhaseComplete();
						return 0;
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
	}, [isRunning, isPaused, handlePhaseComplete]);

	const handlePhaseComplete = () => {
		if (settings.soundEnabled && audioRef.current) {
			audioRef.current.play().catch(console.error);
		}

		if (currentPhase === "work") {
			setCompletedPomodoros((prev) => prev + 1);

			// Check if it's time for a long break
			const shouldTakeLongBreak =
				(completedPomodoros + 1) % settings.longBreakInterval === 0;

			if (shouldTakeLongBreak) {
				setCurrentPhase("longBreak");
				setTimeLeft(settings.longBreakDuration * 60);
			} else {
				setCurrentPhase("shortBreak");
				setTimeLeft(settings.shortBreakDuration * 60);
			}

			if (settings.autoStartBreaks) {
				setIsPaused(false);
			} else {
				setIsRunning(false);
				setIsPaused(false);
			}
		} else {
			// Break completed, start work phase
			setCurrentPhase("work");
			setTimeLeft(settings.workDuration * 60);
			setCurrentSession((prev) => prev + 1);

			if (settings.autoStartPomodoros) {
				setIsPaused(false);
			} else {
				setIsRunning(false);
				setIsPaused(false);
			}
		}
	};

	const startTimer = () => {
		setIsRunning(true);
		setIsPaused(false);
	};

	const pauseTimer = () => {
		setIsPaused(true);
	};

	const resumeTimer = () => {
		setIsPaused(false);
	};

	const stopTimer = () => {
		setIsRunning(false);
		setIsPaused(false);
		setTimeLeft(settings.workDuration * 60);
		setCurrentPhase("work");
	};

	const resetTimer = () => {
		setIsRunning(false);
		setIsPaused(false);
		setTimeLeft(settings.workDuration * 60);
		setCurrentPhase("work");
		setCompletedPomodoros(0);
		setCurrentSession(1);
	};

	const skipPhase = () => {
		handlePhaseComplete();
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const getPhaseTitle = () => {
		switch (currentPhase) {
			case "work":
				return "Focus Time";
			case "shortBreak":
				return "Short Break";
			case "longBreak":
				return "Long Break";
			default:
				return "Focus Time";
		}
	};

	const getPhaseColor = () => {
		switch (currentPhase) {
			case "work":
				return "bg-red-500";
			case "shortBreak":
				return "bg-green-500";
			case "longBreak":
				return "bg-blue-500";
			default:
				return "bg-red-500";
		}
	};

	const getProgressPercentage = () => {
		const totalTime =
			currentPhase === "work"
				? settings.workDuration * 60
				: currentPhase === "shortBreak"
					? settings.shortBreakDuration * 60
					: settings.longBreakDuration * 60;

		return ((totalTime - timeLeft) / totalTime) * 100;
	};

	const updateSettings = (newSettings: Partial<TimerSettings>) => {
		const updatedSettings = { ...settings, ...newSettings };
		setSettings(updatedSettings);

		// Update current timer if it's not running
		if (!isRunning) {
			if (currentPhase === "work") {
				setTimeLeft(updatedSettings.workDuration * 60);
			} else if (currentPhase === "shortBreak") {
				setTimeLeft(updatedSettings.shortBreakDuration * 60);
			} else {
				setTimeLeft(updatedSettings.longBreakDuration * 60);
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Study Timer</h1>
							<p className="mt-2 text-gray-600">
								Stay focused with the Pomodoro Technique
							</p>
						</div>
						<button
							onClick={() => setShowSettings(!showSettings)}
							className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
						>
							<Cog6ToothIcon className="h-6 w-6" />
						</button>
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Timer Display */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-lg shadow-sm border p-8">
							{/* Phase Indicator */}
							<div className="text-center mb-8">
								<h2 className="text-2xl font-bold text-gray-900 mb-2">
									{getPhaseTitle()}
								</h2>
								<p className="text-gray-600">
									Session {currentSession} • {completedPomodoros} completed
								</p>
							</div>

							{/* Timer Circle */}
							<div className="flex justify-center mb-8">
								<div className="relative">
									<div className="w-64 h-64 rounded-full border-8 border-gray-200 flex items-center justify-center">
										<div className="text-center">
											<div className="text-6xl font-bold text-gray-900 mb-2">
												{formatTime(timeLeft)}
											</div>
											<div className="text-sm text-gray-500">
												{currentPhase === "work"
													? "minutes remaining"
													: "break time"}
											</div>
										</div>
									</div>

									{/* Progress Ring */}
									<svg className="absolute inset-0 w-64 h-64 transform -rotate-90">
										<circle
											cx="128"
											cy="128"
											r="120"
											stroke="currentColor"
											strokeWidth="8"
											fill="transparent"
											className={`text-gray-200`}
										/>
										<circle
											cx="128"
											cy="128"
											r="120"
											stroke="currentColor"
											strokeWidth="8"
											fill="transparent"
											strokeDasharray={`${2 * Math.PI * 120}`}
											strokeDashoffset={`${2 * Math.PI * 120 * (1 - getProgressPercentage() / 100)}`}
											className={`${getPhaseColor()} transition-all duration-1000 ease-linear`}
										/>
									</svg>
								</div>
							</div>

							{/* Controls */}
							<div className="flex justify-center space-x-4">
								{!isRunning ? (
									<button
										onClick={startTimer}
										className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
									>
										<PlayIcon className="h-5 w-5" />
										Start
									</button>
								) : isPaused ? (
									<button
										onClick={resumeTimer}
										className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
									>
										<PlayIcon className="h-5 w-5" />
										Resume
									</button>
								) : (
									<button
										onClick={pauseTimer}
										className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
									>
										<PauseIcon className="h-5 w-5" />
										Pause
									</button>
								)}

								<button
									onClick={stopTimer}
									className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
								>
									<StopIcon className="h-5 w-5" />
									Stop
								</button>

								<button
									onClick={resetTimer}
									className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
								>
									<ArrowPathIcon className="h-5 w-5" />
									Reset
								</button>

								<button
									onClick={skipPhase}
									className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
								>
									<ForwardIcon className="h-5 w-5" />
									Skip
								</button>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Stats */}
						<div className="bg-white rounded-lg shadow-sm border p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Today's Progress
							</h3>
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-gray-600">Completed Pomodoros</span>
									<span className="text-2xl font-bold text-red-600">
										{completedPomodoros}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-gray-600">Current Session</span>
									<span className="text-lg font-semibold text-gray-900">
										{currentSession}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-gray-600">Focus Time</span>
									<span className="text-lg font-semibold text-gray-900">
										{Math.floor(
											(completedPomodoros * settings.workDuration) / 60,
										)}
										h {(completedPomodoros * settings.workDuration) % 60}m
									</span>
								</div>
							</div>
						</div>

						{/* Settings */}
						{showSettings && (
							<div className="bg-white rounded-lg shadow-sm border p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Timer Settings
								</h3>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Work Duration (minutes)
										</label>
										<input
											type="number"
											min="1"
											max="60"
											value={settings.workDuration}
											onChange={(e) =>
												updateSettings({
													workDuration: parseInt(e.target.value, 10),
												})
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Short Break (minutes)
										</label>
										<input
											type="number"
											min="1"
											max="30"
											value={settings.shortBreakDuration}
											onChange={(e) =>
												updateSettings({
													shortBreakDuration: parseInt(e.target.value, 10),
												})
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Long Break (minutes)
										</label>
										<input
											type="number"
											min="1"
											max="60"
											value={settings.longBreakDuration}
											onChange={(e) =>
												updateSettings({
													longBreakDuration: parseInt(e.target.value, 10),
												})
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Long Break Interval
										</label>
										<input
											type="number"
											min="1"
											max="10"
											value={settings.longBreakInterval}
											onChange={(e) =>
												updateSettings({
													longBreakInterval: parseInt(e.target.value, 10),
												})
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>

									<div className="space-y-2">
										<label className="flex items-center">
											<input
												type="checkbox"
												checked={settings.autoStartBreaks}
												onChange={(e) =>
													updateSettings({ autoStartBreaks: e.target.checked })
												}
												className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											/>
											<span className="ml-2 text-sm text-gray-700">
												Auto-start breaks
											</span>
										</label>

										<label className="flex items-center">
											<input
												type="checkbox"
												checked={settings.autoStartPomodoros}
												onChange={(e) =>
													updateSettings({
														autoStartPomodoros: e.target.checked,
													})
												}
												className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											/>
											<span className="ml-2 text-sm text-gray-700">
												Auto-start pomodoros
											</span>
										</label>

										<label className="flex items-center">
											<input
												type="checkbox"
												checked={settings.soundEnabled}
												onChange={(e) =>
													updateSettings({ soundEnabled: e.target.checked })
												}
												className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											/>
											<span className="ml-2 text-sm text-gray-700">
												Sound notifications
											</span>
										</label>
									</div>
								</div>
							</div>
						)}

						{/* Tips */}
						<div className="bg-blue-50 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-blue-900 mb-3">
								Pomodoro Tips
							</h3>
							<ul className="space-y-2 text-sm text-blue-800">
								<li>• Work for 25 minutes, then take a 5-minute break</li>
								<li>• After 4 pomodoros, take a longer 15-minute break</li>
								<li>• Use breaks to stretch, walk, or rest your eyes</li>
								<li>• Avoid checking your phone during focus time</li>
								<li>• Track your progress to build consistency</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
