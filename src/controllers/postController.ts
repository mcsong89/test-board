// src/controllers/postController.ts

import { Request, Response } from 'express';
import {
  getPostsService,
  createPostService,
  updatePostService,
  deletePostService,
} from '../services/postService';
import { HttpError } from '../errors/HttpError';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await getPostsService(req.query);
    res.json(posts);
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Error in getPosts:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const post = await createPostService(req.body);
    res.json(post);
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Error in createPost:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const updatedPost = await updatePostService(req.params.id, req.body);
    res.json(updatedPost);
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Error in updatePost:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    await deletePostService(req.params.id, req.body.password);
    res.json({ message: '삭제되었습니다.' });
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Error in deletePost:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
};
