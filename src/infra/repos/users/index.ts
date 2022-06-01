import { inject, injectable } from "inversify";
import { MongoRepository } from "typeorm";
import { v4 } from "uuid";

import { User as UserModel } from "../../typeorm/models/user.model";
import { User } from "../../../domain/users/user";
import { IUserRepository } from "../../../domain/users/user.repo";
import { IUserSignInProps, IUserWithTokenProps } from "../../../domain/users/user.props";
import { hashIt } from "../../encryption";
import { Logger, ILogger } from "../../logging/pino";
import { TYPES } from "../../../application/constants/types";
import { CustomError } from "../../errors/base.error";
import { IAppDataSource } from "../../typeorm/typeorm.config";
import { getObjectId } from "../../typeorm/utils";
import { IDomainProducerMessagingRepository } from "../../../domain/ports/messaging/producer";
import { Topics, UserEvents } from "../../../application/constants/messaging.constants";

@injectable()
export class UserRepository implements IUserRepository {
  protected logger: ILogger;
  protected userDataSource: MongoRepository<UserModel>;

  protected producer: IDomainProducerMessagingRepository;

  constructor(
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.DataSource) appDataSource: IAppDataSource,
    @inject(TYPES.MessagingProducer) producer: () => IDomainProducerMessagingRepository
  ) {
    this.logger = logger.get();
    this.userDataSource = appDataSource.instance().getMongoRepository(UserModel);

    this.producer = producer();
  }

  getAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

  async signUp(user: User): Promise<User> {
    try {
      const check = await this.userDataSource.findOneBy({ email: user.email });

      if (check) {
        throw new CustomError({
          message: "User already exists",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      user.password = hashIt(user.password);
      let userToSave = this.userDataSource.create(user);
      const res = await this.userDataSource.save(userToSave);

      this.producer.publish(
        Topics.UserService,
        {
          partition: 0,
          dateTimeOccurred: new Date(),
          eventId: v4(),
          data: user,
          eventSource: Topics.UserService,
          eventType: UserEvents.Signup
        },
        {
          noAvroEncoding: true,
          nonTransactional: true
        }
      );

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
    let existingUser = await this.userDataSource.findOneBy({
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
      existingUser = this.userDataSource.create({ ...existingUser, ...user });
      await this.userDataSource.findOneAndUpdate(
        {
          _id: getObjectId(user.id)
        },
        { $set: existingUser }
      );

      this.producer.publish(
        Topics.UserService,
        {
          partition: 0,
          dateTimeOccurred: new Date(),
          eventId: v4(),
          data: user,
          eventSource: Topics.UserService,
          eventType: UserEvents.ProfileUpdate
        },
        {
          noAvroEncoding: true,
          nonTransactional: true
        }
      );

      return User.create({ ...existingUser, id: existingUser.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> UserRepositoryUpdate - ${err}`);

      throw err;
    }
  }

  async getById(id: string): Promise<User> {
    try {
      const user = await this.userDataSource.findOneBy({
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
