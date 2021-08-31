import type { IProductList } from "../../../common";
import type {
  IProductListRepository,
  IProductListRepositoryQuery,
} from "./product-list.repository.interface";
import type { IJsonStorageService } from "../../json-storage";
import type { IUserService } from "../../user";

interface IProductListJsonDto {
  items: Array<IProductList>;
}

class ProductListRepository implements IProductListRepository {
  constructor(
    private readonly _user: IUserService,
    private readonly _jsonStorage: IJsonStorageService,
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

      await this._jsonStorage.update<IProductListJsonDto>(jsonStorageId, {
        items: itemsNew,
      });
    } else {
      itemsNew = [domain, ...items];

      await this._jsonStorage.update<IProductListJsonDto>(jsonStorageId, {
        items: itemsNew,
      });
    }

    return itemsNew;
  }
}

export { ProductListRepository };
export type { IProductListJsonDto };
