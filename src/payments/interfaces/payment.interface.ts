export interface PaymentGatewayResponse {
  success: boolean;
  transactionId?: string;
  amount?: number;
  currency?: string;
  status?: string;
  error?: string;
  gatewayResponse?: any;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  receipt: string;
  created_at: number;
}

export interface RazorpayPaymentResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  description: string;
  created_at: number;
}

export interface RefundResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  receipt: string;
  created_at: number;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret?: string;
}
