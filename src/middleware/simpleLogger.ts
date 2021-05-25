const debug = require('debug')('www');
import moment from 'moment';

const simpleLogger = (req: any, res: any, next: any) => {
  debug(
    moment().format('DD-MM-YYYY:HH:mm:ss') +
      ' - ' +
      req.method +
      ' - ' +
      req.originalUrl +
      ' - ' +
      req.ip
  );
  next();
};

export default simpleLogger;
