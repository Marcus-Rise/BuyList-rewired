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
  title: string;
  items: IProduct[];
  id: string;
  lastEditedDate: Date;
}

export { ProductPriorityEnum };
export type { IProduct, IProductList };
