import { products } from "./elements";
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

const comments: Comment[] = [
  {
    id: uid.rnd(),
    productId: products[0].id,
    text: "string",
    date: new Date(),
    user: { name: "User1", id: "user1" },
    comments: [
      {
        id: uid.rnd(),
        productId: products[0].id,
        text: "string2",
        date: new Date(),
        user: { name: "User2", id: "user2" },
        comments: [
          {
            id: uid.rnd(),
            productId: products[0].id,
            text: "string1",
            date: new Date(),
            user: { name: "User3", id: "user3" },
            comments: [],
          },
        ],
      },
    ],
  },
  {
    id: uid.rnd(),
    productId: products[1].id,
    text: "string2",
    date: new Date(),
    user: { name: "User4", id: "user4" },
    comments: [
      {
        id: uid.rnd(),
        productId: products[1].id,
        text: "string1",
        date: new Date(),
        user: { name: "User5", id: "user5" },
        comments: [],
      },
    ],
  },
];

export { comments };
