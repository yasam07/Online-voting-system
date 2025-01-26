'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const AdminPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Navigation handlers
  const navigateToManageCandidates = () => {
    router.push('/candidates');
  };

  const navigateToCreateElection = () => {
    router.push('/election');
  };

  const navigateToManageVoters = () => {
    router.push('/manage-voter');
  };

  const navigateToViewMessage = () => {
    router.push('/view-message'); // Replace with the correct route for viewing messages
  };

  // Handle loading and unauthenticated states
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="text-white text-lg font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null; // Prevent rendering anything while redirecting
  }

  // Check for admin privileges
  const isAdmin = session?.user?.admin;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-red-600">Access Denied</h1>
          <p className="text-gray-700 mt-2">You do not have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-4 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-3xl border border-gray-200 transform hover:scale-105 transition-transform duration-500">
        <h1 className="text-5xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text font-extrabold text-center mb-6 animate-fade-in drop-shadow-lg">
          Admin Dashboard
        </h1>
        <p className="text-center text-gray-700 mb-8 text-lg tracking-wide leading-relaxed max-w-2xl mx-auto">
          Efficiently manage <span className="font-semibold text-purple-600">elections</span>, 
          <span className="font-semibold text-pink-600"> candidates</span>, and 
          <span className="font-semibold text-red-600"> voters</span> with ease.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Manage Candidates */}
          <button
            onClick={navigateToManageCandidates}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Manage Candidates
          </button>
          {/* Manage Election */}
          <button
            onClick={navigateToCreateElection}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Manage Election
          </button>
          {/* Manage Voters */}
          <button
            onClick={navigateToManageVoters}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Manage Voters
          </button>
          {/* View Message */}
          <button
            onClick={navigateToViewMessage}
            className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            View Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
