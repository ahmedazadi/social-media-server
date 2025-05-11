import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const enums = {
  gender: {
    M: 1,
    F: 2,
  },
};

export default db;
