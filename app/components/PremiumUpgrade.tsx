"use client";

import {
	BoltIcon,
	ChartBarIcon,
	StarIcon as CrownIcon,
	RocketLaunchIcon,
	ShieldCheckIcon,
	SparklesIcon,
	StarIcon,
	UserGroupIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon as CheckSolidIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import {
	premiumService,
	type SubscriptionTier,
	type UserSubscription,
} from "../lib/premium-features";

interface PricingCardProps {
	tier: SubscriptionTier;
	currentTier?: string;
	onSelectTier: (tierId: string) => void;
	billingCycle: "monthly" | "yearly";
}

export default function PremiumUpgrade() {
	const [subscriptionTiers, setSubscriptionTiers] = useState<
		SubscriptionTier[]
	>([]);
	const [currentSubscription, setCurrentSubscription] =
		useState<UserSubscription | null>(null);
	const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
		"yearly",
	);
	const [_selectedTier, setSelectedTier] = useState<string>("premium");
	const [loading, setLoading] = useState(true);
	const [_showComparison, _setShowComparison] = useState(false);

	useEffect(() => {
		loadSubscriptionData();
	}, [loadSubscriptionData]);

	const loadSubscriptionData = () => {
		setLoading(true);
		const tiers = premiumService.getSubscriptionTiers();
		const userSubscription = premiumService.getUserSubscription("current-user"); // Mock user ID

		setSubscriptionTiers(tiers);
		setCurrentSubscription(userSubscription);
		setLoading(false);
	};

	const handleUpgrade = (tierId: string) => {
		setSelectedTier(tierId);
		// In a real app, this would redirect to payment processing
		console.log(`Upgrading to ${tierId} tier`);
	};

	const _startFreeTrial = () => {
		premiumService.startFreeTrial("current-user");
		loadSubscriptionData();
	};

	const getTierIcon = (tierId: string) => {
		switch (tierId) {
			case "free":
				return <StarIcon className="h-8 w-8" />;
			case "premium":
				return <BoltIcon className="h-8 w-8 text-blue-500" />;
			case "pro":
				return <CrownIcon className="h-8 w-8 text-purple-500" />;
			case "enterprise":
				return <ShieldCheckIcon className="h-8 w-8 text-green-500" />;
			default:
				return <StarIcon className="h-8 w-8" />;
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6">
			{/* Header */}
			<div className="text-center mb-12">
				<div className="flex items-center justify-center gap-3 mb-4">
					<RocketLaunchIcon className="h-10 w-10 text-blue-600" />
					<h1 className="text-4xl font-bold text-gray-900">
						Upgrade to Premium
					</h1>
				</div>
				<p className="text-xl text-gray-600 mb-8">
					Unlock advanced features and accelerate your coding journey
				</p>

				{/* Billing Toggle */}
				<div className="flex items-center justify-center gap-4 mb-8">
					<span
						className={`font-medium ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"}`}
					>
						Monthly
					</span>
					<button
						onClick={() =>
							setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
						}
						className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
							billingCycle === "yearly" ? "bg-blue-600" : "bg-gray-200"
						}`}
					>
						<span
							className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
								billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
							}`}
						/>
					</button>
					<span
						className={`font-medium ${billingCycle === "yearly" ? "text-gray-900" : "text-gray-500"}`}
					>
						Yearly
					</span>
					{billingCycle === "yearly" && (
						<span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
							Save 17%
						</span>
					)}
				</div>
			</div>

			{/* Current Subscription Status */}
			{currentSubscription && (
				<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Current Plan:{" "}
								{currentSubscription.tier.charAt(0).toUpperCase() +
									currentSubscription.tier.slice(1)}
							</h3>
							<p className="text-gray-600">
								Status: {currentSubscription.status} • Expires:{" "}
								{currentSubscription.endDate.toLocaleDateString()}
							</p>
						</div>
						<div className="text-right">
							<div className="text-2xl font-bold text-blue-600 mb-1">
								{currentSubscription.status === "trial"
									? "FREE TRIAL"
									: `$${subscriptionTiers.find((t) => t.id === currentSubscription.tier)?.price[billingCycle] || 0}`}
							</div>
							<div className="text-sm text-gray-500">
								{billingCycle === "yearly" ? "per year" : "per month"}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Pricing Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
				{subscriptionTiers.map((tier) => (
					<PricingCard
						key={tier.id}
						tier={tier}
						currentTier={currentSubscription?.tier}
						onSelectTier={handleUpgrade}
						billingCycle={billingCycle}
					/>
				))}
			</div>

			{/* Feature Comparison */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
				<h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
					Feature Comparison
				</h3>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-200">
								<th className="text-left py-4 px-6 font-semibold text-gray-900">
									Features
								</th>
								{subscriptionTiers.map((tier) => (
									<th key={tier.id} className="text-center py-4 px-6">
										<div className="flex flex-col items-center gap-2">
											{getTierIcon(tier.id)}
											<span className="font-semibold text-gray-900">
												{tier.name}
											</span>
										</div>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{/* Problems Access */}
							<tr className="border-b border-gray-100">
								<td className="py-4 px-6 font-medium text-gray-900">
									Problems Access
								</td>
								<td className="text-center py-4 px-6">
									<span className="text-gray-600">100+ problems</span>
								</td>
								<td className="text-center py-4 px-6">
									<span className="text-gray-600">1000+ problems</span>
								</td>
								<td className="text-center py-4 px-6">
									<span className="text-gray-600">Unlimited</span>
								</td>
								<td className="text-center py-4 px-6">
									<span className="text-gray-600">Unlimited</span>
								</td>
							</tr>

							{/* Analytics */}
							<tr className="border-b border-gray-100">
								<td className="py-4 px-6 font-medium text-gray-900">
									Analytics History
								</td>
								<td className="text-center py-4 px-6">
									<span className="text-gray-600">7 days</span>
								</td>
								<td className="text-center py-4 px-6">
									<span className="text-gray-600">90 days</span>
								</td>
								<td className="text-center py-4 px-6">
									<span className="text-gray-600">1 year</span>
								</td>
								<td className="text-center py-4 px-6">
									<span className="text-gray-600">Unlimited</span>
								</td>
							</tr>

							{/* AI Recommendations */}
							<tr className="border-b border-gray-100">
								<td className="py-4 px-6 font-medium text-gray-900">
									AI Recommendations
								</td>
								<td className="text-center py-4 px-6">
									<span className="text-gray-600">10/month</span>
								</td>
								<td className="text-center py-4 px-6">
									<span className="text-gray-600">100/month</span>
								</td>
								<td className="text-center py-4 px-6">
									<CheckSolidIcon className="h-5 w-5 text-green-500 mx-auto" />
								</td>
								<td className="text-center py-4 px-6">
									<CheckSolidIcon className="h-5 w-5 text-green-500 mx-auto" />
								</td>
							</tr>

							{/* Code Execution */}
							<tr className="border-b border-gray-100">
								<td className="py-4 px-6 font-medium text-gray-900">
									Code Execution
								</td>
								<td className="text-center py-4 px-6">
									<span className="text-gray-600">100/month</span>
								</td>
								<td className="text-center py-4 px-6">
									<span className="text-gray-600">1000/month</span>
								</td>
								<td className="text-center py-4 px-6">
									<CheckSolidIcon className="h-5 w-5 text-green-500 mx-auto" />
								</td>
								<td className="text-center py-4 px-6">
									<CheckSolidIcon className="h-5 w-5 text-green-500 mx-auto" />
								</td>
							</tr>

							{/* Mock Interviews */}
							<tr className="border-b border-gray-100">
								<td className="py-4 px-6 font-medium text-gray-900">
									Mock Interviews
								</td>
								<td className="text-center py-4 px-6">
									<XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
								</td>
								<td className="text-center py-4 px-6">
									<XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
								</td>
								<td className="text-center py-4 px-6">
									<CheckSolidIcon className="h-5 w-5 text-green-500 mx-auto" />
								</td>
								<td className="text-center py-4 px-6">
									<CheckSolidIcon className="h-5 w-5 text-green-500 mx-auto" />
								</td>
							</tr>

							{/* Priority Support */}
							<tr className="border-b border-gray-100">
								<td className="py-4 px-6 font-medium text-gray-900">
									Priority Support
								</td>
								<td className="text-center py-4 px-6">
									<XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
								</td>
								<td className="text-center py-4 px-6">
									<XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
								</td>
								<td className="text-center py-4 px-6">
									<CheckSolidIcon className="h-5 w-5 text-green-500 mx-auto" />
								</td>
								<td className="text-center py-4 px-6">
									<CheckSolidIcon className="h-5 w-5 text-green-500 mx-auto" />
								</td>
							</tr>

							{/* Team Management */}
							<tr>
								<td className="py-4 px-6 font-medium text-gray-900">
									Team Management
								</td>
								<td className="text-center py-4 px-6">
									<XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
								</td>
								<td className="text-center py-4 px-6">
									<XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
								</td>
								<td className="text-center py-4 px-6">
									<XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
								</td>
								<td className="text-center py-4 px-6">
									<CheckSolidIcon className="h-5 w-5 text-green-500 mx-auto" />
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			{/* Benefits Showcase */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
				<div className="text-center p-6">
					<div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
						<ChartBarIcon className="h-8 w-8 text-blue-600" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						Advanced Analytics
					</h3>
					<p className="text-gray-600">
						Get detailed insights into your performance with trend analysis,
						predictions, and personalized recommendations.
					</p>
				</div>

				<div className="text-center p-6">
					<div className="bg-purple-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
						<SparklesIcon className="h-8 w-8 text-purple-600" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						AI-Powered Learning
					</h3>
					<p className="text-gray-600">
						Leverage artificial intelligence for personalized problem
						recommendations and adaptive difficulty adjustment.
					</p>
				</div>

				<div className="text-center p-6">
					<div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
						<UserGroupIcon className="h-8 w-8 text-green-600" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						Competitive Features
					</h3>
					<p className="text-gray-600">
						Join exclusive tournaments, access mock interviews, and compete with
						the best programmers worldwide.
					</p>
				</div>
			</div>

			{/* FAQ */}
			<div className="bg-gray-50 rounded-xl p-8">
				<h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
					Frequently Asked Questions
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div>
						<h4 className="font-semibold text-gray-900 mb-2">
							Can I cancel anytime?
						</h4>
						<p className="text-gray-600">
							Yes, you can cancel your subscription at any time. You'll continue
							to have access to premium features until the end of your billing
							period.
						</p>
					</div>

					<div>
						<h4 className="font-semibold text-gray-900 mb-2">
							What payment methods do you accept?
						</h4>
						<p className="text-gray-600">
							We accept all major credit cards, PayPal, and bank transfers for
							annual plans.
						</p>
					</div>

					<div>
						<h4 className="font-semibold text-gray-900 mb-2">
							Is there a free trial?
						</h4>
						<p className="text-gray-600">
							Yes, we offer a 7-day free trial of Premium features. No credit
							card required.
						</p>
					</div>

					<div>
						<h4 className="font-semibold text-gray-900 mb-2">
							Can I upgrade or downgrade my plan?
						</h4>
						<p className="text-gray-600">
							You can change your plan at any time. Upgrades take effect
							immediately, while downgrades apply at the next billing cycle.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function PricingCard({
	tier,
	currentTier,
	onSelectTier,
	billingCycle,
}: PricingCardProps) {
	const isCurrentTier = currentTier === tier.id;
	const price =
		billingCycle === "yearly" ? tier.price.yearly : tier.price.monthly;
	const monthlyEquivalent =
		billingCycle === "yearly" ? tier.price.yearly / 12 : tier.price.monthly;

	return (
		<div
			className={`relative bg-white rounded-2xl p-8 border-2 transition-all ${
				tier.popular
					? "border-blue-500 shadow-lg scale-105"
					: isCurrentTier
						? "border-green-500"
						: "border-gray-200 hover:border-gray-300"
			}`}
		>
			{tier.popular && (
				<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
					<span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
						Most Popular
					</span>
				</div>
			)}

			{isCurrentTier && (
				<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
					<span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
						Current Plan
					</span>
				</div>
			)}

			<div className="text-center mb-8">
				<div className="flex justify-center mb-4">
					{tier.id === "free" && (
						<StarIcon className="h-12 w-12 text-gray-500" />
					)}
					{tier.id === "premium" && (
						<BoltIcon className="h-12 w-12 text-blue-500" />
					)}
					{tier.id === "pro" && (
						<CrownIcon className="h-12 w-12 text-purple-500" />
					)}
					{tier.id === "enterprise" && (
						<ShieldCheckIcon className="h-12 w-12 text-green-500" />
					)}
				</div>

				<h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
				<p className="text-gray-600 mb-6">{tier.description}</p>

				<div className="mb-6">
					{price === 0 ? (
						<div className="text-4xl font-bold text-gray-900">Free</div>
					) : (
						<>
							<div className="text-4xl font-bold text-gray-900">
								$
								{billingCycle === "yearly"
									? Math.round(monthlyEquivalent)
									: price}
							</div>
							<div className="text-sm text-gray-500">
								{billingCycle === "yearly" ? (
									<>per month (billed ${tier.price.yearly} yearly)</>
								) : (
									"per month"
								)}
							</div>
							{billingCycle === "yearly" && tier.price.yearlyDiscount > 0 && (
								<div className="text-sm text-green-600 font-medium">
									Save {tier.price.yearlyDiscount}% with yearly billing
								</div>
							)}
						</>
					)}
				</div>

				<button
					onClick={() => onSelectTier(tier.id)}
					disabled={isCurrentTier}
					className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
						isCurrentTier
							? "bg-gray-100 text-gray-500 cursor-not-allowed"
							: tier.popular
								? "bg-blue-600 text-white hover:bg-blue-700"
								: "bg-gray-900 text-white hover:bg-gray-800"
					}`}
				>
					{isCurrentTier ? "Current Plan" : `Get ${tier.name}`}
				</button>
			</div>

			<div className="space-y-4">
				{tier.features.map((feature, index) => (
					<div key={index} className="flex items-center gap-3">
						<CheckSolidIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
						<span className="text-gray-700">{feature}</span>
					</div>
				))}
			</div>

			{tier.limits && (
				<div className="mt-6 pt-6 border-t border-gray-100">
					<div className="text-sm text-gray-600 space-y-2">
						{tier.limits.problemsPerMonth && (
							<div>• {tier.limits.problemsPerMonth} problems per month</div>
						)}
						{tier.limits.customQuizzes && (
							<div>• {tier.limits.customQuizzes} custom quizzes</div>
						)}
						{tier.limits.aiRecommendations && (
							<div>• {tier.limits.aiRecommendations} AI recommendations</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
