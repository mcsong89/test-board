// src/mocks/prismaMock.ts

import { Post, Comment } from '@prisma/client';
import { IPrismaClient } from '../types/prisma';

// Mock 데이터를 저장할 변수
const mockPosts: Post[] = [
  {
    id: 1,
    title: '첫 번째 게시글',
    content: '내용입니다.',
    authorName: '작성자',
    password: 'password123',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockComments: Comment[] = [
  {
    id: 1,
    content: '첫 번째 댓글',
    authorName: '댓글 작성자',
    password: 'password123',
    postId: 1,
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock Prisma 클라이언트 객체
const mockPrisma: Partial<IPrismaClient> = {
  post: {
    create: async (args: any): Promise<Post> => {
      const newPost: Post = {
        id: mockPosts.length + 1,
        title: args.data.title,
        content: args.data.content,
        authorName: args.data.authorName,
        password: args.data.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPosts.push(newPost);
      return newPost;
    },
    findMany: async (args: any): Promise<Post[]> => {
      let results = mockPosts;

      if (args.where) {
        if (args.where.title && args.where.title.contains) {
          results = results.filter((post) =>
            post.title.includes(args.where.title.contains)
          );
        }
        if (args.where.authorName) {
          results = results.filter(
            (post) => post.authorName === args.where.authorName
          );
        }
      }

      // Pagination
      const skip = args.skip || 0;
      const take = args.take || 10;
      results = results.slice(skip, skip + take);

      // Order by createdAt descending
      results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return results;
    },
    findUnique: async (args: any): Promise<Post | null> => {
      const post = mockPosts.find((post) => post.id === args.where.id);
      return post || null;
    },
    update: async (args: any): Promise<Post> => {
      const postIndex = mockPosts.findIndex(
        (post) => post.id === args.where.id
      );
      if (postIndex === -1) throw new Error('Post not found');
      const updatedPost = {
        ...mockPosts[postIndex],
        ...args.data,
        updatedAt: new Date(),
      };
      mockPosts[postIndex] = updatedPost;
      return updatedPost;
    },
    delete: async (args: any): Promise<Post> => {
      const postIndex = mockPosts.findIndex(
        (post) => post.id === args.where.id
      );
      if (postIndex === -1) throw new Error('Post not found');
      const deletedPost = mockPosts.splice(postIndex, 1)[0];
      return deletedPost;
    },
  },
  comment: {
    create: async (args: any): Promise<Comment> => {
      const newComment: Comment = {
        id: mockComments.length + 1,
        content: args.data.content,
        authorName: args.data.authorName,
        password: args.data.password,
        postId: args.data.postId,
        parentId: args.data.parentId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockComments.push(newComment);
      return newComment;
    },
    findMany: async (args: any): Promise<Comment[]> => {
      let results = mockComments.filter(
        (comment) => comment.postId === args.where.postId
      );

      // Pagination
      const skip = args.skip || 0;
      const take = args.take || 10;
      results = results.slice(skip, skip + take);

      // Order by createdAt descending
      results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return results;
    },
    findUnique: async (args: any): Promise<Comment | null> => {
      const comment = mockComments.find(
        (comment) => comment.id === args.where.id
      );
      return comment || null;
    },
    update: async (args: any): Promise<Comment> => {
      const commentIndex = mockComments.findIndex(
        (comment) => comment.id === args.where.id
      );
      if (commentIndex === -1) throw new Error('Comment not found');
      const updatedComment = {
        ...mockComments[commentIndex],
        ...args.data,
        updatedAt: new Date(),
      };
      mockComments[commentIndex] = updatedComment;
      return updatedComment;
    },
    delete: async (args: any): Promise<Comment> => {
      const commentIndex = mockComments.findIndex(
        (comment) => comment.id === args.where.id
      );
      if (commentIndex === -1) throw new Error('Comment not found');
      const deletedComment = mockComments.splice(commentIndex, 1)[0];
      return deletedComment;
    },
  },
};

export default mockPrisma;
