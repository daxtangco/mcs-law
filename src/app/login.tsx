"use client"; // Enables state and event handling in Next.js

import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [showModal, setShowModal] = useState(true); // Controls popup visibility

  const correctUsername = "PJC";
  const correctPassword = "1234";

  // Handle login logic
  const handleLogin = () => {
    if (username === correctUsername && password === correctPassword) {
      setMessage("Login Successful 🎉");
      setTimeout(() => {
        setIsLoggedIn(true); // Mark user as logged in
        setShowModal(false); // Hide the login popup
      }, 1000);
    } else {
      setMessage("Invalid Credentials ❌");
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
            <h2 className="text-lg font-bold">Login</h2>

            {/* Username Input */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 rounded"
            />

            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded"
            />

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Login
            </button>

            {/* Message Display */}
            {message && <p className="mt-2">{message}</p>}
          </div>
        </div>
      )}

      {/* Show welcome message when logged in */}
      {isLoggedIn && <p className="text-center text-xl">Welcome, PJ! 🎉</p>}
    </>
  );
}
