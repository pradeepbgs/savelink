"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Linkcard from "@/components/Linkcard";

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
  const [search, setSearch] = useState(""); 

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `/api/links/get-links?page=${page}&filter=${search}`
      );
      setLinks(response.data.data);
    } catch (err) {
      setError("Failed to fetch links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [page,search]);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handleDelete = async (id: string) => {
    setLinks(links.filter((link) => link._id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Links</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

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
              <Linkcard key={link._id} link={link} onLinkDeleted={handleDelete} />
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
