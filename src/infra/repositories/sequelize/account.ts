import { Transaction } from "sequelize/types";
import { Account } from "../../../domain/entities/account";
import { NotFoundException } from "../../../domain/errors/not-found";
import { IAccountRepository } from "../../../domain/repositories/account";
import { AccountModel } from "./models/account";

export class SequelizeAccountRepository implements IAccountRepository {
  async create(account: Account, session?: Transaction): Promise<Account> {
    const result = await AccountModel.create(account.toJson(), {
      transaction: session,
    });

    return this.toEntity(result.toJSON());
  }

  async increments(
    data: { to: string; amount: number },
    session?: Transaction
  ): Promise<Account> {
    const account = await AccountModel.findOne({ where: { email: data.to } });

    if (!account) throw new NotFoundException(data.to);

    await account.increment("balance", {
      by: data.amount,
      transaction: session,
    });

    await account.reload();

    return this.toEntity(account.toJSON());
  }

  async decrements(
    data: { from: string; amount: number },
    session?: Transaction
  ): Promise<Account> {
    const account = await AccountModel.findOne({ where: { email: data.from } });

    if (!account) throw new NotFoundException(data.from);

    await account.increment("balance", {
      by: -data.amount,
      transaction: session,
    });

    await account.reload();

    return this.toEntity(account.toJSON());
  }

  toEntity(data: { name: string; email: string; balance: number }) {
    const account = new Account({ email: data.email, name: data.name });

    account.balance = data.balance;

    return account;
  }
}
