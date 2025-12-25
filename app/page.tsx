import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FAQSection } from "@/components/faq-section";
import { BookOpen, PlayCircle, Star, ShieldCheck, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Premium eBooks",
    description: "Carefully crafted digital books covering diverse topics for your learning journey.",
  },
  {
    icon: PlayCircle,
    title: "Video Courses",
    description: "High-quality video courses with structured modules and lessons.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Access",
    description: "Your purchases are protected with secure, watermarked delivery.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Join thousands of learners on their educational journey.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Developer",
    content: "The courses on TheSedder have transformed my career. The quality is exceptional!",
    rating: 5,
  },
  {
    name: "Ahmed Khan",
    role: "Student",
    content: "Best investment I've made in my education. The eBooks are comprehensive and well-written.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Designer",
    content: "Love the variety of content available. The video courses are engaging and practical.",
    rating: 5,
  },
];


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Learn. Grow. <span className="text-primary">Succeed.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover premium eBooks and video courses designed to help you master new skills and achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-browse-shop">
                  Browse Shop
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-get-started">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose TheSedder?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Learners Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name}>
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <FAQSection />

        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Join thousands of learners and get access to premium educational content today.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" data-testid="button-cta-signup">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
