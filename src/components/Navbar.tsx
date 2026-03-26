'use client'

import Link from 'next/link';
import React, { useState } from 'react';
import { Menu, X, Bookmark } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setAuthenticated } from '@/lib/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const res = await axios.get('/api/logout');
    if (res.data.success) {
      router.push('/');
      dispatch(setAuthenticated(false));
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-500/30">
              <Bookmark className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              SaveLink
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/links"
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
            >
              My Links
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-black/60 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            >
              Home
            </Link>
            <Link
              href="/links"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            >
              My Links
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
