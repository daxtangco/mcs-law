const services = [
    { title: "Document Submission", desc: "Submit and process legal documents online." },
    { title: "Legal Consultation", desc: "Book expert legal consultations." },
    { title: "Notarization", desc: "Fast and secure document notarization." },
  ];
  
  const Services = () => {
    return (
      <section className="py-20 bg-white text-center">
        <h2 className="text-4xl font-bold text-green-900">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-100 p-6 shadow-md rounded-lg">
              <h3 className="text-xl font-semibold text-green-800">{service.title}</h3>
              <p className="mt-2 text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default Services;
  