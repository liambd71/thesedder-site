'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Phone,
  User,
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types/database';

interface OrderWithProduct extends Order {
  product?: {
    title: string;
    type: string;
  };
}

export default function AdminPage() {
  const [orders, setOrders] = useState<OrderWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'paid' | 'rejected' | 'all'>('pending');
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const handleApprove = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetch('/api/admin/orders/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to approve order:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetch('/api/admin/orders/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId, 
          reason: rejectionReason[orderId] || 'Payment verification failed' 
        }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to reject order:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_verification':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Payment Verification</p>
            </div>
            <Button variant="outline" onClick={fetchOrders} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {(['pending', 'paid', 'rejected', 'all'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === 'pending' ? 'Pending Verification' : 
                 status === 'paid' ? 'Approved' :
                 status === 'rejected' ? 'Rejected' : 'All Orders'}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No orders found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">{order.product?.title || 'Unknown Product'}</CardTitle>
                        <CardDescription>
                          Order ID: {order.id.slice(0, 8)}... | Submitted: {new Date(order.created_at).toLocaleString()}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Customer Name</p>
                          <p className="font-medium">{order.customer_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">bKash Number</p>
                          <p className="font-medium">{order.bkash_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">TrxID</p>
                          <p className="font-medium font-mono">{order.trxid}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="font-medium">{formatPrice(order.amount)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Reference:</span>
                      <Badge variant="secondary">{order.reference}</Badge>
                      {order.customer_email && (
                        <>
                          <span className="text-sm text-muted-foreground ml-4">Email:</span>
                          <span className="text-sm">{order.customer_email}</span>
                        </>
                      )}
                    </div>

                    {order.status === 'pending_verification' && (
                      <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
                        <Button
                          onClick={() => handleApprove(order.id)}
                          disabled={actionLoading === order.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {actionLoading === order.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Approve Payment
                        </Button>
                        
                        <div className="flex flex-wrap items-center gap-2 flex-1">
                          <Input
                            placeholder="Rejection reason (optional)"
                            className="max-w-xs"
                            value={rejectionReason[order.id] || ''}
                            onChange={(e) => setRejectionReason({ ...rejectionReason, [order.id]: e.target.value })}
                          />
                          <Button
                            variant="destructive"
                            onClick={() => handleReject(order.id)}
                            disabled={actionLoading === order.id}
                          >
                            {actionLoading === order.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-2" />
                            )}
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}

                    {order.status === 'rejected' && order.rejection_reason && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Rejection reason: {order.rejection_reason}
                        </AlertDescription>
                      </Alert>
                    )}

                    {order.verified_at && (
                      <p className="text-xs text-muted-foreground">
                        Verified at: {new Date(order.verified_at).toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
