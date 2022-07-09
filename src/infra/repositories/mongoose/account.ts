import { ClientSession } from "mongoose";
import { Account } from "../../../domain/entities/account";
import { NotFoundException } from "../../../domain/errors/not-found";
import { IAccountRepository } from "../../../domain/repositories/account";
import AccountModel from "./models/account";

export class MongooseAccountRepository implements IAccountRepository {
  async create(account: Account, session?: ClientSession): Promise<Account> {
    const result = await AccountModel.create([account.toJson()], { session });

    return this.toEntity(result[0].toObject());
  }
  async increments(
    data: { to: string; amount: number },
    session?: ClientSession
  ): Promise<Account> {
    const result = await AccountModel.findOneAndUpdate(
      { email: data.to },
      { $inc: { balance: data.amount } },
      { session, new: true }
    ).exec();

    if (!result) throw new NotFoundException(data.to);

    return this.toEntity(result.toJSON());
  }

  async decrements(
    data: { from: string; amount: number },
    session?: ClientSession
  ): Promise<Account> {
    const result = await AccountModel.findOneAndUpdate(
      { email: data.from },
      { $inc: { balance: -data.amount } },
      { session, new: true }
    ).exec();

    if (!result) throw new NotFoundException(data.from);

    return this.toEntity(result.toJSON());
  }

  toEntity(data: { name: string; email: string; balance: number }) {
    const account = new Account({ email: data.email, name: data.name });

    account.balance = data.balance;

    return account;
  }
}
