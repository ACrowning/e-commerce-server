import express, { Request, Response } from "express";
import { commentsService } from "../services/comments";

const Router = express.Router();

Router.get("/", async (req: Request, res: Response): Promise<void> => {
  const { data: allComments, errorMessage } =
    await commentsService.getComments();

  if (errorMessage) {
    res
      .status(500)
      .json({ message: "Failed to retrieve comments", error: errorMessage });
    return;
  }

  res.status(200).json({ data: allComments });
});

Router.post("/comment", async (req: Request, res: Response): Promise<void> => {
  const { productId, text, user, parentCommentId } = req.body;

  const { data: newComment, errorMessage } = await commentsService.addComment(
    productId,
    text,
    user,
    parentCommentId
  );

  if (errorMessage) {
    res
      .status(500)
      .json({ message: "Unable to add comment", error: errorMessage });
    return;
  }

  if (newComment) {
    res.status(201).json({ data: newComment });
  }
});

Router.get("/:productId", async (req: Request, res: Response) => {
  const { productId } = req.params;

  const { data: comments, errorMessage } =
    await commentsService.getCommentsByProductId(productId);

  if (errorMessage) {
    res
      .status(500)
      .json({ message: "Failed to retrieve comments", error: errorMessage });
    return;
  }

  if (!comments || comments.length === 0) {
    res.status(404).json({ message: "No comments found for this product" });
    return;
  }

  res.status(200).json({ data: comments });
});

Router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { text } = req.body;

  const { data: updatedComment, errorMessage } =
    await commentsService.updateComment(id, text);

  if (errorMessage) {
    res
      .status(500)
      .json({ message: "Unable to update comment", error: errorMessage });
    return;
  }

  if (updatedComment) {
    res.status(200).json({ data: updatedComment });
  }
});

Router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const { data: deletedComment, errorMessage } =
    await commentsService.deleteComment(id);

  if (errorMessage) {
    res
      .status(500)
      .json({ message: "Unable to delete comment", error: errorMessage });
    return;
  }

  if (deletedComment) {
    res.status(200).json({ message: "Comment deleted successfully" });
  }
});

export default Router;
