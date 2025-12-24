import type { Product } from '@/types/database';

const products: Record<string, Product> = {
  '1': {
    id: '1',
    type: 'course',
    title: 'Complete JavaScript Mastery',
    slug: 'complete-javascript-mastery',
    description: 'A comprehensive guide to JavaScript programming from basics to advanced concepts.',
    price: 2500,
    cover_image: null,
    author: 'TheSedder',
    page_count: null,
    duration: '15 hours',
    published: true,
    created_at: new Date().toISOString(),
  },
  '2': {
    id: '2',
    type: 'course',
    title: 'React for Beginners',
    slug: 'react-for-beginners',
    description: 'Build modern web applications with React.',
    price: 1800,
    cover_image: null,
    author: 'TheSedder',
    page_count: null,
    duration: '12 hours',
    published: true,
    created_at: new Date().toISOString(),
  },
  '3': {
    id: '3',
    type: 'ebook',
    title: 'The Art of Clean Code',
    slug: 'art-of-clean-code',
    description: 'Write maintainable, scalable code that stands the test of time.',
    price: 450,
    cover_image: null,
    author: 'TheSedder',
    page_count: 280,
    duration: null,
    published: true,
    created_at: new Date().toISOString(),
  },
  '4': {
    id: '4',
    type: 'course',
    title: 'Web Development Fundamentals',
    slug: 'web-development-fundamentals',
    description: 'Learn HTML, CSS, and JavaScript from scratch.',
    price: 3200,
    cover_image: null,
    author: 'TheSedder',
    page_count: null,
    duration: '25 hours',
    published: true,
    created_at: new Date().toISOString(),
  },
};

export function getProductById(id: string): Product | null {
  return products[id] || null;
}

export function getProductBySlug(slug: string): Product | null {
  return Object.values(products).find(p => p.slug === slug) || null;
}

export function getAllProducts(): Product[] {
  return Object.values(products).filter(p => p.published);
}

export function getProductsByType(type: 'ebook' | 'course'): Product[] {
  return getAllProducts().filter(p => p.type === type);
}
