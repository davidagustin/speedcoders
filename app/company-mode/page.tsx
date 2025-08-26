"use client";

import CompanyMode from "../components/CompanyMode";

export default function CompanyModePage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Company Mode</h1>
					<p className="text-gray-600">Practice with company-specific interview questions</p>
				</div>
				
				<CompanyMode />
			</div>
		</div>
	);
}
