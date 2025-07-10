"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EditVoterPage() {
  const router = useRouter();
  const { id } = useParams(); // Get the voter ID from the route

  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  
  const [nationalId, setNationalId] = useState("");
  const [district, setDistrict] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [districtsData, setDistrictsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch districts data
  useEffect(() => {
    async function fetchDistrictData() {
      try {
        const response = await fetch("/District.json");
        const data = await response.json();
        console.log("District Data Loaded:", data); // Log district data for verification
        setDistrictsData(data);
      } catch (err) {
        console.error("Error fetching district data:", err);
        setError("Failed to load district data.");
      }
    }
    fetchDistrictData();
  }, []);

  // Filter municipalities based on the selected district
  const municipalities =
    districtsData.find((d) => d.name === district)?.municipalities || [];

  // Fetch voter data for editing
  useEffect(() => {
    async function fetchVoterData() {
      try {
        const response = await fetch(`/api/manage-voter/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch voter data.");
        }
        const data = await response.json();
        console.log("Voter Data:", data); // Log the voter data for debugging
        const voter = data.voter;
        setFullName(voter.fullName || "");
        setFatherName(voter.fatherName || "");
        
        setNationalId(voter.nationalId || "");
        setDistrict(voter.district || "");
        setMunicipality(voter.municipality || ""); // Set municipality if available
        setDateOfBirth(voter.dateOfBirth ? voter.dateOfBirth.split("T")[0] : "");
        setGender(voter.gender || "");
      } catch (err) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchVoterData();
  }, [id]);

  // Handle form submission
  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setSaving(true);
    setError("");

    if (
      !fullName ||
      !fatherName ||
      !nationalId ||
      !dateOfBirth ||
      !gender ||
      !district ||
      !municipality
    ) {
      setError("Please fill out all fields.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/manage-voter/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          fullName,
          fatherName,
          nationalId,
          dateOfBirth: new Date(dateOfBirth), // Convert to Date object
          gender,
          district,
          municipality,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to update voter.");
      }

      router.push("/manage-voter"); // Redirect to the Manage Voter page
    } catch (err) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  }

  // Handle Cancel button click
  function handleCancel() {
    router.push("/manage-voter"); // Redirect to the Manage Voter page
  }

  // Display loading state
  if (loading) {
    return <p className="text-center text-gray-600">Loading voter data...</p>;
  }

  // Display error state
  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  return (
    <div>
      <section className="mt-8">
        <h1 className="text-center text-primary text-4xl my-4">Edit Voter</h1>

        <form
          className="block max-w-md mx-auto bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-200"
          onSubmit={handleFormSubmit}
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Update Voter Information
          </h2>

          {/* Full Name */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(ev) => setFullName(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Father's Name */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Father's Name"
              value={fatherName}
              onChange={(ev) => setFatherName(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          {/* National ID */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="National ID"
              value={nationalId}
              onChange={(ev) => setNationalId(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-6">
            <input
              type="date"
              value={dateOfBirth}
              onChange={(ev) => setDateOfBirth(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gender */}
          <div className="mb-6">
            <select
              value={gender}
              onChange={(ev) => setGender(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* District */}
          <div className="mb-6">
            <select
              value={district}
              onChange={(ev) => {
                setDistrict(ev.target.value);
                setMunicipality(""); // Reset municipality when district changes
                console.log('Selected District:', ev.target.value); // Debug log
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>
                Select District
              </option>
              {districtsData.map((districtItem) => (
                <option key={districtItem.name} value={districtItem.name}>
                  {districtItem.name}
                </option>
              ))}
            </select>
          </div>

          {/* Municipality */}
          <div className="mb-6">
            <select
              value={municipality}
              onChange={(ev) => setMunicipality(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              disabled={!district}
            >
              <option value="" disabled>
                Select Municipality
              </option>
              {municipalities.map((municipalityName) => (
                <option key={municipalityName} value={municipalityName}>
                  {municipalityName}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-300"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleCancel}
            className="w-full mt-4 bg-gray-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </form>
      </section>
    </div>
  );
}
