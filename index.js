const express = require("express");
const cors = require("cors");
const app = express();

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

app.get("/elements/:id", function (req, res, next) {
  const id = req.params.id;
  const element = elements.find((element) => element.id === parseInt(id));
  res.json([element]);
});

app.listen(PORT, readyMessage);

app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});
