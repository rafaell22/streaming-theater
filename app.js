import express from 'express';
import helmet from 'helmet';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { join, dirname } from 'node:path';
import {readTasks, saveTasks} from './tasks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let wsClientRef;
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

app.use('/task-list', express.static(join(__dirname, 'task-list')));

app.get('/task-list/tasks', async (req, res) => {
  try {
    const tasks = await readTasks();
    res.send(tasks);
    return;
  } catch(errorLoadingTasks) {
    console.log('Error loading tasks file!');
    console.log(errorLoadingTasks);
    res.status = 500;
    res.send();
    return;
  }
});

app.post('/task-list/tasks', async (req, res) => {
  const body = req.body;
   
  try {
    const tasks = await readTasks();
    tasks.active.push(body);
    await saveTasks(tasks);
  } catch(errorLoadingTasks) {
    console.log('Error loading tasks file!');
    console.log(errorLoadingTasks);
    res.status = 500;
    res.send();
    return;
  }

  res.send('OK');
});

app.put('/task-list/tasks/:id', async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  try {
    const tasks = await readTasks();
    const taskIndex = tasks.active.findIndex(t => id === t.id);
    if(taskIndex < 0) {
      res.status = 404;
      res.send();
    }

    tasks.active[taskIndex] = Object.assign({}, tasks.active[taskIndex], body);
    await saveTasks(tasks);
  } catch(errorLoadingTasks) {
    console.log('Error loading tasks file!');
    console.log(errorLoadingTasks);
    res.status = 500;
    res.send();
    return;
  }

  res.send('OK');
});

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

const wss = new WebSocketServer({
  noServer: true,
  path: "/websockets",
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (websocket) => {
    wss.emit('connection', websocket, request);
  });
});

wss.on('connection', (wsClient) => {
  console.log('Websocket connected!')

  wsClientRef = wsClient;

  wsClient.on('message', (message) => {
    console.log('WS message')
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
  });

  wsClient.on('error', (e) => { 
    console.log('WS connection error');
    console.log(e);
  });

  wsClient.on('close', () => {
    console.log('WS connection closed');
    wsClientRef = null;
  });
});
