export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: 'author' | 'reader';
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBio: string;
  readTime: string;
  status: 'published' | 'draft';
  likes: number;
  likedBy: string[];
  bookmarks: number;
  bookmarkedBy: string[];
  views: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string | null;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  updatedAt?: string;
  replies?: Comment[];
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface PlatformStats {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalAuthors: number;
}

export interface AssignmentData {
  assignmentNumber: number;
  title: string;
  description: string;
  dueDate: string;
  daysLeft: number;
  status: string;
  keyFeatures: {
    name: string;
    completed: boolean;
  }[];
  expectedOutcome: string;
  submission: {
    submitted: boolean;
    submittedAt: string | null;
    studentNotes: string;
    gradeStatus: string;
  };
}

export type ViewMode = 'feed' | 'post-detail' | 'dashboard' | 'bookmarks';
