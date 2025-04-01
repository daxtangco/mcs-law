import axios from 'axios';

interface PaymongoPaymentIntent {
  amount: number;
  currency: string;
  description: string;
  metadata?: {
    [key: string]: string;
  };
  returnUrl: string;
}

interface PaymongoPaymentMethod {
  type: 'card' | 'gcash' | 'grab_pay' | 'paymaya';
  details?: {
    cardNumber?: string;
    expMonth?: number;
    expYear?: number;
    cvc?: string;
  };
  billing?: {
    name: string;
    email: string;
    phone?: string;
  };
}

interface PaymongoPaymentResponse {
  id: string;
  type: string;
  attributes: {
    amount: number;
    currency: string;
    description: string;
    status: string;
    client_key: string;
    checkout_url?: string;
  };
}

// Base API configuration
const PAYMONGO_API_URL = 'https://api.paymongo.com/v1';
const PAYMONGO_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY || '';
const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY || '';

// Basic authentication for Paymongo
const auth = {
  username: PAYMONGO_SECRET_KEY,
  password: '',
};

// Create a payment intent
export const createPaymentIntent = async (
  paymentData: PaymongoPaymentIntent
): Promise<any> => {
  try {
    const response = await axios.post(
      `${PAYMONGO_API_URL}/payment_intents`,
      {
        data: {
          attributes: {
            amount: paymentData.amount * 100, // Paymongo uses amount in cents
            currency: paymentData.currency || 'PHP',
            description: paymentData.description,
            payment_method_allowed: ['card', 'paymaya', 'gcash', 'grab_pay'],
            payment_method_options: {
              card: { request_three_d_secure: 'any' },
            },
            metadata: paymentData.metadata || {},
            capture_type: 'automatic',
          },
        },
      },
      {
        auth,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error creating Paymongo payment intent:', error);
    throw error;
  }
};

// Create a payment method
export const createPaymentMethod = async (
  paymentMethodData: PaymongoPaymentMethod
): Promise<any> => {
  try {
    const response = await axios.post(
      `${PAYMONGO_API_URL}/payment_methods`,
      {
        data: {
          attributes: {
            type: paymentMethodData.type,
            details: paymentMethodData.details || {},
            billing: paymentMethodData.billing || {},
          },
        },
      },
      {
        auth,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error creating Paymongo payment method:', error);
    throw error;
  }
};

// Attach payment method to payment intent
export const attachPaymentToIntent = async (
  paymentIntentId: string,
  paymentMethodId: string,
  returnUrl: string
): Promise<any> => {
  try {
    const response = await axios.post(
      `${PAYMONGO_API_URL}/payment_intents/${paymentIntentId}/attach`,
      {
        data: {
          attributes: {
            payment_method: paymentMethodId,
            return_url: returnUrl,
          },
        },
      },
      {
        auth,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error attaching payment method to intent:', error);
    throw error;
  }
};

// Create a payment via source (for GCash, GrabPay, etc.)
export const createPaymentSource = async (
  amount: number,
  type: 'gcash' | 'grab_pay',
  successUrl: string,
  failureUrl: string
): Promise<any> => {
  try {
    const response = await axios.post(
      `${PAYMONGO_API_URL}/sources`,
      {
        data: {
          attributes: {
            amount: amount * 100, // Convert to cents
            redirect: {
              success: successUrl,
              failed: failureUrl,
            },
            type,
            currency: 'PHP',
          },
        },
      },
      {
        auth,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error creating Paymongo source:', error);
    throw error;
  }
};

// Create a payment using source
export const createPayment = async (
  sourceId: string,
  description: string,
  metadata: Record<string, string> = {}
): Promise<any> => {
  try {
    const response = await axios.post(
      `${PAYMONGO_API_URL}/payments`,
      {
        data: {
          attributes: {
            source: sourceId,
            description,
            metadata,
          },
        },
      },
      {
        auth,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error creating Paymongo payment:', error);
    throw error;
  }
};

// Retrieve a payment
export const retrievePayment = async (paymentId: string): Promise<any> => {
  try {
    const response = await axios.get(`${PAYMONGO_API_URL}/payments/${paymentId}`, {
      auth,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error retrieving Paymongo payment:', error);
    throw error;
  }
};

// Handle webhook events
export const handleWebhook = async (req: any, res: any) => {
  try {
    const payload = req.body;
    
    // Paymongo sends webhook data in a specific format with a type field
    const eventType = payload.data.attributes.type;
    const eventData = payload.data.attributes.data;
    
    switch (eventType) {
      case 'payment.paid':
        // Handle successful payment
        // Update order status, send confirmation email, etc.
        break;
      case 'payment.failed':
        // Handle failed payment
        break;
      case 'source.chargeable':
        // A source is ready to be charged
        // Create a payment using the source
        break;
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }
    
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling Paymongo webhook:', error);
    return res.status(400).json({ error: 'Webhook handler failed' });
  }
};

// API route for creating payment
// /pages/api/create-payment.ts
export const createPaymentApi = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, description, type, redirectUrls, metadata } = req.body;
    
    // Validate required fields
    if (!amount || !description || !type || !redirectUrls) {
      return res.status(400).json({ error: 'Missing required payment data' });
    }
    
    let response;
    
    if (type === 'card') {
      // For card payments, create a payment intent
      response = await createPaymentIntent({
        amount,
        currency: 'PHP',
        description,
        metadata,
        returnUrl: redirectUrls.success
      });
    } else {
      // For e-wallet payments (GCash, GrabPay), create a source
      response = await createPaymentSource(
        amount,
        type as 'gcash' | 'grab_pay',
        redirectUrls.success,
        redirectUrls.failure
      );
    }
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in create payment API:', error);
    return res.status(500).json({ error: 'Failed to create payment' });
  }
};