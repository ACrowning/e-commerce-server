import express, { Request, Response } from "express";
import { commentsService } from "../services/comments";

const Router = express.Router();

Router.get("/", async (req: Request, res: Response) => {
  const {
    data: allComments,
    errorMessage,
    errorRaw,
  } = await commentsService.getComments();

  if (errorMessage) {
    return res.status(500).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  res.status(200).json({
    message: "Comments retrieved successfully",
    error: null,
    data: allComments,
  });
});

Router.post("/comment", async (req: Request, res: Response) => {
  const { productId, text, user, parentCommentId } = req.body;

  const {
    data: newComment,
    errorMessage,
    errorRaw,
  } = await commentsService.addComment(productId, text, user, parentCommentId);

  if (errorMessage) {
    return res.status(500).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  res.status(201).json({
    message: "Comment added successfully",
    error: null,
    data: newComment,
  });
});

Router.get("/:productId", async (req: Request, res: Response) => {
  const { productId } = req.params;

  const {
    data: comments,
    errorMessage,
    errorRaw,
  } = await commentsService.getCommentsByProductId(productId);

  if (errorMessage) {
    return res.status(500).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  if (!comments || comments.length === 0) {
    return res.status(404).json({
      message: "No comments found for this product",
      error: null,
      data: null,
    });
  }

  res.status(200).json({
    message: "Comments retrieved successfully",
    error: null,
    data: comments,
  });
});

Router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;

  const {
    data: updatedComment,
    errorMessage,
    errorRaw,
  } = await commentsService.updateComment(id, text);

  if (errorMessage) {
    return res.status(500).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  res.status(200).json({
    message: "Comment updated successfully",
    error: null,
    data: updatedComment,
  });
});

Router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const {
    data: deletedComment,
    errorMessage,
    errorRaw,
  } = await commentsService.deleteComment(id);

  if (errorMessage) {
    return res.status(500).json({
      message: errorMessage,
      error: errorRaw,
      data: null,
    });
  }

  res.status(200).json({
    message: "Comment deleted successfully",
    error: null,
    data: deletedComment,
  });
});

export default Router;
