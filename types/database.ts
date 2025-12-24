export type ProductType = 'ebook' | 'course';

export interface Profile {
  id: string;
  name: string | null;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Product {
  id: string;
  type: ProductType;
  title: string;
  slug: string;
  description: string;
  price: number;
  cover_image: string | null;
  author: string | null;
  page_count: number | null;
  duration: string | null;
  published: boolean;
  created_at: string;
}

export interface EbookAsset {
  id: string;
  product_id: string;
  storage_path: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  order: number;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  video_path: string;
  duration: string | null;
  order: number;
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  stripe_session_id: string | null;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface ProductWithModules extends Product {
  course_modules?: (CourseModule & {
    course_lessons?: CourseLesson[];
  })[];
}
