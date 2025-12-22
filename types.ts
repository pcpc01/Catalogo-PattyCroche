
export type Category = string;

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
  isNew?: boolean;
  isOnSale?: boolean;
  shopee_link?: string;
  elo7_link?: string;
  nuvemshop_link?: string;
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
  show_in_catalog?: boolean;
  additional_images?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export type PageName = 'home' | 'catalog' | 'about' | 'contact' | 'cart' | 'product-details';

export interface Order {
  id?: number;
  order_number: string;
  customer_name: string;
  customer_cep: string;
  items: any[];
  total_products: number;
  shipping_cost: number;
  shipping_method: string;
  total_general: number;
  status: string;
  created_at?: string;
}
