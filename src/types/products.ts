const ShortUniqueId = require("short-unique-id");

const uid = new ShortUniqueId({ length: 10 });

export interface Product {
  id: string;
  title: string;
  amount: number;
  price: number;
  favorite: boolean;
  image?: string | null;
  albumPhotos?: string[];
}
