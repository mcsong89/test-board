// src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger';

const app = express();

app.use(bodyParser.json());
app.use(cors());

// 라우트 설정
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

// Swagger UI 미들웨어 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

export default app;
