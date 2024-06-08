const products = require("./elements");
const ShortUniqueId = require("short-unique-id");

const uid = new ShortUniqueId({ length: 10 });

const comments = [
  {
    id: uid.rnd(),
    productId: products[0].id,
    text: "string",
    date: new Date(),
    comments: [
      {
        id: uid.rnd(),
        text: "string2",
        date: new Date(),
        comments: [
          {
            id: uid.rnd(),
            text: "string1",
            date: new Date(),
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
    comments: [
      {
        id: uid.rnd(),
        text: "string1",
        date: new Date(),
        comments: [],
      },
    ],
  },
  {
    id: uid.rnd(),
    productId: products[2].id,
    text: "string1",
    date: new Date(),
    comments: [],
  },
  {
    id: uid.rnd(),
    productId: products[3].id,
    text: "string",
    date: new Date(),
    comments: [
      {
        id: uid.rnd(),
        text: "string2",
        date: new Date(),
        comments: [
          {
            id: uid.rnd(),
            text: "string1",
            date: new Date(),
            comments: [],
          },
        ],
      },
    ],
  },
  {
    id: uid.rnd(),
    productId: products[4].id,
    text: "string2",
    date: new Date(),
    comments: [
      {
        id: uid.rnd(),
        text: "string1",
        date: new Date(),
        comments: [],
      },
    ],
  },
  {
    id: uid.rnd(),
    productId: products[5].id,
    text: "string",
    date: new Date(),
    comments: [
      {
        id: uid.rnd(),
        text: "string2",
        date: new Date(),
        comments: [
          {
            id: uid.rnd(),
            text: "string1",
            date: new Date(),
            comments: [],
          },
        ],
      },
    ],
  },
  {
    id: uid.rnd(),
    productId: products[6].id,
    text: "string2",
    date: new Date(),
    comments: [
      {
        id: uid.rnd(),
        text: "string1",
        date: new Date(),
        comments: [],
      },
    ],
  },
  {
    id: uid.rnd(),
    productId: products[7].id,
    text: "string1",
    date: new Date(),
    comments: [],
  },
  {
    id: uid.rnd(),
    productId: products[8].id,
    text: "string",
    date: new Date(),
    comments: [
      {
        id: uid.rnd(),
        text: "string2",
        date: new Date(),
        comments: [
          {
            id: uid.rnd(),
            text: "string1",
            date: new Date(),
            comments: [],
          },
        ],
      },
    ],
  },
  {
    id: uid.rnd(),
    productId: products[9].id,
    text: "string2",
    date: new Date(),
    comments: [
      {
        id: uid.rnd(),
        text: "string1",
        date: new Date(),
        comments: [],
      },
    ],
  },
];

module.exports = { comments };
