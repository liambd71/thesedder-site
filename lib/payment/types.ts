export interface PaymentInitData {
  amount: number;
  productId: string;
  productName: string;
  productCategory: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  customerCity?: string;
}

export interface PaymentInitResponse {
  success: boolean;
  gatewayUrl?: string;
  transactionId?: string;
  error?: string;
}

export interface PaymentValidationData {
  transactionId: string;
  validationId?: string;
  bankTransactionId?: string;
  amount: number;
  status: 'VALID' | 'FAILED' | 'CANCELLED' | 'PENDING';
  paymentMethod?: string;
  cardType?: string;
  cardBrand?: string;
}

export interface PaymentGateway {
  name: string;
  init(data: PaymentInitData): Promise<PaymentInitResponse>;
  validate(validationId: string): Promise<PaymentValidationData>;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  userId: string;
  productId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentGateway: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}
