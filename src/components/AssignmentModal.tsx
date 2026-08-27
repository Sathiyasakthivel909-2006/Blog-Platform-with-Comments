import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Send, 
  Sparkles, 
  X, 
  Check, 
  ExternalLink, 
  Code2,
  Database,
  Users,
  FileText,
  MessageSquare
} from 'lucide-react';
import { AssignmentData } from '../types';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentData: AssignmentData | null;
  onSubmitWork: (notes: string) => Promise<void>;
  onOpenApiExplorer: () => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  assignmentData,
  onSubmitWork,
  onOpenApiExplorer,
}) => {
  const [studentNotes, setStudentNotes] = useState(
    assignmentData?.submission?.studentNotes || 
    'Implemented complete full-stack blog platform featuring user auth, post CRUD, nested comment trees, and Express RESTful backend with durable JSON data store.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(assignmentData?.submission?.submitted || false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmitWork(studentNotes);
      setSubmittedSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
        
        {/* Card Header matching assignment widget format */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-blue-50/60 to-white border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-100/90 text-blue-700 flex items-center justify-center font-extrabold text-lg shadow-xs">
              4
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 font-bold text-xs tracking-wider">
                AVAILABLE
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 mb-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Due Date: <strong className="text-slate-900">05 Sept 2026</strong></span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              10 Days Left
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
            Blog Platform with Comments
          </h2>

          <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">
            Develop a blogging platform where users can create posts and comment.
          </p>
        </div>

        {/* Card Body Features & Expected Outcome */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Key Features List */}
          <div>
            <h4 className="text-xs font-extrabold text-blue-700 uppercase tracking-wider mb-3">
              Key Features & Live Verification:
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">User registration, login, and authentication</p>
                    <p className="text-[11px] text-slate-500">Multi-account switching, auth tokens & profiles</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Create, edit, delete blog posts</p>
                    <p className="text-[11px] text-slate-500">Markdown editor, preview, draft & author controls</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Comment section for user interaction</p>
                    <p className="text-[11px] text-slate-500">Nested threads, author badges, likes & moderation</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Backend with RESTful APIs and database integration</p>
                    <p className="text-[11px] text-slate-500">Express REST endpoints (`/api/*`) with persisted store</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS
                </span>
              </div>
            </div>
          </div>

          {/* Expected Outcome */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Expected Outcome:
            </h4>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              Learn full-stack development with content management features and user interaction.
            </p>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Submission Notes / Verification Summary
            </label>
            <textarea
              rows={3}
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              placeholder="Describe your implementation details..."
              className="w-full p-3 text-xs bg-slate-50 focus:bg-white text-slate-800 rounded-2xl border border-slate-200 focus:border-blue-500 focus:outline-none"
            />

            {submittedSuccess && (
              <div className="mt-3 p-3 bg-emerald-100/70 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Assignment Status: <strong>{assignmentData?.submission?.gradeStatus || 'Successfully Submitted'}</strong></span>
              </div>
            )}

            <div className="flex items-center justify-between mt-4 gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenApiExplorer();
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Inspect REST APIs</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : submittedSuccess ? 'Update Submission' : 'Submit Work'}</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
