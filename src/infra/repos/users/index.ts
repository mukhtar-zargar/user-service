import { inject, injectable } from "inversify";
import { ObjectID } from "typeorm";

import { User as UserModel } from "../../typeorm/models/user.model";
import { User } from "../../../domain/users/user";
import { IUserRepository } from "../../../domain/users/user.repo";
import {
  IUserSignInProps,
  IUserWithTokenProps
} from "../../../domain/users/user.props";
import { hashIt } from "../../encryption";
import { Logger, ILogger } from "../../logging/pino";
import { TYPES } from "../../../application/constants/types";
import { CustomError } from "../../errors/base.error";

@injectable()
export class UserRepository implements IUserRepository {
  protected logger: ILogger;

  constructor(@inject(TYPES.Logger) logger: Logger) {
    this.logger = logger.get();
  }

  findAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

  async signUp(user: User): Promise<User> {
    try {
      const check = await UserModel.findOneBy({ email: user.email });

      if (check) {
        throw new CustomError({
          message: "User already exists",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      user.password = hashIt(user.password);
      let userToSave = UserModel.create(user);
      const res = await userToSave.save();
      return User.create({ ...res, id: res.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> Repository SignUp - ${err}`);

      throw err;
    }
  }

  signIn(signInInfo: IUserSignInProps): Promise<IUserWithTokenProps> {
    throw new Error("Method not implemented.");
  }

  async update(user: User): Promise<User> {
    const check = await UserModel.findOneBy({ id: new ObjectID(user.id) });
    if (!check) {
      throw new Error("Does Not Exist");
    }
    try {
      if (user.password) {
        user.password = hashIt(user.password);
      }
      const res = await UserModel.save(user);
      return User.create({ ...res, id: res.id.toString() });
    } catch (err) {
      throw new Error("DB Error");
    }
  }

  async getById(id: string): Promise<User> {
    const user = await UserModel.findOneBy({ id: new ObjectID(id) });
    return User.create({ ...user, id: user.id.toString() });
  }
}
