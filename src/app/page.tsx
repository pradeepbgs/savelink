'use client'

import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <main className="h-screen flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Welcome to SaveLink.com
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          Save your links with ease
        </p>
      </section>

      <section className="text-center w-full max-w-md">
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="mt-3 w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {
            isLoading ? <Loader2 className="animate-spin"/> : "Save Link"
          }
        </button>
      </section>
    </main>
  );
}

