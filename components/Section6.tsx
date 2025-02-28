export default function Section6() {
    return (
      <section className="h-screen flex flex-col items-center justify-center bg-white text-black snap-start px-10">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-6">Testimonials</h1>
  
        {/* Subtitle */}
        <p className="text-gray-500 text-lg mb-10 font-semibold">
          What our clients say about us
        </p>
  
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          {[
            { name: "Connor Hamilton" },
            { name: "Helene Paquet" },
            { name: "Juliana Silva" },
          ].map((testimonial, index) => (
            <div key={index} className="text-center">
              <p className="text-gray-600 text-justify">
                Boost your product and service's credibility by adding testimonials from
                your clients. People love recommendations, so feedback from others
                who’ve tried it is invaluable.
              </p>
              <p className="font-bold mt-4 text-gray-800">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  