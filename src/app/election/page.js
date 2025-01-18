'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Election = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch('/api/elections/'); // Update with the correct API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch elections.');
        }
        const data = await response.json();
        setElections(data.elections);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const getElectionStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    return now >= start && now <= end ? 'Active' : 'Inactive';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-500 mb-8">
          Manage Elections
        </h1>
        <div className="space-y-6">
          <Link href="election/new">
            <button className="w-full px-6 py-3 bg-indigo-100 text-indigo-700 font-medium text-lg rounded-lg shadow-sm hover:bg-indigo-200 hover:text-indigo-800 transition-all duration-300">
              Create Election
            </button>
          </Link>

          <div className="mt-6">
            {loading ? (
              <p className="text-center text-gray-500">Loading elections...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <ul className="space-y-4">
                {elections.map((election) => (
                  <li
                    key={election._id}
                    className="p-4 bg-indigo-50 rounded-lg shadow-sm"
                  >
                    <h2 className="font-bold text-indigo-600">
                      {election.name}
                    </h2>
                    <h2 className="font-bold text-indigo-600">
                      ID: {election.electionId}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Start: {new Date(election.startTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      End: {new Date(election.endTime).toLocaleString()}
                    </p>
                    <p className="text-sm font-bold mt-2">
                      Status:{' '}
                      <span
                        className={
                          getElectionStatus(election.startTime, election.endTime) ===
                          'Active'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                      >
                        {getElectionStatus(election.startTime, election.endTime)}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Election;
