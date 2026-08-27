import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Play, 
  Copy, 
  Check, 
  Globe, 
  ArrowRight, 
  Server, 
  FileJson,
  CheckCircle2
} from 'lucide-react';

interface ApiExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EndpointDef {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  defaultPayload?: string;
  category: 'Posts' | 'Comments' | 'Auth' | 'System';
}

const ENDPOINTS: EndpointDef[] = [
  {
    method: 'GET',
    path: '/api/health',
    description: 'Check backend status, service version & entity counts',
    category: 'System',
  },
  {
    method: 'GET',
    path: '/api/posts',
    description: 'List posts with search, category, tag, author, and sort filters',
    category: 'Posts',
  },
  {
    method: 'GET',
    path: '/api/posts/post-1',
    description: 'Retrieve a single post by ID or slug and increment view count',
    category: 'Posts',
  },
  {
    method: 'GET',
    path: '/api/posts/post-1/comments',
    description: 'Fetch threaded discussion comments for a specific post',
    category: 'Comments',
  },
  {
    method: 'POST',
    path: '/api/posts/post-1/like',
    description: 'Toggle like state for the current authenticated user on a post',
    category: 'Posts',
  },
  {
    method: 'POST',
    path: '/api/posts/post-1/comments',
    description: 'Add a new comment or reply to a post',
    category: 'Comments',
    defaultPayload: JSON.stringify(
      {
        content: 'This REST API endpoint test is working seamlessly!',
        parentId: null,
      },
      null,
      2
    ),
  },
  {
    method: 'GET',
    path: '/api/categories',
    description: 'Fetch active category list and post counts',
    category: 'Posts',
  },
  {
    method: 'GET',
    path: '/api/stats',
    description: 'Aggregate platform metrics (views, posts, comments, likes)',
    category: 'System',
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    description: 'Authenticate user by email or quick userId switch',
    category: 'Auth',
    defaultPayload: JSON.stringify(
      {
        email: 'alex.rivera@example.com',
      },
      null,
      2
    ),
  },
  {
    method: 'GET',
    path: '/api/assignment/status',
    description: 'Inspect assignment requirements rubric and submission status',
    category: 'System',
  },
];

export const ApiExplorerModal: React.FC<ApiExplorerModalProps> = ({ isOpen, onClose }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [customPath, setCustomPath] = useState(ENDPOINTS[0].path);
  const [requestPayload, setRequestPayload] = useState(ENDPOINTS[0].defaultPayload || '');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSelectEndpoint = (ep: EndpointDef) => {
    setSelectedEndpoint(ep);
    setCustomPath(ep.path);
    setRequestPayload(ep.defaultPayload || '');
    setResponseStatus(null);
    setResponseData(null);
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseData(null);

    const token = localStorage.getItem('blog_auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method: selectedEndpoint.method,
      headers,
    };

    if (['POST', 'PUT'].includes(selectedEndpoint.method) && requestPayload.trim()) {
      options.body = requestPayload;
    }

    try {
      const start = performance.now();
      const res = await fetch(customPath, options);
      const duration = Math.round(performance.now() - start);

      setResponseStatus(res.status);

      const headerMap: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        headerMap[key] = val;
      });
      headerMap['x-response-time'] = `${duration}ms`;
      setResponseHeaders(headerMap);

      const json = await res.json().catch(() => ({ raw: 'Non-JSON response' }));
      setResponseData(JSON.stringify(json, null, 2));
    } catch (err: any) {
      setResponseStatus(500);
      setResponseData(JSON.stringify({ error: err.message || 'Network request error' }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'GET':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'POST':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'DELETE':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">RESTful API Explorer</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Express + Node.js Backend
                </span>
              </div>
              <p className="text-xs text-slate-500">Live request tester for backend REST endpoints</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Sidebar: Endpoint list */}
          <div className="lg:col-span-4 border-r border-slate-200 bg-slate-50/50 p-4 overflow-y-auto max-h-[40vh] lg:max-h-[75vh] space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Available REST Endpoints
            </p>

            {ENDPOINTS.map((ep, idx) => {
              const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition border flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-white border-blue-500 shadow-xs'
                      : 'bg-transparent hover:bg-white border-transparent text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getMethodBadge(ep.method)}`}>
                      {ep.method}
                    </span>
                    <span className="font-mono font-semibold text-slate-800 truncate text-[11px]">
                      {ep.path}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{ep.description}</p>
                </button>
              );
            })}
          </div>

          {/* Right Area: Request / Response Console */}
          <div className="lg:col-span-8 p-6 flex flex-col overflow-y-auto max-h-[75vh]">
            {/* Request bar */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold border ${getMethodBadge(selectedEndpoint.method)}`}>
                  {selectedEndpoint.method}
                </span>
                <input
                  type="text"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-100 focus:bg-white text-xs font-mono text-slate-900 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleExecute}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{loading ? 'Sending...' : 'Send Request'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-500">{selectedEndpoint.description}</p>
            </div>

            {/* Request Payload Editor (if POST/PUT) */}
            {['POST', 'PUT'].includes(selectedEndpoint.method) && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Request JSON Body
                </label>
                <textarea
                  rows={4}
                  value={requestPayload}
                  onChange={(e) => setRequestPayload(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none resize-y"
                />
              </div>
            )}

            {/* Response Console */}
            <div className="mt-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Response Payload
                  </span>
                  {responseStatus !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                        responseStatus >= 200 && responseStatus < 300
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      HTTP {responseStatus}
                    </span>
                  )}
                  {responseHeaders['x-response-time'] && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      {responseHeaders['x-response-time']}
                    </span>
                  )}
                </div>

                {responseData && (
                  <button
                    onClick={() => copyToClipboard(responseData)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 p-1 rounded-md"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                )}
              </div>

              <div className="flex-1 min-h-[220px] bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
                {loading ? (
                  <div className="flex items-center gap-2 text-slate-400 py-8">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    <span>Executing HTTP request against Express backend...</span>
                  </div>
                ) : responseData ? (
                  <pre className="whitespace-pre-wrap leading-relaxed">{responseData}</pre>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 py-12">
                    <FileJson className="w-8 h-8 mb-2 opacity-50" />
                    <p>Click "Send Request" to test this REST API endpoint</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
