import type { IGoogleDriveResponse, IGoogleDriveService } from "./google-drive.service.interface";
import { OAuth2Client } from "google-auth-library";
import { GoogleDriveException } from "./google-drive.exception";
import type { drive_v3 } from "googleapis";
import { google } from "googleapis";
import type { UserProviderModel } from "../user";

class GoogleDriveService implements IGoogleDriveService {
  async getApi({ accessToken, refreshToken }: UserProviderModel): Promise<drive_v3.Drive> {
    if (!refreshToken) {
      throw new GoogleDriveException("no provider refresh token", 400);
    }

    const auth = new OAuth2Client();
    auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    auth.forceRefreshOnFailure = true;

    const tokenInfo = await auth.getTokenInfo(accessToken).catch((e) => {
      const { status, data } = e?.response;
      throw new GoogleDriveException(data || e, status);
    });

    console.debug("token info", tokenInfo);

    return google.drive({
      version: "v3",
      auth,
    });
  }

  async createFile(
    name: string,
    mimeType: string,
    content: string,
    provider: UserProviderModel,
  ): Promise<IGoogleDriveResponse> {
    const api = await this.getApi(provider);

    const { status, data } = await api.files
      .create({
        requestBody: {
          name,
        },
        media: {
          mimeType,
          body: content,
        },
      })
      .catch(({ code, message }) => {
        throw new GoogleDriveException(message, code);
      });

    return { status, data };
  }

  async updateFile(
    id: string,
    name: string,
    mimeType: string,
    content: string,
    provider: UserProviderModel,
  ): Promise<IGoogleDriveResponse> {
    const api = await this.getApi(provider);

    const { status, data } = await api.files
      .update({
        fileId: id,
        requestBody: {
          name,
        },
        media: {
          mimeType,
          body: content,
        },
      })
      .catch(({ code, message }) => {
        throw new GoogleDriveException(message, code);
      });

    return { status, data };
  }

  async fileList(provider: UserProviderModel): Promise<IGoogleDriveResponse> {
    const api = await this.getApi(provider);

    const { status, data } = await api.files.list().catch(({ code, message }) => {
      throw new GoogleDriveException(message, code);
    });

    return { status, data };
  }
}

export { GoogleDriveService };
