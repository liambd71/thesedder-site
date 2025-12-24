'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BookOpen, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get('tran_id');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" data-testid="icon-success" />
              </div>
              <CardTitle className="text-2xl" data-testid="text-payment-success-title">Payment Successful!</CardTitle>
              <CardDescription data-testid="text-payment-success-description">
                Your payment has been processed successfully. You now have access to your purchased content.
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
                <Link href="/library">
                  <Button className="w-full" data-testid="button-go-to-library">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Go to My Library
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="outline" className="w-full" data-testid="button-continue-shopping">
                    Continue Shopping
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
