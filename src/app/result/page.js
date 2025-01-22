'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const ResultsPage = () => {
  const { data: session } = useSession();
  const [voteCounts, setVoteCounts] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeElection = session?.activeElection || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vote counts
        const voteResponse = await fetch('/api/result');
        if (!voteResponse.ok) {
          throw new Error('Failed to fetch vote counts');
        }
        const voteData = await voteResponse.json();
        setVoteCounts(voteData);

        // Fetch candidates data
        const candidateResponse = await fetch('/api/candidates');
        if (!candidateResponse.ok) {
          throw new Error('Failed to fetch candidates');
        }
        const candidateData = await candidateResponse.json();
        setCandidates(candidateData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center text-lg text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-lg text-red-600">Error: {error}</div>;

  // Track mayor and deputy mayor votes
  const mayorVotesCount = {};
  const deputyMayorVotesCount = {};

  // Ensure mayorVotes are populated correctly
  voteCounts.forEach(result => {
    // Log each result to check the mayorId and mayorVotes
    console.log('Vote result:', result);

    if (result.mayorId) {
      const mayorVotes = result.mayorVotes || 0; // Safeguard against missing votes
      mayorVotesCount[result.mayorId] = (mayorVotesCount[result.mayorId] || 0) + mayorVotes;
    }
    if (result.deputyMayorId) {
      const deputyMayorVotes = result.deputyMayorVotes || 0; // Safeguard against missing votes
      deputyMayorVotesCount[result.deputyMayorId] = (deputyMayorVotesCount[result.deputyMayorId] || 0) + deputyMayorVotes;
    }
  });

  // Calculate total votes for mayor and deputy mayor
  const totalMayorVotes = Object.values(mayorVotesCount).reduce((a, b) => a + b, 0);
  const totalDeputyMayorVotes = Object.values(deputyMayorVotesCount).reduce((a, b) => a + b, 0);

  console.log('Mayor Votes Count:', mayorVotesCount); // Debugging mayor vote count
  console.log('Deputy Mayor Votes Count:', deputyMayorVotesCount); // Debugging deputy mayor vote count

  // Group candidates by district and municipality
  const groupedCandidates = candidates.reduce((grouped, candidate) => {
    const { district, municipality, mayorCandidates, deputyMayorCandidates } = candidate;
    const key = `${district}-${municipality}`;

    if (!grouped[key]) {
      grouped[key] = { district, municipality, mayorCandidates, deputyMayorCandidates };
    } else {
      grouped[key].mayorCandidates = [...grouped[key].mayorCandidates, ...mayorCandidates];
      grouped[key].deputyMayorCandidates = [
        ...grouped[key].deputyMayorCandidates,
        ...deputyMayorCandidates,
      ];
    }

    return grouped;
  }, {});

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Election Results</h1>

      {activeElection && (
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">
          Active Election: <span className="text-green-600">{activeElection.name}</span>
        </h2>
      )}

      <div className="text-center text-lg text-gray-700 mb-8">
        <p className="font-medium"><strong>Total Mayor Votes:</strong> {totalMayorVotes}</p>
        <p className="font-medium"><strong>Total Deputy Mayor Votes:</strong> {totalDeputyMayorVotes}</p>
      </div>

      {voteCounts.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No results available</p>
      ) : (
        <div className="space-y-12">
  {Object.values(groupedCandidates).map(({ district, municipality, mayorCandidates, deputyMayorCandidates }) => (
    <div key={`${district}-${municipality}`} className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl shadow-lg border border-gray-200 space-y-8">
      {/* District and Municipality Header */}
      <h3 className="text-3xl font-bold text-center text-indigo-900">{district}, {municipality}</h3>

      {/* Mayor Candidates */}
      <div className="space-y-6">
        <h4 className="text-2xl font-semibold text-gray-800">Mayor Candidates</h4>
        {mayorCandidates.map((mayor) => {
          const mayorVoteCount = mayorVotesCount[mayor.candidateId] || 0;
          return (
            <div
              key={mayor.candidateId}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-yellow-100 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <h5 className="text-xl font-semibold text-gray-800">Name:{mayor.name}</h5>
                <p className="text-lg text-gray-700"><strong>Votes:</strong> {mayorVoteCount}</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">Party: <span className="font-medium text-green-600">{mayor.party}</span></p>
              <p className="text-sm text-gray-500 mt-2">Mayor ID: {mayor.candidateId}</p>
            </div>
          );
        })}
      </div>

      {/* Deputy Mayor Candidates */}
      <div className="space-y-6">
        <h4 className="text-2xl font-semibold text-gray-800">Deputy Mayor Candidates</h4>
        {deputyMayorCandidates.map((deputyMayor) => {
          const deputyMayorVoteCount = deputyMayorVotesCount[deputyMayor.candidateId] || 0;
          return (
            <div
              key={deputyMayor.candidateId}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-300 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <h5 className="text-xl font-semibold text-gray-800">Name:{deputyMayor.name}</h5>
                <p className="text-lg text-gray-700"><strong>Votes:</strong> {deputyMayorVoteCount}</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">Party: <span className="font-medium text-blue-600">{deputyMayor.party}</span></p>
              <p className="text-sm text-gray-500 mt-2">Deputy Mayor ID: {deputyMayor.candidateId}</p>
            </div>
          );
        })}
      </div>
    </div>
  ))}
</div>

      )}
    </div>
  );
};

export default ResultsPage;
