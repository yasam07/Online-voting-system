'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setLoginInProgress(true);
    setError('');

    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await signIn('credentials', {
        nationalId,
        password,
        redirect: false,
      });

      if (!response?.error) {
        resolve();
        router.push('/');
      } else {
        setError('Invalid National ID or Password');
        reject(new Error('Login failed'));
      }
    });

    try {
      await toast.promise(savingPromise, {
        loading: 'Logging in...',
        success: 'Login Successful',
        error: 'Login Failed',
      });
    } catch {
      toast.error('Something went wrong, please try again');
    }

    setLoginInProgress(false);
  }

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl my-4">Login</h1>
      <form
        className="max-w-xs mx-auto bg-white p-4 shadow-md rounded"
        onSubmit={handleFormSubmit}
      >
        <input
          type="text"
          name="nationalId"
          aria-label="National ID"
          disabled={loginInProgress}
          placeholder="National ID"
          value={nationalId}
          onChange={(ev) => setNationalId(ev.target.value)}
          className="w-full p-2 mb-4 border border-gray-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-50"
        />
        <input
          type="password"
          name="password"
          aria-label="Password"
          disabled={loginInProgress}
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          className="w-full p-2 mb-4 border border-gray-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-50"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loginInProgress}
          className="w-full bg-primary text-white p-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          {loginInProgress ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm">
          Forgot your password?{' '}
          <a
            href="/forgot-password"
            className="text-blue-500 hover:underline focus:ring-2 focus:ring-blue-500"
          >
            Reset it here
          </a>
        </p>
      </div>
    </section>
  );
}
