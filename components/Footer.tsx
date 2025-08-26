"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
	const [email, setEmail] = useState("");
	const [subscribed, setSubscribed] = useState(false);

	const handleNewsletterSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (email) {
			setSubscribed(true);
			setTimeout(() => setSubscribed(false), 3000);
			setEmail("");
		}
	};

	const currentYear = new Date().getFullYear();

	return (
		<footer className="footer">
			{/* Newsletter Section */}
			<div className="footer-newsletter">
				<div className="newsletter-content">
					<div className="newsletter-text">
						<h2>🚀 Level Up Your Coding Skills</h2>
						<p>Join 50,000+ developers getting daily coding challenges and tips</p>
					</div>
					<form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
						<input
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="newsletter-input"
							required
						/>
						<button type="submit" className="newsletter-button">
							{subscribed ? "✓ Subscribed!" : "Subscribe"}
						</button>
					</form>
				</div>
			</div>

			{/* Main Footer */}
			<div className="footer-main">
				<div className="footer-container">
					{/* Company Info */}
					<div className="footer-section footer-brand">
						<div className="footer-logo">
							<span className="logo-icon">🧠</span>
							<div className="logo-text">
								<h3>SpeedCoders</h3>
								<p>Master algorithms, ace interviews</p>
							</div>
						</div>
						<p className="brand-description">
							Your comprehensive platform for mastering data structures, algorithms, 
							and acing technical interviews at top tech companies.
						</p>
						<div className="social-links">
							<a href="#" className="social-link" aria-label="GitHub">
								<svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
								</svg>
							</a>
							<a href="#" className="social-link" aria-label="Twitter">
								<svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
								</svg>
							</a>
							<a href="#" className="social-link" aria-label="LinkedIn">
								<svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
								</svg>
							</a>
							<a href="#" className="social-link" aria-label="Discord">
								<svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
									<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
								</svg>
							</a>
							<a href="#" className="social-link" aria-label="YouTube">
								<svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
								</svg>
							</a>
						</div>
					</div>

					{/* Learn Section */}
					<div className="footer-section">
						<h4>Learn</h4>
						<ul className="footer-links">
							<li><Link href="/problems">All Problems</Link></li>
							<li><Link href="/algorithms">Algorithms</Link></li>
							<li><Link href="/data-structures">Data Structures</Link></li>
							<li><Link href="/interview-prep">Interview Prep</Link></li>
							<li><Link href="/study-plans">Study Plans</Link></li>
							<li><Link href="/roadmaps">Learning Roadmaps</Link></li>
							<li><Link href="/tutorials">Video Tutorials</Link></li>
							<li><Link href="/articles">Articles & Blogs</Link></li>
						</ul>
					</div>

					{/* Practice Section */}
					<div className="footer-section">
						<h4>Practice</h4>
						<ul className="footer-links">
							<li><Link href="/daily-challenge">Daily Challenge</Link></li>
							<li><Link href="/contest">Weekly Contest</Link></li>
							<li><Link href="/mock-interview">Mock Interviews</Link></li>
							<li><Link href="/playground">Code Playground</Link></li>
							<li><Link href="/assessments">Skill Assessments</Link></li>
							<li><Link href="/challenges">Coding Challenges</Link></li>
							<li><Link href="/hackathons">Hackathons</Link></li>
							<li><Link href="/certificates">Certificates</Link></li>
						</ul>
					</div>

					{/* Company Section */}
					<div className="footer-section">
						<h4>Company</h4>
						<ul className="footer-links">
							<li><Link href="/about">About Us</Link></li>
							<li><Link href="/careers">Careers</Link></li>
							<li><Link href="/team">Our Team</Link></li>
							<li><Link href="/press">Press Kit</Link></li>
							<li><Link href="/blog">Blog</Link></li>
							<li><Link href="/contact">Contact</Link></li>
							<li><Link href="/partners">Partners</Link></li>
							<li><Link href="/affiliate">Affiliate Program</Link></li>
						</ul>
					</div>

					{/* Resources Section */}
					<div className="footer-section">
						<h4>Resources</h4>
						<ul className="footer-links">
							<li><Link href="/help">Help Center</Link></li>
							<li><Link href="/community">Community</Link></li>
							<li><Link href="/forum">Discussion Forum</Link></li>
							<li><Link href="/events">Events</Link></li>
							<li><Link href="/mentorship">Mentorship</Link></li>
							<li><Link href="/api">Developer API</Link></li>
							<li><Link href="/mobile">Mobile Apps</Link></li>
							<li><Link href="/changelog">Changelog</Link></li>
						</ul>
					</div>
				</div>
			</div>

			{/* Stats Bar */}
			<div className="footer-stats">
				<div className="stats-container">
					<div className="stat-item">
						<span className="stat-number">3,662+</span>
						<span className="stat-label">Problems</span>
					</div>
					<div className="stat-item">
						<span className="stat-number">500K+</span>
						<span className="stat-label">Active Users</span>
					</div>
					<div className="stat-item">
						<span className="stat-number">10M+</span>
						<span className="stat-label">Solutions</span>
					</div>
					<div className="stat-item">
						<span className="stat-number">150+</span>
						<span className="stat-label">Companies</span>
					</div>
					<div className="stat-item">
						<span className="stat-number">95%</span>
						<span className="stat-label">Success Rate</span>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="footer-bottom">
				<div className="bottom-container">
					<div className="legal-links">
						<Link href="/privacy">Privacy Policy</Link>
						<Link href="/terms">Terms of Service</Link>
						<Link href="/cookies">Cookie Policy</Link>
						<Link href="/security">Security</Link>
						<Link href="/accessibility">Accessibility</Link>
						<Link href="/sitemap">Sitemap</Link>
					</div>
					<div className="footer-info">
						<p>&copy; {currentYear} SpeedCoders. All rights reserved.</p>
						<p>Made with ❤️ by developers, for developers</p>
					</div>
					<div className="payment-methods">
						<span className="payment-icon">💳</span>
						<span className="payment-icon">🏦</span>
						<span className="payment-icon">📱</span>
						<span className="payment-icon">🔒</span>
					</div>
				</div>
			</div>

			<style jsx>{`
				.footer {
					background: #0a0e27;
					color: #fff;
					margin-top: 5rem;
				}

				.footer-newsletter {
					background: linear-gradient(135deg, #667eea, #764ba2);
					padding: 3rem 0;
				}

				.newsletter-content {
					max-width: 1400px;
					margin: 0 auto;
					padding: 0 2rem;
					display: flex;
					justify-content: space-between;
					align-items: center;
					gap: 2rem;
				}

				.newsletter-text h2 {
					font-size: 2rem;
					margin-bottom: 0.5rem;
					color: white;
				}

				.newsletter-text p {
					color: rgba(255, 255, 255, 0.9);
					font-size: 1.1rem;
				}

				.newsletter-form {
					display: flex;
					gap: 1rem;
					min-width: 400px;
				}

				.newsletter-input {
					flex: 1;
					padding: 1rem 1.5rem;
					border: 2px solid rgba(255, 255, 255, 0.3);
					border-radius: 50px;
					background: rgba(255, 255, 255, 0.1);
					color: white;
					font-size: 1rem;
					outline: none;
					transition: all 0.3s ease;
				}

				.newsletter-input::placeholder {
					color: rgba(255, 255, 255, 0.7);
				}

				.newsletter-input:focus {
					border-color: white;
					background: rgba(255, 255, 255, 0.2);
				}

				.newsletter-button {
					padding: 1rem 2rem;
					background: white;
					color: #667eea;
					border: none;
					border-radius: 50px;
					font-weight: 700;
					font-size: 1rem;
					cursor: pointer;
					transition: all 0.3s ease;
					white-space: nowrap;
				}

				.newsletter-button:hover {
					transform: translateY(-2px);
					box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
				}

				.footer-main {
					padding: 4rem 0;
					background: #0a0e27;
				}

				.footer-container {
					max-width: 1400px;
					margin: 0 auto;
					padding: 0 2rem;
					display: grid;
					grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
					gap: 3rem;
				}

				.footer-section h4 {
					color: white;
					margin-bottom: 1.5rem;
					font-size: 1.1rem;
					font-weight: 700;
				}

				.footer-brand {
					display: flex;
					flex-direction: column;
					gap: 1.5rem;
				}

				.footer-logo {
					display: flex;
					align-items: center;
					gap: 1rem;
				}

				.logo-icon {
					font-size: 2.5rem;
				}

				.logo-text h3 {
					font-size: 1.5rem;
					margin: 0;
					background: linear-gradient(135deg, #667eea, #764ba2);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
				}

				.logo-text p {
					color: #8892b0;
					margin: 0.25rem 0 0 0;
					font-size: 0.9rem;
				}

				.brand-description {
					color: #8892b0;
					line-height: 1.6;
					font-size: 0.95rem;
				}

				.social-links {
					display: flex;
					gap: 1rem;
				}

				.social-link {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.1);
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.3s ease;
				}

				.social-link:hover {
					background: #667eea;
					transform: translateY(-3px);
				}

				.social-icon {
					width: 20px;
					height: 20px;
					color: white;
				}

				.footer-links {
					list-style: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 0.75rem;
				}

				.footer-links a {
					color: #8892b0;
					text-decoration: none;
					transition: all 0.3s ease;
					font-size: 0.95rem;
				}

				.footer-links a:hover {
					color: #667eea;
					transform: translateX(5px);
				}

				.footer-stats {
					background: rgba(255, 255, 255, 0.05);
					padding: 3rem 0;
					border-top: 1px solid rgba(255, 255, 255, 0.1);
					border-bottom: 1px solid rgba(255, 255, 255, 0.1);
				}

				.stats-container {
					max-width: 1400px;
					margin: 0 auto;
					padding: 0 2rem;
					display: flex;
					justify-content: space-around;
				}

				.stat-item {
					text-align: center;
				}

				.stat-number {
					display: block;
					font-size: 2.5rem;
					font-weight: 800;
					background: linear-gradient(135deg, #667eea, #764ba2);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
					margin-bottom: 0.5rem;
				}

				.stat-label {
					color: #8892b0;
					font-size: 1rem;
					text-transform: uppercase;
					letter-spacing: 1px;
				}

				.footer-bottom {
					background: #060815;
					padding: 2rem 0;
				}

				.bottom-container {
					max-width: 1400px;
					margin: 0 auto;
					padding: 0 2rem;
					display: flex;
					justify-content: space-between;
					align-items: center;
					flex-wrap: wrap;
					gap: 2rem;
				}

				.legal-links {
					display: flex;
					gap: 2rem;
					flex-wrap: wrap;
				}

				.legal-links a {
					color: #8892b0;
					text-decoration: none;
					font-size: 0.9rem;
					transition: all 0.3s ease;
				}

				.legal-links a:hover {
					color: #667eea;
				}

				.footer-info {
					text-align: center;
				}

				.footer-info p {
					margin: 0.25rem 0;
					color: #8892b0;
					font-size: 0.9rem;
				}

				.payment-methods {
					display: flex;
					gap: 1rem;
				}

				.payment-icon {
					font-size: 1.5rem;
					opacity: 0.7;
				}

				@media (max-width: 1024px) {
					.footer-container {
						grid-template-columns: 1fr 1fr 1fr;
					}

					.footer-brand {
						grid-column: 1 / -1;
					}

					.newsletter-content {
						flex-direction: column;
						text-align: center;
					}

					.newsletter-form {
						min-width: 100%;
						max-width: 500px;
					}
				}

				@media (max-width: 768px) {
					.footer-container {
						grid-template-columns: 1fr 1fr;
						gap: 2rem;
					}

					.stats-container {
						display: grid;
						grid-template-columns: 1fr 1fr 1fr;
						gap: 2rem;
					}

					.bottom-container {
						flex-direction: column;
						text-align: center;
					}

					.legal-links {
						justify-content: center;
					}
				}

				@media (max-width: 640px) {
					.footer-container {
						grid-template-columns: 1fr;
					}

					.newsletter-form {
						flex-direction: column;
					}

					.newsletter-button {
						width: 100%;
					}

					.stats-container {
						grid-template-columns: 1fr 1fr;
					}

					.legal-links {
						flex-direction: column;
						align-items: center;
						gap: 1rem;
					}
				}
			`}</style>
		</footer>
	);
}