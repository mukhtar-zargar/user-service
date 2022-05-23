import { User } from "./user";
import { IUserSignInProps, IUserWithTokenProps } from "./user.props";

export interface IUserRepository {
  getById(id: string): Promise<User>;
  findAll(): Promise<User[]>;
  signUp(user: User): Promise<User>;
  signIn(signInInfo: IUserSignInProps): Promise<IUserWithTokenProps>;
  update(user: User): Promise<User>;
}
