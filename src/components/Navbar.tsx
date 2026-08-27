import React from 'react';
import { 
  BookOpen, 
  PenSquare, 
  Search, 
  User as UserIcon, 
  Code2, 
  CheckSquare2, 
  Sparkles, 
  LogOut, 
  Bookmark, 
  LayoutDashboard,
  X
} from 'lucide-react';
import { User, ViewMode } from '../types';

interface NavbarProps {
  currentUser: User | null;
  currentView: ViewMode;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onViewChange: (view: ViewMode) => void;
  onOpenCreatePost: () => void;
  onOpenAuth: () => void;
  onOpenAssignment: () => void;
  onOpenApiExplorer: () => void;
  onLogout: () => void;
  assignmentDueDays?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  searchQuery,
  onSearchChange,
  onViewChange,
  onOpenCreatePost,
  onOpenAuth,
  onOpenAssignment,
  onOpenApiExplorer,
  onLogout,
  assignmentDueDays = 10,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Main Navigation */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onViewChange('feed')}
              className="flex items-center gap-2.5 text-left group transition"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-lg tracking-tight block leading-tight">
                  DevPulse<span className="text-blue-600">.</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                  Blog Platform
                </span>
              </div>
            </button>

            {/* Assignment Status Pill Widget */}
            <button
              onClick={onOpenAssignment}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-xs font-semibold text-blue-700 transition group"
              title="View Assignment Brief & Progress"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Assignment #4</span>
              <span className="text-blue-400">•</span>
              <span className="bg-white px-2 py-0.5 rounded-full text-[11px] font-medium text-emerald-700 border border-emerald-200">
                {assignmentDueDays} Days Left
              </span>
            </button>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles, tags, authors, or topics..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-blue-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-2.5">
            {/* REST API Explorer Button */}
            <button
              onClick={onOpenApiExplorer}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition"
              title="Inspect & Test Backend REST APIs"
            >
              <Code2 className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">REST APIs</span>
            </button>

            {/* Assignment Button for Mobile/Tablet */}
            <button
              onClick={onOpenAssignment}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition"
            >
              <CheckSquare2 className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Rubric</span>
            </button>

            {/* Write New Post */}
            <button
              onClick={onOpenCreatePost}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm shadow-blue-500/20 transition cursor-pointer"
            >
              <PenSquare className="w-4 h-4" />
              <span>Write Post</span>
            </button>

            {/* User Profile / Auth */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <span className="hidden xl:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            onViewChange('dashboard');
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition text-left"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          My Articles & Drafts
                        </button>
                        <button
                          onClick={() => {
                            onViewChange('bookmarks');
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition text-left"
                        >
                          <Bookmark className="w-4 h-4 text-slate-400" />
                          Saved Bookmarks
                        </button>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            onOpenAuth();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition text-left"
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          Switch User Account
                        </button>
                        <button
                          onClick={() => {
                            onLogout();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                <UserIcon className="w-4 h-4 text-slate-500" />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles, tags, authors..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-slate-100 text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
