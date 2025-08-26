"use client";

import { useState } from "react";
import { 
	Button, 
	Input, 
	Card, 
	Skeleton, 
	Progress, 
	Badge, 
	Modal, 
	Tabs 
} from "@/components/ui/UIComponents";
import { useToast } from "@/components/providers/ToastProvider";

export default function DesignShowcasePage() {
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const { showSuccess, showError, showWarning, showInfo } = useToast();

	const handleLoadingDemo = async () => {
		setLoading(true);
		await new Promise(resolve => setTimeout(resolve, 2000));
		setLoading(false);
		showSuccess("Loading completed successfully!");
	};

	const tabsData = [
		{
			label: "Buttons",
			content: (
				<div className="space-y-6">
					<div>
						<h4 className="text-lg font-semibold mb-3">Button Variants</h4>
						<div className="flex gap-3 flex-wrap">
							<Button variant="primary">Primary Button</Button>
							<Button variant="secondary">Secondary Button</Button>
							<Button variant="ghost">Ghost Button</Button>
							<Button variant="danger">Danger Button</Button>
							<Button variant="success">Success Button</Button>
						</div>
					</div>

					<div>
						<h4 className="text-lg font-semibold mb-3">Button Sizes</h4>
						<div className="flex gap-3 items-center flex-wrap">
							<Button size="sm">Small</Button>
							<Button size="md">Medium</Button>
							<Button size="lg">Large</Button>
						</div>
					</div>

					<div>
						<h4 className="text-lg font-semibold mb-3">Special States</h4>
						<div className="flex gap-3 flex-wrap">
							<Button loading={loading} onClick={handleLoadingDemo}>
								{loading ? "Loading..." : "Click to Load"}
							</Button>
							<Button disabled>Disabled Button</Button>
							<Button icon="🚀" variant="primary">With Icon</Button>
							<Button fullWidth variant="secondary">Full Width</Button>
						</div>
					</div>
				</div>
			)
		},
		{
			label: "Form Elements",
			content: (
				<div className="space-y-6">
					<div>
						<h4 className="text-lg font-semibold mb-3">Input Fields</h4>
						<div className="space-y-4 max-w-md">
							<Input 
								label="Email Address" 
								type="email"
								placeholder="you@example.com"
								icon="📧"
							/>
							<Input 
								label="Password" 
								type="password"
								placeholder="Enter password"
								icon="🔒"
								helperText="Must be at least 8 characters"
							/>
							<Input 
								label="Username" 
								placeholder="Choose username"
								error="Username is already taken"
								icon="👤"
							/>
						</div>
					</div>
				</div>
			)
		},
		{
			label: "Cards & Layout",
			content: (
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<Card
							title="Default Card"
							subtitle="Basic card variant"
							icon="📄"
							variant="default"
						>
							<p>This is a default card with some content inside it.</p>
						</Card>

						<Card
							title="Bordered Card"
							subtitle="With purple border"
							icon="🎨"
							variant="bordered"
							action={<Badge variant="success">Active</Badge>}
						>
							<p>This card has a colored border and an action badge.</p>
						</Card>

						<Card
							title="Elevated Card"
							subtitle="With shadow"
							icon="⚡"
							variant="elevated"
						>
							<p>This card has enhanced shadows for elevation.</p>
							<div className="mt-4 flex gap-2">
								<Button size="sm" variant="primary">Action</Button>
								<Button size="sm" variant="ghost">Cancel</Button>
							</div>
						</Card>

						<Card
							title="Gradient Card"
							subtitle="With background gradient"
							icon="🌈"
							variant="gradient"
						>
							<p>This card has a subtle gradient background.</p>
							<Progress value={75} label="Completion" className="mt-3" />
						</Card>
					</div>
				</div>
			)
		},
		{
			label: "Data Display",
			content: (
				<div className="space-y-6">
					<div>
						<h4 className="text-lg font-semibold mb-3">Progress Bars</h4>
						<div className="space-y-4">
							<Progress value={25} label="Beginner Level" color="blue" />
							<Progress value={60} label="Intermediate Level" color="purple" />
							<Progress value={85} label="Advanced Level" color="green" />
							<Progress value={100} label="Expert Level" color="red" animated />
						</div>
					</div>

					<div>
						<h4 className="text-lg font-semibold mb-3">Badges</h4>
						<div className="flex gap-3 flex-wrap">
							<Badge variant="default">Default</Badge>
							<Badge variant="success" dot>Online</Badge>
							<Badge variant="warning">Pending</Badge>
							<Badge variant="danger">Error</Badge>
							<Badge variant="info">Info</Badge>
						</div>
					</div>

					<div>
						<h4 className="text-lg font-semibold mb-3">Loading Skeletons</h4>
						<div className="space-y-3">
							<Skeleton variant="text" />
							<Skeleton variant="text" width="80%" />
							<Skeleton variant="text" width="60%" />
							<div className="flex items-center gap-3 mt-4">
								<Skeleton variant="circular" width="40px" height="40px" />
								<div className="flex-1">
									<Skeleton variant="text" width="30%" />
									<Skeleton variant="text" width="50%" />
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
	];

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Design System Showcase</h1>
					<p className="text-gray-600">Explore our comprehensive UI component library</p>
				</div>

				{/* Quick Actions */}
				<Card className="mb-8" title="Interactive Demos" icon="🎮">
					<div className="flex gap-4 flex-wrap">
						<Button 
							variant="primary" 
							onClick={() => showSuccess("Success toast message!")}
						>
							Show Success Toast
						</Button>
						<Button 
							variant="danger" 
							onClick={() => showError("Error toast message!")}
						>
							Show Error Toast
						</Button>
						<Button 
							variant="secondary" 
							onClick={() => showWarning("Warning toast message!")}
						>
							Show Warning Toast
						</Button>
						<Button 
							variant="ghost" 
							onClick={() => showInfo("Info toast message!")}
						>
							Show Info Toast
						</Button>
						<Button 
							variant="secondary" 
							onClick={() => setShowModal(true)}
						>
							Open Modal
						</Button>
					</div>
				</Card>

				{/* Design System Components */}
				<Card>
					<Tabs tabs={tabsData} />
				</Card>

				{/* Modal Example */}
				<Modal 
					isOpen={showModal} 
					onClose={() => setShowModal(false)}
					title="Example Modal"
					size="md"
				>
					<div className="space-y-4">
						<p>This is an example modal with various interactive elements.</p>
						
						<Input 
							label="Your Name"
							placeholder="Enter your name"
							icon="👤"
						/>
						
						<div className="flex gap-3 justify-end mt-6">
							<Button variant="ghost" onClick={() => setShowModal(false)}>
								Cancel
							</Button>
							<Button 
								variant="primary"
								onClick={() => {
									showSuccess("Modal action completed!");
									setShowModal(false);
								}}
							>
								Confirm
							</Button>
						</div>
					</div>
				</Modal>

				{/* Color Palette */}
				<Card className="mt-8" title="Color Palette" icon="🎨">
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
						{[
							{ name: "Primary", class: "bg-purple-500" },
							{ name: "Secondary", class: "bg-indigo-500" },
							{ name: "Success", class: "bg-green-500" },
							{ name: "Warning", class: "bg-yellow-500" },
							{ name: "Error", class: "bg-red-500" },
							{ name: "Info", class: "bg-blue-500" },
							{ name: "Gray", class: "bg-gray-500" },
							{ name: "Dark", class: "bg-gray-900" }
						].map((color, index) => (
							<div key={index} className="text-center">
								<div className={`${color.class} w-full h-16 rounded-lg mb-2`}></div>
								<span className="text-sm font-medium">{color.name}</span>
							</div>
						))}
					</div>
				</Card>

				{/* Typography Scale */}
				<Card className="mt-8" title="Typography Scale" icon="📝">
					<div className="space-y-4">
						<div className="text-4xl font-bold">Heading 1 - 4xl</div>
						<div className="text-3xl font-bold">Heading 2 - 3xl</div>
						<div className="text-2xl font-semibold">Heading 3 - 2xl</div>
						<div className="text-xl font-semibold">Heading 4 - xl</div>
						<div className="text-lg font-medium">Heading 5 - lg</div>
						<div className="text-base">Body Text - base</div>
						<div className="text-sm text-gray-600">Small Text - sm</div>
						<div className="text-xs text-gray-500">Extra Small - xs</div>
					</div>
				</Card>

				{/* Animation Examples */}
				<Card className="mt-8" title="Animations & Micro-interactions" icon="✨">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-3 animate-pulse"></div>
							<p className="font-medium">Pulse Animation</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto mb-3 hover:scale-110 transition-transform cursor-pointer"></div>
							<p className="font-medium">Hover Scale</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-green-500 rounded-lg mx-auto mb-3 hover:rotate-12 transition-transform cursor-pointer"></div>
							<p className="font-medium">Hover Rotate</p>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}