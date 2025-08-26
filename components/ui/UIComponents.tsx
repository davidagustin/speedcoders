"use client";

import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, useState, useEffect } from "react";
import Link from "next/link";

// ============= Button Component =============
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
	size?: "sm" | "md" | "lg";
	loading?: boolean;
	icon?: ReactNode;
	fullWidth?: boolean;
}

export function Button({ 
	children, 
	variant = "primary", 
	size = "md", 
	loading = false,
	icon,
	fullWidth = false,
	className = "",
	disabled,
	...props 
}: ButtonProps) {
	const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-lg";
	
	const variants = {
		primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-lg",
		secondary: "bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50",
		ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
		danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg",
		success: "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg"
	};

	const sizes = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-lg"
	};

	return (
		<button
			className={`
				${baseStyles}
				${variants[variant]}
				${sizes[size]}
				${fullWidth ? "w-full" : ""}
				${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
				${className}
			`}
			disabled={disabled || loading}
			{...props}
		>
			{loading ? (
				<span className="loading-spinner mr-2"></span>
			) : icon ? (
				<span className="mr-2">{icon}</span>
			) : null}
			{children}
		</button>
	);
}

// ============= Input Component =============
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	icon?: ReactNode;
	helperText?: string;
}

export function Input({ 
	label, 
	error, 
	icon,
	helperText,
	className = "", 
	...props 
}: InputProps) {
	return (
		<div className="input-group">
			{label && <label className="input-label">{label}</label>}
			<div className="input-wrapper">
				{icon && <span className="input-icon">{icon}</span>}
				<input
					className={`
						input-field
						${icon ? "pl-10" : ""}
						${error ? "input-error" : ""}
						${className}
					`}
					{...props}
				/>
			</div>
			{error && <span className="error-message">{error}</span>}
			{helperText && !error && <span className="helper-text">{helperText}</span>}

			<style jsx>{`
				.input-group {
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
				}

				.input-label {
					font-weight: 600;
					color: #374151;
					font-size: 0.95rem;
				}

				.input-wrapper {
					position: relative;
				}

				.input-icon {
					position: absolute;
					left: 0.75rem;
					top: 50%;
					transform: translateY(-50%);
					font-size: 1.2rem;
					opacity: 0.5;
					z-index: 1;
				}

				.input-field {
					width: 100%;
					padding: 0.75rem 1rem;
					border: 2px solid #e5e7eb;
					border-radius: 0.75rem;
					font-size: 1rem;
					transition: all 0.3s ease;
					background: white;
				}

				.input-field:focus {
					outline: none;
					border-color: #667eea;
					box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
				}

				.input-error {
					border-color: #ef4444;
				}

				.error-message {
					color: #ef4444;
					font-size: 0.875rem;
				}

				.helper-text {
					color: #6b7280;
					font-size: 0.875rem;
				}
			`}</style>
		</div>
	);
}

// ============= Card Component =============
interface CardProps {
	children: ReactNode;
	title?: string;
	subtitle?: string;
	icon?: ReactNode;
	action?: ReactNode;
	variant?: "default" | "bordered" | "elevated" | "gradient";
	className?: string;
}

export function Card({ 
	children, 
	title, 
	subtitle,
	icon,
	action,
	variant = "default",
	className = "" 
}: CardProps) {
	const variants = {
		default: "bg-white border border-gray-200",
		bordered: "bg-white border-2 border-purple-200",
		elevated: "bg-white shadow-xl",
		gradient: "bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100"
	};

	return (
		<div className={`card ${variants[variant]} ${className}`}>
			{(title || subtitle || icon || action) && (
				<div className="card-header">
					<div className="card-header-left">
						{icon && <div className="card-icon">{icon}</div>}
						<div>
							{title && <h3 className="card-title">{title}</h3>}
							{subtitle && <p className="card-subtitle">{subtitle}</p>}
						</div>
					</div>
					{action && <div className="card-action">{action}</div>}
				</div>
			)}
			<div className="card-body">
				{children}
			</div>

			<style jsx>{`
				.card {
					border-radius: 1rem;
					overflow: hidden;
					transition: all 0.3s ease;
				}

				.card:hover {
					transform: translateY(-2px);
				}

				.card-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 1.5rem;
					border-bottom: 1px solid #e5e7eb;
				}

				.card-header-left {
					display: flex;
					align-items: center;
					gap: 1rem;
				}

				.card-icon {
					font-size: 1.5rem;
				}

				.card-title {
					font-size: 1.25rem;
					font-weight: 700;
					color: #111827;
					margin: 0;
				}

				.card-subtitle {
					color: #6b7280;
					margin: 0.25rem 0 0 0;
				}

				.card-body {
					padding: 1.5rem;
				}
			`}</style>
		</div>
	);
}

// ============= Loading Skeleton =============
interface SkeletonProps {
	width?: string;
	height?: string;
	variant?: "text" | "circular" | "rectangular";
	animation?: "pulse" | "wave";
}

export function Skeleton({ 
	width = "100%", 
	height = "20px", 
	variant = "text",
	animation = "pulse" 
}: SkeletonProps) {
	const variants = {
		text: "rounded",
		circular: "rounded-full",
		rectangular: "rounded-lg"
	};

	return (
		<div 
			className={`skeleton ${variants[variant]} ${animation}`}
			style={{ width, height }}
		>
			<style jsx>{`
				.skeleton {
					background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
					background-size: 200% 100%;
				}

				.skeleton.pulse {
					animation: pulse 2s ease-in-out infinite;
				}

				.skeleton.wave {
					animation: wave 1.5s ease-in-out infinite;
				}

				@keyframes pulse {
					0% { opacity: 1; }
					50% { opacity: 0.4; }
					100% { opacity: 1; }
				}

				@keyframes wave {
					0% { background-position: 200% 0; }
					100% { background-position: -200% 0; }
				}
			`}</style>
		</div>
	);
}

// ============= Progress Bar =============
interface ProgressProps {
	value: number;
	max?: number;
	label?: string;
	showPercentage?: boolean;
	color?: "blue" | "green" | "purple" | "red";
	size?: "sm" | "md" | "lg";
	animated?: boolean;
}

export function Progress({ 
	value, 
	max = 100, 
	label,
	showPercentage = true,
	color = "blue",
	size = "md",
	animated = true
}: ProgressProps) {
	const percentage = Math.min((value / max) * 100, 100);

	const colors = {
		blue: "bg-gradient-to-r from-blue-500 to-blue-600",
		green: "bg-gradient-to-r from-green-500 to-green-600",
		purple: "bg-gradient-to-r from-purple-500 to-purple-600",
		red: "bg-gradient-to-r from-red-500 to-red-600"
	};

	const sizes = {
		sm: "h-2",
		md: "h-3",
		lg: "h-4"
	};

	return (
		<div className="progress-container">
			{(label || showPercentage) && (
				<div className="progress-header">
					{label && <span className="progress-label">{label}</span>}
					{showPercentage && <span className="progress-percentage">{Math.round(percentage)}%</span>}
				</div>
			)}
			<div className={`progress-bar ${sizes[size]}`}>
				<div 
					className={`progress-fill ${colors[color]} ${animated ? "animated" : ""}`}
					style={{ width: `${percentage}%` }}
				/>
			</div>

			<style jsx>{`
				.progress-container {
					width: 100%;
				}

				.progress-header {
					display: flex;
					justify-content: space-between;
					margin-bottom: 0.5rem;
				}

				.progress-label {
					font-size: 0.875rem;
					font-weight: 600;
					color: #374151;
				}

				.progress-percentage {
					font-size: 0.875rem;
					color: #6b7280;
				}

				.progress-bar {
					width: 100%;
					background-color: #e5e7eb;
					border-radius: 9999px;
					overflow: hidden;
				}

				.progress-fill {
					height: 100%;
					border-radius: 9999px;
					transition: width 0.5s ease;
				}

				.progress-fill.animated {
					position: relative;
					overflow: hidden;
				}

				.progress-fill.animated::after {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: linear-gradient(
						90deg,
						transparent,
						rgba(255, 255, 255, 0.3),
						transparent
					);
					animation: shimmer 2s infinite;
				}

				@keyframes shimmer {
					0% { transform: translateX(-100%); }
					100% { transform: translateX(100%); }
				}
			`}</style>
		</div>
	);
}

// ============= Badge Component =============
interface BadgeProps {
	children: ReactNode;
	variant?: "default" | "success" | "warning" | "danger" | "info";
	size?: "sm" | "md" | "lg";
	dot?: boolean;
}

export function Badge({ 
	children, 
	variant = "default",
	size = "md",
	dot = false
}: BadgeProps) {
	const variants = {
		default: "bg-gray-100 text-gray-800",
		success: "bg-green-100 text-green-800",
		warning: "bg-yellow-100 text-yellow-800",
		danger: "bg-red-100 text-red-800",
		info: "bg-blue-100 text-blue-800"
	};

	const sizes = {
		sm: "px-2 py-0.5 text-xs",
		md: "px-2.5 py-1 text-sm",
		lg: "px-3 py-1.5 text-base"
	};

	return (
		<span className={`badge ${variants[variant]} ${sizes[size]}`}>
			{dot && <span className="badge-dot"></span>}
			{children}

			<style jsx>{`
				.badge {
					display: inline-flex;
					align-items: center;
					gap: 0.25rem;
					border-radius: 9999px;
					font-weight: 600;
				}

				.badge-dot {
					width: 6px;
					height: 6px;
					border-radius: 50%;
					background-color: currentColor;
				}
			`}</style>
		</span>
	);
}

// ============= Modal Component =============
interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ 
	isOpen, 
	onClose, 
	title,
	children,
	size = "md"
}: ModalProps) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const sizes = {
		sm: "max-w-md",
		md: "max-w-lg",
		lg: "max-w-2xl",
		xl: "max-w-4xl"
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div 
				className={`modal-content ${sizes[size]}`}
				onClick={(e) => e.stopPropagation()}
			>
				{title && (
					<div className="modal-header">
						<h2 className="modal-title">{title}</h2>
						<button onClick={onClose} className="modal-close">
							✕
						</button>
					</div>
				)}
				<div className="modal-body">
					{children}
				</div>
			</div>

			<style jsx>{`
				.modal-overlay {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: rgba(0, 0, 0, 0.5);
					display: flex;
					align-items: center;
					justify-content: center;
					z-index: 1000;
					animation: fadeIn 0.3s ease;
				}

				.modal-content {
					background: white;
					border-radius: 1rem;
					width: 90%;
					max-height: 90vh;
					overflow-y: auto;
					animation: slideUp 0.3s ease;
				}

				.modal-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 1.5rem;
					border-bottom: 1px solid #e5e7eb;
				}

				.modal-title {
					font-size: 1.5rem;
					font-weight: 700;
					color: #111827;
					margin: 0;
				}

				.modal-close {
					background: none;
					border: none;
					font-size: 1.5rem;
					color: #6b7280;
					cursor: pointer;
					padding: 0;
					width: 32px;
					height: 32px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 0.375rem;
					transition: all 0.2s;
				}

				.modal-close:hover {
					background: #f3f4f6;
					color: #111827;
				}

				.modal-body {
					padding: 1.5rem;
				}

				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}

				@keyframes slideUp {
					from { 
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</div>
	);
}

// ============= Toast Notification =============
interface ToastProps {
	message: string;
	type?: "success" | "error" | "warning" | "info";
	duration?: number;
	onClose?: () => void;
}

export function Toast({ 
	message, 
	type = "info",
	duration = 3000,
	onClose
}: ToastProps) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			onClose?.();
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	if (!isVisible) return null;

	const types = {
		success: { bg: "bg-green-500", icon: "✓" },
		error: { bg: "bg-red-500", icon: "✕" },
		warning: { bg: "bg-yellow-500", icon: "⚠" },
		info: { bg: "bg-blue-500", icon: "ℹ" }
	};

	return (
		<div className={`toast ${types[type].bg}`}>
			<span className="toast-icon">{types[type].icon}</span>
			<span className="toast-message">{message}</span>
			<button onClick={() => setIsVisible(false)} className="toast-close">
				✕
			</button>

			<style jsx>{`
				.toast {
					position: fixed;
					bottom: 2rem;
					right: 2rem;
					display: flex;
					align-items: center;
					gap: 0.75rem;
					padding: 1rem 1.5rem;
					color: white;
					border-radius: 0.75rem;
					box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
					animation: slideIn 0.3s ease;
					z-index: 1001;
				}

				.toast-icon {
					font-size: 1.25rem;
				}

				.toast-message {
					flex: 1;
				}

				.toast-close {
					background: rgba(255, 255, 255, 0.2);
					border: none;
					color: white;
					width: 24px;
					height: 24px;
					border-radius: 50%;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					transition: background 0.2s;
				}

				.toast-close:hover {
					background: rgba(255, 255, 255, 0.3);
				}

				@keyframes slideIn {
					from {
						transform: translateX(100%);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}
			`}</style>
		</div>
	);
}

// ============= Tabs Component =============
interface TabsProps {
	tabs: { label: string; content: ReactNode }[];
	defaultTab?: number;
}

export function Tabs({ tabs, defaultTab = 0 }: TabsProps) {
	const [activeTab, setActiveTab] = useState(defaultTab);

	return (
		<div className="tabs-container">
			<div className="tabs-header">
				{tabs.map((tab, index) => (
					<button
						key={index}
						className={`tab-button ${activeTab === index ? "active" : ""}`}
						onClick={() => setActiveTab(index)}
					>
						{tab.label}
					</button>
				))}
				<div 
					className="tab-indicator"
					style={{
						width: `${100 / tabs.length}%`,
						transform: `translateX(${activeTab * 100}%)`
					}}
				/>
			</div>
			<div className="tab-content">
				{tabs[activeTab].content}
			</div>

			<style jsx>{`
				.tabs-container {
					width: 100%;
				}

				.tabs-header {
					display: flex;
					border-bottom: 2px solid #e5e7eb;
					position: relative;
				}

				.tab-button {
					flex: 1;
					padding: 1rem;
					background: none;
					border: none;
					font-weight: 600;
					color: #6b7280;
					cursor: pointer;
					transition: all 0.3s ease;
				}

				.tab-button:hover {
					color: #374151;
				}

				.tab-button.active {
					color: #667eea;
				}

				.tab-indicator {
					position: absolute;
					bottom: -2px;
					height: 2px;
					background: #667eea;
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				}

				.tab-content {
					padding: 1.5rem 0;
				}
			`}</style>
		</div>
	);
}