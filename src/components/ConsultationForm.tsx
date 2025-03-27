import { createMayaCheckout } from "@/lib/maya";
import { useState } from "react";

const ConsultationForm = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const paymentUrl = await createMayaCheckout(1500, "user@email.com");
    setLoading(false);

    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading} className="bg-green-600 text-white px-4 py-2">
        {loading ? "Processing..." : "Pay ₱1500 via Maya"}
      </button>
    </div>
  );
};

export default ConsultationForm;
