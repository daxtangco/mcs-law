"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import SignInDropdown from "./SignInDropdown";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Fetch displayName from Firestore
  const fetchUserDetails = async (currentUser: User) => {
    try {
      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("email", "==", currentUser.email));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        setDisplayName(userData.displayName || currentUser.displayName || currentUser.email);
      } else {
        setDisplayName(currentUser.displayName || currentUser.email);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setDisplayName(currentUser.displayName || currentUser.email);
    }
  };

  // 🔹 Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserDetails(currentUser);
      } else {
        setDisplayName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 🔹 Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setDisplayName(null);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center py-4 relative">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-green-600">MCS Law</a>

          {/* Right Side: User Info or Sign In */}
          <div className="relative">
            {user ? (
              <div className="relative">
                {/* Profile Button */}
                <button
                  ref={buttonRef}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100"
                >
                  <span className="text-gray-700 font-semibold">{displayName}</span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div ref={dropdownRef} className="absolute right-0 mt-2 bg-white shadow-lg border rounded-lg p-3 z-50">
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:underline w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                {/* Sign In Button */}
                <button
                  ref={buttonRef}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100"
                >
                  <span className="text-gray-700 font-semibold">Sign in</span>
                </button>

                {/* Dropdown for Sign In */}
                <SignInDropdown
                  isOpen={isDropdownOpen}
                  onClose={() => setIsDropdownOpen(false)}
                  buttonRef={buttonRef}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
