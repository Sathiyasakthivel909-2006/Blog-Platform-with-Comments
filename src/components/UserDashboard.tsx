import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Clock, 
  Eye, 
  FileText, 
  Heart, 
  MessageSquare, 
  PenSquare, 
  Plus, 
  Trash2, 
  Edit3,
  Sparkles
} from 'lucide-react';
import { Post, User } from '../types';
import { PostCard } from './PostCard';

interface UserDashboardProps {
  currentUser: User | null;
  posts: Post[];
  bookmarkedPosts: Post[];
  onBack: () => void;
  onSelectPost: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (post: Post) => void;
  onToggleLike: (e: React.MouseEvent, postId: string) => void;
  onToggleBookmark: (e: React.MouseEvent, postId: string) => void;
  onOpenCreatePost: () => void;
  initialTab?: 'articles' | 'drafts' | 'bookmarks';
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  posts,
  bookmarkedPosts,
  onBack,
  onSelectPost,
  onEditPost,
  onDeletePost,
  onToggleLike,
  onToggleBookmark,
  onOpenCreatePost,
  initialTab = 'articles',
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'drafts' | 'bookmarks'>(initialTab);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-sm font-semibold text-slate-600 mb-4">Please sign in to view your dashboard.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const myPublished = posts.filter((p) => p.authorId === currentUser.id && p.status === 'published');
  const myDrafts = posts.filter((p) => p.authorId === currentUser.id && p.status === 'draft');
  const myTotalViews = myPublished.reduce((acc, p) => acc + (p.views || 0), 0);
  const myTotalLikes = myPublished.reduce((acc, p) => acc + (p.likes || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <button
          onClick={onOpenCreatePost}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Author Profile Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{currentUser.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                  {currentUser.role === 'author' ? 'Verified Author' : 'Reader'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">{currentUser.bio}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Account Email: <span className="font-mono text-slate-600">{currentUser.email}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <div className="flex-1 sm:flex-none p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-center min-w-[90px]">
              <p className="text-lg font-black text-slate-900">{myPublished.length}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Articles</p>
            </div>
            <div className="flex-1 sm:flex-none p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-center min-w-[90px]">
              <p className="text-lg font-black text-slate-900">{myTotalViews}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Views</p>
            </div>
            <div className="flex-1 sm:flex-none p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-center min-w-[90px]">
              <p className="text-lg font-black text-slate-900">{myTotalLikes}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Likes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'articles'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Published Articles ({myPublished.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'drafts'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Drafts ({myDrafts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'bookmarks'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmarks ({bookmarkedPosts.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'articles' && (
        myPublished.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No published articles yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Share your insights, code architecture, or tutorials with the DevPulse community.
            </p>
            <button
              onClick={onOpenCreatePost}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Write First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPublished.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onSelectPost={onSelectPost}
                onToggleLike={onToggleLike}
                onToggleBookmark={onToggleBookmark}
                onEditPost={onEditPost}
                onDeletePost={onDeletePost}
              />
            ))}
          </div>
        )
      )}

      {activeTab === 'drafts' && (
        myDrafts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <Edit3 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No saved drafts</h3>
            <p className="text-xs text-slate-500 mt-1">Draft articles will appear here before publication.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myDrafts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onSelectPost={onSelectPost}
                onToggleLike={onToggleLike}
                onToggleBookmark={onToggleBookmark}
                onEditPost={onEditPost}
                onDeletePost={onDeletePost}
              />
            ))}
          </div>
        )
      )}

      {activeTab === 'bookmarks' && (
        bookmarkedPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No saved bookmarks</h3>
            <p className="text-xs text-slate-500 mt-1">Click the bookmark icon on any article to save it for later reading.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onSelectPost={onSelectPost}
                onToggleLike={onToggleLike}
                onToggleBookmark={onToggleBookmark}
                onEditPost={onEditPost}
                onDeletePost={onDeletePost}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};
