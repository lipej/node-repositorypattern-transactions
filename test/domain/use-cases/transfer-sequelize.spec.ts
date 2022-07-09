import chai, { expect } from "chai";
import chaiAsPromised = require("chai-as-promised");
import { Account } from "../../../src/domain/entities/account";
import { IAccountRepository } from "../../../src/domain/repositories/account";
import { TransferUseCase } from "../../../src/domain/use-cases/transfer";
import { SequelizeTransaction } from "../../../src/infra/services/transaction/sequelize";
import { SequelizeAccountRepository } from "../../../src/infra/repositories/sequelize/account";
import {
  sequelize,
  AccountModel,
} from "../../../src/infra/repositories/sequelize/models/account";

chai.use(chaiAsPromised);

const setup = () => {
  const transaction = new SequelizeTransaction();
  const repository: IAccountRepository = new SequelizeAccountRepository();

  const useCase = new TransferUseCase({
    transaction,
    repository,
  });

  return {
    transaction,
    repository,
    useCase,
  };
};

describe(TransferUseCase.name + " w/ Sequelize", () => {
  const { repository, useCase } = setup();

  before(async () => await sequelize.sync({ force: true }));

  beforeEach(async () => {
    const from = new Account({ email: "from@bank.local", name: "John" });
    const to = new Account({ email: "to@bank.local", name: "Keny" });

    from.balance = 200;

    await repository.create(from);
    await repository.create(to);
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

  it('should got an error when "to" account was not found and should not debit "from"', async () => {
    const promise = useCase.execute({
      from: "from@bank.local",
      to: "toto@bank.local",
      amount: 50,
    });

    await expect(promise).to.be.rejected;

    const from = await AccountModel.findOne({
      where: { email: "from@bank.local" },
    });

    expect(from?.toJSON().balance).to.deep.equal(200);
  });

  it('should got an error when "from" account was not found and should not credit "to"', async () => {
    const promise = useCase.execute({
      from: "fromfrom@bank.local",
      to: "to@bank.local",
      amount: 50,
    });

    await expect(promise).to.be.rejected;

    const to = await AccountModel.findOne({
      where: { email: "to@bank.local" },
    });

    expect(to?.toJSON().balance).to.deep.equal(0);
  });

  afterEach(async () => await AccountModel.destroy({ where: {} }));
});
