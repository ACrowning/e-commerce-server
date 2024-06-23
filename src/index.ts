import express from "express";
import cors from "cors";
const app = express();
import path from "path";

import ProductRoutes from "./controllers/products";
import CartRoutes from "./controllers/cart";
import CommentsRoutes from "./controllers/comments";

const PORT = process.env.PORT || 4000;
const readyMessage = () => console.log("Server on http://localhost:" + PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use("/products", ProductRoutes);
app.use("/cart", CartRoutes);
app.use("/comments", CommentsRoutes);
app.use("/static", express.static(path.join("uploads")));

app.get("/", (req: any, res: any) => {
  res.send({ data: "The server works successfully!!!!" });
});

app.listen(PORT, readyMessage);

app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});
