import { comments } from "../database/comments";
import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId({ length: 10 });

const addNestedComment = (commentList: any, newComment: any, parentCommentId: any) => {
  for (let comment of commentList) {
    if (comment.id === parentCommentId) {
      comment.comments.push(newComment);
    }
    if (comment.comments.length > 0) {
      addNestedComment(comment.comments, newComment, parentCommentId);
    }
  }
};

const findAndRemoveComment = (commentList: any, commentId: any) => {
  for (let i = 0; i < commentList.length; i++) {
    if (commentList[i].id === commentId) {
      commentList.splice(i, 1);
      break;
    }
    if (commentList[i].comments.length > 0) {
      findAndRemoveComment(commentList[i].comments, commentId);
    }
  }
};

const findAndUpdateComment = (commentList: any, commentId: any, newText: any) => {
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

  getCommentsByProductId: (productId: any) => {
    return comments.filter((comment: any) => comment.productId === productId);
  },

  addComment: (productId: any, text: any, parentCommentId = null) => {
    const newComment = {
      id: uid.rnd(),
      productId,
      text,
      date: new Date(),
      comments: [],
    };

    if (parentCommentId) {
      addNestedComment(comments, newComment, parentCommentId);
    } else {
      comments.push(newComment);
    }

    return newComment;
  },

  removeComment: (commentId: any) => {
    findAndRemoveComment(comments, commentId);
    return comments;
  },

  editComment: (commentId: any, newText: any) => {
    findAndUpdateComment(comments, commentId, newText);
    return comments;
  },
};

export { commentsService }
