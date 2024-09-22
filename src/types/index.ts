// src/types/index.ts
export interface PostInput {
  title: string;
  content: string; // HTML 문자열
  authorName: string;
  password: string;
}

export interface PostQuery {
  page?: number;
  size?: number;
  search?: string;
  author?: string;
}

export interface CommentInput {
  id: number;
  content: string; // HTML 문자열
  authorName: string;
  password: string | null;
  createdAt: Date;
  postId: number;
  parentId: number | null;
}

export interface CommentWithReplies extends CommentInput {
  replies: CommentWithReplies[];
}

export interface CommentQuery {
  page?: number;
  size?: number;
}
