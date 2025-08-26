"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Toast } from "@/components/ui/UIComponents";

interface ToastMessage {
	id: string;
	message: string;
	type: "success" | "error" | "warning" | "info";
	duration?: number;
}

interface ToastContextType {
	showToast: (message: string, type?: ToastMessage["type"], duration?: number) => void;
	showSuccess: (message: string) => void;
	showError: (message: string) => void;
	showWarning: (message: string) => void;
	showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts(prev => prev.filter(toast => toast.id !== id));
	}, []);

	const showToast = useCallback((
		message: string, 
		type: ToastMessage["type"] = "info", 
		duration = 3000
	) => {
		const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
		const newToast: ToastMessage = { id, message, type, duration };
		
		setToasts(prev => [...prev, newToast]);
		
		setTimeout(() => {
			removeToast(id);
		}, duration);
	}, [removeToast]);

	const showSuccess = useCallback((message: string) => {
		showToast(message, "success");
	}, [showToast]);

	const showError = useCallback((message: string) => {
		showToast(message, "error", 5000); // Longer duration for errors
	}, [showToast]);

	const showWarning = useCallback((message: string) => {
		showToast(message, "warning", 4000);
	}, [showToast]);

	const showInfo = useCallback((message: string) => {
		showToast(message, "info");
	}, [showToast]);

	const value: ToastContextType = {
		showToast,
		showSuccess,
		showError,
		showWarning,
		showInfo,
	};

	return (
		<ToastContext.Provider value={value}>
			{children}
			<div className="toast-container">
				{toasts.map(toast => (
					<Toast
						key={toast.id}
						message={toast.message}
						type={toast.type}
						duration={toast.duration}
						onClose={() => removeToast(toast.id)}
					/>
				))}
			</div>

			<style jsx>{`
				.toast-container {
					position: fixed;
					bottom: 2rem;
					right: 2rem;
					display: flex;
					flex-direction: column;
					gap: 1rem;
					z-index: 1080;
					pointer-events: none;
				}

				.toast-container :global(.toast) {
					pointer-events: auto;
				}

				@media (max-width: 640px) {
					.toast-container {
						bottom: 1rem;
						right: 1rem;
						left: 1rem;
					}
				}
			`}</style>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}