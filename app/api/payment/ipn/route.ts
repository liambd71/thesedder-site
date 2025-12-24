import { NextRequest, NextResponse } from 'next/server';
import { getPaymentGateway } from '@/lib/payment';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const tran_id = formData.get('tran_id') as string;
    const val_id = formData.get('val_id') as string;
    const status = formData.get('status') as string;
    const value_a = formData.get('value_a') as string;

    console.log('IPN received:', { tran_id, val_id, status, value_a });

    if (status === 'VALID' && val_id) {
      const gateway = getPaymentGateway('sslcommerz');
      
      if (gateway) {
        const validation = await gateway.validate(val_id);
        
        if (validation.status === 'VALID') {
          const supabase = await createClient();
          
          if (supabase) {
            const { data: order } = await supabase
              .from('orders')
              .select('*')
              .eq('transaction_id', tran_id)
              .single();

            if (order && order.status !== 'completed') {
              await supabase
                .from('orders')
                .update({
                  status: 'completed',
                  payment_method: validation.paymentMethod,
                  bank_transaction_id: validation.bankTransactionId,
                  updated_at: new Date().toISOString(),
                })
                .eq('transaction_id', tran_id);

              if (order.user_id) {
                const { data: existingPurchase } = await supabase
                  .from('purchases')
                  .select('id')
                  .eq('user_id', order.user_id)
                  .eq('product_id', order.product_id)
                  .single();

                if (!existingPurchase) {
                  await supabase.from('purchases').insert({
                    user_id: order.user_id,
                    product_id: order.product_id,
                    order_id: order.id,
                    purchased_at: new Date().toISOString(),
                  });
                }
              }
            }
          }
        }
      }
    } else if (status === 'FAILED') {
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
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('IPN error:', error);
    return NextResponse.json({ received: false, error: 'Processing failed' }, { status: 500 });
  }
}
