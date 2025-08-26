'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CodeBracketIcon,
  StarIcon,
  ChartBarIcon,
  ClockIcon,
  CommandLineIcon,
  LanguageIcon,
  CpuChipIcon,
  AcademicCapIcon,
  ComputerDesktopIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, badge: null },
  { name: 'LeetCode', href: '/leetcode', icon: CodeBracketIcon, badge: 'Hot' },
  { name: 'Problem Browser', href: '/problems', icon: StarIcon, badge: 'New' },
  { name: 'Code Playground', href: '/playground', icon: CodeBracketIcon, badge: 'New' },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, badge: 'New' },
  { name: 'Study Timer', href: '/timer', icon: ClockIcon, badge: 'New' },
  { name: 'Regex Trainer', href: '/regex', icon: CommandLineIcon, badge: null },
  { name: 'Language Tricks', href: '/languages', icon: LanguageIcon, badge: null },
  { name: 'System Design', href: '/system-design', icon: CpuChipIcon, badge: 'New' },
  { name: 'Learning Paths', href: '/learning-paths', icon: AcademicCapIcon, badge: null },
  { name: 'Frontend Tricks', href: '/frontend', icon: ComputerDesktopIcon, badge: null },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <h1 className="text-xl font-bold text-gray-900">SpeedCoders</h1>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={`
                                  group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                                  ${pathname === item.href
                                    ? 'bg-gray-50 text-blue-600'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                  }
                                `}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <item.icon
                                  className={`h-6 w-6 shrink-0 ${
                                    pathname === item.href ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                                  }`}
                                  aria-hidden="true"
                                />
                                <span className="flex items-center gap-2">
                                  {item.name}
                                  {item.badge && (
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                      item.badge === 'New' ? 'bg-green-100 text-green-800' :
                                      item.badge === 'Hot' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {item.badge}
                                    </span>
                                  )}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FireIcon className="h-6 w-6 text-red-500" />
              SpeedCoders
            </h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                          ${pathname === item.href
                            ? 'bg-gray-50 text-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            pathname === item.href ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="flex items-center gap-2">
                          {item.name}
                          {item.badge && (
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              item.badge === 'New' ? 'bg-green-100 text-green-800' :
                              item.badge === 'Hot' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <SparklesIcon className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-900">YOLO Mode</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    🔥 Maximum chaos, no restrictions! Problems are randomly generated for maximum fun and learning.
                  </p>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          SpeedCoders
        </div>
      </div>
    </>
  );
}
