const cartItems: any[] = [];

export interface ShopCart {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  price: number;
}

export { cartItems };
