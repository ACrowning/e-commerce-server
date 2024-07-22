"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comments_1 = require("../services/comments");
const Router = express_1.default.Router();
Router.get("/", (req, res) => {
    const allComments = comments_1.commentsService.getComments();
    res.send({ data: allComments });
});
Router.post("/comment", (req, res) => {
    const { productId, text, user, parentCommentId } = req.body;
    const newComment = comments_1.commentsService.addComment(productId, text, user, parentCommentId);
    if (newComment) {
        res.status(201).json({ data: newComment });
    }
    else {
        res.status(400).json({ message: "Unable to add comment" });
    }
});
Router.delete("/:id", (req, res) => {
    const commentId = req.params.id;
    const deletedComment = comments_1.commentsService.removeComment(commentId);
    if (deletedComment) {
        res
            .status(200)
            .json({ message: "Comment deleted successfully", data: deletedComment });
    }
    else {
        res.status(404).json({ message: "Not found" });
    }
});
Router.put("/:id", (req, res) => {
    const commentId = req.params.id;
    const { text } = req.body;
    const changeComment = comments_1.commentsService.editComment(commentId, text);
    if (changeComment) {
        res
            .status(200)
            .json({ message: "Comment updated successfully", data: changeComment });
    }
    else {
        res.status(404).json({ message: "Not found" });
    }
});
exports.default = Router;
//# sourceMappingURL=comments.js.map