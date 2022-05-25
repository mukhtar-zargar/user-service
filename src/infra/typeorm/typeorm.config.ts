import { injectable } from "inversify";
import { DataSource } from "typeorm";
import { AppSettings } from "../../settings.ts/app.settings";
import { User } from "./models/user.model";

// const AppDataSource = new DataSource({
//   type: "mongodb",
//   host: AppSettings.DB_HOST,
//   port: Number(AppSettings.DB_PORT),
//   database: AppSettings.DB_NAME,
//   username: AppSettings.DB_USER,
//   password: AppSettings.DB_PASSWORD,
//   authSource: AppSettings.DB_AUTHSOURCE,
//   entities: [User],
//   synchronize: true
// });

// export { AppDataSource };

@injectable()
export class AppDataSource {
  private appDataSource: DataSource;

  constructor() {
    this.appDataSource = new DataSource({
      type: "mongodb",
      host: AppSettings.DB_HOST,
      port: Number(AppSettings.DB_PORT),
      database: AppSettings.DB_NAME,
      username: AppSettings.DB_USER,
      password: AppSettings.DB_PASSWORD,
      authSource: AppSettings.DB_AUTHSOURCE,
      entities: [User],
      synchronize: true
    });
  }

  public instance(): DataSource {
    if (!this.appDataSource) {
      new AppDataSource();
    }
    return this.appDataSource;
  }
}

export interface IAppDataSource {
  instance(): DataSource;
}
