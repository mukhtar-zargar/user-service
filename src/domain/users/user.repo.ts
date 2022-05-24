import { User } from "./user";
import {
  IUserProps,
  IUserSignInProps,
  IUserWithTokenProps
} from "./user.props";

export interface IUserRepository {
  getById(id: string): Promise<User>;
  findAll(): Promise<User[]>;
  signUp(user: IUserProps): Promise<User>;
  signIn(signInInfo: IUserSignInProps): Promise<IUserWithTokenProps>;
  update(user: User): Promise<User>;
}
