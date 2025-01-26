'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Election = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showElections, setShowElections] = useState(true);
  const [showSubElections, setShowSubElections] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const { data: session } = useSession();

  // Fetch elections data
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch("/api/elections/");
        if (!response.ok) {
          throw new Error("Failed to fetch elections.");
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

  // Get election status
  const getElectionStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    return now >= start && now <= end ? "Active" : "Inactive";
  };

  // Handle delete election
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/elections/${selectedElectionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setElections(elections.filter((election) => election._id !== selectedElectionId));
        alert("Election deleted successfully!");
      } else {
        alert("Failed to delete election.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete election.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const isAdmin = session?.user?.admin;

  if (!isAdmin)
    return (
      <div className="text-center text-red-600 font-bold">
        Access denied. You are not an admin.
      </div>
    );

  const electionsWithLocation = elections.filter(
    (election) => election.district && election.municipality
  );
  const electionsWithoutLocation = elections.filter(
    (election) => !election.district || !election.municipality
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-5xl">
        <h1 className="text-3xl font-extrabold text-center text-green-600 mb-8">
          Manage Elections
        </h1>

        {/* Create Election and Sub Election Buttons */}
        <div className="mb-6 text-center flex space-x-4 justify-center">
          <Link href="election/new">
            <button className="px-6 py-3 bg-green-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition-all duration-300 w-full sm:w-auto">
              Create Election
            </button>
          </Link>
          <Link href="election/sub-election">
            <button className="px-6 py-3 bg-green-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition-all duration-300 w-full sm:w-auto">
              Create Sub Election
            </button>
          </Link>
        </div>

        {/* Show/Hide Elections */}
        <div className="mb-6 text-center flex space-x-4 justify-center">
          <button
            onClick={() => setShowElections(!showElections)}
            className="px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition-all duration-300 w-full sm:w-auto"
          >
            {showElections ? "Hide Elections" : "Show Elections"}
          </button>
          <button
            onClick={() => setShowSubElections(!showSubElections)}
            className="px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition-all duration-300 w-full sm:w-auto"
          >
            {showSubElections ? "Hide Sub Elections" : "Show Sub Elections"}
          </button>
        </div>

        {/* Elections Without Location */}
        {showElections && electionsWithoutLocation.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-700">Elections</h2>
            <div className="grid grid-cols-2 gap-8 mt-4">
              {electionsWithoutLocation.map((election) => (
                <div
                  key={election._id}
                  className="bg-gray-100 shadow-lg rounded-lg p-4 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-indigo-700">
                      {election.name}
                    </h2>
                    <p className="text-md text-indigo-600">
                      Election ID: {election.electionId}
                    </p>
                    <p className="text-sm text-gray-600">
                      Start: {new Date(election.startTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      End: {new Date(election.endTime).toLocaleString()}
                    </p>
                    <p className="text-sm font-semibold mt-2">
                      Status:{" "}
                      <span
                        className={
                          getElectionStatus(
                            election.startTime,
                            election.endTime
                          ) === "Active"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {getElectionStatus(election.startTime, election.endTime)}
                      </span>
                    </p>

                    {/* Actions */}
                    {getElectionStatus(election.startTime, election.endTime) ===
                      "Inactive" && (
                      <div className="mt-6 flex justify-between space-x-6">
                        <Link href={`/election/edit/${election._id}`}>
                          <button className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedElectionId(election._id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="px-5 py-2 bg-yellow-500 text-white font-medium rounded-lg shadow-md hover:bg-red-400 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    )}

                    {getElectionStatus(election.startTime, election.endTime) ===
                      "Active" && (
                      <Link href={`/election/terminate/${election._id}`}>
                        <button className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-400 focus:ring-2 focus:ring-red-200 transition-all duration-300">
                          Terminate
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

       {/* Sub Elections */}
{showSubElections && electionsWithLocation.length > 0 && (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-indigo-700">
      Sub Elections
    </h2>
    <div className="grid grid-cols-2 gap-8 mt-4">
      {electionsWithLocation.map((election) => (
        <div
          key={election._id}
          className="bg-gray-100 shadow-lg rounded-lg p-4 hover:shadow-2xl transition-all duration-300"
        >
          <h2 className="text-xl font-semibold text-indigo-700">
            {election.name}
          </h2>
          <p className="text-md text-indigo-600">
            Election ID: {election.electionId}
          </p>
          <p className="text-sm text-gray-600">
            District: {election.district}
          </p>
          <p className="text-sm text-gray-600">
            Municipality: {election.municipality}
          </p>
          <p className="text-sm text-gray-600">
            Start: {new Date(election.startTime).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            End: {new Date(election.endTime).toLocaleString()}
          </p>
          <p className="text-sm font-semibold mt-2">
            Status:{" "}
            <span
              className={
                getElectionStatus(election.startTime, election.endTime) ===
                "Active"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {getElectionStatus(election.startTime, election.endTime)}
            </span>
          </p>

          {/* Sub Election Actions */}
          <div className="mt-6 flex justify-between space-x-6">
            {getElectionStatus(election.startTime, election.endTime) === "Inactive" ? (
              <>
                <Link href={`/election/edit/${election._id}`}>
                  <button className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setSelectedElectionId(election._id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="px-5 py-2 bg-yellow-500 text-white font-medium rounded-lg shadow-md hover:bg-red-400 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                >
                  Delete
                </button>
              </>
            ) : (
              <Link href={`/election/terminate/${election._id}`}>
                <button className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-400 focus:ring-2 focus:ring-red-200 transition-all duration-300">
                  Terminate
                </button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        {/* Confirmation Modal for Deleting Election */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold text-center mb-4">
                Are you sure you want to delete this election?
              </h3>
              <div className="flex justify-between">
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md"
                >
                  Yes
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-2 bg-gray-500 text-white font-medium rounded-lg shadow-md"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Election;
