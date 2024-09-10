import { pool } from "../../db";
import { GetProductsParams, Product, ProductRow } from "../../types/products";
import { QueryResult } from "pg";
import { readSqlFile } from "..";
import { RepositoryResponse } from "../../types/repositoryResponse";

function mapProductRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    amount: row.amount,
    price: row.price,
    favorite: row.favorite,
    image: row.image,
    albumPhotos: row.album_photos,
  };
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
    const mappedProduct = mapProductRowToProduct(result.rows[0]);
    return { data: mappedProduct, errorMessage: null, errorRaw: null };
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
): Promise<RepositoryResponse<{ products: Product[]; total: number }>> {
  const { title, sortByPrice, page = 1, limit = 10 } = params;

  let query = await readSqlFile("get_products.sql");
  let countQuery = "SELECT COUNT(*) FROM products";
  const values: (string | number)[] = [];

  if (title) {
    values.push(`%${title}%`);
    query += ` WHERE title ILIKE $${values.length}`;
    countQuery += ` WHERE title ILIKE $${values.length}`;
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

    const countResult: QueryResult<{ count: string }> = await pool.query(
      countQuery,
      values.slice(0, title ? 1 : 0)
    );

    const total = parseInt(countResult.rows[0].count, 10);

    return {
      data: { products: result.rows, total },
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error fetching products",
      errorRaw: error as Error,
    };
  }
}

export async function getProductById(
  productId: string
): Promise<RepositoryResponse<Product>> {
  const query = await readSqlFile("get_product_by_id.sql");
  const values = [productId];

  try {
    const result: QueryResult<Product> = await pool.query(query, values);

    if (result.rows.length === 0) {
      return { data: null, errorMessage: "Product not found", errorRaw: null };
    }

    const mappedProduct = mapProductRowToProduct(result.rows[0]);
    return { data: mappedProduct, errorMessage: null, errorRaw: null };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error fetching product by ID",
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
    const mappedProduct =
      result.rows.length > 0 ? mapProductRowToProduct(result.rows[0]) : null;
    return { data: mappedProduct, errorMessage: null, errorRaw: null };
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
    JSON.stringify(albumPhotos),
  ];

  try {
    const result: QueryResult<Product> = await pool.query(query, values);
    const mappedProduct =
      result.rows.length > 0 ? mapProductRowToProduct(result.rows[0]) : null;
    return { data: mappedProduct, errorMessage: null, errorRaw: null };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error updating product",
      errorRaw: error as Error,
    };
  }
}
