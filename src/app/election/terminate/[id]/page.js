'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TerminateElection = ({ params }) => {
  const router = useRouter();
  const { id } = params; // Get the election ID from the URL
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [districts, setDistricts] = useState([]); // Store all district data
  const [municipalities, setMunicipalities] = useState([]);
  const [showSpecificForm, setShowSpecificForm] = useState(false); // Control form visibility

  // Fetch district data from the public directory
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch('/district.json');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched district data:', data);
          setDistricts(data); // Store the full list of districts
        }
      } catch (error) {
        console.error('Error fetching district data:', error);
      }
    };

    fetchDistricts();
  }, []);

  // Update municipalities based on the selected district
  useEffect(() => {
    if (district) {
      const selectedDistrict = districts.find((d) => d.name === district);
      setMunicipalities(selectedDistrict ? selectedDistrict.municipalities : []);
    } else {
      setMunicipalities([]);
    }
  }, [district, districts]);

  // Handle "Terminate All" election
  const handleTerminateAll = async () => {
    setLoading(true);
    try {
      const endpoint = `/api/elections/terminate/${id}`;
      const response = await fetch(endpoint, { method: 'PATCH' });

      if (response.ok) {
        setMessage('Election terminated successfully!');
      } else {
        setMessage('Failed to terminate election.');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred while terminating the election.');
    } finally {
      setLoading(false);
    }
  };

  // Handle "Terminate Specific" election
  const handleTerminateSpecific = async () => {
    if (!district || !municipality) {
      setMessage('Please select both district and municipality.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = `/api/elections/disablemuni/${id}`;
      const body = JSON.stringify({ municipality });

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (response.ok) {
        setMessage('Specific election terminated successfully!');
      } else {
        setMessage('Failed to terminate specific election.');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred while terminating the specific election.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-red-600 mb-8">Terminate Election</h1>

        <div className="flex justify-center space-x-6 mb-6">
          <button
            onClick={handleTerminateAll}
            disabled={loading}
            className={`px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg focus:ring-4 focus:ring-red-300 transition-all duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-400'
            }`}
          >
            {loading ? 'Terminating...' : 'Terminate All'}
          </button>

          <button
            onClick={() => setShowSpecificForm(true)} // Show the form when clicked
            disabled={loading}
            className={`px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg focus:ring-4 focus:ring-yellow-300 transition-all duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400'
            }`}
          >
            {loading ? 'Loading...' : 'Terminate Specific'}
          </button>

          <button
            onClick={() => router.push('/election')}
            className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-400 focus:ring-4 focus:ring-gray-200 transition-all duration-300"
          >
            Cancel
          </button>
        </div>

        {showSpecificForm && (
          <>
            <div className="mb-4">
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                Select District
              </label>
              <select
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">-- Select District --</option>
                {districts.map((d, index) => (
                  <option key={index} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {municipalities.length > 0 && (
              <div className="mb-4">
                <label htmlFor="municipality" className="block text-sm font-medium text-gray-700">
                  Select Municipality
                </label>
                <select
                  id="municipality"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">-- Select Municipality --</option>
                  {municipalities.map((m, index) => (
                    <option key={index} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleTerminateSpecific}
              disabled={loading || !district || !municipality}
              className={`px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg focus:ring-4 focus:ring-yellow-300 transition-all duration-300 ${
                loading || !district || !municipality ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400'
              }`}
            >
              {loading ? 'Terminating...' : 'Confirm Terminate'}
            </button>
          </>
        )}

        {message && <p className="mt-6 text-sm font-medium text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default TerminateElection;
