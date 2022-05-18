import "reflect-metadata";
import morgan from "morgan";
import cors from "cors";
import { Application } from "express";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";

import { AppSettings } from "./settings.ts/app.settings";
import "./controllers/index.conroller";

class App {
  public express: Application;
  constructor() {
    let container = new Container();

    let server = new InversifyExpressServer(container, null, {
      rootPath: "/api/v1"
    });

    server.setConfig((app) => {
      const logger = morgan("combined");
      app.use(logger);
      app.use(cors());
    });

    this.express = server.build();
  }
}

const app = new App().express;

app.listen(AppSettings.PORT, () => {
  console.log(`Started listening at ${AppSettings.PORT}`);
});
