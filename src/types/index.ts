// src/types/index.ts

export interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface Comment {
  id: number;
  content: string; // HTML 문자열
  authorName: string;
  password: string | null;
  postId: number;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  replies?: CommentWithReplies[];
}

export interface CommentInput {
  content: string; // HTML 문자열
  authorName: string;
  password?: string | null;
  parentId?: number | null; // 대댓글인 경우 부모 댓글 ID
}

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

export interface CommentQuery {
  page?: number;
  size?: number;
}
