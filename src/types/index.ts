export type Gender = "men" | "women" | "kids" | "unisex";

export interface Category {
  id: string;
  name: string;
  slug: string;
  gender: Gender | null;
  image: string | null;
  display_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category_id: string;
  category?: Category;
  gender: Gender;
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  hero?: boolean;
  active: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  suburb: string;
  city: string;
  province: string;
  postal_code: string;
}

export interface Order {
  id: string;
  customer_id: string | null;
  guest_email: string | null;
  items: CartItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  province: string;
  shipping_address: ShippingAddress;
  status: OrderStatus;
  payfast_payment_id: string | null;
  created_at: string;
}

export interface DeliveryRate {
  id: string;
  province: string;
  rate: number;
  free_above: number | null;
  is_johannesburg: boolean;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
  /* shipping / default address */
  address_line1: string | null;
  address_line2: string | null;
  suburb: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
}
