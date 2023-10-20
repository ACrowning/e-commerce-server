const comments = [
  {
    userName: "user1",
    comment: "cool product",
    comments: [
      {
        userName: "user2",
        comment: "yes, this product is awesome",
        comments: [
          {
            userName: "user2222",
            comment: "hello here!",
            comments: [],
          },
        ],
      },
      {
        userName: "user2222",
        comment: "privet!",
        comments: [],
      },
    ],
  },
  {
    userName: "user3",
    comment: "hello!",
    comments: [],
  },
];

module.exports = { comments }
