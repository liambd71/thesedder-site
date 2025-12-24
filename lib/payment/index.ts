import { sslcommerzGateway } from './sslcommerz';
import type { PaymentGateway, PaymentInitData, PaymentInitResponse } from './types';

export * from './types';

const gateways: Record<string, PaymentGateway> = {
  sslcommerz: sslcommerzGateway,
};

export function getPaymentGateway(name: string): PaymentGateway | null {
  return gateways[name] || null;
}

export function getDefaultGateway(): PaymentGateway {
  return sslcommerzGateway;
}

export function getAvailableGateways(): string[] {
  return Object.keys(gateways);
}

export async function initPayment(
  data: PaymentInitData,
  gatewayName: string = 'sslcommerz'
): Promise<PaymentInitResponse> {
  const gateway = getPaymentGateway(gatewayName);
  
  if (!gateway) {
    return {
      success: false,
      error: `Payment gateway '${gatewayName}' not found`,
    };
  }

  return gateway.init(data);
}
