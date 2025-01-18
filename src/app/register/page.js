"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [district, setDistrict] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(""); // Date of Birth state
  const [gender, setGender] = useState(""); // Gender state
  const [districtsData, setDistrictsData] = useState([]);
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);

  // Fetch District data from JSON file
  useEffect(() => {
    async function fetchDistrictData() {
      try {
        const response = await fetch("/District.json");
        const data = await response.json();
        setDistrictsData(data);
      } catch (error) {
        console.error("Error fetching district data:", error);
      }
    }
    fetchDistrictData();
  }, []);

  const municipalities = districtsData.find((d) => d.name === district)?.municipalities || [];

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setCreatingUser(true);
    setError("");
    setUserCreated(false);

    if (
      !fullName ||
      !phoneNumber ||
      !fatherName ||
      !nationalId ||
      !dateOfBirth ||
      !gender ||
      !password ||
      !confirmPassword ||
      !district ||
      !municipality
    ) {
      setError("Please fill out all fields.");
      setCreatingUser(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setCreatingUser(false);
      return;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        fullName,
        phoneNumber,
        fatherName,
        nationalId,
        dateOfBirth,
        gender,
        password,
        district,
        municipality,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setUserCreated(true);
    } else {
      setError("An error occurred. Please try again.");
    }
    setCreatingUser(false);
  }

  return (
    <div>
      <section className="mt-8">
        <h1 className="text-center text-primary text-4xl my-4">Register</h1>

        {userCreated && (
          <div className="my-4 text-center">
            User created.
            <br />
            Now you can{" "}
            <Link className="underline" href={"/login"}>
              login &raquo;
            </Link>
          </div>
        )}

        {error && (
          <div className="my-4 text-center">
            {typeof error === "string" ? error : "An error occurred!!"}
            <br />
            Please enter your correct data...
          </div>
        )}

        <form
          className="block max-w-md mx-auto bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-200"
          onSubmit={handleFormSubmit}
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create Your Account
          </h2>

          {/* Full Name */}
          <div className="mb-6">
            <input
              type="text"
              disabled={creatingUser}
              placeholder="Full Name"
              value={fullName}
              onChange={(ev) => setFullName(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <input
              type="text"
              disabled={creatingUser}
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(ev) => setPhoneNumber(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Father's Name */}
          <div className="mb-6">
            <input
              type="text"
              disabled={creatingUser}
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
              disabled={creatingUser}
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
              disabled={creatingUser}
              placeholder="Date of Birth"
              value={dateOfBirth}
              onChange={(ev) => setDateOfBirth(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gender */}
          <div className="mb-6">
            <select
              disabled={creatingUser}
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

          {/* Password */}
          <div className="mb-6">
            <input
              type="password"
              disabled={creatingUser}
              placeholder="Password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <input
              type="password"
              disabled={creatingUser}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* District */}
          <div className="mb-6">
            <select
              disabled={creatingUser}
              value={district}
              onChange={(ev) => setDistrict(ev.target.value)}
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
              disabled={creatingUser || !district}
              value={municipality}
              onChange={(ev) => setMunicipality(ev.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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

          <button
            type="submit"
            disabled={creatingUser}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-300"
          >
            {creatingUser ? "Creating Account..." : "Register"}
          </button>

          <div className="my-6 text-center text-gray-600 border-t pt-6">
            Already have an account?{" "}
            <Link
              className="underline text-blue-500 hover:text-blue-700"
              href={"/login"}
            >
              Login here
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
