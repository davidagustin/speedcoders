"use client";

import SocialHub from "../components/SocialHub";

export default function SocialHubPage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Social Hub</h1>
					<p className="text-gray-600">Connect with other learners and share your progress</p>
				</div>
				
				<SocialHub />
			</div>
		</div>
	);
}
