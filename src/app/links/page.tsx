"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Linkcard from "@/components/Linkcard";
import { Search, Loader2, BookmarkX, ChevronLeft, ChevronRight } from "lucide-react";

interface Link {
  _id: string;
  title: string;
  link: string;
  tags: string[];
  createdAt: string;
}

const GetLinksPage = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `/api/links/get-links?page=${page}&filter=${debouncedSearch}`
        );
        setLinks(response.data.data);
      } catch {
        setError("Failed to fetch links. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, [page, debouncedSearch]);

  const handleDelete = (id: string) => {
    setLinks((prev) => prev.filter((link) => link._id !== id));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-4 sm:px-6 lg:px-8 py-10">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[600px] h-[400px] bg-violet-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">My Links</h1>
          <p className="text-slate-500 text-sm">All your saved bookmarks in one place</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            type="text"
            placeholder="Search by title or tags..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all text-sm"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-slate-500">
            <Loader2 className="animate-spin w-5 h-5" />
            <span className="text-sm">Loading your links...</span>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : links.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center mb-4">
              <BookmarkX className="w-7 h-7 text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium mb-1">No links found</p>
            <p className="text-slate-600 text-sm">
              {search ? "Try a different search term" : "Save your first link from the home page"}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {links.map((link, i) => (
                <motion.div
                  key={link._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Linkcard link={link} onLinkDeleted={handleDelete} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-sm text-slate-600 px-2 tabular-nums">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={links.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GetLinksPage;
