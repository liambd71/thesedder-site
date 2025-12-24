import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { initPayment } from '@/lib/payment';
import { createClient } from '@/lib/supabase/server';
import { getProductById } from '@/lib/products';

const paymentInitSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(10, 'Valid phone number is required'),
  customerAddress: z.string().optional(),
  customerCity: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = paymentInitSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { productId, customerName, customerEmail, customerPhone, customerAddress, customerCity } = validation.data;

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

    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    }

    const result = await initPayment({
      amount: product.price,
      productId: product.id,
      productName: product.title,
      productCategory: product.type === 'course' ? 'Online Course' : 'eBook',
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
    });

    if (result.success && result.transactionId && supabase) {
      await supabase.from('orders').insert({
        user_id: userId,
        product_id: product.id,
        transaction_id: result.transactionId,
        amount: product.price,
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
