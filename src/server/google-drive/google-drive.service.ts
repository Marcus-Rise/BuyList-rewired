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

    const oauthClient = new OAuth2Client();
    oauthClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    oauthClient.forceRefreshOnFailure = true;

    const tokenInfo = await oauthClient.getTokenInfo(accessToken ?? "").catch(async () => {
      // renew token
      const token = await oauthClient.getAccessToken().catch((e) => {
        const { status, data } = e?.response;
        throw new GoogleDriveException(data || e, status);
      });

      oauthClient.setCredentials({
        access_token: token.token,
        refresh_token: refreshToken,
      });
    });

    console.debug("token info", tokenInfo);

    return google.drive({
      version: "v3",
      auth: oauthClient,
    });
  }

  async createFile(
    name: string,
    mimeType: string,
    data: string,
    userId: string,
    provider: UserProviderModel,
  ): Promise<IGoogleDriveResponse> {
    const api = await this.getApi(provider);

    return api.files
      .create({
        requestBody: {
          name: "test.txt",
        },
        media: {
          mimeType: "text/plain",
          body: "Hello World",
        },
      })
      .then(({ status, data }) => ({ status, data }))
      .catch(({ code, message }) => {
        throw new GoogleDriveException(message, code);
      });
  }
}

export { GoogleDriveService };
