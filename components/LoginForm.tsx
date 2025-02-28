"use client";

import { useState } from "react";

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  const DEBUG_CREDENTIALS = {
    username: "Kagz",
    password: "0000",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === DEBUG_CREDENTIALS.username && password === DEBUG_CREDENTIALS.password) {
      setFadeOut(true);
      setTimeout(() => onLogin(), 300);
    } else {
      setMessage("❌ Incorrect username or password");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-black/40 backdrop-blur-lg text-white rounded-xl shadow-lg w-80">
        <h2 className="text-center text-2xl font-semibold">Login</h2>

        <label className="flex flex-col">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-white/50 p-2 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        <label className="flex flex-col">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-white/50 p-2 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        <button type="submit" className="bg-blue-500 hover:bg-blue-700 py-2 rounded text-white font-semibold">
          Login
        </button>

        {message && <p className="text-red-500 text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
