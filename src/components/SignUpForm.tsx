"use client";

import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      setIsLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsLoading(false);

    if (signUpError) {
      console.error('Error signing up:', signUpError);
      setError(`Failed to sign up: ${signUpError.message}`);
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      // This case might indicate that email confirmation is required and the user already exists but is unconfirmed.
      // Supabase might return a user object with an empty identities array if "Confirm email" is enabled in your Supabase project settings
      // and the user signs up with an email that already exists but hasn't confirmed their email.
      setError("This email address is already registered but not confirmed. Please check your email to confirm or try logging in.");
      setSuccessMessage(null); // Clear any previous success message
    } else if (data.user) {
      setSuccessMessage('Sign up successful! Please check your email to confirm your account.');
      setEmail('');
      setPassword('');
      // You might want to redirect the user or show a message to check their email
      // router.push('/auth/confirm-email'); // Example redirect
    } else {
        // Fallback for unexpected scenarios, though Supabase usually provides a user or an error.
        setError("An unexpected issue occurred during sign up. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md p-6 my-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sign Up</h2>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6} // Supabase default minimum password length
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
        {successMessage && <p className="text-sm text-green-500 dark:text-green-400">{successMessage}</p>}
      </form>
    </div>
  );
}