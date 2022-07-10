import { Account } from '../../domain/entities/account'

export class AccountEntityFactory {
	static create(data: { email: string; name: string; balance: number }) {
		const account = new Account({ email: data.email, name: data.name })
		account.balance = data.balance

		return account
	}
}
