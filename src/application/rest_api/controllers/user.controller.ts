import { isMongoId } from "class-validator";
import { Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  requestBody,
  requestParam,
  response
} from "inversify-express-utils";
import { IUserRepository } from "../../../domain/users/user.repo";
import { Result } from "../../../domain/utilities/result";
import { validationMiddleware } from "../../../infra/middleware/validator.middleware";
import { TYPES } from "../../constants/types";
import { BaseController } from "../base/base.controller";
import { UserSignUpDTO, UserUpdateDTO } from "./dtos/user.dto";

@controller("/users")
export class UserController extends BaseController {
  @inject(TYPES.UserRepository) userRepository: IUserRepository;

  @httpPost("/sign-up", validationMiddleware(UserSignUpDTO))
  private async signUp(
    @requestBody() body: UserSignUpDTO,
    @response() res: Response
  ) {
    try {
      const user = await this.userRepository.signUp(body);
      this.createResponse(res, Result.ok(user, "User signed up successfully"));
    } catch (err) {
      this.logger.error(`<Error> Controller SignUp - ${err}`);
      const errMsg = err.status && err.status !== 500 ? err.message : "";
      this.createResponse(res, Result.fail(errMsg, err.errorCode));
    }
  }

  @httpPut("/", validationMiddleware(UserUpdateDTO))
  private async update(
    @requestBody() body: UserUpdateDTO,
    @response() res: Response
  ) {
    try {
      const user = await this.userRepository.update(body);
      this.createResponse(res, Result.ok(user, "User updated successfully"));
    } catch (err) {
      this.logger.error(`<Error> Controller update - ${err}`);
      const errMsg = err.status && err.status !== 500 ? err.message : "";
      this.createResponse(res, Result.fail(errMsg, err.errorCode));
    }
  }

  @httpGet("/:id")
  private async get(@requestParam("id") id: string, @response() res: Response) {
    if (!id || !isMongoId(id)) {
      this.createResponse(res, Result.fail("Invalid id", "INVALID_REQUEST"));
      return;
    }
    try {
      const user = await this.userRepository.getById(id);
      this.createResponse(res, Result.ok(user, "User retrieved successfully"));
    } catch (err) {
      this.logger.error(`<Error> Controller Get - ${err}`);
      const errMsg = err.status && err.status !== 500 ? err.message : "";
      this.createResponse(res, Result.fail(errMsg, err.errorCode));
    }
  }
}
