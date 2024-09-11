export interface Comment {
  id: string;
  productId: string;
  text: string;
  date: Date;
  userId: string;
  parentCommentId: string | null;
}

export interface CommentRow {
  id: string;
  product_id: string;
  text: string;
  date: Date;
  user_id: string;
  parent_comment_id: string | null;
}
