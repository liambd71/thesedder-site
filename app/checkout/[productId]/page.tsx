'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Copy, Check, Smartphone, BookOpen, PlayCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { PaymentSetting, PaymentMethod } from '@/types/database';

interface Product {
  id: string;
  title: string;
  price: number;
  type: string;
  author: string;
  description: string;
}

const methodColors: Record<PaymentMethod, { bg: string; text: string }> = {
  bkash: { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-600' },
  nagad: { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-600' },
  rocket: { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-600' },
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentSetting[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentSetting | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    senderNumber: '',
    reference: '',
    trxid: '',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, settingsRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch('/api/payment/settings')
        ]);
        
        if (productRes.ok) {
          const productData = await productRes.json();
          setProduct(productData);
        }
        
        if (settingsRes.ok) {
  const settingsData = await settingsRes.json();

  // ✅ API কখনও settings নামে দিবে, কখনও paymentMethods নামে
  const methods = (settingsData.settings ?? settingsData.paymentMethods ?? []).filter(
    (m: any) => m?.is_active === true && (m?.is_enabled ?? true) === true
  );

  if (settingsData.success && methods.length > 0) {
    setPaymentMethods(methods);
    setSelectedMethod(methods[0]);
  } else {
    setPaymentMethods([]);
    setSelectedMethod(null);
  }
}

          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setPageLoading(false);
      }
    }
    fetchData();
  }, [productId]);

  const copyAccountNumber = async () => {
    if (!selectedMethod) return;
    await navigator.clipboard.writeText(selectedMethod.account_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateSenderNumber = (num: string) => {
    return /^01[3-9]\d{8}$/.test(num);
  };

  const validateReference = (ref: string) => {
    if (!selectedMethod) return false;
    return ref.toLowerCase().trim() === selectedMethod.required_reference.toLowerCase();
  };

  const validateTrxId = (trx: string) => {
    return /^[A-Za-z0-9]{8,}$/.test(trx.trim());
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Product not found</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                Payment methods are currently unavailable. Please try again later or contact support.
              </p>
              <Button onClick={() => router.push('/contact')}>Contact Support</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-lg">
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold">Payment Submitted!</h2>
                <p className="text-muted-foreground">
                  Your payment is being verified. Once approved, you will receive access to your purchased content.
                </p>
                <p className="text-sm text-muted-foreground">
                  Verification usually takes 1-24 hours during business hours.
                </p>
                <div className="pt-4">
                  <Button onClick={() => router.push('/shop')}>
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedMethod) {
      setError('Please select a payment method.');
      return;
    }

    if (!validateSenderNumber(formData.senderNumber)) {
      setError('Invalid phone number. Must be 11 digits starting with 01.');
      return;
    }

    if (!validateReference(formData.reference)) {
      setError(`Reference must be "${selectedMethod.required_reference}", otherwise product will not be delivered.`);
      return;
    }

    if (!validateTrxId(formData.trxid)) {
      setError('Invalid Transaction ID. Must be at least 8 alphanumeric characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: formData.name,
          senderNumber: formData.senderNumber,
          reference: formData.reference.trim(),
          trxid: formData.trxid.trim(),
          paymentMethod: selectedMethod.method_name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit payment. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const colors = selectedMethod ? methodColors[selectedMethod.method_name] : methodColors.bkash;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8" data-testid="text-checkout-title">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {paymentMethods.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method.id}
                          variant={selectedMethod?.id === method.id ? "default" : "outline"}
                          onClick={() => setSelectedMethod(method)}
                          data-testid={`button-select-${method.method_name}`}
                        >
                          {method.display_name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedMethod && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className={`w-5 h-5 ${colors.text}`} />
                      {selectedMethod.display_name} Payment Instructions
                    </CardTitle>
                    <CardDescription>Follow these steps to complete your payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`${colors.bg} p-4 rounded-lg space-y-3`}>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <p className="text-sm text-muted-foreground">Send Money to:</p>
                          <p className={`text-2xl font-bold ${colors.text}`} data-testid="text-payment-number">
                            {selectedMethod.account_number}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={copyAccountNumber}
                          data-testid="button-copy-number"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount:</p>
                        <p className="text-xl font-bold">{formatPrice(product.price)}</p>
                      </div>
                    </div>

                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Open {selectedMethod.display_name} app and go to <strong>Send Money</strong></li>
                      <li>Enter the number: <strong data-testid="text-instruction-number">{selectedMethod.account_number}</strong></li>
                      <li>Enter the exact amount: <strong>{formatPrice(product.price)}</strong></li>
                      <li>In Reference field, write: <strong className={colors.text}>{selectedMethod.required_reference}</strong></li>
                      <li>Complete the payment and note the Transaction ID (TrxID)</li>
                      <li>Fill the form below with your payment details</li>
                    </ol>

                    {selectedMethod.instructions && (
                      <p className="text-sm text-muted-foreground">{selectedMethod.instructions}</p>
                    )}

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <strong>Important:</strong> Reference must be exactly "{selectedMethod.required_reference}" otherwise your purchase will not be processed.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Payment Verification Form</CardTitle>
                  <CardDescription>Submit your payment details after sending money</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        data-testid="input-customer-name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderNumber">Your {selectedMethod?.display_name || 'Mobile'} Number *</Label>
                      <Input
                        id="senderNumber"
                        type="tel"
                        required
                        placeholder="01XXXXXXXXX"
                        value={formData.senderNumber}
                        onChange={(e) => setFormData({ ...formData, senderNumber: e.target.value })}
                        data-testid="input-sender-number"
                      />
                      <p className="text-xs text-muted-foreground">The number you sent money from</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reference">Reference *</Label>
                      <Input
                        id="reference"
                        required
                        placeholder={selectedMethod?.required_reference || 'E-book'}
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        data-testid="input-reference"
                      />
                      <p className="text-xs text-muted-foreground">Must be exactly "{selectedMethod?.required_reference || 'E-book'}"</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="trxid">Transaction ID (TrxID) *</Label>
                      <Input
                        id="trxid"
                        required
                        placeholder="e.g. 9I34XYZABC"
                        value={formData.trxid}
                        onChange={(e) => setFormData({ ...formData, trxid: e.target.value })}
                        data-testid="input-trxid"
                      />
                      <p className="text-xs text-muted-foreground">Found in your transaction receipt</p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={loading || !selectedMethod}
                      data-testid="button-submit-payment"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Payment for Verification'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-20 bg-muted rounded flex items-center justify-center">
                      {product.type === 'course' ? (
                        <PlayCircle className="w-8 h-8 text-muted-foreground" />
                      ) : (
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold" data-testid="text-product-title">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">{product.author}</p>
                      <Badge variant="secondary" className="mt-1">
                        {product.type === 'course' ? 'Course' : 'eBook'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(product.price)}</span>
                    </div>
                    <div className="flex justify-between gap-2 font-bold text-lg">
                      <span>Total</span>
                      <span data-testid="text-total-amount">{formatPrice(product.price)}</span>
                    </div>
                  </div>

                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Digital products are non-refundable. Access will be granted after payment verification.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
