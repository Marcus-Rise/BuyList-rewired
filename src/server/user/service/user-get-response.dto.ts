interface IUserProviderGetResponseDto {
  provider: string;
  user_id: string;
  connection: string;
  isSocial: boolean;
  access_token: string;
  expires_in: number;
}

interface IUserGetResponseDto {
  created_at: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  identities: Array<IUserProviderGetResponseDto>;
  locale: string;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  last_ip: string;
  last_login: string;
  logins_count: number;
}

export type { IUserGetResponseDto, IUserProviderGetResponseDto };
