import { ContainerModule } from "inversify";
import type { IProductListRepository } from "../repository";
import { PRODUCT_LIST_REPOSITORY, ProductListRepository } from "../repository";
import type { IProductListService } from "../service";
import { PRODUCT_LIST_SERVICE, ProductListService } from "../service";

const ProductListModule = new ContainerModule((bind) => {
  bind<IProductListRepository>(PRODUCT_LIST_REPOSITORY)
    .to(ProductListRepository)
    .inSingletonScope();
  bind<IProductListService>(PRODUCT_LIST_SERVICE).to(ProductListService).inSingletonScope();
});

export { ProductListModule };
