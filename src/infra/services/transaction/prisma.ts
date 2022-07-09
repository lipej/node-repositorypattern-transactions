import { PrismaClient } from "@prisma/client";
import { ITransactionService } from "../../../domain/services/transaction";

export class PrismaTransaction<T> implements ITransactionService<T> {
  constructor(private readonly prisma: PrismaClient) {}
  async run(ctx: (session: unknown) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(async (prisma) => {
      return await ctx(prisma).catch((e) => {
        console.error('Got Exception in Database Transaction: ' + e.message)
        throw e;
      });
    });
  }
}
