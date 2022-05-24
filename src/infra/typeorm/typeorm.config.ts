import { DataSource } from "typeorm";
import { AppSettings } from "../../settings.ts/app.settings";
import { User } from "./models/user.model";

console.log("AppSettings", AppSettings.DB_USER, AppSettings.DB_PASSWORD);

const AppDataSource = new DataSource({
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

export { AppDataSource };
