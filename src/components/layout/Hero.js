'use client'
import Image from "next/image";
import Right from "./icons/Right";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Hero() {
  const { data: session, status } = useSession();

  const nationalId = session?.user?.nationalId || '';

  return (
    <section className="hero mt-4">
      <div className="py-12">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-center leading-tight text-gray-900 mb-6">
          Your Voice
          <br />
          <span className="text-primary">Matters </span>
          <br />
          in Every
          <br />
          <span className="text-indigo-600">Vote</span>
        </h1>

        <p className="my-6 text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
          Voting is the power to shape the future, a simple yet significant choice in life.
        </p>

        <div className="flex gap-4 text-sm">
          {nationalId && (
            <Link href="/voting">
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold uppercase flex gap-2 px-7 py-3 rounded-full items-center shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Go for Voting
                <Right />
              </button>
            </Link>
          )}
             {!nationalId && (
            <Link href="/login">
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold uppercase flex gap-2 px-7 py-3 rounded-full items-center shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Go for Voting
                <Right />
              </button>
            </Link>
          )}

          <button className="flex items-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-full border border-gray-300 hover:bg-gray-200 hover:text-gray-800 shadow-sm transition-all duration-300 ease-in-out">
            Learn More
            <Right />
          </button>
        </div>
      </div>
      <div className="relative">
        <Image
          src="/ballot.png" // Update this to a voting-related image if available
          layout="fill"
          objectFit="contain"
          alt="voting"
        />
      </div>
    </section>
  );
}
