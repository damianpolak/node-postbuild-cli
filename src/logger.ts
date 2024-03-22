import { tag } from '.';

export class Logger {
  private constructor() {}
  static justlog(msg: string, ...optionalParams: unknown[]): void {
    console.log(`${tag}[${Date.now()}] ${msg}`, ...optionalParams);
  }
}
