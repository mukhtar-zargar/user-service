import { Container } from "inversify";
import { Logger } from "./infra/logging/pino";
import { TYPES } from "./application/constants/types";
import { AppDataSource } from "./infra/typeorm/typeorm.config";
import { UserRepository } from "./infra/repos/users";

const container = new Container();

container.bind(TYPES.Logger).to(Logger).inSingletonScope();
container.bind(TYPES.UserRepository).to(UserRepository);
container.bind(TYPES.DataSource).to(AppDataSource).inSingletonScope();

export { container };
