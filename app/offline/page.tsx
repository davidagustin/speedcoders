"use client";

import dynamic from "next/dynamic";

const OfflineManager = dynamic(() => import("../components/OfflineManager"), {
	ssr: false,
	loading: () => (
		<div className="flex items-center justify-center h-64">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
		</div>
	)
});

export default function OfflinePage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Offline Manager</h1>
					<p className="text-gray-600">Download content for offline learning</p>
				</div>
				
				<OfflineManager />
			</div>
		</div>
	);
}
