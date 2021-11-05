import type { ProductListModel } from "../model";

interface IProductListService {
  readonly items: ReadonlyArray<ProductListModel>;

  load(): Promise<void>;
}

export type { IProductListService };
