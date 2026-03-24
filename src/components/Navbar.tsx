'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              DeskDrop
            </Link>
            <Link href="/spaces" className="hidden sm:block text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">
              Browse Spaces
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
            </Link>

            {user ? (
              <>
                <Link href="/bookings" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                  My Bookings
                </Link>
                <Link href="/profile" className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                  <UserIcon className="w-6 h-6" />
                </Link>
                <button
                  onClick={signOut}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
