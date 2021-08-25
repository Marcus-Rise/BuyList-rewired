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
    provider: UserProviderModel,
  ): Promise<IGoogleDriveResponse>;

  updateFile(
    id: string,
    name: string,
    mimeType: string,
    content: string,
    provider: UserProviderModel,
  ): Promise<IGoogleDriveResponse>;

  fileList(provider: UserProviderModel): Promise<IGoogleDriveResponse>;

  readFile(id: string, provider: UserProviderModel): Promise<string>;
}

export type { IGoogleDriveService, IGoogleDriveResponse };
