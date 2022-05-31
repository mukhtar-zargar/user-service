import dotenv from "dotenv";

dotenv.config();

export class AppSettings {
  public static readonly PORT = process.env.PORT || 3000;
  public static readonly DB_TYPE = process.env.DB_TYPE;
  public static readonly DB_NAME = process.env.DB_NAME;
  public static readonly DB_HOST = process.env.DB_HOST;
  public static readonly DB_PORT = process.env.DB_PORT;
  public static readonly DB_USER = process.env.DB_USER;
  public static readonly DB_PASSWORD = process.env.DB_PASSWORD;
  public static readonly DB_AUTHSOURCE = process.env.DB_AUTHSOURCE;
  public static readonly JWT_SECRET = process.env.JWT_SECRET;

  public static readonly KAFKA_BROKER = process.env.KAFKA_BROKER;
  public static readonly KAFKA_SASL_USERNAME = process.env.KAFKA_SASL_USERNAME;
  public static readonly KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD;
}
