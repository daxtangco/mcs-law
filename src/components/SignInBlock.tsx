"use client";

import { useState } from "react";
import InputField from "./InputField";
import GoogleLoginButton from "./GoogleLoginButton";
import RegisterModal from "./RegisterModal";
import { auth, db, signInWithEmailAndPassword } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const SignInBlock = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Username/Email, Step 2: Password
  const [identifier, setIdentifier] = useState(""); // Username or Email
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Check Firestore for Username OR Email
  const handleIdentifierCheck = async () => {
    setError("");
    setLoading(true);

    try {
      const usersRef = collection(db, "users");

      let userQuery;
      if (identifier.includes("@")) {
        // Email login
        userQuery = query(usersRef, where("email", "==", identifier));
      } else {
        // Username login
        userQuery = query(usersRef, where("username", "==", identifier));
      }

      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        setEmail(userData.email);

        // 🔹 Ensure same first name logic as Navbar
        const fetchedFirstName = userData.firstName || (userData.displayName ? userData.displayName.split(" ")[0] : userData.email);
        setFirstName(fetchedFirstName);

        setStep(2);
      } else {
        setError("Account not found. Please try again.");
      }
    } catch (err) {
      setError("Error checking credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Sign-In
  const handleSignIn = async () => {
    if (!email) return;
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully");
    } catch (err) {
      setError("Invalid password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md">
      {/* 🔹 Consistent Greeting (Matches Navbar) */}
      {step === 2 && firstName && (
        <h2 className="text-lg font-bold text-green-900">Hello, {firstName}!</h2>
      )}

      <h2 className="text-lg font-bold text-green-900">
        {step === 1 ? "Sign in to your account" : "Enter your password"}
      </h2>

      <div className="mt-3">
        {step === 1 ? (
          <>
            <InputField
              placeholder="Enter your username or email"
              value={identifier}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
            />
            <button
              onClick={handleIdentifierCheck}
              disabled={loading || !identifier}
              className="w-full bg-green-700 text-white px-6 py-2 rounded-md mt-3 font-semibold hover:bg-green-800 transition disabled:bg-gray-400"
            >
              {loading ? "Checking..." : "Continue"}
            </button>
          </>
        ) : (
          <>
            <InputField
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            <button
              onClick={handleSignIn}
              disabled={loading || !password}
              className="w-full bg-green-700 text-white px-6 py-2 rounded-md mt-3 font-semibold hover:bg-green-800 transition disabled:bg-gray-400"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      {step === 1 && (
        <>
          <div className="flex items-center justify-center my-3">
            <hr className="w-full border-gray-300" />
            <span className="px-3 text-gray-500">OR</span>
            <hr className="w-full border-gray-300" />
          </div>
          <GoogleLoginButton />
          <div className="mt-4">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="text-green-700 font-semibold text-sm hover:underline"
            >
              Create an account
            </button>
          </div>
        </>
      )}

      {/* Register Modal */}
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </div>
  );
};

export default SignInBlock;
