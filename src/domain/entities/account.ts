import { NegativeBalanceException } from "../errors/negative-balance";

type Params = { name: string; email: string };

export class Account {
  private readonly name: string;
  private readonly email: string;
  private _balance: number = 0;

  constructor({ name, email }: Params) {
    this.email = email;
    this.name = name;
  }

  public toJson() {
    return {
      name: this.name,
      email: this.email,
      balance: this.balance,
    };
  }

  get balance() {
    return this._balance;
  }

  set balance(balance: number) {
    if (this._balance + balance < 0) throw new NegativeBalanceException(this.email)
    this._balance =+ balance;
  }
}
