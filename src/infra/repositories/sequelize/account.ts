import type { Transaction } from 'sequelize'
import { Account } from '../../../domain/entities/account'
import { NotFoundException } from '../../../domain/errors/not-found'
import { IAccountRepository } from '../../../domain/repositories/account'
import { AccountEntityFactory } from '../../../main/factories/account-entity'
import { AccountModel } from './models/account'

export class SequelizeAccountRepository implements IAccountRepository {
	async create(account: Account, session: unknown): Promise<Account> {
		const result = await AccountModel.create(account.toJson(), {
			transaction: session as Transaction,
		})

		return AccountEntityFactory.create(result.toJSON())
	}

	async increments(
		data: { to: string; amount: number },
		session: unknown,
	): Promise<Account> {
		const account = await AccountModel.findOne({ where: { email: data.to } })

		if (!account) throw new NotFoundException(data.to)

		await account.increment('balance', {
			by: data.amount,
			transaction: session as Transaction,
		})

		await account.reload()

		return AccountEntityFactory.create(account.toJSON())
	}

	async decrements(
		data: { from: string; amount: number },
		session: unknown,
	): Promise<Account> {
		const account = await AccountModel.findOne({ where: { email: data.from } })

		if (!account) throw new NotFoundException(data.from)

		await account.increment('balance', {
			by: -data.amount,
			transaction: session as Transaction,
		})

		await account.reload()

		return AccountEntityFactory.create(account.toJSON())
	}
}
