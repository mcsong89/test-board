// src/services/postService.ts

import prisma from '../prisma';
import { PostInput, PostQuery } from '../types';
import { sendKeywordAlerts } from './alertService';
import sanitizeHtml from 'sanitize-html';
import { HttpError } from '../errors/HttpError';

export const getPostsService = async (query: PostQuery) => {
  const { page = 1, size = 10, search, author } = query;
  const skip = (Number(page) - 1) * Number(size);
  const where: any = {};

  if (search) {
    where.title = { contains: String(search) };
  }
  if (author) {
    where.authorName = String(author);
  }

  try {
    const posts = await prisma.post.findMany({
      where,
      skip,
      take: Number(size),
      orderBy: { createdAt: 'desc' },
    });

    return posts;
  } catch (error) {
    console.error('Error in getPostsService:', error);
    throw new HttpError(500, '게시글을 가져오는 중 오류가 발생했습니다.');
  }
};

export const createPostService = async (data: PostInput) => {
  // 비밀번호 입력 필수 조건 추가
  if (!data.password) {
    throw new HttpError(400, '비밀번호는 필수 입력 사항입니다.');
  }

  const sanitizedContent = sanitizeHtml(data.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt'],
    },
  });

  try {
    const post = await prisma.post.create({
      data: {
        ...data,
        content: sanitizedContent,
      },
    });

    // 키워드 알림 함수 호출
    await sendKeywordAlerts(post);

    return post;
  } catch (error) {
    console.error('Error in createPostService:', error);
    throw new HttpError(500, '게시글 생성 중 오류가 발생했습니다.');
  }
};

export const updatePostService = async (id: string, data: PostInput) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      throw new HttpError(404, '게시글을 찾을 수 없습니다.');
    }

    if (post.password !== data.password) {
      throw new HttpError(403, '비밀번호가 일치하지 않습니다.');
    }

    const sanitizedContent = sanitizeHtml(data.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt'],
      },
    });

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { title: data.title, content: sanitizedContent },
    });

    return updatedPost;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    } else {
      console.error('Error in updatePostService:', error);
      throw new HttpError(500, '게시글 수정 중 오류가 발생했습니다.');
    }
  }
};

export const deletePostService = async (id: string, password: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      throw new HttpError(404, '게시글을 찾을 수 없습니다.');
    }

    if (post.password !== password) {
      throw new HttpError(403, '비밀번호가 일치하지 않습니다.');
    }

    await prisma.post.delete({
      where: { id: Number(id) },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    } else {
      console.error('Error in deletePostService:', error);
      throw new HttpError(500, '게시글 삭제 중 오류가 발생했습니다.');
    }
  }
};
