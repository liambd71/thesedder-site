export type ProductType = 'ebook' | 'course';
export type OrderStatus = 'pending_verification' | 'paid' | 'rejected' | 'cancelled';
export type PaymentMethod = 'bkash';

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
  user_id: string | null;
  product_id: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  customer_name: string;
  customer_email: string;
  bkash_number: string;
  reference: string;
  trxid: string;
  rejection_reason: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string;
  purchased_at: string;
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

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at'>;
        Update: Partial<Omit<Product, 'id'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id'>>;
      };
      purchases: {
        Row: Purchase;
        Insert: Omit<Purchase, 'id'>;
        Update: Partial<Omit<Purchase, 'id'>>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, 'id' | 'created_at'>;
        Update: Partial<Omit<ContactMessage, 'id'>>;
      };
    };
  };
}
