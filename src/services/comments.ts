import ShortUniqueId from "short-unique-id";
import { User, Comment } from "../database/comments";
import {
  getAllComments as dbGetComments,
  findCommentsByProductId as dbGetCommentsByProductId,
  addComment as dbAddComment,
  updateComment as dbUpdateComment,
  deleteComment as dbDeleteComment,
  RepositoryResponse,
} from "../database/repositories/comments";
const uid = new ShortUniqueId({ length: 10 });

const addNestedComment = (
  commentList: Comment[],
  newComment: Comment,
  parentCommentId: string
) => {
  for (let comment of commentList) {
    if (comment.id === parentCommentId) {
      comment.comments.push(newComment);
      return;
    }
    if (comment.comments.length > 0) {
      addNestedComment(comment.comments, newComment, parentCommentId);
    }
  }
};

const commentsService = {
  getComments: async (): Promise<RepositoryResponse<Comment[]>> => {
    const response = await dbGetComments();
    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },

  getCommentsByProductId: async (
    productId: string
  ): Promise<RepositoryResponse<Comment[]>> => {
    const response = await dbGetCommentsByProductId(productId);
    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },

  addComment: async (
    productId: string,
    text: string,
    userId: string | null = null,
    parentCommentId: string | null = null
  ): Promise<{
    data: Comment | null;
    errorMessage: string | null;
    errorRaw: Error | null;
  }> => {
    const newComment = {
      id: uid.rnd(),
      productId,
      text,
      date: new Date(),
      userId,
      parentCommentId,
    };

    const response = await dbAddComment(
      newComment.id,
      newComment.productId,
      newComment.text,
      newComment.date,
      newComment.userId,
      newComment.parentCommentId
    );

    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },

  updateComment: async (
    id: string,
    newText: string
  ): Promise<{
    data: Comment | null;
    errorMessage: string | null;
    errorRaw: Error | null;
  }> => {
    const response = await dbUpdateComment(id, newText);

    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },

  deleteComment: async (
    id: string
  ): Promise<{
    data: boolean;
    errorMessage: string | null;
    errorRaw: Error | null;
  }> => {
    const response = await dbDeleteComment(id);

    return {
      data: response.data,
      errorMessage: response.errorMessage,
      errorRaw: response.errorRaw,
    };
  },
};

export { commentsService };
