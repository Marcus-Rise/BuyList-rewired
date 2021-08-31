import type { IProductList } from "../../../common";

interface IProductListService {
  save(list: IProductList): Promise<void>;

  getAll(): Promise<IProductList[]>;

  getById(id: string): Promise<IProductList | null>;
}

export type { IProductListService };