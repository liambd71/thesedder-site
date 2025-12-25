import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const rejectSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = rejectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { orderId, reason } = validation.data;
    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'pending_verification') {
      return NextResponse.json({ error: 'Order is not pending verification' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'rejected',
        rejection_reason: reason || 'Payment verification failed',
        verified_by: user?.id || null,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json({ error: 'Failed to reject order' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reject order error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
