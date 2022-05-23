import { inject, injectable } from "inversify";
import { ObjectID } from "typeorm";

import { User as UserModel } from "../../typeorm/models/user.model";
import { User } from "../../../domain/users/user";
import { IUserRepository } from "../../../domain/users/user.repo";
import {
  IUserSignInProps,
  IUserWithTokenProps
} from "../../../domain/users/user.props";

@injectable()
export class UserRepository implements IUserRepository {
  findAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  async signUp(user: User): Promise<User> {
    const check = await UserModel.findOneBy({ email: user.email });
    if (check && check) {
      throw new Error("Exists");
    }
    try {
      // TODO: Implement Password Hash
      const res = await UserModel.save(user);
      return User.create({ ...res, id: res.id.toString() });
    } catch (err) {
      throw new Error("DB Error");
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
      // TODO: Implement Password Hash
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
