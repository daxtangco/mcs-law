"use client";
import { useRef, useEffect } from "react";
import InputField from "./InputField";
import GoogleLoginButton from "./GoogleLoginButton";

const SignInDropdown = ({
  isOpen,
  onClose,
  buttonRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>; // Fix: Allow null
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg p-5 z-50"
    >
      <h2 className="text-xl font-bold text-green-900 text-center">Sign in to your account</h2>
      <p className="text-gray-600 text-center text-sm mt-1">
        Enter your username, email, or mobile number.
      </p>

      <div className="mt-3">
        <InputField placeholder="Username, email, mobile" />
        <button className="w-full bg-gray-300 text-gray-700 px-6 py-2 rounded-md mt-3 font-semibold">
          Continue
        </button>
      </div>

      <div className="flex items-center justify-center my-3">
        <hr className="w-full border-gray-300" />
        <span className="px-3 text-gray-500">OR</span>
        <hr className="w-full border-gray-300" />
      </div>

      {/* Google Login Button */}
      <GoogleLoginButton />

      <div className="text-center mt-4">
        <a href="#" className="text-green-700 font-semibold text-sm hover:underline">
          Create an account
        </a>
      </div>
    </div>
  );
};

export default SignInDropdown;
