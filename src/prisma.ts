// src/prisma.ts

import { PrismaClient } from '@prisma/client';
import mockPrisma from './__mocks__/prismaMock';

const isTest =
  process.env.NODE_ENV === 'test' || process.env.USE_MOCK === 'true';

const prisma = isTest ? (mockPrisma as PrismaClient) : new PrismaClient();

export default prisma;
