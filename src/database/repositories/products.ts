import { pool } from "../../db";
import { Product } from "../elements";
import { QueryResult } from "pg";
import { readSqlFile } from "..";

export interface GetProductsParams {
  title?: string;
  sortByPrice?: "asc" | "desc";
  page?: number;
  limit?: number | "*";
}

interface RepositoryResponse<T> {
  data: T | null;
  errorMessage: string | null;
  errorRaw: Error | null;
}

export async function createProduct(
  product: Product
): Promise<RepositoryResponse<Product>> {
  const { id, title, amount, price, favorite, image, albumPhotos } = product;

  const query = await readSqlFile("create_product.sql");
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
    return { data: result.rows[0], errorMessage: null, errorRaw: null };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error creating product",
      errorRaw: error as Error,
    };
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
    return { data: result.rows, errorMessage: null, errorRaw: null };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error fetching products",
      errorRaw: error as Error,
    };
  }
}

export async function deleteProduct(productId: string): Promise<{
  data: Product | null;
  errorMessage: string | null;
  errorRaw: Error | null;
}> {
  try {
    const query = await readSqlFile("delete_product.sql");

    const result: QueryResult<Product> = await pool.query(query, [productId]);
    return { data: result.rows[0] || null, errorMessage: null, errorRaw: null };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error deleting product",
      errorRaw: error as Error,
    };
  }
}

export async function updateProduct(
  productId: string,
  updatedData: Partial<Product>
): Promise<RepositoryResponse<Product | null>> {
  const { title, amount, price, favorite, image, albumPhotos } = updatedData;

  const query = await readSqlFile("update_product.sql");
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
    return { data: result.rows[0] || null, errorMessage: null, errorRaw: null };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error updating product",
      errorRaw: error as Error,
    };
  }
}
