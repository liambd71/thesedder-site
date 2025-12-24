import { useChapter, useChapters } from "@/hooks/use-chapters";
import { useRoute, Link } from "wouter";
import { Layout } from "@/components/Layout";
import ReactMarkdown from "react-markdown";
import { Loader2, ArrowLeft, ArrowRight, BookOpenText } from "lucide-react";
import { useEffect } from "react";

export default function ChapterView() {
  const [, params] = useRoute("/chapter/:id");
  const id = params ? parseInt(params.id) : 0;
  
  const { data: chapter, isLoading, error } = useChapter(id);
  const { data: allChapters } = useChapters(); // For navigation

  // Scroll to top when changing chapters
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-50" />
          <p className="font-serif text-lg animate-pulse">Preparing text...</p>
        </div>
      </Layout>
    );
  }

  if (error || !chapter) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-4">
            <BookOpenText className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-2">Chapter Not Found</h2>
          <p className="text-muted-foreground mb-6">The chapter you are looking for does not exist.</p>
          <Link href="/" className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium">
            Return to Library
          </Link>
        </div>
      </Layout>
    );
  }

  // Calculate next/prev links
  const sortedChapters = allChapters?.sort((a, b) => a.order - b.order) || [];
  const currentIndex = sortedChapters.findIndex(c => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

  return (
    <Layout>
      <article className="max-w-2xl mx-auto">
        {/* Chapter Header */}
        <header className="mb-12 text-center">
          <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-muted text-muted-foreground">
            Chapter {chapter.order}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight mb-4 text-foreground leading-tight">
            {chapter.title}
          </h1>
          {chapter.subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground font-serif italic leading-relaxed">
              {chapter.subtitle}
            </p>
          )}
          
          <div className="mt-8 w-24 h-1 bg-border mx-auto rounded-full" />
        </header>

        {/* Markdown Content */}
        <div className="prose prose-lg md:prose-xl dark:prose-invert mx-auto mb-16 font-serif">
          <ReactMarkdown>{chapter.content}</ReactMarkdown>
        </div>

        {/* Chapter Navigation */}
        <nav className="border-t border-border pt-8 mt-12 grid grid-cols-2 gap-4">
          <div>
            {prevChapter ? (
              <Link href={`/chapter/${prevChapter.id}`} className="group block text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-2 mb-1">
                  <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                  Previous
                </span>
                <span className="block font-serif text-lg font-bold group-hover:text-primary transition-colors">
                  {prevChapter.title}
                </span>
              </Link>
            ) : (
              <div /> // Spacer
            )}
          </div>
          
          <div className="text-right">
            {nextChapter ? (
              <Link href={`/chapter/${nextChapter.id}`} className="group block text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors flex items-center justify-end gap-2 mb-1">
                  Next
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="block font-serif text-lg font-bold group-hover:text-primary transition-colors">
                  {nextChapter.title}
                </span>
              </Link>
            ) : (
              <div /> // Spacer
            )}
          </div>
        </nav>
      </article>
    </Layout>
  );
}
