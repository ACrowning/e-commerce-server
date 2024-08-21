import { promises as fs } from "fs";
import { pool } from "../db";
import path from "path";

export async function readSqlFile(fileName: string): Promise<string> {
  try {
    const filePath = path.join(__dirname, "./queries", fileName);
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    throw `Error reading SQL file: ${error}`;
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
