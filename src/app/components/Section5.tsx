import { FaGavel, FaBalanceScale, FaUniversity, FaUserShield, FaBriefcaseMedical, FaFileInvoice } from "react-icons/fa";

export default function Section5() {
  return (
    <section className="h-screen flex flex-col items-center justify-center bg-gray-100 px-10">
      <h1 className="text-4xl font-bold mb-10">Full-service legal solutions</h1>

      {/* Grid Layout for Services */}
      <div className="grid grid-cols-3 gap-8 text-center">
        {[
          { icon: <FaGavel />, title: "Arbitration and Mediation" },
          { icon: <FaUniversity />, title: "Criminal Defense" },
          { icon: <FaBalanceScale />, title: "Family Law" },
          { icon: <FaUserShield />, title: "Immigration" },
          { icon: <FaBriefcaseMedical />, title: "Personal Injury" },
          { icon: <FaFileInvoice />, title: "Tax and Estate Planning" },
        ].map((service, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-4xl text-gray-700">{service.icon}</div>
            <h2 className="font-semibold mt-2">{service.title}</h2>
            <p className="text-gray-500 text-sm">Briefly talk about your firm's services here.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
