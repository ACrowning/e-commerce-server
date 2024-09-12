import { Product } from "./products";

export interface ShopCart {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  userId: string;
  amount: number;
  product: Product;
}
