import { Card } from "@/components/ui/UIComponents";

export default function AboutPage() {
	const teamMembers = [
		{
			name: "Sarah Chen",
			role: "Founder & CEO",
			bio: "Former Google engineer with 8+ years experience in algorithms and system design.",
			image: "👩‍💼"
		},
		{
			name: "Michael Rodriguez",
			role: "CTO",
			bio: "Ex-Meta engineer specializing in scalable systems and competitive programming.",
			image: "👨‍💻"
		},
		{
			name: "Emily Watson",
			role: "Head of Product",
			bio: "Product leader with experience at Amazon, focused on developer tools and education.",
			image: "👩‍🚀"
		},
		{
			name: "David Kim",
			role: "Lead Engineer",
			bio: "Full-stack engineer passionate about creating exceptional learning experiences.",
			image: "👨‍🔬"
		}
	];

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold text-gray-900 mb-4">About SpeedCoders</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						We're on a mission to democratize coding education and help developers worldwide 
						master algorithms, data structures, and ace technical interviews.
					</p>
				</div>

				{/* Mission & Vision */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
					<Card title="Our Mission" icon="🎯" variant="gradient">
						<p className="text-gray-700 leading-relaxed">
							To provide accessible, high-quality coding education that empowers developers 
							to solve complex problems, think algorithmically, and succeed in their careers.
						</p>
					</Card>
					<Card title="Our Vision" icon="🚀" variant="gradient">
						<p className="text-gray-700 leading-relaxed">
							To become the world's most comprehensive platform for algorithmic thinking 
							and problem-solving, bridging the gap between learning and real-world application.
						</p>
					</Card>
				</div>

				{/* Story */}
				<Card className="mb-12" title="Our Story" icon="📖">
					<div className="space-y-4 text-gray-700 leading-relaxed">
						<p>
							SpeedCoders was founded in 2023 by a team of engineers who experienced firsthand 
							the challenges of preparing for technical interviews at top tech companies. After 
							countless hours practicing on various platforms, we realized there was a gap in 
							the market for a truly comprehensive, user-friendly learning experience.
						</p>
						<p>
							We set out to create more than just another coding platform. We wanted to build 
							a community where developers could not only practice problems but also understand 
							the underlying concepts, track their progress, and connect with like-minded peers.
						</p>
						<p>
							Today, SpeedCoders serves over 500,000 developers worldwide, offering 3,600+ 
							carefully curated problems, weekly contests, personalized study plans, and 
							advanced analytics to help every user reach their full potential.
						</p>
					</div>
				</Card>

				{/* Team */}
				<Card className="mb-12" title="Meet Our Team" icon="👥">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{teamMembers.map((member, index) => (
							<div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
								<div className="text-4xl">{member.image}</div>
								<div>
									<h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
									<p className="text-purple-600 font-medium mb-2">{member.role}</p>
									<p className="text-gray-600 text-sm">{member.bio}</p>
								</div>
							</div>
						))}
					</div>
				</Card>

				{/* Values */}
				<Card title="Our Values" icon="💎">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="text-4xl mb-3">🎓</div>
							<h3 className="font-semibold text-lg mb-2">Education First</h3>
							<p className="text-gray-600 text-sm">
								We believe in making complex concepts accessible and enjoyable to learn.
							</p>
						</div>
						<div className="text-center">
							<div className="text-4xl mb-3">🌍</div>
							<h3 className="font-semibold text-lg mb-2">Inclusive Community</h3>
							<p className="text-gray-600 text-sm">
								We welcome developers of all backgrounds and skill levels.
							</p>
						</div>
						<div className="text-center">
							<div className="text-4xl mb-3">⚡</div>
							<h3 className="font-semibold text-lg mb-2">Continuous Innovation</h3>
							<p className="text-gray-600 text-sm">
								We constantly evolve our platform based on user feedback and industry trends.
							</p>
						</div>
					</div>
				</Card>

				{/* Stats */}
				<Card title="SpeedCoders by the Numbers" icon="📊">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
						<div>
							<div className="text-3xl font-bold text-purple-600">500K+</div>
							<div className="text-gray-600">Active Users</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-blue-600">3,600+</div>
							<div className="text-gray-600">Problems</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-green-600">10M+</div>
							<div className="text-gray-600">Solutions Submitted</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-orange-600">150+</div>
							<div className="text-gray-600">Partner Companies</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}