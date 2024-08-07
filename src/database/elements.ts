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

const products = Array(20)
  .fill(0)
  .map((_, index) => {
    return {
      id: uid.rnd(),
      title: `Product_${index + 1}`,
      amount: 1,
      price: 1 + index + 1,
      favorite: false,
      image: null,
      albumPhotos: [],
    };
  });

export { products };
