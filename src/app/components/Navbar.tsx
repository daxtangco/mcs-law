"use client";

import Image from "next/image";
import logo from "/public/images/logo.png"; // Ensure the image is in the `public` folder

export default function Navbar() {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur-md text-white py-3 px-6 shadow-md z-50 flex items-center">
      {/* Logo on the left */}
      <div className="mr-6">
        <Image src={logo} alt="Logo" width={50} height={50} className="rounded-full" />
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(`section${i + 1}`)}
            className="px-4 py-2 hover:bg-white/20 rounded transition"
          >
            Section {i + 1}
          </button>
        ))}
      </div>
    </nav>
  );
}
