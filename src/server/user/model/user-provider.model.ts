class UserProviderModel {
  constructor(
    public name = "",
    public accessToken = "",
    public refreshToken = "",
    public tokenExpired = 0,
  ) {}

  get isTokenExpired(): boolean {
    return Date.now() >= this.tokenExpired * 1000;
  }
}

export { UserProviderModel };
