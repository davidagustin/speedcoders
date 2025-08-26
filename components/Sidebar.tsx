'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { 
  HomeIcon, 
  CodeBracketIcon, 
  CommandLineIcon, 
  LanguageIcon, 
  CpuChipIcon, 
  AcademicCapIcon, 
  ComputerDesktopIcon, 
  ChartBarIcon, 
  Cog6ToothIcon, 
  BookOpenIcon, 
  FireIcon, 
  StarIcon,
  TrophyIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, badge: null },
    { name: 'Problem Browser', href: '/problems', icon: StarIcon, badge: 'New' },
    { name: 'LeetCode', href: '/leetcode', icon: CodeBracketIcon, badge: 'Hot' },
    { name: 'Quizzes', href: '/quiz', icon: ChartBarIcon, badge: null },
    { name: 'Progress', href: '/progress', icon: ChartBarIcon, badge: null },
    { name: 'Leaderboard', href: '/leaderboard', icon: TrophyIcon, badge: null },
    { name: 'Achievements', href: '/achievements', icon: StarIcon, badge: null },
    { name: 'Regex Trainer', href: '/regex', icon: CommandLineIcon, badge: null },
    { name: 'Language Tricks', href: '/languages', icon: LanguageIcon, badge: null },
    { name: 'System Design', href: '/system-design', icon: CpuChipIcon, badge: null },
    { name: 'Learning Paths', href: '/learning-paths', icon: AcademicCapIcon, badge: null },
    { name: 'Frontend Tricks', href: '/frontend', icon: ComputerDesktopIcon, badge: null },
  ];

  const quickActions = [
    { name: 'Start Quiz', href: '/quiz/enhanced', icon: FireIcon },
    { name: 'View Progress', href: '/progress', icon: ChartBarIcon },
    { name: 'Browse Problems', href: '/problems', icon: StarIcon },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 lg:bg-white dark:bg-slate-900 lg:border-r lg:border-gray-200 dark:border-slate-700 transition-all duration-300 ${
      isCollapsed ? 'lg:w-16' : 'lg:w-64'
    }`}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">SpeedCoders</h1>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="px-2 py-4 border-t border-gray-200 dark:border-slate-700">
            <h3 className="px-2 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white rounded-lg transition-colors"
                >
                  <action.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span>{action.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-gray-600 dark:text-slate-400" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}