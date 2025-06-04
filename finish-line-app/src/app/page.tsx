'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { auth } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export default function HeroPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<string | null>(null);

  useEffect(() => {
    setSessionUser(sessionStorage.getItem("user"));
  }, []);

  console.log("Firebase Auth User:", user);
  console.log("Session Storage User:", sessionUser);

  if (!user && !sessionUser) {
    // router.push("/register");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to Finish Line
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Make it easier to manage your uni group projects today!
        </p>
        <div className="flex justify-center gap-4">
          <Button className="px-6 py-3 text-lg font-semibold rounded-full bg-white text-blue-600 hover:bg-gray-200">
            Create a Board
          </Button>

          <Button onClick={() => {
            sessionStorage.removeItem("user");
            signOut(auth);
          }} className="px-6 py-3 text-lg font-semibold rounded-full bg-white text-blue-600 hover:bg-gray-200">
            Logout
          </Button>

          <Button onClick={() => router.push('/login')} className="px-6 py-3 text-lg font-semibold rounded-full bg-white text-blue-600 hover:bg-gray-200">
            Log-in
          </Button>

          <Button onClick={() => router.push('/register')} className="px-6 py-3 text-lg font-semibold rounded-full bg-white text-blue-600 hover:bg-gray-200">
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
