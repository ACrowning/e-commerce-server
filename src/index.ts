import express from "express";
import cors from "cors";
const app = express();
import path from "path";
import { Pool } from "pg";

import ProductRoutes from "./controllers/products";
import CartRoutes from "./controllers/cart";
import CommentsRoutes from "./controllers/comments";
import UsersRoutes from "./controllers/auth";
import { DATABASE_CONFIG } from "./config/config";

const PORT = process.env.PORT || 4000;
const readyMessage = () => console.log("Server on http://localhost:" + PORT);
const pool = new Pool(DATABASE_CONFIG);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use("/products", ProductRoutes);
app.use("/cart", CartRoutes);
app.use("/comments", CommentsRoutes);
app.use("/static", express.static(path.join("uploads")));
app.use("/auth", UsersRoutes);

app.get("/health", async (req: any, res: any) => {
  try {
    const result = await pool.query("SELECT 1");
    console.log("Query result:", result);

    if (result.rowCount !== null && result.rowCount > 0) {
      res.send({
        status: "ok",
        message: "The server works successfully!!!!",
        result,
      });
    } else {
      res.status(500).send({ status: "error", message: "Ping failed" });
    }
  } catch (error) {
    console.error("Database connection error:", error);
    res
      .status(500)
      .send({ status: "error", message: "Database connection failed" });
  }
});
app.listen(PORT, readyMessage);

app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});
