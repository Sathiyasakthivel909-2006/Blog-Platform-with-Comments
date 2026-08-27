import React, { useEffect, useState, useTransition } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Filter, 
  Flame, 
  Layers, 
  MessageSquare, 
  PenSquare, 
  RefreshCw, 
  Sparkles, 
  TrendingUp, 
  X,
  Code2,
  Calendar,
  Send
} from 'lucide-react';
import { AssignmentData, CategoryCount, Comment, PlatformStats, Post, User, ViewMode } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { FeaturedPost } from './components/FeaturedPost';
import { PostCard } from './components/PostCard';
import { PostDetail } from './components/PostDetail';
import { PostEditorModal } from './components/PostEditorModal';
import { AuthModal } from './components/AuthModal';
import { AssignmentModal } from './components/AssignmentModal';
import { ApiExplorerModal } from './components/ApiExplorerModal';
import { UserDashboard } from './components/UserDashboard';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(null);

  // View state
  const [currentView, setCurrentView] = useState<ViewMode>('feed');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPostComments, setSelectedPostComments] = useState<Comment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [isApiExplorerOpen, setIsApiExplorerOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Data Fetch
  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        // Fetch users
        const { users } = await api.getUsers();
        setAvailableUsers(users);

        // Check if there's a stored user or default to first author
        const storedUser = localStorage.getItem('blog_current_user');
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch {
            if (users.length > 0) {
              setCurrentUser(users[0]);
              localStorage.setItem('blog_auth_token', users[0].id);
              localStorage.setItem('blog_current_user', JSON.stringify(users[0]));
            }
          }
        } else if (users.length > 0) {
          setCurrentUser(users[0]);
          localStorage.setItem('blog_auth_token', users[0].id);
          localStorage.setItem('blog_current_user', JSON.stringify(users[0]));
        }

        // Fetch posts & meta
        await refreshFeed();
        const catsData = await api.getCategories();
        setCategories(catsData.categories);
        const statsData = await api.getStats();
        setStats(statsData);
        const assignData = await api.getAssignmentStatus();
        setAssignmentData(assignData);
      } catch (err) {
        console.error('Failed to initialize app:', err);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  // Refresh feed when filters change
  const refreshFeed = async () => {
    try {
      const data = await api.getPosts({
        search: searchQuery,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        tag: selectedTag || undefined,
        sort: sortBy,
      });
      setPosts(data.posts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  useEffect(() => {
    refreshFeed();
  }, [selectedCategory, selectedTag, searchQuery, sortBy]);

  // Handle Post Selection
  const handleSelectPost = async (post: Post) => {
    try {
      const { post: detailed } = await api.getPost(post.id);
      const { comments } = await api.getComments(post.id);
      setSelectedPost(detailed);
      setSelectedPostComments(comments);
      setCurrentView('post-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      addToast('error', 'Failed to load post details');
    }
  };

  // Toggle Like on Post
  const handleToggleLike = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    try {
      const result = await api.toggleLikePost(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likes: result.likes, likedBy: result.likedBy }
            : p
        )
      );

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost((prev) => (prev ? { ...prev, likes: result.likes, likedBy: result.likedBy } : null));
      }

      addToast(result.hasLiked ? 'success' : 'info', result.hasLiked ? 'Liked post' : 'Unliked post');
    } catch (err: any) {
      addToast('error', 'Error', err.message);
    }
  };

  // Toggle Bookmark on Post
  const handleToggleBookmark = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    try {
      const result = await api.toggleBookmarkPost(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, bookmarks: result.bookmarks, bookmarkedBy: result.bookmarkedBy }
            : p
        )
      );

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost((prev) =>
          prev ? { ...prev, bookmarks: result.bookmarks, bookmarkedBy: result.bookmarkedBy } : null
        );
      }

      addToast(
        result.hasBookmarked ? 'success' : 'info',
        result.hasBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks'
      );
    } catch (err: any) {
      addToast('error', 'Error', err.message);
    }
  };

  // Create or Update Post
  const handleSavePost = async (postData: Partial<Post>) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    try {
      if (editingPost) {
        const { post: updated } = await api.updatePost(editingPost.id, postData);
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        if (selectedPost?.id === updated.id) {
          setSelectedPost(updated);
        }
        addToast('success', 'Article updated successfully!');
      } else {
        const { post: created } = await api.createPost(postData);
        setPosts((prev) => [created, ...prev]);
        addToast('success', 'Article published successfully!');
      }
      setIsEditorOpen(false);
      setEditingPost(null);
      // Refresh categories & stats
      const [cats, statsData] = await Promise.all([api.getCategories(), api.getStats()]);
      setCategories(cats.categories);
      setStats(statsData);
    } catch (err: any) {
      addToast('error', 'Failed to save post', err.message);
      throw err;
    }
  };

  // Delete Post
  const handleDeletePost = async (post: Post) => {
    if (!window.confirm(`Are you sure you want to delete "${post.title}"?`)) return;

    try {
      await api.deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      if (selectedPost?.id === post.id) {
        setSelectedPost(null);
        setCurrentView('feed');
      }
      addToast('success', 'Article deleted successfully');
      const [cats, statsData] = await Promise.all([api.getCategories(), api.getStats()]);
      setCategories(cats.categories);
      setStats(statsData);
    } catch (err: any) {
      addToast('error', 'Failed to delete post', err.message);
    }
  };

  // Add Comment or Reply
  const handleAddComment = async (content: string, parentId?: string | null) => {
    if (!selectedPost) return;
    try {
      const { comment } = await api.addComment(selectedPost.id, content, parentId);
      setSelectedPostComments((prev) => [comment, ...prev]);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPost.id
            ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
            : p
        )
      );
      addToast('success', parentId ? 'Reply posted!' : 'Comment posted!');
    } catch (err: any) {
      addToast('error', 'Failed to post comment', err.message);
      throw err;
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId: string) => {
    if (!selectedPost) return;
    try {
      await api.deleteComment(selectedPost.id, commentId);
      setSelectedPostComments((prev) => prev.filter((c) => c.id !== commentId && c.parentId !== commentId));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPost.id
            ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 1) - 1) }
            : p
        )
      );
      addToast('success', 'Comment removed');
    } catch (err: any) {
      addToast('error', 'Failed to delete comment', err.message);
    }
  };

  // Like Comment
  const handleLikeComment = async (commentId: string) => {
    if (!selectedPost) return;
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    try {
      const { likes, hasLiked } = await api.toggleLikeComment(selectedPost.id, commentId);
      setSelectedPostComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            const likedBy = c.likedBy || [];
            return {
              ...c,
              likes,
              likedBy: hasLiked ? [...likedBy, currentUser.id] : likedBy.filter((u) => u !== currentUser.id),
            };
          }
          return c;
        })
      );
    } catch (err: any) {
      addToast('error', 'Failed to like comment', err.message);
    }
  };

  // Auth Handlers
  const handleLogin = async (emailOrId: { email?: string; userId?: string }) => {
    try {
      const { user } = await api.login(emailOrId);
      setCurrentUser(user);
      addToast('success', `Welcome back, ${user.name}!`);
    } catch (err: any) {
      addToast('error', 'Login failed', err.message);
      throw err;
    }
  };

  const handleRegister = async (userData: { name: string; email: string; avatar?: string; bio?: string; role?: 'author' | 'reader' }) => {
    try {
      const { user } = await api.register(userData);
      setCurrentUser(user);
      setAvailableUsers((prev) => [...prev, user]);
      addToast('success', `Account created! Welcome, ${user.name}`);
    } catch (err: any) {
      addToast('error', 'Registration failed', err.message);
      throw err;
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    addToast('info', 'Signed out successfully');
  };

  // Assignment Submit Handler
  const handleSubmitAssignment = async (notes: string) => {
    try {
      const res = await api.submitAssignment(notes);
      setAssignmentData((prev) => (prev ? { ...prev, submission: res.submission } : null));
      addToast('success', 'Assignment Submitted Successfully!', 'All 4 key features verified green');
    } catch (err: any) {
      addToast('error', 'Submission failed', err.message);
      throw err;
    }
  };

  const bookmarkedPosts = posts.filter((p) => currentUser && p.bookmarkedBy?.includes(currentUser.id));
  const featuredPost = posts.find((p) => p.status === 'published');
  const feedPosts = posts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewChange={(v) => {
          setCurrentView(v);
          if (v === 'feed') setSelectedPost(null);
        }}
        onOpenCreatePost={() => {
          if (!currentUser) {
            setIsAuthOpen(true);
            return;
          }
          setEditingPost(null);
          setIsEditorOpen(true);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAssignment={() => setIsAssignmentOpen(true)}
        onOpenApiExplorer={() => setIsApiExplorerOpen(true)}
        onLogout={handleLogout}
        assignmentDueDays={assignmentData?.daysLeft || 10}
      />

      {/* Main Content Areas based on currentView */}
      <main className="flex-1">
        {currentView === 'post-detail' && selectedPost ? (
          <PostDetail
            post={selectedPost}
            comments={selectedPostComments}
            currentUser={currentUser}
            onBack={() => {
              setCurrentView('feed');
              setSelectedPost(null);
            }}
            onToggleLike={handleToggleLike}
            onToggleBookmark={handleToggleBookmark}
            onEditPost={(p) => {
              setEditingPost(p);
              setIsEditorOpen(true);
            }}
            onDeletePost={handleDeletePost}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onLikeComment={handleLikeComment}
            onOpenAuth={() => setIsAuthOpen(true)}
            onFilterTag={(t) => {
              setSelectedTag(t);
              setCurrentView('feed');
              setSelectedPost(null);
            }}
          />
        ) : currentView === 'dashboard' || currentView === 'bookmarks' ? (
          <UserDashboard
            currentUser={currentUser}
            posts={posts}
            bookmarkedPosts={bookmarkedPosts}
            initialTab={currentView === 'bookmarks' ? 'bookmarks' : 'articles'}
            onBack={() => setCurrentView('feed')}
            onSelectPost={handleSelectPost}
            onEditPost={(p) => {
              setEditingPost(p);
              setIsEditorOpen(true);
            }}
            onDeletePost={handleDeletePost}
            onToggleLike={handleToggleLike}
            onToggleBookmark={handleToggleBookmark}
            onOpenCreatePost={() => {
              setEditingPost(null);
              setIsEditorOpen(true);
            }}
          />
        ) : (
          /* Main Feed View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Assignment Brief Banner (matching the user's prompt card) */}
            <div className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl text-white shrink-0">
                  4
                </div>
                <div>
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
                      AVAILABLE
                    </span>
                    <span className="text-white/80 text-xs font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-200" /> Due: 05 Sept 2026
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 text-[11px] font-extrabold">
                      10 Days Left
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    Blog Platform with Comments
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl">
                    Develop a blogging platform where users can create posts and comment. Features full RESTful backend & user auth.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setIsApiExplorerOpen(true)}
                  className="flex-1 md:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl text-xs font-bold border border-white/20 transition flex items-center justify-center gap-1.5"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Test APIs</span>
                </button>

                <button
                  onClick={() => setIsAssignmentOpen(true)}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-black/10 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Submit Work</span>
                </button>
              </div>
            </div>

            {/* Category Filter Chips & Sort Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedTag(null);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition shrink-0 cursor-pointer ${
                    selectedCategory === 'All' && !selectedTag
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  All Topics
                </button>

                {categories.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedCategory(c.name);
                      setSelectedTag(null);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      selectedCategory === c.name && !selectedTag
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === c.name ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {c.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Sort selector & active tag indicator */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {selectedTag && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
                    <span>Tag: #{selectedTag}</span>
                    <button onClick={() => setSelectedTag(null)} className="hover:text-rose-600 p-0.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="latest">Latest</option>
                    <option value="popular">Most Popular</option>
                    <option value="comments">Most Commented</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Featured Post (Only show if no search/filter active and posts exist) */}
            {!searchQuery && !selectedTag && selectedCategory === 'All' && featuredPost && (
              <FeaturedPost
                post={featuredPost}
                currentUser={currentUser}
                onSelectPost={handleSelectPost}
                onToggleLike={handleToggleLike}
                onToggleBookmark={handleToggleBookmark}
              />
            )}

            {/* Posts Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>
                    {searchQuery
                      ? `Search results for "${searchQuery}" (${posts.length})`
                      : selectedCategory !== 'All'
                      ? `${selectedCategory} Articles (${posts.length})`
                      : 'Recent Community Articles'}
                  </span>
                </h3>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                  <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-base">No articles found</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try adjusting your search terms or filter criteria, or write a new article!
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedTag(null);
                    }}
                    className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-xl transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {feedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onSelectPost={handleSelectPost}
                      onToggleLike={handleToggleLike}
                      onToggleBookmark={handleToggleBookmark}
                      onEditPost={(p) => {
                        setEditingPost(p);
                        setIsEditorOpen(true);
                      }}
                      onDeletePost={handleDeletePost}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">DevPulse. Blog Platform</span>
            <span>•</span>
            <span>Assignment #4: Blog Platform with Comments</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsApiExplorerOpen(true)} className="hover:text-blue-600 font-medium">
              REST APIs
            </button>
            <button onClick={() => setIsAssignmentOpen(true)} className="hover:text-blue-600 font-medium">
              Assignment Rubric
            </button>
            <span>Due Date: 05 Sept 2026</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PostEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingPost(null);
        }}
        onSave={handleSavePost}
        initialData={editingPost}
        currentUser={currentUser}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        availableUsers={availableUsers}
        currentUser={currentUser}
      />

      <AssignmentModal
        isOpen={isAssignmentOpen}
        onClose={() => setIsAssignmentOpen(false)}
        assignmentData={assignmentData}
        onSubmitWork={handleSubmitAssignment}
        onOpenApiExplorer={() => setIsApiExplorerOpen(true)}
      />

      <ApiExplorerModal
        isOpen={isApiExplorerOpen}
        onClose={() => setIsApiExplorerOpen(false)}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
