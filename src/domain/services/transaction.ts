export interface ITransactionService<T> {
  run: (ctx: (session: unknown) => Promise<T>) => Promise<T>;
}
