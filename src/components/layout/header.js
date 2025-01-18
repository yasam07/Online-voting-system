'use client'
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
export default function Header() {
  const session =useSession();
  console.log(session)
  const status =session?.status;
  const userData=session.data?.user;
  let userName=userData?.fullName || userData?.nationalId;
  
  if(userName && userName.includes(' ')){
    userName=userName.split(' ')[0]
  }
  
  const isAdmin = userData?.admin
 console.log(isAdmin) 
  return (
    <>
      <header className="flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-500 font-semibold">
        <Link className="text-primary font-semibold text-2xl" href="/">
          Online Voting
        </Link>
        <div className="flex space-x-6">
  <Link
    href="/"
    className="px-2 py-1 bg-blue-400 text-white font-medium text-lg rounded-lg shadow-md hover:bg-blue-100 hover:shadow-lg transition duration-200"
  >
    Home
  </Link>
  <Link
    href="/about"
    className="px-2 py-1 bg-green-400 text-white font-medium text-lg rounded-lg shadow-md hover:bg-green-100 hover:shadow-lg transition duration-200"
  >
    About
  </Link>
  <Link
    href="/contact"
    className="px-2 py-1 bg-purple-400 text-white font-medium text-lg rounded-lg shadow-md hover:bg-purple-100 hover:shadow-lg transition duration-200"
  >
    Contact
  </Link>
</div>


        
        </nav>
        <nav className="flex items-center gap-4 text-gray-500">
          {status === 'authenticated' && (
            <>
      <div className="flex items-center px-1 bg-gray-50 rounded-lg shadow-sm text-lg font-semibold text-gray-800">
  Hey, {userName}!
</div>


{isAdmin&&(

  <div>
    <Link
      href="/admin"
      className="inline-flex items-center px-1 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
       DashBoard
    </Link>
  </div>
)}

              <button

      onClick={()=>signOut()}
              className="bg-primary text-white rounded-full px-1 py-1 hover:bg-primary-100"
            >
              Logout
            </button>
            </>

          )}
          {status === 'unauthenticated' &&(
     <>

          <Link href="/login">Login</Link>
        <Link
            href={"/register"}
            className="bg-primary text-white rounded-full px-8 py-2"
          >
            Register
          </Link>
     </>
          )}
        </nav>
      </header>
    </>
  );
}
