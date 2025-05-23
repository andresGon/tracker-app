"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthStatus() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authSubscriptionData } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      // If user logs out, you might want to redirect or refresh
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login'); // Or router.refresh() if on a protected page
      }
      // If user signs in, and they are on an auth page, redirect them
      if (event === 'SIGNED_IN' && (window.location.pathname.startsWith('/auth/login') || window.location.pathname.startsWith('/auth/signup'))) {
        router.push('/');
      }
    });

    return () => {
      // Correctly access the unsubscribe method from the subscription object
      authSubscriptionData?.subscription?.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      // Handle error appropriately, e.g., show a notification
    }
    // The onAuthStateChange listener will handle setting user to null and redirecting
    setLoading(false);
  };

  if (loading) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">Loading auth status...</div>;
  }

  return (
    <div className="p-4 mb-6 bg-gray-100 dark:bg-gray-900 rounded-md shadow text-sm">
      {user ? (
        <div className="flex items-center justify-between">
          <p className="text-gray-700 dark:text-gray-300">
            Logged in as: <span className="font-semibold">{user.email}</span>
          </p>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-4">
          <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Login
          </Link>
          <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}