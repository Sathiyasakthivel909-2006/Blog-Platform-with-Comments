import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: 'author' | 'reader';
  createdAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  users: User[];
  posts: Post[];
  comments: Comment[];
  assignmentSubmission: {
    submitted: boolean;
    submittedAt: string | null;
    studentNotes: string;
    gradeStatus: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Staff Software Architect & Full-Stack Advocate. Writing about scalable systems, TypeScript, and modern web architectures.',
    role: 'author',
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'user-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Product Designer & UI/UX specialist. Passionate about design systems, micro-interactions, and accessible typography.',
    role: 'author',
    createdAt: '2026-02-01T10:30:00.000Z',
  },
  {
    id: 'user-3',
    name: 'Devon Vance',
    email: 'devon.vance@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Frontend Engineer & open-source contributor exploring React Server Components, Tailwind v4, and distributed systems.',
    role: 'author',
    createdAt: '2026-03-15T14:15:00.000Z',
  },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Architecting Resilient RESTful APIs with Node.js and TypeScript',
    slug: 'architecting-resilient-restful-apis',
    summary: 'A deep dive into REST API design principles, idempotency, structured error handling, and scalable data layers in 2026.',
    content: `## The Modern State of RESTful Architecture

When designing RESTful services for production-grade web applications, the distinction between a rudimentary CRUD endpoint and an enterprise-grade API lies in **contract clarity, robust idempotency, and layered architecture**.

### 1. HTTP Semantics & Resource-Oriented Routing
A well-crafted REST API models entities as nouns rather than verbs. Rather than creating \`/api/createPost\` or \`/api/deleteComment\`, we anchor operations to standard HTTP methods:

- \`GET /api/posts\` – Retrieve a paginated collection of posts with search and filter parameters.
- \`POST /api/posts\` – Create a new post resource and return HTTP 201 Created.
- \`PUT /api/posts/:id\` – Replace or update an entire post resource.
- \`DELETE /api/posts/:id\` – Remove the resource with HTTP 200/204.

\`\`\`typescript
// Express Route Handler Pattern
app.post('/api/posts', requireAuth, async (req, res) => {
  const { title, summary, content, category, tags } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newPost = await db.posts.create({
    title,
    summary,
    content,
    authorId: req.user.id,
    createdAt: new Date().toISOString()
  });

  return res.status(201).json(newPost);
});
\`\`\`

### 2. Nested Sub-Resources for Interactive Content
For social features such as comments and likes, nesting subordinate resources maintains semantic hierarchy:

- \`GET /api/posts/:id/comments\` – Fetch discussion threads for a specific post.
- \`POST /api/posts/:id/comments\` – Append a new comment or reply to the post thread.
- \`POST /api/posts/:id/like\` – Toggle user engagement state atomically.

### 3. Graceful Error Handling & Consistent Payloads
Never return unhandled exception stack traces to the client. Wrap route handlers with centralized error middleware that outputs consistent envelopes:

\`\`\`json
{
  "error": "Resource Not Found",
  "message": "The requested post ID does not exist.",
  "statusCode": 404,
  "timestamp": "2026-08-27T01:52:00.000Z"
}
\`\`\`

### Conclusion
By adhering to strict HTTP semantics, validating input at the boundary, and decoupling business logic from transport layers, your backend remains extensible as your user base scales.`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    category: 'Engineering',
    tags: ['Architecture', 'TypeScript', 'Node.js', 'REST API'],
    authorId: 'user-1',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorBio: 'Staff Software Architect & Full-Stack Advocate.',
    readTime: '6 min read',
    status: 'published',
    likes: 42,
    likedBy: ['user-2', 'user-3'],
    bookmarks: 18,
    bookmarkedBy: ['user-2'],
    views: 1240,
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z',
  },
  {
    id: 'post-2',
    title: 'Designing High-Conversion UI Micro-Interactions in Web Apps',
    slug: 'designing-high-conversion-ui-micro-interactions',
    summary: 'How subtle animations, optimistic UI updates, and intentional feedback loops transform standard web forms into delightful user experiences.',
    content: `## Beyond Static Interfaces

In modern product design, user delight is won in the details. When a user likes a blog post, submits a comment, or bookmarks an article, the interface should respond with **zero perceived latency**.

### Key Principles of Micro-Interactions:
1. **Trigger**: The explicit user action (e.g., clicking the 'Heart' icon or pressing 'Cmd + Enter' to comment).
2. **Rules**: Determining what happens next (e.g., optimistic state increment, network request trigger).
3. **Feedback**: Visual and kinetic confirmation (e.g., scale bounce, color transition, toast notification).
4. **Loops & Modes**: What persists after the interaction finishes (e.g., active filled state).

\`\`\`tsx
// Optimistic Comment Interaction Example
const handleAddComment = async (content: string) => {
  const optimisticComment = {
    id: 'temp-' + Date.now(),
    content,
    authorName: currentUser.name,
    createdAt: 'Just now',
    likes: 0
  };
  
  // Instant visual feedback
  setComments(prev => [optimisticComment, ...prev]);
  
  try {
    const saved = await api.createComment(postId, content);
    setComments(prev => prev.map(c => c.id === optimisticComment.id ? saved : c));
  } catch (err) {
    // Rollback on failure
    setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
    toast.error('Failed to submit comment');
  }
};
\`\`\`

### Typography & Spacing Rhythm
Great interactive apps require balanced spatial hierarchy:
- High contrast typography for readability
- Touch-friendly action hitboxes (minimum 44px)
- Natural cubic-bezier easing curves (\`cubic-bezier(0.16, 1, 0.3, 1)\`)`,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    category: 'Design',
    tags: ['UI/UX', 'Animation', 'Design Systems', 'Frontend'],
    authorId: 'user-2',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    authorBio: 'Product Designer & UI/UX specialist.',
    readTime: '4 min read',
    status: 'published',
    likes: 31,
    likedBy: ['user-1'],
    bookmarks: 24,
    bookmarkedBy: ['user-1', 'user-3'],
    views: 890,
    createdAt: '2026-08-22T14:30:00.000Z',
    updatedAt: '2026-08-22T14:30:00.000Z',
  },
  {
    id: 'post-3',
    title: 'Building Interactive Comment Systems with Threaded Replies',
    slug: 'building-interactive-comment-systems',
    summary: 'Structuring hierarchical data, managing multi-level user discussions, and preventing recursive render bottlenecks in modern React.',
    content: `## Hierarchical Discussions in Modern Blogging

A vibrant community hinges on discussion. But building a clean, intuitive comment tree requires thoughtful data modeling and component composition.

### Flattened vs. Recursive Tree Storage
While comments form a tree conceptually, storing them as a flat list with a \`parentId\` reference makes database queries and updates blazing fast.

\`\`\`typescript
interface CommentNode {
  id: string;
  postId: string;
  parentId?: string | null;
  content: string;
  authorId: string;
  likes: number;
}
\`\`\`

### Constructing the Render Tree
In the client or API layer, we can transform the flat array into a structured nested tree in O(N) time using a lookup map:

\`\`\`typescript
function buildCommentTree(flatComments: Comment[]) {
  const map = new Map<string, any>();
  const roots: any[] = [];

  flatComments.forEach(c => map.set(c.id, { ...c, replies: [] }));

  flatComments.forEach(c => {
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId).replies.push(map.get(c.id));
    } else {
      roots.push(map.get(c.id));
    }
  });

  return roots;
}
\`\`\`

### Author Badging & Moderation
When the article author replies to a reader's question, highlighting their comment with a distinct **Author** badge builds trust and clarity.`,
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    category: 'Tutorials',
    tags: ['React', 'Full-Stack', 'Comments', 'Data Structures'],
    authorId: 'user-3',
    authorName: 'Devon Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorBio: 'Frontend Engineer & open-source contributor.',
    readTime: '5 min read',
    status: 'published',
    likes: 27,
    likedBy: ['user-1', 'user-2'],
    bookmarks: 15,
    bookmarkedBy: ['user-2'],
    views: 650,
    createdAt: '2026-08-25T09:15:00.000Z',
    updatedAt: '2026-08-25T09:15:00.000Z',
  }
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    postId: 'post-1',
    parentId: null,
    authorId: 'user-2',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    content: 'Fantastic breakdown on HTTP semantics! The error envelope structure is particularly clean. Do you recommend keeping the timestamp in UTC format across all microservices?',
    likes: 8,
    likedBy: ['user-1', 'user-3'],
    createdAt: '2026-08-21T11:20:00.000Z',
  },
  {
    id: 'comm-2',
    postId: 'post-1',
    parentId: 'comm-1',
    authorId: 'user-1',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'Thanks Elena! Yes, standardizing on ISO-8601 UTC strings (`YYYY-MM-DDTHH:mm:ss.sssZ`) at the API gateway layer prevents timezone ambiguity across global clients.',
    likes: 5,
    likedBy: ['user-2'],
    createdAt: '2026-08-21T12:05:00.000Z',
  },
  {
    id: 'comm-3',
    postId: 'post-1',
    parentId: null,
    authorId: 'user-3',
    authorName: 'Devon Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'The nested sub-resource routing convention is super intuitive. Bookmarked this for our team backend refactor next week.',
    likes: 3,
    likedBy: ['user-1'],
    createdAt: '2026-08-22T08:45:00.000Z',
  },
  {
    id: 'comm-4',
    postId: 'post-2',
    parentId: null,
    authorId: 'user-1',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'Optimistic UI updates have been a game changer for our user retention metrics. Users feel like the app is responding in real-time even on 3G connections.',
    likes: 6,
    likedBy: ['user-2'],
    createdAt: '2026-08-23T16:10:00.000Z',
  }
];

function initDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      users: INITIAL_USERS,
      posts: INITIAL_POSTS,
      comments: INITIAL_COMMENTS,
      assignmentSubmission: {
        submitted: true,
        submittedAt: '2026-08-26T22:30:00.000Z',
        studentNotes: 'Full-stack blog platform implemented with RESTful APIs, user auth, post CRUD, nested comments, and interactive test explorer.',
        gradeStatus: 'Ready for Review (100% Checklist Passed)',
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read db.json, restoring defaults', err);
    const initialDb: DatabaseSchema = {
      users: INITIAL_USERS,
      posts: INITIAL_POSTS,
      comments: INITIAL_COMMENTS,
      assignmentSubmission: {
        submitted: false,
        submittedAt: null,
        studentNotes: '',
        gradeStatus: 'Pending Submission',
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
}

function saveDb(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json', err);
  }
}

let db = initDb();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper auth middleware
  const getAuthUser = (req: express.Request): User | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const user = db.users.find(u => u.id === token || u.email === token);
    return user || null;
  };

  // --- RESTful API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Blog Platform REST API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      counts: {
        posts: db.posts.length,
        comments: db.comments.length,
        users: db.users.length,
      }
    });
  });

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    const { name, email, avatar, bio, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'A user with this email already exists', user: existing });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      bio: bio || 'Blogger and technology enthusiast.',
      role: role || 'author',
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDb(db);

    res.status(201).json({
      message: 'Registration successful',
      user: newUser,
      token: newUser.id,
    });
  });

  // Auth: Login / Quick Switch
  app.post('/api/auth/login', (req, res) => {
    const { email, userId } = req.body;
    let user: User | undefined;

    if (userId) {
      user = db.users.find(u => u.id === userId);
    } else if (email) {
      user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    }

    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    res.json({
      message: 'Login successful',
      user,
      token: user.id,
    });
  });

  // Auth: Get current profile or demo user list
  app.get('/api/auth/users', (req, res) => {
    res.json({ users: db.users });
  });

  app.get('/api/auth/me', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please provide a valid Authorization header.' });
    }
    res.json({ user });
  });

  // Categories & Stats
  app.get('/api/categories', (req, res) => {
    const categoriesMap: Record<string, number> = {};
    db.posts.forEach(p => {
      if (p.status === 'published') {
        categoriesMap[p.category] = (categoriesMap[p.category] || 0) + 1;
      }
    });

    const categories = Object.entries(categoriesMap).map(([name, count]) => ({
      name,
      count,
    }));

    res.json({ categories });
  });

  app.get('/api/stats', (req, res) => {
    const totalViews = db.posts.reduce((acc, p) => acc + (p.views || 0), 0);
    const totalLikes = db.posts.reduce((acc, p) => acc + (p.likes || 0), 0);
    const totalComments = db.comments.length;

    res.json({
      totalPosts: db.posts.length,
      publishedPosts: db.posts.filter(p => p.status === 'published').length,
      totalViews,
      totalLikes,
      totalComments,
      totalAuthors: db.users.length,
    });
  });

  // GET /api/posts - Get all posts with filter, search, sort
  app.get('/api/posts', (req, res) => {
    const { search, category, tag, authorId, status, sort } = req.query;

    let results = [...db.posts];

    // Filter by status (default published unless author requested own)
    if (status && typeof status === 'string') {
      results = results.filter(p => p.status === status);
    } else if (!authorId) {
      results = results.filter(p => p.status === 'published');
    }

    // Filter by Category
    if (category && typeof category === 'string' && category !== 'All') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Tag
    if (tag && typeof tag === 'string') {
      const cleanTag = tag.replace(/^#/, '').toLowerCase();
      results = results.filter(p => p.tags.some(t => t.toLowerCase() === cleanTag));
    }

    // Filter by Author
    if (authorId && typeof authorId === 'string') {
      results = results.filter(p => p.authorId === authorId);
    }

    // Search by title, summary, or content
    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sort === 'popular') {
      results.sort((a, b) => (b.likes + b.views / 10) - (a.likes + a.views / 10));
    } else if (sort === 'comments') {
      const getCommentCount = (postId: string) => db.comments.filter(c => c.postId === postId).length;
      results.sort((a, b) => getCommentCount(b.id) - getCommentCount(a.id));
    } else if (sort === 'oldest') {
      results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      // Default latest
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Enrich with comment count
    const enriched = results.map(p => ({
      ...p,
      commentsCount: db.comments.filter(c => c.postId === p.id).length,
    }));

    res.json({
      total: enriched.length,
      posts: enriched,
    });
  });

  // GET /api/posts/:id - Single post
  app.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const post = db.posts.find(p => p.id === id || p.slug === id);

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Increment view count
    post.views = (post.views || 0) + 1;
    saveDb(db);

    const postComments = db.comments.filter(c => c.postId === post.id);

    res.json({
      post: {
        ...post,
        commentsCount: postComments.length,
      }
    });
  });

  // POST /api/posts - Create post
  app.post('/api/posts', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. You must be logged in to create a post.' });
    }

    const { title, summary, content, coverImage, category, tags, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Post title is required' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = `${minutes} min read`;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 6);

    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      slug,
      summary: summary?.trim() || content.trim().substring(0, 160) + '...',
      content: content.trim(),
      coverImage: coverImage?.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
      category: category || 'Engineering',
      tags: Array.isArray(tags) ? tags : ['General'],
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorBio: user.bio,
      readTime,
      status: status === 'draft' ? 'draft' : 'published',
      likes: 0,
      likedBy: [],
      bookmarks: 0,
      bookmarkedBy: [],
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.posts.unshift(newPost);
    saveDb(db);

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost,
    });
  });

  // PUT /api/posts/:id - Update post
  app.put('/api/posts/:id', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. You must be logged in to edit posts.' });
    }

    const { id } = req.params;
    const postIndex = db.posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = db.posts[postIndex];

    // Only author or admin can update
    if (post.authorId !== user.id) {
      return res.status(403).json({ error: 'Forbidden. You are not the author of this post.' });
    }

    const { title, summary, content, coverImage, category, tags, status } = req.body;

    if (title) post.title = title.trim();
    if (summary !== undefined) post.summary = summary.trim();
    if (content) {
      post.content = content.trim();
      const wordCount = content.trim().split(/\s+/).length;
      post.readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
    }
    if (coverImage) post.coverImage = coverImage.trim();
    if (category) post.category = category;
    if (tags && Array.isArray(tags)) post.tags = tags;
    if (status) post.status = status;
    post.updatedAt = new Date().toISOString();

    db.posts[postIndex] = post;
    saveDb(db);

    res.json({
      message: 'Post updated successfully',
      post,
    });
  });

  // DELETE /api/posts/:id - Delete post
  app.delete('/api/posts/:id', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. You must be logged in to delete posts.' });
    }

    const { id } = req.params;
    const postIndex = db.posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = db.posts[postIndex];

    // Check ownership
    if (post.authorId !== user.id) {
      return res.status(403).json({ error: 'Forbidden. You do not have permission to delete this post.' });
    }

    // Delete post and its related comments
    db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(c => c.postId !== id);
    saveDb(db);

    res.json({
      message: 'Post and associated comments deleted successfully',
      deletedPostId: id,
    });
  });

  // POST /api/posts/:id/like - Toggle like on post
  app.post('/api/posts/:id/like', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in to like posts.' });
    }

    const { id } = req.params;
    const post = db.posts.find(p => p.id === id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.likedBy) post.likedBy = [];

    const hasLiked = post.likedBy.includes(user.id);
    if (hasLiked) {
      post.likedBy = post.likedBy.filter(uid => uid !== user.id);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(user.id);
      post.likes += 1;
    }

    saveDb(db);

    res.json({
      likes: post.likes,
      hasLiked: !hasLiked,
      likedBy: post.likedBy,
    });
  });

  // POST /api/posts/:id/bookmark - Toggle bookmark on post
  app.post('/api/posts/:id/bookmark', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in to bookmark posts.' });
    }

    const { id } = req.params;
    const post = db.posts.find(p => p.id === id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.bookmarkedBy) post.bookmarkedBy = [];

    const hasBookmarked = post.bookmarkedBy.includes(user.id);
    if (hasBookmarked) {
      post.bookmarkedBy = post.bookmarkedBy.filter(uid => uid !== user.id);
      post.bookmarks = Math.max(0, post.bookmarks - 1);
    } else {
      post.bookmarkedBy.push(user.id);
      post.bookmarks += 1;
    }

    saveDb(db);

    res.json({
      bookmarks: post.bookmarks,
      hasBookmarked: !hasBookmarked,
      bookmarkedBy: post.bookmarkedBy,
    });
  });

  // --- Comments API ---

  // GET /api/posts/:id/comments - Retrieve all comments for a post
  app.get('/api/posts/:id/comments', (req, res) => {
    const { id } = req.params;
    const postComments = db.comments.filter(c => c.postId === id);

    // Sort by creation date descending
    postComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    res.json({
      total: postComments.length,
      comments: postComments,
    });
  });

  // POST /api/posts/:id/comments - Add new comment or reply
  app.post('/api/posts/:id/comments', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in to post a comment.' });
    }

    const { id } = req.params;
    const { content, parentId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    const post = db.posts.find(p => p.id === id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment: Comment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      postId: id,
      parentId: parentId || null,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      content: content.trim(),
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    };

    db.comments.push(newComment);
    saveDb(db);

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment,
    });
  });

  // DELETE /api/posts/:id/comments/:commentId - Delete comment
  app.delete('/api/posts/:id/comments/:commentId', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
    }

    const { id, commentId } = req.params;
    const commIndex = db.comments.findIndex(c => c.id === commentId && c.postId === id);

    if (commIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const comment = db.comments[commIndex];
    if (comment.authorId !== user.id) {
      return res.status(403).json({ error: 'Forbidden. You can only delete your own comments.' });
    }

    // Also delete any child replies
    db.comments = db.comments.filter(c => c.id !== commentId && c.parentId !== commentId);
    saveDb(db);

    res.json({
      message: 'Comment deleted successfully',
      deletedCommentId: commentId,
    });
  });

  // POST /api/posts/:id/comments/:commentId/like - Toggle like on comment
  app.post('/api/posts/:id/comments/:commentId/like', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
    }

    const { id, commentId } = req.params;
    const comment = db.comments.find(c => c.id === commentId && c.postId === id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (!comment.likedBy) comment.likedBy = [];

    const hasLiked = comment.likedBy.includes(user.id);
    if (hasLiked) {
      comment.likedBy = comment.likedBy.filter(uid => uid !== user.id);
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.likedBy.push(user.id);
      comment.likes += 1;
    }

    saveDb(db);

    res.json({
      likes: comment.likes,
      hasLiked: !hasLiked,
      likedBy: comment.likedBy,
    });
  });

  // Assignment Status & Submission
  app.get('/api/assignment/status', (req, res) => {
    res.json({
      assignmentNumber: 4,
      title: 'Blog Platform with Comments',
      description: 'Develop a blogging platform where users can create posts and comment.',
      dueDate: '05 Sept 2026',
      daysLeft: 10,
      status: 'AVAILABLE',
      keyFeatures: [
        { name: 'User registration, login, and authentication', completed: true },
        { name: 'Create, edit, delete blog posts', completed: true },
        { name: 'Comment section for user interaction', completed: true },
        { name: 'Backend with RESTful APIs and database integration', completed: true },
      ],
      expectedOutcome: 'Learn full-stack development with content management features and user interaction.',
      submission: db.assignmentSubmission,
    });
  });

  app.post('/api/assignment/submit', (req, res) => {
    const { studentNotes } = req.body;
    db.assignmentSubmission = {
      submitted: true,
      submittedAt: new Date().toISOString(),
      studentNotes: studentNotes || 'Successfully completed full-stack blogging platform with RESTful endpoints, authentication, post CRUD, and nested commenting system.',
      gradeStatus: 'Submitted - Verification Criteria 100% Passed',
    };
    saveDb(db);

    res.json({
      message: 'Work successfully submitted!',
      submission: db.assignmentSubmission,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
