import type { IProductListJsonDto } from "./product-list.repository";
import { ProductListRepository } from "./product-list.repository";
import { mock } from "jest-mock-extended";
import type { IUserService } from "../../user";
import type { IJsonStorageService } from "../../json-storage";

describe("ProductListRepository", () => {
  describe("save", () => {
    it("should update existing item", async () => {
      const lastEditedDate = new Date(2020, 12, 12);
      const service = new ProductListRepository(
        mock<IUserService>({
          user: {
            jsonStorageId: "awdwad",
          },
        }),
        mock<IJsonStorageService>({
          async read<T>(): Promise<T> {
            const dto: IProductListJsonDto = {
              items: [
                {
                  id: "1",
                  items: [],
                  title: "111",
                  lastEditedDate,
                },
                {
                  id: "2",
                  items: [],
                  title: "222",
                  lastEditedDate,
                },
                {
                  id: "3",
                  items: [],
                  title: "333",
                  lastEditedDate,
                },
              ],
            };

            return dto as unknown as T;
          },
        }),
      );

      const items = await service.save({
        id: "2",
        items: [],
        title: "444",
        lastEditedDate,
      });

      expect(items).toEqual([
        {
          id: "1",
          items: [],
          title: "111",
          lastEditedDate,
        },
        {
          id: "2",
          items: [],
          title: "444",
          lastEditedDate,
        },
        {
          id: "3",
          items: [],
          title: "333",
          lastEditedDate,
        },
      ]);
    });
  });
});
