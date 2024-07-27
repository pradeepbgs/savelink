'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface Link {
  _id: string;
  title: string;
  link: string;
  tags: string[];
  createdAt: string;
}

const GetLinksPage = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/links/get-links?page=${page}`);
        setLinks(response.data.data);
      } catch (err) {
        setError("Failed to fetch links");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.post('/api/links/delete-link', { link_id: id });
      if (res.data.success) {
        toast({
          title: "Link deleted successfully",
          description: "Your link has been deleted successfully",
        })
      }
      setLinks(links.filter((link) => link._id !== id));
    } catch (err) {
      setError("Failed to delete link");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Links</h1>
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <motion.div
                key={link._id}
                className="bg-white shadow-md rounded-lg p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-2">{link.title}</h2>
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {link.link}
                </a>
                <p className="text-gray-600 text-sm mt-2">
                  {new Date(link.createdAt).toLocaleString()}
                </p>
                <div className="mt-3">
                  {link.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-8">
                <Button onClick={() => handleDelete(link._id)} variant={'default'}>
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded-l-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GetLinksPage;
