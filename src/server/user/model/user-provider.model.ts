class UserProviderModel {
  constructor(
    public name = "",
    public accessToken = "",
    public refreshToken = "",
    public tokenExpired = new Date(),
  ) {}

  get isTokenExpired(): boolean {
    return Date.now() >= this.tokenExpired.getTime();
  }
}

export { UserProviderModel };
