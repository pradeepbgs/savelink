'use client'

import Link from 'next/link';
import React from 'react';


const Navbar = () => {
 

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SaveLink
        </Link>
        <div className="hidden md:flex space-x-4">
          <Link href="/links" className="hover:text-blue-500 transition duration-200">
            Links
          </Link>
        </div>
      </div>
     
    </nav>
  );
};

export default Navbar;
