import mongoose from "mongoose";
import Logger from "../../../configs/logger";
import { ITransactionService } from "../../../domain/services/transaction";

export class MongooseTransaction<T> implements ITransactionService {
  async run<T>(ctx: (session: unknown) => Promise<T>): Promise<T> {
    const session = await mongoose.startSession();

    session.startTransaction();

    return await ctx(session)
      .then(async (data) => {
        await session.commitTransaction();
        await session.endSession();

        return data;
      })
      .catch(async (e) => {
        await session.abortTransaction();
        Logger.error("Database Transaction Exception", e.message);
        throw e;
      });
  }
}
