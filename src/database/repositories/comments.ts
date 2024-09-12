import { pool } from "../../db";
import { Comment, CommentRow } from "../../types/comments";
import { QueryResult } from "pg";
import { readSqlFile } from "..";
import { RepositoryResponse } from "../../types/repositoryResponse";

function mapCommentRowToComment(row: CommentRow): Comment {
  return {
    id: row.id,
    productId: row.product_id,
    text: row.text,
    date: row.date,
    userId: row.user_id,
    parentCommentId: row.parent_comment_id,
  };
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
    const result: QueryResult<CommentRow> = await pool.query(query, values);
    return {
      data: result.rows[0] ? mapCommentRowToComment(result.rows[0]) : null,
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
    const result: QueryResult<CommentRow> = await pool.query(query, values);
    const comments = result.rows.map(mapCommentRowToComment);
    return {
      data: comments,
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
    const result: QueryResult<CommentRow> = await pool.query(query);
    const comments = result.rows.map(mapCommentRowToComment);
    return {
      data: comments,
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

export async function updateComment(
  id: string,
  newText: string
): Promise<{
  data: Comment | null;
  errorMessage: string | null;
  errorRaw: Error | null;
}> {
  const query = await readSqlFile("update_comment.sql");
  const values = [newText, id];

  try {
    const result: QueryResult<CommentRow> = await pool.query(query, values);
    return {
      data: result.rows[0] ? mapCommentRowToComment(result.rows[0]) : null,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: "Error updating comment",
      errorRaw: error as Error,
    };
  }
}

export async function deleteComment(id: string): Promise<{
  data: boolean;
  errorMessage: string | null;
  errorRaw: Error | null;
}> {
  const query = await readSqlFile("delete_comment.sql");
  const values = [id];

  try {
    await pool.query(query, values);
    return {
      data: true,
      errorMessage: null,
      errorRaw: null,
    };
  } catch (error) {
    return {
      data: false,
      errorMessage: "Error deleting comment",
      errorRaw: error as Error,
    };
  }
}
