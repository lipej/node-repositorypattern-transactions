import Logger from '../../../configs/logger'
import { ITransactionService } from '../../../domain/services/transaction'
import { sequelize } from '../../repositories/sequelize/models/account'

export class SequelizeTransaction implements ITransactionService {
	async run<T>(ctx: (session: unknown) => Promise<T>): Promise<T> {
		const t = await sequelize.transaction()

		const result = await ctx(t)
			.then(async (data) => {
				await t.commit()
				return data
			})
			.catch(async (e) => {
				await t.rollback()
				Logger.error('Database Transaction Exception', e.message)
				throw e
			})

		return result
	}
}
