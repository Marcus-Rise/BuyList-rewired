import type { IGoogleDriveResponse, IGoogleDriveService } from "./google-drive.service.interface";
import type { TokenInfo } from "google-auth-library";
import { OAuth2Client } from "google-auth-library";
import { GoogleDriveException } from "./google-drive.exception";

class GoogleDriveService implements IGoogleDriveService {
  private readonly _oauthClient = new OAuth2Client();

  async checkToken(accessToken: string): Promise<TokenInfo> {
    const res = await this._oauthClient.getTokenInfo(accessToken ?? "").catch((e) => {
      const { status, data } = e?.response;

      return new GoogleDriveException(status ?? 500, data || e);
    });

    if (res instanceof GoogleDriveException) {
      throw res;
    }

    return res;
  }

  async createFile(
    name: string,
    mimeType: string,
    data: string,
    userId: string,
    accessToken: string,
  ): Promise<IGoogleDriveResponse> {
    // oAuth2Client.setCredentials({
    //   access_token: googleAccessToken,
    // });
    //
    // const drive = google.drive({ version: "v3" });
    //
    // await drive.files
    //   .create({
    //     requestBody: {
    //       name: "test.txt",
    //     },
    //     media: {
    //       mimeType: "text/plain",
    //       body: "Hello World",
    //     },
    //   })
    //   .then(({ status, data }) => res.status(status).json(data))
    //   .catch((e) => googleErrorHandle(e, res));

    const GOOGLE_DRIVE_API_URL = "https://www.googleapis.com/upload/drive/v3";
    const url = new URL("/files", GOOGLE_DRIVE_API_URL);
    url.searchParams.set("uploadType", "media");

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id: userId, name, mimeType }),
    })
      .then<IGoogleDriveResponse>(async (res) => {
        const data = await res.json().catch(console.error);

        return { data, status: res.status };
      })
      .catch((e) => new GoogleDriveException(500, e));

    if (res instanceof GoogleDriveException) {
      throw res;
    }

    return res;
  }
}

export { GoogleDriveService };
