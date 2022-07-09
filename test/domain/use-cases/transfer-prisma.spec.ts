import { Prisma, PrismaClient } from "@prisma/client";
import chai, { expect } from "chai";
import chaiAsPromised = require("chai-as-promised");
import { Account } from "../../../src/domain/entities/account";
import { IAccountRepository } from "../../../src/domain/repositories/account";
import { TransferUseCase } from "../../../src/domain/use-cases/transfer";
import { PrismaAccountRepository } from "../../../src/infra/repositories/prisma/account";
import { PrismaTransaction } from "../../../src/infra/services/transaction/prisma";

chai.use(chaiAsPromised);

const setup = () => {
  const prisma = new PrismaClient();
  const transaction = new PrismaTransaction(prisma);
  const repository: IAccountRepository = new PrismaAccountRepository();

  const useCase = new TransferUseCase({
    transaction,
    repository,
  });

  return {
    client: prisma,
    transaction,
    repository,
    useCase,
  };
};

describe(TransferUseCase.name + " w/ Prisma", () => {
  const { repository, useCase, client } = setup();

  before(async () => {
    const from = new Account({ email: "from@bank.local", name: "John" });
    const to = new Account({ email: "to@bank.local", name: "Keny" });

    from.balance = 200;

    await new PrismaTransaction(client).run(async (session: unknown) => {
      await repository.create(from, session);
      await repository.create(to, session);
    });
  });

  it("should transfer accounts balance", async () => {
    const result = await useCase.execute({
      from: "from@bank.local",
      to: "to@bank.local",
      amount: 100.5,
    });

    expect(result.code).to.deep.equal(2);
    expect(result.data.from.balance).to.deep.equal(99.5);
    expect(result.data.to.balance).to.deep.equal(100.5);
  });

  it('should got an error when "from" account has not balance to transfer', async () => {
    const promise = useCase.execute({
      from: "from@bank.local",
      to: "to@bank.local",
      amount: 500,
    });

    await expect(promise).to.be.rejected;
  });

  after(async () => {
    await client.account.deleteMany();
  });
});
