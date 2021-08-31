import { Container } from "inversify";
import { UserModule } from "../user";
import { JsonStorageModule } from "../json-storage";
import { ProductListModule } from "../product-list";

const container = new Container();

container.load(UserModule, JsonStorageModule, ProductListModule);

export { container };
