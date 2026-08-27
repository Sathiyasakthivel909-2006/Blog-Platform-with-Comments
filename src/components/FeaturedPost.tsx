import React from 'react';
import { Bookmark, Clock, Eye, Heart, MessageSquare, Sparkles } from 'lucide-react';
import { Post, User } from '../types';

interface FeaturedPostProps {
  post: Post;
  currentUser: User | null;
  onSelectPost: (post: Post) => void;
  onToggleLike: (e: React.MouseEvent, postId: string) => void;
  onToggleBookmark: (e: React.MouseEvent, postId: string) => void;
}

export const FeaturedPost: React.FC<FeaturedPostProps> = ({
  post,
  currentUser,
  onSelectPost,
  onToggleLike,
  onToggleBookmark,
}) => {
  const hasLiked = currentUser ? post.likedBy?.includes(currentUser.id) : false;
  const hasBookmarked = currentUser ? post.bookmarkedBy?.includes(currentUser.id) : false;

  return (
    <div
      onClick={() => onSelectPost(post)}
      className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0 mb-8"
    >
      {/* Cover Image Banner */}
      <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-slate-900">
        <img
          src={post.coverImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent lg:hidden" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-semibold backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Featured Story
          </span>
          <span className="px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-md">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content Meta */}
      <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
        <div>
          {/* Author info & Read time */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div>
                <p className="text-xs font-semibold text-slate-900 leading-none">{post.authorName}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title & Summary */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h2>
          <p className="text-sm text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
            {post.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer actions & metrics */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{post.views || 0}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span>{post.commentsCount || 0} comments</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleLike(e, post.id)}
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-medium ${
                hasLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
              title={hasLiked ? 'Liked' : 'Like post'}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{post.likes}</span>
            </button>

            <button
              onClick={(e) => onToggleBookmark(e, post.id)}
              className={`p-2 rounded-xl border transition ${
                hasBookmarked
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
              title={hasBookmarked ? 'Saved to Bookmarks' : 'Save bookmark'}
            >
              <Bookmark className={`w-4 h-4 ${hasBookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
