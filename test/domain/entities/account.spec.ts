import { expect } from "chai";
import { Account } from "../../../src/domain/entities/account";
import { NegativeBalanceException } from "../../../src/domain/errors/negative-balance";

describe(Account.name, () => {
  it("should create a new account", () => {
    const account = new Account({
      email: "email@example.com",
      name: "John Smith",
    });

    expect(account.toJson()).to.deep.equal({
      email: "email@example.com",
      name: "John Smith",
      balance: 0,
    });
  });

  it("should add amount to balance", () => {
    const account = new Account({
      email: "email@example.com",
      name: "John Smith",
    });

    account.balance = 1;

    expect(account.balance).to.deep.equal(1);
  });

  it("should cannot have negative balance", () => {
    const account = new Account({
      email: "email@example.com",
      name: "John Smith",
    });

    account.balance = 10;

    expect(() => (account.balance = -15)).to.throw(NegativeBalanceException);
  });
});
