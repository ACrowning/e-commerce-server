"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsService = void 0;
const comments_1 = require("../database/comments");
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const uid = new short_unique_id_1.default({ length: 10 });
const addNestedComment = (commentList, newComment, parentCommentId) => {
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
const findAndRemoveComment = (commentList, commentId) => {
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
const findAndUpdateComment = (commentList, commentId, newText) => {
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
        return comments_1.comments;
    },
    getCommentsByProductId: (productId) => {
        return comments_1.comments.filter((comment) => comment.productId === productId);
    },
    addComment: (productId, text, user, parentCommentId = null) => {
        const newComment = {
            id: uid.rnd(),
            productId,
            text,
            date: new Date(),
            user,
            comments: [],
        };
        if (parentCommentId) {
            addNestedComment(comments_1.comments, newComment, parentCommentId);
        }
        else {
            comments_1.comments.push(newComment);
        }
        return newComment;
    },
    removeComment: (commentId) => {
        findAndRemoveComment(comments_1.comments, commentId);
        return comments_1.comments;
    },
    editComment: (commentId, newText) => {
        findAndUpdateComment(comments_1.comments, commentId, newText);
        return comments_1.comments;
    },
};
exports.commentsService = commentsService;
//# sourceMappingURL=comments.js.map