"use client"; // This component needs to be a client component

import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Adjust path if your client is elsewhere
import { useRouter } from 'next/navigation'; // For refreshing server components

// Assuming your Activity interface is defined (or import it if it's in a shared file)
// If not, you can define a simpler one for the form data:
interface NewActivity {
  title: string;
  description?: string;
  // Add other fields that your 'activities' table expects for insertion,
  // excluding auto-generated ones like id or created_at (if set to now() by default)
}

export default function AddActivityForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setError("Title is required.");
      setIsLoading(false);
      return;
    }

    const newActivity: NewActivity = { title };
    if (description.trim()) {
      newActivity.description = description;
    }

    const { error: insertError } = await supabase
      .from('activities') // Your table name
      .insert([newActivity]);

    setIsLoading(false);

    if (insertError) {
      console.error('Error inserting activity:', insertError);
      setError(`Failed to add activity: ${insertError.message}`);
    } else {
      setSuccessMessage('Activity added successfully!');
      setTitle('');
      setDescription('');
      // Refresh the page/server component to show the new activity
      // This will re-fetch the data in your Server Component (page.tsx)
      router.refresh(); 
    }
  };

  return (
    <div className="w-full max-w-md p-6 my-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Activity</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add Activity'}
          </button>
        </div>
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
        {successMessage && <p className="text-sm text-green-500 dark:text-green-400">{successMessage}</p>}
      </form>
    </div>
  );
}