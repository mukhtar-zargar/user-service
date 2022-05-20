import { injectable } from "inversify";
import pino from "pino";

@injectable()
export class Logger {
  get(): pino.Logger {
    return pino({
      transport: { target: "pino-pretty" },
      optopns: { colorize: true }
    });
  }
}

export interface ILogger extends pino.Logger {}
