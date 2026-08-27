import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, 
  Bookmark, 
  Clock, 
  Edit3, 
  Heart, 
  Share2, 
  Trash2, 
  UserCheck, 
  Eye,
  Check,
  Tag
} from 'lucide-react';
import { Comment, Post, User } from '../types';
import { CommentSection } from './CommentSection';

interface PostDetailProps {
  post: Post;
  comments: Comment[];
  currentUser: User | null;
  onBack: () => void;
  onToggleLike: (e: React.MouseEvent, postId: string) => void;
  onToggleBookmark: (e: React.MouseEvent, postId: string) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (post: Post) => void;
  onAddComment: (content: string, parentId?: string | null) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onLikeComment: (commentId: string) => Promise<void>;
  onOpenAuth: () => void;
  onFilterTag?: (tag: string) => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({
  post,
  comments,
  currentUser,
  onBack,
  onToggleLike,
  onToggleBookmark,
  onEditPost,
  onDeletePost,
  onAddComment,
  onDeleteComment,
  onLikeComment,
  onOpenAuth,
  onFilterTag,
}) => {
  const [copied, setCopied] = useState(false);
  const isAuthor = currentUser && currentUser.id === post.authorId;
  const hasLiked = currentUser ? post.likedBy?.includes(currentUser.id) : false;
  const hasBookmarked = currentUser ? post.bookmarkedBy?.includes(currentUser.id) : false;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top navigation back button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>

        {/* Author management buttons */}
        {isAuthor && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditPost(post)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Article</span>
            </button>
            <button
              onClick={() => onDeletePost(post)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Header Section */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            {post.category}
          </span>
          <span className="text-slate-400 text-xs">•</span>
          <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {post.readTime}
          </span>
          <span className="text-slate-400 text-xs">•</span>
          <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            {post.views} views
          </span>
          {post.status === 'draft' && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
              Draft Preview
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {post.summary}
        </p>

        {/* Author box */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{post.authorName}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                  Author
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 max-w-md line-clamp-1">{post.authorBio}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Published on {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Social action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleLike(e, post.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                hasLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{post.likes}</span>
            </button>

            <button
              onClick={(e) => onToggleBookmark(e, post.id)}
              className={`p-2 rounded-xl text-xs font-semibold transition border ${
                hasBookmarked
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
              title="Bookmark article"
            >
              <Bookmark className={`w-4 h-4 ${hasBookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition"
              title="Share article link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="rounded-3xl overflow-hidden mb-10 border border-slate-200 max-h-[480px] bg-slate-900">
          <img
            src={post.coverImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover max-h-[480px]"
          />
        </div>
      )}

      {/* Main Formatted Markdown Content */}
      <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-code:text-blue-600 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-2xl prose-img:rounded-2xl">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Tags section */}
      <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-2">
          <Tag className="w-3.5 h-3.5" /> Topics:
        </span>
        {post.tags.map((tag, idx) => (
          <button
            key={idx}
            onClick={() => onFilterTag && onFilterTag(tag)}
            className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200/60 px-3 py-1 rounded-xl transition cursor-pointer"
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Interactive Comments Section */}
      <CommentSection
        postId={post.id}
        postAuthorId={post.authorId}
        comments={comments}
        currentUser={currentUser}
        onAddComment={onAddComment}
        onDeleteComment={onDeleteComment}
        onLikeComment={onLikeComment}
        onOpenAuth={onOpenAuth}
      />
    </article>
  );
};
