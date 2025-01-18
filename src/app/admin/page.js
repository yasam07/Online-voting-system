'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const AdminPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const navigateToManageCandidates = () => {
    router.push('/candidates');
  };

  const navigateToCreateElection = () => {
    router.push('/election');
  };

  // Handle loading and unauthenticated states
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null; // Prevent rendering anything while redirecting
  }

  // Check for admin privileges
  const isAdmin = session?.user?.admin;

  if (!isAdmin) {
    return <div>Not an admin</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg border border-gray-500">
      <h1 className="text-3xl text-gray-700 font-bold text-center  mb-4">
        Admin Dashboard
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Efficiently manage elections and candidates with ease.
      </p>
      <div className="space-y-4">
        <button
          onClick={navigateToManageCandidates}
          className="w-full px-6 py-3 bg-indigo-100 text-indigo-600 font-semibold text-lg rounded-lg border border-indigo-200 hover:bg-indigo-200 transition-all duration-200"
        >
          Manage Candidates
        </button>
        <button
          onClick={navigateToCreateElection}
          className="w-full px-6 py-3 bg-green-100 text-green-600 font-semibold text-lg rounded-lg border border-green-200 hover:bg-green-200 transition-all duration-200"
        >
          Manage Election
        </button>
      </div>
    </div>
    <footer className="mt-12 text-center text-gray-500 text-sm">
      © {new Date().getFullYear()} Online Voting System | Admin Panel
    </footer>
  </div>
  
  
  );
};

export default AdminPage;
