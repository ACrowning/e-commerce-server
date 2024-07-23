import express from "express";
import cors from "cors";
import path from "path";
import ProductRoutes from "./controllers/products";
import CartRoutes from "./controllers/cart";
import CommentsRoutes from "./controllers/comments";
import UsersRoutes from "./controllers/auth";
import { checkHealth } from "./controllers/health";
import { initDatabaseStructure } from "./database/index";

const app = express();
const PORT = process.env.PORT || 4000;
const readyMessage = () => console.log("Server on http://localhost:" + PORT);

async function initApp() {
  try {
    await initDatabaseStructure(
      path.join(__dirname, "database", "queries", "init.sql")
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({ origin: "*" }));
    app.use("/products", ProductRoutes);
    app.use("/cart", CartRoutes);
    app.use("/comments", CommentsRoutes);
    app.use("/static", express.static(path.join("uploads")));
    app.use("/auth", UsersRoutes);

    app.get("/health", checkHealth);

    app.listen(PORT, readyMessage);

    app.listen(80, function () {
      console.log("CORS-enabled web server listening on port 80");
    });
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

initApp();
