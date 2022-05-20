import { Response } from "express";
import { inject, injectable } from "inversify";
import { BaseHttpController } from "inversify-express-utils";

import { Result } from "../../../domain/utilities/result";
import { TYPES } from "../../constants/types";

@injectable()
export abstract class BaseController extends BaseHttpController {
  // @inject(TYPES.Logger) protected _logger: Logger\
  protected createResponse<T>(
    response: Response,
    responseModel: Result<T>,
    successStatusCode?: number
  ): void {
    if (responseModel.success) {
      response.status(successStatusCode || 200);
    } else if (!responseModel.errorCode) {
      response.status(500);
    } else if (responseModel.errorCode === "INVALID_REQUEST") {
      response.status(400);
    } else if (responseModel.errorCode === "RESOURCE_ALREADY_EXIST") {
      response.status(409);
    } else if (responseModel.errorCode === "RESOURCE_DOES_NOT_EXIST") {
      response.status(404);
    }

    response.json(responseModel);
  }
}
