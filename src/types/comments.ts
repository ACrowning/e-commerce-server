import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });

export interface User {
  name: string;
  id: string;
}

export interface Comment {
  id: string;
  productId: string;
  text: string;
  date: Date;
  user: User;
  comments: Comment[];
}
