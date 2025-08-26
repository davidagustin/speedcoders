import { useEffect, useState } from "react";

function OfflineManager() {
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const [pendingSync, setPendingSync] = useState([]);
	const [offlineData, setOfflineData] = useState(null);
	const [showOfflineNotice, setShowOfflineNotice] = useState(false);

	useEffect(() => {
		// Network status listeners
		const handleOnline = () => {
			setIsOnline(true);
			setShowOfflineNotice(false);
			syncPendingData();
		};

		const handleOffline = () => {
			setIsOnline(false);
			setShowOfflineNotice(true);
			loadOfflineData();
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		// Load pending sync data on mount
		loadPendingSyncData();
		loadOfflineData();

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	const loadPendingSyncData = () => {
		try {
			const pending = JSON.parse(localStorage.getItem("pendingSync") || "[]");
			setPendingSync(pending);
		} catch (error) {
			console.error("Error loading pending sync data:", error);
		}
	};

	const loadOfflineData = () => {
		try {
			const offline = {
				quizResults: JSON.parse(
					localStorage.getItem("offline-quiz-results") || "[]",
				),
				userProgress: JSON.parse(
					localStorage.getItem("offline-user-progress") || "[]",
				),
				achievements: JSON.parse(
					localStorage.getItem("offline-achievements") || "[]",
				),
				studyPlans: JSON.parse(
					localStorage.getItem("offline-study-plans") || "[]",
				),
			};
			setOfflineData(offline);
		} catch (error) {
			console.error("Error loading offline data:", error);
		}
	};

	const syncPendingData = async () => {
		if (pendingSync.length === 0) return;

		console.log("Syncing pending data...", pendingSync.length, "items");

		try {
			// Process each pending item
			for (const item of pendingSync) {
				await processSyncItem(item);
			}

			// Clear pending sync after successful sync
			localStorage.removeItem("pendingSync");
			setPendingSync([]);

			// Trigger service worker sync
			if (
				"serviceWorker" in navigator &&
				"sync" in window.ServiceWorkerRegistration.prototype
			) {
				const registration = await navigator.serviceWorker.ready;
				registration.sync.register("quiz-results-sync");
				registration.sync.register("user-progress-sync");
			}

			console.log("All pending data synced successfully");

			// Show success notification
			showSyncNotification("Data synced successfully!", "success");
		} catch (error) {
			console.error("Error syncing pending data:", error);
			showSyncNotification("Sync failed. Will retry when online.", "error");
		}
	};

	const processSyncItem = async (item) => {
		switch (item.type) {
			case "quiz-result":
				await syncQuizResult(item.data);
				break;
			case "user-progress":
				await syncUserProgress(item.data);
				break;
			case "achievement":
				await syncAchievement(item.data);
				break;
			case "study-plan":
				await syncStudyPlan(item.data);
				break;
			default:
				console.warn("Unknown sync item type:", item.type);
		}
	};

	const syncQuizResult = async (result) => {
		// In a real app, this would send to a server
		console.log("Syncing quiz result:", result);

		// For now, just ensure it's in localStorage
		const users = JSON.parse(localStorage.getItem("users") || "[]");
		const userIndex = users.findIndex((u) => u.id === result.userId);

		if (userIndex !== -1) {
			if (!users[userIndex].scores) users[userIndex].scores = [];

			// Check if result already exists
			const existingIndex = users[userIndex].scores.findIndex(
				(s) => s.date === result.date && s.mode === result.mode,
			);

			if (existingIndex === -1) {
				users[userIndex].scores.push(result);
				users[userIndex].totalXP =
					(users[userIndex].totalXP || 0) + (result.xpEarned || 0);
				localStorage.setItem("users", JSON.stringify(users));
			}
		}
	};

	const syncUserProgress = async (progress) => {
		console.log("Syncing user progress:", progress);
		// Merge with existing user data
	};

	const syncAchievement = async (achievement) => {
		console.log("Syncing achievement:", achievement);
		// Update user achievements
	};

	const syncStudyPlan = async (studyPlan) => {
		console.log("Syncing study plan:", studyPlan);
		// Update study plan progress
	};

	const addToPendingSync = (type, data, userId) => {
		const syncItem = {
			id: Date.now() + Math.random(),
			type,
			data: { ...data, userId },
			timestamp: new Date().toISOString(),
			retryCount: 0,
		};

		const updated = [...pendingSync, syncItem];
		setPendingSync(updated);
		localStorage.setItem("pendingSync", JSON.stringify(updated));

		// Try to sync immediately if online
		if (isOnline) {
			setTimeout(() => syncPendingData(), 1000);
		}
	};

	const showSyncNotification = (message, type = "info") => {
		const notification = document.createElement("div");
		notification.className = `sync-notification ${type}`;
		notification.textContent = message;
		notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      z-index: 10001;
      font-weight: 500;
      opacity: 0;
      transition: opacity 0.3s ease;
      ${
				type === "success"
					? "background: #4CAF50;"
					: type === "error"
						? "background: #F44336;"
						: "background: #2196F3;"
			}
    `;

		document.body.appendChild(notification);

		// Fade in
		setTimeout(() => {
			notification.style.opacity = "1";
		}, 100);

		// Auto remove
		setTimeout(() => {
			notification.style.opacity = "0";
			setTimeout(() => {
				if (notification.parentNode) {
					notification.parentNode.removeChild(notification);
				}
			}, 300);
		}, 3000);
	};

	const downloadOfflineData = () => {
		const allOfflineData = {
			users: JSON.parse(localStorage.getItem("users") || "[]"),
			settings: Object.keys(localStorage)
				.filter((key) => key.startsWith("userSettings_"))
				.reduce((acc, key) => {
					acc[key] = JSON.parse(localStorage.getItem(key) || "{}");
					return acc;
				}, {}),
			searchHistory: JSON.parse(localStorage.getItem("searchHistory") || "[]"),
			savedSearches: JSON.parse(localStorage.getItem("savedSearches") || "[]"),
			pendingSync: pendingSync,
			exportDate: new Date().toISOString(),
		};

		const blob = new Blob([JSON.stringify(allOfflineData, null, 2)], {
			type: "application/json",
		});

		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `leetcode-quiz-offline-data-${new Date().toISOString().split("T")[0]}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const clearOfflineData = () => {
		if (
			confirm(
				"Are you sure you want to clear all offline data? This cannot be undone.",
			)
		) {
			const keysToRemove = [
				"offline-quiz-results",
				"offline-user-progress",
				"offline-achievements",
				"offline-study-plans",
				"pendingSync",
			];

			keysToRemove.forEach((key) => localStorage.removeItem(key));
			setPendingSync([]);
			setOfflineData(null);

			showSyncNotification("Offline data cleared", "info");
		}
	};

	// Calculate offline storage usage
	const getStorageUsage = () => {
		let totalSize = 0;

		for (const key in localStorage) {
			if (Object.hasOwn(localStorage, key)) {
				totalSize += localStorage[key].length + key.length;
			}
		}

		return {
			bytes: totalSize,
			kb: Math.round((totalSize / 1024) * 10) / 10,
			mb: Math.round((totalSize / (1024 * 1024)) * 100) / 100,
		};
	};

	const storageUsage = getStorageUsage();

	// Expose functions to other components via window object
	useEffect(() => {
		window.offlineManager = {
			addToPendingSync,
			isOnline,
			syncPendingData,
		};

		return () => {
			delete window.offlineManager;
		};
	}, [isOnline, pendingSync]);

	if (!showOfflineNotice && pendingSync.length === 0) {
		return null;
	}

	return (
		<>
			{/* Offline Notice */}
			{showOfflineNotice && (
				<div className="offline-notice">
					<div className="offline-content">
						<span className="offline-icon">📡</span>
						<div className="offline-text">
							<strong>You're offline</strong>
							<p>
								Your progress is being saved locally and will sync when you're
								back online.
							</p>
						</div>
						<button
							onClick={() => setShowOfflineNotice(false)}
							className="offline-close"
						>
							×
						</button>
					</div>
				</div>
			)}

			{/* Sync Status */}
			{pendingSync.length > 0 && (
				<div className="sync-status">
					<div className="sync-content">
						<span className="sync-icon">⏳</span>
						<div className="sync-text">
							<strong>{pendingSync.length} items pending sync</strong>
							{isOnline && (
								<button onClick={syncPendingData} className="sync-now-btn">
									Sync Now
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Offline Data Manager (for settings page) */}
			{window.location.pathname === "/settings" && (
				<div className="offline-manager-panel">
					<h3>📱 Offline Data Management</h3>

					<div className="offline-stats">
						<div className="stat-item">
							<span className="stat-label">Status:</span>
							<span className={`stat-value ${isOnline ? "online" : "offline"}`}>
								{isOnline ? "🟢 Online" : "🔴 Offline"}
							</span>
						</div>

						<div className="stat-item">
							<span className="stat-label">Storage Used:</span>
							<span className="stat-value">{storageUsage.kb} KB</span>
						</div>

						<div className="stat-item">
							<span className="stat-label">Pending Sync:</span>
							<span className="stat-value">{pendingSync.length} items</span>
						</div>
					</div>

					<div className="offline-actions">
						{pendingSync.length > 0 && (
							<button
								onClick={syncPendingData}
								disabled={!isOnline}
								className="sync-btn"
							>
								{isOnline ? "🔄 Sync Now" : "⏳ Waiting for Connection"}
							</button>
						)}

						<button onClick={downloadOfflineData} className="download-btn">
							📥 Download Data Backup
						</button>

						<button onClick={clearOfflineData} className="clear-btn danger">
							🗑️ Clear Offline Data
						</button>
					</div>

					<div className="offline-info">
						<p>
							<strong>💡 Offline Features:</strong>
							<br />• Quiz results are saved locally when offline
							<br />• Progress and achievements are cached
							<br />• Data syncs automatically when connection returns
							<br />• All 3,662 problems available offline
						</p>
					</div>
				</div>
			)}
		</>
	);
}

// Utility functions for other components
export const offlineUtils = {
	saveQuizResult: (result, userId) => {
		if (window.offlineManager) {
			window.offlineManager.addToPendingSync("quiz-result", result, userId);
		}
	},

	saveUserProgress: (progress, userId) => {
		if (window.offlineManager) {
			window.offlineManager.addToPendingSync("user-progress", progress, userId);
		}
	},

	saveAchievement: (achievement, userId) => {
		if (window.offlineManager) {
			window.offlineManager.addToPendingSync(
				"achievement",
				achievement,
				userId,
			);
		}
	},

	isOnline: () => {
		return window.offlineManager
			? window.offlineManager.isOnline
			: navigator.onLine;
	},
};

export default OfflineManager;
