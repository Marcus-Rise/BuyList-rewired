import type { IGoogleDriveResponse, IGoogleDriveService } from "./google-drive.service.interface";
import type { TokenInfo } from "google-auth-library";
import { OAuth2Client } from "google-auth-library";
import { GoogleDriveException } from "./google-drive.exception";
import { google } from "googleapis";
import type { UserProviderModel } from "../user";

class GoogleDriveService implements IGoogleDriveService {
  private readonly _oauthClient = new OAuth2Client();

  async checkToken(accessToken: string): Promise<TokenInfo> {
    return this._oauthClient.getTokenInfo(accessToken ?? "").catch((e) => {
      const { status, data } = e?.response;

      throw new GoogleDriveException(data || e, status);
    });
  }

  async createFile(
    name: string,
    mimeType: string,
    data: string,
    userId: string,
    { accessToken, refreshToken }: UserProviderModel,
  ): Promise<IGoogleDriveResponse> {
    if (!refreshToken) {
      throw new GoogleDriveException("no provider refresh token", 400);
    }

    await this.checkToken(accessToken).catch(({ code, message }) => {
      throw new GoogleDriveException(message, code);
    });

    /*this._oauthClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });*/

    const drive = google.drive({
      version: "v3",
      // auth: this._oauthClient,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return drive.files
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
      .catch((e) => {
        throw new GoogleDriveException(e);
      });
  }
}

export { GoogleDriveService };
