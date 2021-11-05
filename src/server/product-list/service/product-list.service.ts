import type { IProductList } from "../../../common";
import type { IProductListService } from "./product-list.service.interface";
import type { IProductListRepository } from "../repository";
import { PRODUCT_LIST_REPOSITORY } from "../repository";
import { inject, injectable } from "inversify";

@injectable()
class ProductListService implements IProductListService {
  constructor(@inject(PRODUCT_LIST_REPOSITORY) private readonly _repo: IProductListRepository) {}

  async getAll(): Promise<IProductList[]> {
    return this._repo.list();
  }

  async save(list: IProductList): Promise<void> {
    await this._repo.save(list);
  }

  async getById(id: string): Promise<IProductList | null> {
    return this._repo.find({ id });
  }

  async deleteById(id: string): Promise<void> {
    const item = await this.getById(id);

    if (item) {
      await this._repo.remove(item);
    }
  }
}

export { ProductListService };
