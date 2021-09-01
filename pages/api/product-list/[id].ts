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
        await this.get(req, res);
        break;
      }
      case "POST": {
        await this.post(req, res);
        break;
      }
      case "PUT": {
        await this.put(req, res);
        break;
      }
      case "DELETE": {
        await this.delete(req, res);
        break;
      }
      default: {
        res.status(400).json("Method not allowed");
        break;
      }
    }
  }

  async get(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const item = await this._productList.getById(String(req.query.id));

    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json("list not found");
    }
  }

  async post(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const merged = await this._productList.merge(String(req.query.id), req.body);

    res.status(200).json(merged);
  }

  async put(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const dto = req.body;
    await this._productList.save(dto);

    res.status(200).json("updated");
  }

  async delete(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    await this._productList.deleteById(String(req.query.id));

    res.status(200).json("deleted");
  }
}

const handler = nextHandlerFactory(Handler);

export default withBaseInterceptor(handler);
