import express from "express";
import { Container, ContainerModule } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { errorMiddleware } from "../middleware/error.middleware";
import { TYPES } from "../../application/constants/types";

import "../../application/rest_api/controllers/index.conroller";

export async function bootstrap(
  container: Container,
  port: number,
  ...modules: ContainerModule[]
) {
  if (!container.isBound(TYPES.App)) {
    container.load(...modules);
    // const logger = container.get(TYPES.Logger);
    // logger.info('Bootstrapping the service')

    let server = new InversifyExpressServer(container, null, {
      rootPath: "/api/v1"
    });

    // logger.info("Initializing express server");

    server.setConfig((app) => {
      app.use(express.urlencoded({ extended: true }));
      app.use(express.json());
      app.use(cors());
      app.use(morgan("combined"));
      app.use(helmet());
    });

    server.setErrorConfig((app) => {
      app.use(errorMiddleware);
    });

    try {
      const app = server.build();
      app.listen(port, () => {
        console.log(`Service live at http://localhost:${port}/api/v1`);
        // logger.info(`Service live at http://localhost:${port}/api/v1`);
      });

      container.bind<express.Application>(TYPES.App).toConstantValue(app);
    } catch (error) {
      console.error(error);
    }
  }
  return container.get<express.Application>(TYPES.App);
}
