'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const About = () => {
  return (
    <div className="about-page">
      {/* About the Voting System */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-400 text-white text-center">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-6">About Our Voting System</h1>
          <p className="text-lg leading-relaxed">
            Our online voting system is a secure, transparent, and user-friendly platform designed to make elections more accessible and reliable. By embracing modern technology, we empower communities to participate in the democratic process effortlessly. It allows eligible voters to cast their votes through the internet, making it more convenient and efficient compared to traditional in-person voting.
          </p>
        </div>
      </section>

      {/* How to Use the System */}
      <section className="py-16 bg-gray-50 text-gray-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Register Link */}
            <Link href="/register" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">📝 Register</h3>
              <p>Sign up as a verified voter with secure credentials.</p>
            </Link>

            {/* Nominate Link (with no action for now) */}
            <Link href="/candidates" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">🏛 Nominate</h3>
              <p>Candidates register and present their platform.</p>
            </Link>

            {/* Vote Link */}
            <Link href="/voting" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">🗳 Vote</h3>
              <p>Cast your vote securely and anonymously.</p>
            </Link>

            {/* Track Results Link */}
            <Link href="/result" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">📡 Track Results</h3>
              <p>View updates of election results.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-white text-gray-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Technology Behind the System</h2>
          <p className="text-lg mb-8">
            We use state-of-the-art technology to build a seamless, secure, and scalable platform. Here are the key technologies:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex flex-col items-center">
              <Image src="/mongodb.png" alt="MongoDB" width={80} height={80} className="mb-4" />
              <h3 className="text-xl font-semibold">MongoDB</h3>
              <p className="text-gray-600 text-sm">A flexible NoSQL database for storing election and voter data.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex flex-col items-center">
              <Image src="/expressjs.png" alt="Express.js" width={80} height={80} className="mb-4" />
              <h3 className="text-xl font-semibold">Express.js</h3>
              <p className="text-gray-600 text-sm">Backend framework for managing APIs and server-side logic.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex flex-col items-center">
              <Image src="/react.png" alt="React" width={80} height={80} className="mb-4" />
              <h3 className="text-xl font-semibold">React</h3>
              <p className="text-gray-600 text-sm">Dynamic and responsive front-end user interface.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex flex-col items-center">
              <Image src="/node.png" alt="Node.js" width={80} height={80} className="mb-4" />
              <h3 className="text-xl font-semibold">Node.js</h3>
              <p className="text-gray-600 text-sm">JavaScript runtime for scalable server-side development.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition flex flex-col items-center">
              <Image src="/nextjs.png" alt="Next.js" width={80} height={80} className="mb-4" />
              <h3 className="text-xl font-semibold">Next.js</h3>
              <p className="text-gray-600 text-sm">Fast and reliable frontend framework for server-side rendering.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
