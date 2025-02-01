'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
export default function EditElectionPage({ params }) {
  const { id } = params; // Extract `id` from the dynamic route
  const router = useRouter();

  const [electionData, setElectionData] = useState({
    name: '',
    electionId: '',
    startTime: '',
    endTime: '',
    district: '',
    municipality: '',
  });
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  useEffect(() => {
    if (!id) {
      toast.error('Election ID is missing.');
      return;
    }

    // Fetch election details
    const fetchElection = async () => {
      try {
        const response = await fetch(`/api/elections/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch election details.');
        }

        const data = await response.json();
        const election = data.election;

        setElectionData({
          name: election.name,
          electionId: election.electionId,
          startTime: new Date(election.startTime).toISOString().slice(0, 16), // Format for input[type="datetime-local"]
          endTime: new Date(election.endTime).toISOString().slice(0, 16),
          district: election.district || '',
          municipality: election.municipality || '',
        });

        setLoading(false);
      } catch (err) {
        toast.error(err.message || 'Something went wrong.');
        setLoading(false);
      }
    };

    fetchElection();
  }, [id]);

  // Load district and municipality data from district.json
  useEffect(() => {
    const fetchDistrictData = async () => {
      try {
        const response = await fetch('/district.json');
        if (!response.ok) {
          throw new Error('Failed to load district data.');
        }

        const data = await response.json();
        setDistricts(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load district data.');
      }
    };

    fetchDistrictData();
  }, []);

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setElectionData((prevData) => ({
      ...prevData,
      district: selectedDistrict,
      municipality: '', // Reset municipality when district changes
    }));

    // Find municipalities for the selected district
    const districtData = districts.find((district) => district.name === selectedDistrict);

    // Update the municipalities based on the selected district
    if (districtData) {
      setMunicipalities(districtData.municipalities);
    } else {
      setMunicipalities([]); // Reset municipalities if no district is found
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setElectionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/elections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: electionData.name,
          startTime: new Date(electionData.startTime).toISOString(),
          endTime: new Date(electionData.endTime).toISOString(),
          district: electionData.district,
          municipality: electionData.municipality,
        }),
      });

      if (response.ok) {
        toast.success('Election updated successfully!');
        router.push('/election');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update the election.');
      }
    } catch (err) {
      toast.error('Something went wrong while updating the election.');
    }
  };

  if (loading) {
    return <div>Loading election details...</div>;
  }
  const isAdmin = session?.user?.admin;

  if (!isAdmin) return <div>Access denied. You are not an admin.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-extrabold text-center text-green-600 mb-8">
          Edit Election
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Election Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={electionData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="electionId" className="block text-sm font-medium text-gray-700">
              Election ID
            </label>
            <input
              type="text"
              id="electionId"
              name="electionId"
              value={electionData.electionId}
              disabled
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={electionData.startTime}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={electionData.endTime}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

         {/* Conditionally Render District and Municipality */}
{electionData.district && districts.length > 0 && (
  <>
    <div>
      <label htmlFor="district" className="block text-sm font-medium text-gray-700">
        District
      </label>
      <select
        id="district"
        name="district"
        value={electionData.district}
        onChange={handleDistrictChange}
        required
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Select District</option>
        {districts.map((district) => (
          <option key={district.name} value={district.name}>
            {district.name}
          </option>
        ))}
      </select>
    </div>
    {municipalities.length > 0 && (
      <div>
        <label htmlFor="municipality" className="block text-sm font-medium text-gray-700">
          Municipality
        </label>
        <select
          id="municipality"
          name="municipality"
          value={electionData.municipality}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select Municipality</option>
          {municipalities.map((municipality) => (
            <option key={municipality} value={municipality}>
              {municipality}
            </option>
          ))}
        </select>
      </div>
    )}
  </>
)}


          <div className="flex justify-between space-x-6">
            <button
              type="button"
              onClick={() => router.push('/election')}
              className="px-5 py-2 bg-gray-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-400 focus:ring-2 focus:ring-green-200 transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
