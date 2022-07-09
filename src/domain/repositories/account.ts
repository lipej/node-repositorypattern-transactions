import { Account } from "../entities/account";

export interface IAccountRepository {
  create: (account: Account, session?: any) => Promise<Account>;
  increments: (
    data: { to: string; amount: number },
    session?: any
  ) => Promise<Account>;
  decrements: (
    data: { from: string; amount: number },
    session?: any
  ) => Promise<Account>;
}
