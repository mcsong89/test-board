// src/swagger.ts

import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Docs',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string' },
            authorName: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: [
            'id',
            'title',
            'content',
            'authorName',
            'createdAt',
            'updatedAt',
          ],
        },
        PostInput: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            authorName: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['title', 'content', 'authorName', 'password'],
        },
        PostUpdateInput: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['title', 'content', 'password'],
        },
        Comment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            content: {
              type: 'string',
            },
            authorName: {
              type: 'string',
            },
            password: {
              type: 'string',
              nullable: true,
            },
            postId: {
              type: 'integer',
            },
            parentId: {
              type: 'integer',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            replies: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CommentWithReplies',
              },
              nullable: true,
            },
          },
        },
        CommentInput: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: '댓글 내용 (HTML 문자열)',
            },
            authorName: {
              type: 'string',
              description: '작성자 이름',
            },
            password: {
              type: 'string',
              description: '비밀번호',
              nullable: true,
            },
            parentId: {
              type: 'integer',
              description: '부모 댓글 ID (대댓글인 경우)',
              nullable: true,
            },
          },
          required: ['content', 'authorName'],
        },
        CommentUpdateInput: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['content', 'password'],
        },
        CommentWithReplies: {
          allOf: [
            {
              $ref: '#/components/schemas/Comment',
            },
            {
              type: 'object',
              properties: {
                replies: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/CommentWithReplies',
                  },
                },
              },
            },
          ],
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // API 주석이 포함된 파일 경로
};

const specs = swaggerJSDoc(options);

export default specs;
