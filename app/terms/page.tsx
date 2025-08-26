import { Card } from "@/components/ui/UIComponents";

export default function TermsPage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
					<p className="text-gray-600">Last updated: December 2024</p>
				</div>

				<div className="space-y-8">
					<Card title="Agreement to Terms" icon="📋">
						<p className="text-gray-700 leading-relaxed">
							By accessing or using SpeedCoders ("the Platform"), you agree to be bound by these 
							Terms of Service ("Terms"). If you disagree with any part of these terms, then you 
							may not access the Platform. These Terms apply to all visitors, users, and others 
							who access or use the Platform.
						</p>
					</Card>

					<Card title="Description of Service" icon="💻">
						<div className="space-y-3">
							<p className="text-gray-700">
								SpeedCoders is an online platform that provides:
							</p>
							<ul className="list-disc list-inside space-y-1 text-gray-700">
								<li>Coding problems and programming challenges</li>
								<li>Contest and competition features</li>
								<li>Educational content and tutorials</li>
								<li>Progress tracking and analytics</li>
								<li>Community features and discussions</li>
								<li>Premium features and subscriptions</li>
							</ul>
						</div>
					</Card>

					<Card title="User Accounts" icon="👤">
						<div className="space-y-3">
							<p className="text-gray-700">To access certain features, you must create an account:</p>
							<ul className="list-disc list-inside space-y-1 text-gray-700">
								<li>You must provide accurate, complete, and current information</li>
								<li>You are responsible for safeguarding your account password</li>
								<li>You must not share your account with others</li>
								<li>You must notify us immediately of any unauthorized use</li>
								<li>We reserve the right to suspend or terminate accounts</li>
							</ul>
						</div>
					</Card>

					<Card title="Acceptable Use" icon="✅">
						<div className="space-y-3">
							<p className="text-gray-700">You agree not to:</p>
							<ul className="list-disc list-inside space-y-1 text-gray-700">
								<li>Use the Platform for any unlawful purpose or illegal activity</li>
								<li>Violate any applicable local, state, national, or international law</li>
								<li>Transmit any harassing, libelous, abusive, or threatening content</li>
								<li>Attempt to gain unauthorized access to other accounts or systems</li>
								<li>Interfere with or disrupt the Platform's operation</li>
								<li>Use automated scripts to access or use the Platform</li>
								<li>Share solutions to active contests during the contest period</li>
								<li>Create multiple accounts to circumvent rate limits</li>
							</ul>
						</div>
					</Card>

					<Card title="Intellectual Property Rights" icon="©️">
						<div className="space-y-4">
							<div>
								<h3 className="font-semibold text-lg mb-2">Platform Content</h3>
								<p className="text-gray-700">
									The Platform and its content, including but not limited to problems, solutions, 
									tutorials, and software, are owned by SpeedCoders and protected by copyright, 
									trademark, and other intellectual property laws.
								</p>
							</div>
							<div>
								<h3 className="font-semibold text-lg mb-2">User Content</h3>
								<p className="text-gray-700">
									You retain ownership of any content you submit, but grant SpeedCoders a 
									license to use, modify, and display your content in connection with the Platform.
								</p>
							</div>
						</div>
					</Card>

					<Card title="Premium Services" icon="⭐">
						<div className="space-y-3">
							<p className="text-gray-700">
								SpeedCoders offers premium subscriptions with additional features:
							</p>
							<ul className="list-disc list-inside space-y-1 text-gray-700">
								<li>Subscription fees are billed in advance on a recurring basis</li>
								<li>You may cancel your subscription at any time</li>
								<li>Refunds are provided according to our refund policy</li>
								<li>Premium features are subject to change with notice</li>
								<li>Price changes will be communicated in advance</li>
							</ul>
						</div>
					</Card>

					<Card title="Privacy Policy" icon="🔒">
						<p className="text-gray-700">
							Your privacy is important to us. Our Privacy Policy explains how we collect, use, 
							and protect your information when you use the Platform. By using the Platform, 
							you agree to the collection and use of information in accordance with our Privacy Policy.
						</p>
					</Card>

					<Card title="Disclaimers" icon="⚠️">
						<div className="space-y-3">
							<p className="text-gray-700">
								The Platform is provided on an "AS IS" and "AS AVAILABLE" basis:
							</p>
							<ul className="list-disc list-inside space-y-1 text-gray-700">
								<li>We do not guarantee uninterrupted or error-free operation</li>
								<li>We make no warranties about the accuracy of content</li>
								<li>We are not responsible for user-generated content</li>
								<li>We do not guarantee job placement or interview success</li>
								<li>Platform availability may vary by location</li>
							</ul>
						</div>
					</Card>

					<Card title="Limitation of Liability" icon="🛡️">
						<p className="text-gray-700">
							In no event shall SpeedCoders be liable for any indirect, incidental, special, 
							consequential, or punitive damages, including without limitation, loss of profits, 
							data, use, goodwill, or other intangible losses, resulting from your use of the Platform.
						</p>
					</Card>

					<Card title="Indemnification" icon="⚖️">
						<p className="text-gray-700">
							You agree to defend, indemnify, and hold harmless SpeedCoders from and against any 
							loss, damage, liability, claim, or demand, including reasonable attorneys' fees and 
							expenses, made by any third party due to or arising out of your use of the Platform 
							or violation of these Terms.
						</p>
					</Card>

					<Card title="Termination" icon="🚪">
						<div className="space-y-3">
							<p className="text-gray-700">
								We may terminate or suspend your account and access to the Platform:
							</p>
							<ul className="list-disc list-inside space-y-1 text-gray-700">
								<li>Immediately, without prior notice, for violation of these Terms</li>
								<li>For prolonged inactivity</li>
								<li>At our sole discretion for any reason</li>
								<li>Upon your request to delete your account</li>
							</ul>
						</div>
					</Card>

					<Card title="Governing Law" icon="🏛️">
						<p className="text-gray-700">
							These Terms shall be governed by and construed in accordance with the laws of 
							the State of California, United States, without regard to its conflict of law 
							provisions. Any disputes arising under these Terms shall be resolved in the 
							courts of California.
						</p>
					</Card>

					<Card title="Changes to Terms" icon="📝">
						<p className="text-gray-700">
							We reserve the right to modify or replace these Terms at any time. If a revision 
							is material, we will try to provide at least 30 days notice prior to any new terms 
							taking effect. Your continued use of the Platform after changes become effective 
							constitutes acceptance of the new Terms.
						</p>
					</Card>

					<Card title="Contact Information" icon="📧">
						<div className="space-y-3">
							<p className="text-gray-700">
								If you have any questions about these Terms of Service, please contact us:
							</p>
							<div className="bg-gray-100 p-4 rounded-lg">
								<p><strong>Email:</strong> legal@speedcoders.com</p>
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