import { useChapters } from "@/hooks/use-chapters";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { ArrowRight, Loader2 } from "lucide-react";

export default function Home() {
  const { data: chapters, isLoading, error } = useChapters();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-50" />
          <p className="font-serif text-lg animate-pulse">Loading library...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-20 text-destructive">
          <h2 className="text-2xl font-serif font-bold mb-2">Unable to load chapters</h2>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-6 text-foreground">
          The Collection
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed font-serif">
          A curated selection of thoughts, stories, and ideas presented in a distraction-free environment designed for reading.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {chapters?.sort((a, b) => a.order - b.order).map((chapter) => (
          <Link
            key={chapter.id}
            href={`/chapter/${chapter.id}`}
            className="group block h-full"
          >
            <article className="
              h-full p-8 rounded-2xl bg-card border border-border/50
              shadow-sm hover:shadow-lg hover:border-primary/20 hover:-translate-y-1
              transition-all duration-300 ease-out flex flex-col
            ">
              <div className="flex items-start justify-between mb-4">
                <span className="
                  inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase
                  bg-muted text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors
                ">
                  Chapter {chapter.order}
                </span>
                <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
              
              <h2 className="text-2xl font-serif font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                {chapter.title}
              </h2>
              
              {chapter.subtitle && (
                <p className="text-muted-foreground font-serif italic mb-6 flex-grow">
                  {chapter.subtitle}
                </p>
              )}

              <div className="mt-auto pt-4 border-t border-border/50 flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Read Chapter
              </div>
            </article>
          </Link>
        ))}
      </div>

      {chapters?.length === 0 && (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
          <p className="text-muted-foreground font-serif text-lg">No chapters available yet.</p>
        </div>
      )}
    </Layout>
  );
}
