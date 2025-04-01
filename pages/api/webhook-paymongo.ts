import type { NextApiRequest, NextApiResponse } from 'next';
import { handleWebhook } from '@/lib/paymongo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Pass the request to the paymongo webhook handler
    return handleWebhook(req, res);
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({ error: 'Failed to process webhook' });
  }
}