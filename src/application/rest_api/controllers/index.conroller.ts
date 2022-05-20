import { Response } from "express";
import { controller, httpGet, response } from "inversify-express-utils";
import { Result } from "../../../domain/utilities/result";
import { BaseController } from "../base/base.controller";

@controller("/app")
export class AppController extends BaseController {
  @httpGet("/")
  private ping(@response() res: Response) {
    this.createResponse(
      res,
      Result.ok({
        author: "Mukhtar Zargar",
        service: "User Service",
        version: "0.0.1",
        ping: true
      })
    );
  }
}
