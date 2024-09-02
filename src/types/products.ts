export interface Product {
  id: string;
  title: string;
  amount: number;
  price: number;
  favorite: boolean;
  image?: string | null;
  albumPhotos?: string[];
}

export interface ProductRow {
  id: string;
  title: string;
  amount: number;
  price: number;
  favorite: boolean;
  image?: string | null;
  album_photos?: string[];
}

export interface GetProductsParams {
  title?: string;
  sortByPrice?: "asc" | "desc";
  page?: number;
  limit?: number | "*";
}
