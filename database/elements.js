const ShortUniqueId = require("short-unique-id");

const uid = new ShortUniqueId({ length: 10 });

const elements = [
  {
    id: uid.rnd(),
    title: "string",
    amount: 1,
    favorite: false,
  },
  {
    id: uid.rnd(),
    title: "the string",
    amount: 1,
    favorite: false,
  },
  {
    id: uid.rnd(),
    title: "stringing",
    amount: 1,
    favorite: false,
  },
  {
    id: uid.rnd(),
    title: "strings",
    amount: 1,
    favorite: false,
  },
  {
    id: uid.rnd(),
    title: "stringer",
    amount: 1,
    favorite: false,
  },
  {
    id: uid.rnd(),
    title: "string",
    amount: 1,
    favorite: false,
  },
];

module.exports = { elements };
