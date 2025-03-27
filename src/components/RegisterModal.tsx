"use client";

import { useState } from "react";
import { auth, db, createUserWithEmailAndPassword } from "@/lib/firebaseConfig";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, query, where, collection, getDocs } from "firebase/firestore";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Check if username already exists
  const isUsernameTaken = async (username: string): Promise<boolean> => {
    const userDoc = await getDoc(doc(db, "usernames", username));
    return userDoc.exists();
  };

  // Check if email already exists
  const isEmailTaken = async (email: string): Promise<boolean> => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { username, firstName, lastName, email, phone, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // Check if username is already taken
      if (await isUsernameTaken(username)) {
        setError("Username is already taken. Please choose another.");
        setLoading(false);
        return;
      }

      // Check if email is already taken
      if (await isEmailTaken(email)) {
        setError("Email is already registered. Try signing in.");
        setLoading(false);
        return;
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const displayName = `${firstName} ${lastName}`.trim(); // Combine first & last name

      // Update Firebase Auth Profile with Display Name
      await updateProfile(user, { displayName });

      // Store User Data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        firstName,
        lastName,
        email,
        phone,
        displayName, // Store full name for consistency
        createdAt: new Date(),
      });

      // Store the username in a separate collection to ensure uniqueness
      await setDoc(doc(db, "usernames", username), { uid: user.uid });

      // Close the modal after successful registration
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Create an Account</h2>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Username */}
          <div>
            <label className="text-gray-700 block mb-1">Username (must be unique)</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a unique username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>

          {/* First Name */}
          <div>
            <label className="text-gray-700 block mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-gray-700 block mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-gray-700 block mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-700 block mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Close Button */}
        <button onClick={onClose} className="mt-4 text-gray-500 hover:text-gray-700 block text-center w-full">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
