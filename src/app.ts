import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import friendRoutes from './routes/friendRoutesAuth';
import cors from 'cors';
import simpleLogger from './middleware/simpleLogger';
import logger, { stream } from './middleware/logger';
import { ApiError } from './errors/errors';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/schema';
import authMiddleware from './middleware/basic-auth';
import fetch from 'node-fetch';

const app = express();

//app.use(simpleLogger);
app.set('logger', logger);

const morganFormat = process.env.NODE_ENV == 'production' ? 'combined' : 'dev';
app.use(require('morgan')(morganFormat, { stream }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/api/friends', friendRoutes);

app.get('/demo', (req, res) => {
  res.send('Server is up');
});

app.get('/whattodo', async (req, res) => {
  const whatToDo = await fetch(
    'https://www.boredapi.com/api/activity'
  ).then((r) => r.json());
  res.json(whatToDo);
});

app.use('/graphql', (req, res, next) => {
  const body = req.body;
  if (body && body.query && body.query.includes('createFriend')) {
    return next();
  }
  if (body && body.operationName && body.query.includes('IntrospectionQuery')) {
    return next();
  }
  if (body.query && (body.mutation || body.query)) {
    return authMiddleware(req, res, next);
  }
  next();
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.use('/api', (req, res, next) => {
  res.status(404).json({ errorCode: 404, msg: "Sorry can't find that!" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    res
      .status(err.errorCode)
      .json({ errorCode: err.errorCode, msg: err.message });
  } else {
    next(err);
  }
});
export default app;
