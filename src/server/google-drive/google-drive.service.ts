import type { IGoogleDriveResponse, IGoogleDriveService } from "./google-drive.service.interface";
import type { TokenInfo } from "google-auth-library";
import { OAuth2Client } from "google-auth-library";
import { GoogleDriveException } from "./google-drive.exception";

class GoogleDriveService implements IGoogleDriveService {
  private readonly _oauthClient = new OAuth2Client();

  async checkToken(accessToken: string): Promise<TokenInfo> {
    return this._oauthClient.getTokenInfo(accessToken ?? "").catch((e) => {
      const { status, data } = e?.response;

      throw new GoogleDriveException(status ?? 500, data || e);
    });
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

    const url = new URL("/upload/drive/v3/files", "https://www.googleapis.com");
    url.searchParams.set("uploadType", "media");
    url.searchParams.set("id", userId);
    url.searchParams.set("name", name);
    url.searchParams.set("mimeType", mimeType);

    return fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
      .then<IGoogleDriveResponse>(async (res) => {
        const data = await res.json().catch(console.error);

        return { data, status: res.status };
      })
      .catch((e) => {
        throw new GoogleDriveException(500, e);
      });
  }
}

export { GoogleDriveService };
