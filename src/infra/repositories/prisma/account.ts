import { Prisma, Account as PrismaAccount } from "@prisma/client";
import { Account } from "../../../domain/entities/account";
import { IAccountRepository } from "../../../domain/repositories/account";

export class PrismaAccountRepository
  implements IAccountRepository
{
  async create(
    account: Account,
    session: Prisma.TransactionClient
  ): Promise<Account> {
    const result = await session.account.create({
      data: { ...account.toJson() },
    });

    return this.toEntity(result);
  }
  async increments(
    data: { to: string; amount: number },
    session: Prisma.TransactionClient
  ): Promise<Account> {
    const result = await session.account.update({
      data: {
        balance: {
          increment: data.amount,
        },
      },
      where: {
        email: data.to,
      },
    });

    return this.toEntity(result);
  }
  async decrements(
    data: { from: string; amount: number },
    session: Prisma.TransactionClient
  ): Promise<Account> {
    const result = await session.account.update({
      data: {
        balance: {
          decrement: data.amount,
        },
      },
      where: {
        email: data.from,
      },
    });

    return this.toEntity(result);
  }

  toEntity(data: PrismaAccount) {
    const account = new Account({ email: data.email, name: data.name });

    account.balance = data.balance;

    return account;
  }
}
