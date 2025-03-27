"use client";
import { useState } from "react";
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword } from "@/lib/firebaseConfig";
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AuthPage() {
  const [input, setInput] = useState(""); // Can be email, phone, or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // Store user’s email after lookup


  const handleContinue = async () => {
    setError("");

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("email", "==", input) // Match Email
      );
      
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUserEmail(userData.email); // Store found email
        setShowPassword(true); 
      } else {
        setError("User not found. Check your input.");
      }
    } catch (err) {
      setError("Error checking user. Try again.");
      console.error(err);
    }
  };


  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, userEmail, password);
      console.log("User signed in successfully!");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Google Sign-In Successful");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center">Sign In</h2>

      {/* Input Field for Username, Email, or Phone */}
      {!showPassword && (
        <>
          <input 
            type="text" 
            placeholder="Username, Email, or Phone" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            className="w-full p-2 border rounded mt-4"
          />

          <button 
            onClick={handleContinue} 
            className="w-full bg-blue-500 text-white p-2 rounded mt-4 transition-transform hover:scale-105"
          >
            Continue
          </button>
        </>
      )}

      {/* Password Field (Slides in when showPassword is true) */}
      {showPassword && (
        <div className="transition-all duration-300 ease-in-out transform translate-y-5">
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 border rounded mt-4"
          />

          <button 
            onClick={handleEmailSignIn} 
            className="w-full bg-green-500 text-white p-2 rounded mt-4 transition-transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Google Sign-In Button */}
      <button 
        onClick={handleGoogleSignIn} 
        className="w-full bg-red-500 text-white p-2 rounded mt-2"
      >
        Sign in with Google
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
