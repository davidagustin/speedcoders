import { Card } from "@/components/ui/UIComponents";

export default function PrivacyPage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
					<p className="text-gray-600">Last updated: December 2024</p>
				</div>

				<div className="space-y-8">
					<Card title="Overview" icon="🔒">
						<p className="text-gray-700 leading-relaxed">
							At SpeedCoders, we take your privacy seriously. This Privacy Policy explains how we collect, 
							use, disclose, and safeguard your information when you use our platform. Please read this 
							privacy policy carefully. If you do not agree with the terms of this privacy policy, 
							please do not access the site.
						</p>
					</Card>

					<Card title="Information We Collect" icon="📊">
						<div className="space-y-4">
							<div>
								<h3 className="font-semibold text-lg mb-2">Personal Information</h3>
								<ul className="list-disc list-inside space-y-1 text-gray-700">
									<li>Name, email address, and username</li>
									<li>Profile information and preferences</li>
									<li>Payment information (processed securely by third-party providers)</li>
									<li>Communication preferences and history</li>
								</ul>
							</div>
							<div>
								<h3 className="font-semibold text-lg mb-2">Usage Information</h3>
								<ul className="list-disc list-inside space-y-1 text-gray-700">
									<li>Problems solved, solutions submitted, and coding activity</li>
									<li>Contest participation and performance data</li>
									<li>Learning progress and achievement data</li>
									<li>Device information, IP address, and browser type</li>
								</ul>
							</div>
						</div>
					</Card>

					<Card title="How We Use Your Information" icon="⚙️">
						<ul className="list-disc list-inside space-y-2 text-gray-700">
							<li>Provide and maintain our coding platform and services</li>
							<li>Personalize your learning experience and track progress</li>
							<li>Communicate with you about updates, contests, and new features</li>
							<li>Improve our platform through analytics and user feedback</li>
							<li>Prevent fraud and ensure platform security</li>
							<li>Comply with legal obligations and protect our rights</li>
						</ul>
					</Card>

					<Card title="Information Sharing" icon="🔄">
						<div className="space-y-4">
							<p className="text-gray-700">
								We do not sell, trade, or rent your personal information to third parties. 
								We may share information in the following circumstances:
							</p>
							<ul className="list-disc list-inside space-y-1 text-gray-700">
								<li><strong>Service Providers:</strong> With trusted partners who help us operate our platform</li>
								<li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
								<li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
								<li><strong>Consent:</strong> When you explicitly give us permission to share</li>
							</ul>
						</div>
					</Card>

					<Card title="Data Security" icon="🛡️">
						<div className="space-y-3">
							<p className="text-gray-700">
								We implement appropriate security measures to protect your personal information:
							</p>
							<ul className="list-disc list-inside space-y-1 text-gray-700">
								<li>SSL/TLS encryption for data transmission</li>
								<li>Secure data storage with encryption at rest</li>
								<li>Regular security audits and monitoring</li>
								<li>Access controls and authentication requirements</li>
								<li>Employee training on data protection practices</li>
							</ul>
						</div>
					</Card>

					<Card title="Your Privacy Rights" icon="👤">
						<div className="space-y-3">
							<p className="text-gray-700">You have the following rights regarding your personal information:</p>
							<ul className="list-disc list-inside space-y-1 text-gray-700">
								<li><strong>Access:</strong> Request copies of your personal information</li>
								<li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
								<li><strong>Erasure:</strong> Request deletion of your personal information</li>
								<li><strong>Portability:</strong> Receive your data in a portable format</li>
								<li><strong>Objection:</strong> Object to processing of your personal information</li>
								<li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
							</ul>
						</div>
					</Card>

					<Card title="Cookies and Tracking" icon="🍪">
						<div className="space-y-3">
							<p className="text-gray-700">
								We use cookies and similar technologies to enhance your experience:
							</p>
							<ul className="list-disc list-inside space-y-1 text-gray-700">
								<li><strong>Essential Cookies:</strong> Required for platform functionality</li>
								<li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
								<li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
								<li><strong>Marketing Cookies:</strong> Deliver relevant advertisements (optional)</li>
							</ul>
							<p className="text-gray-700 mt-3">
								You can manage cookie preferences through your browser settings or our cookie consent tool.
							</p>
						</div>
					</Card>

					<Card title="Children's Privacy" icon="👶">
						<p className="text-gray-700">
							Our platform is not intended for children under 13. We do not knowingly collect 
							personal information from children under 13. If you are a parent or guardian and 
							believe your child has provided us with personal information, please contact us 
							immediately so we can delete such information.
						</p>
					</Card>

					<Card title="International Users" icon="🌍">
						<p className="text-gray-700">
							SpeedCoders operates globally and may transfer your information to countries 
							other than your own. We ensure appropriate safeguards are in place to protect 
							your information in accordance with applicable data protection laws, including 
							GDPR and CCPA compliance measures.
						</p>
					</Card>

					<Card title="Changes to This Policy" icon="📝">
						<p className="text-gray-700">
							We may update this Privacy Policy from time to time. We will notify you of any 
							material changes by posting the new Privacy Policy on this page and updating 
							the "Last updated" date. We encourage you to review this Privacy Policy 
							periodically to stay informed about how we protect your information.
						</p>
					</Card>

					<Card title="Contact Us" icon="📧">
						<div className="space-y-3">
							<p className="text-gray-700">
								If you have questions about this Privacy Policy or our privacy practices, 
								please contact us at:
							</p>
							<div className="bg-gray-100 p-4 rounded-lg">
								<p><strong>Email:</strong> privacy@speedcoders.com</p>
								<p><strong>Address:</strong> SpeedCoders Inc., 123 Tech Street, San Francisco, CA 94105</p>
								<p><strong>Phone:</strong> +1 (555) 123-4567</p>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}