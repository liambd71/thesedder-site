import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
              <p className="text-muted-foreground">Last updated: January 2024</p>
              
              <h2>Our Refund Commitment</h2>
              <p>
                At TheSedder, we want you to be completely satisfied with your purchase. 
                If you're not happy with a product, we offer a straightforward refund policy.
              </p>

              <h2>7-Day Refund Window</h2>
              <p>
                You may request a refund within 7 days of your purchase date. After this 
                period, refunds are provided at our discretion on a case-by-case basis.
              </p>

              <h2>Eligibility</h2>
              <p>To be eligible for a refund:</p>
              <ul>
                <li>Request must be made within 7 days of purchase</li>
                <li>You must provide a valid reason for the refund</li>
                <li>The product must not have been substantially consumed (e.g., more than 30% of a course watched)</li>
              </ul>

              <h2>How to Request a Refund</h2>
              <p>
                To request a refund, please contact our support team at refunds@thesedder.com 
                with your order number and reason for the refund request.
              </p>

              <h2>Processing Time</h2>
              <p>
                Refund requests are typically processed within 5-7 business days. Once approved, 
                the refund will be issued to your original payment method within 3-5 business days.
              </p>

              <h2>Non-Refundable Items</h2>
              <p>
                Promotional or discounted items may have different refund terms, which will be 
                clearly stated at the time of purchase.
              </p>

              <h2>Questions?</h2>
              <p>
                If you have any questions about our refund policy, please contact us at 
                support@thesedder.com.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
