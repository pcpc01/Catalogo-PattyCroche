
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
}

export interface CartItem extends Product {
  quantity: number;
}

export type PageName = 'home' | 'catalog' | 'about' | 'contact' | 'cart' | 'product-details';
