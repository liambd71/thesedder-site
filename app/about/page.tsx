import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Target, Heart, Globe } from "lucide-react";

const values = [
  {
    icon: BookOpen,
    title: "Quality Content",
    description: "We curate only the best educational materials from expert creators.",
  },
  {
    icon: Target,
    title: "Focused Learning",
    description: "Our content is designed to help you achieve specific, measurable goals.",
  },
  {
    icon: Heart,
    title: "Learner First",
    description: "Everything we do is centered around providing value to our learners.",
  },
  {
    icon: Globe,
    title: "Accessible Education",
    description: "We believe quality education should be accessible to everyone.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">About TheSedder</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering learners worldwide with premium educational content since 2024.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Our Story</h2>
              <div className="prose prose-lg text-muted-foreground space-y-4">
                <p>
                  TheSedder was born from a simple idea: make quality education accessible to everyone, 
                  regardless of their location or background. We noticed that while there was an abundance 
                  of educational content online, finding truly valuable, well-structured learning materials 
                  remained a challenge.
                </p>
                <p>
                  Our team of educators, developers, and content creators came together to build a platform 
                  that curates and delivers premium eBooks and video courses. We work with experts in various 
                  fields to ensure that every piece of content on our platform meets the highest standards of 
                  quality and pedagogical excellence.
                </p>
                <p>
                  Today, TheSedder serves thousands of learners, helping them acquire new skills, advance 
                  their careers, and achieve their personal goals. We're proud of the community we've built 
                  and remain committed to our mission of democratizing education.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="text-center">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              To empower individuals with knowledge and skills through accessible, high-quality 
              educational content that transforms lives and opens doors to new opportunities.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
