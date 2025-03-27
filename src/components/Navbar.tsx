"use client";
import { useState, useRef } from "react";
import SignInDropdown from "./SignInDropdown";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center py-4 relative">

          <a href="/" className="text-2xl font-bold text-green-600">MCS Law</a>

          <div className="hidden md:flex space-x-6">
            <a href="#services" className="text-gray-700 hover:text-green-600">Services</a>
            <a href="#about" className="text-gray-700 hover:text-green-600">About Us</a>
            <a href="#contact" className="text-gray-700 hover:text-green-600">Contact</a>
          </div>

          <div className="relative">
            <button
              ref={buttonRef}
              onClick={toggleDropdown}
              className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100"
            >
              <span className="text-gray-700 font-semibold">Sign in</span>
            </button>

            <SignInDropdown
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              buttonRef={buttonRef}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
