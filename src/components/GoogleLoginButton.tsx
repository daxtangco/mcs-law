"use client";

import Image from "next/image";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebaseConfig";

const GoogleLoginButton = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Google sign-in successful!");
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full border border-gray-300 flex items-center justify-center py-2 rounded-md hover:bg-gray-100 transition active:scale-95"
    >
      <Image src="/assets/google-logo.svg" alt="Google Logo" width={20} height={20} />
      <span className="ml-2 text-gray-700 font-medium">Sign in with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
