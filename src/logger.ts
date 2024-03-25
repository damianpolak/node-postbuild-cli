import { config } from './config';

export class Logger {
  private constructor() {}
  static justlog(msg: string, ...optionalParams: unknown[]): void {
    console.log(`${config.tag}[${Date.now()}] ${msg}`, ...optionalParams);
  }
}
