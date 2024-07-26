import { pool } from "../../db";
import { Product } from "../elements";
import { QueryResult } from "pg";
import { promises as fs } from "fs";
import path from "path";

export interface GetProductsParams {
  title?: string;
  sortByPrice?: "asc" | "desc";
  page?: number;
  limit?: number | "*";
}

async function readSqlFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    throw `Error reading SQL file: ${error}`;
  }
}

interface RepositoryResponse<T> {
  data: T | null;
  error: string | null;
}

export async function createProduct(
  product: Product
): Promise<RepositoryResponse<Product>> {
  const { id, title, amount, price, favorite, image, albumPhotos } = product;

  const query = await readSqlFile(
    path.join(__dirname, "../queries/create_product.sql")
  );
  const values = [
    id,
    title,
    amount,
    price,
    favorite,
    image,
    JSON.stringify(albumPhotos),
  ];

  try {
    const result: QueryResult<Product> = await pool.query(query, values);
    return { data: result.rows[0], error: null };
  } catch (error) {
    return { data: null, error: `Error creating product: ${error}` };
  }
}

export async function getProducts(
  params: GetProductsParams
): Promise<RepositoryResponse<Product[]>> {
  const { title, sortByPrice, page = 1, limit = 10 } = params;

  let query = "SELECT * FROM products";
  const values: any[] = [];

  if (title) {
    values.push(`%${title}%`);
    query += ` WHERE title ILIKE $${values.length}`;
  }

  if (sortByPrice) {
    query += ` ORDER BY price ${sortByPrice === "asc" ? "ASC" : "DESC"}`;
  }

  if (limit !== "*") {
    const offset = (page - 1) * limit;
    values.push(limit, offset);
    query += ` LIMIT $${values.length - 1} OFFSET $${values.length}`;
  }

  try {
    const result: QueryResult<Product> = await pool.query(query, values);
    return { data: result.rows, error: null };
  } catch (error) {
    return { data: null, error: `Error fetching products: ${error}` };
  }
}

export async function deleteProduct(
  productId: string
): Promise<RepositoryResponse<Product | null>> {
  const query = `
    DELETE FROM products
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const result: QueryResult<Product> = await pool.query(query, [productId]);
    return { data: result.rows[0] || null, error: null };
  } catch (error) {
    return { data: null, error: `Error deleting product: ${error}` };
  }
}

export async function updateProduct(
  productId: string,
  updatedData: Partial<Product>
): Promise<RepositoryResponse<Product | null>> {
  const { title, amount, price, favorite, image, albumPhotos } = updatedData;

  const query = `
    UPDATE products
    SET title = COALESCE($2, title),
        amount = COALESCE($3, amount),
        price = COALESCE($4, price),
        favorite = COALESCE($5, favorite),
        image = COALESCE($6, image),
        album_photos = COALESCE($7, album_photos)
    WHERE id = $1
    RETURNING *;
  `;

  const values = [
    productId,
    title,
    amount,
    price,
    favorite,
    image,
    albumPhotos,
  ];

  try {
    const result: QueryResult<Product> = await pool.query(query, values);
    return { data: result.rows[0] || null, error: null };
  } catch (error) {
    return { data: null, error: `Error updating product: ${error}` };
  }
}
