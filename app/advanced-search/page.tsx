"use client";

import AdvancedSearch from "../components/AdvancedSearch";

export default function AdvancedSearchPage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Search</h1>
					<p className="text-gray-600">Find problems with advanced filtering and search options</p>
				</div>
				
				<AdvancedSearch />
			</div>
		</div>
	);
}
