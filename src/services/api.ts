import { AssignmentData, CategoryCount, Comment, PlatformStats, Post, User } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('blog_auth_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export const api = {
  // Auth
  async getUsers(): Promise<{ users: User[] }> {
    const res = await fetch(`${API_BASE}/auth/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async login(emailOrId: { email?: string; userId?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailOrId),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('blog_auth_token', data.token);
    localStorage.setItem('blog_current_user', JSON.stringify(data.user));
    return data;
  },

  async register(userData: { name: string; email: string; avatar?: string; bio?: string; role?: 'author' | 'reader' }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration failed');
    }
    const data = await res.json();
    localStorage.setItem('blog_auth_token', data.token);
    localStorage.setItem('blog_current_user', JSON.stringify(data.user));
    return data;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  logout() {
    localStorage.removeItem('blog_auth_token');
    localStorage.removeItem('blog_current_user');
  },

  // Posts
  async getPosts(params?: {
    search?: string;
    category?: string;
    tag?: string;
    authorId?: string;
    status?: string;
    sort?: string;
  }): Promise<{ total: number; posts: Post[] }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.tag) query.append('tag', params.tag);
    if (params?.authorId) query.append('authorId', params.authorId);
    if (params?.status) query.append('status', params.status);
    if (params?.sort) query.append('sort', params.sort);

    const res = await fetch(`${API_BASE}/posts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async getPost(id: string): Promise<{ post: Post }> {
    const res = await fetch(`${API_BASE}/posts/${id}`);
    if (!res.ok) throw new Error('Post not found');
    return res.json();
  },

  async createPost(postData: Partial<Post>): Promise<{ post: Post }> {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(postData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create post' }));
      throw new Error(err.error || 'Failed to create post');
    }
    return res.json();
  },

  async updatePost(id: string, postData: Partial<Post>): Promise<{ post: Post }> {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(postData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update post' }));
      throw new Error(err.error || 'Failed to update post');
    }
    return res.json();
  },

  async deletePost(id: string): Promise<{ message: string; deletedPostId: string }> {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete post' }));
      throw new Error(err.error || 'Failed to delete post');
    }
    return res.json();
  },

  async toggleLikePost(id: string): Promise<{ likes: number; hasLiked: boolean; likedBy: string[] }> {
    const res = await fetch(`${API_BASE}/posts/${id}/like`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to like post' }));
      throw new Error(err.error || 'Failed to like post');
    }
    return res.json();
  },

  async toggleBookmarkPost(id: string): Promise<{ bookmarks: number; hasBookmarked: boolean; bookmarkedBy: string[] }> {
    const res = await fetch(`${API_BASE}/posts/${id}/bookmark`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to bookmark post' }));
      throw new Error(err.error || 'Failed to bookmark post');
    }
    return res.json();
  },

  // Comments
  async getComments(postId: string): Promise<{ total: number; comments: Comment[] }> {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },

  async addComment(postId: string, content: string, parentId?: string | null): Promise<{ comment: Comment }> {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ content, parentId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to add comment' }));
      throw new Error(err.error || 'Failed to add comment');
    }
    return res.json();
  },

  async deleteComment(postId: string, commentId: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete comment' }));
      throw new Error(err.error || 'Failed to delete comment');
    }
    return res.json();
  },

  async toggleLikeComment(postId: string, commentId: string): Promise<{ likes: number; hasLiked: boolean }> {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}/like`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to like comment' }));
      throw new Error(err.error || 'Failed to like comment');
    }
    return res.json();
  },

  // Meta & Stats
  async getCategories(): Promise<{ categories: CategoryCount[] }> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getStats(): Promise<PlatformStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Assignment
  async getAssignmentStatus(): Promise<AssignmentData> {
    const res = await fetch(`${API_BASE}/assignment/status`);
    if (!res.ok) throw new Error('Failed to fetch assignment status');
    return res.json();
  },

  async submitAssignment(studentNotes: string): Promise<{ message: string; submission: AssignmentData['submission'] }> {
    const res = await fetch(`${API_BASE}/assignment/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentNotes }),
    });
    if (!res.ok) throw new Error('Failed to submit assignment');
    return res.json();
  },
};
