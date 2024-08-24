import { pool } from "../../db";
import { User, Comment } from "../comments";
import { QueryResult } from "pg";
import { readSqlFile } from "..";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });

export interface RepositoryResponse<T> {
  data: T | null;
  errorMessage: string | null;
  errorRaw: Error | null;
}

export async function addComment(
  id: string,
  productId: string,
  text: string,
  date: Date,
  userId: string | null,
  parentCommentId: string | null
): Promise<{
  data: Comment | null;
  errorMessage: string | null;
  errorRaw: Error | null;
}> {
  const query = await readSqlFile("add_comment.sql");
  const values = [id, productId, text, date, userId, parentCommentId];

  try {
    const result: QueryResult<Comment> = await pool.query(query, values);
    return {
      data: result.rows[0] || null,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error adding comment",
      errorRaw: error as Error,
    };
  }
}

export async function findCommentsByProductId(
  productId: string
): Promise<RepositoryResponse<Comment[]>> {
  const query = await readSqlFile("find_comments_by_product_id.sql");
  const values = [productId];

  try {
    const result: QueryResult<Comment> = await pool.query(query, values);
    return {
      data: result.rows,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error finding comments by product ID",
      errorRaw: error as Error,
    };
  }
}

export async function getAllComments(): Promise<RepositoryResponse<Comment[]>> {
  const query = await readSqlFile("get_all_comments.sql");

  try {
    const result: QueryResult<Comment> = await pool.query(query);
    return {
      data: result.rows,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error retrieving all comments",
      errorRaw: error as Error,
    };
  }
}
