import { inject, injectable } from "inversify";
import { MongoRepository } from "typeorm";

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
import { IAppDataSource } from "../../typeorm/typeorm.config";
import { getObjectId } from "../../typeorm/utils";

@injectable()
export class UserRepository implements IUserRepository {
  protected logger: ILogger;
  protected userDataSourse: MongoRepository<UserModel>;

  constructor(
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.DataSource) appDataSource: IAppDataSource
  ) {
    this.logger = logger.get();
    this.userDataSourse = appDataSource
      .instance()
      .getMongoRepository(UserModel);
  }

  getAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

  async signUp(user: User): Promise<User> {
    try {
      const check = await this.userDataSourse.findOneBy({ email: user.email });

      if (check) {
        throw new CustomError({
          message: "User already exists",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      user.password = hashIt(user.password);
      let userToSave = this.userDataSourse.create(user);
      const res = await this.userDataSourse.save(userToSave);
      return User.create({ ...res, id: res.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> UserRepositorySignUp - ${err}`);

      throw err;
    }
  }

  signIn(signInInfo: IUserSignInProps): Promise<IUserWithTokenProps> {
    throw new Error("Method not implemented.");
  }

  async update(user: User): Promise<User> {
    this.logger.info(`User ${JSON.stringify(user)}`);
    let existingUser = await this.userDataSourse.findOneBy({
      _id: getObjectId(user.id)
    });
    this.logger.info(`Check ${JSON.stringify(existingUser)}`);

    try {
      if (!existingUser) {
        throw new CustomError({
          message: "Invalid id",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      if (user.password) {
        user.password = hashIt(user.password);
      }
      existingUser = this.userDataSourse.create({ ...existingUser, ...user });
      await this.userDataSourse.findOneAndUpdate(
        {
          _id: getObjectId(user.id)
        },
        { $set: existingUser }
      );
      return User.create({ ...existingUser, id: existingUser.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> UserRepositoryUpdate - ${err}`);

      throw err;
    }
  }

  async getById(id: string): Promise<User> {
    try {
      const user = await this.userDataSourse.findOneBy({
        _id: getObjectId(id)
      });

      if (!user) {
        throw new CustomError({
          message: "Invalid id",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      return User.create({ ...user, id: user.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> UserRepositoryGet - ${err}`);

      throw err;
    }
  }
}
