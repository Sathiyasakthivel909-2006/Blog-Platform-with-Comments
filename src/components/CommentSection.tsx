import React, { useState } from 'react';
import { 
  CornerDownRight, 
  Heart, 
  MessageSquare, 
  Send, 
  Trash2, 
  UserCheck, 
  X, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Comment, User } from '../types';

interface CommentSectionProps {
  postId: string;
  postAuthorId: string;
  comments: Comment[];
  currentUser: User | null;
  onAddComment: (content: string, parentId?: string | null) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onLikeComment: (commentId: string) => Promise<void>;
  onOpenAuth: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId: _postId,
  postAuthorId,
  comments,
  currentUser,
  onAddComment,
  onDeleteComment,
  onLikeComment,
  onOpenAuth,
}) => {
  const [rootContent, setRootContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group comments into root comments and replies
  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  const handleSubmitRoot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootContent.trim()) return;
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddComment(rootContent.trim(), null);
      setRootContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddComment(replyContent.trim(), parentId);
      setReplyContent('');
      setReplyingToId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCommentItem = (comment: Comment, isReply = false) => {
    const isPostAuthor = comment.authorId === postAuthorId;
    const isOwnComment = currentUser && currentUser.id === comment.authorId;
    const hasLiked = currentUser ? comment.likedBy?.includes(currentUser.id) : false;
    const replies = getReplies(comment.id);

    return (
      <div
        key={comment.id}
        className={`group relative ${
          isReply ? 'ml-6 sm:ml-10 mt-3 pt-3 border-t border-slate-100' : 'bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80 mb-4'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={comment.authorAvatar}
              alt={comment.authorName}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-900">{comment.authorName}</span>
                {isPostAuthor && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold">
                    <UserCheck className="w-2.5 h-2.5" /> Author
                  </span>
                )}
                {isOwnComment && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-medium">
                    You
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Delete action for author */}
          {isOwnComment && (
            <button
              onClick={() => onDeleteComment(comment.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded-md transition"
              title="Delete comment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Comment Body */}
        <p className="text-xs sm:text-sm text-slate-700 mt-2.5 leading-relaxed whitespace-pre-line">
          {comment.content}
        </p>

        {/* Actions bar (Like & Reply) */}
        <div className="flex items-center gap-3 mt-3 pt-2">
          <button
            onClick={() => onLikeComment(comment.id)}
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition ${
              hasLiked ? 'text-rose-600 bg-rose-50' : 'text-slate-500 hover:bg-slate-200/60'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
            <span>{comment.likes || 0}</span>
          </button>

          {!isReply && (
            <button
              onClick={() => {
                if (replyingToId === comment.id) {
                  setReplyingToId(null);
                } else {
                  setReplyingToId(comment.id);
                  setReplyContent('');
                }
              }}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-slate-200/60 transition"
            >
              <CornerDownRight className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          )}
        </div>

        {/* Inline Reply Composer */}
        {replyingToId === comment.id && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                Replying to <span className="font-semibold text-slate-700">@{comment.authorName}</span>
              </span>
              <button
                onClick={() => setReplyingToId(null)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={currentUser ? "Write your reply..." : "Sign in to reply..."}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReply(comment.id);
                  }
                }}
                disabled={!currentUser}
                className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={() => handleSubmitReply(comment.id)}
                disabled={isSubmitting || !replyContent.trim()}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition"
              >
                <Send className="w-3 h-3" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {replies.length > 0 && (
          <div className="space-y-1">
            {replies.map((reply) => renderCommentItem(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Discussion</h3>
            <p className="text-xs text-slate-500">{comments.length} interactive thoughts & replies</p>
          </div>
        </div>

        {!currentUser && (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition"
          >
            <Sparkles className="w-3.5 h-3.5" /> Sign in to post
          </button>
        )}
      </div>

      {/* Main Comment Box */}
      <form onSubmit={handleSubmitRoot} className="mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-start gap-3">
          {currentUser ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
          )}

          <div className="flex-1">
            <textarea
              rows={3}
              placeholder={
                currentUser
                  ? `Share your perspective or ask a question as ${currentUser.name}...`
                  : 'Join the discussion. Sign in to write a comment...'
              }
              value={rootContent}
              onChange={(e) => setRootContent(e.target.value)}
              className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-0 focus:ring-0 p-0 resize-none focus:outline-none"
            />

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                Markdown supported
              </span>

              <div className="flex items-center gap-2">
                {currentUser ? (
                  <button
                    type="submit"
                    disabled={isSubmitting || !rootContent.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <span>Sign In to Comment</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Comment List */}
      {rootComments.length === 0 ? (
        <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No comments yet</p>
          <p className="text-xs text-slate-400 mt-1">Be the first to start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rootComments.map((c) => renderCommentItem(c))}
        </div>
      )}
    </section>
  );
};
