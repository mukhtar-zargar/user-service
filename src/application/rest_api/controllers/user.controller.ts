import { Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  requestBody,
  response
} from "inversify-express-utils";
import { IUserRepository } from "../../../domain/users/user.repo";
import { Result } from "../../../domain/utilities/result";
import { validationMiddleware } from "../../../infra/middleware/validator.middleware";
import { TYPES } from "../../constants/types";
import { BaseController } from "../base/base.controller";
import { UserSignUpDTO } from "./dtos/user.dto";

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
      this.createResponse(res, Result.ok(user));
    } catch (err) {
      this.logger.error(`<Error> Controller SignUp - ${err}`);
      const errMsg = err.status && err.status !== 500 ? err.message : "";
      this.createResponse(res, Result.fail(errMsg, err.errorCode));
    }
  }
}
