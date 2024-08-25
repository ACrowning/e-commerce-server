import express, { Request, Response } from "express";
import { commentsService } from "../services/comments";

const Router = express.Router();

Router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: allComments, errorMessage } =
      await commentsService.getComments();
    if (errorMessage) {
      res
        .status(500)
        .json({ message: "Failed to retrieve comments", error: errorMessage });
    } else {
      res.status(200).json({ data: allComments });
    }
  } catch (error) {
    res.status(500).json({ message: "Unknown error occurred" });
  }
});

Router.post("/comment", async (req: Request, res: Response): Promise<void> => {
  const { productId, text, user, parentCommentId } = req.body;

  try {
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
    } else if (newComment) {
      res.status(201).json({ data: newComment });
    }
  } catch (error) {
    res.status(500).json({ message: "Unknown error occurred" });
  }
});

Router.get("/:productId", async (req: Request, res: Response) => {
  try {
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
    } else {
      res.status(200).json({ data: comments });
    }
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});

Router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const { data: updatedComment, errorMessage } =
      await commentsService.updateComment(id, text);

    if (errorMessage) {
      res
        .status(500)
        .json({ message: "Unable to update comment", error: errorMessage });
    } else if (updatedComment) {
      res.status(200).json({ data: updatedComment });
    }
  } catch (error) {
    res.status(500).json({ message: "Unknown error occurred" });
  }
});

Router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const { data: deletedComment, errorMessage } =
      await commentsService.deleteComment(id);

    if (errorMessage) {
      res
        .status(500)
        .json({ message: "Unable to delete comment", error: errorMessage });
    } else if (deletedComment) {
      res.status(200).json({ message: "Comment deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Unknown error occurred" });
  }
});

export default Router;
