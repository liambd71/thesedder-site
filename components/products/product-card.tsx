import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/database";
import { BookOpen, PlayCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden group" data-testid={`card-product-${product.id}`}>
      <div className="relative aspect-[3/4] bg-muted">
        {product.cover_image ? (
          <Image
            src={product.cover_image}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            {product.type === 'ebook' ? (
              <BookOpen className="h-16 w-16 text-muted-foreground" />
            ) : (
              <PlayCircle className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
        )}
        <Badge 
          className="absolute top-3 left-3" 
          variant={product.type === 'ebook' ? 'default' : 'secondary'}
        >
          {product.type === 'ebook' ? 'eBook' : 'Course'}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-1">{product.title}</h3>
        {product.author && (
          <p className="text-sm text-muted-foreground mb-2">by {product.author}</p>
        )}
        <p className="font-bold text-lg text-primary">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/product/${product.slug}`} className="w-full">
          <Button variant="outline" className="w-full" data-testid={`button-view-${product.id}`}>
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
