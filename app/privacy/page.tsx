import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg max-w-3xl mx-auto">
              <p className="text-muted-foreground">Last updated: January 2024</p>
              
              <h2>1. Information We Collect</h2>
              <p>
                We collect information you provide directly, such as your name, email address, 
                and payment information when you create an account or make a purchase.
              </p>

              <h2>2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Process transactions and deliver purchased content</li>
                <li>Send transactional emails about your account and purchases</li>
                <li>Improve our services and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share information with 
                service providers who assist us in operating our platform, such as payment 
                processors and hosting providers.
              </p>

              <h2>4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. 
                However, no method of transmission over the internet is 100% secure.
              </p>

              <h2>5. Cookies</h2>
              <p>
                We use cookies to maintain your session and improve your experience. You can 
                control cookies through your browser settings.
              </p>

              <h2>6. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. 
                Contact us to exercise these rights.
              </p>

              <h2>7. Changes to This Policy</h2>
              <p>
                We may update this policy from time to time. We will notify you of significant 
                changes via email or through our platform.
              </p>

              <h2>8. Contact Us</h2>
              <p>
                For privacy-related questions, please contact us at privacy@thesedder.com.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
