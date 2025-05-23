"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditActivityModal from './EditActivityModal'; // Import the modal

// Define Activity and ActivityCardProps here or import if defined elsewhere
interface Activity {
  id: number | string;
  title: string;
  description?: string;
  created_at: string;
  // Add other properties from your 'activities' table here
}

interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void; // Callback to open modal
}

function ActivityCard({ activity, onEdit }: ActivityCardProps) {
  return (
    <li 
      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onEdit(activity)} // Trigger onEdit when li is clicked
    >
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{activity.title || `Activity ${activity.id}`}</h3>
      {activity.description && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
      )}
      {activity.created_at && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Created: {new Date(activity.created_at).toLocaleDateString()}
        </p>
      )}
    </li>
  );
}


interface ActivitiesManagerProps {
  initialActivities: Activity[];
  fetchError: any; // Supabase error type can be more specific if needed
}

export default function ActivitiesManager({ initialActivities, fetchError }: ActivitiesManagerProps) {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleOpenModal = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const handleActivityUpdated = () => {
    router.refresh(); // Re-fetches data in the Server Component (page.tsx)
    // The activities state here won't automatically update unless we re-fetch or manually update.
    // router.refresh() is generally preferred for consistency with server-rendered data.
  };
  
  // Update activities state if initialActivities change (e.g., after router.refresh)
  // This might not be strictly necessary if router.refresh() causes a full re-render
  // of this client component with new props.
  if (initialActivities !== activities && JSON.stringify(initialActivities) !== JSON.stringify(activities)) {
     setActivities(initialActivities);
  }


  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Fetched Activities:</h2>
      {fetchError && <p className="text-red-500">Error fetching data: {fetchError.message}</p>}
      
      {!fetchError && activities.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No activities found.</p>
      )}

      {!fetchError && activities.length > 0 && (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onEdit={handleOpenModal} />
          ))}
        </ul>
      )}

      {selectedActivity && (
        <EditActivityModal
          activity={selectedActivity}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onActivityUpdated={handleActivityUpdated}
        />
      )}
    </div>
  );
}