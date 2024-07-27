'use client'

import { Loader2, Link as LinkIcon, LogIn, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);
    try {
      const response = await axios.get('/api/check-auth', { withCredentials: true });
      setIsAuthenticated(response.data.isAuthenticated);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleSaveLink = async () => {
    if (!isAuthenticated || !link) return;

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
      toast({
        title: 'Success',
        description: res.data.message,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error saving link:', error);
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
    checkAuthStatus();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 py-8 sm:py-12 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <section className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4">
          Welcome to SaveLink
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300">
          Your personal link vault in the cloud
        </p>
      </section>

      {isCheckingAuth ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin mr-2" />
          <span>Checking authentication...</span>
        </div>
      ) : isAuthenticated ? (
        <section className="w-full max-w-sm sm:max-w-md md:max-w-lg">
          <div className="bg-gray-700 rounded-lg p-4 sm:p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <LinkIcon className="text-blue-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter your link here"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter title (optional)"
              />
            </div>
            <div className="flex items-center mb-4">
              <Tag className="text-blue-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter tags, separated by commas (optional)"
              />
            </div>
            <button
              onClick={handleSaveLink}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-sm sm:text-base"
              disabled={isLoading || !link}
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto"/> : "Save Link"}
            </button>
          </div>
        </section>
      ) : (
        <section className="text-center w-full max-w-sm sm:max-w-md">
          <div className="bg-gray-700 rounded-lg p-4 sm:p-6 shadow-lg">
            <p className="text-lg sm:text-xl mb-4">Please sign in to start saving your links</p>
            <Link href="/login"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-sm sm:text-base"
            >
              <LogIn className="mr-2" />
              Sign In
            </Link>
          </div>
        </section>
      )}

      <footer className="mt-8 sm:mt-12 text-center text-gray-400 text-sm sm:text-base">
        <p>&copy; 2024 SaveLink. All rights reserved.</p>
      </footer>
    </main>
  );
}
