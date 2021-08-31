import type { IProductList, IRepository } from "../../../common";

type IProductListRepositoryQuery = {
  id: string;
};

interface IProductListRepository
  extends IRepository<IProductList, IProductListRepositoryQuery, IProductList[]> {}

export type { IProductListRepository, IProductListRepositoryQuery };
