import Services from "@/components/Services";

const services = [
  { id: "document-submission", title: "Document Submission" },
  { id: "legal-consultation", title: "Legal Consultation" },
];

export default function ServicesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-800 text-center mt-6">Our Services</h1>
    </div>
  );
}
