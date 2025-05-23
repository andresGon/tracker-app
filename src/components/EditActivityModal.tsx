"use client";

import { useState, FormEvent, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

// Assuming Activity interface is similar to the one in page.tsx
interface Activity {
  id: number | string;
  title: string;
  description?: string;
  created_at?: string; // Keep other fields if needed, but only id, title, desc are edited here
}

interface EditActivityModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onActivityUpdated: () => void; // To refresh the list on the parent page
}

export default function EditActivityModal({ activity, isOpen, onClose, onActivityUpdated }: EditActivityModalProps) {
  const router = useRouter();
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (activity) {
      setEditTitle(activity.title);
      setEditDescription(activity.description || '');
      setError(null);
      setSuccessMessage(null);
    }
  }, [activity]);

  if (!isOpen || !activity) {
    return null;
  }

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!editTitle.trim()) {
      setError("Title is required.");
      setIsLoading(false);
      return;
    }

    const updatedActivityData = {
      title: editTitle,
      description: editDescription.trim() ? editDescription : null, // Set to null if empty, or handle as empty string
    };

    const { error: updateError } = await supabase
      .from('activities')
      .update(updatedActivityData)
      .eq('id', activity.id);

    setIsLoading(false);

    if (updateError) {
      console.error('Error updating activity:', updateError);
      setError(`Failed to update activity: ${updateError.message}`);
    } else {
      setSuccessMessage('Activity updated successfully!');
      onActivityUpdated(); // Call this to refresh the list in page.tsx
      // Optionally close the modal after a short delay or let the user close it
      setTimeout(() => {
        onClose();
      }, 1500); // Close after 1.5 seconds
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative p-8 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          &times; {/* A simple 'X' icon */}
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit Activity</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description (Optional)
            </label>
            <textarea
              id="edit-description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
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
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          {successMessage && <p className="text-sm text-green-500 dark:text-green-400">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
}