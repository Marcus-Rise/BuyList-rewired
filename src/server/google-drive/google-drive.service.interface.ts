import type { TokenInfo } from "google-auth-library";

interface IGoogleDriveResponse<T = any> {
  data: T;
  status: number;
}

interface IGoogleDriveService {
  checkToken(accessToken: string): Promise<TokenInfo>;

  createFile(
    name: string,
    mimeType: string,
    data: string,
    userId: string,
    accessToken: string,
  ): Promise<IGoogleDriveResponse>;
}

export type { IGoogleDriveService, IGoogleDriveResponse };
