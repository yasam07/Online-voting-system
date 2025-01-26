'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [nationalId, setNationalId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/forgot-password', { nationalId, email });

      if (response.data.success) {
        toast.success('OTP sent to your email!');
        router.push('/verify-otp'); // Redirect to an OTP verification page (if applicable)
      } else {
        toast.error(response.data.message || 'User not found');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      toast.error('Failed to send OTP.');
    }

    setIsSubmitting(false);
  }

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl my-4">Forgot Password</h1>
      <form className="max-w-xs mx-auto" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nationalId"
          placeholder="Enter your National ID"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          disabled={isSubmitting}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white p-2 rounded"
        >
          {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>
    </section>
  );
}
