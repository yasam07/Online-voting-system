'use client';

import React, { useState } from 'react';
import axios from 'axios';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [identifier, setIdentifier] = useState(''); // e.g., email or phone
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/verify-otp', { identifier, otp });

      if (response.data.success) {
        setMessage('✅ OTP verified successfully!');
      } else {
        setMessage(response.data.message || '❌ Invalid OTP.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || '❌ Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">🔒 Verify OTP</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identifier Input */}
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-600">
              Email/Phone
            </label>
            <input
              id="identifier"
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email or phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {/* OTP Input */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-600">
              OTP
            </label>
            <input
              id="otp"
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring focus:ring-indigo-300'
            } shadow-md font-semibold`}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        {/* Feedback Message */}
        {message && (
          <div
            className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium ${
              message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOtpPage;
