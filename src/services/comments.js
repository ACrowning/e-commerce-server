const { comments } = require("../../database/comments");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });

const addNestedComment = (commentList, newComment, parentCommentId) => {
  for (let comment of commentList) {
    if (comment.id === parentCommentId) {
      comment.comments.push(newComment);
      return true;
    }
    if (comment.comments.length > 0) {
      const added = addNestedComment(
        comment.comments,
        newComment,
        parentCommentId
      );
      if (added) return true;
    }
  }
};

const findAndRemoveComment = (commentList, commentId) => {
  for (let i = 0; i < commentList.length; i++) {
    if (commentList[i].id === commentId) {
      commentList.splice(i, 1);
      return true;
    }
    if (commentList[i].comments.length > 0) {
      const found = findAndRemoveComment(commentList[i].comments, commentId);
      if (found) return true;
    }
  }
};

const findAndUpdateComment = (commentList, commentId, newText) => {
  for (let i = 0; i < commentList.length; i++) {
    if (commentList[i].id === commentId) {
      commentList[i].text = newText;
      commentList[i].date = new Date();
      return true;
    }
    if (commentList[i].comments.length > 0) {
      const updated = findAndUpdateComment(
        commentList[i].comments,
        commentId,
        newText
      );
      if (updated) return true;
    }
  }
};

const commentsService = {
  getComments: () => {
    return comments;
  },

  getCommentsByProductId: (productId) => {
    return comments.filter((comment) => comment.productId === productId);
  },

  addComment: (productId, text, parentCommentId = null) => {
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

  removeComment: (commentId) => {
    findAndRemoveComment(comments, commentId);
    return comments;
  },

  editComment: (commentId, newText) => {
    findAndUpdateComment(comments, commentId, newText);
    return comments;
  },
};

module.exports = { commentsService };
