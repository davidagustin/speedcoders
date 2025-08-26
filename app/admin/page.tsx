"use client";

import AdminDashboard from "../components/AdminDashboard";

export default function AdminPage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
					<p className="text-gray-600">Manage the platform and monitor user activity</p>
				</div>
				
				<AdminDashboard />
			</div>
		</div>
	);
}
