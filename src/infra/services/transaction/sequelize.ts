import Logger from "../../../configs/logger";
import { ITransactionService } from "../../../domain/services/transaction";
import { sequelize } from "../../repositories/sequelize/models/account";

export class SequelizeTransaction<T> implements ITransactionService {
  async run<T>(ctx: (session: unknown) => Promise<T>): Promise<T> {
    const t = await sequelize.transaction();

    return await ctx(t)
      .then(async (data) => {
        await t.commit();
        return data;
      })
      .catch(async (e) => {
        await t.rollback();
        Logger.error("Database Tra nsaction Exception", e.message);
        throw e;
      });
  }
}