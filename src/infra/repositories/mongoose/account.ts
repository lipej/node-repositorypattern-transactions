import { ClientSession } from 'mongoose'
import { Account } from '../../../domain/entities/account'
import { NotFoundException } from '../../../domain/errors/not-found'
import { IAccountRepository } from '../../../domain/repositories/account'
import { AccountEntityFactory } from '../../../main/factories/account-entity'
import AccountModel from './models/account'

export class MongooseAccountRepository implements IAccountRepository {
	async create(account: Account, session: unknown): Promise<Account> {
		const result = await AccountModel.create([account.toJson()], {
			session: session as ClientSession,
		})

		return AccountEntityFactory.create(result[0].toObject())
	}

	async increments(
		data: { to: string; amount: number },
		session: unknown,
	): Promise<Account> {
		const result = await AccountModel.findOneAndUpdate(
			{ email: data.to },
			{ $inc: { balance: data.amount } },
			{
				session: session as ClientSession,
				new: true,
			},
		).exec()

		if (!result) throw new NotFoundException(data.to)

		return AccountEntityFactory.create(result.toJSON())
	}

	async decrements(
		data: { from: string; amount: number },
		session: unknown,
	): Promise<Account> {
		const result = await AccountModel.findOneAndUpdate(
			{ email: data.from },
			{ $inc: { balance: -data.amount } },
			{ session: session as ClientSession, new: true },
		).exec()

		if (!result) throw new NotFoundException(data.from)

		return AccountEntityFactory.create(result.toJSON())
	}
}
