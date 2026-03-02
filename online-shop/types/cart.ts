import { Product } from "./product";

// types/cart.ts
// types/cart.ts
export interface CartItem {
    id: string;
    title: string;
    price: number;
    discountedPrice?: number; // optional
    image: { url: string; alt: string };
    quantity: number;
  }
  