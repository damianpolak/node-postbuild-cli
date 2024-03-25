#!/usr/bin/env node

import { Logger } from './logger';
import { registeredTasks } from './tasks';

(async () => {
  Logger.justlog('Start script');

  for await (const task of registeredTasks) {
    await task.task();
  }

  Logger.justlog('Successfully finished');
})();
