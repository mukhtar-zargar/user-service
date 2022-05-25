import { Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  httpPut,
  requestBody,
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
}
