'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSession } from 'next-auth/react';

const CreateSubElectionPage = () => {
  const [name, setName] = useState('');
  const [electionId, setElectionId] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [districtData, setDistrictData] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();
  const { data: session, status } = useSession();

  // Fetch district and municipality data from district.json in the public folder
  useEffect(() => {
    const fetchDistrictData = async () => {
      setIsLoading(true); // Set loading to true when fetching data
      const response = await fetch('/district.json');
      const data = await response.json();
      setDistrictData(data);
      setIsLoading(false); // Set loading to false when data is fetched
    };
    fetchDistrictData();
  }, []);

  // Update municipalities based on the selected district
  useEffect(() => {
    if (district) {
      const selectedDistrict = districtData.find(d => d.name === district);
      setMunicipalities(selectedDistrict ? selectedDistrict.municipalities : []);
      setMunicipality(''); // Reset municipality when district changes
    }
  }, [district, districtData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const currentTime = new Date();
  
    if (startTime <= currentTime) {
      alert('Start time must be greater than the current time.');
      return;
    }
  
    if (endTime <= startTime) {
      alert('End time must be after the start time.');
      return;
    }

    setIsLoading(true); // Disable the submit button while submitting
  
    try {
      const response = await fetch('/api/elections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, electionId, startTime, endTime, district, municipality }),
      });
  
      if (response.ok) {
        alert('Sub Election created successfully!');
        router.push('/admin');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Error creating sub-election:', err);
      alert('Something went wrong.');
    } finally {
      setIsLoading(false); // Re-enable the button when done
    }
  };
  

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null; // Prevent rendering anything while redirecting
  }

  // Check for admin privileges
  const isAdmin = session?.user?.admin;

  if (!isAdmin) {
    return <div>Not an admin</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-center">Create Sub Election</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Sub Election Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Election ID</label>
            <input
              type="text"
              value={electionId}
              onChange={(e) => setElectionId(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="Unique ID for the sub election"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Start Time</label>
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              dateFormat="Pp"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Time</label>
            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              dateFormat="Pp"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>

          {/* District Dropdown */}
          <div>
            <label className="block text-sm font-medium">District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select District</option>
              {districtData.map((d, index) => (
                <option key={index} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Municipality Dropdown */}
          <div>
            <label className="block text-sm font-medium">Municipality</label>
            <select
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              required
              disabled={!district} // Disable if district is not selected
            >
              <option value="">Select Municipality</option>
              {municipalities.map((municipality, index) => (
                <option key={index} value={municipality}>
                  {municipality}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={`w-full px-4 py-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-600'} text-white rounded-lg hover:bg-blue-500`}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? 'Creating...' : 'Create Sub Election'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSubElectionPage;
