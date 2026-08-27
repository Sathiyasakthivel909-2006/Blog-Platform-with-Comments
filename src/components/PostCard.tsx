import React from 'react';
import { Bookmark, Clock, Eye, Heart, MessageSquare, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Post, User } from '../types';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onSelectPost: (post: Post) => void;
  onToggleLike: (e: React.MouseEvent, postId: string) => void;
  onToggleBookmark: (e: React.MouseEvent, postId: string) => void;
  onEditPost?: (post: Post) => void;
  onDeletePost?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onSelectPost,
  onToggleLike,
  onToggleBookmark,
  onEditPost,
  onDeletePost,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isAuthor = currentUser && currentUser.id === post.authorId;
  const hasLiked = currentUser ? post.likedBy?.includes(currentUser.id) : false;
  const hasBookmarked = currentUser ? post.bookmarkedBy?.includes(currentUser.id) : false;

  return (
    <div
      onClick={() => onSelectPost(post)}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={post.coverImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-slate-800 text-[11px] font-semibold backdrop-blur-md shadow-xs">
              {post.category}
            </span>
            {post.status === 'draft' && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/90 text-white text-[11px] font-semibold backdrop-blur-md">
                Draft
              </span>
            )}
          </div>

          {isAuthor && (
            <div className="absolute top-3 right-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white backdrop-blur-md shadow-xs transition"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                    }}
                  />
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in">
                    {onEditPost && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                          onEditPost(post);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition text-left"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                        Edit Post
                      </button>
                    )}
                    {onDeletePost && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                          onDeletePost(post);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Post Meta */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-400 font-medium">
            <span className="truncate">{post.authorName}</span>
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base line-clamp-2 leading-snug">
            {post.title}
          </h3>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {post.summary}
          </p>

          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" title="Views">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{post.views || 0}</span>
          </span>
          <span className="flex items-center gap-1" title="Comments">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>{post.commentsCount || 0}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => onToggleLike(e, post.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition ${
              hasLiked
                ? 'bg-rose-50 text-rose-600'
                : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
            <span>{post.likes}</span>
          </button>

          <button
            onClick={(e) => onToggleBookmark(e, post.id)}
            className={`p-1.5 rounded-lg transition ${
              hasBookmarked
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${hasBookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
