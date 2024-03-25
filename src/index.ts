#!/usr/bin/env node
import { config } from './config';
import { Logger } from './logger';
import { registeredTasks } from './tasks';

(async () => {
  Logger.justlog('Start script');
  for await (const task of config.tasks) {
    await registeredTasks.find((x) => x.name === task)?.task();
  }
  Logger.justlog('Successfully finished');
})();
