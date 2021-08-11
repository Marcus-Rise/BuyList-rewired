import type { UserProviderModel } from "../user";

interface IGoogleDriveResponse<T = any> {
  data: T;
  status: number;
}

interface IGoogleDriveService {
  createFile(
    name: string,
    mimeType: string,
    data: string,
    userId: string,
    provider: UserProviderModel,
  ): Promise<IGoogleDriveResponse>;
}

export type { IGoogleDriveService, IGoogleDriveResponse };
