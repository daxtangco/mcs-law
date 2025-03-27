"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebaseConfig"; // ✅ Correct import
import { useState } from "react";
import Image from "next/image";

const GoogleLoginButton = () => {
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Popup closed before authentication. Please try again.");
      } else {
        setError("An error occurred during sign-in. Please try again.");
      }
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleGoogleLogin}
        className="w-full border border-gray-300 flex items-center justify-center py-2 rounded-md hover:bg-gray-100 transition"
      >
        <Image src="/assets/google-logo.svg" alt="Google Logo" width={20} height={20} />
        <span className="ml-2 text-gray-700 font-medium">Sign in with Google</span>
      </button>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default GoogleLoginButton;
