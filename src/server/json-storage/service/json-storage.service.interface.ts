interface IJsonStorageService {
  create<T = Record<string, unknown>>(initData: T): Promise<string>;

  read<T = Record<string, unknown>>(id: string): Promise<T>;

  update<T = Record<string, unknown>>(id: string, data: T): Promise<void>;
}

export type { IJsonStorageService };
