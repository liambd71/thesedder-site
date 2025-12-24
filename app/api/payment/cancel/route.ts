import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const tran_id = formData.get('tran_id') as string;

    console.log('Payment cancelled:', { tran_id });

    const supabase = await createClient();
    
    if (supabase && tran_id) {
      await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('transaction_id', tran_id);
    }

    return NextResponse.redirect(new URL('/payment/cancelled?tran_id=' + tran_id, request.url));
  } catch (err) {
    console.error('Payment cancel handler error:', err);
    return NextResponse.redirect(new URL('/payment/cancelled', request.url));
  }
}
