import { NextRequest, NextResponse } from 'next/server';
import { initPayment } from '@/lib/payment';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productName, productCategory, amount, customerName, customerEmail, customerPhone, customerAddress, customerCity } = body;

    if (!productId || !amount || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    let userId: string | null = null;

    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    }

    const result = await initPayment({
      amount,
      productId,
      productName: productName || 'Digital Product',
      productCategory: productCategory || 'Digital Content',
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
    });

    if (result.success && result.transactionId && supabase) {
      await supabase.from('orders').insert({
        user_id: userId,
        product_id: productId,
        transaction_id: result.transactionId,
        amount,
        currency: 'BDT',
        status: 'pending',
        payment_gateway: 'sslcommerz',
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Payment init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
