import { ContainerModule } from "inversify";
import type { IProductListRepository } from "../repository";
import { PRODUCT_LIST_API_REPOSITORY, ProductListApiRepository } from "../repository";
import type { IProductListService } from "../service";
import { PRODUCT_LIST_SERVICE, ProductListService } from "../service";

const ProductListModule = new ContainerModule((bind) => {
  bind<IProductListRepository>(PRODUCT_LIST_API_REPOSITORY)
    .to(ProductListApiRepository)
    .inSingletonScope();

  bind<IProductListService>(PRODUCT_LIST_SERVICE).to(ProductListService).inSingletonScope();
});

export { ProductListModule };
