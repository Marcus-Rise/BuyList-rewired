interface IRepository<Model, Query extends Record<string, unknown>, Returns = void> {
  find(query?: Partial<Query>): Promise<Model | null>;

  list(query?: Partial<Query>): Promise<Model[]>;

  save(domain: Model): Promise<Returns>;

  remove(domain: Model): Promise<void>;
}

export type { IRepository };
