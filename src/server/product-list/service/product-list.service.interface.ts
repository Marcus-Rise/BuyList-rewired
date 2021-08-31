import type { IProductList } from "../../../common";

interface IProductListService {
  save(list: IProductList): Promise<void>;

  getAll(): Promise<IProductList[]>;

  getById(id: string): Promise<IProductList | null>;

  deleteById(id: string): Promise<void>;

  merge(id: string, list: IProductList): Promise<IProductList>;
}

export type { IProductListService };
