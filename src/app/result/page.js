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
  const [selectedElectionId, setSelectedElectionId] = useState(null); // Track selected election ID
  const [searchQuery, setSearchQuery] = useState(''); // Store search query for election ID

  const activeElection = session?.activeElection || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vote counts for all elections
        const voteResponse = await fetch('/api/result');
        if (!voteResponse.ok) {
          throw new Error('Failed to fetch vote counts');
        }
        const voteData = await voteResponse.json();
        setVoteCounts(voteData);

        // Fetch candidates data for all elections
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

  // Track mayor and deputy mayor votes for all elections
  const mayorVotesCount = {};
  const deputyMayorVotesCount = {};

  voteCounts.forEach(result => {
    if (result.mayorId) {
      const mayorVotes = result.mayorVotes || 0;
      mayorVotesCount[result.mayorId] = (mayorVotesCount[result.mayorId] || 0) + mayorVotes;
    }
    if (result.deputyMayorId) {
      const deputyMayorVotes = result.deputyMayorVotes || 0;
      deputyMayorVotesCount[result.deputyMayorId] = (deputyMayorVotesCount[result.deputyMayorId] || 0) + deputyMayorVotes;
    }
  });

  // Group candidates by district, municipality, electionId, and electionName for all elections
  const groupedCandidates = candidates.reduce((grouped, candidate) => {
    const { district, municipality, mayorCandidates, deputyMayorCandidates, electionId, electionName } = candidate;
    const key = `${district}-${municipality}-${electionId}`;

    if (!grouped[key]) {
      grouped[key] = { district, municipality, mayorCandidates, deputyMayorCandidates, electionId, electionName };
    } else {
      grouped[key].mayorCandidates = [...grouped[key].mayorCandidates, ...mayorCandidates];
      grouped[key].deputyMayorCandidates = [...grouped[key].deputyMayorCandidates, ...deputyMayorCandidates];
    }

    return grouped;
  }, {});

  // Separate active election from the other elections
  const activeElectionCandidates = Object.values(groupedCandidates).filter(
    ({ electionId }) => electionId === activeElection?.electionId
  );
  
  // Group other elections by electionId
  const groupedOtherElections = Object.values(groupedCandidates).reduce((acc, { district, municipality, mayorCandidates, deputyMayorCandidates, electionId, electionName }) => {
    if (!acc[electionId]) {
      acc[electionId] = { electionId, electionName, candidates: [] };
    }
    acc[electionId].candidates.push({ district, municipality, mayorCandidates, deputyMayorCandidates });
    return acc;
  }, {});

  // Filter elections based on search query (search by electionId)
  const filteredElections = Object.values(groupedOtherElections).filter(election => 
    election.electionId.toString().includes(searchQuery)
  );

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Election Results</h1>

      {/* Display Active Election */}
      {activeElection && activeElectionCandidates.length > 0 && (
        <div className="space-y-12 mb-12">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">
            Active Election: <span className="text-green-600">{activeElection.name}</span>
          </h2>

          {/* Active Election Results */}
          {activeElectionCandidates.map(({ district, municipality, mayorCandidates, deputyMayorCandidates, electionId }) => (
            <div key={electionId} className="space-y-12">
              <div className="bg-gradient-to-r p-6 rounded-xl shadow-lg border border-gray-200 bg-green-50">
                <h3 className="text-3xl font-bold text-center text-indigo-900">
                  {district}, {municipality}
                </h3>
              </div>

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
                        <h5 className="text-xl font-semibold text-gray-800">Name: {mayor.name}</h5>
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
                        <h5 className="text-xl font-semibold text-gray-800">Name: {deputyMayor.name}</h5>
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

      {/* Display Filtered Other Elections */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Other Elections</h2>

        {/* Search Box for Other Elections */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Election ID..."
            className="p-3 w-full text-lg border border-gray-300 rounded-lg shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Display Filtered Elections */}
        {filteredElections.length === 0 ? (
          <div className="text-center text-lg text-red-600">No elections found for the search query.</div>
        ) : (
          filteredElections.map(({ electionId, electionName, candidates }) => (
            <div key={electionId} className="space-y-6 bg-gradient-to-r p-6 rounded-xl shadow-lg border border-gray-300 bg-blue-50">
              <h3
                className="text-2xl font-semibold text-indigo-800 cursor-pointer"
                onClick={() => setSelectedElectionId(selectedElectionId === electionId ? null : electionId)} // Toggle election visibility on click
              >
                <span className="text-black px-4 py-2 rounded-lg">Election Name :{electionId}</span> {electionName}
              </h3>

              {/* Conditionally Render Election Data */}
              {selectedElectionId === electionId && (
                <div>
                  {candidates.map(({ district, municipality, mayorCandidates, deputyMayorCandidates }) => (
                    <div key={`${district}-${municipality}`} className="space-y-12">
                      <div className="bg-gradient-to-r p-6 rounded-xl shadow-lg border border-gray-200 bg-blue-50">
                        <h4 className="text-3xl font-bold text-center text-indigo-900">
                          {district}, {municipality}
                        </h4>
                      </div>

                      {/* Mayor Candidates */}
                      <div className="space-y-6">
                        <h5 className="text-2xl font-semibold text-gray-800">Mayor Candidates</h5>
                        {mayorCandidates.map((mayor) => {
                          const mayorVoteCount = mayorVotesCount[mayor.candidateId] || 0;
                          return (
                            <div
                              key={mayor.candidateId}
                              className="bg-white p-6 rounded-lg shadow-md border border-gray-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-yellow-100 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between">
                                <h5 className="text-xl font-semibold text-gray-800">Candidate Name: {mayor.name}</h5>
                                <h5 className="text-xl font-semibold text-gray-800"> {mayor.party}</h5>
                                <p className="text-lg text-gray-700"><strong>Votes:</strong> {mayorVoteCount}</p>

                              </div>
                              <h5 className="text-xl font-semibold text-gray-800">Candidate Id: {mayor.candidateId}</h5>
                            </div>
                          );
                        })}
                      </div>

                      {/* Deputy Mayor Candidates */}
                      <div className="space-y-6">
                        <h5 className="text-2xl font-semibold text-gray-800">Deputy Mayor Candidates</h5>
                        {deputyMayorCandidates.map((deputyMayor) => {
                          const deputyMayorVoteCount = deputyMayorVotesCount[deputyMayor.candidateId] || 0;
                          return (
                            <div
                              key={deputyMayor.candidateId}
                              className="bg-white p-6 rounded-lg shadow-md border border-gray-300 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between">
                                <h5 className="text-xl font-semibold text-gray-800">Name: {deputyMayor.name}</h5>
                                <h5 className="text-xl font-semibold text-gray-800"> {deputyMayor.party}</h5>
                                <p className="text-lg text-gray-700"><strong>Votes:</strong> {deputyMayorVoteCount}</p>
                              </div>
                              <h5 className="text-xl font-semibold text-gray-800">Candidate Id: {deputyMayor.candidateId}</h5>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
