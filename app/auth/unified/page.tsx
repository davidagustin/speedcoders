"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function UnifiedAuthPage() {
	const [isLogin, setIsLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		username: "",
		acceptTerms: false,
	});
	const [errors, setErrors] = useState<any>({});
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const router = useRouter();

	// Smooth transition animation
	useEffect(() => {
		setErrors({});
		setFormData(prev => ({
			...prev,
			confirmPassword: "",
			username: isLogin ? "" : prev.username,
			acceptTerms: false,
		}));
	}, [isLogin]);

	const validateForm = () => {
		const newErrors: any = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		}

		if (!isLogin) {
			if (!formData.username) {
				newErrors.username = "Username is required";
			} else if (formData.username.length < 3) {
				newErrors.username = "Username must be at least 3 characters";
			}

			if (!formData.confirmPassword) {
				newErrors.confirmPassword = "Please confirm your password";
			} else if (formData.password !== formData.confirmPassword) {
				newErrors.confirmPassword = "Passwords do not match";
			}

			if (!formData.acceptTerms) {
				newErrors.acceptTerms = "You must accept the terms and conditions";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsLoading(true);
		
		try {
			if (isLogin) {
				const result = await signIn("credentials", {
					redirect: false,
					email: formData.email,
					password: formData.password,
				});

				if (result?.error) {
					setErrors({ general: "Invalid email or password" });
				} else {
					router.push("/dashboard");
				}
			} else {
				// Handle signup
				const response = await fetch("/api/auth/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: formData.email,
						password: formData.password,
						username: formData.username,
					}),
				});

				if (response.ok) {
					// Auto login after successful signup
					await signIn("credentials", {
						redirect: false,
						email: formData.email,
						password: formData.password,
					});
					router.push("/dashboard");
				} else {
					const data = await response.json();
					setErrors({ general: data.message || "Signup failed" });
				}
			}
		} catch (error) {
			setErrors({ general: "An unexpected error occurred" });
		} finally {
			setIsLoading(false);
		}
	};

	const handleSocialLogin = (provider: string) => {
		setIsLoading(true);
		signIn(provider, { callbackUrl: "/dashboard" });
	};

	return (
		<div className="auth-container">
			<div className="auth-wrapper">
				{/* Left Section - Branding */}
				<div className="auth-branding">
					<div className="branding-content">
						<Link href="/" className="brand-logo">
							<span className="logo-icon">🧠</span>
							<h1>SpeedCoders</h1>
						</Link>
						
						<div className="brand-features">
							<h2>Start Your Coding Journey</h2>
							<div className="features-list">
								<div className="feature-item">
									<span className="feature-icon">✨</span>
									<div>
										<h4>3,600+ Problems</h4>
										<p>From easy to expert level</p>
									</div>
								</div>
								<div className="feature-item">
									<span className="feature-icon">🏆</span>
									<div>
										<h4>Weekly Contests</h4>
										<p>Compete with global coders</p>
									</div>
								</div>
								<div className="feature-item">
									<span className="feature-icon">📈</span>
									<div>
										<h4>Track Progress</h4>
										<p>Detailed analytics & insights</p>
									</div>
								</div>
								<div className="feature-item">
									<span className="feature-icon">🎯</span>
									<div>
										<h4>Interview Prep</h4>
										<p>Get ready for FAANG</p>
									</div>
								</div>
							</div>
						</div>

						<div className="testimonial">
							<p>"SpeedCoders helped me land my dream job at Google. The practice problems are exactly what you need!"</p>
							<div className="testimonial-author">
								<div className="avatar-placeholder">👩‍💼</div>
								<div>
									<strong>Sarah Chen</strong>
									<span>Software Engineer at Google</span>
								</div>
							</div>
						</div>
					</div>

					<div className="branding-decoration">
						<div className="floating-shape shape-1"></div>
						<div className="floating-shape shape-2"></div>
						<div className="floating-shape shape-3"></div>
					</div>
				</div>

				{/* Right Section - Auth Form */}
				<div className="auth-form-section">
					<div className="auth-form-container">
						{/* Tab Switcher */}
						<div className="auth-tabs">
							<button
								className={`auth-tab ${isLogin ? "active" : ""}`}
								onClick={() => setIsLogin(true)}
							>
								Sign In
							</button>
							<button
								className={`auth-tab ${!isLogin ? "active" : ""}`}
								onClick={() => setIsLogin(false)}
							>
								Create Account
							</button>
							<div className={`tab-indicator ${!isLogin ? "right" : ""}`}></div>
						</div>

						{/* Form Header */}
						<div className="form-header">
							<h3>{isLogin ? "Welcome back!" : "Join SpeedCoders"}</h3>
							<p>{isLogin ? "Enter your credentials to continue" : "Start your coding journey today"}</p>
						</div>

						{/* Social Login */}
						<div className="social-login-section">
							<button 
								className="social-btn google"
								onClick={() => handleSocialLogin("google")}
								disabled={isLoading}
							>
								<svg className="social-icon" viewBox="0 0 24 24">
									<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
									<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
									<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
									<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
								</svg>
								Continue with Google
							</button>
							<button 
								className="social-btn github"
								onClick={() => handleSocialLogin("github")}
								disabled={isLoading}
							>
								<svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
								</svg>
								Continue with GitHub
							</button>
						</div>

						<div className="divider">
							<span>or</span>
						</div>

						{/* Main Form */}
						<form onSubmit={handleSubmit} className="auth-form">
							{errors.general && (
								<div className="error-banner">
									<span className="error-icon">⚠️</span>
									{errors.general}
								</div>
							)}

							{!isLogin && (
								<div className="form-group">
									<label htmlFor="username">Username</label>
									<div className="input-wrapper">
										<span className="input-icon">👤</span>
										<input
											id="username"
											type="text"
											placeholder="Choose a username"
											value={formData.username}
											onChange={(e) => setFormData({...formData, username: e.target.value})}
											className={errors.username ? "error" : ""}
										/>
									</div>
									{errors.username && <span className="error-text">{errors.username}</span>}
								</div>
							)}

							<div className="form-group">
								<label htmlFor="email">Email Address</label>
								<div className="input-wrapper">
									<span className="input-icon">📧</span>
									<input
										id="email"
										type="email"
										placeholder="you@example.com"
										value={formData.email}
										onChange={(e) => setFormData({...formData, email: e.target.value})}
										className={errors.email ? "error" : ""}
										autoComplete="email"
									/>
								</div>
								{errors.email && <span className="error-text">{errors.email}</span>}
							</div>

							<div className="form-group">
								<label htmlFor="password">Password</label>
								<div className="input-wrapper">
									<span className="input-icon">🔒</span>
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={formData.password}
										onChange={(e) => setFormData({...formData, password: e.target.value})}
										className={errors.password ? "error" : ""}
										autoComplete={isLogin ? "current-password" : "new-password"}
									/>
									<button
										type="button"
										className="toggle-password"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? "👁️" : "👁️‍🗨️"}
									</button>
								</div>
								{errors.password && <span className="error-text">{errors.password}</span>}
							</div>

							{!isLogin && (
								<div className="form-group">
									<label htmlFor="confirmPassword">Confirm Password</label>
									<div className="input-wrapper">
										<span className="input-icon">🔒</span>
										<input
											id="confirmPassword"
											type={showPassword ? "text" : "password"}
											placeholder="Confirm your password"
											value={formData.confirmPassword}
											onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
											className={errors.confirmPassword ? "error" : ""}
											autoComplete="new-password"
										/>
									</div>
									{errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
								</div>
							)}

							{isLogin ? (
								<div className="form-options">
									<label className="checkbox-label">
										<input
											type="checkbox"
											checked={rememberMe}
											onChange={(e) => setRememberMe(e.target.checked)}
										/>
										<span className="checkbox-text">Remember me</span>
									</label>
									<Link href="/auth/forgot-password" className="forgot-link">
										Forgot password?
									</Link>
								</div>
							) : (
								<div className="form-options">
									<label className="checkbox-label">
										<input
											type="checkbox"
											checked={formData.acceptTerms}
											onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
										/>
										<span className="checkbox-text">
											I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>
										</span>
									</label>
									{errors.acceptTerms && <span className="error-text">{errors.acceptTerms}</span>}
								</div>
							)}

							<button 
								type="submit" 
								className="submit-btn"
								disabled={isLoading}
							>
								{isLoading ? (
									<span className="loading-spinner"></span>
								) : (
									<>{isLogin ? "Sign In" : "Create Account"}</>
								)}
							</button>
						</form>

						{/* Bottom Links */}
						<div className="auth-footer">
							<p>
								{isLogin ? "New to SpeedCoders?" : "Already have an account?"}
								<button 
									onClick={() => setIsLogin(!isLogin)}
									className="switch-link"
								>
									{isLogin ? "Create an account" : "Sign in"}
								</button>
							</p>
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				.auth-container {
					min-height: 100vh;
					display: flex;
					align-items: center;
					justify-content: center;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					padding: 2rem;
				}

				.auth-wrapper {
					width: 100%;
					max-width: 1200px;
					background: white;
					border-radius: 24px;
					box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
					display: flex;
					overflow: hidden;
					min-height: 700px;
				}

				.auth-branding {
					flex: 1;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					padding: 3rem;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					position: relative;
					overflow: hidden;
				}

				.branding-content {
					position: relative;
					z-index: 2;
				}

				.brand-logo {
					display: flex;
					align-items: center;
					gap: 1rem;
					text-decoration: none;
					color: white;
					margin-bottom: 3rem;
				}

				.logo-icon {
					font-size: 3rem;
				}

				.brand-logo h1 {
					font-size: 2rem;
					font-weight: 800;
					margin: 0;
				}

				.brand-features h2 {
					color: white;
					font-size: 2rem;
					margin-bottom: 2rem;
				}

				.features-list {
					display: flex;
					flex-direction: column;
					gap: 1.5rem;
					margin-bottom: 3rem;
				}

				.feature-item {
					display: flex;
					align-items: center;
					gap: 1rem;
					color: white;
				}

				.feature-icon {
					font-size: 2rem;
					width: 50px;
					height: 50px;
					background: rgba(255, 255, 255, 0.2);
					border-radius: 12px;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.feature-item h4 {
					margin: 0;
					font-size: 1.1rem;
				}

				.feature-item p {
					margin: 0.25rem 0 0 0;
					opacity: 0.9;
					font-size: 0.9rem;
				}

				.testimonial {
					background: rgba(255, 255, 255, 0.1);
					padding: 1.5rem;
					border-radius: 16px;
					backdrop-filter: blur(10px);
				}

				.testimonial p {
					color: white;
					font-style: italic;
					line-height: 1.6;
					margin-bottom: 1rem;
				}

				.testimonial-author {
					display: flex;
					align-items: center;
					gap: 1rem;
				}

				.avatar-placeholder {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					border: 2px solid rgba(255, 255, 255, 0.3);
					display: flex;
					align-items: center;
					justify-content: center;
					background: rgba(255, 255, 255, 0.1);
					font-size: 1.2rem;
				}

				.testimonial-author strong {
					display: block;
					color: white;
				}

				.testimonial-author span {
					color: rgba(255, 255, 255, 0.8);
					font-size: 0.9rem;
				}

				.branding-decoration {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					overflow: hidden;
					z-index: 1;
				}

				.floating-shape {
					position: absolute;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.1);
					animation: float 20s infinite ease-in-out;
				}

				.shape-1 {
					width: 300px;
					height: 300px;
					top: -100px;
					right: -100px;
					animation-delay: 0s;
				}

				.shape-2 {
					width: 200px;
					height: 200px;
					bottom: -50px;
					left: -50px;
					animation-delay: 5s;
				}

				.shape-3 {
					width: 150px;
					height: 150px;
					top: 50%;
					right: 10%;
					animation-delay: 10s;
				}

				@keyframes float {
					0%, 100% { transform: translate(0, 0) rotate(0deg); }
					25% { transform: translate(30px, -30px) rotate(90deg); }
					50% { transform: translate(-20px, 20px) rotate(180deg); }
					75% { transform: translate(-30px, -20px) rotate(270deg); }
				}

				.auth-form-section {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 3rem;
					background: white;
				}

				.auth-form-container {
					width: 100%;
					max-width: 420px;
				}

				.auth-tabs {
					display: flex;
					background: #f5f5f5;
					border-radius: 12px;
					padding: 4px;
					margin-bottom: 2rem;
					position: relative;
				}

				.auth-tab {
					flex: 1;
					padding: 0.75rem;
					background: transparent;
					border: none;
					font-weight: 600;
					color: #666;
					cursor: pointer;
					transition: all 0.3s ease;
					position: relative;
					z-index: 2;
				}

				.auth-tab.active {
					color: #333;
				}

				.tab-indicator {
					position: absolute;
					top: 4px;
					left: 4px;
					width: calc(50% - 4px);
					height: calc(100% - 8px);
					background: white;
					border-radius: 8px;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				}

				.tab-indicator.right {
					transform: translateX(calc(100% + 8px));
				}

				.form-header {
					text-align: center;
					margin-bottom: 2rem;
				}

				.form-header h3 {
					font-size: 1.75rem;
					color: #333;
					margin-bottom: 0.5rem;
				}

				.form-header p {
					color: #666;
				}

				.social-login-section {
					display: flex;
					flex-direction: column;
					gap: 0.75rem;
					margin-bottom: 1.5rem;
				}

				.social-btn {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 0.75rem;
					width: 100%;
					padding: 0.75rem;
					border: 1px solid #ddd;
					border-radius: 12px;
					background: white;
					font-weight: 600;
					color: #333;
					cursor: pointer;
					transition: all 0.3s ease;
				}

				.social-btn:hover {
					border-color: #667eea;
					box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
					transform: translateY(-2px);
				}

				.social-btn:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}

				.social-icon {
					width: 20px;
					height: 20px;
				}

				.divider {
					text-align: center;
					margin: 1.5rem 0;
					position: relative;
				}

				.divider::before {
					content: "";
					position: absolute;
					top: 50%;
					left: 0;
					right: 0;
					height: 1px;
					background: #ddd;
				}

				.divider span {
					background: white;
					padding: 0 1rem;
					color: #999;
					position: relative;
					font-size: 0.9rem;
				}

				.auth-form {
					display: flex;
					flex-direction: column;
					gap: 1.25rem;
				}

				.error-banner {
					background: #fee;
					border: 1px solid #fcc;
					border-radius: 8px;
					padding: 0.75rem;
					display: flex;
					align-items: center;
					gap: 0.5rem;
					color: #c00;
					font-size: 0.9rem;
				}

				.form-group {
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
				}

				.form-group label {
					font-weight: 600;
					color: #333;
					font-size: 0.95rem;
				}

				.input-wrapper {
					position: relative;
					display: flex;
					align-items: center;
				}

				.input-icon {
					position: absolute;
					left: 1rem;
					font-size: 1.2rem;
					opacity: 0.5;
				}

				.form-group input {
					width: 100%;
					padding: 0.75rem 1rem 0.75rem 3rem;
					border: 2px solid #e0e0e0;
					border-radius: 12px;
					font-size: 1rem;
					transition: all 0.3s ease;
					background: white;
				}

				.form-group input:focus {
					outline: none;
					border-color: #667eea;
					box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
				}

				.form-group input.error {
					border-color: #f44336;
				}

				.toggle-password {
					position: absolute;
					right: 1rem;
					background: none;
					border: none;
					cursor: pointer;
					font-size: 1.2rem;
					opacity: 0.6;
					transition: opacity 0.3s ease;
				}

				.toggle-password:hover {
					opacity: 1;
				}

				.error-text {
					color: #f44336;
					font-size: 0.85rem;
				}

				.form-options {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.checkbox-label {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					cursor: pointer;
					font-size: 0.95rem;
					color: #666;
				}

				.checkbox-label input {
					width: 18px;
					height: 18px;
					cursor: pointer;
				}

				.checkbox-text a {
					color: #667eea;
					text-decoration: none;
					font-weight: 600;
				}

				.checkbox-text a:hover {
					text-decoration: underline;
				}

				.forgot-link {
					color: #667eea;
					text-decoration: none;
					font-size: 0.95rem;
					font-weight: 600;
				}

				.forgot-link:hover {
					text-decoration: underline;
				}

				.submit-btn {
					width: 100%;
					padding: 1rem;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: white;
					border: none;
					border-radius: 12px;
					font-size: 1.1rem;
					font-weight: 700;
					cursor: pointer;
					transition: all 0.3s ease;
					margin-top: 0.5rem;
					position: relative;
					overflow: hidden;
				}

				.submit-btn::before {
					content: "";
					position: absolute;
					top: 0;
					left: -100%;
					width: 100%;
					height: 100%;
					background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
					transition: left 0.5s ease;
				}

				.submit-btn:hover::before {
					left: 100%;
				}

				.submit-btn:hover {
					transform: translateY(-2px);
					box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
				}

				.submit-btn:disabled {
					opacity: 0.7;
					cursor: not-allowed;
				}

				.loading-spinner {
					display: inline-block;
					width: 20px;
					height: 20px;
					border: 3px solid rgba(255, 255, 255, 0.3);
					border-top-color: white;
					border-radius: 50%;
					animation: spin 0.8s linear infinite;
				}

				@keyframes spin {
					to { transform: rotate(360deg); }
				}

				.auth-footer {
					text-align: center;
					margin-top: 2rem;
				}

				.auth-footer p {
					color: #666;
					font-size: 0.95rem;
				}

				.switch-link {
					color: #667eea;
					background: none;
					border: none;
					font-weight: 600;
					cursor: pointer;
					margin-left: 0.5rem;
					text-decoration: none;
				}

				.switch-link:hover {
					text-decoration: underline;
				}

				@media (max-width: 1024px) {
					.auth-branding {
						display: none;
					}

					.auth-wrapper {
						max-width: 500px;
					}
				}

				@media (max-width: 640px) {
					.auth-container {
						padding: 1rem;
					}

					.auth-form-section {
						padding: 2rem;
					}

					.form-header h3 {
						font-size: 1.5rem;
					}

					.social-btn {
						font-size: 0.9rem;
					}

					.form-options {
						flex-direction: column;
						align-items: flex-start;
						gap: 1rem;
					}
				}
			`}</style>
		</div>
	);
}