import { Account } from "../entities/account";

export interface IAccountRepository {
  create: (account: Account) => Promise<Account>;
  increments: (to: string, amount: number) => Promise<Account>
  decrements: (from: string, amount: number) => Promise<Account>
}