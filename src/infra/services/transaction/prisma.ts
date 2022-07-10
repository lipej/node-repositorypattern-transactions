import { PrismaClient } from '@prisma/client'
import Logger from '../../../configs/logger'
import { ITransactionService } from '../../../domain/services/transaction'

export class PrismaTransaction implements ITransactionService {
	private readonly prisma: PrismaClient

	constructor(prisma: PrismaClient) {
		this.prisma = prisma
	}

	async run<T>(ctx: (session: unknown) => Promise<T>): Promise<T> {
		const result = await this.prisma.$transaction(
			async (prisma) => {
				const ctxResult = await ctx(prisma).catch((e) => {
					Logger.error('Database Transaction Exception', e.message)
					throw e
				})
				return ctxResult
			},
		)
		return result
	}
}
