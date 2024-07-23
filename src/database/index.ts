import { promises as fs } from "fs";
import path from "path";
import { pool } from "../db";

async function readSqlFile(filePath: string): Promise<string> {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (error) {
    throw new Error(`Error reading SQL file`);
  }
}

export async function initDatabaseStructure(
  sqlFilePath: string
): Promise<void> {
  try {
    const sqlQuery = await readSqlFile(sqlFilePath);

    await pool.query(sqlQuery);

    console.log("Database structure initialized successfully.");
  } catch (error) {
    console.error("Error initializing database structure:", error);
  }
}

const sqlFilePath = path.join(__dirname, "database", "queries", "init.sql");

initDatabaseStructure(sqlFilePath);
