import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen, PlayCircle, ShoppingBag } from "lucide-react";

export default function LibraryPage() {
  const purchasedItems: any[] = [];
  const user = null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      
      <main className="flex-1">
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">My Library</h1>
            <p className="text-muted-foreground">
              Access all your purchased eBooks and courses
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex gap-4 mb-8 border-b">
              <button className="pb-4 border-b-2 border-primary font-medium" data-testid="tab-all">
                All
              </button>
              <button className="pb-4 text-muted-foreground hover:text-foreground" data-testid="tab-ebooks">
                eBooks
              </button>
              <button className="pb-4 text-muted-foreground hover:text-foreground" data-testid="tab-courses">
                Courses
              </button>
            </div>

            {purchasedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {purchasedItems.map((item: any) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative aspect-[3/4] bg-muted flex items-center justify-center">
                      {item.type === 'ebook' ? (
                        <BookOpen className="h-16 w-16 text-muted-foreground" />
                      ) : (
                        <PlayCircle className="h-16 w-16 text-muted-foreground" />
                      )}
                      <Badge className="absolute top-3 left-3">
                        {item.type === 'ebook' ? 'eBook' : 'Course'}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-2 mb-3">{item.title}</h3>
                      <Link href={`/library/${item.type}s/${item.id}`}>
                        <Button className="w-full">
                          {item.type === 'ebook' ? 'Read Now' : 'Watch Now'}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your library is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Start your learning journey by purchasing your first eBook or course.
                </p>
                <Link href="/shop">
                  <Button data-testid="button-browse-shop">
                    Browse Shop
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
