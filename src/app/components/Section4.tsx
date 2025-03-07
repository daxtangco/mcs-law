import Image from "next/image";

export default function Section4() {
  return (
    <section className="h-screen flex flex-col items-center justify-center bg-gray-600 px-10 text-white">
      <h1 className="text-4xl font-bold mb-10">Why work with us</h1>

      <div className="grid grid-cols-4 gap-6 max-w-5xl w-full">
        {/* First 2 Columns - Text */}
        {[
          "We know and understand the law",
          "We have decades of legal experience",
          "We are your advocate",
          "We provide the counsel you need",
        ].map((text, index) => (
          <div key={index} className="text-center">
            <h2 className="font-semibold">{text}</h2>
          </div>
        ))}

        {/* Last 2 Columns - Images (from Public folder) */}
        <Image src="/images/cat.jpg" alt="Handshake" width={600} height={400} className="rounded-lg" />
        <Image src="/images/cat2.jpg" alt="Wow" width={600} height={400} className="rounded-lg" />
        <Image src="/images/kangel.jpg" alt="Wow" width={600} height={400} className="rounded-lg" />
        <Image src="/images/astolfo.jpg" alt="Wow" width={600} height={400} className="rounded-lg" />
      </div>
    </section>
  );
}
