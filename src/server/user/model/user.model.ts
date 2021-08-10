class UserProviderModel {
  constructor(public name = "", public accessToken = "", public tokenExpired = 0) {}
}

class UserModel {
  constructor(
    public id = "",
    public email = "",
    public firstName = "",
    public lastName = "",
    public avatar = "",
    public providers: Array<UserProviderModel> = [],
  ) {}

  get googleProvider(): UserProviderModel | null {
    return this.providers.find(({ name }) => name === "google-oauth2") ?? null;
  }
}

export { UserModel, UserProviderModel };
