import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProductById } from '@/lib/products';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (status === 'pending') {
      query = query.eq('status', 'pending_verification');
    } else if (status === 'paid') {
      query = query.eq('status', 'paid');
    } else if (status === 'rejected') {
      query = query.eq('status', 'rejected');
    }

    const { data: orders, error } = await query.limit(100);

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    const ordersWithProducts = (orders || []).map(order => {
      const product = getProductById(order.product_id);
      return {
        ...order,
        product: product ? { title: product.title, type: product.type } : null,
      };
    });

    return NextResponse.json({ orders: ordersWithProducts });
  } catch (error) {
    console.error('Admin orders error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
