import type { IRepository } from "../../../common";
import type { ProductListModel } from "../model";

type ProductListQuery = {
  id: string;
  title: string;
};

interface IProductListRepository extends IRepository<ProductListModel, ProductListQuery> {}

export type { IProductListRepository, ProductListQuery };
