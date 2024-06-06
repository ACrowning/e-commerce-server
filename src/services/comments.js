const { comments } = require("../../database/comments");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });

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
      const addNestedComment = (commentList) => {
        for (let comment of commentList) {
          if (comment.id === parentCommentId) {
            comment.comments.push(newComment);
            return true;
          }
          if (comment.comments.length > 0) {
            const added = addNestedComment(comment.comments);
            if (added) return true;
          }
        }
        return false;
      };

      addNestedComment(comments);
    } else {
      comments.push(newComment);
    }

    return newComment;
  },

  removeComment: (commentId) => {
    const findAndRemoveComment = (comments) => {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === commentId) {
          comments.splice(i, 1);
          return true;
        }
        if (comments[i].comments.length > 0) {
          const found = findAndRemoveComment(comments[i].comments);
          if (found) return true;
        }
      }
      return false;
    };

    findAndRemoveComment(comments);
    return comments;
  },

  editComment: (commentId, newText) => {
    const findAndUpdateComment = (commentList) => {
      for (let i = 0; i < commentList.length; i++) {
        if (commentList[i].id === commentId) {
          commentList[i].text = newText;
          commentList[i].date = new Date();
          return true;
        }
        if (commentList[i].comments.length > 0) {
          const updated = findAndUpdateComment(commentList[i].comments);
          if (updated) return true;
        }
      }
      return false;
    };

    findAndUpdateComment(comments);
    return comments;
  },
};

module.exports = { commentsService };
