'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, RefreshCw, MessageCircle } from 'lucide-react';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get('tran_id');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-destructive" data-testid="icon-failed" />
              </div>
              <CardTitle className="text-2xl" data-testid="text-payment-failed-title">Payment Failed</CardTitle>
              <CardDescription data-testid="text-payment-failed-description">
                Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.
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
                  <Button className="w-full" data-testid="button-try-again">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full" data-testid="button-contact-support">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
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
