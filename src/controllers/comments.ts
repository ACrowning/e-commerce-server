import express from "express";
import { commentsService } from "../services/comments";

const Router = express.Router();

Router.get("/", (req: any, res: any) => {
  const allComments = commentsService.getComments();
  res.send({ data: allComments });
});

Router.post("/comment", (req: any, res: any) => {
  const { productId, text, parentCommentId } = req.body;
  const newComment = commentsService.addComment(
    productId,
    text,
    parentCommentId
  );
  if (newComment) {
    res.status(201).json({ data: newComment });
  } else {
    res.status(400).json({ message: "Unable to add comment" });
  }
});

Router.delete("/:id", (req: any, res: any) => {
  const commentId = req.params.id;
  const deletedComment = commentsService.removeComment(commentId);
  if (deletedComment) {
    res
      .status(200)
      .json({ message: "Comment deleted successfully", data: deletedComment });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

Router.put("/:id", (req: any, res: any) => {
  const commentId = req.params.id;
  const { text } = req.body;
  const changeComment = commentsService.editComment(commentId, text);
  if (changeComment) {
    res
      .status(200)
      .json({ message: "Comment updated successfully", data: changeComment });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

export default Router
