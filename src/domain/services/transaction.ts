export interface ITransactionService {
  run: (ctx: (session: unknown) => Promise<void>) => Promise<void>;
}
