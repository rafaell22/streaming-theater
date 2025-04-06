import { readTasks, saveTasks } from './data.js';

export async function getTasks(req, res) {
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
}

export async function updateTaskById(req, res) {
  const body = req.body;
  const id = req.params.id;

  try {
    const tasks = await readTasks();
    const taskIndex = tasks.active.findIndex(t => id === t.id);
    if(taskIndex < 0) {
      res.status = 404;
      res.send();
      return;
    }

    tasks.active[taskIndex] = Object.assign({}, tasks.active[taskIndex], body);
    await saveTasks(tasks);
  } catch(errorUpdatingTask) {
    console.log('Error updating task!');
    console.log(errorUpdatingTask);
    res.status = 500;
    res.send();
    return;
  }

  res.send('OK');
}

export async function addNewTask(req, res) {
  const body = req.body;
   
  try {
    const tasks = await readTasks();
    tasks.active.push(body);
    await saveTasks(tasks);
  } catch(errorAddingTask) {
    console.log('Error adding new task!');
    console.log(errorAddingTask);
    res.status = 500;
    res.send();
    return;
  }

  res.send('OK');
}
