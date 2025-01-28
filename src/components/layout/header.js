'use client';
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { MdNotificationsActive } from "react-icons/md";  // Import the new notification icon

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
    <>
      <header className="bg-white shadow-sm px-2 py-2 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <nav className="flex items-center gap-8 text-gray-600 font-semibold">
            <Link href="/">
              <Image
                src="/O.png"
                alt="O-Voting"
                width={50}
                height={25}
                className="object-contain"
              />
            </Link>

            <div className="flex space-x-6">
              <Link
                href="/"
                className="px-3 py-1 text-lg text-gray-800 rounded-full relative group hover:underline"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="px-3 py-1 text-lg text-gray-800 rounded-full relative group hover:underline"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-3 py-1 text-lg text-gray-800 rounded-full relative group hover:underline"
              >
                Contact
              </Link>
            </div>
          </nav>

          <nav className="flex items-center gap-3 text-gray-600">
            {status === "authenticated" && (
              <>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center px-3 py-1 text-lg font-semibold text-gray-800 "
                  >
                    <span className="mr-2">📊</span> <span className="hover:underline">Dashboard</span>
                  </Link>
                )}

                {/* New Notification Icon (MdNotificationsActive) */}
                <div className="relative">
                  {/* <MdNotificationsActive className="text-xl cursor-pointer text-gray-800" /> */}
                  {/* Notification Badge */}
                 
                </div>
                <Link
                  href="/profile"
                  className="flex items-center px-3 py-1 text-lg font-semibold text-gray-800 cursor-pointer "
                >
                  <span className="mr-2">👤</span><span className=" hover:underline">{userName}!</span> 
                </Link>

                <button
                  onClick={() => signOut()}
                  className="bg-primary hover:bg-red-300 text-lg text-white rounded-full px-4 py-1"
                >
                  Logout
                </button>
              </>
            )}
            {status === "unauthenticated" && (
              <>
                <Link
                  href="/login"
                  className="text-lg text-gray-800 hover:underline"
                >
                  Login
                </Link>
                <Link
                  href={"/register"}
                  className="bg-primary text-white hover:bg-red-300  rounded-full px-8 py-2"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}