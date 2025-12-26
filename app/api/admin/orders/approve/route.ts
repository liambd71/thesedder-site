const supabase = await createClient();

const {
  data: { user },
} = await supabase.auth.getUser();

type OrderRow = {
  id: string;
  status: string;
  user_id: string | null;
  product_id: string;
};

const orderResult = await supabase
  .from("orders")
  .select("id,status,user_id,product_id")
  .eq("id", orderId)
  .maybeSingle();

if (orderResult.error) {
  return NextResponse.json(
    { error: orderResult.error.message },
    { status: 500 }
  );
}

const order = orderResult.data as OrderRow | null;

if (!order) {
  return NextResponse.json({ error: "Order not found" }, { status: 404 });
}

if (order.status !== "pending_verification") {
  return NextResponse.json(
    { error: "Order is not pending verification" },
    { status: 400 }
  );
}
