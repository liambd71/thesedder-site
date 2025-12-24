import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/database";
import { Search } from "lucide-react";

const mockProducts: Product[] = [
  {
    id: "1",
    type: "course",
    title: "Complete JavaScript Mastery",
    slug: "complete-javascript-mastery",
    description: "A comprehensive guide to JavaScript programming from basics to advanced concepts.",
    price: 2500,
    cover_image: null,
    author: "TheSedder",
    page_count: null,
    duration: "15 hours",
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    type: "course",
    title: "React for Beginners",
    slug: "react-for-beginners",
    description: "Build modern web applications with React.",
    price: 1800,
    cover_image: null,
    author: "TheSedder",
    page_count: null,
    duration: "12 hours",
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    type: "ebook",
    title: "The Art of Clean Code",
    slug: "art-of-clean-code",
    description: "Write maintainable, scalable code that stands the test of time.",
    price: 450,
    cover_image: null,
    author: "TheSedder",
    page_count: 280,
    duration: null,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    type: "course",
    title: "Web Development Fundamentals",
    slug: "web-development-fundamentals",
    description: "Learn HTML, CSS, and JavaScript from scratch.",
    price: 3200,
    cover_image: null,
    author: "TheSedder",
    page_count: null,
    duration: "25 hours",
    published: true,
    created_at: new Date().toISOString(),
  },
];

interface ShopPageProps {
  searchParams: { type?: string; search?: string };
}

export default function ShopPage({ searchParams }: ShopPageProps) {
  const { type, search } = searchParams;
  
  let filteredProducts = mockProducts;
  
  if (type && (type === 'ebook' || type === 'course')) {
    filteredProducts = filteredProducts.filter(p => p.type === type);
  }
  
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Shop</h1>
            <p className="text-muted-foreground">
              Browse our collection of premium eBooks and courses. All prices in BDT.
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
              <div className="flex flex-wrap gap-2">
                <a href="/shop">
                  <Badge 
                    variant={!type ? "default" : "outline"} 
                    className="cursor-pointer"
                    data-testid="filter-all"
                  >
                    All
                  </Badge>
                </a>
                <a href="/shop?type=ebook">
                  <Badge 
                    variant={type === 'ebook' ? "default" : "outline"} 
                    className="cursor-pointer"
                    data-testid="filter-ebook"
                  >
                    eBooks
                  </Badge>
                </a>
                <a href="/shop?type=course">
                  <Badge 
                    variant={type === 'course' ? "default" : "outline"} 
                    className="cursor-pointer"
                    data-testid="filter-course"
                  >
                    Courses
                  </Badge>
                </a>
              </div>

              <form className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search products..."
                  defaultValue={search}
                  className="pl-10 w-full md:w-64"
                  data-testid="input-search"
                />
              </form>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found.</p>
                <a href="/shop">
                  <Button variant="outline">Clear Filters</Button>
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
