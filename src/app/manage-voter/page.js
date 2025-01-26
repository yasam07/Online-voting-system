'use client';
import { useRouter } from 'next/navigation'; // Import the useRouter hook
import { useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi"; // Import the search icon

export default function ManageVoterPage() {
  const router = useRouter(); // Initialize the router
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all voters from the API
  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await fetch("/api/register");
        if (!response.ok) {
          throw new Error("Failed to fetch voters");
        }
        const data = await response.json();
        setVoters(data.voters);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVoters();
  }, []);

  // Handle edit button click
  const handleEdit = (id) => {
    router.push(`/manage-voter/edit/${id}`); // Navigate to the edit page
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this voter?")) {
      try {
        const response = await fetch(`/api/register/${id}`, { method: "DELETE" });
        if (!response.ok) {
          throw new Error("Failed to delete voter");
        }
        setVoters((prevVoters) => prevVoters.filter((voter) => voter._id !== id));
      } catch (error) {
        console.error("Error deleting voter:", error);
        alert("Failed to delete voter.");
      }
    }
  };

  // Filter voters based on search query (name or nationalId)
  const filteredVoters = voters.filter((voter) => {
    const query = searchQuery.toLowerCase();
    return (
      voter.fullName.toLowerCase().includes(query) ||
      voter.nationalId.toLowerCase().includes(query)
    );
  });

  // Display loading state
  if (loading) {
    return <p className="text-center text-gray-600">Loading voters...</p>;
  }

  // Display error state
  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  // Handle search icon click
  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  // Handle "Create New Voter" button click
  const handleCreateNewVoter = () => {
    console.log("Redirect to create new voter form");
    // Add navigation to the create voter page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-500">Manage Voters</h1>

      {/* Search Box */}
      <div className="mb-4 flex items-center w-full">
        <input
          type="text"
          placeholder="Search by name or national ID"
          className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-indigo-500 bg-white border-t border-r border-b border-gray-300 rounded-r-lg hover:bg-indigo-100 transition duration-200"
        >
          <HiSearch className="text-xl" />
        </button>
      </div>

      {/* Create New Voter Button */}
      <div className="mb-6">
        <button
          onClick={handleCreateNewVoter}
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
        >
          Create New Voter
        </button>
      </div>

      {/* Voters List */}
      {filteredVoters.length === 0 ? (
        <p className="text-center text-gray-600">No voters found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredVoters.map((voter) => (
            <div
              key={voter._id}
              className="bg-gradient-to-r from-indigo-200 to-teal-200 p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">{voter.fullName}</h2>
              <p className="text-gray-700 mb-2"><span className="font-semibold">Father Name:</span> {voter.fatherName}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold">National ID:</span> {voter.nationalId}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold">Date of Birth:</span> {voter.dateOfBirth}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold">Gender:</span> {voter.gender}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold">District:</span> {voter.district}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold">Municipality:</span> {voter.municipality}</p>
              
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(voter._id)} // Attach the edit functionality
                  className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(voter._id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
