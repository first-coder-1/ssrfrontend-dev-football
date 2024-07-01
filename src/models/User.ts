export class User {
  constructor(
    public username: string,
    public token: string,
    public expiresAt: number,
  ) {}
}
