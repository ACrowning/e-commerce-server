const express = require("express");
const cors = require("cors");
const app = express();

const { products } = require("./database/products");
const { comments } = require("./database/comments");

const PORT = process.env.PORT || 3000;
const readyMessage = () => console.log("Server on http://localhost:" + PORT);

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send({ data: "The server works successfully!" });
});

app.get("/products", (req, res) => {
  res.send({ data: products });
});

app.get("/comments", (req, res) => {
  res.send({ data: comments });
});

app.get("/products/:id", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

app.listen(PORT, readyMessage);

app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});
