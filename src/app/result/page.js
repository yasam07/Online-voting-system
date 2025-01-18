'use client'
import { useEffect, useState } from 'react';

const ResultsPage = () => {
  const [voteCounts, setVoteCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoteCounts = async () => {
      try {
        const response = await fetch('/api/result'); // Endpoint for getting vote counts
        if (!response.ok) {
          throw new Error('Failed to fetch vote counts');
        }
        const data = await response.json();
        setVoteCounts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVoteCounts();
  }, []);

  if (loading) return <div className="text-center text-lg text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-lg text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Election Results</h1>
      {voteCounts.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No results available</p>
      ) : (
        <table className="min-w-full table-auto border-collapse shadow-md bg-gray-50 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-300 text-white">
              <th className="px-4 py-2 text-left">Mayor ID</th>
              <th className="px-4 py-2 text-left">Mayor Votes</th>
              <th className="px-4 py-2 text-left">Deputy Mayor ID</th>
              <th className="px-4 py-2 text-left">Deputy Mayor Votes</th>
            </tr>
          </thead>
          <tbody>
            {voteCounts.map((result, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 text-gray-700">{result.mayorId}</td>
                <td className="px-4 py-2 text-gray-700">{result.mayorVotes}</td>
                <td className="px-4 py-2 text-gray-700">{result.deputyMayorId}</td>
                <td className="px-4 py-2 text-gray-700">{result.deputyMayorVotes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResultsPage;
