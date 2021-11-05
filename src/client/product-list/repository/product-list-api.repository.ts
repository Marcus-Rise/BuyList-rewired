import type { ProductListModel } from "../model";
import { ProductListModelFactory } from "../model";
import type { IProductListRepository, ProductListQuery } from "./product-list.repository.interface";
import { MethodNotImplementedException } from "../../utils/exection";
import type { IProductList } from "../../../common";
import { injectable } from "inversify";

@injectable()
class ProductListApiRepository implements IProductListRepository {
  find(query?: Partial<ProductListQuery>): Promise<ProductListModel | null> {
    throw new MethodNotImplementedException();
  }

  async list(query?: Partial<ProductListQuery>): Promise<ProductListModel[]> {
    const items = await fetch("/api/product-list").then<IProductList[]>((res) => res.json());

    return items.map((i) => ProductListModelFactory.fromDto(i));
  }

  remove(domain: ProductListModel): Promise<void> {
    throw new MethodNotImplementedException();
  }

  save(domain: ProductListModel): Promise<void> {
    throw new MethodNotImplementedException();
  }
}

export { ProductListApiRepository };
