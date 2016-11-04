import {Logger} from './Logger';

export function writeToConsole({level, messages}) {
  switch (level) {

    case Logger.TRACE:
    case Logger.DEBUG:
      if ('debug' in console) {
        console.debug(...messages);
      } else {
        console.log(...messages);
      }
      break;

    case Logger.INFO:
      console.log(...messages);
      break;

    case Logger.WARN:
      if ('warn' in console) {
        console.warn(...messages);
      } else {
        console.log(...messages);
      }
      break;

    case Logger.ERROR:
      console.error(...messages);
      break;
  }
  return {level, messages};
}



// WEBPACK FOOTER //
// ./src/main/logger/writeToConsole.js