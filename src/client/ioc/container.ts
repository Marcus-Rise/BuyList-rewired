import { Container } from "inversify";
import { ProductListModule } from "../product-list/ioc";

const container = new Container();

container.load(ProductListModule);

export { container };
