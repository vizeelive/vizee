const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'vizee-api' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// // https://stackoverflow.com/questions/13410754/i-want-to-display-the-file-name-in-the-log-statement
// // Return the last folder name in the path and the calling
// // module's filename.
// const getLabel = function (callingModule) {
//   const parts = callingModule.filename.split(path.sep);
//   return path.join(parts[parts.length - 2], parts.pop());
// };

logger.add(
  new winston.transports.Console({
    // label: getLabel(callingModule),
    format: winston.format.simple()
  })
);

module.exports = logger;
