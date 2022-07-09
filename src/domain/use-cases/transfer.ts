import { IAccountRepository } from "../repositories/account";
import { ITransactionService } from "../services/transaction";

type Params = {
  transaction: ITransactionService;
  repository: IAccountRepository;
};

export class TransferUseCase {
  private readonly transaction: ITransactionService;
  private readonly repository: IAccountRepository;

  constructor({ transaction, repository }: Params) {
    this.transaction = transaction as ITransactionService;
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
