"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { ExternalLink, Trash2, Calendar } from "lucide-react";

interface LinkItem {
  _id: string;
  title: string;
  link: string;
  tags: string[];
  createdAt: string;
}

const Linkcard = ({ link, onLinkDeleted }: { link: LinkItem; onLinkDeleted: (id: string) => void }) => {
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.post("/api/links/delete-link", { link_id: id });
      if (res.data.success) {
        toast({ title: "Link deleted", description: "Successfully removed." });
      }
      onLinkDeleted(id);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data.message ?? "Failed to delete link",
        variant: "destructive",
      });
    }
  };

  const displayUrl = (() => {
    try {
      const url = new URL(link.link);
      const path = url.pathname !== '/' ? url.pathname : '';
      const trimmed = (url.hostname + path).slice(0, 45);
      return trimmed + ((url.hostname + path).length > 45 ? '…' : '');
    } catch {
      return link.link.slice(0, 45) + (link.link.length > 45 ? '…' : '');
    }
  })();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="group bg-white/[0.03] border border-white/[0.07] hover:border-violet-500/25 rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-black/30"
    >
      {/* Title */}
      <h2 className="text-white font-semibold text-base leading-snug line-clamp-2">
        {link.title || displayUrl}
      </h2>

      {/* URL */}
      <a
        href={link.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-violet-400/80 hover:text-violet-300 text-sm transition-colors min-w-0"
      >
        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">{displayUrl}</span>
      </a>

      {/* Tags */}
      {link.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {link.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 mt-auto">
        <span className="flex items-center gap-1.5 text-xs text-slate-600">
          <Calendar className="w-3 h-3" />
          {new Date(link.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="p-1.5 rounded-lg text-slate-700 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
              <Trash2 className="w-4 h-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-slate-900 border-white/[0.08] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete this link?</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400">
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/[0.05] border-white/[0.08] text-slate-300 hover:bg-white/[0.1] hover:text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(link._id)}
                className="bg-red-500/90 hover:bg-red-500 text-white border-0"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
};

export default Linkcard;
