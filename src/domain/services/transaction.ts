export interface ITransactionService {
  run: <T>(ctx: (session: unknown) => Promise<T>) => Promise<T>;
}
