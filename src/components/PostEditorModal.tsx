import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  X, 
  Eye, 
  Edit3, 
  Bold, 
  Italic, 
  Code, 
  Quote, 
  Heading2, 
  List, 
  Image as ImageIcon, 
  Check, 
  Sparkles,
  Save
} from 'lucide-react';
import { Post, User } from '../types';

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (postData: Partial<Post>) => Promise<void>;
  initialData?: Post | null;
  currentUser: User | null;
}

const CATEGORIES = [
  'Engineering',
  'Design',
  'Architecture',
  'Tutorials',
  'AI & ML',
  'Career',
  'DevOps',
];

const PRESET_COVERS = [
  {
    name: 'Coding Desk',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Design Gradient',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Team Collaboration',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Workspace Minimal',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Abstract Neural',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  },
];

export const PostEditorModal: React.FC<PostEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  currentUser: _currentUser,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || 'Engineering');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || PRESET_COVERS[0].url);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags || ['TypeScript', 'FullStack']);
  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status || 'published');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSummary(initialData.summary);
      setContent(initialData.content);
      setCategory(initialData.category);
      setCoverImage(initialData.coverImage);
      setTags(initialData.tags);
      setStatus(initialData.status);
    } else {
      setTitle('');
      setSummary('');
      setContent(
`## Introduction

Write your compelling story or technical tutorial here.

### Key Highlights
- Feature 1: Intuitive RESTful architecture
- Feature 2: High-performance optimistic feedback

\`\`\`typescript
// Sample snippet
function greet(name: string): string {
  return \`Welcome to DevPulse, \${name}!\`;
}
\`\`\`

### Summary
Wrap up your key thoughts here.`
      );
      setCategory('Engineering');
      setCoverImage(PRESET_COVERS[0].url);
      setTags(['TypeScript', 'FullStack']);
      setStatus('published');
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const insertMarkdown = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('post-content-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || 'text';
    const replacement = `${prefix}${selected}${suffix}`;

    setContent(content.substring(0, start) + replacement + content.substring(end));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for your blog post.');
      return;
    }
    if (!content.trim()) {
      setError('Please add content to your blog post.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        title: title.trim(),
        summary: summary.trim() || content.trim().substring(0, 160) + '...',
        content: content.trim(),
        category,
        coverImage,
        tags: tags.length > 0 ? tags : ['General'],
        status,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {initialData ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h3>
              <p className="text-xs text-slate-500">Draft, format, and publish with markdown support</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700 flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {/* Title & Summary */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Scaling Microservices with Node.js and TypeScript"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 focus:bg-white text-slate-900 font-semibold text-base rounded-2xl border border-slate-200 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Brief Summary / Subtitle
              </label>
              <input
                type="text"
                placeholder="A concise 1-2 sentence overview of your post..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 focus:bg-white text-slate-700 text-sm rounded-2xl border border-slate-200 focus:border-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Category, Status, Cover Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium rounded-2xl border border-slate-200 focus:border-blue-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Publication Status
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`flex-1 py-2 px-3 rounded-2xl text-xs font-semibold border transition ${
                    status === 'published'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  ✓ Published
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`flex-1 py-2 px-3 rounded-2xl text-xs font-semibold border transition ${
                    status === 'draft'
                      ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  ✎ Save Draft
                </button>
              </div>
            </div>
          </div>

          {/* Cover Image Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Cover Image</span>
              <span className="text-[11px] font-normal text-slate-400">Choose preset or enter URL</span>
            </label>
            <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
              {PRESET_COVERS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCoverImage(preset.url)}
                  className={`shrink-0 relative rounded-xl overflow-hidden h-14 w-24 border-2 transition ${
                    coverImage === preset.url ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  {coverImage === preset.url && (
                    <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Or paste custom image URL (https://...)"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-50 focus:bg-white text-xs text-slate-700 rounded-2xl border border-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tags / Keywords
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-xl"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-600 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Add tag (e.g. React, Node, WebDev)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-xl"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Content Editor / Preview Tabs & Markdown toolbar */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    activeTab === 'write' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    activeTab === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
              </div>

              {activeTab === 'write' && (
                <div className="flex items-center gap-1 text-slate-500">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('## ')}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                    title="Heading 2"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('\n```typescript\n', '\n```\n')}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                    title="Code Block"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('> ')}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                    title="Quote"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('- ')}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"
                    title="Bullet List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {activeTab === 'write' ? (
              <textarea
                id="post-content-area"
                rows={10}
                required
                placeholder="Write your article body in Markdown..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full mt-3 p-4 bg-slate-50 focus:bg-white text-xs sm:text-sm font-mono text-slate-800 rounded-2xl border border-slate-200 focus:border-blue-500 focus:outline-none resize-y"
              />
            ) : (
              <div className="mt-3 p-6 bg-slate-50/50 rounded-2xl border border-slate-200 min-h-[250px] max-h-[350px] overflow-y-auto prose prose-slate prose-sm max-w-none">
                <ReactMarkdown>{content || '*No content to preview yet.*'}</ReactMarkdown>
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : initialData ? 'Update Post' : 'Publish Article'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
