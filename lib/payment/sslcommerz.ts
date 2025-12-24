import SSLCommerzPayment from 'sslcommerz-lts';
import type { PaymentGateway, PaymentInitData, PaymentInitResponse, PaymentValidationData } from './types';

const store_id = process.env.SSLCOMMERZ_STORE_ID || '';
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || '';
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

function getBaseUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_APP_URL || '';
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';
}

export const sslcommerzGateway: PaymentGateway = {
  name: 'sslcommerz',

  async init(data: PaymentInitData): Promise<PaymentInitResponse> {
    if (!store_id || !store_passwd) {
      return {
        success: false,
        error: 'SSLCOMMERZ credentials not configured',
      };
    }

    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const baseUrl = getBaseUrl();

    const paymentData = {
      total_amount: data.amount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${baseUrl}/api/payment/success`,
      fail_url: `${baseUrl}/api/payment/fail`,
      cancel_url: `${baseUrl}/api/payment/cancel`,
      ipn_url: `${baseUrl}/api/payment/ipn`,
      shipping_method: 'NO',
      product_name: data.productName,
      product_category: data.productCategory,
      product_profile: 'non-physical-goods',
      cus_name: data.customerName,
      cus_email: data.customerEmail,
      cus_add1: data.customerAddress || 'Bangladesh',
      cus_add2: '',
      cus_city: data.customerCity || 'Dhaka',
      cus_state: data.customerCity || 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: data.customerPhone,
      cus_fax: data.customerPhone,
      ship_name: data.customerName,
      ship_add1: data.customerAddress || 'Bangladesh',
      ship_add2: '',
      ship_city: data.customerCity || 'Dhaka',
      ship_state: data.customerCity || 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
      value_a: data.productId,
    };

    try {
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const apiResponse = await sslcz.init(paymentData);

      if (apiResponse?.GatewayPageURL) {
        return {
          success: true,
          gatewayUrl: apiResponse.GatewayPageURL,
          transactionId,
        };
      }

      return {
        success: false,
        error: apiResponse?.failedreason || 'Failed to initialize payment',
      };
    } catch (error) {
      console.error('SSLCOMMERZ init error:', error);
      return {
        success: false,
        error: 'Payment gateway error',
      };
    }
  },

  async validate(validationId: string): Promise<PaymentValidationData> {
    if (!store_id || !store_passwd) {
      return {
        transactionId: '',
        amount: 0,
        status: 'FAILED',
      };
    }

    try {
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const validation = await sslcz.validate({ val_id: validationId });

      return {
        transactionId: validation.tran_id || '',
        validationId: validation.val_id,
        bankTransactionId: validation.bank_tran_id,
        amount: parseFloat(validation.amount) || 0,
        status: validation.status === 'VALID' ? 'VALID' : 'FAILED',
        paymentMethod: validation.card_issuer,
        cardType: validation.card_type,
        cardBrand: validation.card_brand,
      };
    } catch (error) {
      console.error('SSLCOMMERZ validation error:', error);
      return {
        transactionId: '',
        amount: 0,
        status: 'FAILED',
      };
    }
  },
};
