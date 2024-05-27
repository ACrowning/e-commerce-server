const ShortUniqueId = require("short-unique-id");

const uid = new ShortUniqueId({ length: 10 });

const comments = [
  {
    id: uid.rnd(),
    text: "string",
    comment: [],
    date: new Date(),
  },
];

module.exports = { comments };
