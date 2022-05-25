import { inject, injectable } from "inversify";
import { MongoRepository, ObjectID } from "typeorm";

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
  protected userRepository: MongoRepository<UserModel>;

  constructor(
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.DataSource) appDataSource: IAppDataSource
  ) {
    this.logger = logger.get();
    this.userRepository = appDataSource
      .instance()
      .getMongoRepository(UserModel);
  }

  findAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

  async signUp(user: User): Promise<User> {
    try {
      const check = await this.userRepository.findOneBy({ email: user.email });

      if (check) {
        throw new CustomError({
          message: "User already exists",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      user.password = hashIt(user.password);
      let userToSave = this.userRepository.create(user);
      const res = await this.userRepository.save(userToSave);
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
    let existingUser = await this.userRepository.findOneBy({
      _id: getObjectId(user.id)
    });
    this.logger.info(`Check ${JSON.stringify(existingUser)}`);

    try {
      if (!existingUser) {
        throw new CustomError({
          message: "User doesn't exists",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      if (user.password) {
        user.password = hashIt(user.password);
      }
      existingUser = this.userRepository.create({ ...existingUser, ...user });
      await this.userRepository.findOneAndUpdate(
        {
          _id: getObjectId(user.id)
        },
        {$set: existingUser}
      );
      return User.create({ ...existingUser, id: existingUser.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> UserRepositoryUpdate - ${err}`);

      throw err;
    }
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return User.create({ ...user, id: user.id.toString() });
  }
}
