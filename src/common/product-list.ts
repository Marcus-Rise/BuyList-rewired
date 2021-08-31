enum ProductPriorityEnum {
  high = "Высокий",
  middle = "Средний",
  low = "Низкий",
}

interface IProduct {
  title: string;
  active: boolean;
  price: number;
  priority: ProductPriorityEnum | string;
}

interface IProductList {
  id: string;
  title: string;
  lastEditedDate: Date;
  items: IProduct[];
}

interface IProductListJsonDto {
  items: Array<IProductList>;
}

export { ProductPriorityEnum };
export type { IProduct, IProductList, IProductListJsonDto };
