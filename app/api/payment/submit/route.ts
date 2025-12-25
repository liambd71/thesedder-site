import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getProductById } from '@/lib/products';

const paymentSubmitSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  customerName: z.string().min(1, 'Name is required'),
  bkashNumber: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid bKash number format'),
  reference: z.string().refine(
    (val) => val.toLowerCase().trim() === 'e-book',
    'Reference must be "E-book"'
  ),
  trxid: z.string().min(8, 'Transaction ID must be at least 8 characters').regex(/^[A-Za-z0-9]+$/, 'Invalid Transaction ID format'),
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

    const { productId, customerName, bkashNumber, reference, trxid } = validation.data;

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
    let userId: string | null = null;
    let customerEmail = '';

    if (supabase) {
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
        payment_method: 'bkash',
        customer_name: customerName,
        customer_email: customerEmail,
        bkash_number: bkashNumber,
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
