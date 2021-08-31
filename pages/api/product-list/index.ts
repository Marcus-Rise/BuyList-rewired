import "reflect-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import { inject, injectable } from "inversify";
import type { IProductListService } from "../../../src/server/product-list";
import { PRODUCT_LIST_SERVICE } from "../../../src/server/product-list";
import type { IHandler } from "../../../src/server/utils/handler";
import { nextHandlerFactory } from "../../../src/server/utils/handler";
import { withBaseInterceptor } from "../../../src/server/utils/interceptor";

@injectable()
class Handler implements IHandler {
  constructor(@inject(PRODUCT_LIST_SERVICE) private readonly _productList: IProductListService) {}

  async handle(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
      case "GET": {
        const items = await this._productList.getAll();

        res.status(200).json(items);
        break;
      }
      case "POST": {
        const dto = req.body;
        await this._productList.save(dto);

        res.status(200).json({});

        break;
      }
      default: {
        res.status(400).json("Method not allowed");
        break;
      }
    }
  }
}

const handler = nextHandlerFactory(Handler);

export default withBaseInterceptor(handler);
