import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg max-w-3xl mx-auto">
              <p className="text-muted-foreground">Last updated: January 2024</p>
              
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using TheSedder, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>

              <h2>2. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials 
                and for all activities that occur under your account. You must immediately notify 
                us of any unauthorized use of your account.
              </p>

              <h2>3. Purchases and Payments</h2>
              <p>
                All purchases are final unless otherwise stated in our Refund Policy. Prices are 
                subject to change without notice. We reserve the right to refuse or cancel orders 
                at our discretion.
              </p>

              <h2>4. Content Access</h2>
              <p>
                Purchased content is licensed for personal, non-commercial use only. You may not 
                share, distribute, or resell any content purchased from TheSedder. We reserve 
                the right to revoke access for violations of these terms.
              </p>

              <h2>5. Intellectual Property</h2>
              <p>
                All content on TheSedder, including eBooks, courses, and website materials, is 
                protected by copyright and intellectual property laws. Unauthorized use is prohibited.
              </p>

              <h2>6. Limitation of Liability</h2>
              <p>
                TheSedder is provided "as is" without warranties of any kind. We are not liable 
                for any damages arising from your use of our services.
              </p>

              <h2>7. Changes to Terms</h2>
              <p>
                We may update these terms at any time. Continued use of TheSedder after changes 
                constitutes acceptance of the new terms.
              </p>

              <h2>8. Contact</h2>
              <p>
                For questions about these terms, please contact us at support@thesedder.com.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
