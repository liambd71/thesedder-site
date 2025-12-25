import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getProductById } from '@/lib/products';
import type { PaymentMethod, PaymentSetting } from '@/types/database';

const paymentSubmitSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  customerName: z.string().min(1, 'Name is required'),
  senderNumber: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid phone number format'),
  reference: z.string().min(1, 'Reference is required'),
  trxid: z.string().min(8, 'Transaction ID must be at least 8 characters').regex(/^[A-Za-z0-9]+$/, 'Invalid Transaction ID format'),
  paymentMethod: z.enum(['bkash', 'nagad', 'rocket']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = paymentSubmitSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { productId, customerName, senderNumber, reference, trxid, paymentMethod } = validation.data;

    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.published) {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Payment service unavailable' },
        { status: 503 }
      );
    }

    const { data: paymentSetting, error: settingError } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('method_name', paymentMethod)
      .eq('is_enabled', true)
      .single();

    if (settingError || !paymentSetting) {
      return NextResponse.json(
        { error: 'Selected payment method is not available' },
        { status: 400 }
      );
    }

    const setting = paymentSetting as PaymentSetting;
    if (reference.toLowerCase().trim() !== setting.required_reference.toLowerCase()) {
      return NextResponse.json(
        { error: `Reference must be "${setting.required_reference}"` },
        { status: 400 }
      );
    }

    let userId: string | null = null;
    let customerEmail = '';

    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id || null;
    customerEmail = user?.email || '';

    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('trxid', trxid.toUpperCase())
      .single();

    if (existingOrder) {
      return NextResponse.json(
        { error: 'This Transaction ID has already been used. Please check your TrxID.' },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase.from('orders').insert({
      user_id: userId,
      product_id: product.id,
      amount: product.price,
      currency: 'BDT',
      status: 'pending_verification',
      payment_method: paymentMethod,
      customer_name: customerName,
      customer_email: customerEmail,
      sender_number: senderNumber,
      reference: reference.trim(),
      trxid: trxid.toUpperCase(),
    });

    if (insertError) {
      console.error('Order insert error:', insertError);
      
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'This Transaction ID has already been used.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create order. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit payment' },
      { status: 500 }
    );
  }
}
