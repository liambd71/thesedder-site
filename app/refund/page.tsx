import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AlertTriangle } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Refund Policy</h1>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg max-w-3xl mx-auto">
              <p className="text-muted-foreground">Last updated: December 2024</p>
              
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 my-8 not-prose">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-2">No Refund Policy</h3>
                    <p className="text-muted-foreground">
                      All sales on TheSedder are final. We do not offer refunds for any digital 
                      products including eBooks and video courses. Please review product descriptions 
                      carefully before making a purchase.
                    </p>
                  </div>
                </div>
              </div>

              <h2>Why No Refunds?</h2>
              <p>
                Due to the digital nature of our products (eBooks and video courses), all purchases 
                are final and non-refundable. Once you have access to the digital content, it cannot 
                be "returned" in the traditional sense.
              </p>

              <h2>Before You Purchase</h2>
              <p>We encourage you to:</p>
              <ul>
                <li>Read the full product description carefully</li>
                <li>Review the table of contents or curriculum</li>
                <li>Check the preview content when available</li>
                <li>Ensure the content matches your learning goals</li>
                <li>Verify your device compatibility</li>
              </ul>

              <h2>Technical Issues</h2>
              <p>
                If you experience technical difficulties accessing your purchased content, please 
                contact our support team at support@thesedder.com. We will work with you to 
                resolve any access issues promptly.
              </p>

              <h2>Duplicate Purchases</h2>
              <p>
                If you accidentally purchase the same product twice, please contact us immediately 
                at support@thesedder.com with your order details. We will review your case and 
                may provide store credit at our discretion.
              </p>

              <h2>Payment Region</h2>
              <p>
                Please note that our payment system currently only supports customers in Bangladesh. 
                Payment methods available are tailored for Bangladeshi customers.
              </p>

              <h2>Questions?</h2>
              <p>
                If you have any questions about our refund policy or need assistance before 
                making a purchase, please contact us at support@thesedder.com.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
