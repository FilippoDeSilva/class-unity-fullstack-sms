'use client';

import { ClerkLoading, useSignIn } from "@clerk/nextjs";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const { signIn, setActive } = useSignIn();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const role = user.publicMetadata.role;
      if (role) {
        router.push(`/${role}`);
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) {
      setError("Sign in is not ready yet. Please try again.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: username,
        password,
      });

      if (result.status === "complete") {
        if (setActive) {
          await setActive({ session: result.createdSessionId });
        }
        // Loading state will remain while redirecting
        router.push(`/${user?.publicMetadata.role}`);
      } else {
        setIsLoading(false);
        console.error("Sign in failed", result);
        setError("Sign in failed. Please check your credentials and try again.");
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error("Error during sign in:", err);
      setError(err.errors?.[0]?.message || "An error occurred during sign in. Please try again.");
    }
  };

  if (!isLoaded) {
    return <ClerkLoading />
  }

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <div className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2">
        <div className="text-xl font-bold flex items-center flex-col gap-2">
          <Image
            src="/cpu-logo.jpg"
            alt="logo"
            width={100}
            height={100}
            className="rounded-full"
            priority
          />
          <h1>Class Unity</h1>
          <h2 className="text-gray-400">Sign In</h2>
        </div>
       
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-xs text-gray-500">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 rounded-md ring-1 ring-gray-300"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs text-gray-500">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 rounded-md ring-1 ring-gray-300"
              required
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button 
            type="submit" 
            className={`bg-blue-500 text-white rounded-md text-sm p-[10px] mt-2 flex items-center justify-center
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
