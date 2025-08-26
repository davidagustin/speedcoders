"use client";

import { useState } from "react";
import { Button, Input, Card, Badge, Tabs } from "@/components/ui/UIComponents";
import { useToast } from "@/components/providers/ToastProvider";

export default function HelpPage() {
	const { showSuccess } = useToast();
	const [searchQuery, setSearchQuery] = useState("");
	const [contactForm, setContactForm] = useState({
		name: "",
		email: "",
		subject: "",
		message: ""
	});

	const faqData = [
		{
			question: "How do I start solving problems?",
			answer: "Navigate to the Problems section and filter by difficulty. Start with Easy problems to build your confidence, then gradually move to Medium and Hard problems."
		},
		{
			question: "What are contests and how do I participate?",
			answer: "Contests are timed competitive programming events. Go to the Contest section to see upcoming contests. Click 'Join Contest' when registration opens."
		},
		{
			question: "How is my progress tracked?",
			answer: "Your progress is automatically tracked as you solve problems. Visit your Profile or Analytics page to see detailed statistics about your performance."
		},
		{
			question: "Can I practice offline?",
			answer: "Yes! Our app supports offline mode. Your progress will sync automatically when you're back online."
		},
		{
			question: "How do I join study groups?",
			answer: "Visit the Community section to find and join study groups. You can also create your own study group and invite friends."
		},
		{
			question: "What programming languages are supported?",
			answer: "We support all major programming languages including JavaScript, Python, Java, C++, Go, Rust, and more."
		}
	];

	const handleContactSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// In real app, send to API
		showSuccess("Your message has been sent! We'll get back to you soon.");
		setContactForm({ name: "", email: "", subject: "", message: "" });
	};

	const filteredFaq = faqData.filter(
		faq => 
			faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const tabsData = [
		{
			label: "FAQ",
			content: (
				<div className="space-y-6">
					<div>
						<Input
							placeholder="Search frequently asked questions..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							icon="🔍"
						/>
					</div>

					<div className="space-y-4">
						{filteredFaq.map((faq, index) => (
							<Card key={index} variant="bordered" className="hover:shadow-md transition-shadow">
								<details className="group">
									<summary className="flex items-center justify-between cursor-pointer list-none">
										<h3 className="font-semibold text-gray-900">{faq.question}</h3>
										<span className="text-gray-400 group-open:rotate-180 transition-transform">
											▼
										</span>
									</summary>
									<div className="mt-4 text-gray-600 leading-relaxed">
										{faq.answer}
									</div>
								</details>
							</Card>
						))}
					</div>

					{filteredFaq.length === 0 && (
						<div className="text-center py-8">
							<div className="text-6xl mb-4">🔍</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
							<p className="text-gray-600">Try searching with different keywords</p>
						</div>
					)}
				</div>
			)
		},
		{
			label: "Contact Support",
			content: (
				<div className="max-w-2xl">
					<Card>
						<form onSubmit={handleContactSubmit} className="space-y-6">
							<div>
								<h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
								<p className="text-gray-600 mb-6">
									Can't find what you're looking for? Send us a message and we'll help you out.
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Input
									label="Name"
									value={contactForm.name}
									onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
									required
									icon="👤"
								/>
								<Input
									label="Email"
									type="email"
									value={contactForm.email}
									onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
									required
									icon="📧"
								/>
							</div>

							<Input
								label="Subject"
								value={contactForm.subject}
								onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
								required
								icon="📝"
							/>

							<div className="form-group">
								<label className="input-label">Message</label>
								<textarea
									value={contactForm.message}
									onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
									required
									className="input-field min-h-[120px] resize-none"
									placeholder="Describe your issue or question in detail..."
								/>
							</div>

							<Button type="submit" variant="primary" fullWidth>
								Send Message
							</Button>
						</form>
					</Card>
				</div>
			)
		},
		{
			label: "Getting Started",
			content: (
				<div className="space-y-6">
					<Card title="Quick Start Guide" icon="🚀">
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<Badge variant="primary">1</Badge>
								<div>
									<h4 className="font-semibold">Create Your Account</h4>
									<p className="text-gray-600">Sign up to track your progress and access all features.</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Badge variant="primary">2</Badge>
								<div>
									<h4 className="font-semibold">Choose Your Path</h4>
									<p className="text-gray-600">Select a study plan or start with easy problems to build confidence.</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Badge variant="primary">3</Badge>
								<div>
									<h4 className="font-semibold">Start Solving</h4>
									<p className="text-gray-600">Pick a problem, read carefully, and submit your solution.</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Badge variant="primary">4</Badge>
								<div>
									<h4 className="font-semibold">Track Progress</h4>
									<p className="text-gray-600">Monitor your improvement through analytics and achievements.</p>
								</div>
							</div>
						</div>
					</Card>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Card title="Popular Features" icon="⭐">
							<ul className="space-y-2">
								<li className="flex items-center gap-2">
									<span className="text-green-500">✓</span>
									<span>3,600+ coding problems</span>
								</li>
								<li className="flex items-center gap-2">
									<span className="text-green-500">✓</span>
									<span>Weekly contests</span>
								</li>
								<li className="flex items-center gap-2">
									<span className="text-green-500">✓</span>
									<span>Detailed analytics</span>
								</li>
								<li className="flex items-center gap-2">
									<span className="text-green-500">✓</span>
									<span>Study plans</span>
								</li>
								<li className="flex items-center gap-2">
									<span className="text-green-500">✓</span>
									<span>Community features</span>
								</li>
							</ul>
						</Card>

						<Card title="Resources" icon="📚">
							<div className="space-y-3">
								<a href="/algorithms" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
									<div className="font-medium">Algorithm Tutorials</div>
									<div className="text-sm text-gray-600">Learn core algorithms step by step</div>
								</a>
								<a href="/data-structures" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
									<div className="font-medium">Data Structures Guide</div>
									<div className="text-sm text-gray-600">Master fundamental data structures</div>
								</a>
								<a href="/study-planner" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
									<div className="font-medium">Study Plans</div>
									<div className="text-sm text-gray-600">Structured learning paths</div>
								</a>
							</div>
						</Card>
					</div>
				</div>
			)
		},
		{
			label: "Shortcuts",
			content: (
				<div className="space-y-6">
					<Card title="Keyboard Shortcuts" icon="⌨️">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold mb-3">Navigation</h4>
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span>Go to Dashboard</span>
										<Badge variant="default">Ctrl + D</Badge>
									</div>
									<div className="flex justify-between items-center">
										<span>Go to Problems</span>
										<Badge variant="default">Ctrl + P</Badge>
									</div>
									<div className="flex justify-between items-center">
										<span>Search</span>
										<Badge variant="default">Ctrl + K</Badge>
									</div>
									<div className="flex justify-between items-center">
										<span>Help</span>
										<Badge variant="default">Ctrl + H</Badge>
									</div>
								</div>
							</div>
							<div>
								<h4 className="font-semibold mb-3">Problem Solving</h4>
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span>Run Code</span>
										<Badge variant="default">Ctrl + Enter</Badge>
									</div>
									<div className="flex justify-between items-center">
										<span>Submit Solution</span>
										<Badge variant="default">Ctrl + S</Badge>
									</div>
									<div className="flex justify-between items-center">
										<span>Reset Code</span>
										<Badge variant="default">Ctrl + R</Badge>
									</div>
									<div className="flex justify-between items-center">
										<span>Toggle Theme</span>
										<Badge variant="default">Ctrl + T</Badge>
									</div>
								</div>
							</div>
						</div>
					</Card>

					<Card title="Quick Actions" icon="⚡">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Button variant="ghost" className="h-20 flex-col">
								<div className="text-2xl mb-1">📊</div>
								<div>View Dashboard</div>
							</Button>
							<Button variant="ghost" className="h-20 flex-col">
								<div className="text-2xl mb-1">🧩</div>
								<div>Browse Problems</div>
							</Button>
							<Button variant="ghost" className="h-20 flex-col">
								<div className="text-2xl mb-1">🏆</div>
								<div>Join Contest</div>
							</Button>
						</div>
					</Card>
				</div>
			)
		}
	];

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="text-6xl mb-4">❓</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Help Center</h1>
					<p className="text-gray-600">Find answers to your questions or get in touch with our support team</p>
				</div>

				{/* Content */}
				<Card>
					<Tabs tabs={tabsData} />
				</Card>
			</div>
		</div>
	);
}