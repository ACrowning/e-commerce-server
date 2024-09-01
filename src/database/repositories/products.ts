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
): Promise<RepositoryResponse<Product[]>> {
  const { title, sortByPrice, page = 1, limit = 10 } = params;

  let query = await readSqlFile("get_products.sql");
  const values: (string | number)[] = [];
  let valueIndex = 1;

  if (title) {
    const searchQuery = await readSqlFile("get_products_search.sql");
    values.push(`%${title}%`);
    query += ` ${searchQuery.replace("$1", `$${valueIndex}`)}`;
    valueIndex++;
  }

  if (sortByPrice) {
    let sortQuery = await readSqlFile("get_products_sort_by_price.sql");
    sortQuery = sortQuery.replace(
      "ASC",
      sortByPrice === "asc" ? "ASC" : "DESC"
    );
    query += ` ${sortQuery}`;
  }

  if (limit !== "*") {
    const paginationQuery = await readSqlFile("get_products_pagination.sql");
    const offset = (page - 1) * limit;
    values.push(limit, offset);
    query += ` ${paginationQuery
      .replace("$1", `$${valueIndex}`)
      .replace("$2", `$${valueIndex + 1}`)}`;
  }

  try {
    const result: QueryResult<Product> = await pool.query(query, values);
    const mappedProducts = result.rows.map(mapProductRowToProduct);
    return { data: mappedProducts, errorMessage: null, errorRaw: null };
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
