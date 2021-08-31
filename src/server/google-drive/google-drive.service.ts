import type { IGoogleDriveResponse, IGoogleDriveService } from "./google-drive.service.interface";
import { OAuth2Client } from "google-auth-library";
import { GoogleDriveException } from "./google-drive.exception";
import type { drive_v3 } from "googleapis";
import { google } from "googleapis";
import type { UserProviderModel } from "../user";
import path from "path";
import * as os from "os";
import * as fs from "fs";
import { v4 as uuid } from "uuid";
import { injectable } from "inversify";

@injectable()
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

  async readFile(id: string, provider: UserProviderModel): Promise<string> {
    const api = await this.getApi(provider);
    const file = await api.files.get({ fileId: id, alt: "media" }, { responseType: "stream" });

    interface ReadFileError {
      code: number;
      text: string;
    }

    return new Promise<string>((resolve, reject) => {
      const filePath = path.join(os.tmpdir(), uuid());
      const dest = fs.createWriteStream(filePath);

      file.data
        .on("end", () => {
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              const error: ReadFileError = {
                code: err.code ? Number(err.code) : 500,
                text: err.message,
              };
              reject(error);
            } else {
              resolve(data);
            }
          });
        })
        .on("error", (err: { message: string }) => {
          const error: ReadFileError = { code: 500, text: err.message };
          reject(error);
        })
        .pipe(dest);
    }).catch((e: ReadFileError) => {
      throw new GoogleDriveException(e.text ?? e, e.code);
    });
  }
}

export { GoogleDriveService };
