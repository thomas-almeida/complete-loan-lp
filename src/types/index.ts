export interface LoanFormData {
  fullName: string;
  cpf: string;
  whatsapp: string;
  amount: number;
  installments: number;
  pixKey: string;
}

export type Step = 'basic-info' | 'loan-details' | 'approval' | 'payment';

export interface PixResponse {
  paymentIntent: {
    success: boolean;
    data: {
      purchaseId: number;
      productId: number;
      productTitle: string;
      id: string;
      pixCode: string;
      qrCode: string;
      amount: number;
      description: string;
      expiresAt: string;
      status: string;
    };
  };
  transactionId: string;
}

export interface PixStatusResponse {
  status: 'PENDING' | 'PAID' | 'CANCELLED';
}
