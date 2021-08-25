import type { IUserConfig } from "./user.config.interface";

class UserConfig implements IUserConfig {
  constructor(
    private readonly _tenant = process.env.AUTH0_ISSUER_BASE_URL,
    public readonly clientId = process.env.AUTH0_CLIENT_ID ?? "",
    public readonly clientSecret = process.env.AUTH0_CLIENT_SECRET ?? "",
  ) {}

  get apiUrl(): string {
    return new URL("/api/v2/", this._tenant).toString();
  }

  get authUrl(): string {
    return new URL("/oauth/token", this._tenant).toString();
  }
}

export { UserConfig };
