interface IJsonStorageService {
  create(initData: unknown): Promise<string>;

  read(id: string): Promise<unknown>;

  update(id: string, data: unknown): Promise<void>;
}

export type { IJsonStorageService };
