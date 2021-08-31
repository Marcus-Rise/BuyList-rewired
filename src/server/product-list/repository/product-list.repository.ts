import type { IProductList, IProductListJsonDto } from "../../../common";
import type {
  IProductListRepository,
  IProductListRepositoryQuery,
} from "./product-list.repository.interface";
import type { IJsonStorageService } from "../../json-storage";
import { JSON_STORAGE_SERVICE } from "../../json-storage";
import type { IUserService } from "../../user";
import { USER_SERVICE } from "../../user";
import { inject, injectable } from "inversify";

@injectable()
class ProductListRepository implements IProductListRepository {
  constructor(
    @inject(USER_SERVICE) private readonly _user: IUserService,
    @inject(JSON_STORAGE_SERVICE) private readonly _jsonStorage: IJsonStorageService,
  ) {}

  async find(query?: Partial<IProductListRepositoryQuery>): Promise<IProductList | null> {
    const { jsonStorageId } = this._user.user;

    const { items } = await this._jsonStorage.read<IProductListJsonDto>(jsonStorageId);

    return items.find((i) => i.id === query?.id) ?? null;
  }

  async list(query?: Partial<IProductListRepositoryQuery>): Promise<IProductList[]> {
    const { jsonStorageId } = this._user.user;

    const { items } = await this._jsonStorage.read<IProductListJsonDto>(jsonStorageId);

    return items.filter((i) => i.id === query?.id);
  }

  async remove(domain: IProductList): Promise<void> {
    const { jsonStorageId } = this._user.user;

    const { items } = await this._jsonStorage.read<IProductListJsonDto>(jsonStorageId);

    return this._jsonStorage.update<IProductListJsonDto>(jsonStorageId, {
      items: items.filter((i) => i.id !== domain.id),
    });
  }

  async save(domain: IProductList): Promise<IProductList[]> {
    const { jsonStorageId } = this._user.user;

    const { items } = await this._jsonStorage.read<IProductListJsonDto>(jsonStorageId);

    const alreadyExistsItemIndex = items.findIndex((i) => i.id === domain.id) ?? null;

    let itemsNew: IProductList[];

    if (alreadyExistsItemIndex > -1) {
      itemsNew = [
        ...items.slice(0, alreadyExistsItemIndex),
        domain,
        ...items.slice(alreadyExistsItemIndex + 1),
      ];
    } else {
      itemsNew = [domain, ...items];
    }

    await this._jsonStorage.update<IProductListJsonDto>(jsonStorageId, {
      items: itemsNew,
    });

    return itemsNew;
  }
}

export { ProductListRepository };
export type { IProductListJsonDto };
