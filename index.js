const express = require("express");
const cors = require("cors");
const app = express();
const ShortUniqueId = require("short-unique-id");

const uid = new ShortUniqueId({ length: 10 });

const { elements } = require("./database/elements");
const { cartItems } = require("./database/cartItems");

const PORT = process.env.PORT || 4000;
const readyMessage = () => console.log("Server on http://localhost:" + PORT);

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send({ data: "The server works successfully!" });
});

app.get("/elements", (req, res) => {
  res.send({ data: elements });
});

app.get("/cart", (req, res) => {
  res.send({ data: cartItems });
});

app.post("/elements", (req, res) => {
  const { title, amount, favorite } = req.body;
  const newUser = { id: uid.rnd(), title, amount, favorite };
  elements.push(newUser);
  res
    .status(201)
    .json({ message: "Element created successfully", data: newUser });
});

app.post("/cart", (req, res) => {
  const newItem = req.body;
  const existingItem = cartItems.find((item) => item.id === newItem.id);
  if (existingItem) {
    existingItem.amount += newItem.amount;
  } else {
    cartItems.push(newItem);
  }

  res.status(201).json({
    message: "Item added to cart successfully",
    data: cartItems,
  });
});

app.put("/elements/:id", (req, res) => {
  const elementId = req.params.id;
  const index = elements.findIndex((element) => element.id === elementId);
  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }
  elements[index] = {
    ...elements[index],
    ...req.body,
  };
  res
    .status(200)
    .json({ message: "User updated successfully", data: elementId });
});

app.put("/cart/:id", (req, res) => {
  const elementId = req.params.id;
  const index = cartItems.findIndex((element) => element.id === elementId);
  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  cartItems[index] = {
    ...cartItems[index],
    ...req.body,
  };
  res
    .status(200)
    .json({ message: "User updated successfully", data: elementId });
});

app.delete("/cart/:id", (req, res) => {
  const elementId = req.params.id;
  const indexCart = cartItems.findIndex((element) => element.id === elementId);
  if (indexCart === -1) {
    return res.status(404).json({ message: "Not found" });
  }
  cartItems.splice(indexCart, 1);
  const indexElement = elements.find((element) => element.id === elementId);
  if (!indexElement) {
    return res.status(404).json({ message: "Element not found" });
  }
  indexElement.amount += indexCart.amount;
  res
    .status(200)
    .json({ message: "User deleted successfully", data: cartItems });
});

app.delete("/elements/:id", (req, res) => {
  const elementId = req.params.id;
  const index = elements.findIndex((element) => element.id === elementId);
  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }
  elements.splice(index, 1);
  res
    .status(200)
    .json({ message: "User deleted successfully", data: elementId });
});

app.get("/elements/:id", function (req, res, next) {
  const id = req.params.id;
  const element = elements.find((element) => element.id === id);
  res.json(element);
});

app.listen(PORT, readyMessage);

app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});
