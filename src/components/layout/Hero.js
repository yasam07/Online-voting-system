'use client';

import { useState } from 'react';
import Image from "next/image";
import Right from "./icons/Right";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

export default function Hero() {
  const { data: session, status } = useSession();
  const [showFirstMessage, setShowFirstMessage] = useState(true);

  const nationalId = session?.user?.nationalId || '';
  const admin = session?.user?.admin || false; // Adjust based on your session structure
  const activeElection = session?.activeElection || null;

  // Function to handle voting button click for admins
  const handleVotingClick = (e) => {
    if (admin) {
      e.preventDefault(); // Prevent navigation if the user is an admin
      toast.error("Admin can't vote."); // Show the toast error message
    }
  };

  return (
    <section className="hero mt-4 mx-10">
      <div className="py-12">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-center leading-tight text-gray-900 mb-6">
          Your Voice
          <br />
          <span className="text-primary">Matters </span>
          <br />
          in Every
          <br />
          <span className="text-indigo-600">Vote</span>
        </h1>

        <p className="my-6 text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto text-center">
          Voting is the power to shape the future, a simple yet significant choice in life.
        </p>

        {activeElection ? (
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-lg shadow-lg p-4 mb-4 text-center transition-transform transform hover:scale-105 animate-fadeIn max-w-xs mx-auto">
            <h2 className="text-lg font-extrabold">
              Welcome to the {activeElection.name}!
            </h2>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 text-white rounded-lg shadow-lg p-4 mb-4 text-center animate-fadeIn max-w-xs mx-auto">
            {showFirstMessage ? (
              <p className="text-md font-semibold">No election running at the moment.</p>
            ) : (
              <p className="text-md font-semibold">Kindly login to see Election Update.</p>
            )}
          </div>
        )}

        <div className="flex gap-4 text-sm justify-center mt-10">
          {nationalId ? (
            <Link href="/voting">
              <button
                onClick={handleVotingClick} // Call the handleVotingClick function
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold uppercase flex gap-2 px-7 py-3 rounded-full items-center shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Go for Voting
                <Right />
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold uppercase flex gap-2 px-7 py-3 rounded-full items-center shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Go for Voting
                <Right />
              </button>
            </Link>
          )}

          <button className="flex items-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-full border border-gray-300 hover:bg-gray-200 hover:text-gray-800 shadow-sm transition-all duration-300 ease-in-out">
            Learn More
            <Right />
          </button>
        </div>

        {/* New Line for See Result Button */}
        <div className="flex justify-center mt-10">
          <Link href="/result">
            <button className="flex justify-center w-80 items-center gap-2 py-2 px-4 bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 text-white font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out hover:scale-105">
              See Result
              <Right />
            </button>
          </Link>
        </div>
      </div>

      {/* Single Image Display Without Frame */}
      <div className="flex justify-center mt-10">
        <Image
          src="/ballot.png"
          width={500}
          height={350}
          alt="Voting Ballot"
          className="object-cover"
        />
      </div>

      {/* Toast Container for toast notifications */}
      <ToastContainer />
    </section>
  );
}

// ToastContainer component from react-toastify should be included in your app, like this:
// If it's not already there, you can add it to your root component (e.g., _app.js)
import { ToastContainer } from 'react-toastify';
