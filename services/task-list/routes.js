import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';

import { addNewTask, getTasks, updateTaskById } from './taskManagement.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function addTaskListRoutes(app) {
   app.use('/task-list', express.static(join(__dirname, '../../public/task-list')));

   app.get('/task-list/tasks', getTasks);

   app.post('/task-list/tasks', addNewTask);

   app.put('/task-list/tasks/:id', updateTaskById);
}
