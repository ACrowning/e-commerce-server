import express from "express";
import { commentsService } from "../services/comments";

const Router = express.Router();

Router.get("/", async (req: any, res: any): Promise<void> => {
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

Router.post("/comment", async (req: any, res: any): Promise<void> => {
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

export default Router;
