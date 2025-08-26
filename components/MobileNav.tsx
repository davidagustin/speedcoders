export function MobileNav() {
  return (
    <div className="md:hidden">
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex justify-around p-2">
          <a href="/dashboard" className="p-2">
            <span className="text-xs">Dashboard</span>
          </a>
          <a href="/quiz" className="p-2">
            <span className="text-xs">Quiz</span>
          </a>
          <a href="/practice" className="p-2">
            <span className="text-xs">Practice</span>
          </a>
        </div>
      </nav>
    </div>
  );
}