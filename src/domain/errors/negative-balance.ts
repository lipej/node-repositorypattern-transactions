export class NegativeBalanceException extends Error {
	constructor(email: string) {
		super(`Account cannot have negative balance, error in account ${email}`)
	}
}
