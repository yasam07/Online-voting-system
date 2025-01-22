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

      // Fetch elections
      const electionsResponse = await fetch('/api/elections');
      if (!electionsResponse.ok) throw new Error('Failed to fetch elections');
      const { elections } = await electionsResponse.json();

      const electionNames = elections.reduce((acc, election) => {
        acc[election._id] = election.name;
        return acc;
      }, {});

      const candidatesWithElectionNames = data.map((candidate) => ({
        ...candidate,
        electionName: electionNames[candidate.electionId] || 'Unknown Election',
      }));

      setCandidates(candidatesWithElectionNames);
    } catch (error) {
      toast.error(error.message || 'Error fetching candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (candidateId) => {
    console.log(candidateId)
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
  
    try {
      // Sending a DELETE request to delete a candidate by ID
      const response = await fetch(`/api/candidates/delete/${candidateId}`, {
        method: 'DELETE',  // Ensure method is DELETE
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete candidate');
      }
  
      const result = await response.json();
      toast.success(result.message || 'Candidate deleted successfully');
      
      // Optimistically remove the candidate from the list
      setCandidates((prevCandidates) =>
        prevCandidates.filter((candidate) => candidate._id !== candidateId)
      );
    } catch (error) {
      toast.error(error.message || 'Error deleting candidate');
    }
  };
  
  
  

  const groupCandidatesByElectionId = (candidates) =>
    candidates.reduce((acc, candidate) => {
      const { electionId, district, municipality } = candidate;

      if (!acc[electionId]) {
        acc[electionId] = {
          electionId,
          districts: {},
        };
      }

      if (!acc[electionId].districts[district]) {
        acc[electionId].districts[district] = {};
      }

      if (!acc[electionId].districts[district][municipality]) {
        acc[electionId].districts[district][municipality] = {
          mayorCandidates: [],
          deputyMayorCandidates: [],
        };
      }

      acc[electionId].districts[district][municipality].mayorCandidates.push(...candidate.mayorCandidates);
      acc[electionId].districts[district][municipality].deputyMayorCandidates.push(...candidate.deputyMayorCandidates);

      return acc;
    }, {});

  const groupedCandidates = groupCandidatesByElectionId(candidates);

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
          {Object.entries(groupedCandidates).map(([electionId, { districts }]) => (
            <div key={electionId} className="bg-gray-100 rounded-lg p-6 shadow-md border border-gray-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Election ID: {electionId}</h3>

              {Object.entries(districts).map(([district, municipalities]) => (
                <div key={district} className="mb-8">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">District: {district}</h4>

                  {Object.entries(municipalities).map(([municipality, { mayorCandidates, deputyMayorCandidates }]) => (
                    <div key={municipality} className="bg-white rounded-lg p-4 shadow-sm mb-6">
                      <h5 className="text-lg font-semibold text-gray-700 mb-2">Municipality: {municipality}</h5>

                      <CandidateList
                        title="Mayor Candidates"
                        candidates={mayorCandidates}
                        electionId={electionId}
                        district={district}
                        municipality={municipality}
                        postType="mayorCandidates"
                        onDelete={handleDelete}
                      />

                      <CandidateList
                        title="Deputy Mayor Candidates"
                        candidates={deputyMayorCandidates}
                        electionId={electionId}
                        district={district}
                        municipality={municipality}
                        postType="deputyMayorCandidates"
                        onDelete={handleDelete}
                      />
                    </div>
                  ))}
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

function CandidateList({ title, candidates, electionId, district, municipality, postType, onDelete }) {
  return (
    <div className="mb-6">
      <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
      {candidates.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {candidates.map((candidate) => (
            <li key={candidate._id} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-700">
                <span className="font-semibold">Name:</span> {candidate.name}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Candidate ID:</span> {candidate.candidateId}
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
  onClick={() => onDelete(candidate._id)}
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
