import { Account } from "../entities/account";

export interface IAccountRepository {
  create: (account: Account, session?: unknown) => Promise<Account>;
  increments: (
    data: { to: string; amount: number },
    session?: unknown
  ) => Promise<Account>;
  decrements: (
    data: { from: string; amount: number },
    session?: unknown
  ) => Promise<Account>;
}
