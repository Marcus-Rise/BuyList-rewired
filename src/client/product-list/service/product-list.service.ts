import type { IProductListService } from "./product-list.service.interface";
import type { IProductListRepository } from "../repository";
import { PRODUCT_LIST_API_REPOSITORY } from "../repository";
import { inject, injectable } from "inversify";
import type { ProductListModel } from "../model";
import { makeAutoObservable } from "mobx";

@injectable()
class ProductListService implements IProductListService {
  constructor(
    @inject(PRODUCT_LIST_API_REPOSITORY) private readonly _repoApi: IProductListRepository,
  ) {
    makeAutoObservable(this);
  }

  private _items: Array<ProductListModel> = [];

  get items(): ReadonlyArray<ProductListModel> {
    return this._items;
  }

  async load(): Promise<void> {
    this._items = await this._repoApi.list();
  }
}

export { ProductListService };
