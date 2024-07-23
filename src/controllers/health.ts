import { Request, Response } from "express";
import { pool } from "../db";

export const checkHealth = async (req: Request, res: Response) => {
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
};
