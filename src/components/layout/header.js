'use client';
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";


export default function Header() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.fullName || userData?.nationalId;

  if (userName && userName.includes(' ')) {
    userName = userName.split(' ')[0];
  }

  const isAdmin = userData?.admin;

  return (
    <header className="bg-white shadow-sm py-6 px-10 w-full">
      <div className="flex items-center justify-between w-full">
        {/* Left Section: Logo & Navigation */}
        <div className="flex items-center gap-16">
          <Link href="/">
            <Image
              src="/O.png"
              alt="O-Voting"
              width={65}
              height={45}
              className="object-contain"
            />
          </Link>

          <nav className="flex space-x-16">
            <Link href="/" className="text-gray-800 font-semibold text-xl hover:underline px-5 py-3 mx-2">
              Home
            </Link>
            <Link href="/about" className="text-gray-800 font-semibold text-xl hover:underline px-5 py-3 mx-2">
              About
            </Link>
            <Link href="/contact" className="text-gray-800 font-semibold text-xl hover:underline px-5 py-3 mx-2">
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Section: User Menu */}
        <div className="flex items-center space-x-16 ml-auto">
          {status === "authenticated" ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="flex items-center text-gray-800 font-semibold text-xl">
                  <span className="mr-3">📊</span> <span className="hover:underline">Dashboard</span>
                </Link>
              )}

            

              {/* Profile */}
              <Link href="/profile" className="flex items-center text-gray-800 font-semibold text-xl hover:underline">
                <span className="mr-3">👤</span> {userName}!
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xl px-10 py-4 rounded-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-800 font-semibold text-xl hover:underline mx-3">
                Login
              </Link>
              <Link href="/register" className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xl px-10 py-4 rounded-full">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
