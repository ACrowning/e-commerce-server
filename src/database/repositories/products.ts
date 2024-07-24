import { pool } from "../../db";
import { Product } from "../elements";
import { QueryResult } from "pg";

export async function createProduct(product: Product): Promise<Product> {
  const { id, title, amount, price, favorite, image, albumPhotos } = product;

  const query = `
    INSERT INTO products (id, title, amount, price, favorite, image, album_photos)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

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
    return result.rows[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error creating product: ${error.message}`);
    } else {
      throw new Error("Unknown error creating product");
    }
  }
}

export async function getProducts(
  params: GetProductsParams
): Promise<Product[]> {
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
    return result.rows;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error creating product: ${error.message}`);
    } else {
      throw new Error("Unknown error creating product");
    }
  }
}

export async function deleteProduct(
  productId: string
): Promise<Product | null> {
  const query = `
    DELETE FROM products
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const result: QueryResult<Product> = await pool.query(query, [productId]);
    return result.rows[0] || null;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error deleting product: ${error.message}`);
    } else {
      throw new Error("Unknown error deleting product");
    }
  }
}

export async function updateProduct(
  productId: string,
  updatedData: Partial<Product>
): Promise<Product | null> {
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
    return result.rows[0] || null;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error updating product: ${error.message}`);
    } else {
      throw new Error("Unknown error updating product");
    }
  }
}

interface GetProductsParams {
  title?: string;
  sortByPrice?: "asc" | "desc";
  page?: number;
  limit?: number | "*";
}
