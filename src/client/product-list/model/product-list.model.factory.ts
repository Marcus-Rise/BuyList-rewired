import type { IProductList } from "../../../common";
import { ProductListModel } from "./product-list.model";

class ProductListModelFactory {
  static fromDto(dto: IProductList): ProductListModel {
    return new ProductListModel({
      title: dto.title,
      id: dto.id,
      lastEdited: new Date(dto.lastEditedDate),
    });
  }
}

export { ProductListModelFactory };
