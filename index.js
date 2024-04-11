const express = require("express");
const cors = require("cors");
const app = express();
const ShortUniqueId = require("short-unique-id");

const uid = new ShortUniqueId({ length: 10 });

const { elements } = require("./database/elements");

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

app.post("/elements", (req, res) => {
  const { title, amount, favorite } = req.body;
  const newUser = { id: uid.rnd(), title, amount, favorite };
  elements.push(newUser);
  res
    .status(201)
    .json({ message: "Element created successfully", data: newUser });
});

app.delete("/elements/:id", (req, res) => {
  const elementId = req.params.id;
  const index = elements.findIndex((element) => element.id === elementId);
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
