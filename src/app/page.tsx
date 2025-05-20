import Image from "next/image";
import { supabase } from '@/lib/supabaseClient'; // Adjust path if needed

// Removed the first default export:
// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }

// Renamed HomePage to Home and kept it as the default export
export default async function Home() {
  const { data: mydata, error } = await supabase
    .from('activities') // Your table name
    .select('*');

  if (error) {
    console.error('Error fetching data:', error);
    // Optionally, you could return an error message or a fallback UI here
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">My Next.js App with Supabase</h1>
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert mx-auto"
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>

        <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Fetched Activities:</h2>
          {error && <p className="text-red-500">Error fetching data: {error.message}</p>}
          
          {!error && !mydata && <p className="text-gray-500 dark:text-gray-400">Loading activities...</p>}
          
          {!error && mydata && mydata.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">No activities found.</p>
          )}

          {!error && mydata && mydata.length > 0 && (
            <ul className="space-y-4">
              {mydata.map((activity: any, index: number) => ( // Add type 'any' for now, or define a proper type for activity
                <li key={activity.id || index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow">
                  {/* Display activity properties. Adjust these based on your table columns */}
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{activity.name || `Activity ${index + 1}`}</h3>
                  {activity.description && <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>}
                  {activity.created_at && <p className="text-xs text-gray-400 dark:text-gray-500">Created: {new Date(activity.created_at).toLocaleString()}</p>}
                  {/* You can add more fields here, e.g., Object.entries(activity).map(...) to display all */}
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 text-xs rounded overflow-x-auto">
                    {JSON.stringify(activity, null, 2)}
                  </pre>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Original pre tag for raw data (optional, can be removed) */}
        {/* <h3 className="mt-8 text-lg font-semibold">Raw Data:</h3>
        <pre className="mt-2 w-full p-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-x-auto text-xs">
          {mydata ? JSON.stringify(mydata, null, 2) : 'No data or loading...'}
        </pre> */}

      </div>
    </main>
  );
}
