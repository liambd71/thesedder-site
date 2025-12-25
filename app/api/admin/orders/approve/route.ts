type OrderRow = {
  id: string;
  status: string;
  user_id: string | null;
  product_id: string;
};

const { data: order, error: fetchError } = await supabase
  .from('orders')
  .select('id,status,user_id,product_id')
  .eq('id', orderId)
  .maybeSingle<OrderRow>();

if (fetchError) {
  return NextResponse.json({ error: fetchError.message }, { status: 500 });
}

if (!order) {
  return NextResponse.json({ error: 'Order not found' }, { status: 404 });
}

if (order.status !== 'pending_verification') {
  return NextResponse.json(
    { error: 'Order is not pending verification' },
    { status: 400 }
  );
}
