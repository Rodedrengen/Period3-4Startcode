import dotenv from 'dotenv';
dotenv.config();
import app from '../app';
import { DbConnector } from '../config/dbConnector';
import { setupFacade } from '../graphql/resolvers';

const debug = require('debug')('www');

const PORT = process.env.PORT || 3333;

(async function connectToDb() {
  const connection = await DbConnector.connect();
  const db = connection.db(process.env.DB_NAME);
  app.set('db', db); //Make the database available to the rest of the application
  app.set('db-type', 'REAL'); //So relevant places can log the database used
  //app.listen(PORT, () => debug(`Server started, listening on PORT: ${PORT}`));
  setupFacade(db);

  app.listen(PORT, () =>
    app.get('logger').log('info', `Server started, listening on PORT: ${PORT}`)
  );
})();
