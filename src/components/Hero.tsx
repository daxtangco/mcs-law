"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";
import SignInBlock from "./SignInBlock";

const Hero = () => {
  const [user] = useAuthState(auth);

  return (
    <section className="pt-54 pb-44 bg-green-900 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left Side: Sign-In Block (Only Show If User is NOT Signed In) */}
        {!user && <SignInBlock />}

        {/* Right Side: Hero Text - Centered When Signed In */}
        <div
          className={`text-center ${
            user ? "w-full flex flex-col items-center justify-center" : "md:text-left"
          }`}
        >
          <h1 className="text-4xl font-bold">Legal Solutions You Can Trust</h1>
          <p className="mt-2 text-lg">Expert legal consultation and document processing.</p>
          <button className="bg-green-500 hover:bg-green-600 px-6 py-3 mt-4 rounded-md font-semibold">
            Legal Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
