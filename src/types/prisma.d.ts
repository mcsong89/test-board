// src/types/prisma.d.ts

import { PrismaClient } from '@prisma/client';

export interface IPrismaClient extends PrismaClient {
  post: {
    create: (args: any) => Promise<any>;
    findMany: (args: any) => Promise<any>;
    findUnique: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
  };
  comment: {
    create: (args: any) => Promise<any>;
    findMany: (args: any) => Promise<any>;
    findUnique: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
  };
}
