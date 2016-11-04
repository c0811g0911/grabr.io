export class Logger {

  static TRACE = 0;
  static DEBUG = 1;
  static INFO = 2;
  static WARN = 3;
  static ERROR = 4;
  static OFF = 99;

  _level = Logger.TRACE;
  _channels = [];

  level(level) {
    this._level = level;
    return this;
  }

  /**
   * Creates logging channel that consists of a list of processors.
   *
   * Processor is a function that accepts an object `{level, messages}` and returns a new object
   * with the same structure for consequent processors to work with. If processor returns a promise
   * then logging channel is suspended until this promise is resolved.
   *
   * Instead of a processor function another `Logger` instance can be provided.
   *
   * @param {...Function|Logger} processors
   * @returns {Logger}
   */
  channel(...processors) {
    processors = processors.map(processor => {
      if (processor == this) {
        throw new Error('Cyclic log processor detected');
      }

      if (processor instanceof Logger) {
        // Processor should send data to another logger.
        return record => {
          processor.log(record.level, record.messages);
          return record;
        };
      }

      return processor;
    });

    if (processors.length) {
      this._channels.push(processors);
    }
    return this;
  }

  /**
   * Dispatches messages to pipelines defined for this logger and it child loggers
   * if provided level is sufficient.
   *
   * @param {Number} level Logging level to log messages with.
   * @param {Array} messages Array of messages to sent to pipelines.
   */
  log(level, messages) {
    const promises = [];
    if (level >= this._level) {
      for (const channel of this._channels) {
        let record = {level, messages};

        for (let processor of channel) {
          if (record instanceof Promise) {
            // Enqueue asynchronous processors.
            record = record.then(processor);
          } else {
            record = processor(record);
          }
        }
        if (record instanceof Promise) {
          promises.push(record);
        }
      }
    }
    return Promise.all(promises);
  }

  isTraceEnabled() {
    return this._level >= Logger.TRACE;
  }

  isDebugEnabled() {
    return this._level >= Logger.DEBUG;
  }

  isInfoEnabled() {
    return this._level >= Logger.INFO;
  }

  isWarnEnabled() {
    return this._level >= Logger.WARN;
  }

  isErrorEnabled() {
    return this._level >= Logger.ERROR;
  }

  trace(...messages) {
    return this.log(Logger.TRACE, messages);
  }

  debug(...messages) {
    return this.log(Logger.DEBUG, messages);
  }

  info(...messages) {
    return this.log(Logger.INFO, messages);
  }

  warn(...messages) {
    return this.log(Logger.WARN, messages);
  }

  error(...messages) {
    return this.log(Logger.ERROR, messages);
  }
}



// WEBPACK FOOTER //
// ./src/main/logger/Logger.js