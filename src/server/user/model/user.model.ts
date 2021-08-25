import type { UserProviderModel } from "./user-provider.model";

class UserModel {
  constructor(
    public id = "",
    public email = "",
    public firstName = "",
    public lastName = "",
    public avatar = "",
    public providers: Array<UserProviderModel> = [],
    public jsonStorageUrl: string = "",
  ) {}

  get googleProvider(): UserProviderModel | null {
    return this.providers.find(({ name }) => name === "google-oauth2") ?? null;
  }
}

export { UserModel };
