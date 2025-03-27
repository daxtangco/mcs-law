"use client";

import { useState } from "react";
import { auth, createUserWithEmailAndPassword } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle User Registration
  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect after registration
    } catch (err) {
      setError("Registration failed.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mt-4 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mt-2 border rounded-md"
        />
        <button onClick={handleRegister} className="w-full bg-green-600 text-white py-2 mt-4 rounded-md">
          Sign Up
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account? <a href="/auth" className="text-green-600 font-semibold">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
