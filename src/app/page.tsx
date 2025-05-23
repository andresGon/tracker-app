import Image from "next/image";
import { supabase } from '@/lib/supabaseClient';
import AddActivityForm from '@/components/AddActivityForm';
import ActivitiesManager from '@/components/ActivitiesManager'; // New client component
import AuthStatus from "@/components/AuthStatus"; // Import the new AuthStatus component

interface Activity {
  id: number | string;
  title: string;
  description?: string;
  created_at: string;
  // Add other properties from your 'activities' table here
  // For example:
  user_id?: string; // Important if activities are user-specific
  // status?: 'pending' | 'completed' | 'in_progress';
  // due_date?: string;
}

export default async function Home() {
  // Fetch the user's session server-side
  const { data: { user } } = await supabase.auth.getUser();

  let activities: Activity[] = [];
  let fetchError: any = null;

  // Only fetch activities if a user is logged in
  // and assuming activities are user-specific (you'll need RLS for this)
  if (user) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      // IMPORTANT: Add this line if activities are tied to users and you have a user_id column
      // .eq('user_id', user.id) 
      .order('created_at', { ascending: false })
      .returns<Activity[]>();

    activities = data || [];
    fetchError = error;

    if (fetchError) {
      console.error('Error fetching data:', fetchError);
      // Optionally, you could return an error message or a fallback UI here
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col">
        {/* Display AuthStatus at the top */}
        <AuthStatus />

        <div className="mb-8 text-center">
          {/* You can remove the Next.js logo and title if AuthStatus provides enough context */}
          <h1 className="text-3xl font-bold mb-2">Activity Tracker</h1>
        </div>

        {/* Conditionally render AddActivityForm and ActivitiesManager based on auth state */}
        {user ? (
          <>
            <AddActivityForm />
            <ActivitiesManager initialActivities={activities} fetchError={fetchError} />
          </>
        ) : (
          <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Please log in to manage your activities.
          </p>
        )}
        
      </div>
    </main>
  );
}

// The ActivityCard component can remain here if it's simple and doesn't need client-side interactivity
// for opening the modal directly. We'll handle the click in ActivitiesManager.
// Or, move ActivityCard into ActivitiesManager or its own file if it becomes more complex.

// Keep ActivityCardProps and ActivityCard if they are used by ActivitiesManager
// or move them to where they are used. For now, let's assume ActivitiesManager will define its own.
interface ActivityCardProps {
  activity: Activity;
}

function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <li className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{activity.title || `Activity ${activity.id}`}</h3>
      {activity.description && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
      )}
      {activity.created_at && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Created: {new Date(activity.created_at).toLocaleDateString()}
        </p>
      )}
      {/* Add more fields from your activity object as needed */}
      {/* For example:
      {activity.status && (
        <p className="mt-1 text-sm">
          Status: <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            activity.status === 'completed' ? 'bg-green-100 text-green-800' :
            activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>{activity.status}</span>
        </p>
      )}
      */}
      {/* The JSON.stringify is removed from here, as we are displaying properties directly.
          If you still need to see the raw data for debugging, you could add it back conditionally
          or in a developer-only view.
      */}
    </li>
  );
}
