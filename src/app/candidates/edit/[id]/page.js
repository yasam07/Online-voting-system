'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditCandidatePage({ params }) {
  const { id } = params; // Extract `id` from the dynamic route
  const router = useRouter();
  const [candidateData, setCandidateData] = useState({
    name: '',
    candidateId: '',
    party: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error('Candidate ID is missing');
      return;
    }

    const fetchCandidateData = async () => {
      try {
        const response = await fetch(`/api/candidates/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch candidate data');
        }
        const data = await response.json();
        setCandidateData(data); // Set initial data for the form
      } catch (error) {
        console.error('Error fetching candidate data:', error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCandidateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Get error details from the server
        throw new Error(errorData.error || 'Failed to update candidate'); // Display the server error or a default message
      }
  
      toast.success('Candidate updated successfully');
      router.push('/candidates'); // Redirect to the candidates list or another page
    } catch (error) {
      console.error('Error updating candidate:', error);
      toast.error(error.message); // Display the error in a toast
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (!candidateData) return <div>No candidate data found</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-2 sm:px-6 lg:px-8">
    <div className="bg-white shadow-sm rounded-xl p-8  py-8 w-full max-w-lg border border-gray-100">
      <h1 className="text-2xl font-extrabold text-center text-gray-700 mb-5">
        Edit Candidate
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-600"
          >
            Candidate Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={candidateData.name}
            onChange={handleChange}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400 text-gray-700 placeholder-gray-400"
            placeholder="Enter candidate's name"
          />
        </div>
        <div>
          <label
            htmlFor="candidateId"
            className="block text-sm font-medium text-gray-600"
          >
            Candidate ID:
          </label>
          <input
            type="text"
            id="candidateId"
            name="candidateId"
            value={candidateData.candidateId}
            onChange={handleChange}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400 text-gray-700 placeholder-gray-400"
            placeholder="Enter candidate ID"
          />
        </div>
        <div>
  <label
    htmlFor="party"
    className="block text-sm font-medium text-gray-600"
  >
    Party:
  </label>
  <select
    id="party"
    name="party"
    value={candidateData.party}
    onChange={handleChange}
    required
    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400 text-gray-700 bg-white"
  >
    <option value="">Select Party</option>
    <option value="Party A">Party A</option>
    <option value="Party B">Party B</option>
    <option value="Party C">Party C</option>
  </select>
</div>

        <button
          type="submit"
          className="w-full px-6 py-3  text-white font-semibold rounded-lg shadow-md hover:bg-red-300 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-transform duration-200"
        >
          Update Candidate
        </button>
      </form>
    </div>
    <footer className="mt-10 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Online Voting System
    </footer>
  </div>
  
  );
}
