const ShortUniqueId = require("short-unique-id");

const uid = new ShortUniqueId({ length: 10 });

const products = [
  {
    id: uid.rnd(),
    title: "string",
    amount: 1,
    price: 1,
    favorite: false,
  },
  {
    id: uid.rnd(),
    title: "the string",
    amount: 1,
    price: 2,
    favorite: false,
  },
  {
    id: uid.rnd(),
    title: "stringing",
    amount: 1,
    price: 3,
    favorite: false,
  },
  {
    id: uid.rnd(),
    title: "strings",
    amount: 1,
    price: 1,
    favorite: false,
  },
  {
    id: uid.rnd(),
    title: "stringer",
    amount: 1,
    price: 2,
    favorite: false,
  },
  {
    id: uid.rnd(),
    title: "string",
    amount: 1,
    price: 3,
    favorite: false,
  },
];

module.exports = products;
