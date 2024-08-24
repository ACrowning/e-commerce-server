import { comments } from "../database/comments";
import ShortUniqueId from "short-unique-id";
import { User, Comment } from "../database/comments";
import {
  getAllComments as dbGetComments,
  findCommentsByProductId as dbGetCommentsByProductId,
  addComment as dbAddComment,
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

const findAndRemoveComment = (commentList: Comment[], commentId: string) => {
  for (let i = 0; i < commentList.length; i++) {
    if (commentList[i].id === commentId) {
      commentList.splice(i, 1);
      return;
    }
    if (commentList[i].comments.length > 0) {
      findAndRemoveComment(commentList[i].comments, commentId);
    }
  }
};

const findAndUpdateComment = (
  commentList: Comment[],
  commentId: string,
  newText: string
) => {
  for (let i = 0; i < commentList.length; i++) {
    if (commentList[i].id === commentId) {
      commentList[i].text = newText;
      commentList[i].date = new Date();
    }
    if (commentList[i].comments.length > 0) {
      findAndUpdateComment(commentList[i].comments, commentId, newText);
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

  removeComment: (commentId: string) => {
    findAndRemoveComment(comments, commentId);
    return comments;
  },

  editComment: (commentId: string, newText: string) => {
    findAndUpdateComment(comments, commentId, newText);
    return comments;
  },
};

export { commentsService };
