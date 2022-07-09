export class NotFoundException extends Error {
  constructor(email: string) {
    super(`Account not found: ${email}`);
  }
}
