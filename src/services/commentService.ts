// src/services/commentService.ts

import prisma from '../prisma';
import { Comment, CommentQuery } from '../types';
import { sendKeywordAlerts } from './alertService';
import sanitizeHtml from 'sanitize-html';
import { HttpError } from '../errors/HttpError';

export const getCommentsService = async (
  postId: string,
  query: CommentQuery
) => {
  const { page = 1, size = 10 } = query;
  const skip = (Number(page) - 1) * Number(size);

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId), parentId: null },
      include: { replies: true },
      skip,
      take: Number(size),
      orderBy: { createdAt: 'desc' },
    });

    return comments;
  } catch (error) {
    console.error('Error in getCommentsService:', error);
    throw new HttpError(500, '댓글을 가져오는 중 오류가 발생했습니다.');
  }
};

export const createCommentService = async (postId: string, data: Comment) => {
  const sanitizedContent = sanitizeHtml(data.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt'],
    },
  });

  try {
    const comment = await prisma.comment.create({
      data: {
        content: sanitizedContent,
        authorName: data.authorName,
        password: data.password || null,
        postId: Number(postId),
        parentId: data.parentId ? Number(data.parentId) : null,
      },
    });

    // 키워드 알림 함수 호출
    await sendKeywordAlerts(comment);

    return comment;
  } catch (error) {
    console.error('Error in createCommentService:', error);
    throw new HttpError(500, '댓글 생성 중 오류가 발생했습니다.');
  }
};

export const updateCommentService = async (
  commentId: string,
  data: Comment
) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      throw new HttpError(404, '댓글을 찾을 수 없습니다.');
    }

    if (comment.password !== data.password) {
      throw new HttpError(403, '비밀번호가 일치하지 않습니다.');
    }

    const sanitizedContent = sanitizeHtml(data.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt'],
      },
    });

    const updatedComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: {
        content: sanitizedContent,
      },
    });

    return updatedComment;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    } else {
      console.error('Error in updateCommentService:', error);
      throw new HttpError(500, '댓글 수정 중 오류가 발생했습니다.');
    }
  }
};

export const deleteCommentService = async (
  commentId: string,
  data: { password?: string }
) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    if (!comment) {
      throw new HttpError(404, '댓글을 찾을 수 없습니다.');
    }

    if (comment.password !== data.password) {
      throw new HttpError(403, '비밀번호가 일치하지 않습니다.');
    }

    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    } else {
      console.error('Error in deleteCommentService:', error);
      throw new HttpError(500, '댓글 삭제 중 오류가 발생했습니다.');
    }
  }
};
