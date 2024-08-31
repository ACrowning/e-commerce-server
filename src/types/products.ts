export interface Product {
  album_photos: any;
  id: string;
  title: string;
  amount: number;
  price: number;
  favorite: boolean;
  image?: string | null;
  albumPhotos?: string[];
}
