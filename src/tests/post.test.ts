// src/tests/post.test.ts
import request from 'supertest';
import app from '../app';
import prisma from '../prisma';
import { MockPrismaClient } from '../__mocks__/prisma';

jest.mock('../prisma', () => require('../__mocks__/prisma'));

describe('Post API', () => {
  let mockPrisma: MockPrismaClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = prisma as unknown as MockPrismaClient;
  });

  // 기존 테스트 코드 수정
  it('게시글 작성 - 성공', async () => {
    // 게시글 생성 결과 모킹
    mockPrisma.post.create.mockResolvedValue({
      id: 1,
      title: '새 게시글',
      content: '내용',
      authorName: '작성자',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app).post('/posts').send({
      title: '새 게시글',
      content: '내용',
      authorName: '작성자',
      password: 'password123', // 비밀번호 포함
    });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('새 게시글');
    expect(mockPrisma.post.create).toHaveBeenCalledTimes(1);
  });

  it('게시글 작성 - 비밀번호 누락', async () => {
    const response = await request(app).post('/posts').send({
      title: '비밀번호 없는 게시글',
      content: '내용',
      authorName: '작성자',
      // password: 누락
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('비밀번호는 필수 입력 사항입니다.');
    expect(mockPrisma.post.create).not.toHaveBeenCalled();
  });

  // 게시글 목록 조회 - 기본
  it('게시글 목록 조회 - 기본', async () => {
    mockPrisma.post.findMany.mockResolvedValue([
      {
        id: 1,
        title: '테스트 게시글',
        content: '내용',
        authorName: '작성자',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const response = await request(app).get('/posts');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(mockPrisma.post.findMany).toHaveBeenCalledWith({
      where: {},
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  });

  // 제목으로 게시글 검색
  it('제목으로 게시글 검색', async () => {
    mockPrisma.post.findMany.mockResolvedValue([
      {
        id: 1,
        title: '검색된 게시글',
        content: '내용',
        authorName: '작성자',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const response = await request(app).get('/posts?search=검색된');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toContain('검색된');

    expect(mockPrisma.post.findMany).toHaveBeenCalledWith({
      where: { title: { contains: '검색된' } },
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  });

  // 작성자로 게시글 검색
  it('작성자로 게시글 검색', async () => {
    mockPrisma.post.findMany.mockResolvedValue([
      {
        id: 2,
        title: '작성자의 게시글',
        content: '내용',
        authorName: '특정 작성자',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const response = await request(app).get('/posts?author=특정 작성자');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].authorName).toBe('특정 작성자');

    expect(mockPrisma.post.findMany).toHaveBeenCalledWith({
      where: { authorName: '특정 작성자' },
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  });

  // 페이지네이션 테스트
  it('페이지네이션 테스트', async () => {
    mockPrisma.post.findMany.mockResolvedValue([
      // 페이지 2에 해당하는 게시글 목록을 모킹합니다.
      {
        id: 11,
        title: '페이지 2의 게시글',
        content: '내용',
        authorName: '작성자',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const response = await request(app).get('/posts?page=2&size=10');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(mockPrisma.post.findMany).toHaveBeenCalledWith({
      where: {},
      skip: 10,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  });

  // 게시글 수정 테스트
  it('게시글 수정 - 성공', async () => {
    // 기존 게시글 데이터 모킹
    mockPrisma.post.findUnique.mockResolvedValue({
      id: 1,
      title: '기존 제목',
      content: '기존 내용',
      authorName: '작성자',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 게시글 업데이트 결과 모킹
    mockPrisma.post.update.mockResolvedValue({
      id: 1,
      title: '수정된 제목',
      content: '수정된 내용',
      authorName: '작성자',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app).put('/posts/1').send({
      title: '수정된 제목',
      content: '수정된 내용',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('수정된 제목');
    expect(mockPrisma.post.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrisma.post.update).toHaveBeenCalledTimes(1);
  });

  it('게시글 수정 - 비밀번호 불일치', async () => {
    // 기존 게시글 데이터 모킹
    mockPrisma.post.findUnique.mockResolvedValue({
      id: 1,
      title: '기존 제목',
      content: '기존 내용',
      authorName: '작성자',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app).put('/posts/1').send({
      title: '수정된 제목',
      content: '수정된 내용',
      password: 'wrong_password',
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('비밀번호가 일치하지 않습니다.');
    expect(mockPrisma.post.update).not.toHaveBeenCalled();
  });

  // 게시글 삭제 테스트
  it('게시글 삭제 - 성공', async () => {
    // 기존 게시글 데이터 모킹
    mockPrisma.post.findUnique.mockResolvedValue({
      id: 1,
      title: '삭제할 게시글',
      content: '내용',
      authorName: '작성자',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 게시글 삭제 결과 모킹
    mockPrisma.post.delete.mockResolvedValue({
      id: 1,
      title: '삭제할 게시글',
      content: '내용',
      authorName: '작성자',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app).delete('/posts/1').send({
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('삭제되었습니다.');
    expect(mockPrisma.post.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrisma.post.delete).toHaveBeenCalledTimes(1);
  });

  it('게시글 삭제 - 비밀번호 불일치', async () => {
    // 기존 게시글 데이터 모킹
    mockPrisma.post.findUnique.mockResolvedValue({
      id: 1,
      title: '삭제할 게시글',
      content: '내용',
      authorName: '작성자',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app).delete('/posts/1').send({
      password: 'wrong_password',
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('비밀번호가 일치하지 않습니다.');
    expect(mockPrisma.post.delete).not.toHaveBeenCalled();
  });
});
