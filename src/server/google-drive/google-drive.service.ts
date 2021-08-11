import type { IGoogleDriveResponse, IGoogleDriveService } from "./google-drive.service.interface";
import { OAuth2Client } from "google-auth-library";
import { GoogleDriveException } from "./google-drive.exception";
import { google } from "googleapis";
import type { UserProviderModel } from "../user";

class GoogleDriveService implements IGoogleDriveService {
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

    const oauthClient = new OAuth2Client();
    oauthClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    oauthClient.forceRefreshOnFailure = true;

    const tokenInfo = await oauthClient.getTokenInfo(accessToken ?? "").catch((e) => {
      const { status, data } = e?.response;

      throw new GoogleDriveException(data || e, status);
    });

    console.debug(tokenInfo);

    const drive = google.drive({
      version: "v3",
      auth: oauthClient,
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
      .catch(({ code, message }) => {
        throw new GoogleDriveException(message, code);
      });
  }
}

export { GoogleDriveService };
