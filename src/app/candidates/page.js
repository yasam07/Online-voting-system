'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CandidatePage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch('/api/candidates');
      if (!response.ok) throw new Error('Failed to fetch candidates');
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      toast.error(error.message || 'Error fetching candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (district, municipality, postType, candidateId) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
  
    try {
      const response = await fetch('/api/candidates/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district, municipality, postType, candidateId }),
      });
  
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || 'Candidate deleted successfully');
        fetchCandidates(); // Refresh candidates
      } else {
        throw new Error(result.message || 'Failed to delete candidate');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  

  const groupCandidates = (candidates) =>
    candidates.reduce((acc, candidate) => {
      const { district, municipality } = candidate;
      if (!acc[district]) acc[district] = {};
      if (!acc[district][municipality]) acc[district][municipality] = { mayorCandidates: [], deputyMayorCandidates: [] };

      acc[district][municipality].mayorCandidates.push(...candidate.mayorCandidates);
      acc[district][municipality].deputyMayorCandidates.push(...candidate.deputyMayorCandidates);

      return acc;
    }, {});

  const groupedCandidates = groupCandidates(candidates);

  if (loading || status === 'loading') return <div>Loading...</div>;

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const isAdmin = session?.user?.admin;

  if (!isAdmin) return <div>Access denied. You are not an admin.</div>;

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Candidate Management</h1>

      <div className="flex justify-center mb-8">
        <Link href="/candidates/new">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300">
            + Create New Candidate
          </button>
        </Link>
      </div>

      {Object.keys(groupedCandidates).length > 0 ? (
        <div className="space-y-10">
          {Object.entries(groupedCandidates).map(([district, municipalities]) => (
            <div key={district} className="bg-gray-100 rounded-lg p-6 shadow-md border border-gray-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{district}</h3>

              {Object.entries(municipalities).map(([municipality, { mayorCandidates, deputyMayorCandidates }]) => (
                <div key={municipality} className="bg-white p-4 rounded-lg mb-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">{municipality}</h4>

                  {/* Mayor Candidates */}
                  <CandidateList
                    title="Mayor Candidates"
                    candidates={mayorCandidates}
                    onDelete={(index) => handleDelete(district, municipality, 'mayorCandidates', index)}
                  />

                  {/* Deputy Mayor Candidates */}
                  <CandidateList
                    title="Deputy Mayor Candidates"
                    candidates={deputyMayorCandidates}
                    onDelete={(index) => handleDelete(district, municipality, 'deputyMayorCandidates', index)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">No candidates found.</p>
      )}
    </div>
  );
}

function CandidateList({ title, candidates, onDelete }) {
  return (
    <div className="mb-6">
      <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
      {candidates.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {candidates.map((candidate, index) => (
            <li key={index} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-700">
                <span className="font-semibold">Name:</span> {candidate.name}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Candidtae ID:</span> {candidate.candidateId}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Party:</span> {candidate.party}
              </p>

              <div className="flex space-x-4 mt-4">
                <Link href={`/candidates/edit/${candidate._id}`}>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => onDelete(index)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-2">No candidates found.</p>
      )}
    </div>
  );
}
