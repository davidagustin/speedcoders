import { useState } from "react";

function SocialShare({
	title = "Check out my LeetCode Quiz Master results!",
	text = "",
	url = window.location.origin,
	result = null,
}) {
	const [showShareModal, setShowShareModal] = useState(false);
	const [copySuccess, setCopySuccess] = useState(false);

	// Generate share content based on result
	const generateShareContent = () => {
		if (result) {
			return {
				title: `🎯 LeetCode Quiz Results!`,
				text:
					`🎯 Just completed a LeetCode Quiz!\n\n` +
					`📊 Score: ${result.correct}/${result.totalQuestions} (${result.percentage}%)\n` +
					`⏱️ Time: ${formatTime(result.timeSpent)}\n` +
					`🏆 XP Earned: ${result.xpEarned}\n` +
					`📈 Mode: ${result.mode}\n\n` +
					`Master coding interviews with 3,662+ LeetCode problems!\n\n` +
					`#LeetCode #CodingInterview #AlgorithmPractice #FAANG`,
				url: `${window.location.origin}?ref=share`,
			};
		}

		return {
			title: title,
			text:
				text ||
				`🧠 Master coding interviews with LeetCode Quiz Master!\n\n` +
					`✅ 3,662+ LeetCode problems\n` +
					`🏢 FAANG interview prep\n` +
					`📊 Algorithm mastery tracking\n` +
					`🏆 Achievements & leaderboards\n\n` +
					`#LeetCode #CodingInterview #TechCareers`,
			url: url,
		};
	};

	const shareContent = generateShareContent();

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Native Web Share API
	const handleNativeShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share(shareContent);
				console.log("Content shared successfully");
			} catch (error) {
				if (error.name !== "AbortError") {
					console.error("Error sharing:", error);
					setShowShareModal(true);
				}
			}
		} else {
			setShowShareModal(true);
		}
	};

	// Platform-specific sharing
	const sharePlatforms = [
		{
			name: "Twitter",
			icon: "🐦",
			color: "#1DA1F2",
			url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent.text)}&url=${encodeURIComponent(shareContent.url)}`,
			action: "tweet",
		},
		{
			name: "LinkedIn",
			icon: "💼",
			color: "#0077B5",
			url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareContent.url)}&title=${encodeURIComponent(shareContent.title)}&summary=${encodeURIComponent(shareContent.text)}`,
			action: "share",
		},
		{
			name: "Facebook",
			icon: "📘",
			color: "#1877F2",
			url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent.url)}&quote=${encodeURIComponent(shareContent.text)}`,
			action: "share",
		},
		{
			name: "Reddit",
			icon: "🤖",
			color: "#FF4500",
			url: `https://reddit.com/submit?url=${encodeURIComponent(shareContent.url)}&title=${encodeURIComponent(shareContent.title)}`,
			action: "submit",
		},
		{
			name: "WhatsApp",
			icon: "💚",
			color: "#25D366",
			url: `https://wa.me/?text=${encodeURIComponent(`${shareContent.text} ${shareContent.url}`)}`,
			action: "send",
		},
		{
			name: "Telegram",
			icon: "✈️",
			color: "#0088cc",
			url: `https://t.me/share/url?url=${encodeURIComponent(shareContent.url)}&text=${encodeURIComponent(shareContent.text)}`,
			action: "share",
		},
	];

	const handlePlatformShare = (platform) => {
		const width = 600;
		const height = 400;
		const left = (window.screen.width - width) / 2;
		const top = (window.screen.height - height) / 2;

		window.open(
			platform.url,
			"_blank",
			`width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
		);
	};

	const copyToClipboard = async () => {
		const textToCopy = `${shareContent.text}\n\n${shareContent.url}`;

		try {
			await navigator.clipboard.writeText(textToCopy);
			setCopySuccess(true);
			setTimeout(() => setCopySuccess(false), 2000);
		} catch (_error) {
			// Fallback for older browsers
			const textArea = document.createElement("textarea");
			textArea.value = textToCopy;
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();

			try {
				document.execCommand("copy");
				setCopySuccess(true);
				setTimeout(() => setCopySuccess(false), 2000);
			} catch (fallbackError) {
				console.error("Fallback copy failed:", fallbackError);
			}

			document.body.removeChild(textArea);
		}
	};

	const generateQRCode = () => {
		const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareContent.url)}`;
		return qrUrl;
	};

	return (
		<>
			<button
				onClick={handleNativeShare}
				className="share-btn"
				aria-label="Share results"
			>
				📤 Share
			</button>

			{/* Share Modal */}
			{showShareModal && (
				<div
					className="share-modal-overlay"
					onClick={() => setShowShareModal(false)}
				>
					<div className="share-modal" onClick={(e) => e.stopPropagation()}>
						<div className="share-modal-header">
							<h3>📤 Share Your Results</h3>
							<button
								onClick={() => setShowShareModal(false)}
								className="share-modal-close"
							>
								×
							</button>
						</div>

						<div className="share-modal-content">
							{/* Preview */}
							<div className="share-preview">
								<h4>📝 Preview</h4>
								<div className="share-preview-content">
									<strong>{shareContent.title}</strong>
									<p>{shareContent.text}</p>
									<span className="share-url">{shareContent.url}</span>
								</div>
							</div>

							{/* Platform buttons */}
							<div className="share-platforms">
								<h4>🌐 Share on Social Media</h4>
								<div className="platforms-grid">
									{sharePlatforms.map((platform) => (
										<button
											key={platform.name}
											onClick={() => handlePlatformShare(platform)}
											className="platform-btn"
											style={{
												"--platform-color": platform.color,
												backgroundColor: `${platform.color}15`,
												borderColor: `${platform.color}30`,
											}}
										>
											<span className="platform-icon">{platform.icon}</span>
											<span className="platform-name">{platform.name}</span>
										</button>
									))}
								</div>
							</div>

							{/* Copy link */}
							<div className="share-actions">
								<button
									onClick={copyToClipboard}
									className={`copy-btn ${copySuccess ? "success" : ""}`}
								>
									{copySuccess ? "✅ Copied!" : "📋 Copy Link"}
								</button>
							</div>

							{/* QR Code */}
							<div className="share-qr">
								<h4>📱 QR Code</h4>
								<div className="qr-code-container">
									<img
										src={generateQRCode()}
										alt="QR Code for sharing"
										className="qr-code"
									/>
									<p>Scan to visit LeetCode Quiz Master</p>
								</div>
							</div>

							{/* Email */}
							<div className="share-email">
								<h4>📧 Email</h4>
								<a
									href={`mailto:?subject=${encodeURIComponent(shareContent.title)}&body=${encodeURIComponent(`${shareContent.text}\n\n${shareContent.url}`)}`}
									className="email-btn"
								>
									Send via Email
								</a>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

// Quick share component for inline use
export function QuickShare({ result, className = "" }) {
	const [isSharing, setIsSharing] = useState(false);

	const quickShare = async () => {
		setIsSharing(true);

		const shareData = {
			title: "🎯 LeetCode Quiz Master",
			text: result
				? `Just scored ${result.percentage}% on a LeetCode quiz! 🏆\n\nTry LeetCode Quiz Master with 3,662+ problems!`
				: "Master coding interviews with LeetCode Quiz Master! 🧠\n\n3,662+ problems, algorithm tracking, and more!",
			url: window.location.origin,
		};

		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else {
				// Fallback to Twitter
				const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
				window.open(tweetUrl, "_blank");
			}
		} catch (error) {
			if (error.name !== "AbortError") {
				console.error("Share error:", error);
			}
		} finally {
			setIsSharing(false);
		}
	};

	return (
		<button
			onClick={quickShare}
			disabled={isSharing}
			className={`quick-share-btn ${className}`}
		>
			{isSharing ? "⏳" : "📤"} Share
		</button>
	);
}

// Achievement share component
export function AchievementShare({ achievement }) {
	const shareAchievement = async () => {
		const shareData = {
			title: "🏆 New Achievement Unlocked!",
			text:
				`🎉 Just unlocked "${achievement.title}" on LeetCode Quiz Master!\n\n` +
				`${achievement.description}\n\n` +
				`Master coding interviews with 3,662+ problems! 🧠\n\n` +
				`#Achievement #LeetCode #CodingSuccess`,
			url: `${window.location.origin}?achievement=${achievement.id}`,
		};

		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else {
				const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
				window.open(tweetUrl, "_blank");
			}
		} catch (error) {
			if (error.name !== "AbortError") {
				console.error("Share error:", error);
			}
		}
	};

	return (
		<button onClick={shareAchievement} className="achievement-share-btn">
			📤 Share Achievement
		</button>
	);
}

export default SocialShare;
