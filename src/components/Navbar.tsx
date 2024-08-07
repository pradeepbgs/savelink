'use client'

import Link from 'next/link';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setAuthenticated } from '@/lib/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()
  const disptch = useDispatch()

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    const res = await axios.get('/api/logout')
    if(res.data.success){
      router.push('/')
      disptch(setAuthenticated(false))
    }
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SaveLink
        </Link>
        <div className="hidden md:flex space-x-4">
        <Button 
        onClick={handleLogout} 
        className="hover:text-blue-500 transition duration-200 mr-5">
            Logout
          </Button>
          <Link href="/links" className="hover:text-blue-500 transition duration-200">
          <Button  
        className="hover:text-blue-500 transition duration-200 mr-5">
            Links
          </Button>
          </Link>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-blue-500 transition duration-200">
              Home
            </Link>
            <Button 
            onClick={handleLogout} 
            className="hover:text-blue-500 transition duration-200 ">
            Logout
          </Button>
            <Link href="/links" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-blue-500 transition duration-200">
              Links
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
