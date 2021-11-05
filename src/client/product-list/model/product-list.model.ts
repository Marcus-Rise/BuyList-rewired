class ProductListModel {
  public title: string;
  public id: string;
  public lastEdited: Date;

  constructor(options?: Partial<{ title: string; id: string; lastEdited: Date }>) {
    this.title = options?.title ?? "";
    this.id = options?.id ?? "";
    this.lastEdited = options?.lastEdited ?? new Date();
  }
}

export { ProductListModel };
