const express = require("express");
const cors = require("cors");
const app = express();

const ProductRoutes = require("./src/controllers/products.js");
const CartRoutes = require("./src/controllers/cart.js");
const CommentsRoutes = require("./src/controllers/comments.js");

const PORT = process.env.PORT || 4000;
const readyMessage = () => console.log("Server on http://localhost:" + PORT);

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/products", ProductRoutes);
app.use("/cart", CartRoutes);
app.use("/comments", CommentsRoutes);

app.get("/", (req, res) => {
  res.send({ data: "The server works successfully!" });
});

app.listen(PORT, readyMessage);

app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});
