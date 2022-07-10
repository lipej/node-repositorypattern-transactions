import { Prisma } from '@prisma/client'
import { Account } from '../../../domain/entities/account'
import { IAccountRepository } from '../../../domain/repositories/account'
import { AccountEntityFactory } from '../../../main/factories/account-entity'

export class PrismaAccountRepository implements IAccountRepository {
	async create(
		account: Account,
		session: unknown,
	): Promise<Account> {
		const result = await (session as Prisma.TransactionClient).account.create({
			data: { ...account.toJson() },
		})

		return AccountEntityFactory.create(result)
	}

	async increments(
		data: { to: string; amount: number },
		session: unknown,
	): Promise<Account> {
		const result = await (session as Prisma.TransactionClient).account.update({
			data: {
				balance: {
					increment: data.amount,
				},
			},
			where: {
				email: data.to,
			},
		})

		return AccountEntityFactory.create(result)
	}

	async decrements(
		data: { from: string; amount: number },
		session: unknown,
	): Promise<Account> {
		const result = await (session as Prisma.TransactionClient).account.update({
			data: {
				balance: {
					decrement: data.amount,
				},
			},
			where: {
				email: data.from,
			},
		})

		return AccountEntityFactory.create(result)
	}
}
