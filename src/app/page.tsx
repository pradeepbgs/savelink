'use client'

import { Loader2, Link as LinkIcon, LogIn, Tag, Bookmark, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/types";
import { setAuthenticated } from "@/lib/authSlice";

export default function Home() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(!isLoggedIn);
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const { toast } = useToast();
  const dispatch = useDispatch();

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);
    try {
      const response = await axios.get('/api/check-auth', { withCredentials: true });
      dispatch(setAuthenticated(response.data.isAuthenticated));
    } catch {
      dispatch(setAuthenticated(false));
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleSaveLink = async () => {
    if (!isLoggedIn || !link) return;
    setIsLoading(true);
    try {
      const res = await axios.post('/api/links/save', {
        link,
        title: title || undefined,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined
      }, { withCredentials: true });
      setLink('');
      setTitle('');
      setTags('');
      toast({ title: 'Saved!', description: res.data.message });
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      checkAuthStatus();
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  return (
    <main className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 overflow-hidden bg-slate-950">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-6 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Personal link vault
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4 leading-[1.1]">
            <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Save links,
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              stay organized
            </span>
          </h1>
          <p className="text-slate-500 text-base">
            Bookmark anything, find it instantly.
          </p>
        </div>

        {/* Main content area */}
        {isCheckingAuth ? (
          <div className="flex items-center justify-center gap-3 text-slate-500 py-8">
            <Loader2 className="animate-spin w-5 h-5" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : isLoggedIn ? (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 backdrop-blur-sm shadow-2xl shadow-black/40">
            <p className="text-xs font-semibold text-slate-100 uppercase tracking-wider mb-5">Quick Save</p>

            {/* URL */}
            <div className="relative mb-3">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveLink()}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.07] text-white placeholder:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all text-sm"
                placeholder="https://example.com"
              />
            </div>

            {/* Title */}
            <div className="mb-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.07] text-white placeholder:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all text-sm"
                placeholder="Title (optional)"
              />
            </div>

            {/* Tags */}
            <div className="relative mb-5">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.07] text-white placeholder:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all text-sm"
                placeholder="Tags, separated by commas (optional)"
              />
            </div>

            <button
              onClick={handleSaveLink}
              disabled={isLoading || !link}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : 'Save Link'}
            </button>

            <div className="mt-4 pt-4 border-t border-white/[0.05] flex justify-center">
              <Link
                href="/links"
                className="text-sm text-slate-300 hover:text-violet-400 transition-colors flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                View all saved links
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 backdrop-blur-sm text-center shadow-2xl shadow-black/40">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
              <Bookmark className="w-7 h-7 text-violet-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Get started</h2>
            <p className="text-slate-500 text-sm mb-6">Sign in to start saving and organizing your links</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all duration-200 shadow-lg shadow-violet-500/20 active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <div className="mt-4">
              <Link href="/signup" className="text-sm text-slate-600 hover:text-violet-400 transition-colors">
                No account? Sign up free
              </Link>
            </div>
          </div>
        )}
      </div>

      <footer className="absolute bottom-6 text-center text-slate-700 text-xs">
        &copy; {new Date().getFullYear()} SaveLink. All rights reserved.
      </footer>
    </main>
  );
}
