"use client";

import PremiumUpgrade from "../components/PremiumUpgrade";

export default function PremiumPage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Premium Upgrade</h1>
					<p className="text-gray-600">Unlock advanced features and accelerate your learning</p>
				</div>
				
				<PremiumUpgrade />
			</div>
		</div>
	);
}
