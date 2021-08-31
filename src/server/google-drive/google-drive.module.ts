import { ContainerModule } from "inversify";
import type { IGoogleDriveService } from "./google-drive.service.interface";
import { GOOGLE_DRIVE_SERVICE } from "./google-drive.service.provider";
import { GoogleDriveService } from "./google-drive.service";

const GoogleDriveModule = new ContainerModule((bind) => {
  bind<IGoogleDriveService>(GOOGLE_DRIVE_SERVICE).to(GoogleDriveService).inSingletonScope();
});

export { GoogleDriveModule };
