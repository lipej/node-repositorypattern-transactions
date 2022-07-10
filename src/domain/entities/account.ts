import { NegativeBalanceException } from '../errors/negative-balance'

type Params = { name: string; email: string };

export class Account {
	private readonly name: string

	private readonly email: string

	private accountBalance = 0

	constructor({ name, email }: Params) {
		this.email = email
		this.name = name
	}

	public toJson() {
		return {
			name: this.name,
			email: this.email,
			balance: this.balance,
		}
	}

	get balance() {
		return this.accountBalance
	}

	set balance(amount: number) {
		if (this.accountBalance + amount < 0) throw new NegativeBalanceException(this.email)
		this.accountBalance += amount
	}
}
