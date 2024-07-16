import { comments } from "../database/comments";
import ShortUniqueId from "short-unique-id";
import { User, Comment } from "../database/comments";
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
  getComments: () => {
    return comments;
  },

  getCommentsByProductId: (productId: string) => {
    return comments.filter((comment) => comment.productId === productId);
  },

  addComment: (
    productId: string,
    text: string,
    user: User,
    parentCommentId: string | null = null
  ) => {
    const newComment: Comment = {
      id: uid.rnd(),
      productId,
      text,
      date: new Date(),
      user,
      comments: [],
    };

    if (parentCommentId) {
      addNestedComment(comments, newComment, parentCommentId);
    } else {
      comments.push(newComment);
    }

    return newComment;
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
