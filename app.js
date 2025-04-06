import express from 'express';
import helmet from 'helmet';

import addAuthRoutes from './services/auth/routes.js';
import addTaskListRoutes from './services/task-list/routes.js';
import initWebSockets from './services/websockets/index.js';

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'script-src': ['\'self\'', 'localhost', '127.0.0.1', 'cdn.jsdelivr.net'],
      'default-src': ['\'self\'', 'localhost', '127.0.0.1']
    }
  }
}));

app.use(express.json());

addAuthRoutes(app);
addTaskListRoutes(app);

app.use(function errorOnRequest(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function handleErrors(err, req, res, next) {
  res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error = err;

  res.status(err.status || 500);
  res.send();
});

const server = app.listen(8080);
console.log('Listening on port 8080...');

initWebSockets(server);
