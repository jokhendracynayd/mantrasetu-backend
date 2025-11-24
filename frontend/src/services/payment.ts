import Razorpay from 'razorpay';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

class PaymentService {
  private razorpayKeyId: string;

  constructor() {
    this.razorpayKeyId = import.meta.env.REACT_APP_RAZORPAY_KEY_ID || '';
    
    // Load Razorpay script
    this.loadRazorpayScript();
  }

  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async createPaymentOrder(amount: number, currency: string = 'INR', receipt: string): Promise<any> {
    try {
      // This would typically call your backend API to create a Razorpay order
      // For now, we'll return a mock response
      return {
        id: `order_${Date.now()}`,
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt,
      };
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw error;
    }
  }

  async openRazorpayPayment(options: RazorpayOptions): Promise<void> {
    if (!window.Razorpay) {
      throw new Error('Razorpay script not loaded');
    }

    const razorpayOptions = {
      key: this.razorpayKeyId,
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description,
      order_id: options.order_id,
      prefill: options.prefill || {},
      theme: options.theme || {
        color: '#ff6b35',
      },
      handler: options.handler,
      modal: options.modal || {
        ondismiss: () => {
          console.log('Payment modal dismissed');
        },
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  }

  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    // In a real application, you would verify the signature on the backend
    // This is a placeholder implementation
    console.log('Verifying payment signature:', { orderId, paymentId, signature });
    return true;
  }
}

export const paymentService = new PaymentService();
