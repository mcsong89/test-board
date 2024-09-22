// src/__mocks__/prisma.ts
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

const prisma = mockDeep<PrismaClient>();

export default prisma;
export type MockPrismaClient = DeepMockProxy<PrismaClient>;
