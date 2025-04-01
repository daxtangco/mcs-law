import type { NextApiRequest, NextApiResponse } from 'next';
import { createPaymentApi } from '@/lib/paymongo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Pass the request to the paymongo payment creation handler
  return createPaymentApi(req, res);
}