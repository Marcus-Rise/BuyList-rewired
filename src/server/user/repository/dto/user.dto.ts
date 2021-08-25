interface IUserProviderDto {
  provider: string;
  user_id: string;
  connection: string;
  isSocial: boolean;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface IUserMetadataDto extends Record<string, unknown> {
  json_storage: string;
}

interface IUserDto {
  created_at: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  identities: Array<IUserProviderDto>;
  locale: string;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  last_ip: string;
  last_login: string;
  logins_count: number;
  user_metadata?: IUserMetadataDto;
}

class UserDto implements Partial<IUserDto> {
  constructor(
    public email?: string,
    public email_verified?: boolean,
    public family_name?: string,
    public given_name?: string,
    public identities?: Array<IUserProviderDto>,
    public last_ip?: string,
    public last_login?: string,
    public locale?: string,
    public logins_count?: number,
    public name?: string,
    public nickname?: string,
    public picture?: string,
    public updated_at?: string,
    public user_id?: string,
    public user_metadata?: IUserMetadataDto,
    public created_at?: string,
  ) {}
}

export { UserDto };
export type { IUserDto, IUserProviderDto, IUserMetadataDto };
