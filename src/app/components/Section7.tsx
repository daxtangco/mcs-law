import Image from "next/image";
import placeholderImage from "/public/images/animeGirl.jpg"; // Update with the correct path

export default function Section7() {
  return (
    <section className="h-screen flex items-center justify-center bg-gray-600 px-10">
      {/* Left Side - Image */}
      <div className="w-1/2">
        <Image
          src={placeholderImage}
          alt="People typing on laptops"
          width={600}
          height={400}
          className="rounded-lg"
        />
      </div>

      {/* Right Side - Text & Button */}
      <div className="w-1/2 text-white px-10">
        <h1 className="text-4xl font-bold mb-4">Send Us A Message</h1>

        <p className="mb-2">Main Office</p>
        <p className="mb-2">123 Anywhere St.</p>
        <p className="mb-4">Any City ST 12345</p>

        <p className="font-bold mb-4">PWD parking available.</p>

        <p className="mb-2">Tel. (123) 456-7890</p>
        <p className="mb-2">Email: hello@reallygreatsite.com</p>
        <p className="mb-6">Social: @reallygreatsite</p>

        {/* Google Form Button */}
        <a
          href="#" // Placeholder link (to be updated)
          target="_blank"
          rel="noopener noreferrer"
          className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-gray-600 transition"
        >
          Consult now
        </a>
      </div>
    </section>
  );
}
