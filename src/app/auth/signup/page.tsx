import SignUpForm from '@/components/SignUpForm'; // Adjust path as necessary

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-24">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm">
        <SignUpForm />
      </div>
    </main>
  );
}