import "reflect-metadata";
import { ProductListService } from "./product-list.service";
import { mock } from "jest-mock-extended";
import type { IProductListRepository } from "../repository";
import type { IProductList } from "../../../common";

describe("ProductListService", () => {
  describe("merge", () => {
    it("should merge ", async () => {
      const save = jest.fn();
      const service = new ProductListService(
        mock<IProductListRepository>({
          async find(): Promise<IProductList> {
            return {
              id: "aaa",
              title: "wadwad",
              items: [],
              lastEditedDate: new Date(),
            };
          },
          save,
        }),
      );

      const item = await service.merge("aaa", {
        id: "aaa",
        title: "wadwad",
        items: [],
        lastEditedDate: new Date(),
      });

      expect(save).not.toHaveBeenCalled();
      expect(item.id).toEqual("aaa");
    });
  });
});
