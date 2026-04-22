import type { PixResponse, PixStatusResponse } from '../types';

const BASE_URL = 'https://prod.morpheuspay.top';

export const generatePix = async (userId: string, amount: number): Promise<PixResponse> => {
  const response = await fetch(`${BASE_URL}/payments/pix`, {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ userId, amount }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate PIX');
  }

  return response.json();
};

export const checkPixStatus = async (userId: string, transactionId: string): Promise<PixStatusResponse> => {
  const response = await fetch(`${BASE_URL}/payments/status`, {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ userId, transactionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to check PIX status');
  }

  return response.json();
};
