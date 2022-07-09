import { Account } from "../entities/account";
import { IAccountRepository } from "../repositories/account";
import { ITransactionService } from "../services/transaction";

type OperationResult = { code: number; data: Record<string, Account> };

type Params = {
  transaction: ITransactionService<unknown>;
  repository: IAccountRepository;
};

export class TransferUseCase {
  private readonly transaction: ITransactionService<OperationResult>;
  private readonly repository: IAccountRepository;

  constructor({ transaction, repository }: Params) {
    this.transaction = transaction as ITransactionService<OperationResult>;
    this.repository = repository;
  }

  async execute(data: { from: string; to: string; amount: number }) {
    const result = await this.transaction.run(async (session: unknown) => {
      const from = await this.repository.decrements(data, session);
      const to = await this.repository.increments(data, session);

      return {
        code: 2,
        data: { from, to },
      };
    });

    return result;
  }
}
