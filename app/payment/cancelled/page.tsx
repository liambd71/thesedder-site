'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function PaymentCancelledPage() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get('tran_id');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground" data-testid="icon-cancelled" />
              </div>
              <CardTitle className="text-2xl" data-testid="text-payment-cancelled-title">Payment Cancelled</CardTitle>
              <CardDescription data-testid="text-payment-cancelled-description">
                Your payment was cancelled. No charges have been made to your account. You can try again whenever you&apos;re ready.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tranId && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-mono text-sm" data-testid="text-transaction-id">{tranId}</p>
                </div>
              )}
              
              <div className="flex flex-col gap-3">
                <Link href="/shop">
                  <Button className="w-full" data-testid="button-back-to-shop">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Back to Shop
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full" data-testid="button-go-home">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
