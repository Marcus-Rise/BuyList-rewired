import "reflect-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import { inject, injectable } from "inversify";
import type { IProductListService } from "../../../src/server/product-list";
import { PRODUCT_LIST_SERVICE } from "../../../src/server/product-list";
import type { IController } from "../../../src/server/utils/handler";
import { nextHandlerFactory } from "../../../src/server/utils/handler";
import { withBaseInterceptor } from "../../../src/server/utils/interceptor";

@injectable()
class Controller implements IController {
  constructor(@inject(PRODUCT_LIST_SERVICE) private readonly _productList: IProductListService) {}

  async handle(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
      case "GET": {
        await this.get(res);
        break;
      }
      case "POST": {
        await this.post(req, res);
        break;
      }
      default: {
        res.status(400).json("Method not allowed");
        break;
      }
    }
  }

  async post(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const dto = req.body;
    await this._productList.save(dto);

    res.status(200).json("created");
  }

  async get(res: NextApiResponse): Promise<void> {
    const items = await this._productList.getAll();

    res.status(200).json(items);
  }
}

const handler = nextHandlerFactory(Controller);

export default withBaseInterceptor(handler);
