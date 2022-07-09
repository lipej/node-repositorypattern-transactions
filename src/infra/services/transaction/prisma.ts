import { PrismaClient } from "@prisma/client";
import Logger from "../../../configs/logger";
import { ITransactionService } from "../../../domain/services/transaction";

export class PrismaTransaction<T> implements ITransactionService {
  constructor(private readonly prisma: PrismaClient) {}
  async run<T>(ctx: (session: unknown) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(async (prisma) => {
      return await ctx(prisma).catch((e) => {
        Logger.error("Database Transaction Exception", e.message);
        throw e;
      });
    });
  }
}
