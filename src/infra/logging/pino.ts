import { injectable } from "inversify";
import pino from "pino";

@injectable()
export class Logger {
  get(): pino.Logger {
    return pino({ prettyPrint: { colorize: true } });
  }
}

interface ITest {
  (arg1: number): string;
  (arg1: number, arg2: number): string;
}

let a: ITest;
