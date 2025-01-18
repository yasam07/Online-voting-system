'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSession } from 'next-auth/react';

const CreateElectionPage = () => {
  const [name, setName] = useState('');
  const [electionId, setElectionId] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const currentTime = new Date();
  
    // Log the current time and start time for debugging
    console.log('Current Time:', currentTime);
    console.log('Start Time:', startTime);
  
    if (startTime <= currentTime) {
      alert('Start time must be greater than the current time.');
      return;
    }
  
    if (endTime <= startTime) {
      alert('End time must be after the start time.');
      return;
    }
  
    try {
      const response = await fetch('/api/elections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, electionId, startTime, endTime }),
      });
  
      if (response.ok) {
        alert('Election created successfully!');
        router.push('/admin'); // Redirect to admin dashboard or another page
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Error creating election:', err);
      alert('Something went wrong.');
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
        <h1 className="text-2xl font-bold text-center">Create Election</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Election Name</label>
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
              placeholder="Unique ID for the election"
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
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          >
            Create Election
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateElectionPage;
