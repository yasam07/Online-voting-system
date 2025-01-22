'use client'
import { useSession } from "next-auth/react";
import React from "react";

const ProfilePage = () => {
  const { data: session, status } = useSession();

  // Handle loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-teal-100 to-green-100">
        <p className="text-xl font-semibold text-gray-600 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  // Handle unauthenticated state
  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-100 via-blue-100 to-green-100">
        <h1 className="text-3xl font-bold text-teal-600 mb-4">
          Access Denied
        </h1>
        <p className="text-lg text-gray-600">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  // Extract session data with default values
  const nationalId = session?.user?.nationalId || "";
  const fullName = session?.user?.fullName || "";
  const district = session?.user?.district || "";
  const municipality = session?.user?.municipality || "";
  const admin = session?.user?.admin || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-20 to-teal-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-3xl font-bold text-teal-700 mb-6">
          Profile Information
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
             Voter
          </h2>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p className="hover:text-teal-600 transition-colors duration-300">
              <span className="font-medium">Full Name: </span>
              {fullName}
            </p>
            <p className="hover:text-teal-600 transition-colors duration-300">
              <span className="font-medium">National ID: </span>
              {nationalId}
            </p>
            <p className="hover:text-teal-600 transition-colors duration-300">
              <span className="font-medium">District: </span>
              {district}
            </p>
            <p className="hover:text-teal-600 transition-colors duration-300">
              <span className="font-medium">Municipality: </span>
              {municipality}
            </p>
            <p className="hover:text-teal-600 transition-colors duration-300">
              <span className="font-medium">Admin: </span>
              {admin ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
