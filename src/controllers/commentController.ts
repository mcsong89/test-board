// src/controllers/commentController.ts

import { Request, Response } from 'express';
import {
  getCommentsService,
  createCommentService,
  updateCommentService,
  deleteCommentService,
} from '../services/commentService';
import { HttpError } from '../errors/HttpError';

export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await getCommentsService(req.params.postId, req.query);
    res.json(comments);
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Error in getComments:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const comment = await createCommentService(req.params.postId, req.body);
    res.json(comment);
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Error in createComment:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const updatedComment = await updateCommentService(
      req.params.commentId,
      req.body
    );
    res.json(updatedComment);
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Error in updateComment:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    await deleteCommentService(req.params.commentId, req.body);
    res.json({ message: '삭제되었습니다.' });
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error('Error in deleteComment:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  }
};
