import axios from "axios";

const MAYA_SECRET_KEY = process.env.MAYA_SECRET_KEY;
const MAYA_API_URL = "https://pg-sandbox.paymaya.com/checkout/v1/checkouts";

export const createMayaCheckout = async (amount: number, email: string) => {
  try {
    const response = await axios.post(
      MAYA_API_URL,
      {
        totalAmount: { amount, currency: "PHP" },
        redirectUrl: { success: "https://mcslaw.com/success", failure: "https://mcslaw.com/cancel", cancel: "https://mcslaw.com/cancel" },
        requestReferenceNumber: `mcs-${Date.now()}`,
        buyer: { email },
      },
      { headers: { Authorization: `Basic ${Buffer.from(MAYA_SECRET_KEY + ":").toString("base64")}`, "Content-Type": "application/json" } }
    );

    return response.data.checkoutUrl;
  } catch (error) {
    console.error("Maya API Error:", (error as any).response?.data || error);
    return null;
  }
};
