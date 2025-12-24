import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const tran_id = formData.get('tran_id') as string;
    const error = formData.get('error') as string;

    console.log('Payment failed:', { tran_id, error });

    const supabase = await createClient();
    
    if (supabase && tran_id) {
      await supabase
        .from('orders')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('transaction_id', tran_id);
    }

    return NextResponse.redirect(new URL('/payment/failed?tran_id=' + tran_id, request.url));
  } catch (err) {
    console.error('Payment fail handler error:', err);
    return NextResponse.redirect(new URL('/payment/failed', request.url));
  }
}
