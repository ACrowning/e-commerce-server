const express = require("express");
const cors = require("cors");
const app = express();
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });

const ProductRoutes = require("./src/controllers/products.js");
const CartRoutes = require("./src/controllers/cart.js");
const { comments } = require("./database/comments");

const PORT = process.env.PORT || 4000;
const readyMessage = () => console.log("Server on http://localhost:" + PORT);

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/products", ProductRoutes);
app.use("/cart", CartRoutes);

app.get("/", (req, res) => {
  res.send({ data: "The server works successfully!" });
});

app.get("/comments", (req, res) => {
  res.send({ data: comments });
});

app.delete("/comments/:id", (req, res) => {
  const commentId = req.params.id;
  const indexComment = comments.findIndex(
    (comment) => comment.id === commentId
  );
  if (indexComment === -1) {
    return res.status(404).json({ message: "Not found" });
  }
  comments.splice(indexComment, 1);

  res
    .status(200)
    .json({ message: "Comment deleted successfully", data: comments });
});

app.put("/comments/:id", (req, res) => {
  const commentId = req.params.id;
  const indexComment = comments.findIndex(
    (comment) => comment.id === commentId
  );
  if (indexComment === -1) {
    return res.status(404).json({ message: "Not found" });
  }
  comments[indexComment] = {
    ...comments[indexComment],
    ...req.body,
  };

  res
    .status(200)
    .json({ message: "Comment updated successfully", data: commentId });
});

app.listen(PORT, readyMessage);

app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});
