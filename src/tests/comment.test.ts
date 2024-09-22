// src/tests/comment.test.ts
jest.mock('../services/alertService', () => ({
  sendKeywordAlerts: jest.fn(),
}));
jest.mock('../prisma', () => require('../__mocks__/prisma'));

import request from 'supertest';
import app from '../app';
import prisma from '../prisma';
import { MockPrismaClient } from '../__mocks__/prisma';
import { CommentWithReplies } from '../types';
import * as alertService from '../services/alertService';

describe('Comment API', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = prisma as unknown as MockPrismaClient;
  });

  it('댓글 목록 조회', async () => {
    const mockComments: CommentWithReplies[] = [
      {
        id: 1,
        content: '댓글 내용',
        authorName: '댓글 작성자',
        password: null,
        createdAt: new Date(),
        postId: 1,
        parentId: null,
        replies: [
          {
            id: 2,
            content: '대댓글 내용',
            authorName: '대댓글 작성자',
            password: null,
            createdAt: new Date(),
            postId: 1,
            parentId: 1,
            replies: [], // 대댓글의 대댓글
          },
        ],
      },
    ];

    mockPrisma.comment.findMany.mockResolvedValue(mockComments);

    const response = await request(app).get('/comments/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(mockPrisma.comment.findMany).toHaveBeenCalledWith({
      where: { postId: 1, parentId: null },
      include: { replies: true },
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  });

  it('댓글 작성', async () => {
    mockPrisma.comment.create.mockResolvedValue({
      id: 1,
      content: '새 댓글',
      authorName: '댓글 작성자',
      password: null,
      createdAt: new Date(),
      postId: 1,
      parentId: null,
    });

    const response = await request(app).post('/comments/1').send({
      content: '새 댓글',
      authorName: '댓글 작성자',
      password: 'password123',
    });
    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.content).toBe('새 댓글');
    expect(mockPrisma.comment.create).toHaveBeenCalledTimes(1);
    expect(alertService.sendKeywordAlerts).toHaveBeenCalledTimes(1);
  });
});
